import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchApi, getImageUrl } from '../services/api';
import './RankingHinchas.css';

const RankingHinchas = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [ranking, setRanking] = useState([]);
  const [usuarioLogueadoRank, setUsuarioLogueadoRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRankingData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchApi('/auth/ranking');
      if (data) {
        setRanking(data.ranking || []);
        setUsuarioLogueadoRank(data.usuarioLogueado || null);
      }
    } catch (err) {
      console.error("Error al obtener ranking:", err);
      setError("No se pudo cargar el ranking de hinchas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankingData();
  }, [token, user]);

  const getInitials = (nombre, apellido) => {
    const n = nombre ? nombre.charAt(0).toUpperCase() : '';
    const a = apellido ? apellido.charAt(0).toUpperCase() : '';
    return `${n}${a}` || 'H';
  };

  const getMedalEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return null;
  };

  const formatPoints = (pts) => {
    return new Intl.NumberFormat('es-AR').format(pts);
  };

  return (
    <section id="ranking" className="ranking-section container">
      <div className="ranking-layout-grid animate-fade-in">
        
        {/* Left Column: ¿Cómo funciona? */}
        <div className="ranking-column-left">
          <div className="ranking-info-card">
            <h3 className="column-title">¿Cómo funciona?</h3>
            <div className="column-divider"></div>
            
            <div className="ranking-steps-container">
              <div className="ranking-step-item">
                <div className="ranking-step-icon-wrapper purple-glow">
                  🛍️
                </div>
                <div className="ranking-step-text-wrapper">
                  <h4>Comprá productos</h4>
                  <p>Cada compra que hagas en la tienda te da puntos.</p>
                </div>
              </div>
              
              <div className="ranking-step-divider-line"></div>
              
              <div className="ranking-step-item">
                <div className="ranking-step-icon-wrapper green-glow">
                  ⚽
                </div>
                <div className="ranking-step-text-wrapper">
                  <h4>Sumá puntos</h4>
                  <p>Cuanto más compres, más puntos acumulás.</p>
                </div>
              </div>
              
              <div className="ranking-step-divider-line"></div>
              
              <div className="ranking-step-item">
                <div className="ranking-step-icon-wrapper gold-glow">
                  🏅
                </div>
                <div className="ranking-step-text-wrapper">
                  <h4>Subí en el ranking</h4>
                  <p>Competí con otros hinchas y llevate la gloria.</p>
                </div>
              </div>
            </div>
            
            <div className="left-alert-box">
              <span className="alert-star">⭐</span>
              <div className="alert-text">
                <h5>¡Alentá, comprá y sumá!</h5>
                <p>Tu apoyo hace la diferencia.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Ranking de Hinchas */}
        <div className="ranking-column-center">
          <div className="ranking-card">
            <div className="ranking-header">
              <div className="ranking-title-group">
                <span className="trophy-pulse">🏆</span>
                <div>
                  <h2 className="ranking-title">Ranking de Hinchas</h2>
                  <p className="ranking-subtitle">¡Los hinchas oficiales que más alientan a sus equipos!</p>
                </div>
              </div>
            </div>

            <div className="ranking-body">
              {loading ? (
                <div className="ranking-loader">
                  <div className="loader-spinner"></div>
                  <p>Analizando la tabla de posiciones...</p>
                </div>
              ) : error ? (
                <div className="ranking-error">
                  <p>{error}</p>
                  <button onClick={fetchRankingData} className="btn-retry-ranking">Reintentar</button>
                </div>
              ) : (
                <div className="ranking-list">
                  {ranking.length > 0 ? (
                    ranking.map((hincha, index) => {
                      const isGold = index === 0;
                      const isSilver = index === 1;
                      const isBronze = index === 2;
                      const rowClass = isGold 
                        ? 'hincha-row gold-podium' 
                        : isSilver 
                        ? 'hincha-row silver-podium' 
                        : isBronze 
                        ? 'hincha-row bronze-podium' 
                        : 'hincha-row';

                      const isCurrentUser = user && user.idUsuario === hincha.idUsuario;

                      return (
                        <div
                          key={hincha.idUsuario}
                          className={`${rowClass} ${isCurrentUser ? 'current-user-highlight' : ''} hincha-row-clickable`}
                          onClick={() => navigate(`/usuario/${hincha.idUsuario}`)}
                        >
                          {/* Medal or Position Number */}
                          <div className="hincha-position">
                            {index < 3 ? (
                              <span className="position-medal-emoji">
                                {getMedalEmoji(index)}
                              </span>
                            ) : (
                              <span className="position-number-badge">
                                {index + 1}
                              </span>
                            )}
                          </div>

                          {/* Avatar or Initials */}
                          <div className="hincha-avatar-container">
                            {hincha.avatarUrl ? (
                              <img 
                                src={getImageUrl(hincha.avatarUrl)} 
                                alt={`${hincha.nombre} ${hincha.apellido}`} 
                                className="hincha-avatar"
                              />
                            ) : (
                              <div className={`hincha-avatar-initials bg-gradient-${(index % 4) + 1}`}>
                                {getInitials(hincha.nombre, hincha.apellido)}
                              </div>
                            )}
                          </div>

                          {/* Info Name / Username */}
                          <div className="hincha-info">
                            <span className="hincha-fullname">
                              {hincha.nombre} {hincha.apellido}
                              {isCurrentUser && <span className="you-badge">Tú</span>}
                            </span>
                            <span className="hincha-username">@{hincha.username}</span>
                          </div>

                          {/* Points */}
                          <div className="hincha-points">
                            <span className="points-number">{formatPoints(hincha.rankingPoints ?? hincha.points)}</span>
                            <span className="points-label">pts</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="no-ranking-data">¡Nadie ha sumado puntos todavía! Sé el primero realizando una compra.</p>
                  )}
                </div>
              )}
            </div>

            {/* Position of Logged User */}
            {token && user && user.rol === 'COMPRADOR' && !loading && !error && (
              <div className="ranking-footer">
                {usuarioLogueadoRank ? (
                  <div className="user-rank-status">
                    <span className="user-status-medal">⭐</span>
                    <span className="user-status-text">
                      Tu posición: <b>#{usuarioLogueadoRank.posicion}</b> — {formatPoints(usuarioLogueadoRank.points)} puntos
                    </span>
                    {usuarioLogueadoRank.posicion <= 5 ? (
                      <span className="user-status-cheer">¡Excelente! Estás en el Top 5 🔥</span>
                    ) : (
                      <span className="user-status-cheer">¡Comprá más para subir en la tabla! 💪</span>
                    )}
                  </div>
                ) : (
                  <div className="user-rank-status">
                    <span className="user-status-text">Cargando tu posición...</span>
                  </div>
                )}
              </div>
            )}

            {!token && (
              <div className="ranking-footer guest-footer">
                <span className="guest-text">
                  ¿Quieres competir? <a href="/login" className="guest-login-link">Inicia sesión</a> para sumar puntos.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: ¡Cada punto cuenta! */}
        <div className="ranking-column-right">
          <div className="ranking-info-card right-card">
            <h3 className="column-title">¡Cada punto cuenta!</h3>
            <div className="column-divider"></div>
            
            <p className="right-card-text">
              El ranking se actualiza automáticamente. Seguí participando y llevá a tu equipo a la cima.
            </p>
            
            <div className="right-card-image-container">
              <img 
                src="/vamos_equipo_megaphone.png" 
                alt="Vamos Equipo Megáfono" 
                className="vamos-equipo-img" 
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default RankingHinchas;
