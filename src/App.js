// src/App.js
import React from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports'; // Configuración de AWS Amplify
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'; // Estilos por defecto para el componente Authenticator
import Calendar from './components/Calendar';
import ProgressChart from './components/ProgressChart';
import Visualization from './components/Visualization';
import './App.css';

// Configurar AWS Amplify con el archivo aws-exports.js
Amplify.configure(awsExports);

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
