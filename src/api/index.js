import { generateClient } from 'aws-amplify/api';
import {
  createVirtueRecord as createVirtueRecordMutation,
  updateVirtueRecord as updateVirtueRecordMutation,
} from './graphql/mutations';
import { 
  virtueRecordsByUser as virtueRecordsByUserQuery 
} from './graphql/queries';

const client = generateClient();

// Obtener registros de virtudes dentro de un rango de fechas
export const getVirtuesWithRecords = async (userId, startDate, endDate) => {
  // Formato de dateVirtueID: "YYYY-MM-DD#virtueID"
  const startKey = `${startDate}#`;
  const endKey = `${endDate}#~`; // '~' para incluir todos los virtueIDs en la fecha final

  const result = await client.graphql({
    query: virtueRecordsByUserQuery,
    variables: {
      userId: userId,
      dateVirtueID: {
        between: [startKey, endKey]
      }
    }
  });

  if (result.data && result.data.virtueRecordsByUser && result.data.virtueRecordsByUser.items) {
    return result.data.virtueRecordsByUser.items;
  }

  return [];
};

// Crear un nuevo registro de virtud
export const createVirtueRecordAPI = async (userId, record) => {
  const { date, virtueID, status, weekNumber, weekVirtueID } = record;
  
  // Validación para asegurar que todos los campos necesarios están presentes
  if (!date || !virtueID || status === undefined || !weekNumber || !weekVirtueID) {
    console.error("Datos incompletos para crear el registro de virtud:", record);
    return;
  }
  
  const dateVirtueID = `${date}#${virtueID}`;

  const input = {
    userId,
    dateVirtueID,
    virtueID,
    status,
    date,
    weekNumber,
    weekVirtueID,
  };

  const result = await client.graphql({
    query: createVirtueRecordMutation,
    variables: { input },
  });

  return result.data.createVirtueRecord;
};

// Actualizar un registro existente de virtud
export const updateVirtueRecordAPI = async (record) => {
  const { id, status, weekNumber, weekVirtueID } = record;

  if (!id) {
    throw new Error('Se requiere el ID del registro para actualizar.');
  }

  // Validación para asegurar que todos los campos necesarios están presentes
  if (status === undefined || !weekNumber || !weekVirtueID) {
    console.error("Datos incompletos para actualizar el registro de virtud:", record);
    return;
  }

  const input = {
    id,
    status,
    weekNumber,
    weekVirtueID,
  };

  const result = await client.graphql({
    query: updateVirtueRecordMutation,
    variables: { input },
  });

  return result.data.updateVirtueRecord;
};

// Ejemplo de una función que estaba generando el error
const $b = (t) => {
  // Validación para asegurarse de que 't' está definido y contiene 'date'
  if (!t || !t.date) {
    console.error("El objeto 't' es undefined o no tiene la propiedad 'date'");
    return; // Evitar que el código continúe si 't' no está definido
  }

  const { date, ...rest } = t;
  // Continúa con la lógica después de validar que 't' tiene la propiedad 'date'
  console.log("Fecha procesada:", date);
  // Aquí puedes seguir con el resto de la lógica que depende de 'date'
};
