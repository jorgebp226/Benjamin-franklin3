import React, { useState, useEffect } from 'react';
import { virtues as allVirtues } from '../utils/virtues';
import { getVirtueRecordsForWeek, createInitialVirtueRecords, updateVirtueStatusCall } from '../api';
import { getWeekNumber, getStartOfWeek } from '../utils/dateUtils';
import './Calendar.css';

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const Calendar = ({ userId }) => {
  const [currentWeekVirtue, setCurrentWeekVirtue] = useState(null);
  const [records, setRecords] = useState({});
  const [showDescription, setShowDescription] = useState({});
  const [currentWeek, setCurrentWeek] = useState(null);

  useEffect(() => {
    initializeWeek();
    loadRecords();
  }, [userId]);

  const initializeWeek = () => {
    const today = new Date();
    const weekNumber = getWeekNumber(today);
    const year = today.getFullYear();
    const weekId = `${year}-W${weekNumber}`;
    const weekVirtueID = allVirtues[(weekNumber - 1) % allVirtues.length].id;

    setCurrentWeek({ weekNumber, year, weekId, weekVirtueID });
    setCurrentWeekVirtue(allVirtues[(weekNumber - 1) % allVirtues.length]);
  };

  const loadRecords = async () => {
    if (!currentWeek) return;
  
    let weekRecords = await getVirtueRecordsForWeek(userId, currentWeek.weekId);
  
    if (!weekRecords) {
      await createInitialVirtueRecords(userId, currentWeek.weekId, currentWeek.weekVirtueID);
      weekRecords = await getVirtueRecordsForWeek(userId, currentWeek.weekId);
    }
  
    setRecords(weekRecords);
  };
  
  const toggleDescription = (virtueId) => {
    setShowDescription((prevState) => ({
      ...prevState,
      [virtueId]: !prevState[virtueId],
    }));
  };

  const handleMark = async (virtueId, dayIndex) => {
    const currentStatus = records.days[dayIndex].virtues[virtueId].status;
    let newStatus = currentStatus === 0 ? 1 : currentStatus === 1 ? -1 : 0;

    const updatedRecord = await updateVirtueStatusCall(records.id, dayIndex, virtueId, newStatus);

    if (updatedRecord) {
      setRecords(prev => ({
        ...prev,
        days: {
          ...prev.days,
          [dayIndex]: {
            ...prev.days[dayIndex],
            virtues: {
              ...prev.days[dayIndex].virtues,
              [virtueId]: { status: newStatus }
            }
          }
        }
      }));
    }
  };

  const calculateSuccess = (virtueId) => {
    if (!records[virtueId]) {
      return 0;
    }

    const successCount = records[virtueId].weekStatus.filter(status => status === 1).length;
    return (successCount / 7) * 100;
  };

  const calculateWeeklyImprovement = () => {
    // Nota: Esta función ahora solo calcula el éxito actual, ya que no tenemos datos de la semana anterior
    return allVirtues.map((virtue) => ({
      virtue: virtue.name,
      improvement: calculateSuccess(virtue.id),
    }));
  };

  const improvements = calculateWeeklyImprovement();

  const getCurrentDay = () => {
    const date = new Date();
    const day = date.getDay();
    return day === 0 ? 'Domingo' : daysOfWeek[day - 1];
  };


  if (!currentWeek) return <div>Cargando...</div>;

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
              {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
                <td key={dayIndex}>
                  <div
                    className={`marker ${
                      records[virtue.id]?.weekStatus[dayIndex] === 1
                        ? 'success'
                        : records[virtue.id]?.weekStatus[dayIndex] === -1
                        ? 'error'
                        : ''
                    }`}
                    onClick={() => handleMark(virtue.id, dayIndex)}
                    title={
                      records[virtue.id]?.weekStatus[dayIndex] === 1
                        ? 'Cumplido'
                        : records[virtue.id]?.weekStatus[dayIndex] === -1
                        ? 'No cumplido'
                        : 'Marcar como cumplido'
                    }
                  >
                    {records[virtue.id]?.weekStatus[dayIndex] === 1
                      ? '🟢'
                      : records[virtue.id]?.weekStatus[dayIndex] === -1
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
        <h3>Progreso de esta semana:</h3>
        <ul>
          {improvements.map((improvement) => (
            <li key={improvement.virtue}>
              {improvement.virtue}: {improvement.improvement.toFixed(2)}%
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