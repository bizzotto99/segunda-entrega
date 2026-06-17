import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { fetchApi, getImageUrl } from '../services/api';
import { FiUser, FiShoppingBag, FiHeart, FiLogOut, FiInbox, FiMapPin, FiCalendar, FiShield, FiPackage, FiStar, FiAward } from 'react-icons/fi';
import './Perfil.css';

const Perfil = () => {
  const navigate = useNavigate();
  const { user, token, isLoading, logout } = useAuth();
  const { resetCart } = useCart();
  
  const [activeTab, setActiveTab] = useState('datos');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [loadingInventario, setLoadingInventario] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Cargar órdenes cuando se selecciona la pestaña de compras
  useEffect(() => {
    if (activeTab === 'compras' && token) {
      const loadOrders = async () => {
        try {
          setLoadingOrders(true);
          const data = await fetchApi('/ordenes');
          setOrders(data || []);
        } catch (error) {
          console.error("Error al cargar órdenes:", error);
        } finally {
          setLoadingOrders(false);
        }
      };
      loadOrders();
    }
  }, [activeTab, token]);

  useEffect(() => {
    if (activeTab === 'guardarropas' && token) {
      const loadInventario = async () => {
        try {
          setLoadingInventario(true);
          const data = await fetchApi('/ordenes/inventario');
          setInventario(data || []);
        } catch (error) {
          console.error("Error al cargar inventario:", error);
        } finally {
          setLoadingInventario(false);
        }
      };
      loadInventario();
    }
  }, [activeTab, token]);

  // Cargar favoritos del localStorage
  useEffect(() => {
    if (activeTab === 'favoritos') {
      const storedFavs = JSON.parse(localStorage.getItem('favoritos')) || [];
      setFavorites(storedFavs);
    }
  }, [activeTab]);

  const handleLogout = () => {
    logout();
    resetCart();
    navigate('/login');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading && !user) {
    return (
      <div className="profile-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-grid">
          
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-avatar">
              {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2 className="profile-username">{user.nombre} {user.apellido}</h2>
            <p className="profile-email">@{user.username}</p>
            
            <nav className="profile-nav">
              <button 
                className={`profile-nav-btn ${activeTab === 'datos' ? 'active' : ''}`}
                onClick={() => setActiveTab('datos')}
              >
                <FiUser size={18} /> Mis Datos
              </button>
              
              {user.rol !== 'VENDEDOR' && (
                <>
                  <button
                    className={`profile-nav-btn ${activeTab === 'compras' ? 'active' : ''}`}
                    onClick={() => setActiveTab('compras')}
                  >
                    <FiShoppingBag size={18} /> Mis Compras
                  </button>

                  <button
                    className={`profile-nav-btn ${activeTab === 'guardarropas' ? 'active' : ''}`}
                    onClick={() => setActiveTab('guardarropas')}
                  >
                    <FiPackage size={18} /> Mi Guardarropas
                  </button>

                  <button
                    className={`profile-nav-btn ${activeTab === 'favoritos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('favoritos')}
                  >
                    <FiHeart size={18} /> Favoritos
                  </button>
                </>
              )}
            </nav>
            
            <button onClick={handleLogout} className="logout-btn">
              <FiLogOut size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Cerrar Sesión
            </button>
          </aside>
          
          {/* Content Area */}
          <main className="profile-content">
            
            {/* Tab: Mis Datos */}
            {activeTab === 'datos' && (
              <div>
                <h3 className="content-title">Datos Personales</h3>
                <div className="info-grid">
                  <div className="info-card">
                    <div className="info-label">Nombre Completo</div>
                    <div className="info-value">{user.nombre} {user.apellido}</div>
                  </div>
                  
                  <div className="info-card">
                    <div className="info-label">Nombre de Usuario</div>
                    <div className="info-value">@{user.username}</div>
                  </div>
                  
                  <div className="info-card">
                    <div className="info-label">Email</div>
                    <div className="info-value">{user.email}</div>
                  </div>
                  
                  <div className="info-card">
                    <div className="info-label">Rol de Usuario</div>
                    <div className="info-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FiShield color="#60a5fa" />
                      {user.rol || 'COMPRADOR'}
                    </div>
                  </div>
                  
                  <div className="info-card" style={{ gridColumn: '1 / -1' }}>
                    <div className="info-label">Miembro Desde</div>
                    <div className="info-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FiCalendar color="#60a5fa" />
                      {user.fechaRegistro ? formatDate(user.fechaRegistro) : 'Recientemente'}
                    </div>
                  </div>
                  {user.rol === 'VENDEDOR' && (
                    <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', gridColumn: '1 / -1' }}>
                      <Link 
                        to="/admin" 
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '10px',
                          background: 'linear-gradient(135deg, var(--color-accent) 0%, #1d4ed8 100%)',
                          color: 'white',
                          padding: '12px 24px',
                          borderRadius: '12px',
                          fontWeight: '700',
                          textDecoration: 'none',
                          boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
                          transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                      >
                        <FiShield /> Ir al Panel de Administración
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Tab: Mis Compras */}
            {activeTab === 'compras' && (
              <div>
                <h3 className="content-title">Historial de Compras</h3>
                
                {loadingOrders ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                    <div className="spinner"></div>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="orders-list">
                    {orders.map((order) => (
                      <div className="order-card" key={order.idOrden}>
                        <div className="order-header">
                          <span className="order-id">Orden #{order.idOrden}</span>
                          <span className="order-date">
                            <FiCalendar style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                            {formatDate(order.fecha)}
                          </span>
                          <span className={`order-status ${(order.estado || 'PENDIENTE').toLowerCase()}`}>
                            {order.estado || 'Pendiente'}
                          </span>
                        </div>
                        
                        <div className="order-body">
                          {order.direccionEntrega && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a0aec0', fontSize: '0.9rem', marginBottom: '15px' }}>
                              <FiMapPin /> Entregar en: {order.direccionEntrega}
                            </div>
                          )}
                          
                          {order.detalles && order.detalles.map((item) => (
                            <div className="order-item" key={item.idDetalle}>
                              <span>{item.nombreProducto} (Talle {item.talle || 'M'}) x {item.cantidad}</span>
                              <span>{formatCurrency(item.subtotal || (item.precioUnitario * item.cantidad))}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="order-footer">
                          <span className="order-total-label">Total pagado</span>
                          <span className="order-total-val">{formatCurrency(order.total)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data">
                    <FiInbox className="no-data-icon" />
                    <p>Aún no has realizado ninguna compra en nuestra tienda.</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Tab: Mi Guardarropas */}
            {activeTab === 'guardarropas' && (
              <div>
                <h3 className="content-title">Mi Guardarropas</h3>

                <div className="wardrobe-stats">
                  <div className="wardrobe-stat-card">
                    <FiPackage size={22} className="wardrobe-stat-icon" />
                    <div>
                      <div className="wardrobe-stat-value">{inventario.reduce((acc, c) => acc + c.cantidad, 0)}</div>
                      <div className="wardrobe-stat-label">Camisetas</div>
                    </div>
                  </div>
                  <div className="wardrobe-stat-card">
                    <FiStar size={22} className="wardrobe-stat-icon" />
                    <div>
                      <div className="wardrobe-stat-value">{user.points || 0}</div>
                      <div className="wardrobe-stat-label">Puntos</div>
                    </div>
                  </div>
                  <div className="wardrobe-stat-card">
                    <FiAward size={22} className="wardrobe-stat-icon" />
                    <div>
                      <div className="wardrobe-stat-value">{inventario.length}</div>
                      <div className="wardrobe-stat-label">Modelos únicos</div>
                    </div>
                  </div>
                </div>

                {loadingInventario ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                    <div className="spinner"></div>
                  </div>
                ) : inventario.length > 0 ? (
                  <div className="wardrobe-grid">
                    {inventario.map((camiseta, idx) => (
                      <div className="wardrobe-card" key={`${camiseta.idProducto}-${camiseta.talle}-${idx}`}>
                        <div className="wardrobe-card-image-container">
                          {camiseta.fotoUrl ? (
                            <img src={getImageUrl(camiseta.fotoUrl)} alt={camiseta.nombre} className="wardrobe-card-image" />
                          ) : (
                            <div className="wardrobe-card-image" style={{ background: '#1a1f38' }} />
                          )}
                          {camiseta.cantidad > 1 && (
                            <span className="wardrobe-quantity-badge">x{camiseta.cantidad}</span>
                          )}
                        </div>
                        <div className="wardrobe-card-info">
                          <span className="wardrobe-card-club">{camiseta.club}</span>
                          <h4 className="wardrobe-card-name">{camiseta.nombre}</h4>
                          <div className="wardrobe-card-footer">
                            <span className="wardrobe-card-talle">Talle {camiseta.talle}</span>
                            <span className="wardrobe-card-fecha">
                              {new Date(camiseta.fechaAdquisicion).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data">
                    <FiPackage className="no-data-icon" />
                    <p>Todavía no tenés camisetas en tu guardarropas. ¡Hacé tu primera compra!</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Favoritos */}
            {activeTab === 'favoritos' && (
              <div>
                <h3 className="content-title">Mis Favoritos</h3>
                
                {favorites.length > 0 ? (
                  <div className="favorites-grid">
                    {favorites.map((fav) => (
                      <div 
                        key={fav.idProducto} 
                        style={{ 
                          background: 'rgba(0,0,0,0.2)', 
                          borderRadius: '12px', 
                          border: '1px solid rgba(255,255,255,0.05)',
                          overflow: 'hidden'
                        }}
                      >
                        <div style={{ height: '160px', overflow: 'hidden', background: '#1a1f38', position: 'relative' }}>
                          <img 
                            src={getImageUrl(fav.fotoUrl) || 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=400'} 
                            alt={fav.nombre}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <button 
                            onClick={() => {
                              const updated = favorites.filter(f => f.idProducto !== fav.idProducto);
                              setFavorites(updated);
                              localStorage.setItem('favoritos', JSON.stringify(updated));
                            }}
                            style={{ 
                              position: 'absolute', top: '10px', right: '10px', 
                              background: 'rgba(0, 0, 0, 0.6)', color: '#60a5fa',
                              width: '32px', height: '32px', borderRadius: '50%',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                            title="Quitar de favoritos"
                          >
                            <FiHeart fill="#60a5fa" size={16} />
                          </button>
                        </div>
                        
                        <div style={{ padding: '15px' }}>
                          <span style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: '600', textTransform: 'uppercase' }}>
                            {fav.nombreClub || 'Camiseta'}
                          </span>
                          <h4 style={{ fontSize: '0.95rem', margin: '5px 0 10px 0', height: '38px', overflow: 'hidden' }}>{fav.nombre}</h4>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '700', fontSize: '1.05rem' }}>{formatCurrency(fav.precio)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data">
                    <FiHeart className="no-data-icon" />
                    <p>No tienes camisetas en tus favoritos.</p>
                  </div>
                )}
              </div>
            )}
            
          </main>
          
        </div>
      </div>
    </div>
  );
};

export default Perfil;
