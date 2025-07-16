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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurar la clave compuesta para BookCategory
            modelBuilder.Entity<BookCategory>()
                .HasKey(bc => new { bc.BookId, bc.CategoryId });

            // Configurar las relaciones many-to-many
            modelBuilder.Entity<BookCategory>()
                .HasOne(bc => bc.Book)
                .WithMany(b => b.BookCategories)
                .HasForeignKey(bc => bc.BookId);

            modelBuilder.Entity<BookCategory>()
                .HasOne(bc => bc.Category)
                .WithMany(c => c.BookCategories)
                .HasForeignKey(bc => bc.CategoryId);

            // Configurar la relación Book-Author
            modelBuilder.Entity<Book>()
                .HasOne(b => b.Author)
                .WithMany()
                .HasForeignKey(b => b.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configurar índices para mejor rendimiento
            modelBuilder.Entity<Book>()
                .HasIndex(b => b.SKU)
                .IsUnique();

            modelBuilder.Entity<Book>()
                .HasIndex(b => b.Title);

            modelBuilder.Entity<Category>()
                .HasIndex(c => c.Name)
                .IsUnique();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                // Solo para desarrollo local, puedes poner la cadena de conexión aquí
                optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Username=postgres;Password=1234;Database=virtualbiblio");
            }
        }

        public DbSet<Author> Authors { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<BookCategory> BookCategories { get; set; }
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<Donation> Donations { get; set; }
    }
}