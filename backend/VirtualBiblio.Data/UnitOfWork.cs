using VirtualBiblio.Data.Models;

namespace VirtualBiblio.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private IRepository<Models.Author> _authors;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
            _authors = new Repository<Author>(context); // Inicializar en el constructor
        }

        public IRepository<Models.Author> Authors
        {
            get
            {
                return _authors ??= new Repository<Models.Author>(_context);
            }
        }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}