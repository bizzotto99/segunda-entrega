import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiGift, FiLock } from 'react-icons/fi';
import './MisteryBoxBanner.css';

const PUNTOS_NECESARIOS = 10000;

const MisteryBoxBanner = () => {
  const { user } = useAuth();

  if (!user || user.rol !== 'COMPRADOR') return null;

  const puntos = user.points || 0;
  const desbloqueada = puntos >= PUNTOS_NECESARIOS;
  const progreso = Math.min((puntos / PUNTOS_NECESARIOS) * 100, 100);

  return (
    <section className="mb-banner-section container">
      <div className="mb-banner">
        <div className="mb-banner-left">
          <div className="mb-banner-icon-wrap">
            {desbloqueada ? <FiGift size={24} /> : <FiLock size={24} />}
          </div>
          <div className="mb-banner-text">
            <h2 className="mb-banner-title">
              {desbloqueada ? '¡Tu Mystery Box está lista para abrir!' : 'Mystery Box'}
            </h2>
            <p className="mb-banner-desc">
              {desbloqueada
                ? 'Llegaste a los 10.000 puntos. Abrila y descubrí qué camiseta te tocó.'
                : `Acumulá ${PUNTOS_NECESARIOS.toLocaleString('es-AR')} puntos comprando y desbloqueá una camiseta misteriosa.`}
            </p>
            {!desbloqueada && (
              <div className="mb-banner-progress-wrap">
                <div className="mb-banner-progress-bar">
                  <div className="mb-banner-progress-fill" style={{ width: `${progreso}%` }} />
                </div>
                <span className="mb-banner-progress-label">
                  {puntos.toLocaleString('es-AR')} / {PUNTOS_NECESARIOS.toLocaleString('es-AR')} pts
                </span>
              </div>
            )}
          </div>
        </div>
        <Link to="/mistery-box" className="mb-banner-btn">
          {desbloqueada ? 'Abrir ahora' : 'Ver más'}
        </Link>
      </div>
    </section>
  );
};

export default MisteryBoxBanner;
