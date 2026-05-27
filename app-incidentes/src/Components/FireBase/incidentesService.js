import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from './config2'; // Base de datos exclusiva de Firestore

/**
 * Registra un incidente en Cloud Firestore mapeando de forma idéntica
 * los campos string que definiste en tu consola.
 */
export const registrarIncidenteFirebase = async (datosFormulario, correoUsuario) => {
  const { tipoIncidente, descripcion, sede, bloque, detalleUbicacion } = datosFormulario;

  // 1. Apuntamos a la colección 'incidentes'
  const incidentesRef = collection(db, "incidentes");

  // 2. Estructura idéntica a tus campos guardados en la consola (Todos string)
  const nuevoIncidente = {
    id: "", // Se parchará con el ID real inmediatamente abajo
    usuarioId: correoUsuario || "estudiante@gmail.com",
    tipo: tipoIncidente,
    descripcion: descripcion.trim(),
    ubicacionTexto: `${sede} - ${bloque} - ${detalleUbicacion}`.trim(),
    fechaCreacion: new Date().toISOString(),
    estado: "Reportado"
  };

  // 3. Enviamos el documento a Firestore
  const docRef = await addDoc(incidentesRef, nuevoIncidente);

  // 4. Sincronizamos el ID auto-generado con el campo string 'id' interno
  await updateDoc(doc(db, "incidentes", docRef.id), {
    id: docRef.id
  });

  return docRef.id;
};