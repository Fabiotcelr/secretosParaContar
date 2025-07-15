using VirtualBiblio.Data.Models;
using VirtualBiblio.Business.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace VirtualBiblio.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorsController : ControllerBase
    {
        private readonly IAuthorService _authorService;

        public AuthorsController(IAuthorService authorService)
        {
            _authorService = authorService;
        }

        [HttpPost]
        public async Task<ActionResult<Author>> CreateAuthor([FromBody] Author author)
        {
            var createdAuthor = await _authorService.AddAuthorAsync(author);
            return CreatedAtAction(nameof(GetAuthor), new { id = createdAuthor.Id }, createdAuthor);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Author>> GetAuthor(int id)
        {
            var authors = await _authorService.SearchAuthorsAsync();
            var author = authors.FirstOrDefault(a => a.Id == id);
            if (author == null) return NotFound();
            return Ok(author);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Author>> UpdateAuthor(int id, [FromBody] Author author)
        {
            try
            {
                var updatedAuthor = await _authorService.UpdateAuthorAsync(id, author);
                return Ok(updatedAuthor);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeactivateAuthor(int id)
        {
            try
            {
                await _authorService.DeactivateAuthorAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Author>>> SearchAuthors(
            [FromQuery] string firstName = null,
            [FromQuery] string lastName = null,
            [FromQuery] string gender = null,
            [FromQuery] int? birthYear = null,
            [FromQuery] string nationality = null,
            [FromQuery] string language = null,
            [FromQuery] bool? isAlive = null)
        {
            var authors = await _authorService.SearchAuthorsAsync(firstName, lastName, gender, birthYear, nationality, language, isAlive);
            return Ok(authors);
        }
    }
}