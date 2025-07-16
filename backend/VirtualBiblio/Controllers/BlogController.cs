using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VirtualBiblio.Data;
using VirtualBiblio.Data.Models;

namespace VirtualBiblio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BlogController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/blog - Obtener todos los blogs (públicos)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlogResponse>>> GetBlogs(
            [FromQuery] string? category = null,
            [FromQuery] string? search = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = _context.Blogs.Where(b => b.IsActive && b.IsPublished);

            if (!string.IsNullOrEmpty(category))
                query = query.Where(b => b.Category == category);

            if (!string.IsNullOrEmpty(search))
                query = query.Where(b => b.Title.Contains(search) || b.Content.Contains(search));

            var totalCount = await query.CountAsync();
            var blogs = await query
                .OrderByDescending(b => b.PublishedAt ?? b.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var response = blogs.Select(b => new BlogResponse
            {
                Id = b.Id,
                Title = b.Title,
                Subtitle = b.Subtitle,
                Content = b.Content,
                CoverImageUrl = b.CoverImageUrl,
                Author = b.Author,
                Category = b.Category,
                ViewCount = b.ViewCount,
                LikeCount = b.LikeCount,
                CreatedAt = b.CreatedAt,
                PublishedAt = b.PublishedAt
            });

            Response.Headers["X-Total-Count"] = totalCount.ToString();
            Response.Headers["X-Page"] = page.ToString();
            Response.Headers["X-PageSize"] = pageSize.ToString();

            return Ok(response);
        }

        // GET: api/blog/{id} - Obtener blog por ID
        [HttpGet("{id}")]
        public async Task<ActionResult<BlogResponse>> GetBlog(int id)
        {
            var blog = await _context.Blogs.FirstOrDefaultAsync(b => b.Id == id && b.IsActive);

            if (blog == null)
                return NotFound("Blog no encontrado");

            // Incrementar contador de vistas
            blog.ViewCount++;
            await _context.SaveChangesAsync();

            var response = new BlogResponse
            {
                Id = blog.Id,
                Title = blog.Title,
                Subtitle = blog.Subtitle,
                Content = blog.Content,
                CoverImageUrl = blog.CoverImageUrl,
                Author = blog.Author,
                Category = blog.Category,
                ViewCount = blog.ViewCount,
                LikeCount = blog.LikeCount,
                CreatedAt = blog.CreatedAt,
                PublishedAt = blog.PublishedAt
            };

            return Ok(response);
        }

        // POST: api/blog - Crear nuevo blog (solo admin)
        [HttpPost]
        public async Task<ActionResult<BlogResponse>> CreateBlog([FromBody] CreateBlogRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                return BadRequest($"Errores de validación: {string.Join(", ", errors)}");
            }

            var blog = new Blog
            {
                Title = request.Title,
                Subtitle = request.Subtitle,
                Content = request.Content,
                CoverImageUrl = request.CoverImageUrl,
                Author = request.Author,
                Category = request.Category,
                IsPublished = request.IsPublished
            };

            if (blog.IsPublished)
                blog.PublishedAt = DateTime.UtcNow;

            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();

            var response = new BlogResponse
            {
                Id = blog.Id,
                Title = blog.Title,
                Subtitle = blog.Subtitle,
                Content = blog.Content,
                CoverImageUrl = blog.CoverImageUrl,
                Author = blog.Author,
                Category = blog.Category,
                ViewCount = blog.ViewCount,
                LikeCount = blog.LikeCount,
                CreatedAt = blog.CreatedAt,
                PublishedAt = blog.PublishedAt
            };

            return CreatedAtAction(nameof(GetBlog), new { id = blog.Id }, response);
        }

        // PUT: api/blog/{id} - Actualizar blog (solo admin)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBlog(int id, [FromBody] UpdateBlogRequest request)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null)
                return NotFound("Blog no encontrado");

            if (!string.IsNullOrEmpty(request.Title))
                blog.Title = request.Title;

            if (request.Subtitle != null)
                blog.Subtitle = request.Subtitle;

            if (!string.IsNullOrEmpty(request.Content))
                blog.Content = request.Content;

            if (request.CoverImageUrl != null)
                blog.CoverImageUrl = request.CoverImageUrl;

            if (!string.IsNullOrEmpty(request.Author))
                blog.Author = request.Author;

            if (!string.IsNullOrEmpty(request.Category))
                blog.Category = request.Category;

            if (request.IsPublished.HasValue)
            {
                blog.IsPublished = request.IsPublished.Value;
                if (blog.IsPublished && !blog.PublishedAt.HasValue)
                    blog.PublishedAt = DateTime.UtcNow;
            }

            blog.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/blog/{id} - Eliminar blog (solo admin)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null)
                return NotFound("Blog no encontrado");

            blog.IsActive = false;
            blog.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/blog/categories - Obtener categorías de blogs
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetCategories()
        {
            var categories = await _context.Blogs
                .Where(b => b.IsActive && b.IsPublished && !string.IsNullOrEmpty(b.Category))
                .Select(b => b.Category!)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();

            return Ok(categories);
        }

        // Modelos de request/response
        public class BlogResponse
        {
            public int Id { get; set; }
            public string Title { get; set; } = string.Empty;
            public string? Subtitle { get; set; }
            public string Content { get; set; } = string.Empty;
            public string? CoverImageUrl { get; set; }
            public string? Author { get; set; }
            public string? Category { get; set; }
            public int ViewCount { get; set; }
            public int LikeCount { get; set; }
            public DateTime CreatedAt { get; set; }
            public DateTime? PublishedAt { get; set; }
        }

        public class CreateBlogRequest
        {
            public string Title { get; set; } = string.Empty;
            public string? Subtitle { get; set; }
            public string Content { get; set; } = string.Empty;
            public string? CoverImageUrl { get; set; }
            public string? Author { get; set; }
            public string? Category { get; set; }
            public bool IsPublished { get; set; } = false;
        }

        public class UpdateBlogRequest
        {
            public string? Title { get; set; }
            public string? Subtitle { get; set; }
            public string? Content { get; set; }
            public string? CoverImageUrl { get; set; }
            public string? Author { get; set; }
            public string? Category { get; set; }
            public bool? IsPublished { get; set; }
        }
    }
} 