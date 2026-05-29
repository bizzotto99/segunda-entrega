import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Auth.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const { login, clearError, isLoading, error } = useAuth();
  const { mergeLocalCart } = useCart();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      await mergeLocalCart();
      navigate('/perfil');
    } catch (err) {
      // El error ya es manejado por el context de autenticación
      console.error("Error al iniciar sesión:", err);
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
            Accede a tu cuenta para explorar las últimas camisetas oficiales de la Primera División, el Ascenso y Selecciones internacionales.
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
          <h2 className="auth-title">Bienvenido de nuevo</h2>
          <p className="auth-subtitle">Ingresa a tu cuenta para continuar comprando</p>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="username">Usuario</label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                value={credentials.username} 
                onChange={handleChange}
                placeholder="tu_usuario"
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={credentials.password} 
                onChange={handleChange}
                placeholder="••••••••"
                required 
              />
            </div>
            
            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? <div className="spinner"></div> : 'Iniciar Sesión'}
            </button>
          </form>
          
          <div className="auth-footer">
            ¿No tienes una cuenta? <Link to="/registro" className="auth-link">Regístrate aquí</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
