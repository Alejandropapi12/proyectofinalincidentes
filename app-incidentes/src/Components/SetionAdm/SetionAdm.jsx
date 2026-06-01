import React, { useState, useEffect } from 'react';
import { leerTodosLosIncidentes, actualizarEstadoGrupo, agruparIncidente } from '../FireBase/incidentesService';
import './SetionAdm.css'; 

function SetionAdm({ alCerrarSesion }) {
  const [incidentes, setIncidentes] = useState([]);
  const [incidenteSeleccionado, setIncidenteSeleccionado] = useState(null);
  const [idGrupoPadreTarget, setIdGrupoPadreTarget] = useState('');
  
  // Credencial dinámica modificable
  const [adminEmail, setAdminEmail] = useState('alejandrovargasjoven7@gmail.com');
  const [nuevoEmailCredencial, setNuevoEmailCredencial] = useState('');
  const [mensajeCredencial, setMensajeCredencial] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const lista = await leerTodosLosIncidentes();
      setIncidentes(lista || []);
    } catch (error) {
      console.error("Error al cargar incidentes en el Admin:", error);
    }
  };

  // 🛠️ RF-09 y RF-10 CORREGIDO: Detecta si maneja un grupo o un incidente único independiente
  const handleCambiarEstado = async (incidente, nuevoEstado) => {
    // Si el incidente tiene un idGrupo asignado que no sea vacío, actualiza el grupo.
    // Si está vacío o es igual a su propio ID, se trata como un problema individual.
    const grupoAActualizar = incidente.idGrupo || incidente.id;
    
    try {
      await actualizarEstadoGrupo(grupoAActualizar, nuevoEstado);
      alert(`Estado actualizado a [${nuevoEstado}] para el caso o grupo correspondiente.`);
      
      if (incidenteSeleccionado) {
        setIncidenteSeleccionado({ ...incidenteSeleccionado, status: nuevoEstado });
      }
      cargarDatos();
    } catch (error) {
      alert("No se pudo actualizar el estado del incidente.");
    }
  };

  const handleAgrupar = async (e, incidenteHijoId) => {
    e.preventDefault();
    if (!idGrupoPadreTarget) return;
    
    // Buscamos el incidente que el administrador dictó como el "Caso Principal"
    const padre = incidentes.find(i => i.id === idGrupoPadreTarget);
    if (!padre) { 
      alert("El ID del incidente principal no existe en el sistema."); 
      return; 
    }

    try {
      // El incidente hijo hereda el idGrupo del padre y su estado actual
      const grupoPadre = padre.idGrupo || padre.id;
      await agruparIncidente(incidenteHijoId, grupoPadre, padre.status);
      alert("¡Incidentes vinculados y agrupados con éxito bajo el mismo caso!");
      setIdGrupoPadreTarget('');
      setIncidenteSeleccionado(null);
      cargarDatos();
    } catch (error) {
      alert("Error al intentar agrupar los incidentes.");
    }
  };

  const handleActualizarCredencial = (e) => {
    e.preventDefault();
    if(nuevoEmailCredencial.includes('@')) {
      setAdminEmail(nuevoEmailCredencial);
      setMensajeCredencial('✅ Credencial de administrador actualizada para esta sesión.');
      setNuevoEmailCredencial('');
    } else {
      setMensajeCredencial('❌ Ingrese un correo válido.');
    }
  };

  // --- CÁLCULOS ESTADÍSTICOS PROTEGIDOS ---
  const totalIncidentes = incidentes ? incidentes.length : 0;
  
  const porEstado = {
    Reportado: incidentes ? incidentes.filter(i => i && i.status === 'Reportado').length : 0,
    'En proceso': incidentes ? incidentes.filter(i => i && i.status === 'En proceso').length : 0,
    Resuelto: incidentes ? incidentes.filter(i => i && i.status === 'Resuelto').length : 0,
  };

  const porTipo = incidentes && incidentes.length > 0
    ? incidentes.reduce((acc, curr) => {
        if (curr && curr.tipoIncidente) {
          acc[curr.tipoIncidente] = (acc[curr.tipoIncidente] || 0) + 1;
        }
        return acc;
      }, {})
    : {};

  const handleImprimirEstadisticas = () => {
    window.print();
  };

  return (
    <div className="admin-container">
      <div className="admin-card">
        <div className="admin-header">
          <div>
            <h2>🛠️ Consola de Administración (Rectoría)</h2>
            <p>Cuenta activa: <strong>{adminEmail}</strong></p>
          </div>
          <button className="btn-logout" onClick={alCerrarSesion}>Cerrar Panel</button>
        </div>

        {/* Configurar Credencial */}
        <div className="credencial-box">
          <h4>🔐 Configurar Credencial del Administrador</h4>
          <form onSubmit={handleActualizarCredencial} className="credencial-form">
            <input 
              type="email" 
              placeholder="Nuevo correo electrónico del admin..." 
              value={nuevoEmailCredencial}
              onChange={e => setNuevoEmailCredencial(e.target.value)}
              className="form-input"
            />
            <button type="submit" className="btn-logout" style={{borderColor: '#2563eb', color: '#2563eb'}}>Establecer</button>
          </form>
          {mensajeCredencial && <p className="credencial-msg">{mensajeCredencial}</p>}
        </div>

        {/* Métricas e Indicadores */}
        <div className="estadisticas-section section-to-print">
          <div className="est-header">
            <h3>📊 Métricas e Indicadores de Gestión</h3>
            <button className="btn-print no-print" onClick={handleImprimirEstadisticas}>🖨️ Enviar a Impresión</button>
          </div>
          
          <div className="metrics-grid">
            <div className="metric-box total">
              <h5>Total Incidentes</h5>
              <h2>{totalIncidentes}</h2>
            </div>
            <div className="metric-box reportado">
              <h5>🔴 Reportados</h5>
              <h2>{porEstado.Reportado}</h2>
            </div>
            <div className="metric-box proceso">
              <h5>🟡 En Proceso</h5>
              <h2>{porEstado['En proceso']}</h2>
            </div>
            <div className="metric-box resuelto">
              <h5>🟢 Resueltos</h5>
              <h2>{porEstado.Resuelto}</h2>
            </div>
          </div>

          <div className="tipos-grafico-bar">
            <h4>Distribución por Tipo de Fallo:</h4>
            <div className="bar-chart-simulation">
              {Object.keys(porTipo).length > 0 ? (
                Object.keys(porTipo).map(tipo => {
                  const porcentaje = totalIncidentes > 0 ? (porTipo[tipo] / totalIncidentes) * 100 : 0;
                  return (
                    <div key={tipo} className="chart-row">
                      <span className="chart-label">{tipo.toUpperCase()} ({porTipo[tipo]})</span>
                      <div className="chart-bar-bg">
                        <div className="chart-bar-fill" style={{ width: `${porcentaje}%` }}></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p style={{fontSize: '13px', color: '#64748b', padding: '10px 0'}}>Aún no hay datos para procesar gráficos.</p>
              )}
            </div>
          </div>
        </div>

        {/* LISTADO DE GESTIÓN DE INCIDENTES */}
        <div className="admin-management no-print">
          <h3>📋 Listado Maestro de Casos Recibidos</h3>
          <div className="admin-table-container">
            {incidentes && incidentes.length > 0 ? (
              incidentes.map(inc => (
                <div key={inc.id} className="admin-incident-row" onClick={() => setIncidenteSeleccionado(inc)}>
                  <div>
                    <strong>{inc.tipoIncidente ? inc.tipoIncidente.toUpperCase() : 'OTRO'}</strong> - {inc.sede || 'Sede No Registrada'} ({inc.bloque || 'S/B'})
                    <div style={{fontSize: '11px', color: '#64748b'}}>
                      Reportado por: {inc.correoUsuario} | 
                      <span style={{color: inc.idGrupo && inc.idGrupo !== inc.id ? '#2563eb' : '#64748b', fontWeight: inc.idGrupo && inc.idGrupo !== inc.id ? '600' : 'normal'}}>
                        {inc.idGrupo && inc.idGrupo !== inc.id ? ` 🔗 Agrupado (ID: ${inc.idGrupo})` : ` 🆔 Único (ID: ${inc.id})`}
                      </span>
                    </div>
                  </div>
                  <span className={`status-badge ${inc.status ? inc.status.toLowerCase().replace(" ", "-") : 'reportado'}`}>{inc.status || 'Reportado'}</span>
                </div>
              ))
            ) : (
              <p style={{fontSize: '14px', color: '#64748b', padding: '15px 0'}}>No se han recibido reportes en la base de datos de la universidad.</p>
            )}
          </div>
        </div>

        {/* MODAL DETALLADO CON ACCIONES REPARADAS */}
        {incidenteSeleccionado && (
          <div className="modal-overlay-custom" onClick={() => setIncidenteSeleccionado(null)}>
            <div className="modal-content-custom" onClick={e => e.stopPropagation()}>
              <h3>Acciones de Gestión sobre el Reporte</h3>
              <p><strong>ID Incidente Seleccionado:</strong> <code style={{background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px'}}>{incidenteSeleccionado.id}</code></p>
              <p><strong>Tipo de Caso:</strong> {incidenteSeleccionado.idGrupo && incidenteSeleccionado.idGrupo !== incidenteSeleccionado.id ? '🔗 Incidente Vinculado a un Grupo' : '🆔 Problema Independiente / Único'}</p>
              <p><strong>Descripción:</strong> {incidenteSeleccionado.descripcion}</p>
              
              {/* RF-09: Control de Cambios de Estado Inteligente */}
              <div className="control-estados-block">
                <label><strong>Establecer Estado:</strong></label>
                <div className="btn-group-status">
                  <button className="btn-st rep" onClick={() => handleCambiarEstado(incidenteSeleccionado, 'Reportado')}>🔴 Reportado</button>
                  <button className="btn-st proc" onClick={() => handleCambiarEstado(incidenteSeleccionado, 'En proceso')}>🟡 En Proceso</button>
                  <button className="btn-st res" onClick={() => handleCambiarEstado(incidenteSeleccionado, 'Resuelto')}>🟢 Resuelto</button>
                </div>
              </div>

              {/* RF-10: Formulario de Agrupación de Incidentes Similares */}
              <div className="agrupacion-block">
                <label><strong>🔗 Agrupar este incidente en otro Caso Principal:</strong></label>
                <form onSubmit={(e) => handleAgrupar(e, incidenteSeleccionado.id)} className="agrupar-form">
                  <input 
                    type="text" 
                    placeholder="Pegar el ID del incidente principal..." 
                    value={idGrupoPadreTarget}
                    onChange={e => setIdGrupoPadreTarget(e.target.value)}
                    required
                    className="form-input"
                  />
                  <button type="submit" className="btn-submit" style={{marginTop: 0, padding: '10px'}}>Vincular</button>
                </form>
              </div>

              {incidenteSeleccionado.foto_incidente && (
                <div style={{marginTop: '15px'}}>
                  <label className="form-label"><strong>Evidencia del Suceso:</strong></label>
                  <img src={incidenteSeleccionado.foto_incidente} alt="Evidencia" className="image-preview-large" />
                </div>
              )}
              <button className="btn-submit btn-close-modal" onClick={() => setIncidenteSeleccionado(null)}>Cerrar</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default SetionAdm;