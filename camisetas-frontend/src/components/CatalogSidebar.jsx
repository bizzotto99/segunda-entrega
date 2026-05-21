import React from 'react';
import './CatalogSidebar.css';

const CatalogSidebar = ({ 
  currentPriceFilter, 
  currentTalle,
  currentEquipo,
  onPriceChange, 
  onTalleChange,
  onEquipoChange,
  onClearFilters,
  equipos = []
}) => {
  
  return (
    <aside className="catalog-sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">Filtros</h3>
      </div>
      
      <div className="sidebar-section">
        <h4 className="filter-subtitle">Precio</h4>
        
        <div className="radio-group">
          <label className={`radio-label ${currentPriceFilter === 'todos' ? 'active' : ''}`}>
            <input 
              type="radio" 
              name="precio" 
              value="todos"
              checked={currentPriceFilter === 'todos'}
              onChange={() => onPriceChange('todos')}
            />
            Todos los precios
          </label>
          
          <label className={`radio-label ${currentPriceFilter === 'hasta-69990' ? 'active' : ''}`}>
            <input 
              type="radio" 
              name="precio" 
              value="hasta-69990"
              checked={currentPriceFilter === 'hasta-69990'}
              onChange={() => onPriceChange('hasta-69990')}
            />
            Hasta $69.990
          </label>
          
          <label className={`radio-label ${currentPriceFilter === '70000-74990' ? 'active' : ''}`}>
            <input 
              type="radio" 
              name="precio" 
              value="70000-74990"
              checked={currentPriceFilter === '70000-74990'}
              onChange={() => onPriceChange('70000-74990')}
            />
            $70.000 - $74.990
          </label>
          
          <label className={`radio-label ${currentPriceFilter === '75000-mas' ? 'active' : ''}`}>
            <input 
              type="radio" 
              name="precio" 
              value="75000-mas"
              checked={currentPriceFilter === '75000-mas'}
              onChange={() => onPriceChange('75000-mas')}
            />
            $75.000 o más
          </label>
        </div>
      </div>

      <div className="sidebar-section">
        <h4 className="filter-subtitle">Talla</h4>
        <div className="size-grid">
          {['S', 'M', 'L', 'XL'].map(size => (
            <button 
              key={size}
              className={`size-btn ${currentTalle === size ? 'active' : ''}`}
              onClick={() => onTalleChange(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h4 className="filter-subtitle">Equipo</h4>
        <select 
          className="equipo-select"
          value={currentEquipo || 'todos'}
          onChange={(e) => onEquipoChange(e.target.value)}
        >
          <option value="todos">Todos los equipos</option>
          {equipos.map(eq => {
            const name = typeof eq === 'string' ? eq : eq.nombre;
            return <option key={name} value={name}>{name}</option>;
          })}
        </select>
      </div>
      
      <button className="btn-clear-filters" onClick={onClearFilters}>
        Limpiar filtros
      </button>
    </aside>
  );
};

export default CatalogSidebar;
