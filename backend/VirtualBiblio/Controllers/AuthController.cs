using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using VirtualBiblio.Data;
using VirtualBiblio.Data.Models;
using BCrypt.Net;

namespace VirtualBiblio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // 1. Registro de usuario
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest("El email ya está registrado.");

            var user = new User
            {
                Nombre = request.Nombre,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                AvatarUrl = request.AvatarUrl ?? "",
                Rol = string.IsNullOrEmpty(request.Rol) ? "user" : request.Rol
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Usuario registrado correctamente." });
        }

        // 2. Login de usuario
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return Unauthorized("Email o contraseña incorrectos.");

            Console.WriteLine($"AuthController: User logged in - Email: {user.Email}, Role: {user.Rol}");
            
            var token = GenerateJwtToken(user);
            return Ok(new { token, user = new { user.Id, user.Nombre, user.Email, user.AvatarUrl, user.Rol } });
        }

        // 3. Obtener perfil del usuario autenticado
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();
            return Ok(new { user.Id, user.Nombre, user.Email, user.AvatarUrl, user.Rol });
        }

        // 4. Cambiar avatar
        [Authorize]
        [HttpPut("avatar")]
        public async Task<IActionResult> UpdateAvatar([FromBody] UpdateAvatarRequest request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();
            user.AvatarUrl = request.AvatarUrl;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Avatar actualizado.", user.AvatarUrl });
        }

        // 5. Cambiar rol (solo admin)
        [Authorize(Roles = "admin")]
        [HttpPut("role")]
        public async Task<IActionResult> UpdateRole([FromBody] UpdateRoleRequest request)
        {
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null) return NotFound();
            user.Rol = request.Rol;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Rol actualizado.", user.Id, user.Rol });
        }

        // 6. Actualizar perfil del usuario
        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            user.Nombre = request.Nombre;
            user.AvatarUrl = request.AvatarUrl ?? user.AvatarUrl;
            
            await _context.SaveChangesAsync();
            return Ok(new { message = "Perfil actualizado.", user = new { user.Id, user.Nombre, user.Email, user.AvatarUrl, user.Rol } });
        }

        // 7. Cambiar contraseña
        [Authorize]
        [HttpPut("password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            // Verificar contraseña actual
            if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
                return BadRequest("La contraseña actual es incorrecta.");

            // Verificar que la nueva contraseña sea diferente
            if (request.CurrentPassword == request.NewPassword)
                return BadRequest("La nueva contraseña debe ser diferente a la actual.");

            // Actualizar contraseña
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Contraseña actualizada correctamente." });
        }

        // 8. Eliminar cuenta (desactivar)
        [Authorize]
        [HttpDelete("account")]
        public async Task<IActionResult> DeleteAccount()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            user.Activo = false; // Desactivar en lugar de eliminar
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Cuenta desactivada correctamente." });
        }

        // Método privado para generar JWT
        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Nombre),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Rol)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Modelos de request internos
        public class RegisterRequest
        {
            public string Nombre { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string? AvatarUrl { get; set; }
            public string? Rol { get; set; }
        }
        public class LoginRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }
        public class UpdateAvatarRequest
        {
            public string AvatarUrl { get; set; }
        }
        public class UpdateRoleRequest
        {
            public int UserId { get; set; }
            public string Rol { get; set; }
        }
        public class UpdateProfileRequest
        {
            public string Nombre { get; set; }
            public string? AvatarUrl { get; set; }
        }
        public class ChangePasswordRequest
        {
            public string CurrentPassword { get; set; }
            public string NewPassword { get; set; }
        }
    }
}
