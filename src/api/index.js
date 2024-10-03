import { generateClient } from 'aws-amplify/api';
import { getVirtueRecordsByUserAndWeek } from '../graphql/queries';
import { createVirtueRecord, updateVirtueRecordStatus } from '../graphql/mutations';

const client = generateClient();

export const getVirtueRecordsForWeek = async (userId, weekId) => {
  try {
    const result = await client.graphql({
      query: getVirtueRecordsByUserAndWeek,
      variables: { userId, weekId },
    });
    return result.data.getVirtueRecordsByUserAndWeek;
  } catch (error) {
    console.error('Error fetching virtue records:', error);
    return [];
  }
};

export const createInitialVirtueRecords = async (userId, weekId, weekNumber, weekVirtueID, year) => {
  const virtues = ['temperance', 'silence', 'order', 'resolution', 'frugality', 'industry', 'sincerity', 'justice', 'moderation', 'cleanliness', 'tranquility', 'chastity', 'humility'];
  
  try {
    for (let virtueID of virtues) {
      await client.graphql({
        query: createVirtueRecord,
        variables: {
          input: {
            userId,
            weekId,
            virtueID,
            weekStatus: [0, 0, 0, 0, 0, 0, 0],
            weekNumber,
            weekVirtueID,
            year,
          },
        },
      });
    }
  } catch (error) {
    console.error('Error creating initial virtue records:', error);
  }
};

export const updateVirtueStatus = async (id, dayIndex, newStatus) => {
  try {
    const result = await client.graphql({
      query: updateVirtueRecordStatus,
      variables: { id, dayIndex, newStatus },
    });
    return result.data.updateVirtueRecordStatus;
  } catch (error) {
    console.error('Error updating virtue status:', error);
    return null;
  }
};