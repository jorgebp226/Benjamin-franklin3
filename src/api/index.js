import { generateClient } from 'aws-amplify/api';
import { getVirtueRecordByUserAndWeek as getVirtueRecordQuery } from '../graphql/queries';
import { createVirtueRecord, updateVirtueStatus } from '../graphql/mutations';
import { virtues } from '../utils/virtues';
import { getWeekNumber, getStartOfWeek } from '../utils/dateUtils';

const client = generateClient();

export const getVirtueRecordsForWeek = async (userId, weekId) => {
  try {
    const result = await client.graphql({
      query: getVirtueRecordQuery,
      variables: { userId, weekId },
    });
    if (result.data.getVirtueRecordByUserAndWeek === null) {
      console.log('No se encontraron registros para esta semana');
      return null;
    }
    return result.data.getVirtueRecordByUserAndWeek;
  } catch (error) {
    console.error('Error al obtener los registros de virtudes:', error);
    if (error.errors && error.errors.length > 0) {
      console.error('Error de GraphQL:', error.errors[0].message);
    }
    return null;
  }
};

export const createInitialVirtueRecords = async (userId, currentWeek) => {
  const { weekId, year, weekNumber, weekVirtueID } = currentWeek;
  const startOfWeek = getStartOfWeek(new Date());
  const days = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    days.push({
      date: date.toISOString().split('T')[0], // Formato YYYY-MM-DD
      virtues: virtues.map(virtue => ({
        virtueId: virtue.id,
        status: 0
      }))
    });
  }

  try {
    const result = await client.graphql({
      query: createVirtueRecord,
      variables: {
        input: {
          userId,
          weekId,
          year,
          weekNumber,
          weekVirtueId: weekVirtueID,
          days
        },
      },
    });
    return result.data.createVirtueRecord;
  } catch (error) {
    console.error('Error al crear registros iniciales de virtudes:', error);
    return null;
  }
};

export const updateVirtueStatusCall = async (id, date, virtueId, newStatus) => {
  try {
    const result = await client.graphql({
      query: updateVirtueStatus,
      variables: {
        input: {
          id,
          date,
          virtueId,
          newStatus,
        },
      },
    });
    return result.data.updateVirtueStatus;
  } catch (error) {
    console.error('Error al actualizar el estado de la virtud:', error);
    return null;
  }
};