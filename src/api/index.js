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
