import { collection, addDoc, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
import { db } from './config2'; // Base de datos exclusiva de Firestore

/**
 * Registra un incidente en Cloud Firestore mapeando de forma idéntica
 * los campos string que definiste en tu consola.
 */
export const registrarIncidenteFirebase = async (datosFormulario, correoUsuario) => {
  const { tipoIncidente, descripcion, sede, bloque, detalleUbicacion } = datosFormulario;

  // 1. Apuntamos a la colección 'incidentes'
  const incidentesRef = collection(db, "incidentes");

  // 2. Generamos un documento vacío para obtener su ID autogenerado ANTES de guardar
  const nuevoDocRef = doc(incidentesRef); 

  // 3. Estructura idéntica a tus campos guardados en la consola (Todos string)
  const nuevoIncidente = {
    id: nuevoDocRef.id, // 👈 Se guarda el ID real de forma inmediata sin hacer un update extra
    usuarioId: correoUsuario || "estudiante@gmail.com",
    tipo: tipoIncidente,
    descripcion: descripcion.trim(),
    ubicacionTexto: `${sede} - ${bloque} - ${detalleUbicacion}`.trim(),
    fechaCreacion: new Date().toISOString(),
    
    // 💥 CORRECCIÓN CRUCIAL AQUÍ:
    // Cambiado de 'FotoIncidente' a 'foto_incidente' para que coincida 
    // exactamente con el campo string que me mostraste en tu consola de Firestore.
    foto_incidente: datosFormulario.foto_incidente || "", 
    
    estado: "Reportado"
  };

  // 4. Enviamos el documento completo a Firestore de un solo golpe (Ahorras escrituras)
  await setDoc(nuevoDocRef, nuevoIncidente);

  return nuevoDocRef.id;
};

export const leerIncidentesFirebase = async () => {
  // 1. Apuntamos a la colección 'incidentes'
  const incidentesRef = collection(db, "incidentes");

  // 2. Leer los documentos de Firestore
  const snapshot = await getDocs(incidentesRef);
  const incidentes = [];
  snapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    incidentes.push({ id: doc.id, ...doc.data() });
  });
  return incidentes;
};