import { useState, useEffect } from 'react';
import api from './api';
import ProductForm from './ProductForm';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await api.get('/Products');
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { 
    if (isLoggedIn) fetchProducts(); 
  }, [isLoggedIn]);

  // funkcja logowania
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/Auth/login', { username, password });
      localStorage.setItem('token', res.data);
      setIsLoggedIn(true);
      setLoginError('');
    } catch (err) {
      setLoginError('Błędny login lub hasło!');
    }
  };

  const handleSaveProduct = async (data) => {
    try {
      if (editingProduct) {
        await api.put(`/Products/${editingProduct.id}`, data);
      } else {
        await api.post('/Products', data);
      }
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) { alert("Błąd zapisu!"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Czy na pewno usunąć?")) {
      await api.delete(`/Products/${id}`);
      fetchProducts();
    }
  };

  // logowanie
  if (!isLoggedIn) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', maxWidth: '400px', margin: 'auto' }}>
        <h1>🔐 Logowanie</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Użytkownik" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Hasło" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" style={{ background: '#28a745', color: 'white', padding: '10px' }}>
            Zaloguj się
          </button>
        </form>
        {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
      </div>
    );
  }

  // po logowaniu
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Zarządzanie Magazynem</h1>
        <button 
            onClick={() => { localStorage.removeItem('token'); setIsLoggedIn(false); }}
            style={{ background: '#dc3545', color: 'white' }}
        >
          Wyloguj
        </button>
      </div>

      <button 
        onClick={() => { setShowForm(true); setEditingProduct(null); }} 
        style={{ margin: '20px 0', background: 'blue', color: 'white', padding: '10px 20px' }}
      >
        + Dodaj Produkt
      </button>

      {showForm && (
        <ProductForm 
          productToEdit={editingProduct} 
          onSave={handleSaveProduct} 
          onCancel={() => { setShowForm(false); setEditingProduct(null); }} 
        />
      )}

      <table border="1" style={{ width: '100%', marginTop: '20px', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#333', color: 'white' }}>
            <th style={{ padding: '10px' }}>Nazwa</th>
            <th>SKU</th>
            <th>Ilość</th>
            <th>Cena</th>
            <th>Magazyn</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td style={{ padding: '10px' }}>{p.name}</td>
              <td>{p.sku}</td>
              <td>{p.quantity}</td>
              <td>{p.price} zł</td>
              <td>{p.warehouse?.name}</td>
              <td>
                <button onClick={() => { setEditingProduct(p); setShowForm(true); }}>Edytuj</button>
                <button onClick={() => handleDelete(p.id)} style={{ color: 'red', marginLeft: '5px' }}>Usuń</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;