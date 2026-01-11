using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string SKU { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Quantity { get; set; } = 0;
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        [Required]
        public int WarehouseId { get; set; }
        [ForeignKey("WarehouseId")]
        public Warehouse? Warehouse { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}