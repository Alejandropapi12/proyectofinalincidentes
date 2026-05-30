import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
// Busca estas líneas arriba en tu InicioSesion.jsx y cámbialas por estas:
import appFirebase from '../FireBase/Config.js'; 
import { registrarIncidenteFirebase, leerIncidentesFirebase } from '../FireBase/incidentesService.js';
import './InicioSesion.css';


const auth = getAuth(appFirebase);

const SesionUser = ({ correoUsuario, alCerrarSesion }) => {
  // Estados locales para capturar exclusivamente los datos de texto (RF-07)
  const [tipoIncidente, setTipoIncidente] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [sede, setSede] = useState('');
  const [bloque, setBloque] = useState('');
  const [detalleUbicacion, setDetalleUbicacion] = useState('');
  
  // Control de interfaz y deshabilitación de envío duplicado
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // carga de incidencias para mostrar en el panel (RF-08)
  const [incidentes, setIncidentes] = useState([]);
  useEffect(() => {
    const cargarIncidentes = async () => {
      try {
        const datosIncidentes = await leerIncidentesFirebase();
        setIncidentes(datosIncidentes);
      } catch (error) {
        console.error("Error al cargar incidentes:", error);
      }
    };

    cargarIncidentes();
  }, []); 

  const handleCerrarSesion = () => {
    signOut(auth);
    if (alCerrarSesion) alCerrarSesion();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setMensaje('Enviando reporte...');

    try {
      // Agrupamos únicamente los campos string validados en tu consola Firestore
      const datosFormulario = { tipoIncidente, descripcion, sede, bloque, detalleUbicacion };

      // Invocamos el servicio puro aislado en config2
      const idGenerado = await registrarIncidenteFirebase(datosFormulario, correoUsuario);
      
      console.log("Guardado mediante servicio externo con ID:", idGenerado);
      setMensaje('✅ ¡Reporte almacenado con éxito en Firestore! Estado: "Reportado"');

      // Limpieza integral de estados de texto del formulario
      setTipoIncidente('');
      setDescripcion('');
      setSede('');
      setBloque('');
      setDetalleUbicacion('');
      
      // Temporizador limpio para desvanecer la alerta física en el DOM
      setTimeout(() => setMensaje(''), 4000);

    } catch (error) {
      console.error("Error en el componente al invocar el servicio:", error);
      setMensaje('❌ Hubo un inconveniente al conectar con la base de datos.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="panel-estudiante">
      <div className="panel-header">
        <div>
          <h2>🧑‍🎓 Portal de Reportes Estudiantiles</h2>
          <p>Usuario: <strong>{correoUsuario || 'estudiante@gmail.com'}</strong></p>
        </div>
        <button className="btn-cerrar-sesion" onClick={handleCerrarSesion}>
          🚪 Cerrar Sesión
        </button>
      </div>

      <div className="form-card">
        <h3>Registrar Nuevo Incidente</h3>
        <p>Formulario conectado mediante capa de servicios aislada.</p>
        
        {mensaje && <div className={`alerta-mensaje ${mensaje.includes('✅') ? 'exito' : 'error'}`}>{mensaje}</div>}

        <form onSubmit={handleSubmit} className="reporte-form">
          <div className="form-group">
            <label>Tipo de incidente (Agrupación)</label>
            <select value={tipoIncidente} onChange={(e) => setTipoIncidente(e.target.value)} required>
              <option value="">-- Seleccione el tipo --</option>
              <option value="baño">Baño</option>
              <option value="electricidad">Electricidad</option>
              <option value="infraestructura">Infraestructura</option>
              <option value="seguridad">Seguridad</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div className="form-group">
            <label>Descripción detallada</label>
            <textarea 
              placeholder="Escriba los detalles del incidente..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              rows="4"
            />
          </div>

          <div className="form-group-row" style={{ display: 'flex', gap: '15px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Sede</label>
              <select value={sede} onChange={(e) => setSede(e.target.value)} required>
                <option value="">-- Seleccione Sede --</option>
                <option value="Porvenir">Sede Porvenir</option>
                <option value="Centro">Sede Centro</option>
                <option value="Macagual">Macagual</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Bloque / Edificio</label>
              <input 
                type="text" 
                placeholder="Ej: Bloque 1"
                value={bloque}
                onChange={(e) => setBloque(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Detalle específico del lugar</label>
            <input 
              type="text" 
              placeholder="Ej: Salón 201"
              value={detalleUbicacion}
              onChange={(e) => setDetalleUbicacion(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-enviar-reporte" disabled={enviando}>
            {enviando ? '⏳ Guardando...' : '📥 Enviar Reporte'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SesionUser;