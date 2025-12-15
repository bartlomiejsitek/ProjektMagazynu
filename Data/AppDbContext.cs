using Microsoft.EntityFrameworkCore;
using BackendApp.Models;

namespace BackendApp.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<Manufacturer> Manufacturers => Set<Manufacturer>();
    public DbSet<WarehouseEntity> Warehouses => Set<WarehouseEntity>();
    public DbSet<Product> Products => Set<Product>();
}
