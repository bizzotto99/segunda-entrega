import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiCheck, FiShoppingBag, FiEye } from 'react-icons/fi';
import { getImageUrl } from '../services/api';
import './ProductCard.css';

const ProductCard = ({ producto }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Encontrar primer talle disponible
    const disponible = producto.talles && producto.talles.find(t => t.stockTalle > 0);
    
    const itemData = {
      idProducto: producto.idProducto,
      idProdTalle: disponible ? disponible.idProdTalle : null,
      talle: disponible ? disponible.talle : 'Único',
      cantidad: 1,
      nombreProducto: producto.nombre,
      precioUnitario: producto.precioConDescuento || producto.precio,
      fotoUrl: producto.fotoUrl
    };

    addToCart(itemData);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-card">
      <Link to={`/catalogo/productos/${producto.idProducto}`}>
        <div className="product-image-container">
          {producto.descuentoActual && producto.descuentoActual > 0 && (
            <span className="product-badge">-{producto.descuentoActual}% OFF</span>
          )}
          {producto.fotoUrl ? (
            <img src={getImageUrl(producto.fotoUrl)} alt={producto.nombre} className="product-image" />
          ) : (
            <div className="product-image-placeholder"></div>
          )}
        </div>
        <div className="product-info">
          <h3 className="product-title">{producto.nombre}</h3>
          <p className="product-price">${(producto.precioConDescuento || producto.precio).toLocaleString('es-AR')},00 ARS</p>
          {user && user.rol === 'VENDEDOR' ? (
            <button 
              className="btn-add-cart" 
              style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#cbd5e1' }}
            >
              <FiEye style={{ marginRight: '5px' }} /> Ver Camiseta
            </button>
          ) : (
            <button 
              className={`btn-add-cart ${added ? 'added' : ''}`}
              onClick={handleAdd}
              disabled={producto.talles && producto.talles.length > 0 && !producto.talles.some(t => t.stockTalle > 0)}
            >
              {added ? (
                <>
                  <FiCheck style={{ marginRight: '5px' }} /> ¡Añadido!
                </>
              ) : (
                <>
                  <FiShoppingBag style={{ marginRight: '5px' }} /> Añadir
                </>
              )}
            </button>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
