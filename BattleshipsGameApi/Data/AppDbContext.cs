using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProductCatalogAPI.Models;

namespace ProductCatalogAPI.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Session> Sessions { get; set; }
    public DbSet<Player> Players { get; set; }
    public DbSet<Ship> Ships { get; set; }
    public DbSet<Cell> Cells { get; set; }
    public DbSet<Attack> Attacks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}