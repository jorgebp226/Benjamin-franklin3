// src/api/index.js
import { generateClient } from '@aws-amplify/api';
import { listVirtues, getVirtueRecordsByVirtueAndDate } from './graphql/queries';
import { createVirtueRecord, updateVirtueRecord } from './graphql/mutations';

// Crear el cliente GraphQL
const client = generateClient();

// Obtener todas las virtudes
export const getVirtues = async () => {
  try {
    const virtueData = await client.graphql({
      query: listVirtues,
    });
    return virtueData.data.listVirtues.items;
  } catch (error) {
    console.error('Error fetching virtues:', error);
    return [];
  }
};

// Obtener registros de virtudes por virtud y rango de fechas
export const getVirtuesWithRecords = async (startDate, endDate) => {
  try {
    const variables = {
      date: { between: [startDate, endDate] }, // Filtro por rango de fechas
      sortDirection: 'ASC',
    };
    const recordsData = await client.graphql({
      query: getVirtueRecordsByVirtueAndDate,
      variables,
    });
    return recordsData.data.virtueRecordsByVirtueAndDate.items;
  } catch (error) {
    console.error('Error fetching virtue records:', error);
    return [];
  }
};

// Crear un nuevo registro de virtud
export const createVirtueRecordAPI = async (record) => {
  try {
    const newRecord = await client.graphql({
      query: createVirtueRecord,
      variables: { input: record },
    });
    return newRecord.data.createVirtueRecord;
  } catch (error) {
    console.error('Error creating virtue record:', error);
  }
};

// Actualizar un registro de virtud existente
export const updateVirtueRecordAPI = async (record) => {
  try {
    const updatedRecord = await client.graphql({
      query: updateVirtueRecord,
      variables: { input: record },
    });
    return updatedRecord.data.updateVirtueRecord;
  } catch (error) {
    console.error('Error updating virtue record:', error);
  }
};
