import React, { useState, useEffect } from 'react';
import { getVirtueRecordsForWeek } from '../api';
import { virtues as allVirtues } from '../utils/virtues';
import './Visualization.css';

const Visualization = () => {
  const [weekRecords, setWeekRecords] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(getWeekNumber(new Date()));
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchWeekRecords();
  }, [currentWeek, currentYear]);

  const fetchWeekRecords = async () => {
    const userId = 'currentUserId'; // Asume que tienes acceso al ID del usuario actual
    const weekId = `${currentYear}-W${currentWeek.toString().padStart(2, '0')}`;
    const records = await getVirtueRecordsForWeek(userId, weekId);
    setWeekRecords(records);
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
    const record = weekRecords.find(r => r.virtueID === virtue.id);
    if (!record) return null;

    return (
      <div key={virtue.id} className="virtue-row">
        <span className="virtue-name">{virtue.name}</span>
        <div className="virtue-status">
          {record.weekStatus.map((status, index) => (
            <div
              key={index}
              className={`status-dot ${status === 1 ? 'success' : 'failure'}`}
              title={`Día ${index + 1}: ${status === 1 ? 'Éxito' : 'Fallo'}`}
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