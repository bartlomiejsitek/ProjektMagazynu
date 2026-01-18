import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import api, { getUserRole } from './api';
import ProductForm from './ProductForm';
import WarehouseManagement from './WarehouseManagement';
import TransferForm from './TransferForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductsDashboard({ userRole }) {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterWarehouse, setFilterWarehouse] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [transferringProduct, setTransferringProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, warRes] = await Promise.all([
        api.get(`/Products?search=${debouncedSearch}&warehouseId=${filterWarehouse}`),
        api.get('/Warehouses')
      ]);
      setProducts(prodRes.data);
      setWarehouses(warRes.data);
    } catch (err) { toast.error("Błąd pobierania danych"); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, [debouncedSearch, filterWarehouse]);

  const handleSaveProduct = async (data) => {
    try {
      if (editingProduct) await api.put(`/Products/${editingProduct.id}`, data);
      else await api.post('/Products', data);
      setShowForm(false); fetchData(); toast.success("Zapisano!");
    } catch (err) { toast.error("Błąd zapisu"); }
  };

  const handleTransferProduct = async (data) => {
    setIsLoading(true);
    try {
      await api.post('/Products/transfer', data);
      toast.success("Produkt został pomyślnie przeniesiony!");
      setTransferringProduct(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data || "Błąd przenoszenia.");
    } finally { setIsLoading(false); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Usunąć produkt?")) {
      await api.delete(`/Products/${id}`);
      fetchData(); toast.info("Usunięto");
    }
  };

  return (
    <>
      <button onClick={() => { setShowForm(true); setEditingProduct(null); setTransferringProduct(null); }} style={{ margin: '20px 0', background: '#007bff', color: 'white' }}>
        + Dodaj Produkt
      </button>

      {showForm && <ProductForm productToEdit={editingProduct} onSave={handleSaveProduct} onCancel={() => setShowForm(false)} />}
      
      {transferringProduct && (
        <TransferForm 
            productToMove={transferringProduct} 
            onSave={handleTransferProduct} 
            onCancel={() => setTransferringProduct(null)} 
        />
      )}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', background: '#222', padding: '15px', borderRadius: '8px' }}>
        <input placeholder="Szukaj..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        <select value={filterWarehouse} onChange={e => setFilterWarehouse(e.target.value)}>
          <option value="">Wszystkie magazyny</option>
          {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
      </div>

      {isLoading ? <p>Ładowanie...</p> : (
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#333' }}><th style={{padding: '10px'}}>Nazwa</th><th>SKU</th><th>Ilość</th><th>Cena</th><th>Magazyn</th><th>Akcje</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #333' }}>
                <td style={{padding: '10px'}}>{p.name}</td><td>{p.sku}</td><td>{p.quantity}</td><td>{p.price} zł</td><td>{p.warehouse?.name}</td>
                <td>
                  <button onClick={() => { setEditingProduct(p); setShowForm(true); setTransferringProduct(null); }}>Edytuj</button>
                  <button onClick={() => { setTransferringProduct(p); setShowForm(false); setEditingProduct(null); }} style={{ marginLeft: '5px', background: '#3b82f6', color: 'white' }}>Przenieś</button>
                  {userRole === 'Admin' && <button onClick={() => handleDelete(p.id)} style={{ color: 'red', marginLeft: '5px' }}>Usuń</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(getUserRole());
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserRole(null);
  };

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        <ToastContainer theme="dark" />
        <h1>{isRegistering ? 'Rejestracja' : 'System Magazynowy'}</h1>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const endpoint = isRegistering ? '/Auth/register' : '/Auth/login';
          try {
            const res = await api.post(endpoint, { username: e.target.u.value, password: e.target.p.value });
            if (isRegistering) { setIsRegistering(false); toast.success("Zarejestrowano!"); }
            else { localStorage.setItem('token', res.data); setUserRole(getUserRole()); setIsLoggedIn(true); }
          } catch { toast.error("Błąd autoryzacji"); }
        }}>
          <input name="u" placeholder="Użytkownik" required /><br/><br/>
          <input name="p" type="password" placeholder="Hasło" required /><br/><br/>
          <button type="submit">{isRegistering ? 'Zarejestruj' : 'Zaloguj'}</button>
        </form>
        <button onClick={() => setIsRegistering(!isRegistering)} style={{ marginTop: '20px', background: 'none', color: '#007bff' }}>
          {isRegistering ? 'Zaloguj się' : 'Zarejestruj się'}
        </button>
      </div>
    );
  }

  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <ToastContainer theme="dark" position="bottom-right" />
        
        {/* NAWIGACJA */}
        <nav style={{ display: 'flex', gap: '20px', alignItems: 'center', borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '20px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>📋 Produkty</Link>
          {userRole === 'Admin' && (
            <Link to="/warehouses" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>⚙️ Zarządzaj Magazynami</Link>
          )}
          <div style={{ flex: 1 }}></div>
          <span>Rola: <strong>{userRole}</strong></span>
          <button onClick={handleLogout} style={{ background: '#dc3545' }}>Wyloguj</button>
        </nav>

        {/* DEFINICJA TRAS */}
        <Routes>
          <Route path="/" element={<ProductsDashboard userRole={userRole} />} />
          <Route 
            path="/warehouses" 
            element={userRole === 'Admin' ? <WarehouseManagement /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;