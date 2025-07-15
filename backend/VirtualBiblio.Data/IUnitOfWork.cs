namespace VirtualBiblio.Data
{
    public interface IUnitOfWork : IDisposable
    {
        IRepository<Models.Author> Authors { get; }
        Task<int> CompleteAsync();
    }
}