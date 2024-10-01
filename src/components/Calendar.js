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
    const startDate = startOfWeek.toISOString().split('T')[0];
    const endDate = new Date(startOfWeek);
    endDate.setDate(endDate.getDate() + 6);
    const endDateString = endDate.toISOString().split('T')[0];

    const data = await getVirtuesWithRecords(startDate, endDateString);

    if (!data || data.length === 0) {
      // Inicializar registros vacíos con estado 0
      for (const virtue of allVirtues) {
        const weekNumber = getWeekNumber(startOfWeek);
        const weekVirtueID = allVirtues[(weekNumber - 1) % allVirtues.length].id;

        const newRecords = {};
        daysOfWeek.forEach((day, index) => {
          const recordDate = new Date(startOfWeek);
          recordDate.setDate(startOfWeek.getDate() + index);
          const formattedDate = recordDate.toISOString().split('T')[0];
          newRecords[day] = {
            virtueID: virtue.id,
            status: 0,
            date: formattedDate,
            weekNumber: weekNumber,
            weekVirtueID: weekVirtueID,
          };
        });

        for (const day in newRecords) {
          await createVirtueRecordAPI(newRecords[day]);
        }
      }
      // Recargar los registros después de inicializar
      const refreshedData = await getVirtuesWithRecords(startDate, endDateString);
      processRecords(refreshedData);
    } else {
      processRecords(data);
    }
  };

  const processRecords = (data) => {
    if (!data || data.length === 0) {
      console.error("No se encontraron registros de virtudes.");
      return;
    }
  
    const recordsData = {};
    data.forEach((record) => {
      if (!record.date || !record.virtueID) {
        console.error("Registro inválido, falta 'date' o 'virtueID'.", record);
        return;
      }
      
      if (!recordsData[record.virtueID]) {
        recordsData[record.virtueID] = {};
      }
      const dayName = getDayName(new Date(record.date).getDay());
      recordsData[record.virtueID][dayName] = {
        status: record.status,
        id: record.id,
      };
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
    const currentRecord = updatedRecords[virtueId]?.[day];
    const currentStatus = currentRecord ? currentRecord.status : 0;
    const currentId = currentRecord ? currentRecord.id : null;

    let newStatus;

    // Ciclo de estados: 0 -> 1 -> -1 -> 0
    if (currentStatus === 0) {
      newStatus = 1;
    } else if (currentStatus === 1) {
      newStatus = -1;
    } else if (currentStatus === -1) {
      newStatus = 0;
    }

    // Actualizar estado localmente
    updatedRecords[virtueId] = { 
      ...updatedRecords[virtueId], 
      [day]: {
        status: newStatus,
        id: currentId, // mantener el ID si existe
      } 
    };
    setRecords(updatedRecords);

    // Obtener la fecha correspondiente
    const today = new Date();
    const startOfWeek = getStartOfWeek(today);
    const recordDate = new Date(startOfWeek);
    const dayIndex = daysOfWeek.indexOf(day);
    recordDate.setDate(startOfWeek.getDate() + dayIndex);
    const formattedDate = recordDate.toISOString().split('T')[0];

    const weekNumber = getWeekNumber(startOfWeek);
    const weekVirtueID = allVirtues[(weekNumber - 1) % allVirtues.length].id;

    if (currentId) {
      // Actualizar registro existente
      await updateVirtueRecordAPI({
        id: currentId,
        status: newStatus,
        weekNumber: weekNumber,
        weekVirtueID: weekVirtueID,
      });
    } else {
      // Crear nuevo registro
      const newRecord = await createVirtueRecordAPI({
        virtueID: virtueId,
        status: newStatus,
        date: formattedDate,
        weekNumber: weekNumber,
        weekVirtueID: weekVirtueID,
      });

      // Actualizar estado local con el nuevo ID
      updatedRecords[virtueId][day] = {
        status: newStatus,
        id: newRecord.id,
      };
      setRecords(updatedRecords);
    }
  };

  const calculateSuccess = (virtueId) => {
    if (!records[virtueId]) {
      return 0;
    }

    const weekDays = daysOfWeek.map(day => records[virtueId][day]?.status === 1 ? 1 : 0);
    const successCount = weekDays.reduce((acc, val) => acc + val, 0);
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
                      records[virtue.id]?.[day]?.status === 1
                        ? 'success'
                        : records[virtue.id]?.[day]?.status === -1
                        ? 'error'
                        : ''
                    }`}
                    onClick={() => handleMark(virtue.id, day)}
                    title={
                      records[virtue.id]?.[day]?.status === 1
                        ? 'Cumplido'
                        : records[virtue.id]?.[day]?.status === -1
                        ? 'No cumplido'
                        : 'Marcar como cumplido'
                    }
                  >
                    {records[virtue.id]?.[day]?.status === 1
                      ? '🟢'
                      : records[virtue.id]?.[day]?.status === -1
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
