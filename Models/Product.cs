namespace BackendApp.Models;

public class Product
{
    public int ProductId { get; set; }
    public string Name { get; set; } = "";
    public int ManufacturerId { get; set; }
    public int WarehouseEntityId { get; set; }
    public int Quantity { get; set; }
}
