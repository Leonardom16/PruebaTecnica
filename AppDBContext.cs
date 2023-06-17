using Microsoft.EntityFrameworkCore;
using PersonaBD.Models;

namespace PersonaBD
{
    public class AppDBContext: DbContext
    {
       public DbSet<Persona> Personas { get; set; }
        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options) 
        {
        
        
        
        }
    }
}
