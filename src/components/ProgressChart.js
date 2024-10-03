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
  const [selectedVirtues, setSelectedVirtues] = useState(allVirtues.map(v => v.id));
  const [startWeek, setStartWeek] = useState(1);
  const [endWeek, setEndWeek] = useState(13);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, [startWeek, endWeek]);

  const fetchRecords = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentYear = new Date().getFullYear();
      const userId = 'currentUserId'; // Asume que tienes acceso al ID del usuario actual
      let allRecords = [];

      for (let week = startWeek; week <= endWeek; week++) {
        const weekId = `${currentYear}-W${week.toString().padStart(2, '0')}`;
        const weekRecords = await getVirtueRecordsForWeek(userId, weekId);
        if (Array.isArray(weekRecords)) {
          allRecords = [...allRecords, ...weekRecords];
        } else {
          console.error('Unexpected data structure for week', week, weekRecords);
        }
      }

      setRecords(allRecords);
    } catch (err) {
      console.error('Error fetching records:', err);
      setError('Failed to fetch records. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVirtueSelection = (virtueId) => {
    setSelectedVirtues(prev => 
      prev.includes(virtueId) ? prev.filter(id => id !== virtueId) : [...prev, virtueId]
    );
  };

  const handleWeekChange = (e) => {
    const { name, value } = e.target;
    const numValue = Number(value);
    if (name === 'startWeek') {
      setStartWeek(numValue > endWeek ? endWeek : numValue);
    } else if (name === 'endWeek') {
      setEndWeek(numValue < startWeek ? startWeek : numValue);
    }
  };

  const calculateWeeklySuccess = useMemo(() => {
    return (virtueId, weekNumber) => {
      const weekRecord = records.find(record => record.virtueID === virtueId && record.weekNumber === weekNumber);
      if (!weekRecord) return 0;
      const successCount = weekRecord.weekStatus.filter(status => status === 1).length;
      return (successCount / 7) * 100;
    };
  }, [records]);

  const chartData = useMemo(() => ({
    labels: Array.from({ length: endWeek - startWeek + 1 }, (_, i) => `Semana ${startWeek + i}`),
    datasets: selectedVirtues.map((virtueId) => {
      const virtue = allVirtues.find(v => v.id === virtueId);
      const dataPoints = Array.from({ length: endWeek - startWeek + 1 }, (_, i) => {
        return calculateWeeklySuccess(virtueId, startWeek + i);
      });

      return {
        label: virtue ? virtue.name : 'Unknown Virtue',
        data: dataPoints,
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
      };
    }),
  }), [selectedVirtues, startWeek, endWeek, calculateWeeklySuccess]);

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

  if (isLoading) return <div>Cargando datos...</div>;
  if (error) return <div>Error: {error}</div>;

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