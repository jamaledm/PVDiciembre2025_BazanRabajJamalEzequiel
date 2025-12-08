import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css"; 

export default function NotFound() {
  const [contador, setContador] = useState(10); // Empezamos en 10
  const navigate = useNavigate();

  useEffect(() => {
    // Creamos el intervalo que resta 1 cada segundo
    const intervalo = setInterval(() => {
      setContador((prev) => prev - 1);
    }, 1000);

    // Si llega a 0, redirigimos
    if (contador === 0) {
      navigate("/");
    }

    // Limpieza: importante limpiar el intervalo al desmontar
    return () => clearInterval(intervalo);
  }, [contador, navigate]);

  return (
    <div className="auth-container">
      <h1 style={{ fontSize: "4rem", margin: 0, color: "#dc3545" }}>404</h1>
      <h3>Esta página no existe</h3>
      <p>Serás redirigido al inicio en:</p>
      <h2 style={{ fontSize: "2rem" }}>{contador} segundos</h2>
      
      <button className="btn-primary" onClick={() => navigate("/")}>
        Ir al inicio ahora
      </button>
    </div>
  );
}