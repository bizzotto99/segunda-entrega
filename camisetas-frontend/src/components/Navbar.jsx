import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiSearch, FiUser, FiShoppingCart, FiLogIn } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { items } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = items ? items.reduce((sum, item) => sum + item.cantidad, 0) : 0;

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/catalogo?equipo=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container container">
        <div className="navbar-logo">
          <Link to="/">UADESHOP</Link>
        </div>
        
        <nav className="navbar-links">
          <Link to="/catalogo?categoriaId=1">Primera Division</Link>
          <Link to="/catalogo?categoriaId=2">Segunda Division</Link>
          <Link to="/catalogo?categoriaId=3">Seleccion</Link>
        </nav>
        
        <div className="navbar-actions">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
          {token ? (
            <Link to="/perfil" className="action-btn" title={user ? user.nombre : "Mi Perfil"}>
              <FiUser size={22} />
            </Link>
          ) : (
            <Link to="/login" className="action-btn" title="Iniciar Sesión">
              <FiLogIn size={22} />
            </Link>
          )}
          <Link to="/carrito" className="action-btn cart-btn">
            <FiShoppingCart size={22} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
