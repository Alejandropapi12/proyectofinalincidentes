import { useState, useEffect } from 'react'; // 🚨 Faltaba importar useState y useEffect
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import InicioSesion from './Components/InicioSesion/InicioSesion';
import SesionUser from './Components/SesionUsers/SesionUsers'; // 🚨 Asegúrate de que esta ruta sea la de tu panel
import appFirebase from './Components/FireBase/Config'; // Corregido el posible typo de 'appFirabes'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './App.css';

const auth = getAuth(appFirebase);

function App() {
  const [user, setUser] = useState(null);

  // useEffect evita que el escuchador de Firebase cree un bucle infinito de renderizados
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userFirebase) => {
      if (userFirebase) {
        setUser(userFirebase);
      } else {
        setUser(null);
      }
    });

    // Limpieza del escuchador cuando el componente se desmonta
    return () => unsubscribe();
  }, []);

  return (
    <div className="app-container">
      <Header />
      
      <main style={{ flex: 1 }}>
        {/* 🚨 Condicional limpio: si hay usuario muestra el panel, si no, el login */}
        {user ? (
          <SesionUser correoUsuario={user.email} />
        ) : (
          <InicioSesion />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;