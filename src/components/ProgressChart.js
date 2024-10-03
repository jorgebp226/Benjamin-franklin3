import React, { useState, useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { virtues as allVirtues } from '../utils/virtues';
import { getVirtueRecordsForWeek } from '../api';
import { getWeekNumber, getStartOfWeek } from '../utils/dateUtils';
import './ProgressChart.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProgressChart = () => {
  const [records, setRecords] = useState([]);
  const [startWeek, setStartWeek] = useState(1);
  const [endWeek, setEndWeek] = useState(getWeekNumber(new Date()));
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchRecords();
  }, [startWeek, endWeek, year]);

  const fetchRecords = async () => {
    const userId = 'currentUserId'; // Asume que tienes acceso al ID del usuario actual
    const fetchedRecords = [];
    for (let week = startWeek; week <= endWeek; week++) {
      const weekId = `${year}-W${week.toString().padStart(2, '0')}`;
      const record = await getVirtueRecordsForWeek(userId, weekId);
      if (record) {
        fetchedRecords.push(record);
      }
    }
    setRecords(fetchedRecords);
  };

  const calculateVirtueProgress = (virtueId) => {
    return records.map(record => {
      const virtueStatuses = Object.values(record.days).map(day => day.virtues[virtueId].status);
      const successCount = virtueStatuses.filter(status => status === 1).length;
      return (successCount / 7) * 100;
    });
  };

  const chartData = useMemo(() => {
    return {
      labels: Array.from({ length: endWeek - startWeek + 1 }, (_, i) => `Semana ${startWeek + i}`),
      datasets: allVirtues.map(virtue => ({
        label: virtue.name,
        data: calculateVirtueProgress(virtue.id),
        backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`,
      })),
    };
  }, [records, startWeek, endWeek]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Progreso de Virtudes por Semana',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Porcentaje de Éxito',
        },
      },
    },
  };

  const handleWeekChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startWeek') {
      setStartWeek(parseInt(value));
    } else {
      setEndWeek(parseInt(value));
    }
  };

  return (
    <div className="progress-chart-container">
      <h2>Gráfico de Progreso</h2>
      <div className="chart-controls">
        <div>
          <label htmlFor="startWeek">Semana Inicial:</label>
          <input
            type="number"
            id="startWeek"
            name="startWeek"
            min="1"
            max="52"
            value={startWeek}
            onChange={handleWeekChange}
          />
        </div>
        <div>
          <label htmlFor="endWeek">Semana Final:</label>
          <input
            type="number"
            id="endWeek"
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