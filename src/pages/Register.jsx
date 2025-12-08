import { useState } from "react";
import { useTurnos } from "../hooks/useTurnos";
import { useNavigate } from "react-router-dom";
import "../styles/global.css"; // Importamos los estilos para que se vea bien

export default function Register() {
  // Estado del formulario
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "paciente" });
  // Estado para manejar el mensaje de error visual
  const [error, setError] = useState(null);
  
  const { registerUser } = useTurnos();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null); // Limpiamos errores previos al intentar enviar

    // Verificar campos vacíos
    if (!form.name || !form.email || !form.password) {
      setError("⚠️ Todos los campos son obligatorios.");
      return;
    }

    // Verificar formato de email
    if (!form.email.includes("@")) {
      setError("⚠️ El correo debe incluir un '@'.");
      return;
    }

    // Guardo el usuario con un ID único
    const newUser = { ...form, id: Date.now() };
    const res = registerUser(newUser);
    
    if (res.success) {
      // Mensaje de éxito (aquí el alert está bien para confirmar antes de cambiar de pag)
      alert("¡Registro exitoso! Ahora inicia sesión.");
      navigate("/");
    } else {
      // Si falla (ej: correo repetido), mostramos la caja roja
      setError(res.message);
    }
  };

  return (
    // Usamos la clase 'auth-container' para el diseño de tarjeta blanca
    <div className="auth-container">
      <h2>Registro</h2>

      {/* Caja de error visual si existe un mensaje */}
      {error && <div className="error-msg">{error}</div>}

      {/* 'noValidate' desactiva los mensajes grises del navegador */}
      <form onSubmit={handleSubmit} noValidate>
        <input 
          className="form-input"
          type="text" 
          placeholder="Nombre Completo" 
          value={form.name} 
          onChange={(e) => setForm({...form, name: e.target.value})}
        />
        <input 
          className="form-input"
          type="email" 
          placeholder="Correo" 
          value={form.email} 
          onChange={(e) => setForm({...form, email: e.target.value})}
        />
        <input 
          className="form-input"
          type="password" 
          placeholder="Contraseña" 
          value={form.password} 
          onChange={(e) => setForm({...form, password: e.target.value})}
        />
        
        <label style={{ display: "block", textAlign: "left", margin: "10px 0" }}>
          Tipo de Usuario:
        </label>
        <select 
          className="form-input"
          value={form.role} 
          onChange={(e) => setForm({...form, role: e.target.value})}
        >
          <option value="paciente">Paciente</option>
          <option value="medico">Médico</option>
        </select>
        
        <button className="btn-primary" type="submit">Registrarse</button>
      </form>
    </div>
  );
}