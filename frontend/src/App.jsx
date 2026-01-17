import { useState, useEffect } from 'react';
import api from './api';
import ProductForm from './ProductForm';
// --- STEP 4: Import powiadomień ---
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // Stany autoryzacji
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Danych
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // --- STEP 4: Stan ładowania ---

  // Filtrowania
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterWarehouse, setFilterWarehouse] = useState('');

  // Formularza
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchProducts = async () => {
    setIsLoading(true); // --- Start ładowania ---
    try {
      const res = await api.get(`/Products?search=${debouncedSearch}&warehouseId=${filterWarehouse}`);
      setProducts(res.data);
    } catch (err) {
      toast.error("Błąd pobierania produktów!");
    } finally {
      setIsLoading(false); // --- Koniec ładowania ---
    }
  };

  const fetchWarehouses = async () => {
    try {
      const res = await api.get('/Warehouses');
      setWarehouses(res.data);
    } catch (err) {
      console.error("Błąd pobierania magazynów:", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
      if (warehouses.length === 0) fetchWarehouses();
    }
  }, [isLoggedIn, debouncedSearch, filterWarehouse]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/Auth/login', { username, password });
      localStorage.setItem('token', res.data);
      setIsLoggedIn(true);
      setLoginError('');
      toast.success("Zalogowano pomyślnie!");
    } catch (err) {
      setLoginError('Nieprawidłowy login lub hasło.');
      toast.error("Błąd logowania.");
    }
  };

  const handleSaveProduct = async (data) => {
    setIsLoading(true);
    try {
      if (editingProduct) {
        await api.put(`/Products/${editingProduct.id}`, data);
        toast.success("Zaktualizowano produkt!");
      } else {
        await api.post('/Products', data);
        toast.success("Dodano nowy produkt!");
      }
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      // Wyciąganie błędów walidacji z backendu
      const backendError = err.response?.data?.errors 
        ? Object.values(err.response.data.errors).flat()[0] 
        : "Wystąpił błąd podczas zapisu.";
      toast.error(backendError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten produkt?")) {
      try {
        await api.delete(`/Products/${id}`);
        toast.info("Produkt został usunięty.");
        fetchProducts();
      } catch (err) {
        toast.error("Błąd podczas usuwania.");
      }
    }
  };

  // Widok przed logowaniem
  if (!isLoggedIn) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center', maxWidth: '400px', margin: 'auto' }}>
        <ToastContainer theme="dark" position="top-center" />
        <h1 style={{ color: 'white' }}>System Magazynowy</h1>
        <div style={{ background: '#222', padding: '30px', borderRadius: '10px', border: '1px solid #444' }}>
          <h2 style={{ color: 'white', marginTop: 0 }}>Zaloguj się</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="text" placeholder="Nazwa użytkownika" 
              value={username} onChange={e => setUsername(e.target.value)} 
              style={{ padding: '10px' }} required 
            />
            <input 
              type="password" placeholder="Hasło" 
              value={password} onChange={e => setPassword(e.target.value)} 
              style={{ padding: '10px' }} required 
            />
            <button type="submit" style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
              Zaloguj
            </button>
          </form>
          {loginError && <p style={{ color: '#ff4d4d', marginTop: '15px' }}>{loginError}</p>}
        </div>
      </div>
    );
  }

  // Widok po zalogowaniu
  return (
    <div style={{ padding: '20px', color: 'white', maxWidth: '1200px', margin: 'auto' }}>
      {/* Kontener powiadomień */}
      <ToastContainer theme="dark" position="bottom-right" autoClose={3000} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1> Panel Zarządzania Magazynem</h1>
        <button 
          onClick={() => { localStorage.removeItem('token'); setIsLoggedIn(false); }}
          style={{ background: '#dc3545', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Wyloguj
        </button>
      </div>

      <button 
        disabled={isLoading}
        onClick={() => { setShowForm(true); setEditingProduct(null); }}
        style={{ background: '#007bff', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}
      >
        + Dodaj Nowy Produkt
      </button>

      {/* Formularz */}
      {showForm && (
        <ProductForm 
          productToEdit={editingProduct} 
          onSave={handleSaveProduct} 
          onCancel={() => { setShowForm(false); setEditingProduct(null); }} 
        />
      )}

      {/* Filtry */}
      <div style={{ 
        display: 'flex', gap: '20px', background: '#222', padding: '20px', 
        borderRadius: '8px', marginBottom: '20px', border: '1px solid #444', alignItems: 'flex-end'
      }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '13px', color: '#aaa' }}>Szukaj (Nazwa lub SKU):</label>
          <input 
            type="text" placeholder="Wpisz fragment nazwy..." 
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)} 
            style={{ padding: '10px', background: '#333', color: 'white', border: '1px solid #555' }}
          />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '13px', color: '#aaa' }}>Magazyn:</label>
          <select 
            value={filterWarehouse} onChange={e => setFilterWarehouse(e.target.value)}
            style={{ padding: '10px', background: '#333', color: 'white', border: '1px solid #555' }}
          >
            <option value="">Wszystkie magazyny</option>
            {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        </div>

        <button 
          onClick={() => { setSearchTerm(''); setFilterWarehouse(''); }}
          style={{ padding: '10px 20px', background: '#555', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Resetuj filtry
        </button>
      </div>

      {/* Tabela produktów */}
      {isLoading ? (
        <div className="loader">⏳ Trwa przetwarzanie danych...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#333', borderBottom: '2px solid #444' }}>
                <th style={{ padding: '15px' }}>Nazwa</th>
                <th>SKU</th>
                <th>Ilość</th>
                <th>Cena</th>
                <th>Magazyn</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '15px' }}>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>{p.quantity}</td>
                  <td>{p.price.toFixed(2)} zł</td>
                  <td>{p.warehouse?.name || 'Nieprzypisany'}</td>
                  <td>
                    <button 
                      onClick={() => { setEditingProduct(p); setShowForm(true); }}
                      style={{ marginRight: '10px', cursor: 'pointer' }}
                    >
                      Edytuj
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id)} 
                      style={{ color: '#ff4d4d', cursor: 'pointer' }}
                    >
                      Usuń
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <p style={{ textAlign: 'center', color: '#aaa', marginTop: '40px' }}>Brak produktów do wyświetlenia.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;