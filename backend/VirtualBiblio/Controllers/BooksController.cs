using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VirtualBiblio.Data;
using VirtualBiblio.Data.Models;

namespace VirtualBiblio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BooksController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/books - Obtener todos los libros con filtros
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookResponse>>> GetBooks(
            [FromQuery] string? category = null,
            [FromQuery] string? format = null,
            [FromQuery] string? language = null,
            [FromQuery] string? search = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 12)
        {
            Console.WriteLine("GET /api/books - Iniciando consulta");
            
            try
            {
                var query = _context.Books
                    .Include(b => b.Author)
                    .Where(b => b.IsActive);

                // Aplicar filtros
            if (!string.IsNullOrEmpty(category))
                query = query.Where(b => b.Category == category);

            if (!string.IsNullOrEmpty(format))
                query = query.Where(b => b.Format == format);

            if (!string.IsNullOrEmpty(language))
                query = query.Where(b => b.Language == language);

            if (!string.IsNullOrEmpty(search))
                query = query.Where(b => b.Title.Contains(search) || b.Author.FirstName.Contains(search) || b.Author.LastName.Contains(search));

            // Paginación
            var totalCount = await query.CountAsync();
            
            var books = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var response = books.Select(b => new BookResponse
            {
                Id = b.Id,
                SKU = b.SKU,
                Title = b.Title,
                Author = $"{b.Author.FirstName} {b.Author.LastName}",
                Publisher = b.Publisher,
                Category = b.Category,
                Quantity = b.Quantity,
                Format = b.Format,
                Edition = b.Edition,
                Language = b.Language,
                Pages = b.Pages,
                Chapters = b.Chapters,
                Description = b.Description,
                Dimensions = b.Dimensions,
                Weight = b.Weight,
                CoverImageUrl = b.CoverImageUrl,
                Rating = b.Rating,
                ReviewCount = b.ReviewCount,
                CreatedAt = b.CreatedAt
            });

            Response.Headers["X-Total-Count"] = totalCount.ToString();
            Response.Headers["X-Page"] = page.ToString();
            Response.Headers["X-PageSize"] = pageSize.ToString();
            return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en GET /api/books: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // GET: api/books/{id} - Obtener libro por ID
        [HttpGet("{id}")]
        public async Task<ActionResult<BookResponse>> GetBook(int id)
        {
            var book = await _context.Books
                .Include(b => b.Author)
                .Include(b => b.BookCategories)
                .ThenInclude(bc => bc.Category)
                .FirstOrDefaultAsync(b => b.Id == id && b.IsActive);

            if (book == null)
                return NotFound("Libro no encontrado");

            var response = new BookResponse
            {
                Id = book.Id,
                SKU = book.SKU,
                Title = book.Title,
                Author = $"{book.Author.FirstName} {book.Author.LastName}",
                Publisher = book.Publisher,
                Category = book.Category,
                Quantity = book.Quantity,
                Format = book.Format,
                Edition = book.Edition,
                Language = book.Language,
                Pages = book.Pages,
                Chapters = book.Chapters,
                Description = book.Description,
                Dimensions = book.Dimensions,
                Weight = book.Weight,
                CoverImageUrl = book.CoverImageUrl,
                BookFileUrl = book.BookFileUrl,
                AudioFileUrl = book.AudioFileUrl,
                Rating = book.Rating,
                ReviewCount = book.ReviewCount,
                CreatedAt = book.CreatedAt
            };

            return Ok(response);
        }

        // GET: api/books/sku/{sku} - Obtener libro por SKU
        [HttpGet("sku/{sku}")]
        public async Task<ActionResult<BookResponse>> GetBookBySku(string sku)
        {
            var book = await _context.Books
                .Include(b => b.Author)
                .Include(b => b.BookCategories)
                .ThenInclude(bc => bc.Category)
                .FirstOrDefaultAsync(b => b.SKU == sku && b.IsActive);

            if (book == null)
                return NotFound("Libro no encontrado");

            var response = new BookResponse
            {
                Id = book.Id,
                SKU = book.SKU,
                Title = book.Title,
                Author = $"{book.Author.FirstName} {book.Author.LastName}",
                Publisher = book.Publisher,
                Category = book.Category,
                Quantity = book.Quantity,
                Format = book.Format,
                Edition = book.Edition,
                Language = book.Language,
                Pages = book.Pages,
                Chapters = book.Chapters,
                Description = book.Description,
                Dimensions = book.Dimensions,
                Weight = book.Weight,
                CoverImageUrl = book.CoverImageUrl,
                BookFileUrl = book.BookFileUrl,
                AudioFileUrl = book.AudioFileUrl,
                Rating = book.Rating,
                ReviewCount = book.ReviewCount,
                CreatedAt = book.CreatedAt
            };

            return Ok(response);
        }

        // POST: api/books - Crear nuevo libro
        [HttpPost]
        public async Task<ActionResult<BookResponse>> CreateBook([FromBody] CreateBookRequest request)
        {
            // Log para debug
            Console.WriteLine($"Recibiendo request para crear libro: {request.Title}");
            
            // Validar modelo
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                return BadRequest($"Errores de validación: {string.Join(", ", errors)}");
            }

            // Verificar que el autor existe
            var author = await _context.Authors.FindAsync(request.AuthorId);
            if (author == null)
                return BadRequest("El autor especificado no existe");

            // Verificar que el SKU sea único
            if (await _context.Books.AnyAsync(b => b.SKU == request.SKU))
                return BadRequest("El SKU ya existe");

            var book = new Book
            {
                SKU = request.SKU,
                Title = request.Title,
                AuthorId = request.AuthorId,
                Publisher = request.Publisher,
                Category = request.Category,
                Quantity = request.Quantity,
                Format = request.Format,
                Edition = request.Edition,
                Language = request.Language,
                Pages = request.Pages,
                Chapters = request.Chapters,
                Description = request.Description,
                Dimensions = request.Dimensions,
                Weight = request.Weight,
                CoverImageUrl = request.CoverImageUrl,
                BookFileUrl = request.BookFileUrl,
                AudioFileUrl = request.AudioFileUrl
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            // Obtener el libro con el autor incluido
            var createdBook = await _context.Books
                .Include(b => b.Author)
                .FirstOrDefaultAsync(b => b.Id == book.Id);

            var response = new BookResponse
            {
                Id = createdBook!.Id,
                SKU = createdBook.SKU,
                Title = createdBook.Title,
                Author = $"{createdBook.Author.FirstName} {createdBook.Author.LastName}",
                Publisher = createdBook.Publisher,
                Category = createdBook.Category,
                Quantity = createdBook.Quantity,
                Format = createdBook.Format,
                Edition = createdBook.Edition,
                Language = createdBook.Language,
                Pages = createdBook.Pages,
                Chapters = createdBook.Chapters,
                Description = createdBook.Description,
                Dimensions = createdBook.Dimensions,
                Weight = createdBook.Weight,
                CoverImageUrl = createdBook.CoverImageUrl,
                BookFileUrl = createdBook.BookFileUrl,
                AudioFileUrl = createdBook.AudioFileUrl,
                Rating = createdBook.Rating,
                ReviewCount = createdBook.ReviewCount,
                CreatedAt = createdBook.CreatedAt
            };

            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, response);
        }

        // POST: api/books/bulk - Crear múltiples libros
        [HttpPost("bulk")]
        public async Task<ActionResult<BulkCreateResponse>> CreateBooksBulk([FromBody] BulkCreateWrapper wrapper)
        {
            if (wrapper?.Books == null || !wrapper.Books.Any())
                return BadRequest("Se requiere al menos un libro");

            var createdBooks = new List<BookResponse>();
            var errors = new List<string>();
            var successCount = 0;

            foreach (var bookRequest in wrapper.Books)
            {
                try
                {
                    // Buscar o crear el autor basado en el nombre
                    var author = await _context.Authors
                        .FirstOrDefaultAsync(a => a.FirstName == bookRequest.Author || 
                                                 (a.FirstName + " " + a.LastName) == bookRequest.Author);

                    if (author == null)
                    {
                        // Crear un nuevo autor si no existe
                        var authorNames = bookRequest.Author.Split(' ', 2);
                        author = new Author
                        {
                            FirstName = authorNames[0],
                            LastName = authorNames.Length > 1 ? authorNames[1] : "",
                            Gender = "No especificado",
                            Nationality = "No especificada",
                            Language = "Español",
                            IsAlive = true
                        };
                        _context.Authors.Add(author);
                        await _context.SaveChangesAsync();
                    }

                    // Verificar que el SKU sea único
                    if (await _context.Books.AnyAsync(b => b.SKU == bookRequest.SKU))
                    {
                        errors.Add($"SKU {bookRequest.SKU} ya existe");
                        continue;
                    }

                    var book = new Book
                    {
                        SKU = bookRequest.SKU,
                        Title = bookRequest.Title,
                        AuthorId = author.Id,
                        Publisher = bookRequest.Publisher,
                        Category = bookRequest.Category,
                        Quantity = bookRequest.Quantity,
                        Format = bookRequest.Format,
                        Edition = bookRequest.Edition,
                        Language = bookRequest.Language,
                        Pages = bookRequest.Pages,
                        Chapters = bookRequest.Chapters,
                        Description = bookRequest.Description,
                        Dimensions = bookRequest.Dimensions,
                        Weight = bookRequest.Weight,
                        CoverImageUrl = bookRequest.CoverImageUrl,
                        Rating = bookRequest.Rating,
                        ReviewCount = bookRequest.ReviewCount
                    };

                    _context.Books.Add(book);
                    successCount++;
                }
                catch (Exception ex)
                {
                    errors.Add($"Error al crear libro {bookRequest.SKU}: {ex.Message}");
                }
            }

            await _context.SaveChangesAsync();

            var response = new BulkCreateResponse
            {
                SuccessCount = successCount,
                ErrorCount = errors.Count,
                Errors = errors,
                Message = $"Se crearon {successCount} libros exitosamente. {errors.Count} errores."
            };

            return Ok(response);
        }

        // PUT: api/books/{id} - Actualizar libro
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] UpdateBookRequest request)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return NotFound("Libro no encontrado");

            // Verificar que el autor existe si se está cambiando
            if (request.AuthorId.HasValue)
            {
                var author = await _context.Authors.FindAsync(request.AuthorId.Value);
                if (author == null)
                    return BadRequest("El autor especificado no existe");
                book.AuthorId = request.AuthorId.Value;
            }

            // Verificar que el SKU sea único si se está cambiando
            if (!string.IsNullOrEmpty(request.SKU) && request.SKU != book.SKU)
            {
                if (await _context.Books.AnyAsync(b => b.SKU == request.SKU))
                    return BadRequest("El SKU ya existe");
                book.SKU = request.SKU;
            }

            // Actualizar campos
            if (!string.IsNullOrEmpty(request.Title))
                book.Title = request.Title;

            if (!string.IsNullOrEmpty(request.Publisher))
                book.Publisher = request.Publisher;

            if (!string.IsNullOrEmpty(request.Category))
                book.Category = request.Category;

            if (request.Quantity.HasValue)
                book.Quantity = request.Quantity.Value;

            if (!string.IsNullOrEmpty(request.Format))
                book.Format = request.Format;

            if (!string.IsNullOrEmpty(request.Edition))
                book.Edition = request.Edition;

            if (!string.IsNullOrEmpty(request.Language))
                book.Language = request.Language;

            if (request.Pages.HasValue)
                book.Pages = request.Pages.Value;

            if (request.Chapters.HasValue)
                book.Chapters = request.Chapters.Value;

            if (!string.IsNullOrEmpty(request.Description))
                book.Description = request.Description;

            if (request.Dimensions != null)
                book.Dimensions = request.Dimensions;

            if (request.Weight != null)
                book.Weight = request.Weight;

            if (request.CoverImageUrl != null)
                book.CoverImageUrl = request.CoverImageUrl;

            if (request.BookFileUrl != null)
                book.BookFileUrl = request.BookFileUrl;

            if (request.AudioFileUrl != null)
                book.AudioFileUrl = request.AudioFileUrl;

            book.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/books/{id} - Eliminar libro (soft delete)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return NotFound("Libro no encontrado");

            book.IsActive = false;
            book.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/books/categories - Obtener todas las categorías
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetCategories()
        {
            var categories = await _context.Books
                .Where(b => b.IsActive)
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();

            return Ok(categories);
        }

        // GET: api/books/formats - Obtener todos los formatos
        [HttpGet("formats")]
        public async Task<ActionResult<IEnumerable<string>>> GetFormats()
        {
            var formats = await _context.Books
                .Where(b => b.IsActive)
                .Select(b => b.Format)
                .Distinct()
                .OrderBy(f => f)
                .ToListAsync();

            return Ok(formats);
        }

        // GET: api/books/languages - Obtener todos los idiomas
        [HttpGet("languages")]
        public async Task<ActionResult<IEnumerable<string>>> GetLanguages()
        {
            var languages = await _context.Books
                .Where(b => b.IsActive)
                .Select(b => b.Language)
                .Distinct()
                .OrderBy(l => l)
                .ToListAsync();

            return Ok(languages);
        }

        // Modelos de request/response
        public class BookResponse
        {
            public int Id { get; set; }
            public string SKU { get; set; } = string.Empty;
            public string Title { get; set; } = string.Empty;
            public string Author { get; set; } = string.Empty;
            public string Publisher { get; set; } = string.Empty;
            public string Category { get; set; } = string.Empty;
            public int Quantity { get; set; }
            public string Format { get; set; } = string.Empty;
            public string Edition { get; set; } = string.Empty;
            public string Language { get; set; } = string.Empty;
            public int? Pages { get; set; }
            public int? Chapters { get; set; }
            public string Description { get; set; } = string.Empty;
            public string? Dimensions { get; set; }
            public string? Weight { get; set; }
            public string? CoverImageUrl { get; set; }
            public string? BookFileUrl { get; set; }
            public string? AudioFileUrl { get; set; }
            public decimal Rating { get; set; }
            public int ReviewCount { get; set; }
            public DateTime CreatedAt { get; set; }
        }

        public class CreateBookRequest
        {
            public string SKU { get; set; } = string.Empty;
            public string Title { get; set; } = string.Empty;
            public int AuthorId { get; set; }
            public string Publisher { get; set; } = string.Empty;
            public string Category { get; set; } = string.Empty;
            public int Quantity { get; set; }
            public string Format { get; set; } = string.Empty;
            public string Edition { get; set; } = string.Empty;
            public string Language { get; set; } = string.Empty;
            public int? Pages { get; set; }
            public int? Chapters { get; set; }
            public string Description { get; set; } = string.Empty;
            public string? Dimensions { get; set; }
            public string? Weight { get; set; }
            public string? CoverImageUrl { get; set; }
            public string? BookFileUrl { get; set; }
            public string? AudioFileUrl { get; set; }
        }

        public class BulkCreateBookRequest
        {
            public string SKU { get; set; } = string.Empty;
            public string Title { get; set; } = string.Empty;
            public string Author { get; set; } = string.Empty;
            public string Publisher { get; set; } = string.Empty;
            public string Category { get; set; } = string.Empty;
            public int Quantity { get; set; }
            public string Format { get; set; } = string.Empty;
            public string Edition { get; set; } = string.Empty;
            public string Language { get; set; } = string.Empty;
            public int? Pages { get; set; }
            public int? Chapters { get; set; }
            public string Description { get; set; } = string.Empty;
            public string? Dimensions { get; set; }
            public string? Weight { get; set; }
            public string? CoverImageUrl { get; set; }
            public decimal Rating { get; set; }
            public int ReviewCount { get; set; }
        }

        public class BulkCreateResponse
        {
            public int SuccessCount { get; set; }
            public int ErrorCount { get; set; }
            public List<string> Errors { get; set; } = new List<string>();
            public string Message { get; set; } = string.Empty;
        }

        public class BulkCreateWrapper
        {
            public List<BulkCreateBookRequest> Books { get; set; } = new List<BulkCreateBookRequest>();
        }

        public class UpdateBookRequest
        {
            public string? SKU { get; set; }
            public string? Title { get; set; }
            public int? AuthorId { get; set; }
            public string? Publisher { get; set; }
            public string? Category { get; set; }
            public int? Quantity { get; set; }
            public string? Format { get; set; }
            public string? Edition { get; set; }
            public string? Language { get; set; }
            public int? Pages { get; set; }
            public int? Chapters { get; set; }
            public string? Description { get; set; }
            public string? Dimensions { get; set; }
            public string? Weight { get; set; }
            public string? CoverImageUrl { get; set; }
            public string? BookFileUrl { get; set; }
            public string? AudioFileUrl { get; set; }
        }
    }
} 