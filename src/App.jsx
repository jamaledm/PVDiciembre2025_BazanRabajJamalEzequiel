import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound"; // Importo la página 404
import { useTurnos } from "./hooks/useTurnos";

// Bloquear el acceso a usuarios no logueados.
// Recibe un componente "hijo" (Dashboard). Verifica si 'currentUser' existe en el contexto.
// Si existe, muestra el hijo. Si no, redirige (<Navigate>) al Login ("/").
const PrivateRoute = ({ children }) => {
  const { currentUser } = useTurnos();
  return currentUser ? children : <Navigate to="/" />;
};

function App() {
  return (
    // Aquí definimos el mapa de la aplicación.
    <Routes>
      
      {/* Ruta Pública: Login (Página de inicio) */}
      <Route path="/" element={<Login />} />
      
      {/* Ruta Pública: Registro */}
      <Route path="/register" element={<Register />} />
      
      {/* Ruta Privada: Panel Principal */}
      {/* Envolve Dashboard dentro de PrivateRoute para activar la protección */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />

      {/* --- RUTA COMODÍN (404 NOT FOUND) --- */}
      {/* FUNCIONALIDAD: Capturar URLs inexistentes. */}
      {/* CÓMO: El path="*" actúa como un "catch-all". Si la URL no coincide con ninguna
          de las anteriores, React Router renderiza el componente NotFound. */}
      <Route path="*" element={<NotFound />} />
      
    </Routes>
  );
}

export default App;