import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { TurnosProvider } from './context/TurnosContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <TurnosProvider>
        <App />
      </TurnosProvider>
    </BrowserRouter>
  </React.StrictMode>,
)