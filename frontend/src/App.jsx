import { useState, useEffect } from 'react';
import api from './api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/Auth/login', { username, password });
      localStorage.setItem('token', response.data);
      setIsLoggedIn(true);
      setError('');
    } catch (err) {
      setError('Błąd logowania. Sprawdź dane.');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/Products');
      setProducts(response.data);
    } catch (err) {
      console.error("Błąd pobierania produktów", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchProducts();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Logowanie do Magazynu</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Użytkownik" onChange={e => setUsername(e.target.value)} /><br/><br/>
          <input type="password" placeholder="Hasło" onChange={e => setPassword(e.target.value)} /><br/><br/>
          <button type="submit">Zaloguj się</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Stan Magazynowy</h1>
      <button onClick={() => { localStorage.removeItem('token'); setIsLoggedIn(false); }}>Wyloguj</button>
      <hr />
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th>Nazwa</th>
            <th>SKU</th>
            <th>Ilość</th>
            <th>Cena</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.sku}</td>
              <td>{p.quantity}</td>
              <td>{p.price} zł</td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && <p>Brak produktów w bazie. Dodaj je przez Swaggera lub zaimplementuj formularz!</p>}
    </div>
  );
}

export default App;