import { useState, useEffect } from 'react';
import api from './api';
import { toast } from 'react-toastify';

function WarehouseManagement() {
  const [warehouses, setWarehouses] = useState([]);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchWarehouses = async () => {
    try {
      const res = await api.get('/Warehouses');
      setWarehouses(res.data);
    } catch (err) { toast.error("Błąd pobierania magazynów"); }
  };

  useEffect(() => { fetchWarehouses(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/Warehouses', { name: newName, location: newLocation });
      toast.success("Magazyn dodany!");
      setNewName(''); setNewLocation('');
      fetchWarehouses();
    } catch (err) { toast.error("Błąd zapisu (wymagana rola Admin)"); }
    finally { setIsLoading(false); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Czy na pewno usunąć magazyn? Spowoduje to usunięcie wszystkich produktów w nim zawartych!")) {
      try {
        await api.delete(`/Warehouses/${id}`);
        toast.info("Magazyn usunięty");
        fetchWarehouses();
      } catch (err) { toast.error("Błąd usuwania"); }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Zarządzanie Magazynami</h2>
      
      {/* Formularz dodawania */}
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', marginBottom: '30px', background: '#222', padding: '20px', borderRadius: '8px' }}>
        <input type="text" placeholder="Nazwa magazynu" value={newName} onChange={e => setNewName(e.target.value)} required />
        <input type="text" placeholder="Lokalizacja" value={newLocation} onChange={e => setNewLocation(e.target.value)} required />
        <button type="submit" disabled={isLoading} style={{ background: 'green' }}>Dodaj Magazyn</button>
      </form>

      {/* Tabela magazynów */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#333' }}>
            <th style={{ padding: '10px' }}>Nazwa</th>
            <th>Lokalizacja</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {warehouses.map(w => (
            <tr key={w.id} style={{ borderBottom: '1px solid #333' }}>
              <td style={{ padding: '10px' }}>{w.name}</td>
              <td>{w.location}</td>
              <td>
                <button onClick={() => handleDelete(w.id)} style={{ color: 'red' }}>Usuń</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WarehouseManagement;