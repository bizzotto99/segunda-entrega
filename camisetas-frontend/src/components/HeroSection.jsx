import React, { useState, useEffect } from 'react';
import './HeroSection.css';
import slide2 from '../assets/slider2.jpg';
import slide3 from '../assets/slider3.jpg';

const sliderImages = [
  "https://images.unsplash.com/photo-1518605368461-1ee12522c5e4?auto=format&fit=crop&q=80&w=1920",
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
    }, 5000); // Cambia cada 5 segundos
    
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
          <h1 className="hero-title">Conoce todos nuestros productos</h1>
          <p className="hero-subtitle">Prepárate con las camisetas oficiales</p>
          <button className="btn-explore">Explorar</button>
        </div>
        
        {/* Puntos indicadores del slider */}
        <div className="slider-dots">
          {sliderImages.map((_, index) => (
            <div 
              key={index} 
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => {
                setPrevSlide(currentSlide);
                setCurrentSlide(index);
              }}
            ></div>
          ))}
        </div>
      </div>
      
      <div className="hero-benefits">
        <div className="container benefits-container">
          <div className="benefit-item">
            <h3 className="benefit-title">10% OFF</h3>
            <p className="benefit-desc">CON TRANSFERENCIA BANCARIA</p>
          </div>
          <div className="benefit-item">
            <h3 className="benefit-title">RETIRO GRATIS</h3>
            <p className="benefit-desc">EN TIENDAS</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-badge">6 cuotas</div>
            <h3 className="benefit-title">6 CUOTAS SIN INTERÉS</h3>
            <p className="benefit-desc">*A PARTIR DE $149.900. VER CONDICIONES</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
