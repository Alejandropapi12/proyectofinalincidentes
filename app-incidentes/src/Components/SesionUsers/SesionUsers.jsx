import React, { useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { auth } from '../FireBase/Config'; 
import { registrarIncidenteFirebase } from '../FireBase/incidentesService'; 
import { uploadImage } from '../../SupabaseCredenciales'; 
import './SesionUsers.css'; 

const SesionUser = ({ correoUsuario, alCerrarSesion }) => {
  // --- ESTADOS LÓGICOS ---
  const [tipoIncidente, setTipoIncidente] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState(null); 
  const [sede, setSede] = useState('');
  const [bloque, setBloque] = useState('');
  const [detalleUbicacion, setDetalleUbicacion] = useState('');
  
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [previewUrl, setPreviewUrl] = useState(''); 

  // --- CERRAR SESIÓN ---
  const handleCerrarSesion = async () => {
    try {
      await signOut(auth);
      if (alCerrarSesion) {
        alCerrarSesion(); 
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setMensaje('❌ No se pudo cerrar la sesión correctamente.');
    }
  };

  // --- CAPTURA DE FOTO ---
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFoto(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // --- ENVÍO DE FORMULARIO ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!foto) {
      setMensaje('⚠️ Por favor, seleccione una fotografía obligatoria.');
      return;
    }

    setEnviando(true);
    setMensaje('⏳ Subiendo evidencia a Supabase...');

    try {
      const user = auth.currentUser;
      const uidParaCarpeta = user ? user.uid : 'anonimo';
      
      // Subida al bucket 'fotoincidente'
      const urlSupabaseString = await uploadImage(foto, 'fotoincidente', uidParaCarpeta);
      
      setMensaje('⏳ Guardando reporte en Firestore...');

      const datosFormulario = { 
        tipoIncidente, 
        descripcion, 
        sede, 
        bloque, 
        detalleUbicacion,
        foto_incidente: urlSupabaseString 
      };

      await registrarIncidenteFirebase(datosFormulario, correoUsuario);
      setMensaje('✅ ¡Reporte e imagen almacenados con éxito!');

      // Limpieza de estados
      setTipoIncidente('');
      setDescripcion('');
      setFoto(null); 
      setSede('');
      setBloque('');
      setDetalleUbicacion('');
      setPreviewUrl('');
      
      if (document.getElementById('file-input')) {
        document.getElementById('file-input').value = '';
      }

      setTimeout(() => setMensaje(''), 4000);

    } catch (error) {
      console.error(error);
      setMensaje('❌ Hubo un error al subir la imagen o guardar los datos.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="reportes-container">
      <div className="reportes-card">
        
        {/* Barra Superior */}
        <div className="reportes-header">
          <div>
            <h2 className="reportes-title">Portal de Reportes</h2>
            <p className="reportes-subtitle">
              Conectado como: <strong>{correoUsuario || 'estudiante@gmail.com'}</strong>
            </p>
          </div>
          <button className="btn-logout" onClick={handleCerrarSesion}>
            Cerrar Sesión
          </button>
        </div>

        {/* Alertas */}
        {mensaje && (
          <div className={`alerta-mensaje ${mensaje.includes('❌') || mensaje.includes('⚠️') ? 'error-alert' : 'success-alert'}`}>
            {mensaje}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="form-reporte">
          
          <div className="input-group">
            <label className="form-label">Categoría del Incidente</label>
            <select value={tipoIncidente} onChange={(e) => setTipoIncidente(e.target.value)} required className="form-input">
              <option value="">Seleccione una opción</option>
              <option value="baño">🚻 Baño / Sanitarios</option>
              <option value="electricidad">⚡ Electricidad / Iluminación</option>
              <option value="infraestructura">🏢 Infraestructura / Estructura</option>
              <option value="seguridad">🔒 Seguridad / Accesos</option>
              <option value="otro">❓ Otro problema</option>
            </select>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label className="form-label">Sede Universitaria</label>
              <select value={sede} onChange={(e) => setSede(e.target.value)} required className="form-input">
                <option value="">Seleccione Sede</option>
                <option value="Porvenir">Sede Porvenir</option>
                <option value="Centro">Sede Centro</option>
                <option value="Macagual">Sede Macagual</option>
              </select>
            </div>

            <div className="input-group">
              <label className="form-label">Bloque / Edificio</label>
              <input type="text" placeholder="Ej: Bloque 1" value={bloque} onChange={(e) => setBloque(e.target.value)} required className="form-input" />
            </div>
          </div>

          <div className="input-group">
            <label className="form-label">Ubicación Específica</label>
            <input type="text" placeholder="Ej: Salón 201 o Pasillo" value={detalleUbicacion} onChange={(e) => setDetalleUbicacion(e.target.value)} required className="form-input" />
          </div>

          <div className="input-group">
            <label className="form-label">Descripción de los Hechos</label>
            <textarea placeholder="Describe detalladamente el problema..." value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required rows="4" className="form-textarea" />
          </div>

          {/* ZONA DE CARGA FOTOGRÁFICA DE PRUEBA */}
          <div className="input-group" style={{ border: '2px solid red', padding: '10px' }}>
            <label className="form-label" style={{ color: 'black' }}>PRUEBA DE ENTRADA DE FOTO</label>
            <input 
              id="file-input"
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>

          {foto && (
            <div className="file-name-badge">
              <span>📎</span> {foto.name}
            </div>
          )}

          {previewUrl && (
            <div className="preview-container">
              <div className="preview-header">Vista previa cargada</div>
              <img src={previewUrl} alt="Preview" className="image-preview" style={{ width: '100%' }} />
            </div>
          )}

          <button type="submit" className="btn-submit" disabled={enviando}>
            {enviando ? 'Guardando Registro...' : 'Enviar Reporte Completo'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default SesionUser;