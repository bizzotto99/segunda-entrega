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
          <Link to="/">UADE<span className="logo-accent">SHOP</span></Link>
        </div>
        
        <nav className="navbar-links">
          <Link to="/catalogo?categoriaId=1">Primera Division</Link>
          <Link to="/catalogo?categoriaId=2">Segunda Division</Link>
          <Link to="/catalogo?categoriaId=3">Seleccion</Link>
          <Link to="/mistery-box">Mistery Box</Link>

          {user && user.rol === 'VENDEDOR' && (
            <Link to="/admin" className="admin-link" style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>Panel Admin</Link>
          )}
        </nav>
        
        <div className="navbar-actions">
          <div className="search-bar">
            <FiSearch 
              className="search-icon" 
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (searchQuery.trim()) {
                  navigate(`/catalogo?equipo=${encodeURIComponent(searchQuery.trim())}`);
                  setSearchQuery('');
                }
              }}
            />
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
          {token ? (
            <div className="user-nav-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {user && user.rol === 'COMPRADOR' && (
                <span className="navbar-points" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-accent)', background: 'rgba(0, 210, 255, 0.08)', padding: '4px 8px', borderRadius: '12px', border: '1px solid rgba(0, 210, 255, 0.2)', display: 'flex', alignItems: 'center', gap: '4px' }} title="Tus Puntos de Hincha">
                  🏆 {user.points !== undefined ? user.points.toLocaleString('es-AR') : 0} pts
                </span>
              )}
              <Link to="/perfil" className="action-btn" title={user ? `${user.nombre} ${user.apellido}` : "Mi Perfil"}>
                <FiUser size={22} />
              </Link>
            </div>
          ) : (
            <Link to="/login" className="action-btn" title="Iniciar Sesión">
              <FiLogIn size={22} />
            </Link>
          )}
          {(!user || user.rol !== 'VENDEDOR') && (
            <Link to="/carrito" className="action-btn cart-btn">
              <FiShoppingCart size={22} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
