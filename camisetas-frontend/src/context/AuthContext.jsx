//react context
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);
//el estado inicial: definicion de estados del token, estados del usuario logueado y estados auxiliar
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar el perfil de usuario de manera automática si hay un token persistido - token en el navegador
  useEffect(() => {
    const loadProfile = async () => {
      if (token && !user) {
        setIsLoading(true);
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch (err) {
          console.error("Error al cargar perfil de usuario persistido:", err);
          // Si el token es inválido o expiró, cerramos la sesión
          logout();
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadProfile();
  }, [token]);

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.usuario);
      return data;
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.register(userData);
      return data;
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
