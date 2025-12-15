namespace BackendApp.Models;

public class TransferRequest
{
    public int ProductId { get; set; }
    public int FromWarehouseId { get; set; }
    public int ToWarehouseId { get; set; }
    public int Quantity { get; set; }
}
