using Microsoft.EntityFrameworkCore;
using VirtualBiblio.Data.Models;

namespace VirtualBiblio.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Author> Authors { get; set; }
    }
}