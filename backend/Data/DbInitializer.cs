using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public static class DbInitializer
    {
        public static void Seed(DataContext context)
        {
            if (!context.Users.Any())
            {
                context.Users.Add(new User
                {
                    Username = "admin",
                    // Hasło: "admin123" zahaszowane BCryptem
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    Role = "Admin"
                });
            }
            if (!context.Warehouses.Any())
            {
                var warehouseWaw = new Warehouse { Name = "Magazyn Warszawa", Location = "ul. Towarowa 5" };
                var warehouseKrak = new Warehouse { Name = "Magazyn Kraków", Location = "ul. Industrialna 12" };

                context.Warehouses.AddRange(warehouseWaw, warehouseKrak);
                context.SaveChanges(); 

                if (!context.Products.Any())
                {
                    context.Products.AddRange(
                        new Product { 
                            Name = "Laptop ProBook", SKU = "LP-001", Quantity = 15, Price = 4500, 
                            WarehouseId = warehouseWaw.Id 
                        },
                        new Product { 
                            Name = "Monitor 27 cali", SKU = "MON-27", Quantity = 30, Price = 1200, 
                            WarehouseId = warehouseWaw.Id 
                        },
                        new Product { 
                            Name = "Klawiatura Mechaniczna", SKU = "KB-RGB", Quantity = 50, Price = 350, 
                            WarehouseId = warehouseKrak.Id 
                        }
                    );
                }
            }

            context.SaveChanges();
        }
    }
}