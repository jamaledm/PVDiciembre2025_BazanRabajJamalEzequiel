import React from 'react'
import ReactDOM from 'react-dom/client' 
//importo librerias que sirven para crear componentes
//y gestionar mis hooks, y 
// para renderizar mi app en el DOM (mostrar la pagina)
import App from './App.jsx'
import './index.css'
//importo mi componente principal, y el css global de mi app para que 
//se apliquen los estilos a toda la app y para que se apliquen a los
// componentes hijos
import { BrowserRouter } from 'react-router-dom'
//importo el BrowserRouter para gestionar las rutas de mi app, 
//y poder navegar entre las diferentes paginas
import { TurnosProvider } from './context/TurnosContext'
//importo el TurnosProvider para envolver mi app y proporcionar el contexto 
//de turnos a todos los componentes hijos,

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <TurnosProvider>
        <App />
      </TurnosProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
//renderizo mi app en el DOM, envolviendo mi componente principal App con el 
//BrowserRouter y el TurnosProvider para que toda la app tenga acceso a las 
//rutas y al contexto de turnos.