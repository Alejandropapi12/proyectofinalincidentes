import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="uni-header">
      <div className="header-container">
        {/* Únicamente el Logo e Identidad Institucional */}
        <div className="header-logo">
          <span className="logo-icon">🎓</span>
          <h1>uniAmazonia<span className="logo-dot">.</span></h1>
        </div>
      </div>
    </header>
  );
};

export default Header;