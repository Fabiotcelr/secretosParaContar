using VirtualBiblio.Data;
using VirtualBiblio.Data.Models;
using VirtualBiblio.Business.Interfaces;
using System.Linq;

namespace VirtualBiblio.Business.Services
{
    public class AuthorService : IAuthorService
    {
        private readonly IUnitOfWork _unitOfWork;

        public AuthorService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Author> AddAuthorAsync(Author author)
        {
            _unitOfWork.Authors.Add(author);
            await _unitOfWork.CompleteAsync();
            return author;
        }

        public async Task<Author> UpdateAuthorAsync(int id, Author author)
        {
            var existingAuthor = await _unitOfWork.Authors.GetByIdAsync(id); // Cambia "GetById" a "GetByIdAsync" y usa await
            if (existingAuthor == null) throw new Exception("Autor no encontrado");

            existingAuthor.FirstName = author.FirstName;
            existingAuthor.LastName = author.LastName;
            existingAuthor.Gender = author.Gender;
            existingAuthor.BirthYear = author.BirthYear;
            existingAuthor.Nationality = author.Nationality;
            existingAuthor.Language = author.Language;
            existingAuthor.IsAlive = author.IsAlive;

            _unitOfWork.Authors.Update(existingAuthor);
            await _unitOfWork.CompleteAsync();
            return existingAuthor;
        }

        public async Task DeactivateAuthorAsync(int id)
        {
            var author = await _unitOfWork.Authors.GetByIdAsync(id); // Cambia "GetById" a "GetByIdAsync" y usa await
            if (author == null) throw new Exception("Autor no encontrado");
            author.IsAlive = false;
            _unitOfWork.Authors.Update(author);
            await _unitOfWork.CompleteAsync();
        }

        public async Task<IEnumerable<Author>> SearchAuthorsAsync(string firstName = null, string lastName = null, 
            string gender = null, int? birthYear = null, string nationality = null, 
            string language = null, bool? isAlive = null)
        {
            var authors = await _unitOfWork.Authors.GetAll(); // Usa await para obtener el IEnumerable<Author>
            var query = authors.AsQueryable();

            if (!string.IsNullOrEmpty(firstName))
                query = query.Where(a => a.FirstName.Contains(firstName));
            if (!string.IsNullOrEmpty(lastName))
                query = query.Where(a => a.LastName.Contains(lastName));
            if (!string.IsNullOrEmpty(gender))
                query = query.Where(a => a.Gender == gender);
            if (birthYear.HasValue)
                query = query.Where(a => a.BirthYear == birthYear);
            if (!string.IsNullOrEmpty(nationality))
                query = query.Where(a => a.Nationality == nationality);
            if (!string.IsNullOrEmpty(language))
                query = query.Where(a => a.Language == language);
            if (isAlive.HasValue)
                query = query.Where(a => a.IsAlive == isAlive);

            return query.ToList();
        }
    }
}