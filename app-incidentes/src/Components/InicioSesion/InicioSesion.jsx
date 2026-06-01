import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import appFirebase from '../FireBase/Config.js'; 
import './InicioSesion.css';

const auth = getAuth(appFirebase);

const InicioSesion = () => {
  const [registrando, setRegistrando] = useState(false);
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const handlerSubmit = async (e) => {
    e.preventDefault();
    try {
      if (registrando) {
        await createUserWithEmailAndPassword(auth, correo, password);
      } else {
        await signInWithEmailAndPassword(auth, correo, password);
      }
    } catch (error) {
      alert("Error en la autenticación: " + error.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>{registrando ? "Crear Cuenta" : "Iniciar Sesión"}</h2>
        <form onSubmit={handlerSubmit} className="login-form">
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-ingresar">
            {registrando ? "Registrarse" : "Ingresar"}
          </button>
        </form>
        <button onClick={() => setRegistrando(!registrando)} className="btn-switch">
          {registrando ? "¿Ya tienes cuenta? Inicia Sesión" : "¿No tienes cuenta? Regístrate"}
        </button>
      </div>
    </div>
  );
};

export default InicioSesion;