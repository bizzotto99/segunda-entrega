import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchApi, getImageUrl } from '../services/api';
import { FiLock, FiGift, FiStar, FiZap, FiCheck } from 'react-icons/fi';
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
            <h1 className="mb-title">
              <FiGift className="mb-title-icon" /> Mystery Box
            </h1>
            <p className="mb-subtitle">
              Alcanzá los {PUNTOS_NECESARIOS.toLocaleString('es-AR')} puntos de ranking y desbloqueá la caja misteriosa. ¿Qué camiseta te tocará?
            </p>
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
              <div className={`mb-box-container ${desbloqueada ? 'unlocked' : 'locked'}`}>
                <div className="mb-box">
                  {desbloqueada ? (
                    <FiGift className="mb-box-icon unlocked-icon" />
                  ) : (
                    <FiLock className="mb-box-icon locked-icon" />
                  )}
                </div>
                {!desbloqueada && <div className="mb-lock-label">Bloqueada</div>}
              </div>

              <div className="mb-info-card">
                <div className="mb-info-row">
                  <span className="mb-info-label"><FiZap size={14} /> Puntos disponibles</span>
                  <span className="mb-info-value accent">{(estado?.puntosActuales || 0).toLocaleString('es-AR')}</span>
                </div>
                {!desbloqueada && (
                  <div className="mb-info-row">
                    <span className="mb-info-label">Necesitás</span>
                    <span className="mb-info-value warn">
                      {(PUNTOS_NECESARIOS - (estado?.puntosActuales || 0)).toLocaleString('es-AR')} pts más
                    </span>
                  </div>
                )}
                {desbloqueada && (
                  <div className="mb-info-row">
                    <span className="mb-info-label">Costo por apertura</span>
                    <span className="mb-info-value">{costo.toLocaleString('es-AR')} pts</span>
                  </div>
                )}
              </div>

              {!desbloqueada && (
                <div className="mb-progress-section">
                  <div className="mb-progress-header">
                    <span>Progreso de desbloqueo</span>
                    <span>{Math.round(progreso)}%</span>
                  </div>
                  <div className="mb-progress-bar">
                    <div className="mb-progress-fill" style={{ width: `${progreso}%` }} />
                  </div>
                  <p className="mb-progress-hint">
                    Comprá más camisetas para acumular puntos y desbloquear la Mystery Box.
                  </p>
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

        </div>
      </div>
    </div>
  );
};

export default MisteryBox;
