import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import TelegramApp from './components/TelegramApp';
import AdminPanel from './pages/AdminPanel';
import { ApplicationProvider } from './contexts/ApplicationContext';
import './App.css';

function App() {
  // Check if running in admin mode
  const isAdmin = window.location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <ApplicationProvider>
        <div className="App">
          <Routes>
            <Route path="/admin/*" element={<AdminPanel />} />
          </Routes>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </ApplicationProvider>
    );
  }

  return (
    <ApplicationProvider>
      <div className="App telegram-app">
        <TelegramApp />
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--tg-theme-button-color, #2196F3)',
              color: 'var(--tg-theme-button-text-color, #fff)',
              borderRadius: '12px',
              fontSize: '14px',
              maxWidth: '90vw',
            },
            success: {
              iconTheme: {
                primary: '#fff',
                secondary: 'var(--tg-theme-button-color, #2196F3)',
              },
            },
            error: {
              style: {
                background: '#f44336',
                color: '#fff',
              },
            },
          }}
        />
      </div>
    </ApplicationProvider>
  );
}

export default App;
