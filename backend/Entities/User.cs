using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "Admin";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}