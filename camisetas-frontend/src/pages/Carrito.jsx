import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, useCart } from '../redux/hooks';
import { fetchApi, getImageUrl } from '../services/api';
import { 
  FiTrash2, FiShoppingBag, FiMapPin, FiCheckCircle, 
  FiChevronRight, FiCreditCard, FiArrowLeft, FiLock 
} from 'react-icons/fi';
import './Carrito.css';

const Carrito = () => {
  const navigate = useNavigate();
  const { token, user, fetchProfile } = useAuth();
  const { items, total, isLoading, fetchCart, updateQuantity, removeFromCart, clearCart } = useCart();

  const [direccion, setDireccion] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Estados de la pasarela de pago simulada
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Envío, 2: Pago, 3: Procesando
  const [processingMessage, setProcessingMessage] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [cardType, setCardType] = useState('unknown');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

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

  // Detector de tipo de tarjeta de crédito (Visa, Mastercard, Amex)
  const detectCardType = (num) => {
    const cleanNum = num.replace(/\D/g, '');
    if (cleanNum.startsWith('4')) return 'visa';
    if (/^(5[1-5]|2[2-7])/.test(cleanNum)) return 'mastercard';
    if (/^3[47]/.test(cleanNum)) return 'amex';
    return 'unknown';
  };

  // Manejar el formateo del número de tarjeta (espacio cada 4 dígitos)
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    
    const matches = value.match(/.{1,4}/g);
    const formatted = matches ? matches.join(' ') : '';
    
    setCardData(prev => ({ ...prev, number: formatted }));
    setCardType(detectCardType(value));
  };

  // Manejar el formateo de la fecha de vencimiento (MM/YY)
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    
    let formatted = value;
    if (value.length > 2) {
      formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    
    setCardData(prev => ({ ...prev, expiry: formatted }));
  };

  // Manejar el CVV (3 o 4 dígitos de seguridad)
  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    const maxLen = cardType === 'amex' ? 4 : 3;
    if (value.length > maxLen) value = value.slice(0, maxLen);
    setCardData(prev => ({ ...prev, cvv: value }));
  };

  // Paso 1 -> Paso 2
  const handleGoToPayment = (e) => {
    e.preventDefault();
    if (!token) {
      navigate('/login?redirect=carrito');
      return;
    }
    if (!direccion.trim()) {
      setError("Por favor, ingresa una dirección de entrega.");
      return;
    }
    setError(null);
    setCheckoutStep(2);
  };

  // Confirmación final del pago (Simulado + checkout backend)
  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    
    // Validaciones de tarjeta
    const cleanCardNum = cardData.number.replace(/\s/g, '');
    const minCardLen = cardType === 'amex' ? 15 : 16;
    if (cleanCardNum.length < minCardLen) {
      setError(`Número de tarjeta inválido. Debe tener ${minCardLen} dígitos.`);
      return;
    }
    if (!cardData.name.trim()) {
      setError("Por favor, ingresa el nombre del titular.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
      setError("Fecha de vencimiento inválida. Formato requerido: MM/YY.");
      return;
    }

    const [mm, yy] = cardData.expiry.split('/');
    const mmInt = parseInt(mm, 10);
    if (mmInt < 1 || mmInt > 12) {
      setError("Mes de vencimiento inválido. Debe estar entre 01 y 12.");
      return;
    }

    const cleanCvv = cardData.cvv.replace(/\D/g, '');
    const minCvvLen = cardType === 'amex' ? 4 : 3;
    if (cleanCvv.length < minCvvLen) {
      setError(`CVV inválido. Debe tener ${minCvvLen} dígitos para esta tarjeta.`);
      return;
    }

    try {
      setCheckoutLoading(true);
      setError(null);
      setCheckoutStep(3); // Mostrar pantalla de carga de procesamiento
      
      // Simulación de fases de pago
      setProcessingMessage("Conectando con la pasarela de pago segura...");
      await new Promise(r => setTimeout(r, 1000));
      
      setProcessingMessage("Verificando fondos y validez de la tarjeta...");
      await new Promise(r => setTimeout(r, 1000));
      
      setProcessingMessage("Confirmando orden de compra con el servidor...");
      await new Promise(r => setTimeout(r, 800));
      
      // Llamada real al backend para consolidar orden y descontar stock
      const response = await fetchApi('/ordenes/checkout', {
        method: 'POST',
        body: JSON.stringify({ direccionEntrega: direccion }),
      });

      if (response && response.idOrden) {
        setCheckoutSuccess(true);
        clearCart();
        try {
          await fetchProfile();
        } catch (profileErr) {
          console.error("Error al actualizar perfil de usuario tras compra:", profileErr);
        }
      } else {
        throw new Error("No se pudo procesar la orden.");
      }
    } catch (err) {
      console.error("Error en checkout simulado:", err);
      setError(err.message || "Error al procesar el pago. Verifica el stock.");
      setCheckoutStep(2); // Regresa al paso de pago para poder reintentar
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

  const costoEnvio = total > 100000 ? 0 : 5000;
  const granTotal = total + costoEnvio;

  if (checkoutSuccess) {
    return (
      <div className="carrito-page success-view">
        <div className="container success-card">
          <FiCheckCircle className="success-icon animate-pop" />
          <h2>¡Pedido Realizado con Éxito!</h2>
          <p>Tu orden ha sido procesada de manera correcta y tu pago simulado fue aprobado.</p>
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
        {/* Indicador de pasos de Checkout */}
        {items.length > 0 && token && (
          <div className="checkout-steps">
            <div className={`step-item ${checkoutStep >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Envío</span>
            </div>
            <div className={`step-line ${checkoutStep >= 2 ? 'active' : ''}`}></div>
            <div className={`step-item ${checkoutStep >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Pago</span>
            </div>
            <div className={`step-line ${checkoutStep >= 3 ? 'active' : ''}`}></div>
            <div className={`step-item ${checkoutStep === 3 ? 'active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Procesando</span>
            </div>
          </div>
        )}

        <h1 className="carrito-title">
          {checkoutStep === 1 ? 'Tu Carrito' : checkoutStep === 2 ? 'Detalle de Pago' : 'Procesando Pago'}
        </h1>

        {isLoading && items.length === 0 ? (
          <div className="carrito-loading">
            <div className="loader-spinner"></div>
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
            
            {/* Lado izquierdo: Lista de productos en Paso 1, Tarjeta de crédito en Paso 2 y 3 */}
            <div className="carrito-items-section">
              {checkoutStep === 1 && (
                <>
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
                </>
              )}

              {checkoutStep === 2 && (
                <div className="payment-gateway-container">
                  {/* Tarjeta de crédito Virtual (Vista previa en tiempo real) */}
                  <div className="card-preview-wrapper">
                    <div className={`virtual-card ${focusedField === 'cvv' ? 'flipped' : ''} ${cardType}`}>
                      <div className="card-front">
                        <div className="card-glass-glow"></div>
                        <div className="card-chip-container">
                          <div className="card-chip"></div>
                          <div className="card-wireless"></div>
                        </div>
                        <div className="card-number-display">
                          {cardData.number || '•••• •••• •••• ••••'}
                        </div>
                        <div className="card-details-row">
                          <div className="card-holder-name">
                            <span className="card-label">Tarjetahabiente</span>
                            <span className="card-value">{cardData.name.toUpperCase() || 'NOMBRE DEL TITULAR'}</span>
                          </div>
                          <div className="card-expiry-date">
                            <span className="card-label">Vence</span>
                            <span className="card-value">{cardData.expiry || 'MM/YY'}</span>
                          </div>
                          <div className="card-type-icon">
                            {cardType === 'visa' && <span className="card-brand visa">VISA</span>}
                            {cardType === 'mastercard' && <span className="card-brand mastercard">MC</span>}
                            {cardType === 'amex' && <span className="card-brand amex">AMEX</span>}
                            {cardType === 'unknown' && <span className="card-brand generic">CARD</span>}
                          </div>
                        </div>
                      </div>
                      <div className="card-back">
                        <div className="card-glass-glow"></div>
                        <div className="card-strip"></div>
                        <div className="card-cvv-box">
                          <span className="card-label">CVV</span>
                          <div className="card-cvv-white-strip">
                            <span className="card-cvv-display">{cardData.cvv || '•••'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Formulario de Pago Seguro */}
                  <form onSubmit={handleConfirmPayment} className="payment-form">
                    <h3 className="payment-form-title">
                      <FiLock className="lock-icon" /> Pago Seguro SSL
                    </h3>

                    <div className="form-group">
                      <label htmlFor="cardNumber">Número de Tarjeta</label>
                      <div className="input-with-icon">
                        <FiCreditCard className="input-icon" />
                        <input
                          id="cardNumber"
                          type="text"
                          placeholder="4000 1234 5678 9010"
                          value={cardData.number}
                          onChange={handleCardNumberChange}
                          onFocus={() => setFocusedField('number')}
                          onBlur={() => setFocusedField(null)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="cardName">Nombre del Titular (como figura en la tarjeta)</label>
                      <input
                        id="cardName"
                        type="text"
                        placeholder="JUAN PEREZ"
                        value={cardData.name}
                        onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        required
                      />
                    </div>

                    <div className="form-row-payment">
                      <div className="form-group">
                        <label htmlFor="cardExpiry">Vencimiento</label>
                        <input
                          id="cardExpiry"
                          type="text"
                          placeholder="MM/YY"
                          value={cardData.expiry}
                          onChange={handleExpiryChange}
                          onFocus={() => setFocusedField('expiry')}
                          onBlur={() => setFocusedField(null)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="cardCvv">CVC / CVV</label>
                        <input
                          id="cardCvv"
                          type="password"
                          placeholder="123"
                          value={cardData.cvv}
                          onChange={handleCvvChange}
                          onFocus={() => setFocusedField('cvv')}
                          onBlur={() => setFocusedField(null)}
                          required
                        />
                      </div>
                    </div>

                    {error && <p className="checkout-error">{error}</p>}

                    <div className="payment-actions">
                      <button 
                        type="button" 
                        onClick={() => setCheckoutStep(1)} 
                        className="btn-back-step"
                      >
                        <FiArrowLeft /> Volver a Envío
                      </button>
                      <button 
                        type="submit" 
                        className="btn-confirm-payment"
                      >
                        Confirmar y Pagar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {checkoutStep === 3 && (
                <div className="payment-processing-container">
                  <div className="loader-spinner large"></div>
                  <h3 className="processing-title">Procesando Transacción Bancaria</h3>
                  <p className="processing-status-msg">{processingMessage}</p>
                  <span className="secure-shield-label">
                    <FiLock /> Transacción encriptada con tecnología AES-256
                  </span>
                </div>
              )}
            </div>

            {/* Lado derecho: Resumen de compra */}
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

                {costoEnvio > 0 && checkoutStep === 1 && (
                  <p className="shipping-hint">
                    ¡Agrega <b>{formatCurrency(100000 - total)}</b> más para tener envío GRATIS!
                  </p>
                )}

                <div className="summary-divider"></div>

                <div className="summary-row total-row">
                  <span>Total</span>
                  <span>{formatCurrency(granTotal)}</span>
                </div>

                {/* Formulario de envío (Dirección) */}
                {checkoutStep === 1 && (
                  <div className="checkout-form-container">
                    {token ? (
                      <form onSubmit={handleGoToPayment} className="checkout-form">
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
                        >
                          Continuar al Pago <FiChevronRight />
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
                )}
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
