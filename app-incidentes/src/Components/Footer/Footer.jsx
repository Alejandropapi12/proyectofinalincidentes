import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="uni-footer">
      <div className="footer-container">
        
        {/* Sección Superior con Información Real de la Universidad */}
        <div className="footer-top">
          
          {/* Columna 1: Marca e Identidad */}
          <div className="footer-column footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">🎓</span>
              <h2>UniReport</h2>
            </div>
            <p className="footer-description">
              Sistema de gestión y registro de problemas universitarios. 
              Desarrollado para mejorar nuestra comunidad académica.
            </p>
          </div>

          {/* Columna 2: Ubicación y Horarios */}
          <div className="footer-column">
            <h3>Contáctanos</h3>
            <p className="footer-text">
              <strong>Sede Porvenir:</strong> Calle 17 Diagonal 17 con Carrera 3F 
              <br />Barrio Porvenir — Florencia, Caquetá, Colombia
            </p>
            <p className="footer-text">
              <strong>Atención al Público:</strong>
              <br />Lunes a Viernes: 7:30 a.m. a 11:30 a.m.
              <br />Pasando a la tarde: 1:30 p.m. a 5:30 p.m.
            </p>
          </div>

          {/* Columna 3: Canales de Correo Electrónico */}
          <div className="footer-column">
            <h3>Canales Oficiales</h3>
            <ul className="footer-emails">
              <li>
                <span className="email-label">Contacto General:</span>
                <a href="mailto:atencionalciudadano@uniamazonia.edu.co">atencionalciudadano@uniamazonia.edu.co</a>
              </li>
              <li>
                <span className="email-label">PQRS-D:</span>
                <a href="mailto:quejasyreclamos@uniamazonia.edu.co">quejasyreclamos@uniamazonia.edu.co</a>
              </li>
              <li>
                <span className="email-label">Notificaciones Judiciales:</span>
                <a href="mailto:njudiciales@uniamazonia.edu.co">njudiciales@uniamazonia.edu.co</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Separador Visual */}
        <hr className="footer-divider" />

        {/* Sección Inferior de Copyright */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} uniAmazonia. Todos los derechos reservados.</p>
          <div className="system-status">
            <span className="status-dot"></span>
            <span className="status-text">Portal Operativo</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;