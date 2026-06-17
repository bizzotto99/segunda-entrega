import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchApi, getImageUrl } from '../services/api';
import { FiPackage, FiStar, FiAward, FiArrowLeft } from 'react-icons/fi';
import './PerfilPublico.css';

const PerfilPublico = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [usuarioData, inventarioData] = await Promise.all([
          fetchApi(`/auth/usuarios/${id}`),
          fetchApi(`/ordenes/inventario/${id}`),
        ]);
        setUsuario(usuarioData);
        setInventario(inventarioData || []);
      } catch (err) {
        setError('No se pudo cargar el perfil.');
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [id]);

  const getInitials = (nombre, apellido) => {
    const n = nombre ? nombre.charAt(0).toUpperCase() : '';
    const a = apellido ? apellido.charAt(0).toUpperCase() : '';
    return `${n}${a}` || '?';
  };

  if (loading) {
    return (
      <div className="perfil-publico-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="loader-spinner"></div>
      </div>
    );
  }

  if (error || !usuario) {
    return (
      <div className="perfil-publico-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <p style={{ color: '#94a3b8' }}>{error || 'Usuario no encontrado.'}</p>
        <button className="pp-back-btn" onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  const totalCamisetas = inventario.reduce((acc, c) => acc + c.cantidad, 0);

  return (
    <div className="perfil-publico-page">
      <div className="container">
        <button className="pp-back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft size={16} /> Volver al ranking
        </button>

        {/* Header del perfil */}
        <div className="pp-header">
          <div className="pp-avatar">
            {usuario.avatarUrl ? (
              <img src={getImageUrl(usuario.avatarUrl)} alt={usuario.nombre} />
            ) : (
              <span>{getInitials(usuario.nombre, usuario.apellido)}</span>
            )}
          </div>
          <div className="pp-user-info">
            <h1 className="pp-nombre">{usuario.nombre} {usuario.apellido}</h1>
            <p className="pp-username">@{usuario.username}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="pp-stats">
          <div className="pp-stat-card">
            <FiPackage size={22} className="pp-stat-icon" />
            <div>
              <div className="pp-stat-value">{totalCamisetas}</div>
              <div className="pp-stat-label">Camisetas</div>
            </div>
          </div>
          <div className="pp-stat-card">
            <FiStar size={22} className="pp-stat-icon" />
            <div>
              <div className="pp-stat-value">{usuario.rankingPoints ?? usuario.points ?? 0}</div>
              <div className="pp-stat-label">Puntos de ranking</div>
            </div>
          </div>
          <div className="pp-stat-card">
            <FiAward size={22} className="pp-stat-icon" />
            <div>
              <div className="pp-stat-value">{inventario.length}</div>
              <div className="pp-stat-label">Modelos únicos</div>
            </div>
          </div>
        </div>

        {/* Guardarropas */}
        <h2 className="pp-section-title">Guardarropas de {usuario.nombre}</h2>

        {inventario.length > 0 ? (
          <div className="pp-grid">
            {inventario.map((camiseta, idx) => (
              <div className="pp-card" key={`${camiseta.idProducto}-${camiseta.talle}-${idx}`}>
                <div className="pp-card-img-container">
                  {camiseta.fotoUrl ? (
                    <img src={getImageUrl(camiseta.fotoUrl)} alt={camiseta.nombre} className="pp-card-img" />
                  ) : (
                    <div className="pp-card-img" style={{ background: '#1a1f38' }} />
                  )}
                  {camiseta.cantidad > 1 && (
                    <span className="pp-quantity-badge">x{camiseta.cantidad}</span>
                  )}
                </div>
                <div className="pp-card-info">
                  <span className="pp-card-club">{camiseta.club}</span>
                  <h4 className="pp-card-name">{camiseta.nombre}</h4>
                  <div className="pp-card-footer">
                    <span className="pp-card-talle">Talle {camiseta.talle}</span>
                    <span className="pp-card-fecha">
                      {new Date(camiseta.fechaAdquisicion).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="pp-empty">
            <FiPackage size={48} style={{ color: 'rgba(255,255,255,0.1)' }} />
            <p>Este hincha todavía no tiene camisetas en su guardarropas.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerfilPublico;
