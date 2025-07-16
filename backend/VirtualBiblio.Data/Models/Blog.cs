using System.ComponentModel.DataAnnotations;

namespace VirtualBiblio.Data.Models
{
    public class Blog
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "El título es obligatorio")]
        [StringLength(200, MinimumLength = 5)]
        public required string Title { get; set; }

        [StringLength(500)]
        public string? Subtitle { get; set; }

        [Required(ErrorMessage = "El contenido es obligatorio")]
        public required string Content { get; set; }

        [StringLength(500)]
        public string? CoverImageUrl { get; set; }

        [StringLength(100)]
        public string? Author { get; set; }

        [StringLength(50)]
        public string? Category { get; set; }

        public bool IsPublished { get; set; } = false;

        public int ViewCount { get; set; } = 0;

        public int LikeCount { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? PublishedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public bool IsActive { get; set; } = true;
    }
} 