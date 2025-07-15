using System.Linq.Expressions;

namespace VirtualBiblio.Data
{
    public interface IRepository<T> where T : class
    {
        Task<T> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAll();
        Task<T> Find(Expression<Func<T, bool>> predicate); // Método que falta
        void Add(T entity);
        void Update(T entity);
        void Remove(T entity); // Método que falta (tienes "Delete" en su lugar)
    }
}