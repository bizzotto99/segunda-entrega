import React, { useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="toast-icon success" />;
      case 'error':
        return <FiAlertCircle className="toast-icon error" />;
      default:
        return <FiInfo className="toast-icon info" />;
    }
  };

  return (
    <div className={`custom-toast ${type}`}>
      <div className="toast-content">
        {getIcon()}
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close-btn" onClick={onClose} aria-label="Cerrar">
        <FiX />
      </button>
    </div>
  );
};

export default Toast;
