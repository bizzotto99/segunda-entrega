import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchApi, getImageUrl } from '../services/api';
import { 
  FiTrendingUp, FiShoppingBag, FiUsers, FiLayers, FiPlus, 
  FiTrash2, FiEdit2, FiCheck, FiX, FiUploadCloud, FiInbox, FiRefreshCw 
} from 'react-icons/fi';
import './AdminDashboard.css';
import Toast from '../components/Toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  // Tabs: 'stats' | 'productos' | 'pedidos'
  const [activeTab, setActiveTab] = useState('stats');
  
  // Data States
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [clubs, setClubs] = useState([]);
  
  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Toast notifications & custom confirm
  const [toast, setToast] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };
  
  // Form Modal States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Product Form Fields
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    temporada: '2026',
    tipo: 'CAMISETA',
    idCategoria: '',
    idClub: '',
    fotoUrl: '',
    fotosUrls: []
  });
  
  // Files to upload
  const [mainImageFile, setMainImageFile] = useState(null);
  const [backImageFile, setBackImageFile] = useState(null);
  const [tallesInput, setTallesInput] = useState([
    { talle: 'S', stockTalle: 5 },
    { talle: 'M', stockTalle: 5 },
    { talle: 'L', stockTalle: 5 },
    { talle: 'XL', stockTalle: 5 }
  ]);

  // Security Check: Redirect if not VENDEDOR
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (user && user.rol !== 'VENDEDOR') {
      navigate('/');
    }
  }, [user, token, navigate]);

  // Fetch Dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load categoríes, clubes, stats, and orders concurrently
      const [catsData, clubsData, statsData, ordersData, prodsData] = await Promise.all([
        fetchApi('/catalogo/categorias'),
        fetchApi('/catalogo/clubes'),
        fetchApi('/admin/stats'),
        fetchApi('/ordenes'), // GET /api/ordenes returns all orders for VENDEDOR
        fetchApi('/catalogo/productos')
      ]);
      
      setCategories(catsData || []);
      setClubs(clubsData || []);
      setStats(statsData);
      setOrders(ordersData || []);
      setProducts(prodsData || []);
      
    } catch (err) {
      console.error("Error al cargar datos del panel admin:", err);
      setError(err.message || "Error al cargar la información del servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.rol === 'VENDEDOR') {
      loadDashboardData();
    }
  }, [user]);

  // File Upload Helper
  const uploadImage = async (file) => {
    const uploadForm = new FormData();
    uploadForm.append('file', file);
    
    // We make a custom fetch request for FormData upload
    const response = await fetch('http://localhost:8080/api/admin/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: uploadForm
    });
    
    if (!response.ok) {
      throw new Error('Error al subir la imagen al servidor.');
    }
    const data = await response.json();
    return data.url;
  };

  // Open modal for new product
  const handleNewProduct = () => {
    setEditingProduct(null);
    setMainImageFile(null);
    setBackImageFile(null);
    setTallesInput([
      { talle: 'S', stockTalle: 5 },
      { talle: 'M', stockTalle: 5 },
      { talle: 'L', stockTalle: 5 },
      { talle: 'XL', stockTalle: 5 }
    ]);
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      temporada: '2026',
      tipo: 'TITULAR',
      idCategoria: categories[0]?.idCategoria || '',
      idClub: clubs[0]?.idClub || '',
      fotoUrl: '',
      fotosUrls: []
    });
    setShowProductModal(true);
  };

  // Open modal for editing product
  const handleEditProduct = (prod) => {
    setEditingProduct(prod);
    setMainImageFile(null);
    setBackImageFile(null);
    
    // Mapear talles existentes
    const existingTalles = prod.talles && prod.talles.length > 0 
      ? prod.talles.map(t => ({ talle: t.talle, stockTalle: t.stockTalle })) 
      : [
          { talle: 'S', stockTalle: 0 },
          { talle: 'M', stockTalle: 0 },
          { talle: 'L', stockTalle: 0 },
          { talle: 'XL', stockTalle: 0 }
        ];
    
    setTallesInput(existingTalles);
    setFormData({
      nombre: prod.nombre,
      descripcion: prod.descripcion || '',
      precio: prod.precio,
      stock: prod.stock || 0,
      temporada: prod.temporada || '2026',
      tipo: prod.tipo || 'TITULAR',
      idCategoria: prod.idCategoria || categories[0]?.idCategoria || '',
      idClub: prod.idClub || clubs[0]?.idClub || '',
      fotoUrl: prod.fotoUrl || '',
      fotosUrls: prod.fotosUrls || []
    });
    setShowProductModal(true);
  };

  // Delete product
  const handleDeleteProduct = (id) => {
    setConfirmDeleteId(id);
  };

  // Handle stock change in talles
  const handleTalleStockChange = (index, value) => {
    const updated = [...tallesInput];
    updated[index].stockTalle = parseInt(value) || 0;
    setTallesInput(updated);
    
    // Sum stock of all sizes and update total stock
    const total = updated.reduce((sum, item) => sum + item.stockTalle, 0);
    setFormData(prev => ({ ...prev, stock: total }));
  };

  // Handle Form Submit (Create or Update)
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      
      let finalFotoUrl = formData.fotoUrl;
      let finalFotosUrls = [...formData.fotosUrls];
      
      // Upload main image if file is selected
      if (mainImageFile) {
        finalFotoUrl = await uploadImage(mainImageFile);
      }
      
      // Upload back image if file is selected
      if (backImageFile) {
        const dorsalUrl = await uploadImage(backImageFile);
        finalFotosUrls = [dorsalUrl]; // We save dorsal in fotosUrls list
      }
      
      const payload = {
        ...formData,
        fotoUrl: finalFotoUrl,
        fotosUrls: finalFotosUrls,
        talles: tallesInput,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock) || 0,
        idCategoria: parseInt(formData.idCategoria),
        idClub: parseInt(formData.idClub)
      };
      
      if (editingProduct) {
        // UPDATE
        await fetchApi(`/catalogo/productos/${editingProduct.idProducto}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        showToast('Producto actualizado con éxito.', 'success');
      } else {
        // CREATE
        await fetchApi('/catalogo/productos', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        showToast('Producto creado con éxito.', 'success');
      }
      
      setShowProductModal(false);
      loadDashboardData();
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error al guardar el producto.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      setActionLoading(true);
      await fetchApi(`/ordenes/${orderId}/estado?estado=${newStatus}`, {
        method: 'PUT'
      });
      showToast('Estado de la orden actualizado.', 'success');
      loadDashboardData();
    } catch (err) {
      showToast(err.message || 'Error al actualizar estado de la orden.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Render Loader
  if (loading) {
    return (
      <div className="admin-loading-container">
        <FiRefreshCw className="spinner" />
        <p>Cargando panel de administración...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page container">
      <div className="admin-header">
        <div>
          <h1>Panel de Administración</h1>
          <p className="admin-subtitle">Gestión integral del catálogo, ventas y estadísticas en tiempo real.</p>
        </div>
        <button className="btn-refresh" onClick={loadDashboardData} disabled={actionLoading}>
          <FiRefreshCw /> Actualizar Datos
        </button>
      </div>

      {error && (
        <div className="admin-error-banner">
          <p>{error}</p>
        </div>
      )}

      {/* Tabs Selector */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <FiTrendingUp /> Estadísticas
        </button>
        <button 
          className={`tab-btn ${activeTab === 'productos' ? 'active' : ''}`}
          onClick={() => setActiveTab('productos')}
        >
          <FiInbox /> Productos
        </button>
        <button 
          className={`tab-btn ${activeTab === 'pedidos' ? 'active' : ''}`}
          onClick={() => setActiveTab('pedidos')}
        >
          <FiShoppingBag /> Pedidos
        </button>
      </div>

      {/* TAB CONTENT: STATS */}
      {activeTab === 'stats' && stats && (
        <div className="stats-tab-content">
          <div className="stats-grid">
            <div className="stats-card">
              <div className="stats-icon-wrapper sales">
                <FiTrendingUp size={24} />
              </div>
              <div className="stats-info">
                <h3>Total Ventas</h3>
                <p className="stats-value">${stats.totalVentas?.toLocaleString('es-AR')},00</p>
              </div>
            </div>

            <div className="stats-card">
              <div className="stats-icon-wrapper orders">
                <FiShoppingBag size={24} />
              </div>
              <div className="stats-info">
                <h3>Total Pedidos</h3>
                <p className="stats-value">{stats.totalOrdenes}</p>
              </div>
            </div>

            <div className="stats-card">
              <div className="stats-icon-wrapper users">
                <FiUsers size={24} />
              </div>
              <div className="stats-info">
                <h3>Total Usuarios</h3>
                <p className="stats-value">{stats.totalUsuarios}</p>
              </div>
            </div>

            <div className="stats-card">
              <div className="stats-icon-wrapper products">
                <FiLayers size={24} />
              </div>
              <div className="stats-info">
                <h3>Total Productos</h3>
                <p className="stats-value">{stats.totalProductos}</p>
              </div>
            </div>
          </div>

          <div className="stats-charts-section">
            <div className="chart-card">
              <h3>Distribución de Pedidos por Estado</h3>
              <div className="status-bars">
                {Object.entries(stats.ordenesPorEstado || {}).map(([estado, count]) => (
                  <div key={estado} className="status-bar-row">
                    <span className="status-label">{estado}</span>
                    <div className="status-bar-track">
                      <div 
                        className={`status-bar-fill ${estado.toLowerCase()}`} 
                        style={{ width: `${(count / stats.totalOrdenes) * 100}%` }}
                      ></div>
                    </div>
                    <span className="status-count">{count}</span>
                  </div>
                ))}
                {(!stats.ordenesPorEstado || Object.keys(stats.ordenesPorEstado).length === 0) && (
                  <p className="empty-message">No hay órdenes registradas.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PRODUCTOS */}
      {activeTab === 'productos' && (
        <div className="products-tab-content">
          <div className="tab-actions">
            <h2>Gestión de Catálogo ({products.length} productos)</h2>
            <button className="btn-create-product" onClick={handleNewProduct}>
              <FiPlus /> Añadir Producto
            </button>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Club / Categoria</th>
                  <th>Precio</th>
                  <th>Stock Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(prod => (
                  <tr key={prod.idProducto}>
                    <td>
                      <div className="table-img-container">
                        {prod.fotoUrl ? (
                          <img src={getImageUrl(prod.fotoUrl)} alt={prod.nombre} />
                        ) : (
                          <div className="table-img-placeholder"></div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="prod-name-cell">
                        <span className="prod-name">{prod.nombre}</span>
                        <span className="prod-season">Temporada: {prod.temporada || 'N/A'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="prod-meta-cell">
                        <span className="meta-badge club">{prod.nombreClub || 'Desconocido'}</span>
                        <span className="meta-badge cat">
                          {categories.find(c => c.idCategoria === prod.idCategoria)?.nombre || 'General'}
                        </span>
                      </div>
                    </td>
                    <td className="price-cell">${prod.precio?.toLocaleString('es-AR')},00</td>
                    <td className={`stock-cell ${prod.stock === 0 ? 'out' : ''}`}>
                      {prod.stock} u.
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn edit" 
                          onClick={() => handleEditProduct(prod)}
                          title="Editar producto"
                        >
                          <FiEdit2 />
                        </button>
                        <button 
                          className="action-btn delete" 
                          onClick={() => handleDeleteProduct(prod.idProducto)}
                          disabled={actionLoading}
                          title="Eliminar producto"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PEDIDOS */}
      {activeTab === 'pedidos' && (
        <div className="orders-tab-content">
          <h2>Registro de Pedidos Recibidos ({orders.length} pedidos)</h2>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Dirección</th>
                  <th>Detalle Productos</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.idOrden}>
                    <td className="bold-cell">#{order.idOrden}</td>
                    <td>{new Date(order.fecha).toLocaleDateString('es-AR', { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="address-cell">{order.direccionEntrega}</td>
                    <td>
                      <div className="order-items-list">
                        {order.detalles?.map((det, idx) => (
                          <div key={idx} className="order-item-desc">
                            • {det.nombreProducto} ({det.talle || 'Único'}) x {det.cantidad}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="price-cell font-large">${order.total?.toLocaleString('es-AR')},00</td>
                    <td>
                      <span className={`status-badge ${order.estado?.toLowerCase()}`}>
                        {order.estado}
                      </span>
                    </td>
                    <td>
                      <div className="order-actions">
                        <select 
                          value={order.estado} 
                          onChange={(e) => handleUpdateOrderStatus(order.idOrden, e.target.value)}
                          disabled={actionLoading}
                          className="status-select"
                        >
                          <option value="PENDIENTE">PENDIENTE</option>
                          <option value="CONFIRMADA">CONFIRMADA</option>
                          <option value="COMPLETADA">COMPLETADA</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                      No se han recibido pedidos aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRODUCT CREATION/EDITION MODAL */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>{editingProduct ? 'Editar Camiseta' : 'Añadir Nueva Camiseta'}</h2>
              <button className="close-btn" onClick={() => setShowProductModal(false)}>
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} className="modal-form">
              <div className="form-grid">
                <div className="form-group span-2">
                  <label>Nombre del Producto *</label>
                  <input 
                    type="text" 
                    value={formData.nombre} 
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    required 
                    placeholder="Ej: Camiseta Boca Juniors 2025"
                  />
                </div>

                <div className="form-group span-2">
                  <label>Descripción</label>
                  <textarea 
                    value={formData.descripcion} 
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    placeholder="Describe los detalles de la camiseta, tela, sponsors, etc."
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Precio (ARS) *</label>
                  <input 
                    type="number" 
                    value={formData.precio} 
                    onChange={(e) => setFormData({...formData, precio: e.target.value})}
                    required 
                    min="1"
                    placeholder="Ej: 79990"
                  />
                </div>

                <div className="form-group">
                  <label>Temporada</label>
                  <input 
                    type="text" 
                    value={formData.temporada} 
                    onChange={(e) => setFormData({...formData, temporada: e.target.value})}
                    placeholder="Ej: 2025"
                  />
                </div>

                <div className="form-group">
                  <label>Tipo de Camiseta *</label>
                  <select 
                    value={formData.tipo} 
                    onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                    required
                  >
                    <option value="TITULAR">Titular</option>
                    <option value="SUPLENTE">Suplente</option>
                    <option value="TERCERA">Tercera</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Categoría *</label>
                  <select 
                    value={formData.idCategoria} 
                    onChange={(e) => setFormData({...formData, idCategoria: e.target.value})}
                    required
                  >
                    {categories.map(c => (
                      <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Club *</label>
                  <select 
                    value={formData.idClub} 
                    onChange={(e) => setFormData({...formData, idClub: e.target.value})}
                    required
                  >
                    {clubs.map(c => (
                      <option key={c.idClub} value={c.idClub}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Imagen Frontal (Frente) *</label>
                  <div className="file-upload-box">
                    <input 
                      type="file" 
                      accept="image/*"
                      id="main-image-file"
                      onChange={(e) => setMainImageFile(e.target.files[0])}
                    />
                    <label htmlFor="main-image-file" className="file-upload-label">
                      <FiUploadCloud size={20} />
                      <span>{mainImageFile ? mainImageFile.name : 'Subir archivo de imagen'}</span>
                    </label>
                  </div>
                  {formData.fotoUrl && !mainImageFile && (
                    <span className="current-url-label">Imagen actual: {formData.fotoUrl.split('/').pop()}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Imagen Dorsal (Espalda)</label>
                  <div className="file-upload-box">
                    <input 
                      type="file" 
                      accept="image/*"
                      id="back-image-file"
                      onChange={(e) => setBackImageFile(e.target.files[0])}
                    />
                    <label htmlFor="back-image-file" className="file-upload-label">
                      <FiUploadCloud size={20} />
                      <span>{backImageFile ? backImageFile.name : 'Subir archivo de imagen (Opcional)'}</span>
                    </label>
                  </div>
                  {formData.fotosUrls && formData.fotosUrls.length > 0 && !backImageFile && (
                    <span className="current-url-label">Imagen actual: {formData.fotosUrls[0].split('/').pop()}</span>
                  )}
                </div>
              </div>

              {/* Talles Grid */}
              <div className="talles-form-section">
                <h3>Stock por Talles</h3>
                <div className="talles-stock-grid">
                  {tallesInput.map((t, idx) => (
                    <div key={idx} className="talle-stock-input-group">
                      <label>Talle {t.talle}</label>
                      <input 
                        type="number" 
                        value={t.stockTalle}
                        onChange={(e) => handleTalleStockChange(idx, e.target.value)}
                        min="0"
                      />
                    </div>
                  ))}
                </div>
                <div className="total-stock-count">
                  Stock Total Calculado: <strong>{formData.stock || 0} unidades</strong>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowProductModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save" disabled={actionLoading}>
                  {actionLoading ? 'Guardando...' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDeleteId && (
        <div className="custom-confirm-modal-overlay">
          <div className="custom-confirm-modal">
            <h3>¿Eliminar Producto?</h3>
            <p>¿Estás seguro de que deseas eliminar este producto del catálogo? Esta acción no se puede deshacer.</p>
            <div className="confirm-modal-actions">
              <button 
                type="button" 
                className="btn-confirm-cancel" 
                onClick={() => setConfirmDeleteId(null)}
                disabled={actionLoading}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn-confirm-accept" 
                onClick={async () => {
                  try {
                    setActionLoading(true);
                    await fetchApi(`/catalogo/productos/${confirmDeleteId}`, {
                      method: 'DELETE'
                    });
                    showToast('Producto eliminado correctamente.', 'success');
                    setConfirmDeleteId(null);
                    loadDashboardData();
                  } catch (err) {
                    showToast(err.message || 'Error al eliminar producto.', 'error');
                  } finally {
                    setActionLoading(false);
                  }
                }}
                disabled={actionLoading}
              >
                {actionLoading ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
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

export default AdminDashboard;
