using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VirtualBiblio.Data.Models
{
    public class Book
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "El SKU es obligatorio")]
        [StringLength(20, MinimumLength = 3)]
        public required string SKU { get; set; }

        [Required(ErrorMessage = "El título es obligatorio")]
        [StringLength(200, MinimumLength = 2)]
        public required string Title { get; set; }

        [Required(ErrorMessage = "El autor es obligatorio")]
        public int AuthorId { get; set; }

        [ForeignKey("AuthorId")]
        public virtual Author Author { get; set; } = null!;

        [Required(ErrorMessage = "La editorial es obligatoria")]
        [StringLength(100, MinimumLength = 2)]
        public required string Publisher { get; set; }

        [Required(ErrorMessage = "La categoría es obligatoria")]
        [StringLength(50)]
        public required string Category { get; set; }

        [Required(ErrorMessage = "La cantidad es obligatoria")]
        [Range(0, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor o igual a 0")]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "El formato es obligatorio")]
        [StringLength(20)]
        public required string Format { get; set; } // audiolibro, impreso, digital, etc.

        [Required(ErrorMessage = "La edición es obligatoria")]
        [StringLength(20)]
        public required string Edition { get; set; }

        [Required(ErrorMessage = "El idioma es obligatorio")]
        [StringLength(20)]
        public required string Language { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "El número de páginas debe ser mayor a 0")]
        public int? Pages { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "El número de capítulos debe ser mayor a 0")]
        public int? Chapters { get; set; }

        [Required(ErrorMessage = "La descripción es obligatoria")]
        [StringLength(1000, MinimumLength = 10)]
        public required string Description { get; set; }

        [StringLength(100)]
        public string? Dimensions { get; set; } // medidas físicas

        [StringLength(20)]
        public string? Weight { get; set; } // peso en gramos

        [StringLength(500)]
        public string? CoverImageUrl { get; set; }

        [StringLength(500)]
        public string? BookFileUrl { get; set; } // URL del archivo del libro (PDF, etc.)

        [StringLength(500)]
        public string? AudioFileUrl { get; set; } // URL del archivo de audio

        [Range(0, 5, ErrorMessage = "La calificación debe estar entre 0 y 5")]
        public decimal Rating { get; set; } = 0;

        [Range(0, int.MaxValue)]
        public int ReviewCount { get; set; } = 0;

        [Required]
        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Propiedades de navegación para relaciones
        public virtual ICollection<BookCategory> BookCategories { get; set; } = new List<BookCategory>();
    }

    // Tabla intermedia para categorías múltiples
    public class BookCategory
    {
        public int BookId { get; set; }
        public Book Book { get; set; } = null!;
        
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
    }

    // Modelo para categorías
    public class Category
    {
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public required string Name { get; set; }

        [StringLength(200)]
        public string? Description { get; set; }

        [StringLength(50)]
        public string? Color { get; set; } // Color para UI

        public bool IsActive { get; set; } = true;

        public virtual ICollection<BookCategory> BookCategories { get; set; } = new List<BookCategory>();
    }
} 