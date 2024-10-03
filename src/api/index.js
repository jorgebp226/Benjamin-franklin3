// index.js
import { generateClient } from 'aws-amplify/api';
import { getVirtueRecordByUserAndWeek } from '../graphql/queries';
import { createVirtueRecord, updateVirtueStatusCustom as updateVirtueStatusGraphQL } from '../graphql/mutations'; // Cambié el nombre aquí
import { virtues } from '../utils/virtues';
import { getWeekNumber, getStartOfWeek } from '../utils/dateUtils';

const client = generateClient();

export const getVirtueRecordsForWeek = async (userId, weekId) => {
  try {
    const result = await client.graphql({
      query: getVirtueRecordByUserAndWeek,
      variables: { userId, weekId },
    });
    return result.data.getVirtueRecordByUserAndWeek;
  } catch (error) {
    console.error('Error fetching virtue records:', error);
    return null;
  }
};

export const createInitialVirtueRecords = async (userId, weekId, weekNumber, weekVirtueID, year) => {
  const startOfWeek = getStartOfWeek(new Date());
  const days = {};

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    days[i] = {
      date: date.toISOString(),
      virtues: virtues.reduce((acc, virtue) => {
        acc[virtue.id] = { status: 0 };
        return acc;
      }, {}),
    };
  }

  try {
    const result = await client.graphql({
      query: createVirtueRecord,
      variables: {
        input: {
          userId,
          weekId,
          weekVirtueId: weekVirtueID,
          days: JSON.stringify(days),
        },
      },
    });
    return result.data.createVirtueRecord;
  } catch (error) {
    console.error('Error creating initial virtue records:', error);
    return null;
  }
};

// Renombrar la función localmente para evitar conflicto
export const updateVirtueStatusCustomLocal = async (id, dayIndex, virtueId, newStatus) => {
  try {
    const result = await client.graphql({
      query: updateVirtueStatusGraphQL,  // Usar la importación con el nombre cambiado
      variables: {
        input: {
          id,
          dayIndex,
          virtueId,
          newStatus,
        },
      },
    });
    return result.data.updateVirtueStatusCustom;
  } catch (error) {
    console.error('Error updating virtue status:', error);
    return null;
  }
};
