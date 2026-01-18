namespace backend.Entities
{
    public class TransferDto
    {
        public int ProductId { get; set; }
        public int TargetWarehouseId { get; set; }
        public int Quantity { get; set; }
    }
}