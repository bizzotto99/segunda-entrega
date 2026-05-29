import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { fetchApi, getImageUrl } from '../services/api';
import { FiChevronLeft, FiShoppingBag, FiCheck, FiHeart } from 'react-icons/fi';
import './DetalleProducto.css';
import Toast from '../components/Toast';

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { addToCart } = useCart();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedTalle, setSelectedTalle] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [added, setAdded] = useState(false);
  const [esFavorito, setEsFavorito] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loadProducto = async () => {
      try {
        setLoading(true);
        const data = await fetchApi(`/catalogo/productos/${id}`);
        setProducto(data);
        setActiveImage(data.fotoUrl);
        
        // Seleccionar primer talle disponible por defecto
        const disponible = data.talles && data.talles.find(t => t.stockTalle > 0);
        if (disponible) {
          setSelectedTalle(disponible);
        }
        
        // Verificar si es favorito en localStorage
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
        const existe = favoritos.some(f => f.idProducto === data.idProducto);
        setEsFavorito(existe);
        
        setError(null);
      } catch (err) {
        console.error("Error al cargar producto:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducto();
  }, [id]);

  const handleToggleFavorito = () => {
    if (!producto) return;
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const existe = favoritos.some(f => f.idProducto === producto.idProducto);
    
    let updated;
    if (existe) {
      updated = favoritos.filter(f => f.idProducto !== producto.idProducto);
      setEsFavorito(false);
    } else {
      updated = [...favoritos, {
        idProducto: producto.idProducto,
        nombre: producto.nombre,
        precio: producto.precio,
        fotoUrl: producto.fotoUrl,
        nombreClub: producto.nombreClub
      }];
      setEsFavorito(true);
    }
    localStorage.setItem('favoritos', JSON.stringify(updated));
  };

  const handleAddToCart = () => {
    if (!producto) return;
    
    // Si el producto tiene talles y no se seleccionó ninguno
    if (producto.talles && producto.talles.length > 0 && !selectedTalle) {
      setToast({ message: "Por favor, selecciona un talle antes de agregar al carrito.", type: "error" });
      return;
    }

    const itemData = {
      idProducto: producto.idProducto,
      idProdTalle: selectedTalle ? selectedTalle.idProdTalle : null,
      talle: selectedTalle ? selectedTalle.talle : 'Único',
      cantidad: cantidad,
      nombreProducto: producto.nombre,
      precioUnitario: producto.precioConDescuento || producto.precio,
      fotoUrl: producto.fotoUrl
    };

    addToCart(itemData);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="detalle-page-loading">
        <div className="loader-spinner"></div>
        <p style={{ color: 'var(--color-gray-500)', fontSize: '14px', fontWeight: '500' }}>Cargando detalles de la camiseta...</p>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="container error-container">
        <h2>Ups, ocurrió un error</h2>
        <p>{error || 'No pudimos encontrar el producto solicitado.'}</p>
        <Link to="/catalogo" className="btn-back">
          <FiChevronLeft /> Volver al catálogo
        </Link>
      </div>
    );
  }

  const tieneDescuento = producto.descuentoActual && producto.descuentoActual > 0;

  return (
    <div className="detalle-page">
      <div className="container">
        
        <Link to="/catalogo" className="btn-back">
          <FiChevronLeft /> Volver al catálogo
        </Link>

        <div className="detalle-grid">
          {/* Lado Izquierdo: Imagen */}
          <div className="detalle-img-container-wrapper">
            <div className="detalle-img-container">
              {tieneDescuento && (
                <span className="detalle-badge">-{producto.descuentoActual}% OFF</span>
              )}
              {activeImage ? (
                <img src={getImageUrl(activeImage)} alt={producto.nombre} className="detalle-image" />
              ) : (
                <div className="detalle-image-placeholder">No Image Available</div>
              )}
            </div>
            
            {/* Galería de miniaturas (frontal + dorsales) */}
            {producto.fotosUrls && producto.fotosUrls.length > 0 && (
              <div className="detalle-thumbnails">
                <div 
                  className={`thumbnail-item ${activeImage === producto.fotoUrl ? 'active' : ''}`}
                  onClick={() => setActiveImage(producto.fotoUrl)}
                >
                  <img src={getImageUrl(producto.fotoUrl)} alt="Vista frontal" />
                </div>
                {producto.fotosUrls.map((imgUrl, index) => (
                  <div 
                    key={index}
                    className={`thumbnail-item ${activeImage === imgUrl ? 'active' : ''}`}
                    onClick={() => setActiveImage(imgUrl)}
                  >
                    <img src={getImageUrl(imgUrl)} alt={`Vista adicional ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lado Derecho: Información */}
          <div className="detalle-info">
            <span className="detalle-club">{producto.nombreClub}</span>
            <h1 className="detalle-nombre">{producto.nombre}</h1>
            
            <div className="detalle-price-row">
              {tieneDescuento ? (
                <>
                  <span className="detalle-precio-original">{formatCurrency(producto.precio)}</span>
                  <span className="detalle-precio-descuento">{formatCurrency(producto.precioConDescuento)}</span>
                </>
              ) : (
                <span className="detalle-precio">{formatCurrency(producto.precio)}</span>
              )}
            </div>

            <div className="detalle-divider"></div>

            <p className="detalle-desc">{producto.descripcion || 'Esta camiseta oficial ofrece un rendimiento y comodidad óptimos para los jugadores y fanáticos. Tejido altamente respirable con tecnología absorbente de humedad.'}</p>

            <div className="detalle-specs">
              {producto.temporada && (
                <div className="spec-item">
                  <span className="spec-label">Temporada:</span>
                  <span className="spec-val">{producto.temporada}</span>
                </div>
              )}
              {producto.tipo && (
                <div className="spec-item">
                  <span className="spec-label">Edición:</span>
                  <span className="spec-val">{producto.tipo}</span>
                </div>
              )}
            </div>

            {/* Selector de talles */}
            {producto.talles && producto.talles.length > 0 && (
              <div className="talle-selector-container">
                <span className="section-label">Selecciona tu talle:</span>
                <div className="talle-grid">
                  {producto.talles.map((t) => {
                    const sinStock = t.stockTalle <= 0;
                    const esSeleccionado = selectedTalle?.idProdTalle === t.idProdTalle;
                    return (
                      <button
                        key={t.idProdTalle}
                        className={`talle-btn ${esSeleccionado ? 'active' : ''} ${sinStock ? 'out-of-stock' : ''}`}
                        disabled={sinStock}
                        onClick={() => setSelectedTalle(t)}
                        title={sinStock ? 'Sin stock disponible' : `Stock: ${t.stockTalle}`}
                      >
                        {t.talle}
                        {sinStock && <span className="slash"></span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selector de cantidad */}
            <div className="cantidad-container">
              <span className="section-label">Cantidad:</span>
              <div className="cantidad-selector">
                <button 
                  onClick={() => setCantidad(c => Math.max(1, c - 1))}
                  disabled={cantidad === 1}
                >
                  -
                </button>
                <span className="cantidad-val">{cantidad}</span>
                <button 
                  onClick={() => {
                    const maxStock = selectedTalle ? selectedTalle.stockTalle : producto.stock;
                    setCantidad(c => Math.min(maxStock, c + 1));
                  }}
                  disabled={cantidad >= (selectedTalle ? selectedTalle.stockTalle : producto.stock)}
                >
                  +
                </button>
              </div>
              <span className="stock-info">
                ({selectedTalle ? `${selectedTalle.stockTalle} disponibles` : `${producto.stock} disponibles`})
              </span>
            </div>

            {/* Acciones principales */}
            {user && user.rol === 'VENDEDOR' ? (
              <div className="acciones-row">
                <Link 
                  to="/admin" 
                  className="btn-add-cart-large" 
                  style={{ 
                    textAlign: 'center', 
                    background: 'linear-gradient(135deg, var(--color-accent) 0%, #1d4ed8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none'
                  }}
                >
                  Ir al Panel de Administración
                </Link>
              </div>
            ) : (
              <div className="acciones-row">
                <button 
                  className={`btn-add-cart-large ${added ? 'added' : ''}`}
                  onClick={handleAddToCart}
                  disabled={producto.talles && producto.talles.length > 0 && !selectedTalle}
                >
                  {added ? (
                    <>
                      <FiCheck size={20} /> ¡Añadido!
                    </>
                  ) : (
                    <>
                      <FiShoppingBag size={20} /> Añadir al Carrito
                    </>
                  )}
                </button>

                <button 
                  className={`btn-fav-large ${esFavorito ? 'active' : ''}`}
                  onClick={handleToggleFavorito}
                  title={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
                >
                  <FiHeart size={20} fill={esFavorito ? "var(--color-accent)" : "none"} />
                </button>
              </div>
            )}
            
          </div>
        </div>

      </div>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default DetalleProducto;
