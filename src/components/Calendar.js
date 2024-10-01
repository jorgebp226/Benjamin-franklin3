// src/components/Calendar.js
import React, { useState, useEffect } from 'react';
import { virtues as allVirtues } from '../utils/virtues';
import { getVirtuesWithRecords, createVirtueRecordAPI, updateVirtueRecordAPI } from '../api';
import { getWeekNumber, getStartOfWeek } from '../utils/dateUtils';
import './Calendar.css';

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const Calendar = () => {
  const [currentWeekVirtue, setCurrentWeekVirtue] = useState(null);
  const [records, setRecords] = useState({});
  const [showDescription, setShowDescription] = useState({});

  useEffect(() => {
    initializeVirtue();
    loadRecords();
  }, []);

  const initializeVirtue = () => {
    const today = new Date();
    const currentWeekNumber = getWeekNumber(today);
    const virtueIndex = (currentWeekNumber - 1) % allVirtues.length;
    setCurrentWeekVirtue(allVirtues[virtueIndex]);
  };

  const loadRecords = async () => {
    const today = new Date();
    const startOfWeek = getStartOfWeek(today);
    const startDate = new Date(startOfWeek);
    const endDate = new Date(startOfWeek);
    endDate.setDate(endDate.getDate() + 6);

    const data = await getVirtuesWithRecords(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    if (!data || data.length === 0) {
      for (const virtue of allVirtues) {
        const weekNumber = getWeekNumber(startOfWeek);
        const weekVirtueID = allVirtues[(weekNumber - 1) % allVirtues.length].id;

        const newRecords = {};
        daysOfWeek.forEach((day, index) => {
          const recordDate = new Date(startOfWeek);
          recordDate.setDate(startOfWeek.getDate() + index);
          newRecords[day] = {
            virtueID: virtue.id,
            status: null,
            date: recordDate.toISOString().split('T')[0],
            weekNumber: weekNumber,
            weekVirtueID: weekVirtueID,
            virtue: {
              id: virtue.id,
              name: virtue.name,
              description: virtue.description || '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          };
        });

        for (const day in newRecords) {
          await createVirtueRecordAPI(newRecords[day]);
        }
      }
      const refreshedData = await getVirtuesWithRecords(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      processRecords(refreshedData);
    } else {
      processRecords(data);
    }
  };

  const processRecords = (data) => {
    const recordsData = {};
    data.forEach((record) => {
      if (!recordsData[record.virtueID]) {
        recordsData[record.virtueID] = {};
      }
      const dayName = getDayName(new Date(record.date).getDay());
      recordsData[record.virtueID][dayName] = record.status;
    });
    setRecords(recordsData);
  };

  const getDayName = (dayIndex) => {
    return dayIndex === 0 ? 'Domingo' : daysOfWeek[dayIndex - 1];
  };

  const toggleDescription = (virtueId) => {
    setShowDescription((prevState) => ({
      ...prevState,
      [virtueId]: !prevState[virtueId],
    }));
  };

  const handleMark = async (virtueId, day) => {
    const updatedRecords = { ...records };
    const currentStatus = updatedRecords[virtueId]?.[day];

    let newStatus;
    if (currentStatus === true) {
      newStatus = false;
    } else if (currentStatus === false) {
      newStatus = null;
    } else {
      newStatus = true;
    }

    updatedRecords[virtueId] = { ...updatedRecords[virtueId], [day]: newStatus };
    setRecords(updatedRecords);

    const today = new Date();
    const startOfWeek = getStartOfWeek(today);
    const recordDate = new Date(startOfWeek);
    const dayIndex = daysOfWeek.indexOf(day);
    recordDate.setDate(startOfWeek.getDate() + dayIndex);
    const formattedDate = recordDate.toISOString().split('T')[0];

    const weekNumber = getWeekNumber(startOfWeek);
    const weekVirtueID = allVirtues[(weekNumber - 1) % allVirtues.length].id;

    const existingRecords = await getVirtuesWithRecords(formattedDate, formattedDate);
    const existingRecord = existingRecords.find(
      (record) => record.virtueID === virtueId && record.date === formattedDate
    );

    const currentVirtue = allVirtues.find((v) => v.id === virtueId);

    if (existingRecord) {
      await updateVirtueRecordAPI({
        id: existingRecord.id,
        virtueID: virtueId,
        status: newStatus,
        date: formattedDate,
        weekNumber: weekNumber,
        weekVirtueID: weekVirtueID,
        virtue: {
          id: virtueId,
          name: currentVirtue.name,
          description: currentVirtue.description || '',
          updatedAt: new Date().toISOString(),
        },
      });
    } else {
      await createVirtueRecordAPI({
        virtueID: virtueId,
        status: newStatus,
        date: formattedDate,
        weekNumber: weekNumber,
        weekVirtueID: weekVirtueID,
        virtue: {
          id: virtueId,
          name: currentVirtue.name,
          description: currentVirtue.description || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }
  };

  const calculateSuccess = (virtueId) => {
    if (!records[virtueId]) {
      return 0;
    }

    const weekDays = daysOfWeek.map(day => records[virtueId][day]);
    const successCount = weekDays.filter(status => status === true).length;
    return (successCount / 7) * 100;
  };

  const calculateWeeklyImprovement = () => {
    const today = new Date();
    const currentWeekNumber = getWeekNumber(today);
    const previousWeekNumber = currentWeekNumber > 1 ? currentWeekNumber - 1 : 1;

    const improvements = allVirtues.map((virtue) => {
      const currentWeekSuccess = calculateSuccess(virtue.id);
      const previousWeekSuccess = 0;

      return {
        virtue: virtue.name,
        improvement: currentWeekSuccess - previousWeekSuccess,
      };
    });

    return improvements;
  };

  const improvements = calculateWeeklyImprovement();

  const getCurrentDay = () => {
    const date = new Date();
    const day = date.getDay();
    return day === 0 ? 'Domingo' : daysOfWeek[day - 1];
  };

  return (
    <div className="calendar-container">
      <h2>Semana Actual: {currentWeekVirtue ? currentWeekVirtue.name : 'Cargando...'}</h2>
      <table className="calendar-table">
        <thead>
          <tr>
            <th>Virtud</th>
            <th>Descripción</th>
            {daysOfWeek.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allVirtues.map((virtue) => (
            <tr key={virtue.id}>
              <td>{virtue.name}</td>
              <td>
                <button onClick={() => toggleDescription(virtue.id)}>
                  {showDescription[virtue.id] ? 'Ocultar' : 'Mostrar'}
                </button>
                {showDescription[virtue.id] && <p>{virtue.description}</p>}
              </td>
              {daysOfWeek.map((day) => (
                <td key={day}>
                  <div
                    className={`marker ${
                      records[virtue.id]?.[day] === true
                        ? 'success'
                        : records[virtue.id]?.[day] === false
                        ? 'error'
                        : ''
                    }`}
                    onClick={() => handleMark(virtue.id, day)}
                    title={
                      records[virtue.id]?.[day] === true
                        ? 'Cumplido'
                        : records[virtue.id]?.[day] === false
                        ? 'No cumplido'
                        : 'Marcar como cumplido'
                    }
                  >
                    {records[virtue.id]?.[day] === true
                      ? '🟢'
                      : records[virtue.id]?.[day] === false
                      ? '🔴'
                      : '⚪️'}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="weekly-improvements">
        <h3>Mejoras de esta semana:</h3>
        <ul>
          {improvements.map((improvement) => (
            <li key={improvement.virtue}>
              {improvement.virtue}: {improvement.improvement > 0 ? `+${improvement.improvement.toFixed(2)}%` : `${improvement.improvement.toFixed(2)}%`}
            </li>
          ))}
        </ul>
      </div>

      <div className="current-day">
        <strong>Hoy es: {getCurrentDay()}</strong>
      </div>
    </div>
  );
};

export default Calendar;
