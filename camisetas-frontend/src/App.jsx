import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
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

function App() {
  return (
    <AuthProvider>
      <CartProvider>
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
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
