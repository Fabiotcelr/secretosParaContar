using VirtualBiblio.Data.Models;
using System.Collections.Generic;

namespace VirtualBiblio.Business.Interfaces
{
    public interface IAuthorService
    {
        Task<Author> AddAuthorAsync(Author author);
        Task<Author> UpdateAuthorAsync(int id, Author author);
        Task DeactivateAuthorAsync(int id);
        Task<IEnumerable<Author>> SearchAuthorsAsync(string firstName = null, string lastName = null, 
            string gender = null, int? birthYear = null, string nationality = null, 
            string language = null, bool? isAlive = null);
    }
}