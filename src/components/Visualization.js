// src/components/Visualization.js
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { virtues as allVirtues } from '../utils/virtues';
import { getVirtuesWithRecords } from '../api';
import './Visualization.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Visualization = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Últimos 30 días
    const startDateString = startDate.toISOString().split('T')[0];
    const endDate = new Date();
    const endDateString = endDate.toISOString().split('T')[0];
    const data = await getVirtuesWithRecords(startDateString, endDateString);
    setRecords(data);
  };

  const calculateStatistics = () => {
    const stats = {};
    allVirtues.forEach((virtue) => {
      stats[virtue.name] = { success: 0, error: 0 };
    });

    records.forEach((record) => {
      const virtueName = allVirtues.find(v => v.id === record.virtueID)?.name;
      if (virtueName) {
        if (record.status === 1) {
          stats[virtueName].success += 1;
        } else if (record.status === -1) {
          stats[virtueName].error += 1;
        }
      }
    });

    // Convertir a porcentajes
    Object.keys(stats).forEach((virtueName) => {
      const total = stats[virtueName].success + stats[virtueName].error;
      if (total > 0) {
        stats[virtueName].success = ((stats[virtueName].success / total) * 100).toFixed(2);
        stats[virtueName].error = ((stats[virtueName].error / total) * 100).toFixed(2);
      } else {
        stats[virtueName].success = 0;
        stats[virtueName].error = 0;
      }
    });

    return stats;
  };

  const stats = calculateStatistics();

  const data = {
    labels: allVirtues.map((v) => v.name),
    datasets: [
      {
        label: 'Cumplido (%)',
        data: allVirtues.map((v) => stats[v.name]?.success || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Errores (%)',
        data: allVirtues.map((v) => stats[v.name]?.error || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Progreso de Virtudes (Últimos 30 días)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Porcentaje (%)',
        },
      },
    },
  };

  return (
    <div className="visualization-container">
      <h2>Visualización de Progreso</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Visualization;
