// src/api.js

import { generateClient } from '@aws-amplify/api'; // Asegúrate de que esta ruta es correcta
import {
  createVirtue,
  updateVirtue,
  deleteVirtue,
  createVirtueRecord,
  updateVirtueRecord,
  deleteVirtueRecord
} from './graphql/mutations';
import {
  listVirtueRecords
} from './graphql/queries';

// Genera una instancia del cliente
const client = generateClient();

// Función para obtener registros de virtudes dentro de un rango de fechas
export const getVirtuesWithRecords = async (startDate, endDate) => {
  try {
    const filter = {
      and: [
        { date: { ge: startDate } },
        { date: { le: endDate } }
      ]
    };

    const response = await client.graphql({
      query: listVirtueRecords,
      variables: { filter },
      authMode: 'AMAZON_COGNITO_USER_POOLS' // Ajusta según tu configuración de autenticación
    });

    return response.data.listVirtueRecords.items;
  } catch (error) {
    console.error('Error fetching virtues with records:', error);
    return [];
  }
};

// Función para crear un registro de virtud
export const createVirtueRecordAPI = async (recordInput) => {
  try {
    const response = await client.graphql({
      query: createVirtueRecord,
      variables: { input: recordInput },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    });
    return response.data.createVirtueRecord;
  } catch (error) {
    console.error('Error creating virtue record:', error);
    throw error;
  }
};

// Función para actualizar un registro de virtud
export const updateVirtueRecordAPI = async (recordInput) => {
  try {
    const response = await client.graphql({
      query: updateVirtueRecord,
      variables: { input: recordInput },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    });
    return response.data.updateVirtueRecord;
  } catch (error) {
    console.error('Error updating virtue record:', error);
    throw error;
  }
};

// Función para crear una virtud
export const createVirtueAPI = async (virtueInput) => {
  try {
    const response = await client.graphql({
      query: createVirtue,
      variables: { input: virtueInput },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    });
    return response.data.createVirtue;
  } catch (error) {
    console.error('Error creating virtue:', error);
    throw error;
  }
};

// Función para actualizar una virtud
export const updateVirtueAPI = async (virtueInput) => {
  try {
    const response = await client.graphql({
      query: updateVirtue,
      variables: { input: virtueInput },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    });
    return response.data.updateVirtue;
  } catch (error) {
    console.error('Error updating virtue:', error);
    throw error;
  }
};

// Función para eliminar una virtud
export const deleteVirtueAPI = async (virtueInput) => {
  try {
    const response = await client.graphql({
      query: deleteVirtue,
      variables: { input: virtueInput },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    });
    return response.data.deleteVirtue;
  } catch (error) {
    console.error('Error deleting virtue:', error);
    throw error;
  }
};
