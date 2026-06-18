import React, { useState, useEffect } from 'react';
import { FiShield, FiLock, FiTruck, FiAward, FiArrowRight, FiBarChart2 } from 'react-icons/fi';
import './HeroSection.css';
import { Link } from 'react-router-dom';

// Import local assets
import heroSoccerBg from '../assets/hero_soccer_bg.png';
import mysteryBoxImg from '../assets/mystery_box.png';
import slide2 from '../assets/slider2.jpg';
import slide3 from '../assets/slider3.jpg';

const scrollToRanking = () => {
  const el = document.getElementById('ranking');
  if (!el) return;
  const offset = 80;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
};

const sliderImages = [
  heroSoccerBg,
  slide2,
  slide3
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(sliderImages.length - 1);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => {
        setPrevSlide(prev);
        return (prev + 1) % sliderImages.length;
      });
    }, 6000); // Cambia cada 6 segundos
    
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-slider">
        {sliderImages.map((img, index) => {
          let slideClass = "hero-slide";
          if (index === currentSlide) slideClass += " active";
          else if (index === prevSlide) slideClass += " prev";
          
          return (
            <div 
              key={index} 
              className={slideClass}
              style={{ backgroundImage: `url(${img})` }}
            />
          );
        })}
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-content container">
        <div className="hero-text-box">
          <div className="hero-badge-pill">
            <FiAward className="hero-badge-icon" />
            <span>LA CAMISETA TE HACE HINCHA, LA PASIÓN GANADOR</span>
          </div>
          
          <h1 className="hero-title">
            VESTÍ A TU EQUIPO,<br />
            <span className="hero-title-cyan">DOMINÁ EL RANKING</span>
          </h1>
          
          <p className="hero-subtitle">
            Comprá las camisetas oficiales y acumulá puntos para llegar a la cima del ranking.
          </p>
          
          <div className="hero-cta-group">
            <Link to="/catalogo" className="btn-explore">
              EXPLORAR CATÁLOGO <FiArrowRight style={{ marginLeft: '8px' }} />
            </Link>
            <button className="btn-explore-secondary" onClick={scrollToRanking}>
              COMPETÍ POR PUNTOS <FiBarChart2 style={{ marginLeft: '8px', transform: 'rotate(-90deg) scaleY(-1)' }} />
            </button>
          </div>
        </div>

        {/* Trust Benefits Bar inside the hero */}
        <div className="hero-benefits-bar">
          <div className="benefit-bar-item">
            <FiShield className="benefit-bar-icon" />
            <span>PRODUCTOS OFICIALES</span>
          </div>
          <div className="benefit-bar-item">
            <FiLock className="benefit-bar-icon" />
            <span>PAGO 100% SEGURO</span>
          </div>
          <div className="benefit-bar-item">
            <FiTruck className="benefit-bar-icon" />
            <span>ENVÍOS A TODO EL PAÍS</span>
          </div>
          <div className="benefit-bar-item">
            <FiAward className="benefit-bar-icon" />
            <span>SUMÁ PUNTOS Y SUBÍ EN EL RANKING</span>
          </div>
        </div>
      </div>

      {/* Categories Grid overlapping the bottom of the hero */}
      <div className="hero-categories-grid container">
        <Link to="/catalogo?categoriaId=1" className="category-card card-hover-cyan">
          <div className="category-card-bg" style={{ backgroundImage: `url('/Imagenes Frontend/Imagenes Frontend Primera/Boca frontal.webp')` }}></div>
          <div className="category-card-content">
            <h3 className="category-card-title">CAMISETAS<br />PRIMERA DIVISIÓN</h3>
            <span className="category-card-link">Ver productos &rarr;</span>
          </div>
        </Link>
        
        <Link to="/catalogo?categoriaId=2" className="category-card">
          <div className="category-card-bg" style={{ backgroundImage: `url('/Imagenes Frontend/Imagenes Frontend B Nacional/Colon frontal.webp')` }}></div>
          <div className="category-card-content">
            <h3 className="category-card-title">CAMISETAS<br />SEGUNDA DIVISIÓN</h3>
            <span className="category-card-link">Ver productos &rarr;</span>
          </div>
        </Link>
        
        <Link to="/catalogo?categoriaId=3" className="category-card">
          <div className="category-card-bg" style={{ backgroundImage: `url('/Imagenes Frontend/Imagenes Frontend Seleccion/ArgentinaTitular frontal.webp')` }}></div>
          <div className="category-card-content">
            <h3 className="category-card-title">SELECCIÓN<br />ARGENTINA</h3>
            <span className="category-card-link">Ver productos &rarr;</span>
          </div>
        </Link>
        
        <Link to="/catalogo" className="category-card card-mystery-box">
          <div className="category-card-bg" style={{ backgroundImage: `url(${mysteryBoxImg})` }}></div>
          <div className="category-card-content">
            <h3 className="category-card-title">MYSTERY BOX<br /><span className="text-glow-purple">¡SORPRESA ASEGURADA!</span></h3>
            <span className="category-card-link text-glow-purple">Descubrir más &rarr;</span>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;

