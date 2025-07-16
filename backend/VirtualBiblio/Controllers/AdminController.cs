using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VirtualBiblio.Data;
using VirtualBiblio.Data.Models;
using System.Security.Claims;

namespace VirtualBiblio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/admin/dashboard - Dashboard principal
        [HttpGet("dashboard")]
        public async Task<ActionResult<DashboardResponse>> GetDashboard()
        {
            try
            {
                Console.WriteLine("AdminController: Dashboard endpoint called");
                // Estadísticas de libros
                var totalBooks = await _context.Books.Where(b => b.IsActive).CountAsync();
                var booksByCategory = await _context.Books
                    .Where(b => b.IsActive)
                    .GroupBy(b => b.Category)
                    .Select(g => new { Category = g.Key, Count = g.Count() })
                    .ToListAsync();

                // Estadísticas de usuarios
                var totalUsers = await _context.Users.Where(u => u.Activo).CountAsync();
                var usersByRole = await _context.Users
                    .Where(u => u.Activo)
                    .GroupBy(u => u.Rol)
                    .Select(g => new { Role = g.Key, Count = g.Count() })
                    .ToListAsync();

                // Usuarios nuevos del mes
                var currentMonth = DateTime.UtcNow.Month;
                var currentYear = DateTime.UtcNow.Year;
                var newUsersThisMonth = await _context.Users
                    .Where(u => u.Activo && u.FechaCreacion.Month == currentMonth && u.FechaCreacion.Year == currentYear)
                    .CountAsync();

                // Libros más populares (por rating)
                var popularBooks = await _context.Books
                    .Where(b => b.IsActive)
                    .OrderByDescending(b => b.Rating)
                    .ThenByDescending(b => b.ReviewCount)
                    .Take(5)
                    .Select(b => new { b.Title, b.Rating, b.ReviewCount })
                    .ToListAsync();

                // Donaciones
                var totalDonations = await _context.Donations.Where(d => d.IsActive).CountAsync();
                var totalDonationAmount = await _context.Donations
                    .Where(d => d.IsActive && d.Status == "Completada")
                    .SumAsync(d => d.Amount);

                // Donaciones por libro
                var donationsByBook = await _context.Donations
                    .Where(d => d.IsActive && d.BookId != null)
                    .GroupBy(d => d.BookId)
                    .Select(g => new { 
                        BookId = g.Key, 
                        Count = g.Count(), 
                        TotalAmount = g.Sum(d => d.Amount) 
                    })
                    .OrderByDescending(x => x.TotalAmount)
                    .Take(5)
                    .ToListAsync();

                var response = new DashboardResponse
                {
                    TotalBooks = totalBooks,
                    TotalUsers = totalUsers,
                    NewUsersThisMonth = newUsersThisMonth,
                    TotalDonations = totalDonations,
                    TotalDonationAmount = totalDonationAmount,
                    BooksByCategory = booksByCategory.Cast<object>().ToList(),
                    UsersByRole = usersByRole.Cast<object>().ToList(),
                    PopularBooks = popularBooks.Cast<object>().ToList(),
                    DonationsByBook = donationsByBook.Cast<object>().ToList()
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // GET: api/admin/users - Lista de usuarios
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<UserResponse>>> GetUsers(
            [FromQuery] string? role = null,
            [FromQuery] string? search = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var query = _context.Users.Where(u => u.Activo);

                if (!string.IsNullOrEmpty(role))
                    query = query.Where(u => u.Rol == role);

                if (!string.IsNullOrEmpty(search))
                    query = query.Where(u => u.Nombre.Contains(search) || u.Email.Contains(search));

                var totalCount = await query.CountAsync();
                var users = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .OrderByDescending(u => u.FechaCreacion)
                    .ToListAsync();

                var response = users.Select(u => new UserResponse
                {
                    Id = u.Id,
                    Nombre = u.Nombre,
                    Email = u.Email,
                    Rol = u.Rol,
                    IsActive = u.Activo,
                    CreatedAt = u.FechaCreacion,
                    LastLoginAt = null // No tenemos esta propiedad en el modelo User
                });

                Response.Headers["X-Total-Count"] = totalCount.ToString();
                Response.Headers["X-Page"] = page.ToString();
                Response.Headers["X-PageSize"] = pageSize.ToString();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // PUT: api/admin/users/{id}/role - Cambiar rol de usuario
        [HttpPut("users/{id}/role")]
        public async Task<IActionResult> UpdateUserRole(int id, [FromBody] UpdateRoleRequest request)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                    return NotFound("Usuario no encontrado");

                user.Rol = request.Rol;
                // No tenemos UpdatedAt en el modelo User, pero podemos agregarlo si es necesario

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // Modelos de respuesta
        public class DashboardResponse
        {
            public int TotalBooks { get; set; }
            public int TotalUsers { get; set; }
            public int NewUsersThisMonth { get; set; }
            public int TotalDonations { get; set; }
            public decimal TotalDonationAmount { get; set; }
            public List<object> BooksByCategory { get; set; } = new List<object>();
            public List<object> UsersByRole { get; set; } = new List<object>();
            public List<object> PopularBooks { get; set; } = new List<object>();
            public List<object> DonationsByBook { get; set; } = new List<object>();
        }

        public class UserResponse
        {
            public int Id { get; set; }
            public string Nombre { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Rol { get; set; } = string.Empty;
            public bool IsActive { get; set; }
            public DateTime CreatedAt { get; set; }
            public DateTime? LastLoginAt { get; set; }
        }

        public class UpdateRoleRequest
        {
            public string Rol { get; set; } = string.Empty;
        }
    }
} 