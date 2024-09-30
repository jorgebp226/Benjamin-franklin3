// src/App.js
import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'; // Estilos por defecto para el componente Authenticator
import Calendar from './components/Calendar';
import ProgressChart from './components/ProgressChart';
import Visualization from './components/Visualization';
import './App.css';

const App = () => {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="app-container">
          <h1>Seguimiento de Virtudes</h1>
          <p>Bienvenido, {user.username}</p>
          <button onClick={signOut}>Cerrar sesión</button>
          <Calendar />
          <ProgressChart />
          <Visualization />
        </div>
      )}
    </Authenticator>
  );
};

export default App;
