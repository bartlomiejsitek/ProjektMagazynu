using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Nazwa produktu jest wymagana")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Nazwa musi mieć od 3 do 100 znaków")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Kod SKU jest wymagany")]
        [RegularExpression(@"^[A-Z0-9-]{3,20}$", ErrorMessage = "SKU: duże litery, cyfry i myślniki (3-20 znaków)")]
        public string SKU { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Range(0, 1000000, ErrorMessage = "Ilość nie może być ujemna")]
        public int Quantity { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        [Range(0.01, 1000000.00, ErrorMessage = "Cena musi być większa od 0")]
        public decimal Price { get; set; }

        [Required]
        public int WarehouseId { get; set; }

        [ForeignKey("WarehouseId")]
        public Warehouse? Warehouse { get; set; }
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}