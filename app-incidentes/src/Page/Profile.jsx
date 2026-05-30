import React, { useState } from 'react';
import { uploadImage } from '../SupabaseCredenciales'; // Ajusta a '../Components/SupabaseCredenciales' si lo moviste de carpeta
import { doc, getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import appFirebase from '../Components/FireBase/Config.js'; // 👈 RUTA CORREGIDA CON EXTENSIÓN

const db = getFirestore(appFirebase);
const auth = getAuth(appFirebase);

export default function Profile() {
  const [isUploading, setIsUploading] = useState(false);
  const [upLoadSuccess, setUpLoadSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  // Estados para la descripción del incidente
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      setUpLoadSuccess(false);

      const user = auth.currentUser;
      if (!user) {
        setError("❌ Debes iniciar sesión para subir reportes.");
        return;
      }

      // Se conecta exactamente al nombre que tienes en tu panel de Supabase
      const url = await uploadImage(file, 'fotoincidente', user.uid);
      
      setImageUrl(url);
      setUpLoadSuccess(true);
      alert("📸 ¡Imagen subida con éxito! Ahora puedes enviar el reporte.");

    } catch (err) {
      console.error(err);
      setError("❌ Error al subir la imagen a Supabase.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEnviarReporte = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!imageUrl) {
      alert("⚠️ Por favor, carga una foto del incidente antes de enviar.");
      return;
    }

    try {
      setIsUploading(true);

      // Guardamos en Firestore en la colección "incidentes"
      await addDoc(collection(db, "incidentes"), {
        uidUsuario: user.uid,
        correoUsuario: user.email,
        titulo: titulo,
        descripcion: descripcion,
        foto_incidente: imageUrl, // Guarda la URL de texto que generó tu bucket 'fotoincidente'
        status: "pendiente",
        fechaReporte: new Date().toISOString()
      });

      alert("🎉 ¡Incidente reportado exitosamente!");
      
      // Limpiar formulario
      setTitulo('');
      setDescripcion('');
      setImageUrl('');
      setUpLoadSuccess(false);

    } catch (err) {
      console.error(err);
      alert("No se pudo guardar el reporte en Firestore.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h2>🚨 Registrar Incidente</h2>
          <p>Reporta fallas o novedades en la infraestructura universitaria.</p>
        </div>

        {error && <div className="login-error-alert">{error}</div>}

        <form onSubmit={handleEnviarReporte} className="login-form">
          <div className="form-group">
            <label>Título del Incidente</label>
            <input 
              type="text" 
              placeholder="Ej. Silla rota en bloque A" 
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción detallada</label>
            <input 
              type="text" 
              placeholder="Describe lo sucedido..." 
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Evidencia Fotográfica (Supabase)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {isUploading && <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Subiendo imagen...</p>}
            {upLoadSuccess && <p style={{fontSize: '0.8rem', color: 'green'}}>✓ Imagen lista para enviar</p>}
          </div>

          <button type="submit" className="btn-ingresar" disabled={isUploading}>
            {isUploading ? 'Procesando...' : 'Enviar Reporte'}
          </button>
        </form>
      </div>
    </div>
  );
}