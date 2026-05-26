import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { fetchApi, getImageUrl } from '../services/api';
import { FiTrash2, FiShoppingBag, FiMapPin, FiCheckCircle, FiChevronRight } from 'react-icons/fi';
import './Carrito.css';

const Carrito = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { items, total, isLoading, fetchCart, updateQuantity, removeFromCart, clearCart } = useCart();

  const [direccion, setDireccion] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Cargar el carrito al montar el componente
  useEffect(() => {
    if (user && user.rol === 'VENDEDOR') {
      navigate('/admin');
    } else {
      fetchCart();
    }
  }, [token, user, navigate]);

  const handleUpdateQuantity = (item, newQty) => {
    if (newQty < 1) {
      handleRemoveItem(item.idItem);
      return;
    }
    updateQuantity(item.idItem, item.idProducto, item.talle, newQty);
  };

  const handleRemoveItem = (idItem) => {
    removeFromCart(idItem);
  };

  const handleClear = () => {
    setShowConfirmClear(true);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }
    if (!direccion.trim()) {
      setError("Por favor, ingresa una dirección de entrega.");
      return;
    }

    try {
      setCheckoutLoading(true);
      setError(null);
      
      const response = await fetchApi('/ordenes/checkout', {
        method: 'POST',
        body: JSON.stringify({ direccionEntrega: direccion }),
      });

      if (response && response.idOrden) {
        setCheckoutSuccess(true);
        clearCart();
      } else {
        throw new Error("No se pudo procesar la orden.");
      }
    } catch (err) {
      console.error("Error en checkout:", err);
      setError(err.message || "Error al procesar el pedido. Verifica el stock.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Calcular envío: gratis si supera los $100.000 ARS, de lo contrario $5.000 ARS
  const costoEnvio = total > 100000 ? 0 : 5000;
  const granTotal = total + costoEnvio;

  if (checkoutSuccess) {
    return (
      <div className="carrito-page success-view">
        <div className="container success-card">
          <FiCheckCircle className="success-icon animate-pop" />
          <h2>¡Pedido Realizado con Éxito!</h2>
          <p>Tu orden ha sido procesada de manera correcta y ya estamos preparando tus camisetas.</p>
          <p className="success-details">
            Puedes consultar el estado de tu pedido en cualquier momento desde tu panel de usuario.
          </p>
          <div className="success-actions">
            <button onClick={() => navigate('/perfil')} className="btn-success-profile">
              Ver Mis Compras
            </button>
            <Link to="/catalogo" className="btn-success-catalog">
              Seguir Comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="carrito-page">
      <div className="container">
        <h1 className="carrito-title">Tu Carrito</h1>

        {isLoading && items.length === 0 ? (
          <div className="carrito-loading">
            <div className="spinner"></div>
            <p>Actualizando carrito...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="carrito-empty">
            <FiShoppingBag className="empty-icon" />
            <h2>Tu carrito está vacío</h2>
            <p>Explora nuestro catálogo y agrega tus camisetas oficiales favoritas.</p>
            <Link to="/catalogo" className="btn-explore">
              Explorar Catálogo <FiChevronRight />
            </Link>
          </div>
        ) : (
          <div className="carrito-layout">
            
            {/* Lado izquierdo: Lista de productos */}
            <div className="carrito-items-section">
              <div className="items-header">
                <span>Camisetas ({items.reduce((sum, i) => sum + i.cantidad, 0)})</span>
                <button onClick={handleClear} className="btn-clear-all">
                  Vaciar Carrito
                </button>
              </div>

              <div className="items-list">
                {items.map((item) => (
                  <div key={item.idItem} className="carrito-item-card">
                    <div className="item-img-container">
                      {item.fotoUrl ? (
                        <img src={getImageUrl(item.fotoUrl)} alt={item.nombreProducto} />
                      ) : (
                        <div className="item-img-placeholder"></div>
                      )}
                    </div>
                    
                    <div className="item-details">
                      <h4 className="item-name">{item.nombreProducto}</h4>
                      <p className="item-meta">Talle: <span className="meta-badge">{item.talle || 'Único'}</span></p>
                      <p className="item-price-unit">{formatCurrency(item.precioUnitario)} c/u</p>
                    </div>

                    <div className="item-qty-control">
                      <button 
                        onClick={() => handleUpdateQuantity(item, item.cantidad - 1)}
                        className="qty-btn"
                      >
                        -
                      </button>
                      <span className="qty-val">{item.cantidad}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item, item.cantidad + 1)}
                        className="qty-btn"
                      >
                        +
                      </button>
                    </div>

                    <div className="item-subtotal">
                      <span>{formatCurrency(item.precioUnitario * item.cantidad)}</span>
                    </div>

                    <button 
                      onClick={() => handleRemoveItem(item.idItem)} 
                      className="btn-remove-item"
                      title="Eliminar producto"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Lado derecho: Resumen de compra y Checkout */}
            <div className="carrito-summary-section">
              <div className="summary-card">
                <h3>Resumen de Compra</h3>
                
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Envío</span>
                  <span>{costoEnvio === 0 ? 'Gratis' : formatCurrency(costoEnvio)}</span>
                </div>

                {costoEnvio > 0 && (
                  <p className="shipping-hint">
                    ¡Agrega <b>{formatCurrency(100000 - total)}</b> más para tener envío GRATIS!
                  </p>
                )}

                <div className="summary-divider"></div>

                <div className="summary-row total-row">
                  <span>Total</span>
                  <span>{formatCurrency(granTotal)}</span>
                </div>

                {/* Formulario de Checkout */}
                <div className="checkout-form-container">
                  {token ? (
                    <form onSubmit={handleCheckout} className="checkout-form">
                      <div className="form-group">
                        <label htmlFor="direccion">
                          <FiMapPin style={{ marginRight: '6px', color: 'var(--color-accent)' }} /> 
                          Dirección de Entrega:
                        </label>
                        <input
                          id="direccion"
                          type="text"
                          placeholder="Calle, Número, Departamento, Ciudad"
                          value={direccion}
                          onChange={(e) => setDireccion(e.target.value)}
                          required
                        />
                      </div>
                      
                      {error && <p className="checkout-error">{error}</p>}
                      
                      <button 
                        type="submit" 
                        className="btn-checkout"
                        disabled={checkoutLoading}
                      >
                        {checkoutLoading ? 'Procesando...' : 'Finalizar Compra'}
                      </button>
                    </form>
                  ) : (
                    <div className="checkout-login-prompt">
                      <p>Inicia sesión en tu cuenta para poder finalizar la compra.</p>
                      <button 
                        onClick={() => navigate('/login?redirect=carrito')} 
                        className="btn-prompt-login"
                      >
                        Iniciar Sesión
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        )}
      </div>
      {showConfirmClear && (
        <div className="custom-confirm-modal-overlay">
          <div className="custom-confirm-modal">
            <h3>¿Vaciar Carrito?</h3>
            <p>¿Estás seguro de que deseas eliminar todas las camisetas de tu carrito? Esta acción no se puede deshacer.</p>
            <div className="confirm-modal-actions">
              <button 
                type="button" 
                className="btn-confirm-cancel" 
                onClick={() => setShowConfirmClear(false)}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn-confirm-accept" 
                onClick={() => {
                  clearCart();
                  setShowConfirmClear(false);
                }}
              >
                Sí, vaciar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;
