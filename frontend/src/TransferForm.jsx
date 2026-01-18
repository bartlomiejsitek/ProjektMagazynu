import { useState, useEffect } from 'react';
import api from './api';
import { toast } from 'react-toastify';

function TransferForm({ productToMove, onSave, onCancel }) {
  const [targetWarehouseId, setTargetWarehouseId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    api.get('/Warehouses').then(res => {
      const otherWarehouses = res.data.filter(w => w.id !== productToMove.warehouseId);
      setWarehouses(otherWarehouses);
      if (otherWarehouses.length > 0) {
        setTargetWarehouseId(otherWarehouses[0].id);
      }
    });
  }, [productToMove]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (quantity > productToMove.quantity) {
      toast.error("Nie możesz przenieść więcej niż masz na stanie!");
      return;
    }
    onSave({
      productId: productToMove.id,
      targetWarehouseId: parseInt(targetWarehouseId),
      quantity: parseInt(quantity)
    });
  };

  return (
    <div style={{ 
      background: '#1e3a5f',
      color: 'white', 
      padding: '20px', 
      marginBottom: '20px', 
      borderRadius: '8px',
      border: '1px solid #3b82f6' 
    }}>
      <h3 style={{ marginTop: 0 }}>Przenieś produkt: {productToMove.name}</h3>
      <p style={{ fontSize: '14px', color: '#cbd5e1' }}>
        Obecnie w magazynie: <strong>{productToMove.warehouse?.name}</strong> (Dostępne: {productToMove.quantity} szt.)
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>Magazyn docelowy:</label>
          <select 
            value={targetWarehouseId} 
            onChange={e => setTargetWarehouseId(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', background: '#334155', color: 'white' }}
          >
            {warehouses.length > 0 ? (
              warehouses.map(w => <option key={w.id} value={w.id}>{w.name} ({w.location})</option>)
            ) : (
              <option disabled>Brak innych magazynów</option>
            )}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>Ilość do przeniesienia:</label>
          <input 
            type="number" 
            min="1" 
            max={productToMove.quantity}
            value={quantity} 
            onChange={e => setQuantity(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', width: '100px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={warehouses.length === 0} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
            Wykonaj przeniesienie
          </button>
          <button type="button" onClick={onCancel} style={{ background: '#475569', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
            Anuluj
          </button>
        </div>
      </form>
    </div>
  );
}

export default TransferForm;