import React, { useState, useEffect } from 'react'; 
import Footer from './Components/Footer/Footer';
import InicioSesion from './Components/InicioSesion/InicioSesion';
import SesionUser from './Components/SesionUsers/SesionUsers'; 
import appFirebase from './Components/FireBase/Config.js'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
import './App.css';

const auth = getAuth(appFirebase);

function App() {
  const [user, setUser] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userFirebase) => {
      setUser(userFirebase || null);
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  if (cargando) {
    return (
      <div className="app-container">
        <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* 📋 SE ELIMINÓ EL HEADER GLOBAL PARA DEJAR TODO EL ESPACIO AL FORMULARIO */}
      
      <main style={{ flex: 1 }}>
        {user ? (
          /* Al entrar aquí, SesionUser mostrará el botón de foto arriba de todo */
          <SesionUser 
            correoUsuario={user.email} 
            alCerrarSesion={() => setUser(null)} 
          />
        ) : (
          <InicioSesion />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;