import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { virtues as allVirtues } from '../utils/virtues';
import { getVirtueRecordsForWeek } from '../api';
import { getWeekNumber, getStartOfWeek } from '../utils/dateUtils';
import './ProgressChart.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProgressChart = () => {
  const [records, setRecords] = useState([]);
  const [selectedVirtues, setSelectedVirtues] = useState(allVirtues.map(v => v.id));
  const [startWeek, setStartWeek] = useState(1);
  const [endWeek, setEndWeek] = useState(13);

  useEffect(() => {
    fetchRecords();
  }, [startWeek, endWeek]);

  const fetchRecords = async () => {
    const currentYear = new Date().getFullYear();
    const userId = 'currentUserId'; // Asume que tienes acceso al ID del usuario actual
    let allRecords = [];

    for (let week = startWeek; week <= endWeek; week++) {
      const weekId = `${currentYear}-W${week.toString().padStart(2, '0')}`;
      const weekRecords = await getVirtueRecordsForWeek(userId, weekId);
      allRecords = [...allRecords, ...weekRecords];
    }

    setRecords(allRecords);
  };

  const handleVirtueSelection = (virtueId) => {
    const updatedSelection = selectedVirtues.includes(virtueId)
      ? selectedVirtues.filter(id => id !== virtueId)
      : [...selectedVirtues, virtueId];
    setSelectedVirtues(updatedSelection);
  };

  const handleWeekChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startWeek') {
      setStartWeek(Number(value));
    } else if (name === 'endWeek') {
      setEndWeek(Number(value));
    }
  };

  const calculateWeeklySuccess = (virtueId, weekNumber) => {
    const weekRecords = records.filter(record => record.virtueID === virtueId && record.weekNumber === weekNumber);
    if (weekRecords.length === 0) return 0;
    const successCount = weekRecords[0].weekStatus.filter(status => status === 1).length;
    return (successCount / 7) * 100;
  };

  const chartData = {
    labels: Array.from({ length: endWeek - startWeek + 1 }, (_, i) => `Semana ${startWeek + i}`),
    datasets: selectedVirtues.map((virtueId) => {
      const virtue = allVirtues.find(v => v.id === virtueId);
      const dataPoints = Array.from({ length: endWeek - startWeek + 1 }, (_, i) => {
        return calculateWeeklySuccess(virtueId, startWeek + i);
      });

      return {
        label: virtue.name,
        data: dataPoints,
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
      };
    }),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          title: function (context) {
            const weekLabel = context[0].label;
            const weekNumber = Number(weekLabel.split(' ')[1]);
            const virtueIndex = (weekNumber - 1) % allVirtues.length;
            const virtue = allVirtues[virtueIndex];
            return `Semana ${weekNumber} - Objetivo: ${virtue ? virtue.name : 'Sin objetivo'}`;
          },
        },
      },
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Progreso de Virtudes',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Porcentaje de Cumplimiento (%)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Semanas',
        },
      },
    },
  };

  return (
    <div className="progress-chart-container">
      <h2>Gráfico de Progreso</h2>
      <div className="filters">
        <div className="virtue-selector">
          <label>Selecciona Virtudes:</label>
          {allVirtues.map((virtue) => (
            <div key={virtue.id}>
              <input
                type="checkbox"
                checked={selectedVirtues.includes(virtue.id)}
                onChange={() => handleVirtueSelection(virtue.id)}
              />
              {virtue.name}
            </div>
          ))}
        </div>
        <div className="week-selector">
          <label>Semana Inicio:</label>
          <input
            type="number"
            name="startWeek"
            min="1"
            max="52"
            value={startWeek}
            onChange={handleWeekChange}
          />
          <label>Semana Fin:</label>
          <input
            type="number"
            name="endWeek"
            min="1"
            max="52"
            value={endWeek}
            onChange={handleWeekChange}
          />
        </div>
      </div>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default ProgressChart;