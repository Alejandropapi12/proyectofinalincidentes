import React, { useState, useEffect } from 'react'; 
import Footer from './Components/Footer/Footer';
import InicioSesion from './Components/InicioSesion/InicioSesion';
import SesionUser from './Components/SesionUsers/SesionUsers.jsx'; 
import SetionAdm from './Components/SetionAdm/SetionAdm.jsx'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
import appFirebase from './Components/FireBase/Config.js'; // 1 sola vez, limpio y ordenado
import './App.css';

const auth = getAuth(appFirebase);

function App() {
  const [user, setUser] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userFirebase) => {
      if (userFirebase) {
        setUser(userFirebase);
        // Validación de credencial de Administrador por defecto
        if (userFirebase.email === 'alejandrovargasjoven7@gmail.com') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
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
      <main style={{ flex: 1 }}>
        {user ? (
          isAdmin ? (
            <SetionAdm alCerrarSesion={() => auth.signOut()} />
          ) : (
            <SesionUser correoUsuario={user.email} alCerrarSesion={() => setUser(null)} />
          )
        ) : (
          <InicioSesion />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;