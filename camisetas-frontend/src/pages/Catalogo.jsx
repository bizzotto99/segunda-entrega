import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CatalogSidebar from '../components/CatalogSidebar';
import ProductCard from '../components/ProductCard';
import { fetchApi } from '../services/api';
import './Catalogo.css';

// Mock data (ya no se usa, reemplazado por backend)
const mockAllProducts = [
  { idProducto: 1, nombre: 'Argentina Messi #10 Mundial 2026', precio: 129990, badge: 'Más vendido', idCategoria: 3, talle: 'L', equipo: 'Argentina' },
  { idProducto: 2, nombre: 'Camiseta Selección Colombia', precio: 89990, badge: null, idCategoria: 3, talle: 'M', equipo: 'Colombia' },
  { idProducto: 3, nombre: 'Italia Azzurri #10', precio: 99990, badge: 'Nuevo', idCategoria: 3, talle: 'XL', equipo: 'Italia' },
  { idProducto: 4, nombre: 'Brasil Seleção 2026', precio: 109990, badge: null, idCategoria: 3, talle: 'S', equipo: 'Brasil' },
  { idProducto: 5, nombre: 'Boca Juniors Home 2026', precio: 79990, badge: '50% OFF', idCategoria: 1, talle: 'M', equipo: 'Boca Juniors' },
  { idProducto: 6, nombre: 'River Plate Titular', precio: 79990, badge: 'Más vendido', idCategoria: 1, talle: 'L', equipo: 'River Plate' },
  { idProducto: 7, nombre: 'Racing Club 2026', precio: 74990, badge: null, idCategoria: 1, talle: 'XL', equipo: 'Racing Club' },
  { idProducto: 8, nombre: 'Independiente Rojo', precio: 74990, badge: null, idCategoria: 1, talle: 'S', equipo: 'Independiente' },
  { idProducto: 9, nombre: 'Arsenal de Sarandí', precio: 64990, badge: null, idCategoria: 2, talle: 'M', equipo: 'Arsenal' },
  { idProducto: 10, option: 'Quilmes AC Jersey', precio: 59990, badge: null, idCategoria: 2, talle: 'L', equipo: 'Quilmes' },
  { idProducto: 11, nombre: 'Nueva Chicago', precio: 59990, badge: 'Nuevo', idCategoria: 2, talle: 'XL', equipo: 'Nueva Chicago' },
  { idProducto: 12, nombre: 'Deportivo Morón', precio: 54990, badge: null, idCategoria: 2, talle: 'M', equipo: 'Deportivo Morón' },
];

const categoryTitles = {
  1: { title: 'Primera División', subtitle: 'Camisetas oficiales de los equipos de la Liga Argentina' },
  2: { title: 'Segunda División', subtitle: 'Equipos del ascenso' },
  3: { title: 'Selección', subtitle: 'Camisetas de selecciones nacionales' }
};

const Catalogo = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  


  // Cargar clubes desde la base de datos
  useEffect(() => {
    const loadClubs = async () => {
      try {
        const clubs = await fetchApi('/catalogo/clubes');
        setEquipos(clubs || []);
      } catch (err) {
        console.error("Error al cargar clubes:", err);
      }
    };
    loadClubs();
  }, []);
  
  // Leer params
  const categoriaId = searchParams.get('categoriaId');
  const precioMin = searchParams.get('precioMin');
  const precioMax = searchParams.get('precioMax');
  const talle = searchParams.get('talle');
  const equipo = searchParams.get('equipo');

  // Derivar el filtro de precio actual para el Sidebar
  let currentPriceFilter = 'todos';
  if (precioMax === '69990') currentPriceFilter = 'hasta-69990';
  else if (precioMin === '70000' && precioMax === '74990') currentPriceFilter = '70000-74990';
  else if (precioMin === '75000') currentPriceFilter = '75000-mas';

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (categoriaId) params.append('categoriaId', categoriaId);
        if (precioMin) params.append('precioMin', precioMin);
        if (precioMax) params.append('precioMax', precioMax);
        if (equipo) params.append('q', equipo);
        
        const queryString = params.toString();
        const endpoint = `/catalogo/productos${queryString ? `?${queryString}` : ''}`;
        
        const data = await fetchApi(endpoint);
        
        // Filtro local adicional de talle
        let result = data || [];
        if (talle) {
          result = result.filter(p => p.talle === talle);
        }
        
        setFilteredProducts(result);
        setError(null);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError(err.message);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoriaId, precioMin, precioMax, talle, equipo]);

  const handlePriceChange = (filter) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('precioMin');
    newParams.delete('precioMax');
    
    if (filter === 'hasta-69990') {
      newParams.set('precioMax', '69990');
    } else if (filter === '70000-74990') {
      newParams.set('precioMin', '70000');
      newParams.set('precioMax', '74990');
    } else if (filter === '75000-mas') {
      newParams.set('precioMin', '75000');
    }

    setSearchParams(newParams);
  };

  const handleTalleChange = (selectedTalle) => {
    const newParams = new URLSearchParams(searchParams);
    if (talle === selectedTalle) {
      newParams.delete('talle');
    } else {
      newParams.set('talle', selectedTalle);
    }
    setSearchParams(newParams);
  };

  const handleEquipoChange = (selectedEquipo) => {
    const newParams = new URLSearchParams(searchParams);
    if (selectedEquipo === 'todos') {
      newParams.delete('equipo');
    } else {
      newParams.set('equipo', selectedEquipo);
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('precioMin');
    newParams.delete('precioMax');
    newParams.delete('talle');
    newParams.delete('equipo');
    setSearchParams(newParams);
  };

  const catData = categoryTitles[categoriaId] || { title: 'Todos los productos', subtitle: 'Catálogo completo' };
  


  // Background image placeholder for the banner with a dark overlay to make text readable
  const bannerImage = "linear-gradient(135deg, rgba(18, 22, 41, 0.95) 0%, rgba(30, 41, 94, 0.7) 100%), url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=1920')";

  return (
    <div className="catalogo-page">
      <div className="catalogo-banner" style={{ backgroundImage: bannerImage, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container banner-content">
          <h1 className="banner-title">{catData.title}</h1>
          <p className="banner-subtitle">{catData.subtitle}</p>
        </div>
      </div>
      
      <div className="container catalogo-layout">
        <CatalogSidebar 
          currentPriceFilter={currentPriceFilter} 
          currentTalle={talle}
          currentEquipo={equipo}
          onPriceChange={handlePriceChange}
          onTalleChange={handleTalleChange}
          onEquipoChange={handleEquipoChange}
          onClearFilters={handleClearFilters}
          equipos={equipos}
        />
        
        <div className="catalogo-content">
          <p className="results-count">
            Mostrando {filteredProducts.length} productos
          </p>
          
          <div className="catalogo-grid">
            {loading ? (
              <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>Cargando productos desde el servidor...</p>
            ) : error ? (
              <p style={{ color: 'red', textAlign: 'center', gridColumn: '1 / -1' }}>Error: {error}</p>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map(prod => (
                <ProductCard key={prod.idProducto} producto={prod} />
              ))
            ) : (
              <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>No se encontraron productos con estos filtros.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalogo;
