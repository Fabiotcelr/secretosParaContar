using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VirtualBiblio.Data;
using VirtualBiblio.Data.Models;

namespace VirtualBiblio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DonationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DonationController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/donation - Obtener donaciones (solo admin)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DonationResponse>>> GetDonations(
            [FromQuery] string? status = null,
            [FromQuery] int? bookId = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var query = _context.Donations
                .Include(d => d.Book)
                .Where(d => d.IsActive);

            if (!string.IsNullOrEmpty(status))
                query = query.Where(d => d.Status == status);

            if (bookId.HasValue)
                query = query.Where(d => d.BookId == bookId);

            var totalCount = await query.CountAsync();
            var donations = await query
                .OrderByDescending(d => d.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var response = donations.Select(d => new DonationResponse
            {
                Id = d.Id,
                DonorName = d.IsAnonymous ? "Anónimo" : d.DonorName,
                DonorEmail = d.DonorEmail,
                Comment = d.Comment,
                Amount = d.Amount,
                Currency = d.Currency,
                PaymentMethod = d.PaymentMethod,
                IsAnonymous = d.IsAnonymous,
                Status = d.Status,
                CreatedAt = d.CreatedAt,
                CompletedAt = d.CompletedAt,
                BookTitle = d.Book?.Title ?? string.Empty
            });

            Response.Headers["X-Total-Count"] = totalCount.ToString();
            Response.Headers["X-Page"] = page.ToString();
            Response.Headers["X-PageSize"] = pageSize.ToString();

            return Ok(response);
        }

        // POST: api/donation - Crear nueva donación (público)
        [HttpPost]
        public async Task<ActionResult<DonationResponse>> CreateDonation([FromBody] CreateDonationRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                return BadRequest($"Errores de validación: {string.Join(", ", errors)}");
            }

            // Verificar que el libro existe si se especifica
            if (request.BookId.HasValue)
            {
                var book = await _context.Books.FindAsync(request.BookId.Value);
                if (book == null)
                    return BadRequest("El libro especificado no existe");
            }

            var donation = new Donation
            {
                DonorName = request.DonorName,
                DonorEmail = request.DonorEmail,
                Comment = request.Comment,
                Amount = request.Amount,
                Currency = request.Currency ?? "COP",
                PaymentMethod = request.PaymentMethod,
                IsAnonymous = request.IsAnonymous,
                BookId = request.BookId
            };

            _context.Donations.Add(donation);
            await _context.SaveChangesAsync();

            var response = new DonationResponse
            {
                Id = donation.Id,
                DonorName = donation.IsAnonymous ? "Anónimo" : donation.DonorName,
                DonorEmail = donation.DonorEmail,
                Comment = donation.Comment,
                Amount = donation.Amount,
                Currency = donation.Currency,
                PaymentMethod = donation.PaymentMethod,
                IsAnonymous = donation.IsAnonymous,
                Status = donation.Status,
                CreatedAt = donation.CreatedAt,
                CompletedAt = donation.CompletedAt
            };

            return CreatedAtAction(nameof(GetDonation), new { id = donation.Id }, response);
        }

        // GET: api/donation/{id} - Obtener donación por ID
        [HttpGet("{id}")]
        public async Task<ActionResult<DonationResponse>> GetDonation(int id)
        {
            var donation = await _context.Donations
                .Include(d => d.Book)
                .FirstOrDefaultAsync(d => d.Id == id && d.IsActive);

            if (donation == null)
                return NotFound("Donación no encontrada");

            var response = new DonationResponse
            {
                Id = donation.Id,
                DonorName = donation.IsAnonymous ? "Anónimo" : donation.DonorName,
                DonorEmail = donation.DonorEmail,
                Comment = donation.Comment,
                Amount = donation.Amount,
                Currency = donation.Currency,
                PaymentMethod = donation.PaymentMethod,
                IsAnonymous = donation.IsAnonymous,
                Status = donation.Status,
                CreatedAt = donation.CreatedAt,
                CompletedAt = donation.CompletedAt,
                BookTitle = donation.Book?.Title ?? string.Empty
            };

            return Ok(response);
        }

        // PUT: api/donation/{id}/status - Actualizar estado de donación (solo admin)
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateDonationStatus(int id, [FromBody] UpdateStatusRequest request)
        {
            var donation = await _context.Donations.FindAsync(id);
            if (donation == null)
                return NotFound("Donación no encontrada");

            donation.Status = request.Status;
            
            if (request.Status == "Completada" && !donation.CompletedAt.HasValue)
                donation.CompletedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/donation/stats - Estadísticas de donaciones (solo admin)
        [HttpGet("stats")]
        public async Task<ActionResult<DonationStatsResponse>> GetDonationStats()
        {
            var totalDonations = await _context.Donations.Where(d => d.IsActive).CountAsync();
            var completedDonations = await _context.Donations.Where(d => d.IsActive && d.Status == "Completada").CountAsync();
            var totalAmount = await _context.Donations.Where(d => d.IsActive && d.Status == "Completada").SumAsync(d => d.Amount);
            var pendingAmount = await _context.Donations.Where(d => d.IsActive && d.Status == "Pendiente").SumAsync(d => d.Amount);

            var donationsByMonth = await _context.Donations
                .Where(d => d.IsActive && d.Status == "Completada")
                .GroupBy(d => new { d.CreatedAt.Year, d.CreatedAt.Month })
                .Select(g => new { 
                    Month = $"{g.Key.Year}-{g.Key.Month:D2}", 
                    Count = g.Count(), 
                    Amount = g.Sum(d => d.Amount) 
                })
                .OrderByDescending(x => x.Month)
                .Take(12)
                .ToListAsync();

            var response = new DonationStatsResponse
            {
                TotalDonations = totalDonations,
                CompletedDonations = completedDonations,
                TotalAmount = totalAmount,
                PendingAmount = pendingAmount,
                DonationsByMonth = donationsByMonth.Cast<object>().ToList()
            };

            return Ok(response);
        }

        // Modelos de request/response
        public class DonationResponse
        {
            public int Id { get; set; }
            public string DonorName { get; set; } = string.Empty;
            public string DonorEmail { get; set; } = string.Empty;
            public string? Comment { get; set; }
            public decimal Amount { get; set; }
            public string Currency { get; set; } = string.Empty;
            public string? PaymentMethod { get; set; }
            public bool IsAnonymous { get; set; }
            public string Status { get; set; } = string.Empty;
            public DateTime CreatedAt { get; set; }
            public DateTime? CompletedAt { get; set; }
            public string? BookTitle { get; set; }
        }

        public class CreateDonationRequest
        {
            public string DonorName { get; set; } = string.Empty;
            public string DonorEmail { get; set; } = string.Empty;
            public string? Comment { get; set; }
            public decimal Amount { get; set; }
            public string? Currency { get; set; }
            public string? PaymentMethod { get; set; }
            public bool IsAnonymous { get; set; } = false;
            public int? BookId { get; set; }
        }

        public class UpdateStatusRequest
        {
            public string Status { get; set; } = string.Empty;
        }

        public class DonationStatsResponse
        {
            public int TotalDonations { get; set; }
            public int CompletedDonations { get; set; }
            public decimal TotalAmount { get; set; }
            public decimal PendingAmount { get; set; }
            public List<object> DonationsByMonth { get; set; } = new List<object>();
        }
    }
} 