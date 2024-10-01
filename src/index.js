import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Amplify } from 'aws-amplify';
import config from './aws-exports'; // Asegúrate de que la ruta es correcta
//import { API, graphqlOperation } from 'aws-amplify';


Amplify.configure(config);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);