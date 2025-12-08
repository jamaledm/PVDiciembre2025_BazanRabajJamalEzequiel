import { useState } from "react";
import { useTurnos } from "../hooks/useTurnos";
import { useNavigate } from "react-router-dom";
import "../styles/global.css"; // Importamos los estilos para que se vea bien

export default function Register() {
  // Estado del formulario
  //  dni y phone al estado inicial
  const [form, setForm] = useState({ name: "", dni: "", phone: "", email: "", password: "", role: "paciente" });
  // Estado para manejar el mensaje de error visual
  const [error, setError] = useState(null);
  
  const { registerUser } = useTurnos();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null); // Limpiamos errores previos al intentar enviar

    // Verificar campos vacíos
    // Validación de !form.dni porque es obligatorio
    if (!form.name || !form.dni || !form.email || !form.password) {
      setError("⚠️ Nombre, DNI, Correo y Contraseña son obligatorios.");
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
    //  style position relative para ubicar la flecha
    <div className="auth-container" style={{ position: "relative" }}>
      
      {/*Flecha para volver al Login --- */}
      <button 
        onClick={() => navigate("/")}
        style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            background: "transparent",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "#007bff",
            fontWeight: "bold",
            lineHeight: "1"
        }}
        title="Volver al inicio"
      >
        &#8592;
      </button>

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

        {/* --- NUEVOS CAMPOS dea dou --- */}
        {/* Tipo texto para evitar flechas, pero valida solo números */}
        <input 
          className="form-input"
          type="text" 
          placeholder="Documento (DNI)" 
          value={form.dni} 
          onChange={(e) => {
            const val = e.target.value;
            // Solo permite escribir si son números
            if (/^\d*$/.test(val)) {
                setForm({...form, dni: val});
            }
          }}
        />
        <input 
          className="form-input"
          type="tel" 
          placeholder="Teléfono (Opcional)" 
          value={form.phone} 
          onChange={(e) => setForm({...form, phone: e.target.value})}
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

      {/* --- BOTÓN WHATSAPP AGREGADO --- */}
      <a 
        href="https://wa.me/543884600177" 
        className="whatsapp-float" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        📞
      </a>
    </div>
  );
}