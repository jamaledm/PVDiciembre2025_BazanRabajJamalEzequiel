import { useState } from "react";
import { useTurnos } from "../hooks/useTurnos"; // Importo mi hook personalizado
import { useNavigate, Link } from "react-router-dom";
import "../styles/global.css"; // Importo los estilos generales

export default function Login() {
  // Estados locales para el formulario y manejo de errores
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // Estado para mostrar la cajita roja de error
  
  const { loginUser } = useTurnos(); // Extraemos la función del contexto
  const navigate = useNavigate(); // Hook para redireccionar

  // Manejar el envío del formulario.
  // Previene la recarga, limpia errores previos y llama a loginUser.
  const handleLogin = (e) => {
    e.preventDefault();
    setError(null); 

    const res = loginUser(email, password);
    
    // Si la respuesta es exitosa (success: true), redirige al Dashboard.
    if (res.success) {
      navigate("/dashboard");
    } else {
      // Si falla, guardamos el mensaje para mostrarlo en el HTML.
      setError(res.message);
    }
  };

  return (
    // Uso la clase 'auth-container' definida en global.css para dar estilo de tarjeta
    <div className="auth-container">
      <h2>Iniciar Sesión</h2>
      
      {/* Renderizado condicional: Solo muestra el div de error si 'error' tiene texto */}
      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleLogin}>
        <input 
          className="form-input"
          type="email" 
          placeholder="Correo" 
          required 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          className="form-input"
          type="password" 
          placeholder="Contraseña" 
          required 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button className="btn-primary" type="submit">Ingresar</button>
      </form>
      
      <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
    </div>
  );
}