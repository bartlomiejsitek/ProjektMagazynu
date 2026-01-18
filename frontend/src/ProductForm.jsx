import { useState, useEffect } from 'react';
import api from './api';

function ProductForm({ productToEdit, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '', sku: '', quantity: '', price: '', warehouseId: ''
  });
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    api.get('/Warehouses').then(res => {
      setWarehouses(res.data);
      if (!productToEdit && res.data.length > 0) {
        setFormData(prev => ({ ...prev, warehouseId: res.data[0].id }));
      }
    });

    if (productToEdit) {
      setFormData(productToEdit);
    }
  }, [productToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      quantity: parseInt(formData.quantity) || 0,
      price: parseFloat(formData.price) || 0
    };
    onSave(dataToSave);
  };

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '10px',
    flex: '1',
    minWidth: '150px'
  };

  return (
    <div style={{ 
      background: '#222', 
      color: 'white', 
      padding: '20px', 
      marginBottom: '20px', 
      borderRadius: '8px',
      border: '1px solid #444' 
    }}>
      <h3 style={{ marginTop: 0 }}>{productToEdit ? 'Edytuj Produkt' : 'Dodaj Nowy Produkt'}</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
        
        <div style={fieldStyle}>
          <label>Nazwa produktu:</label>
          <input type="text" placeholder="np. Laptop Dell" value={formData.name} required
            onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>

        <div style={fieldStyle}>
          <label>Kod SKU:</label>
          <input type="text" placeholder="np. LPT-001" value={formData.sku} required
            onChange={e => setFormData({...formData, sku: e.target.value})} />
        </div>

        <div style={fieldStyle}>
          <label>Ilość (szt.):</label>
          <input type="number" min="0" placeholder="0" value={formData.quantity}
            onChange={e => setFormData({...formData, quantity: e.target.value})} />
        </div>

        <div style={fieldStyle}>
          <label>Cena (zł):</label>
          <input type="number" min="0.01" step="0.01" placeholder="0.00" value={formData.price}
            onChange={e => setFormData({...formData, price: e.target.value})} />
        </div>

        <div style={fieldStyle}>
          <label>Magazyn:</label>
          <select value={formData.warehouseId} 
            onChange={e => setFormData({...formData, warehouseId: e.target.value})}
            style={{ padding: '4px' }}>
            {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        </div>

        <div style={{ width: '100%', display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit" style={{ 
            background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' 
          }}>
            Zapisz produkt
          </button>
          <button type="button" onClick={onCancel} style={{ 
            background: '#444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' 
          }}>
            Anuluj
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;