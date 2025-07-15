using System.ComponentModel.DataAnnotations;

namespace VirtualBiblio.Data.Models
{
    public class Author
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "El nombre es obligatorio")]
        [StringLength(100, MinimumLength = 2)]
        public required string FirstName { get; set; }

        [Required(ErrorMessage = "El apellido es obligatorio")]
        [StringLength(100, MinimumLength = 2)]
        public required string LastName { get; set; }

        [StringLength(50)]
        public required string Gender { get; set; }

        [Range(1000, 2025, ErrorMessage = "El año de nacimiento debe estar entre 1000 y 2025")]
        public int? BirthYear { get; set; }

        [StringLength(100)]
        public required string Nationality { get; set; }

        [StringLength(50)]
        public required string Language { get; set; }

        [Required]
        public bool IsAlive { get; set; } = true; // Estado: vivo o fallecido
    }
}