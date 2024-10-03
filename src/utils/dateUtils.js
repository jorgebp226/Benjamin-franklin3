// src/utils/dateUtils.js
export const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = Math.floor((date - firstDayOfYear) / 86400000);
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };
  
  // Obtener la fecha de inicio (lunes) de la semana actual
  export const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajuste para lunes como primer día
    return new Date(d.setDate(diff));
  };
