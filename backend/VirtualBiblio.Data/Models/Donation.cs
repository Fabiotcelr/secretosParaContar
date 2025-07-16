using System.ComponentModel.DataAnnotations;

namespace VirtualBiblio.Data.Models
{
    public class Donation
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "El nombre del donante es obligatorio")]
        [StringLength(100)]
        public required string DonorName { get; set; }

        [Required(ErrorMessage = "El email es obligatorio")]
        [EmailAddress]
        [StringLength(100)]
        public required string DonorEmail { get; set; }

        [StringLength(500)]
        public string? Comment { get; set; }

        [Required(ErrorMessage = "El monto es obligatorio")]
        [Range(1, 1000000, ErrorMessage = "El monto debe estar entre 1 y 1,000,000")]
        public decimal Amount { get; set; }

        [StringLength(50)]
        public string? Currency { get; set; } = "COP";

        [StringLength(50)]
        public string? PaymentMethod { get; set; }

        public bool IsAnonymous { get; set; } = false;

        public string Status { get; set; } = "Pendiente"; // Pendiente, Completada, Cancelada

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? CompletedAt { get; set; }

        public bool IsActive { get; set; } = true;

        // Relación opcional con libro específico
        public int? BookId { get; set; }
        public virtual Book? Book { get; set; }
    }
} 