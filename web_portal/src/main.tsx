import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { SuiProvider } from './config/SuiProvider'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SuiProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </SuiProvider>
  </React.StrictMode>,
)