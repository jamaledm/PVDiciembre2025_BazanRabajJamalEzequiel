import { useState } from "react";
import { useTurnos } from "../hooks/useTurnos";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "paciente" });
  const { registerUser } = useTurnos();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Guardo el usuario con un ID único
    const newUser = { ...form, id: Date.now() };
    const res = registerUser(newUser);
    
    if (res.success) {
      alert("Registro exitoso. Ahora inicia sesión.");
      navigate("/");
    } else {
      alert(res.message);
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", maxWidth: "400px", margin: "auto" }}>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" placeholder="Nombre Completo" required 
          value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
        />
        <input 
          type="email" placeholder="Correo" required 
          value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
        />
        <input 
          type="password" placeholder="Contraseña" required 
          value={form.password} onChange={(e) => setForm({...form, password: e.target.value})}
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
        />
        <label>Tipo de Usuario:</label>
        <select 
          value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
        >
          <option value="paciente">Paciente</option>
          <option value="medico">Médico</option>
        </select>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}