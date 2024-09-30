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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeVirtue();
        await loadRecords();
      } catch (error) {
        console.error("Error en la inicialización:", error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const initializeVirtue = async () => {
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

    try {
      const data = await getVirtuesWithRecords(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      if (!data || data.length === 0) {
        console.warn("No se encontraron registros. Deberían crearse en el backend.");
        return;
      }
      processRecords(data);
    } catch (error) {
      console.error("Error cargando registros:", error);
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
    // ... (código para handleMark - sin cambios)
  };


  const calculateSuccess = (virtueId) => {
    // ... (código para calculateSuccess - sin cambios)
  };

  const calculateWeeklyImprovement = () => {
    // ... (código para calculateWeeklyImprovement - sin cambios)
  };

  const improvements = calculateWeeklyImprovement();

  const getCurrentDay = () => {
    const date = new Date();
    const day = date.getDay();
    return day === 0 ? 'Domingo' : daysOfWeek[day - 1];
  };

  return (
    <div className="calendar-container">
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
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
                        {records[virtue.id]?.[day] === true ? '🟢' : records[virtue.id]?.[day] === false ? '🔴' : '⚪️'}
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
        </>
      )}
    </div>
  );
};

export default Calendar;