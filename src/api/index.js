import { generateClient } from 'aws-amplify/api';
import { getVirtueRecordByUserAndWeek } from '../graphql/queries';
import { createVirtueRecord, updateVirtueStatus } from '../graphql/mutations';
import { virtues } from '../utils/virtues';
import { getWeekNumber, getStartOfWeek } from '../utils/dateUtils';

const client = generateClient();

export const getVirtueRecordsForWeek = async (userId, weekId) => {
  try {
    const result = await client.graphql({
      query: getVirtueRecordByUserAndWeek,
      variables: { userId, weekId },
    });
    if (result.data.getVirtueRecordByUserAndWeek === null) {
      console.log('No records found for this week');
      return null;
    }
    return result.data.getVirtueRecordByUserAndWeek;
  } catch (error) {
    console.error('Error fetching virtue records:', error);
    if (error.errors && error.errors.length > 0) {
      console.error('GraphQL error:', error.errors[0].message);
    }
    return null;
  }
};

export const createInitialVirtueRecords = async (userId, weekId, weekVirtueId) => {
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
          weekVirtueId,
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

export const updateVirtueStatusCall = async (id, dayIndex, virtueId, newStatus) => {
  try {
    const result = await client.graphql({
      query: updateVirtueStatus,
      variables: {
        input: {
          id,
          dayIndex,
          virtueId,
          newStatus,
        },
      },
    });
    return result.data.updateVirtueStatus;
  } catch (error) {
    console.error('Error updating virtue status:', error);
    return null;
  }
};