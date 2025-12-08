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

    // Validar si los campos están vacíos
    if (!email || !password) {
        setError("⚠️ Por favor, completa todos los campos.");
        return; // Detiene la función aquí si hay error
    }

    // 2. Validar el formato del email (el famoso @)
    if (!email.includes("@")) {
        setError("⚠️ El correo debe contener un '@'.");
        return; 
    }

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
    <>
      {/* Título del Hospital Agregado */}
      <h1 className="hospital-branding">HOSPITAL CURTIDOR</h1>

      {/* Uso la clase 'auth-container' definida en global.css para dar estilo de tarjeta */}
      <div className="auth-container">
        <h2>Iniciar Sesión</h2>
        
        {/* Renderizado condicional: Solo muestra el div de error si 'error' tiene texto */}
        {error && <div className="error-msg">{error}</div>}

        {/* AGREGADO: 'noValidate' para que el navegador no saque sus propios avisos */}
        <form onSubmit={handleLogin} noValidate>
          <input 
            className="form-input"
            type="email" 
            placeholder="Correo" 
            // Quitamos 'required' porque ahora validamos arriba
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            className="form-input"
            type="password" 
            placeholder="Contraseña" 
            // Quitamos 'required'
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button className="btn-primary" type="submit">Ingresar</button>
        </form>
        
        <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
      </div>

      {/* Botón Flotante de WhatsApp --- */}
      <a 
        href="https://wa.me/543884600177" 
        className="whatsapp-float" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        📞
      </a>
    </>
  );
}