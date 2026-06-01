import { getFirestore, collection, addDoc, getDocs, query, where, doc, updateDoc, writeBatch } from 'firebase/firestore';
import appFirebase from './Config.js';

const db = getFirestore(appFirebase);

// Registrar incidente con soporte de agrupación inicial
export const registrarIncidenteFirebase = async (datos, correoUsuario) => {
  try {
    const docRef = await addDoc(collection(db, "incidentes"), {
      ...datos,
      correoUsuario,
      status: "Reportado", // Estado inicial obligatorio
      fechaReporte: new Date().toISOString(),
      idGrupo: "" // Se actualizará inmediatamente después de crearse para auto-agruparse
    });
    
    // Auto-asignamos el idGrupo igual al ID del documento inicial
    await updateDoc(doc(db, "incidentes", docRef.id), { idGrupo: docRef.id });
    return docRef.id;
  } catch (error) {
    console.error("Error en servicio registrarIncidente:", error);
    throw error;
  }
};

// Leer todos los incidentes (Para el Admin)
export const leerTodosLosIncidentes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "incidentes"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al leer todos los incidentes:", error);
    throw error;
  }
};

// Actualizar estado de todo un grupo de incidentes (RF-09 y RF-10)
export const actualizarEstadoGrupo = async (idGrupo, nuevoEstado) => {
  try {
    const q = query(collection(db, "incidentes"), where("idGrupo", "==", idGrupo));
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(db);

    querySnapshot.forEach((documento) => {
      const docRef = doc(db, "incidentes", documento.id);
      batch.update(docRef, { status: nuevoEstado });
    });

    await batch.commit();
  } catch (error) {
    console.error("Error al actualizar el estado del grupo:", error);
    throw error;
  }
};

// Agrupar un incidente dentro de otro grupo existente (RF-10)
export const agruparIncidente = async (idIncidenteHijo, idGrupoPadre, estadoPadre) => {
  try {
    await updateDoc(doc(db, "incidentes", idIncidenteHijo), {
      idGrupo: idGrupoPadre,
      status: estadoPadre // Hereda el estado del grupo principal
    });
  } catch (error) {
    console.error("Error al agrupar incidente:", error);
    throw error;
  }
};