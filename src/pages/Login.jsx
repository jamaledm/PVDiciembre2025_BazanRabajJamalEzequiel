import { useState } from "react";
import { useTurnos } from "../hooks/useTurnos"; // Uso mi hook
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useTurnos(); // Saco la función del contexto
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const res = loginUser(email, password);
    if (res.success) {
      navigate("/dashboard"); // Si es correcto, ir al panel
    } else {
      alert(res.message);
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", maxWidth: "400px", margin: "auto" }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="email" placeholder="Correo" required 
          value={email} onChange={(e) => setEmail(e.target.value)} 
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
        />
        <input 
          type="password" placeholder="Contraseña" required 
          value={password} onChange={(e) => setPassword(e.target.value)} 
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
        />
        <button type="submit">Ingresar</button>
      </form>
      <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
    </div>
  );
}