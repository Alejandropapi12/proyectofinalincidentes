import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import appFirebase from '../FireBase/Config'; // Asegúrate de que esta ruta a tu Config sea correcta
import './InicioSesion.css';

const auth = getAuth(appFirebase);

const InicioSesion = () => {
  const [modo, setModo] = useState('login'); // 'login' o 'registro'
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (modo === 'login') {
        // Loguear usuario directamente en Firebase Auth
        await signInWithEmailAndPassword(auth, correo, contrasenia);
      } else {
        // Registrar usuario directamente en Firebase Auth
        await createUserWithEmailAndPassword(auth, correo, contrasenia);
        alert('¡Usuario registrado con éxito! Iniciando sesión...');
      }
    } catch (err) {
      console.error(err.code);
      // Validaciones de errores comunes de Firebase en español
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('⚠️ Correo o contraseña incorrectos.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('⚠️ Este correo ya está registrado por otro usuario.');
      } else if (err.code === 'auth/weak-password') {
        setError('⚠️ La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError('❌ Ocurrió un error. Intenta de nuevo.');
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        
        <div className="login-header">
          <h2>{modo === 'login' ? '🔑 Iniciar Sesión' : '📝 Crear Cuenta'}</h2>
          <p>
            {modo === 'login' 
              ? 'Usa tus credenciales universitarias para acceder.' 
              : 'Completa los datos para registrarte en el sistema.'}
          </p>
        </div>

        {error && <div className="login-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          
          <div className="form-group">
            <label>Correo Institucional</label>
            <input 
              type="email" 
              placeholder="ejemplo@uniamazonia.edu.co"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn-ingresar">
            {modo === 'login' ? 'Ingresar' : 'Registrarse'}
          </button>

          <div className="login-footer-links">
            {modo === 'login' ? (
              <p>
                ¿No tienes una cuenta?{' '}
                <span className="link-toggle" onClick={() => { setModo('registro'); setError(''); }}>
                  Regístrate aquí
                </span>
              </p>
            ) : (
              <p>
                ¿Ya tienes una cuenta?{' '}
                <span className="link-toggle" onClick={() => { setModo('login'); setError(''); }}>
                  Inicia sesión aquí
                </span>
              </p>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};

export default InicioSesion;