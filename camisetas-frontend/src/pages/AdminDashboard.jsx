import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../redux/hooks';
import { fetchApi, getImageUrl } from '../services/api';
import { 
  FiTrendingUp, FiShoppingBag, FiUsers, FiLayers, FiPlus, 
  FiTrash2, FiEdit2, FiCheck, FiX, FiUploadCloud, FiInbox, FiRefreshCw, FiPercent
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
  const [subastas, setSubastas] = useState([]);
  
  // Subasta Modal States
  const [showSubastaModal, setShowSubastaModal] = useState(false);
  const [subastaForm, setSubastaForm] = useState({
    nombre: '',
    descripcion: '',
    fotoUrl: '',
    club: '',
    fotosUrls: '',
    precioInicial: '',
    fechaInicio: '',
    fechaFin: ''
  });
  const [subastaLoading, setSubastaLoading] = useState(false);
  const [subastaMainImageFile, setSubastaMainImageFile] = useState(null);
  const [subastaBackImageFile, setSubastaBackImageFile] = useState(null);
  
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
  
  // Discount Modal States
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountProduct, setDiscountProduct] = useState(null);
  const [productDiscounts, setProductDiscounts] = useState([]);
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountForm, setDiscountForm] = useState({
    porcentaje: 10,
    fechaInicio: '',
    fechaFin: ''
  });
  
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
      const [catsData, clubsData, statsData, ordersData, prodsData, subastasData] = await Promise.all([
        fetchApi('/catalogo/categorias'),
        fetchApi('/catalogo/clubes'),
        fetchApi('/admin/stats'),
        fetchApi('/ordenes'), // GET /api/ordenes returns all orders for VENDEDOR
        fetchApi('/catalogo/productos'),
        fetchApi('/admin/subastas')
      ]);
      
      setCategories(catsData || []);
      setClubs(clubsData || []);
      setStats(statsData);
      setOrders(ordersData || []);
      setProducts(prodsData || []);
      setSubastas(subastasData || []);
      
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
        const updatedProduct = await fetchApi(`/catalogo/productos/${editingProduct.idProducto}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        setProducts(prevProducts => 
          prevProducts.map(p => p.idProducto === editingProduct.idProducto ? updatedProduct : p)
        );
        showToast('Producto actualizado con éxito.', 'success');
      } else {
        // CREATE
        const newProduct = await fetchApi('/catalogo/productos', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        setProducts(prevProducts => [...prevProducts, newProduct]);
        try {
          const statsData = await fetchApi('/admin/stats');
          setStats(statsData);
        } catch (err) {
          console.error("Error al actualizar estadísticas:", err);
        }
        showToast('Producto creado con éxito.', 'success');
      }
      
      setShowProductModal(false);
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error al guardar el producto.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Open modal to create a subasta
  const handleNewSubasta = () => {
    setSubastaForm({
      nombre: '',
      descripcion: '',
      fotoUrl: '',
      club: '',
      fotosUrls: '',
      precioInicial: '',
      fechaInicio: '',
      fechaFin: ''
    });
    setSubastaMainImageFile(null);
    setSubastaBackImageFile(null);
    setShowSubastaModal(true);
  };

  // Submit subasta
  const handleSubmitSubasta = async (e) => {
    e.preventDefault();
    try {
      setSubastaLoading(true);

      let finalFotoUrl = subastaForm.fotoUrl;
      if (subastaMainImageFile) {
        finalFotoUrl = await uploadImage(subastaMainImageFile);
      }
      if (!finalFotoUrl) {
        showToast('Debes seleccionar una imagen principal o ingresar una URL.', 'error');
        setSubastaLoading(false);
        return;
      }

      let additionalUrls = subastaForm.fotosUrls ? subastaForm.fotosUrls.split(',').map(url => url.trim()).filter(Boolean) : [];
      if (subastaBackImageFile) {
        const backUrl = await uploadImage(subastaBackImageFile);
        additionalUrls.push(backUrl);
      }

      const payload = {
        nombre: subastaForm.nombre.trim(),
        descripcion: subastaForm.descripcion.trim(),
        fotoUrl: finalFotoUrl.trim(),
        club: subastaForm.club.trim(),
        fotosUrls: additionalUrls,
        precioInicial: parseFloat(subastaForm.precioInicial),
        fechaInicio: subastaForm.fechaInicio,
        fechaFin: subastaForm.fechaFin
      };

      const newSub = await fetchApi('/admin/subastas', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setSubastas(prev => [...prev, newSub]);
      showToast('Subasta creada con éxito.', 'success');
      setShowSubastaModal(false);
      loadDashboardData();
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error al crear la subasta.', 'error');
    } finally {
      setSubastaLoading(false);
    }
  };

  // Finalize subasta manually
  const handleFinalizeSubasta = async (id) => {
    try {
      setActionLoading(true);
      const updated = await fetchApi(`/admin/subastas/${id}/finalizar`, {
        method: 'POST'
      });
      setSubastas(prev => prev.map(s => s.idSubasta === id ? updated : s));
      showToast('Subasta finalizada manualmente.', 'success');
      loadDashboardData();
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error al finalizar la subasta.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete subasta
  const handleDeleteSubasta = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta subasta?')) return;
    try {
      setActionLoading(true);
      await fetchApi(`/admin/subastas/${id}`, {
        method: 'DELETE'
      });
      setSubastas(prev => prev.filter(s => s.idSubasta !== id));
      showToast('Subasta eliminada con éxito.', 'success');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error al eliminar la subasta.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Manage Discounts - Open Modal & Load Existing
  const handleManageDiscount = async (prod) => {
    setDiscountProduct(prod);
    setProductDiscounts([]);
    setDiscountLoading(true);
    setShowDiscountModal(true);
    
    const now = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(now.getMonth() + 1);
    
    const formatDate = (date) => {
      const pad = (num) => String(num).padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };
    
    setDiscountForm({
      porcentaje: prod.descuentoActual || 10,
      fechaInicio: formatDate(now),
      fechaFin: formatDate(oneMonthLater)
    });
    
    try {
      const data = await fetchApi(`/catalogo/productos/${prod.idProducto}/descuentos`);
      setProductDiscounts(data || []);
    } catch (err) {
      console.error("Error al cargar descuentos:", err);
      showToast("Error al cargar los descuentos del producto.", "error");
    } finally {
      setDiscountLoading(false);
    }
  };

  // Apply a new discount
  const handleApplyDiscount = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      
      const ensureSeconds = (dateStr) => {
        if (!dateStr) return dateStr;
        if (dateStr.length === 16) {
          return `${dateStr}:00`;
        }
        return dateStr;
      };

      const payload = {
        porcentaje: parseFloat(discountForm.porcentaje),
        fechaInicio: ensureSeconds(discountForm.fechaInicio),
        fechaFin: ensureSeconds(discountForm.fechaFin)
      };
      
      await fetchApi(`/catalogo/productos/${discountProduct.idProducto}/descuentos`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const updatedProduct = await fetchApi(`/catalogo/productos/${discountProduct.idProducto}`);
      setProducts(prevProducts => 
        prevProducts.map(p => p.idProducto === discountProduct.idProducto ? updatedProduct : p)
      );
      showToast("Descuento aplicado con éxito.", "success");
      setShowDiscountModal(false);
    } catch (err) {
      console.error(err);
      showToast(err.message || "Error al aplicar el descuento.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete a discount
  const handleDeleteDiscount = async (idDescuento) => {
    try {
      setActionLoading(true);
      await fetchApi(`/catalogo/descuentos/${idDescuento}`, {
        method: 'DELETE'
      });
      
      showToast("Descuento eliminado con éxito.", "success");
      // Refresh active discounts list
      const data = await fetchApi(`/catalogo/productos/${discountProduct.idProducto}/descuentos`);
      setProductDiscounts(data || []);
      const updatedProduct = await fetchApi(`/catalogo/productos/${discountProduct.idProducto}`);
      setProducts(prevProducts => 
        prevProducts.map(p => p.idProducto === discountProduct.idProducto ? updatedProduct : p)
      );
    } catch (err) {
      console.error(err);
      showToast(err.message || "Error al eliminar el descuento.", "error");
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
      setOrders(prevOrders => 
        prevOrders.map(o => o.idOrden === orderId ? { ...o, estado: newStatus } : o)
      );
      try {
        const statsData = await fetchApi('/admin/stats');
        setStats(statsData);
      } catch (err) {
        console.error("Error al actualizar estadísticas:", err);
      }
      showToast('Estado de la orden actualizado.', 'success');
    } catch (err) {
      showToast(err.message || 'Error al actualizar estado de la orden.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Render Loader
  if (loading) {
    return (
      <div className="spinner-container" style={{ minHeight: '70vh' }}>
        <div className="loader-spinner"></div>
        <p style={{ color: 'var(--color-gray-500)', fontSize: '14px', fontWeight: '500' }}>Cargando panel de administración...</p>
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
        <button 
          className={`tab-btn ${activeTab === 'subastas' ? 'active' : ''}`}
          onClick={() => setActiveTab('subastas')}
        >
          <FiTrendingUp /> Subastas
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
                  <th>Precio Base</th>
                  <th>Descuento</th>
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
                    <td>
                      {prod.descuentoActual && prod.descuentoActual > 0 ? (
                        <span className="discount-badge">{prod.descuentoActual}% OFF</span>
                      ) : (
                        <span className="no-discount-badge">Sin Descuento</span>
                      )}
                    </td>
                    <td className={`stock-cell ${prod.stock === 0 ? 'out' : ''}`}>
                      {prod.stock} u.
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn discount" 
                          onClick={() => handleManageDiscount(prod)}
                          title="Gestionar descuento"
                        >
                          <FiPercent />
                        </button>
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

      {/* TAB CONTENT: SUBASTAS */}
      {activeTab === 'subastas' && (
        <div className="products-tab-content">
          <div className="tab-actions">
            <h2>Gestión de Subastas ({subastas.length} subastas)</h2>
            <button className="btn-create-product" onClick={handleNewSubasta}>
              <FiPlus /> Crear Subasta
            </button>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Producto</th>
                  <th>Precio Inicial</th>
                  <th>Precio Actual</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th>Estado</th>
                  <th>Ganador</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {subastas.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                      No hay subastas registradas en el sistema.
                    </td>
                  </tr>
                ) : (
                  subastas.map(sub => {
                    const subEnded = sub.estado === 'FINALIZADA' || new Date(sub.fechaFin).getTime() <= new Date().getTime();
                    return (
                      <tr key={sub.idSubasta}>
                        <td>
                          <div className="table-img-container">
                            {sub.producto?.fotoUrl ? (
                              <img src={getImageUrl(sub.producto.fotoUrl)} alt={sub.producto.nombre} />
                            ) : (
                              <div className="table-img-placeholder"></div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="prod-name-cell">
                            <span className="prod-name">{sub.producto?.nombre}</span>
                            <span className="prod-season">{sub.producto?.nombreClub}</span>
                          </div>
                        </td>
                        <td className="price-cell">${sub.precioInicial?.toLocaleString('es-AR')}</td>
                        <td className="price-cell" style={{ color: '#00f0ff', fontWeight: 'bold' }}>
                          ${sub.precioActual?.toLocaleString('es-AR')}
                        </td>
                        <td className="date-cell" style={{ fontSize: '0.8rem' }}>
                          {new Date(sub.fechaInicio).toLocaleString('es-AR')}
                        </td>
                        <td className="date-cell" style={{ fontSize: '0.8rem' }}>
                          {new Date(sub.fechaFin).toLocaleString('es-AR')}
                        </td>
                        <td>
                          <span className={`status-pill ${subEnded ? 'ended' : 'active'}`} style={{ display: 'inline-block' }}>
                            {subEnded ? 'Finalizada' : 'Activa'}
                          </span>
                        </td>
                        <td>
                          {sub.ganadorUsername ? (
                            <div className="prod-name-cell">
                              <span className="prod-name" style={{ color: '#eab308' }}>🏆 {sub.ganadorUsername}</span>
                              <span className="prod-season">{sub.ganadorNombreCompleto}</span>
                            </div>
                          ) : (
                            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Ninguno</span>
                          )}
                        </td>
                        <td>
                          <div className="action-buttons">
                            {!subEnded && (
                              <button 
                                className="action-btn edit" 
                                onClick={() => handleFinalizeSubasta(sub.idSubasta)}
                                title="Finalizar manualmente"
                                style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '6px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <FiCheck size={16} />
                              </button>
                            )}
                            <button 
                              className="action-btn delete" 
                              onClick={() => handleDeleteSubasta(sub.idSubasta)}
                              title="Eliminar subasta"
                              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '6px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
                    setProducts(prevProducts => prevProducts.filter(p => p.idProducto !== confirmDeleteId));
                    try {
                      const statsData = await fetchApi('/admin/stats');
                      setStats(statsData);
                    } catch (err) {
                      console.error("Error al actualizar estadísticas:", err);
                    }
                    showToast('Producto eliminado correctamente.', 'success');
                    setConfirmDeleteId(null);
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
      {/* PRODUCT DISCOUNT MODAL */}
      {showDiscountModal && discountProduct && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h2>Gestionar Descuento</h2>
              <button className="close-btn" onClick={() => setShowDiscountModal(false)}>
                <FiX size={20} />
              </button>
            </div>
            
            <div className="discount-modal-body" style={{ padding: '24px', overflowY: 'auto' }}>
              <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px', color: '#ffffff' }}>{discountProduct.nombre}</h3>
                <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>
                  Precio base: <strong>${discountProduct.precio?.toLocaleString('es-AR')},00</strong>
                </p>
              </div>

              {/* LIST OF CURRENT ACTIVE DISCOUNTS */}
              <div className="active-discounts-section" style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
                  <FiPercent style={{ color: 'var(--color-accent)' }} /> Descuentos Activos
                </h4>
                
                {discountLoading ? (
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-500)' }}>Cargando descuentos...</p>
                ) : productDiscounts.length === 0 ? (
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.08)' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-500)' }}>No hay descuentos activos para este producto.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {productDiscounts.map((d) => (
                      <div key={d.idDescuento} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(0, 210, 255, 0.04)', border: '1px solid rgba(0, 210, 255, 0.15)', borderRadius: '10px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: 'var(--color-accent)', color: 'var(--color-secondary)', fontWeight: 'bold', fontSize: '0.85rem', padding: '2px 8px', borderRadius: '20px' }}>
                              {d.porcentaje}% OFF
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>ID: {d.idDescuento}</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginTop: '6px' }}>
                            Validez: {new Date(d.fechaInicio).toLocaleDateString('es-AR')} - {new Date(d.fechaFin).toLocaleDateString('es-AR')}
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => handleDeleteDiscount(d.idDescuento)}
                          style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                          title="Eliminar descuento"
                          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* FORM TO APPLY NEW DISCOUNT */}
              <form onSubmit={handleApplyDiscount} className="discount-form" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', color: '#ffffff' }}>Aplicar Nuevo Descuento</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', color: 'var(--color-gray-800)', fontWeight: '500', marginBottom: '6px', display: 'block' }}>Porcentaje de Descuento (%) *</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        value={discountForm.porcentaje}
                        onChange={(e) => setDiscountForm({ ...discountForm, porcentaje: parseInt(e.target.value) })}
                        style={{ flex: '1', accentColor: 'var(--color-accent)' }}
                      />
                      <span style={{ fontSize: '1.1rem', fontWeight: 'bold', width: '50px', textAlign: 'right', color: 'var(--color-accent)' }}>
                        {discountForm.porcentaje}%
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: '500', marginBottom: '6px', display: 'block' }}>Fecha de Inicio *</label>
                      <input 
                        type="datetime-local" 
                        value={discountForm.fechaInicio}
                        onChange={(e) => setDiscountForm({ ...discountForm, fechaInicio: e.target.value })}
                        required
                        style={{ width: '100%', padding: '10px', background: 'var(--color-gray-100)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: 'white', outline: 'none' }}
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: '500', marginBottom: '6px', display: 'block' }}>Fecha de Fin *</label>
                      <input 
                        type="datetime-local" 
                        value={discountForm.fechaFin}
                        onChange={(e) => setDiscountForm({ ...discountForm, fechaFin: e.target.value })}
                        required
                        style={{ width: '100%', padding: '10px', background: 'var(--color-gray-100)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: 'white', outline: 'none' }}
                      />
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button 
                      type="submit" 
                      className="btn-save" 
                      disabled={actionLoading}
                      style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                    >
                      {actionLoading ? 'Aplicando...' : 'Aplicar Descuento'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CREATE SUBASTA MODAL */}
      {showSubastaModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h2>Crear Nueva Subasta</h2>
              <button className="close-btn" onClick={() => setShowSubastaModal(false)}>
                <FiX size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitSubasta} style={{ padding: '24px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '500', marginBottom: '6px', display: 'block' }}>Nombre de la Camiseta *</label>
                  <input 
                    type="text" 
                    value={subastaForm.nombre}
                    onChange={(e) => setSubastaForm({ ...subastaForm, nombre: e.target.value })}
                    required
                    placeholder="Ej: Camiseta de Boca 1998 Firmada por Palermo"
                    style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: 'white', outline: 'none' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '500', marginBottom: '6px', display: 'block' }}>Descripción / Info *</label>
                  <textarea 
                    value={subastaForm.descripcion}
                    onChange={(e) => setSubastaForm({ ...subastaForm, descripcion: e.target.value })}
                    required
                    placeholder="Ej: Usada en la final de la Copa Libertadores..."
                    rows="3"
                    style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: 'white', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '500', marginBottom: '6px', display: 'block' }}>Club / Selección / Origen *</label>
                  <input 
                    type="text" 
                    value={subastaForm.club}
                    onChange={(e) => setSubastaForm({ ...subastaForm, club: e.target.value })}
                    required
                    placeholder="Ej: Boca Juniors"
                    style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: 'white', outline: 'none' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '500', marginBottom: '6px', display: 'block' }}>Foto Principal *</label>
                  <div className="file-upload-box" style={{ marginBottom: '8px' }}>
                    <input 
                      type="file" 
                      accept="image/*"
                      id="subasta-main-image-file"
                      onChange={(e) => setSubastaMainImageFile(e.target.files[0])}
                    />
                    <label htmlFor="subasta-main-image-file" className="file-upload-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0f172a', border: '1px dashed rgba(255,255,255,0.15)', padding: '12px', borderRadius: '10px', cursor: 'pointer', justifyContent: 'center' }}>
                      <FiUploadCloud size={20} color="#00f0ff" />
                      <span>{subastaMainImageFile ? subastaMainImageFile.name : 'Subir foto principal (Recomendado)'}</span>
                    </label>
                  </div>
                  <input 
                    type="text" 
                    value={subastaForm.fotoUrl}
                    onChange={(e) => setSubastaForm({ ...subastaForm, fotoUrl: e.target.value })}
                    placeholder="O ingresa la URL de la foto principal..."
                    style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: 'white', outline: 'none' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '500', marginBottom: '6px', display: 'block' }}>Fotos Adicionales</label>
                  <div className="file-upload-box" style={{ marginBottom: '8px' }}>
                    <input 
                      type="file" 
                      accept="image/*"
                      id="subasta-back-image-file"
                      onChange={(e) => setSubastaBackImageFile(e.target.files[0])}
                    />
                    <label htmlFor="subasta-back-image-file" className="file-upload-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0f172a', border: '1px dashed rgba(255,255,255,0.15)', padding: '12px', borderRadius: '10px', cursor: 'pointer', justifyContent: 'center' }}>
                      <FiUploadCloud size={20} color="#00f0ff" />
                      <span>{subastaBackImageFile ? subastaBackImageFile.name : 'Subir foto adicional (Opcional)'}</span>
                    </label>
                  </div>
                  <input 
                    type="text" 
                    value={subastaForm.fotosUrls}
                    onChange={(e) => setSubastaForm({ ...subastaForm, fotosUrls: e.target.value })}
                    placeholder="O ingresa URLs adicionales separadas por coma..."
                    style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: 'white', outline: 'none' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '500', marginBottom: '6px', display: 'block' }}>Precio Inicial ($) *</label>
                  <input 
                    type="number" 
                    value={subastaForm.precioInicial}
                    onChange={(e) => setSubastaForm({ ...subastaForm, precioInicial: e.target.value })}
                    required
                    min="1"
                    placeholder="Ej: 85000"
                    style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: 'white', outline: 'none' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '500', marginBottom: '6px', display: 'block' }}>Fecha y Hora de Inicio *</label>
                  <input 
                    type="datetime-local" 
                    value={subastaForm.fechaInicio}
                    onChange={(e) => setSubastaForm({ ...subastaForm, fechaInicio: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: 'white', outline: 'none' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '500', marginBottom: '6px', display: 'block' }}>Fecha y Hora de Fin *</label>
                  <input 
                    type="datetime-local" 
                    value={subastaForm.fechaFin}
                    onChange={(e) => setSubastaForm({ ...subastaForm, fechaFin: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: 'white', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                  <button 
                    type="button" 
                    className="action-btn"
                    onClick={() => setShowSubastaModal(false)}
                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn-save" 
                    disabled={subastaLoading}
                    style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                  >
                    {subastaLoading ? 'Creando...' : 'Crear Subasta'}
                  </button>
                </div>
              </div>
            </form>
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
