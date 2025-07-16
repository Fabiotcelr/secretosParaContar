namespace VirtualBiblio.Data.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string AvatarUrl { get; set; }
        public string Rol { get; set; }
        public bool Activo { get; set; } = true;
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    }
}