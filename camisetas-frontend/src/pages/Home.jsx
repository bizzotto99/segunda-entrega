import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import RankingHinchas from '../components/RankingHinchas';
import { fetchApi } from '../services/api';
import './Home.css';

const ProductSection = ({ title, link, products, loading }) => (
  <section className="product-section container">
    <div className="section-header">
      <h2 className="section-title">{title}</h2>
      <Link to={link} className="see-more-link">Ver más &rarr;</Link>
    </div>
    
    <div className="product-grid">
      {loading ? (
        <div className="spinner-container" style={{ gridColumn: '1 / -1' }}>
          <div className="loader-spinner"></div>
          <p style={{ color: 'var(--color-gray-500)', fontSize: '14px', fontWeight: '500' }}>Cargando productos...</p>
        </div>
      ) : products && products.length > 0 ? (
        products.map(prod => (
          <ProductCard key={prod.idProducto} producto={prod} />
        ))
      ) : (
        <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#94a3b8' }}>No hay productos disponibles.</p>
      )}
    </div>
  </section>
);

const Home = () => {
  const [productosPrimera, setProductosPrimera] = useState([]);
  const [productosSegunda, setProductosSegunda] = useState([]);
  const [productosSeleccion, setProductosSeleccion] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeProducts = async () => {
      try {
        setLoading(true);
        // Realizar llamadas al API para las 3 categorías
        const [primera, segunda, seleccion] = await Promise.all([
          fetchApi('/catalogo/productos?categoriaId=1'),
          fetchApi('/catalogo/productos?categoriaId=2'),
          fetchApi('/catalogo/productos?categoriaId=3')
        ]);
        
        // Guardar los primeros 4 productos destacados de cada categoría
        setProductosPrimera(primera ? primera.slice(0, 4) : []);
        setProductosSegunda(segunda ? segunda.slice(0, 4) : []);
        setProductosSeleccion(seleccion ? seleccion.slice(0, 4) : []);
      } catch (err) {
        console.error("Error al cargar productos en el Home:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeProducts();
  }, []);

  return (
    <div className="home-page">
      <HeroSection />
      
      <ProductSection 
        title="Selección" 
        link="/catalogo?categoriaId=3" 
        products={productosSeleccion} 
        loading={loading}
      />
      
      <ProductSection 
        title="Primera División" 
        link="/catalogo?categoriaId=1" 
        products={productosPrimera} 
        loading={loading}
      />
      
      <ProductSection 
        title="Segunda División" 
        link="/catalogo?categoriaId=2" 
        products={productosSegunda} 
        loading={loading}
      />

      <RankingHinchas />

      <div className="home-explore-all container">
        <div className="explore-all-card">
          <div className="explore-content">
            <h2>¿Buscas otra camiseta?</h2>
            <p>Explora nuestra colección completa de Primera División, el Ascenso y Selecciones nacionales e internacionales.</p>
          </div>
          <Link to="/catalogo" className="btn-explore-all">
            Ver Todos los Productos &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
