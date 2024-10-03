import React, { useState, useEffect } from 'react';
import { getVirtueRecordsForWeek } from '../api';
import { virtues as allVirtues } from '../utils/virtues';
import './Visualization.css';
import { getWeekNumber } from '../utils/dateUtils';

const Visualization = () => {
  const [weekRecord, setWeekRecord] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(getWeekNumber(new Date()));
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchWeekRecord();
  }, [currentWeek, currentYear]);

  const fetchWeekRecord = async () => {
    const userId = 'currentUserId'; // Asume que tienes acceso al ID del usuario actual
    const weekId = `${currentYear}-W${currentWeek.toString().padStart(2, '0')}`;
    const record = await getVirtueRecordsForWeek(userId, weekId);
    setWeekRecord(record);
  };

  const handleWeekChange = (increment) => {
    let newWeek = currentWeek + increment;
    let newYear = currentYear;

    if (newWeek > 52) {
      newWeek = 1;
      newYear++;
    } else if (newWeek < 1) {
      newWeek = 52;
      newYear--;
    }

    setCurrentWeek(newWeek);
    setCurrentYear(newYear);
  };

  const renderVirtueStatus = (virtue) => {
    if (!weekRecord) return <div>No records found for this week.</div>;
  
    return (
      <div key={virtue.id} className="virtue-row">
        <span className="virtue-name">{virtue.name}</span>
        <div className="virtue-status">
          {Object.values(weekRecord.days).map((day, index) => (
            <div
              key={index}
              className={`status-dot ${day.virtues[virtue.id].status === 1 ? 'success' : day.virtues[virtue.id].status === -1 ? 'failure' : ''}`}
              title={`Día ${index + 1}: ${day.virtues[virtue.id].status === 1 ? 'Éxito' : day.virtues[virtue.id].status === -1 ? 'Fallo' : 'No marcado'}`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="visualization-container">
      <h2>Visualización Semanal de Virtudes</h2>
      <div className="week-navigation">
        <button onClick={() => handleWeekChange(-1)}>&lt; Semana Anterior</button>
        <span>Semana {currentWeek} del {currentYear}</span>
        <button onClick={() => handleWeekChange(1)}>Semana Siguiente &gt;</button>
      </div>
      <div className="virtues-grid">
        {allVirtues.map(virtue => renderVirtueStatus(virtue))}
      </div>
    </div>
  );
};

export default Visualization;