using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Entities;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class ProductsController : ControllerBase
    {
        private readonly DataContext _context;
        public ProductsController(DataContext context) { _context = context; }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts([FromQuery] string? search, [FromQuery] int? warehouseId)
        {
            var query = _context.Products.Include(p => p.Warehouse).AsQueryable();
            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(s) || p.SKU.ToLower().Contains(s));
            }
            if (warehouseId.HasValue && warehouseId.Value > 0)
                query = query.Where(p => p.WarehouseId == warehouseId.Value);

            return await query.ToListAsync();
        }
        [HttpPost("transfer")]
        public async Task<IActionResult> TransferProduct([FromBody] TransferDto transfer)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try {
                var sourceProduct = await _context.Products.FindAsync(transfer.ProductId);
                if (sourceProduct == null || sourceProduct.Quantity < transfer.Quantity)
                    return BadRequest("Brak wystarczającej ilości towaru.");

                sourceProduct.Quantity -= transfer.Quantity;
                _context.Products.Update(sourceProduct);
                var targetProduct = await _context.Products
                    .FirstOrDefaultAsync(p => p.SKU == sourceProduct.SKU && p.WarehouseId == transfer.TargetWarehouseId);

                if (targetProduct != null) {
                    targetProduct.Quantity += transfer.Quantity;
                    _context.Products.Update(targetProduct);
                } else {
                    _context.Products.Add(new Product {
                        Name = sourceProduct.Name, SKU = sourceProduct.SKU, Price = sourceProduct.Price,
                        Quantity = transfer.Quantity, WarehouseId = transfer.TargetWarehouseId
                    });
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return Ok();
            } catch (Exception) {
                await transaction.RollbackAsync();
                return StatusCode(500, "Błąd podczas transakcji");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Product>> AddProduct(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return Ok(product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, Product product)
        {
            if (id != product.Id) return BadRequest();
            _context.Entry(product).State = EntityState.Modified;
            product.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}