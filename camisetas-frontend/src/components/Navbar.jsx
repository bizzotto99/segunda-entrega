import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useCart } from '../redux/hooks';
import { fetchApi, getImageUrl } from '../services/api';
import { FiSearch, FiUser, FiShoppingCart, FiLogIn } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { items } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef(null);

  const cartCount = items ? items.reduce((sum, item) => sum + item.cantidad, 0) : 0;

  // Search suggestions logic
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const fetchSuggestions = async () => {
        try {
          const data = await fetchApi(`/catalogo/productos?q=${encodeURIComponent(searchQuery.trim())}`);
          // Limit to 5 suggestions
          setSuggestions(data ? data.slice(0, 5) : []);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error al buscar sugerencias:", error);
          setSuggestions([]);
        }
      };

      const delayDebounce = setTimeout(() => {
        fetchSuggestions();
      }, 300);

      return () => clearTimeout(delayDebounce);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/catalogo?equipo=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSuggestions(false);
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
          <Link to="/subastas">Subastas</Link>

          {user && user.rol === 'VENDEDOR' && (
            <Link to="/admin" className="admin-link" style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>Panel Admin</Link>
          )}
        </nav>
        
        <div className="navbar-actions">
          <div className="search-bar-container" ref={containerRef}>
            <div className="search-bar">
              <FiSearch 
                className="search-icon" 
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  if (searchQuery.trim()) {
                    navigate(`/catalogo?equipo=${encodeURIComponent(searchQuery.trim())}`);
                    setSearchQuery('');
                    setShowSuggestions(false);
                  }
                }}
              />
              <input 
                type="text" 
                placeholder="Buscar productos..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={() => {
                  if (searchQuery.trim().length >= 2) {
                    setShowSuggestions(true);
                  }
                }}
              />
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions-dropdown">
                {suggestions.map((prod) => (
                  <div 
                    key={prod.idProducto} 
                    className="suggestion-item"
                    onClick={() => {
                      navigate(`/catalogo/productos/${prod.idProducto}`);
                      setSearchQuery('');
                      setShowSuggestions(false);
                    }}
                  >
                    <div className="suggestion-img">
                      {prod.fotoUrl ? (
                        <img src={getImageUrl(prod.fotoUrl)} alt={prod.nombre} />
                      ) : (
                        <div className="suggestion-img-placeholder" />
                      )}
                    </div>
                    <div className="suggestion-info">
                      <div className="suggestion-name">{prod.nombre}</div>
                      <div className="suggestion-meta">
                        <span className="suggestion-club">{prod.nombreClub}</span>
                        <span className="suggestion-price">${prod.precio.toLocaleString('es-AR')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showSuggestions && searchQuery.trim().length >= 2 && suggestions.length === 0 && (
              <div className="search-suggestions-dropdown no-suggestions">
                No se encontraron productos
              </div>
            )}
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
