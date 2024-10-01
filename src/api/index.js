// src/api.js

import { API, graphqlOperation } from 'aws-amplify';
import {
  createVirtue,
  updateVirtue,
  deleteVirtue,
  createVirtueRecord,
  updateVirtueRecord,
  deleteVirtueRecord
} from './graphql/mutations';
import {
  listVirtueRecords,
  virtueRecordsByVirtueAndDate
} from './graphql/queries';

// Función para obtener registros de virtudes dentro de un rango de fechas
export const getVirtuesWithRecords = async (startDate, endDate) => {
  try {
    const filter = {
      and: [
        { date: { ge: startDate } },
        { date: { le: endDate } }
      ]
    };

    const response = await API.graphql(graphqlOperation(listVirtueRecords, { filter }));

    return response.data.listVirtueRecords.items;
  } catch (error) {
    console.error('Error fetching virtues with records:', error);
    return [];
  }
};

// Función para crear un registro de virtud
export const createVirtueRecordAPI = async (recordInput) => {
  try {
    const response = await API.graphql(graphqlOperation(createVirtueRecord, { input: recordInput }));
    return response.data.createVirtueRecord;
  } catch (error) {
    console.error('Error creating virtue record:', error);
    throw error;
  }
};

// Función para actualizar un registro de virtud
export const updateVirtueRecordAPI = async (recordInput) => {
  try {
    const response = await API.graphql(graphqlOperation(updateVirtueRecord, { input: recordInput }));
    return response.data.updateVirtueRecord;
  } catch (error) {
    console.error('Error updating virtue record:', error);
    throw error;
  }
};

// Función para crear una virtud
export const createVirtueAPI = async (virtueInput) => {
  try {
    const response = await API.graphql(graphqlOperation(createVirtue, { input: virtueInput }));
    return response.data.createVirtue;
  } catch (error) {
    console.error('Error creating virtue:', error);
    throw error;
  }
};

// Función para actualizar una virtud
export const updateVirtueAPI = async (virtueInput) => {
  try {
    const response = await API.graphql(graphqlOperation(updateVirtue, { input: virtueInput }));
    return response.data.updateVirtue;
  } catch (error) {
    console.error('Error updating virtue:', error);
    throw error;
  }
};

// Función para eliminar una virtud
export const deleteVirtueAPI = async (virtueInput) => {
  try {
    const response = await API.graphql(graphqlOperation(deleteVirtue, { input: virtueInput }));
    return response.data.deleteVirtue;
  } catch (error) {
    console.error('Error deleting virtue:', error);
    throw error;
  }
};
