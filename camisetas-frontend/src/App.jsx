import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { useAuth, useCart } from './redux/hooks';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Perfil from './pages/Perfil';
import Carrito from './pages/Carrito';
import DetalleProducto from './pages/DetalleProducto';
import ScrollToTop from './components/ScrollToTop';
import AdminDashboard from './pages/AdminDashboard';
import PerfilPublico from './pages/PerfilPublico';
import MisteryBox from './pages/MisteryBox';
import AuctionPage from './pages/AuctionPage';

const AppContent = () => {
  const { token, user, fetchProfile, logout } = useAuth();
  const { fetchCart } = useCart();

  useEffect(() => {
    if (token && !user) {
      fetchProfile().catch((err) => {
        console.error("Error al cargar perfil de usuario persistido:", err);
        logout();
      });
    }
  }, [token, user]);

  useEffect(() => {
    fetchCart().catch(() => {});
  }, [token]);

  return (
    <Router>
      <ScrollToTop />
      <div className="app-container">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/catalogo/productos/:id" element={<DetalleProducto />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/usuario/:id" element={<PerfilPublico />} />
            <Route path="/mistery-box" element={<MisteryBox />} />
            <Route path="/subastas" element={<AuctionPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
