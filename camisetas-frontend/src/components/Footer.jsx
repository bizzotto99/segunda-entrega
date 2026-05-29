import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-col">
          <h2 className="footer-logo">UADE<span className="logo-accent">SHOP</span></h2>
          <p className="footer-desc">
            La mejor tienda de camisetas de fútbol. Productos oficiales de las mejores ligas y selecciones del mundo.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-icon"><FiFacebook /></a>
            <a href="#" className="social-icon"><FiInstagram /></a>
            <a href="#" className="social-icon"><FiTwitter /></a>
          </div>
        </div>
        
        <div className="footer-col">
          <h3 className="footer-title">Enlaces Rápidos</h3>
          <ul className="footer-links">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/catalogo?categoriaId=1">Primera Division</Link></li>
            <li><Link to="/catalogo?categoriaId=2">Segunda Division</Link></li>
            <li><Link to="/catalogo?categoriaId=3">Selección</Link></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h3 className="footer-title">Atención al Cliente</h3>
          <ul className="footer-links">
            <li><a href="#">Preguntas Frecuentes</a></li>
            <li><a href="#">Envíos y Devoluciones</a></li>
            <li><a href="#">Guía de Tallas</a></li>
            <li><a href="#">Términos y Condiciones</a></li>
            <li><a href="#">Política de Privacidad</a></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h3 className="footer-title">Contacto</h3>
          <ul className="footer-contact">
            <li>
              <FiMapPin className="contact-icon" />
              <span>Av. Corrientes 1234, Buenos Aires, Argentina</span>
            </li>
            <li>
              <FiPhone className="contact-icon" />
              <span>+54 11 1234-5678</span>
            </li>
            <li>
              <FiMail className="contact-icon" />
              <span>info@uadeshop.com</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
