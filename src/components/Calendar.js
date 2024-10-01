// src/components/Calendar.js

import React, { useState, useEffect } from 'react';
import { virtues as allVirtues } from '../utils/virtues';
import { 
  getVirtuesWithRecords, 
  createVirtueRecordAPI, 
  updateVirtueRecordAPI 
} from '../api';
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
    const startOfWeekDate = getStartOfWeek(today);
    const startDate = startOfWeekDate.toISOString().split('T')[0];
    const endDateObj = new Date(startOfWeekDate);
    endDateObj.setDate(endDateObj.getDate() + 6);
    const endDate = endDateObj.toISOString().split('T')[0];

    const data = await getVirtuesWithRecords(startDate, endDate);

    if (!data || data.length === 0) {
      // Inicializar registros vacíos para cada virtud y día de la semana
      await initializeEmptyRecords(startOfWeekDate);
      // Recargar los registros después de inicializar
      const refreshedData = await getVirtuesWithRecords(startDate, endDate);
      processRecords(refreshedData);
    } else {
      processRecords(data);
    }
  };

  const initializeEmptyRecords = async (startOfWeek) => {
    const weekNumber = getWeekNumber(startOfWeek);
    const weekVirtue = allVirtues[(weekNumber - 1) % allVirtues.length];
    const weekVirtueID = weekVirtue.id;

    for (const virtue of allVirtues) {
      for (let index = 0; index < daysOfWeek.length; index++) {
        const recordDate = new Date(startOfWeek);
        recordDate.setDate(startOfWeek.getDate() + index);
        const formattedDate = recordDate.toISOString().split('T')[0];

        const newRecord = {
          virtueID: virtue.id,
          status: null,
          date: formattedDate,
          weekNumber: weekNumber,
          weekVirtueID: weekVirtueID,
        };

        await createVirtueRecordAPI(newRecord);
      }
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

    // Obtener el registro existente para esta virtud y fecha
    const filter = {
      virtueID: { eq: virtueId },
      date: { eq: formattedDate }
    };

    const response = await API.graphql(graphqlOperation(listVirtueRecords, { filter }));

    const existingRecord = response.data.listVirtueRecords.items.find(
      (record) => record.virtueID === virtueId && record.date === formattedDate
    );

    if (existingRecord) {
      await updateVirtueRecordAPI({
        id: existingRecord.id,
        virtueID: virtueId,
        status: newStatus,
        date: formattedDate,
        weekNumber: weekNumber,
        weekVirtueID: weekVirtueID,
      });
    } else {
      await createVirtueRecordAPI({
        virtueID: virtueId,
        status: newStatus,
        date: formattedDate,
        weekNumber: weekNumber,
        weekVirtueID: weekVirtueID,
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
      const previousWeekSuccess = 0; // Implementar lógica para obtener la semana anterior si es necesario

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
