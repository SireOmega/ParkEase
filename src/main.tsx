import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ParkEaseProvider } from './context/ParkEaseContext';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ParkEaseProvider>
      <App />
    </ParkEaseProvider>
  </React.StrictMode>,
);
