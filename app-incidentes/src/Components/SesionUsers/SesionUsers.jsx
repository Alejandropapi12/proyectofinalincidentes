import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../FireBase/Config'; 
import { registrarIncidenteFirebase, leerTodosLosIncidentes } from '../FireBase/incidentesService'; 
import { uploadImage } from '../../SupabaseCredenciales'; 
import './SesionUsers.css'; 

const SesionUser = ({ correoUsuario, alCerrarSesion }) => {
  const [pestana, setPestana] = useState('registrar'); // 'registrar' o 'historial'
  const [tipoIncidente, setTipoIncidente] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState(null); 
  const [sede, setSede] = useState('');
  const [bloque, setBloque] = useState('');
  const [detalleUbicacion, setDetalleUbicacion] = useState('');
  
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [previewUrl, setPreviewUrl] = useState(''); 

  // Estados del Historial
  const [misIncidentes, setMisIncidentes] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [incidenteSeleccionado, setIncidenteSeleccionado] = useState(null);

  useEffect(() => {
    if (pestana === 'historial') {
      cargarMisIncidentes();
    }
  }, [pestana]);

  const cargarMisIncidentes = async () => {
    try {
      const todos = await leerTodosLosIncidentes();
      const filtradosPorUsuario = todos.filter(inc => inc.correoUsuario === correoUsuario);
      setMisIncidentes(filtradosPorUsuario);
    } catch (error) {
      console.error("Error cargando historial:", error);
    }
  };

  const handleCerrarSesion = async () => {
    try { await signOut(auth); if (alCerrarSesion) alCerrarSesion(); } 
    catch (e) { setMensaje('❌ Error al cerrar sesión.'); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFoto(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foto) { setMensaje('⚠️ Fotografía obligatoria.'); return; }
    setEnviando(true);
    setMensaje('⏳ Subiendo evidencia...');
    try {
      const user = auth.currentUser;
      const urlSupabase = await uploadImage(foto, 'fotoincidente', user ? user.uid : 'anonimo');
      setMensaje('⏳ Almacenando reporte...');
      
      await registrarIncidenteFirebase({
        tipoIncidente, descripcion, sede, bloque, detalleUbicacion, foto_incidente: urlSupabase
      }, correoUsuario);

      setMensaje('✅ ¡Reporte guardado con éxito!');
      setTipoIncidente(''); setDescripcion(''); setFoto(null); setSede(''); setBloque(''); setDetalleUbicacion(''); setPreviewUrl('');
      setTimeout(() => setMensaje(''), 4000);
    } catch (error) {
      setMensaje('❌ Hubo un error al guardar los datos.');
    } finally { setEnviando(false); }
  };

  const incidentesFiltrados = misIncidentes.filter(inc => filtroEstado === 'Todos' || inc.status === filtroEstado);

  return (
    <div className="reportes-container">
      <div className="reportes-card calculation-layout">
        
        <div className="reportes-header">
          <div>
            <h2 className="reportes-title">Portal Estudiantil de Incidencias</h2>
            <p className="reportes-subtitle">Usuario: <strong>{correoUsuario}</strong></p>
          </div>
          <button className="btn-logout" onClick={handleCerrarSesion}>🚪 Salir</button>
        </div>

        {/* Selector de Pestañas Navegables */}
        <div className="tabs-nav">
          <button className={`tab-button ${pestana === 'registrar' ? 'active' : ''}`} onClick={() => setPestana('registrar')}>📝 Registrar Reporte</button>
          <button className={`tab-button ${pestana === 'historial' ? 'active' : ''}`} onClick={() => setPestana('historial')}>📋 Mis Reportes ({misIncidentes.length})</button>
        </div>

        {mensaje && <div className="alerta-mensaje success-alert">{mensaje}</div>}

        {pestana === 'registrar' ? (
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
                <label className="form-label">Sede</label>
                <select value={sede} onChange={(e) => setSede(e.target.value)} required className="form-input">
                  <option value="">Seleccione Sede</option>
                  <option value="Porvenir">Sede Porvenir</option>
                  <option value="Centro">Sede Centro</option>
                  <option value="Macagual">Sede Macagual</option>
                </select>
              </div>
              <div className="input-group">
                <label className="form-label">Bloque</label>
                <input type="text" placeholder="Ej: Bloque 1" value={bloque} onChange={(e) => setBloque(e.target.value)} required className="form-input" />
              </div>
            </div>

            <div className="input-group">
              <label className="form-label">Ubicación Específica</label>
              <input type="text" placeholder="Ej: Salón 201" value={detalleUbicacion} onChange={(e) => setDetalleUbicacion(e.target.value)} required className="form-input" />
            </div>

            <div className="input-group">
              <label className="form-label">Descripción</label>
              <textarea placeholder="Detalles del suceso..." value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required rows="3" className="form-textarea" />
            </div>

            <div className="input-group">
              <label className="form-label">Evidencia Fotográfica</label>
              <div className={`file-dropzone ${foto ? 'has-file' : ''}`}>
                <input id="file-input" type="file" accept="image/*" onChange={handleFileChange} required className="file-hidden" />
                <label htmlFor="file-input" className="file-label">
                  <span className="upload-icon">{foto ? '📸' : '📤'}</span>
                  <span className="text-trigger">{foto ? 'Cambiar Imagen' : 'Subir Imagen'}</span>
                </label>
              </div>
              {previewUrl && <img src={previewUrl} alt="Preview" className="image-preview" />}
            </div>

            <button type="submit" className="btn-submit" disabled={enviando}>Enviar Reporte Completo</button>
          </form>
        ) : (
          // Vista de Historial del Estudiante
          <div className="historial-layout">
            <div className="filter-bar">
              <label>Filtrar Estado: </label>
              <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="form-input text-sm">
                <option value="Todos">Todos los estados</option>
                <option value="Reportado">🔴 Reportado</option>
                <option value="En proceso">🟡 En proceso</option>
                <option value="Resuelto">🟢 Resuelto</option>
              </select>
            </div>

            <div className="incidents-list">
              {incidentesFiltrados.map(inc => (
                <div key={inc.id} className="incident-item-card" onClick={() => setIncidenteSeleccionado(inc)}>
                  <div className="incident-item-info">
                    <h4>{inc.tipoIncidente.toUpperCase()} - {inc.sede}</h4>
                    <p>{inc.detalleUbicacion} ({inc.bloque})</p>
                  </div>
                  <span className={`status-badge ${inc.status.toLowerCase().replace(" ", "-")}`}>
                    {inc.status}
                  </span>
                </div>
              ))}
              {incidentesFiltrados.length === 0 && <p className="text-center-muted">No se encontraron registros.</p>}
            </div>

            {/* Vista modal/detallada integrada del incidente */}
            {incidenteSeleccionado && (
              <div className="modal-overlay-custom" onClick={() => setIncidenteSeleccionado(null)}>
                <div className="modal-content-custom" onClick={e => e.stopPropagation()}>
                  <h3>Detalle del Incidente</h3>
                  <p><strong>Categoría:</strong> {incidenteSeleccionado.tipoIncidente}</p>
                  <p><strong>Ubicación:</strong> {incidenteSeleccionado.sede} - {incidenteSeleccionado.bloque} ({incidenteSeleccionado.detalleUbicacion})</p>
                  <p><strong>Descripción:</strong> {incidenteSeleccionado.descripcion}</p>
                  <p><strong>Estado Actual:</strong> <span className={`status-badge ${incidenteSeleccionado.status.toLowerCase().replace(" ", "-")}`}>{incidenteSeleccionado.status}</span></p>
                  {incidenteSeleccionado.foto_incidente && (
                    <div className="modal-img-container">
                      <p><strong>Evidencia Fotográfica:</strong></p>
                      <img src={incidenteSeleccionado.foto_incidente} alt="Evidencia" className="image-preview-large" />
                    </div>
                  )}
                  <button className="btn-submit btn-close-modal" onClick={() => setIncidenteSeleccionado(null)}>Cerrar Detalle</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SesionUser;