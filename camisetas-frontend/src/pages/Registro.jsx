import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Registro = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    nombre: '',
    apellido: ''
  });
  
  const [successMsg, setSuccessMsg] = useState('');
  
  const navigate = useNavigate();
  const { register, clearError, isLoading, error } = useAuth();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    if (error) clearError();
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(userData);
      setSuccessMsg('¡Cuenta creada con éxito! Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      console.error("Error al registrarse:", err);
    }
  };

  return (
    <div className="auth-page-split">
      {/* Left side: Passions content and showcase image */}
      <div className="auth-side-image">
        <div className="auth-side-overlay"></div>
        <div className="auth-side-content">
          <h1 className="auth-side-logo">UADE<span className="logo-accent">SHOP</span></h1>
          <p className="auth-side-slogan">Lleva los colores de tu pasión</p>
          <p className="auth-side-desc">
            Regístrate hoy para guardar tus camisetas favoritas, gestionar tu carrito de compras y realizar pedidos con envíos a todo el país.
          </p>
        </div>
        
        <div className="auth-side-showcase">
          <img src="/image.png" alt="Uadeshop Fútbol" />
        </div>
      </div>

      {/* Right side: Form container */}
      <div className="auth-side-form">
        <div className="auth-container">
          <div className="auth-logo-mobile">UADE<span className="logo-accent">SHOP</span></div>
          <h2 className="auth-title">Crea tu cuenta</h2>
          <p className="auth-subtitle">Únete para comprar las mejores camisetas</p>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            {successMsg && <div className="auth-error" style={{background: 'rgba(76, 175, 80, 0.1)', color: '#81c784', borderColor: 'rgba(76, 175, 80, 0.3)'}}>{successMsg}</div>}
            
            <div className="form-group">
              <label htmlFor="username">Nombre de Usuario</label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                value={userData.username} 
                onChange={handleChange}
                placeholder="tu_usuario"
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={userData.email} 
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                required 
              />
            </div>
            
            <div className="row-group">
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input 
                  type="text" 
                  id="nombre" 
                  name="nombre" 
                  value={userData.nombre} 
                  onChange={handleChange}
                  placeholder="Juan"
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="apellido">Apellido</label>
                <input 
                  type="text" 
                  id="apellido" 
                  name="apellido" 
                  value={userData.apellido} 
                  onChange={handleChange}
                  placeholder="Pérez"
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={userData.password} 
                onChange={handleChange}
                placeholder="••••••••"
                required 
              />
            </div>
            
            <button type="submit" className="auth-button" disabled={isLoading || successMsg}>
              {isLoading ? <div className="spinner"></div> : 'Registrarme'}
            </button>
          </form>
          
          <div className="auth-footer">
            ¿Ya tienes una cuenta? <Link to="/login" className="auth-link">Inicia sesión aquí</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;
