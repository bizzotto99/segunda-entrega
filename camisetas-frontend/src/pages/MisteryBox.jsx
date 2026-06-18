import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../redux/hooks';
import { fetchApi, getImageUrl } from '../services/api';
import { FiLock, FiGift, FiStar, FiZap, FiCheck, FiShield, FiAward, FiTrendingUp, FiInfo } from 'react-icons/fi';
import './MisteryBox.css';

const PUNTOS_NECESARIOS = 10000;

const MisteryBox = () => {
  const { token, fetchProfile } = useAuth();
  const navigate = useNavigate();
  const [estado, setEstado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [abriendo, setAbriendo] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [talleSeleccionado, setTalleSeleccionado] = useState(null);
  const [guardandoTalle, setGuardandoTalle] = useState(false);
  // idle | abriendo | elegirTalle | confirmado
  const [fase, setFase] = useState('idle');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    cargarEstado();
  }, [token]);

  const cargarEstado = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/mistery-box/estado');
      setEstado(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrir = async () => {
    if (abriendo) return;
    setAbriendo(true);
    setFase('abriendo');
    setResultado(null);
    setTalleSeleccionado(null);

    try {
      await new Promise(r => setTimeout(r, 2000));
      const data = await fetchApi('/mistery-box/abrir', { method: 'POST' });
      setResultado(data);
      setEstado(prev => ({ ...prev, puntosActuales: data.puntosRestantes }));
      await fetchProfile();
      // Si solo hay un talle disponible, lo preseleccionamos
      if (data.tallesDisponibles?.length === 1) {
        setTalleSeleccionado(data.tallesDisponibles[0]);
      }
      setFase('elegirTalle');
    } catch (e) {
      alert(e.message || 'Error al abrir la Mystery Box.');
      setFase('idle');
    } finally {
      setAbriendo(false);
    }
  };

  const handleConfirmarTalle = async () => {
    if (!talleSeleccionado || guardandoTalle) return;
    setGuardandoTalle(true);
    try {
      await fetchApi(`/mistery-box/aperturas/${resultado.idApertura}/talle`, {
        method: 'PATCH',
        body: JSON.stringify({ talle: talleSeleccionado }),
      });
      setFase('confirmado');
    } catch (e) {
      alert(e.message || 'Error al guardar el talle.');
    } finally {
      setGuardandoTalle(false);
    }
  };

  const handleVolver = () => {
    setFase('idle');
    setResultado(null);
    setTalleSeleccionado(null);
    cargarEstado();
  };

  if (!token) return null;

  if (loading) {
    return (
      <div className="mb-page">
        <div className="mb-center"><div className="loader-spinner"></div></div>
      </div>
    );
  }

  const progreso = estado ? Math.min((estado.puntosActuales / PUNTOS_NECESARIOS) * 100, 100) : 0;
  const desbloqueada = estado?.desbloqueada;
  const costo = estado?.costo || PUNTOS_NECESARIOS;
  const puedeAbrir = desbloqueada && (estado?.puntosActuales >= costo);

  return (
    <div className="mb-page">
      <div className="container">
        <div className="mb-wrapper">

          <div className="mb-title-section">
            <div className="mb-title-icon-wrapper">
              <FiGift className="mb-title-icon" />
            </div>
            <h1 className="mb-title">Mystery Box</h1>
            <p className="mb-subtitle">
              Alcanzá los {PUNTOS_NECESARIOS.toLocaleString('es-AR')} puntos de ranking y desbloqueá la caja misteriosa.
            </p>
            <p className="mb-subtitle-highlight">¿Qué camiseta te tocará?</p>
          </div>

          {/* Fase: confirmado */}
          {fase === 'confirmado' && resultado ? (
            <div className="mb-reveal">
              <div className="mb-reveal-confetti">🎉</div>
              <h2 className="mb-reveal-title">¡Todo listo!</h2>
              <div className="mb-reveal-card">
                {resultado.fotoUrl ? (
                  <img src={getImageUrl(resultado.fotoUrl)} alt={resultado.nombreProducto} className="mb-reveal-img" />
                ) : (
                  <div className="mb-reveal-img mb-no-img"><FiGift size={48} /></div>
                )}
                <div className="mb-reveal-info">
                  <span className="mb-reveal-club">{resultado.club}</span>
                  <h3 className="mb-reveal-nombre">{resultado.nombreProducto}</h3>
                  <p className="mb-reveal-talle"><strong>Talle:</strong> {talleSeleccionado}</p>
                  <p className="mb-reveal-puntos">
                    <FiStar size={14} /> {resultado.puntosGastados.toLocaleString('es-AR')} puntos gastados · Te quedan <strong>{resultado.puntosRestantes.toLocaleString('es-AR')}</strong>
                  </p>
                </div>
              </div>
              <p className="mb-reveal-nota">La camiseta fue agregada a tu guardarropas.</p>
              <button className="mb-btn-secondary" onClick={handleVolver}>Volver a la Mystery Box</button>
            </div>

          ) : fase === 'elegirTalle' && resultado ? (
            /* Fase: mostrar camiseta y elegir talle */
            <div className="mb-reveal">
              <div className="mb-reveal-confetti">🎁</div>
              <h2 className="mb-reveal-title">¡Te tocó esta camiseta!</h2>
              <div className="mb-reveal-card">
                {resultado.fotoUrl ? (
                  <img src={getImageUrl(resultado.fotoUrl)} alt={resultado.nombreProducto} className="mb-reveal-img" />
                ) : (
                  <div className="mb-reveal-img mb-no-img"><FiGift size={48} /></div>
                )}
                <div className="mb-reveal-info">
                  <span className="mb-reveal-club">{resultado.club}</span>
                  <h3 className="mb-reveal-nombre">{resultado.nombreProducto}</h3>
                  <p className="mb-reveal-puntos">
                    <FiStar size={14} /> {resultado.puntosGastados.toLocaleString('es-AR')} puntos gastados · Te quedan <strong>{resultado.puntosRestantes.toLocaleString('es-AR')}</strong>
                  </p>
                </div>
              </div>

              <div className="mb-talle-section">
                <p className="mb-talle-label">Elegí tu talle:</p>
                <div className="mb-talle-options">
                  {resultado.tallesDisponibles?.map(t => (
                    <button
                      key={t}
                      className={`mb-talle-btn ${talleSeleccionado === t ? 'selected' : ''}`}
                      onClick={() => setTalleSeleccionado(t)}
                    >
                      {talleSeleccionado === t && <FiCheck size={12} />} {t}
                    </button>
                  ))}
                </div>
                <button
                  className={`mb-btn-open ${!talleSeleccionado ? 'disabled' : ''}`}
                  onClick={handleConfirmarTalle}
                  disabled={!talleSeleccionado || guardandoTalle}
                >
                  {guardandoTalle ? 'Guardando...' : 'Confirmar talle'}
                </button>
              </div>
            </div>

          ) : fase === 'abriendo' ? (
            <div className="mb-opening">
              <div className="mb-box-animating">
                <span className="mb-box-emoji">📦</span>
              </div>
              <p className="mb-opening-text">Abriendo la caja...</p>
            </div>

          ) : (
            /* Fase: idle */
            <div className="mb-main">
              <div className="mb-dashboard-grid">
                <div className={`mb-box-card ${desbloqueada ? 'unlocked' : 'locked'}`}>
                  <div className="mb-box-icon-container">
                    {desbloqueada ? (
                      <FiGift className="mb-card-lock-icon unlocked" />
                    ) : (
                      <FiLock className="mb-card-lock-icon locked" />
                    )}
                  </div>
                  <span className="mb-card-lock-text">{desbloqueada ? 'DESBLOQUEADA' : 'BLOQUEADA'}</span>
                </div>

                <div className="mb-stats-card">
                  <div className="mb-stat-row">
                    <div className="mb-stat-icon-box cyan">
                      <FiZap className="mb-stat-icon" />
                    </div>
                    <div className="mb-stat-info">
                      <span className="mb-stat-label">Puntos disponibles</span>
                      <span className="mb-stat-value cyan">{(estado?.puntosActuales || 0).toLocaleString('es-AR')} pts</span>
                    </div>
                  </div>
                  
                  <div className="mb-stat-row">
                    <div className="mb-stat-icon-box purple">
                      <FiStar className="mb-stat-icon" />
                    </div>
                    <div className="mb-stat-info">
                      {!desbloqueada ? (
                        <>
                          <span className="mb-stat-label">Necesitás</span>
                          <span className="mb-stat-value">{(PUNTOS_NECESARIOS - (estado?.puntosActuales || 0)).toLocaleString('es-AR')} pts más</span>
                        </>
                      ) : (
                        <>
                          <span className="mb-stat-label">Costo por apertura</span>
                          <span className="mb-stat-value">{costo.toLocaleString('es-AR')} pts</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {!desbloqueada && (
                <div className="mb-progress-card">
                  <div className="mb-progress-header">
                    <span className="mb-progress-title">Progreso de desbloqueo</span>
                    <span className="mb-progress-percent">{Math.round(progreso)}%</span>
                  </div>
                  
                  <div className="mb-progress-bar-container">
                    <div className="mb-progress-bar">
                      <div className="mb-progress-fill" style={{ width: `${progreso}%` }} />
                    </div>
                    <div className="mb-progress-ticks">
                      <span className="tick-label active">0 pts</span>
                      <span className={`tick-label ${estado?.puntosActuales >= 2500 ? 'active' : ''}`}>2.500 pts</span>
                      <span className={`tick-label ${estado?.puntosActuales >= 5000 ? 'active' : ''}`}>5.000 pts</span>
                      <span className={`tick-label ${estado?.puntosActuales >= 7500 ? 'active' : ''}`}>7.500 pts</span>
                      <span className={`tick-label ${estado?.puntosActuales >= 10000 ? 'active' : ''}`}>10.000 pts</span>
                    </div>
                  </div>
                  
                  <div className="mb-progress-info-banner">
                    <FiInfo className="mb-info-icon" />
                    <span>Comprá más camisetas para acumular puntos y desbloquear la Mystery Box.</span>
                  </div>
                </div>
              )}

              {desbloqueada && (
                <button
                  className={`mb-btn-open ${!puedeAbrir ? 'disabled' : ''}`}
                  onClick={handleAbrir}
                  disabled={!puedeAbrir || abriendo}
                >
                  <FiGift size={20} />
                  {puedeAbrir ? `Abrir Mystery Box (${costo.toLocaleString('es-AR')} pts)` : 'No tenés suficientes puntos'}
                </button>
              )}
            </div>
          )}

          {/* Features Row at the Bottom */}
          <div className="mb-features-row">
            <div className="mb-feature-item">
              <div className="mb-feature-icon-wrapper">
                <FiShield className="mb-feature-icon" />
              </div>
              <div className="mb-feature-info">
                <h4>100% oficiales</h4>
                <p>Camisetas originales</p>
              </div>
            </div>

            <div className="mb-feature-item">
              <div className="mb-feature-icon-wrapper">
                <FiAward className="mb-feature-icon" />
              </div>
              <div className="mb-feature-info">
                <h4>Premios únicos</h4>
                <p>Podés ganar camisetas premium</p>
              </div>
            </div>

            <div className="mb-feature-item">
              <div className="mb-feature-icon-wrapper">
                <FiTrendingUp className="mb-feature-icon" />
              </div>
              <div className="mb-feature-info">
                <h4>Subí de ranking</h4>
                <p>Sumá puntos y desbloqueá</p>
              </div>
            </div>

            <div className="mb-feature-item">
              <div className="mb-feature-icon-wrapper">
                <FiGift className="mb-feature-icon" />
              </div>
              <div className="mb-feature-info">
                <h4>Sorpresas únicas</h4>
                <p>Cada caja es diferente</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MisteryBox;
