using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Entities
{
    public class Warehouse
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        // Jeden magazyn - wiele produktow
        [JsonIgnore]
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}