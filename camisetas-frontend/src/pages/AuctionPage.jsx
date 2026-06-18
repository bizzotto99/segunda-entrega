import React, { useState, useEffect } from 'react';
import { useAuth } from '../redux/hooks';
import { fetchApi, getImageUrl } from '../services/api';
import { 
  FiClock, FiTrendingUp, FiUser, FiInfo, FiTag, FiHeart,
  FiChevronLeft, FiCheckCircle, FiDollarSign, FiAlertCircle, FiShield
} from 'react-icons/fi';
import './AuctionPage.css';

const AuctionPage = () => {
  const { token, user } = useAuth();
  
  // Data States
  const [subastas, setSubastas] = useState([]);
  const [selectedSubasta, setSelectedSubasta] = useState(null);
  const [ofertas, setOfertas] = useState([]);
  
  // Form/Input States
  const [montoOferta, setMontoOferta] = useState('');
  const [clientError, setClientError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [serverError, setServerError] = useState('');

  // Shipping Form States for Winner
  const [direccionEnvio, setDireccionEnvio] = useState('');
  const [cpEnvio, setCpEnvio] = useState('');
  const [envioLoading, setEnvioLoading] = useState(false);
  const [envioError, setEnvioError] = useState('');
  const [envioSuccessMsg, setEnvioSuccessMsg] = useState('');
  
  // Loading States
  const [loading, setLoading] = useState(true);
  const [biddingLoading, setBiddingLoading] = useState(false);
  
  // Mobile UI state
  const [showDetailMobile, setShowDetailMobile] = useState(false);
  
  // Favorites State
  const [favorites, setFavorites] = useState({});
  
  // Active filter state
  const [activeFilter, setActiveFilter] = useState('todas');
  
  // Global clock ticker for countdowns
  const [nowTime, setNowTime] = useState(new Date().getTime());

  useEffect(() => {
    const ticker = setInterval(() => {
      setNowTime(new Date().getTime());
    }, 1000);
    return () => clearInterval(ticker);
  }, []);

  // Fetch all auctions
  const fetchSubastas = async (selectId = null) => {
    try {
      setLoading(true);
      const data = await fetchApi('/subastas');
      setSubastas(data || []);
      
      if (data && data.length > 0) {
        if (selectId) {
          const match = data.find(s => s.idSubasta === selectId);
          setSelectedSubasta(match || data[0]);
        } else if (!selectedSubasta) {
          // Default to the first active subasta, or the first one if none active
          const active = data.find(s => s.estado === 'ACTIVA');
          setSelectedSubasta(active || data[0]);
        } else {
          // Re-select the currently selected one to get fresh data
          const current = data.find(s => s.idSubasta === selectedSubasta.idSubasta);
          setSelectedSubasta(current || data[0]);
        }
      } else {
        setSelectedSubasta(null);
      }
    } catch (err) {
      console.error('Error al cargar subastas:', err);
      setServerError('Error al cargar las subastas del servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubastas();
  }, []);

  // Fetch offers for the selected auction
  const fetchOfertas = async (idSubasta) => {
    if (!idSubasta) return;
    try {
      const data = await fetchApi(`/subastas/${idSubasta}/ofertas`);
      setOfertas(data || []);
    } catch (err) {
      console.error('Error al cargar ofertas:', err);
    }
  };

  useEffect(() => {
    if (selectedSubasta) {
      fetchOfertas(selectedSubasta.idSubasta);
      setMontoOferta('');
      setClientError('');
      setSuccessMsg('');
      setServerError('');
    }
  }, [selectedSubasta]);

  // Handle offer submission
  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!token) {
      setClientError('Debes iniciar sesión para ofertar.');
      return;
    }
    if (!selectedSubasta) return;

    const monto = parseFloat(montoOferta);
    if (isNaN(monto) || monto <= 0) {
      setClientError('Ingresa un monto numérico válido.');
      return;
    }

    if (monto <= selectedSubasta.precioActual) {
      setClientError(`La oferta debe ser mayor al precio actual ($${selectedSubasta.precioActual.toLocaleString('es-AR')}).`);
      return;
    }

    setClientError('');
    setServerError('');
    setSuccessMsg('');
    setBiddingLoading(true);

    try {
      await fetchApi(`/subastas/${selectedSubasta.idSubasta}/ofertar`, {
        method: 'POST',
        body: JSON.stringify({ monto })
      });
      
      setSuccessMsg('¡Oferta realizada con éxito!');
      setMontoOferta('');
      await fetchSubastas(selectedSubasta.idSubasta);
    } catch (err) {
      console.error('Error al realizar oferta:', err);
      setServerError(err.message || 'Ocurrió un error al procesar tu oferta.');
    } finally {
      setBiddingLoading(false);
    }
  };

  // Handle shipping data submission for won auction
  const handleConfirmEnvio = async (e) => {
    e.preventDefault();
    if (!direccionEnvio.trim() || !cpEnvio.trim()) {
      setEnvioError('Por favor ingresa la dirección y el código postal.');
      return;
    }
    setEnvioLoading(true);
    setEnvioError('');
    setEnvioSuccessMsg('');
    try {
      await fetchApi(`/subastas/${selectedSubasta.idSubasta}/envio`, {
        method: 'POST',
        body: JSON.stringify({
          direccion: direccionEnvio.trim(),
          codigoPostal: cpEnvio.trim()
        })
      });
      setEnvioSuccessMsg('¡Datos de envío registrados y compra generada con éxito!');
      setDireccionEnvio('');
      setCpEnvio('');
      await fetchSubastas(selectedSubasta.idSubasta);
    } catch (err) {
      console.error('Error al registrar envío:', err);
      setEnvioError(err.message || 'Error al guardar los datos de envío.');
    } finally {
      setEnvioLoading(false);
    }
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getSubastaStatus = (sub) => {
    const start = new Date(sub.fechaInicio).getTime();
    const end = new Date(sub.fechaFin).getTime();
    
    if (sub.estado === 'FINALIZADA' || nowTime >= end) {
      return 'FINALIZADA';
    }
    if (nowTime < start) {
      return 'PROXIMA';
    }
    const oneDay = 24 * 60 * 60 * 1000;
    if (end - nowTime <= oneDay) {
      return 'POR_TERMINAR';
    }
    return 'EN_VIVO';
  };

  const formatCountdownStr = (endTimeStr) => {
    const end = new Date(endTimeStr).getTime();
    const diff = end - nowTime;
    if (diff <= 0) return '00:00:00';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCountdownParts = (endTimeStr) => {
    const end = new Date(endTimeStr).getTime();
    const diff = end - nowTime;
    if (diff <= 0) return { hours: '00', minutes: '00', seconds: '00', ended: true };
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      ended: false
    };
  };

  const getRelativeTime = (dateStr) => {
    const date = new Date(dateStr);
    const diffMs = nowTime - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'Hace instantes';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours} h`;
    return date.toLocaleDateString('es-AR');
  };

  const getProgressPercent = (sub) => {
    const start = new Date(sub.fechaInicio).getTime();
    const end = new Date(sub.fechaFin).getTime();
    const total = end - start;
    const elapsed = nowTime - start;
    if (total <= 0) return 100;
    return Math.max(0, Math.min(100, (elapsed / total) * 100));
  };

  // Filter products list
  const filteredSubastas = subastas.filter(sub => {
    const status = getSubastaStatus(sub);
    if (activeFilter === 'todas') return true;
    if (activeFilter === 'en-vivo') return status === 'EN_VIVO' || status === 'POR_TERMINAR';
    if (activeFilter === 'por-terminar') return status === 'POR_TERMINAR';
    if (activeFilter === 'proximas') return status === 'PROXIMA';
    if (activeFilter === 'finalizadas') return status === 'FINALIZADA';
    return true;
  });

  if (loading && subastas.length === 0) {
    return (
      <div className="auction-page">
        <div className="mb-center">
          <div className="spinner-neon"></div>
        </div>
      </div>
    );
  }

  const isFinalizada = selectedSubasta?.estado === 'FINALIZADA' || 
    (selectedSubasta && new Date(selectedSubasta.fechaFin).getTime() <= nowTime);

  const selectedParts = selectedSubasta ? getCountdownParts(selectedSubasta.fechaFin) : null;
  const selectedProgress = selectedSubasta ? getProgressPercent(selectedSubasta) : 0;
  const selectedStatus = selectedSubasta ? getSubastaStatus(selectedSubasta) : null;

  return (
    <div className={`auction-page ${showDetailMobile ? 'show-detail-mobile' : ''}`}>
      <div className={`auction-container container ${!selectedSubasta ? 'no-selection' : ''}`}>
        
        {/* LEFT COLUMN: LIST PANEL */}
        <div className="auction-list-panel">
          <div className="list-panel-header">
            <h1 className="list-title">Subastas en vivo</h1>
            <p className="list-subtitle">Pujá por camisetas únicas y llevate piezas históricas.</p>
          </div>

          {/* Filters Bar */}
          <div className="filters-bar">
            {['todas', 'en-vivo', 'por-terminar', 'proximas', 'finalizadas'].map((f) => (
              <button
                key={f}
                className={`filter-pill ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f === 'todas' && 'Todas'}
                {f === 'en-vivo' && 'En vivo'}
                {f === 'por-terminar' && 'Por terminar'}
                {f === 'proximas' && 'Próximas'}
                {f === 'finalizadas' && 'Finalizadas'}
              </button>
            ))}
          </div>

          {/* Grid list */}
          {filteredSubastas.length === 0 ? (
            <div className="empty-filter-container">
              <FiAlertCircle size={36} className="empty-icon" />
              <p>No se encontraron subastas en esta categoría.</p>
            </div>
          ) : (
            <div className="auction-grid">
              {filteredSubastas.map((sub) => {
                const status = getSubastaStatus(sub);
                const isFav = !!favorites[sub.idSubasta];
                
                return (
                  <div 
                    key={sub.idSubasta} 
                    className={`auction-card ${selectedSubasta?.idSubasta === sub.idSubasta ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedSubasta(sub);
                      setShowDetailMobile(true);
                    }}
                  >
                    {/* Badge */}
                    <div className={`status-badge status-${status.toLowerCase()}`}>
                      {status === 'EN_VIVO' && 'EN VIVO'}
                      {status === 'POR_TERMINAR' && 'POR TERMINAR'}
                      {status === 'PROXIMA' && 'PRÓXIMA'}
                      {status === 'FINALIZADA' && 'FINALIZADA'}
                    </div>

                    {/* Favorite Button */}
                    <button 
                      className={`card-fav-btn ${isFav ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(sub.idSubasta);
                      }}
                    >
                      <FiHeart className="heart-icon" />
                    </button>

                    {/* Image */}
                    <div className="card-img-box">
                      {sub.producto?.fotoUrl ? (
                        <img src={getImageUrl(sub.producto.fotoUrl)} alt={sub.producto.nombre} />
                      ) : (
                        <div className="card-img-placeholder" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="card-info">
                      <h3 className="card-jersey-title">{sub.producto?.nombre}</h3>
                      <p className="card-jersey-subtitle">
                        {sub.producto?.nombreClub}
                      </p>

                      <div className="card-price-offers">
                        <div className="card-price-block">
                          <span className="lbl">Oferta actual</span>
                          <span className="val">${sub.precioActual?.toLocaleString('es-AR')}</span>
                        </div>
                        <div className="card-offers-count">
                          <FiUser className="user-icon" />
                          <span>{sub.cantidadOfertas || 0} ofertas</span>
                        </div>
                      </div>

                      {/* Remaining Time Box */}
                      <div className="card-timer-box">
                        <FiClock className="timer-icon" />
                        <div className="timer-info">
                          {status === 'FINALIZADA' ? (
                            <span className="timer-val ended">Finalizada</span>
                          ) : status === 'PROXIMA' ? (
                            <span className="timer-val upcoming">Empieza pronto</span>
                          ) : (
                            <span className="timer-val active">{formatCountdownStr(sub.fechaFin)}</span>
                          )}
                          <span className="timer-lbl">Tiempo restante</span>
                        </div>
                      </div>

                      <button className="btn-view-auction">
                        Ver subasta
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: DETAIL PANEL */}
        <div className="auction-detail-panel">
          {selectedSubasta ? (
            <div className="detail-panel-content">
              {/* Back mobile link */}
              <button 
                className="mobile-back-link"
                onClick={() => {
                  setShowDetailMobile(false);
                  setSelectedSubasta(null);
                }}
              >
                <FiChevronLeft /> Volver a subastas
              </button>

              {/* Main Winner Banner */}
              {isFinalizada && (
                <div className="winner-banner">
                  <div className="winner-banner-icon">🏆</div>
                  <div className="winner-banner-text">
                    <h3>Subasta Finalizada</h3>
                    <p>
                      Ganador: <strong>{selectedSubasta.ganadorUsername || 'Ninguno (sin ofertas)'}</strong>
                    </p>
                    {selectedSubasta.ganadorUsername && (
                      <p className="winning-bid-amt">
                        Oferta ganadora: <strong>${selectedSubasta.precioActual?.toLocaleString('es-AR')}</strong>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Shipping Form Panel for Winner */}
              {isFinalizada && user && (selectedSubasta.idGanador === user.idUsuario || selectedSubasta.ganadorUsername === user.username) && (
                <div className="winner-shipping-panel">
                  {!selectedSubasta.envioRegistrado ? (
                    <div className="shipping-form-container">
                      <div className="shipping-form-header">
                        <h4>🎁 ¡Ganaste la subasta! Completa tus datos de envío</h4>
                        <p>Necesitamos tu dirección y código postal para enviarte la camiseta.</p>
                      </div>
                      <form onSubmit={handleConfirmEnvio} className="shipping-form">
                        <div className="shipping-inputs">
                          <div className="shipping-input-group-field">
                            <label htmlFor="direccionEnvio">Dirección de Entrega</label>
                            <input
                              id="direccionEnvio"
                              type="text"
                              placeholder="Calle, Número, Departamento, Ciudad, Provincia"
                              value={direccionEnvio}
                              onChange={(e) => setDireccionEnvio(e.target.value)}
                              disabled={envioLoading}
                              required
                            />
                          </div>
                          <div className="shipping-input-group-field">
                            <label htmlFor="cpEnvio">Código Postal</label>
                            <input
                              id="cpEnvio"
                              type="text"
                              placeholder="CP"
                              value={cpEnvio}
                              onChange={(e) => setCpEnvio(e.target.value)}
                              disabled={envioLoading}
                              required
                            />
                          </div>
                        </div>
                        <button 
                          type="submit" 
                          className="btn-shipping-submit"
                          disabled={envioLoading}
                        >
                          {envioLoading ? 'Registrando...' : 'Confirmar Envío'}
                        </button>
                      </form>
                      {envioError && <p className="envio-error-msg"><FiAlertCircle /> {envioError}</p>}
                    </div>
                  ) : (
                    <div className="shipping-success-banner">
                      <FiCheckCircle className="shipping-success-icon" />
                      <div className="shipping-success-text">
                        <h4>Datos de Envío Confirmados</h4>
                        <p>Pedido en preparación.</p>
                      </div>
                    </div>
                  )}
                  {envioSuccessMsg && <p className="envio-success-msg"><FiCheckCircle /> {envioSuccessMsg}</p>}
                </div>
              )}

              {/* Large Image Card */}
              <div className="detail-image-box">
                {selectedSubasta.producto?.fotoUrl ? (
                  <img src={getImageUrl(selectedSubasta.producto.fotoUrl)} alt={selectedSubasta.producto.nombre} className="detail-main-img" />
                ) : (
                  <div className="detail-img-placeholder" />
                )}
                <button 
                  className={`detail-fav-btn ${favorites[selectedSubasta.idSubasta] ? 'active' : ''}`}
                  onClick={() => toggleFavorite(selectedSubasta.idSubasta)}
                >
                  <FiHeart />
                </button>
              </div>

              {/* Header and badge */}
              <div className="detail-info-header">
                <span className={`detail-status-pill status-${selectedStatus.toLowerCase()}`}>
                  {selectedStatus === 'EN_VIVO' && 'EN VIVO'}
                  {selectedStatus === 'POR_TERMINAR' && 'POR TERMINAR'}
                  {selectedStatus === 'PROXIMA' && 'PRÓXIMA'}
                  {selectedStatus === 'FINALIZADA' && 'FINALIZADA'}
                </span>
                <h2 className="detail-title">{selectedSubasta.producto?.nombre}</h2>
                <p className="detail-subtitle">{selectedSubasta.producto?.descripcion}</p>
              </div>

              {/* Price Row */}
              <div className="detail-prices-box">
                <div className="price-item">
                  <span className="label">Precio actual</span>
                  <span className="value font-glow-cyan">${selectedSubasta.precioActual?.toLocaleString('es-AR')}</span>
                </div>
                {!isFinalizada && (
                  <div className="price-item align-right">
                    <span className="label">Próxima oferta mínima</span>
                    <span className="value value-min">${(selectedSubasta.precioActual + 1).toLocaleString('es-AR')}</span>
                  </div>
                )}
              </div>

              {/* Countdown digital clock panel */}
              <div className="detail-countdown-panel">
                <span className="countdown-label">Tiempo restante</span>
                
                <div className="countdown-digits">
                  <div className="digit-block">
                    <span className="digit-num">{selectedParts.hours}</span>
                    <span className="digit-label">HORAS</span>
                  </div>
                  <span className="digit-sep">:</span>
                  <div className="digit-block">
                    <span className="digit-num">{selectedParts.minutes}</span>
                    <span className="digit-label">MINUTOS</span>
                  </div>
                  <span className="digit-sep">:</span>
                  <div className="digit-block">
                    <span className="digit-num">{selectedParts.seconds}</span>
                    <span className="digit-label">SEGUNDOS</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="detail-progress-bar-bg">
                  <div 
                    className={`detail-progress-bar-fill status-${selectedStatus.toLowerCase()}`}
                    style={{ width: `${selectedProgress}%` }}
                  />
                </div>

                <div className={`countdown-status-text status-${selectedStatus.toLowerCase()}`}>
                  {selectedStatus === 'FINALIZADA' && 'La subasta ha finalizado'}
                  {selectedStatus === 'PROXIMA' && 'La subasta comenzará pronto'}
                  {selectedStatus === 'POR_TERMINAR' && 'La subasta termina pronto'}
                  {selectedStatus === 'EN_VIVO' && 'La subasta está en curso'}
                </div>
              </div>

              {/* Two columns: Bid and History */}
              <div className="detail-actions-grid">
                {/* Column 1: Place Bid */}
                <div className="actions-card-section">
                  <h3 className="section-title">Hacer una oferta</h3>
                  
                  {!token ? (
                    <div className="auth-alert">
                      <FiInfo size={16} />
                      <span>Iniciá sesión para realizar una oferta.</span>
                    </div>
                  ) : user && user.rol === 'VENDEDOR' ? (
                    <div className="auth-alert">
                      <FiInfo size={16} />
                      <span>Los administradores no pueden ofertar.</span>
                    </div>
                  ) : isFinalizada ? (
                    <div className="auth-alert">
                      <FiCheckCircle size={16} />
                      <span>Esta subasta ha finalizado.</span>
                    </div>
                  ) : (
                    <form onSubmit={handlePlaceBid} className="detail-bid-form">
                      <div className="detail-bid-input-wrap">
                        <label className="input-label">Tu oferta</label>
                        <div className="input-with-icon">
                          <input
                            type="number"
                            placeholder="Ingresá tu oferta"
                            value={montoOferta}
                            onChange={(e) => setMontoOferta(e.target.value)}
                            min={selectedSubasta.precioActual + 1}
                            disabled={biddingLoading}
                            required
                          />
                          <span className="symbol">$</span>
                        </div>
                        <span className="minimum-helper">
                          Mínimo: ${(selectedSubasta.precioActual + 1).toLocaleString('es-AR')}
                        </span>
                      </div>

                      <button 
                        type="submit" 
                        className="btn-place-bid-cyan"
                        disabled={biddingLoading}
                      >
                        {biddingLoading ? 'Procesando...' : 'Ofertar ahora'}
                      </button>
                    </form>
                  )}

                  {clientError && <p className="error-alert-text"><FiAlertCircle /> {clientError}</p>}
                  {serverError && <p className="error-alert-text"><FiAlertCircle /> {serverError}</p>}
                  {successMsg && <p className="success-alert-text"><FiCheckCircle /> {successMsg}</p>}

                  <div className="trust-badge-row">
                    <FiShield className="shield-icon" />
                    <div className="trust-info">
                      <span className="title">Ofertá con confianza</span>
                      <span className="desc">Tu oferta es segura y vinculante.</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Recent Bids */}
                <div className="actions-card-section">
                  <h3 className="section-title">Últimas ofertas</h3>

                  {ofertas.length === 0 ? (
                    <p className="no-offers-text">Aún no hay ofertas para esta camiseta.</p>
                  ) : (
                    <div className="bids-history-list">
                      {ofertas.slice(0, 5).map((o, idx) => (
                        <div key={o.idOferta} className="bid-history-row">
                          <span className="bidder-name">{o.usuarioUsername}</span>
                          <span className="bidder-amt">${o.monto?.toLocaleString('es-AR')}</span>
                          <span className="bidder-time">{getRelativeTime(o.fechaOferta)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {ofertas.length > 5 && (
                    <button className="btn-view-all-bids" onClick={() => {
                      alert("Historial Completo:\n" + ofertas.map(o => `${o.usuarioUsername}: $${o.monto?.toLocaleString('es-AR')} (${new Date(o.fechaOferta).toLocaleString('es-AR')})`).join('\n'));
                    }}>
                      Ver todas las ofertas
                    </button>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="no-selected-subasta">
              <p>Selecciona una subasta para ver sus detalles</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AuctionPage;
