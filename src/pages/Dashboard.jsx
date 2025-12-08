import { useState } from "react";
import { useTurnos } from "../hooks/useTurnos";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { currentUser, logout, users, agendarTurno, turnos } = useTurnos();
  const navigate = useNavigate();

  // Estados locales para la selección
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [turnoConfirmado, setTurnoConfirmado] = useState(null);

  // Filtrar solo los usuarios que son médicos
  const medicos = users.filter((u) => u.role === "medico");

  // Horarios fijos para "MAÑANA" (Simulacro)
  const horarios = ["09:00", "10:00", "11:00", "12:00", "13:00"];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAgendar = () => {
    if (!selectedDoctor || !selectedTime) return alert("Selecciona médico y hora");

    // Buscamos los datos completos del médico seleccionado
    const medicoData = users.find(u => u.id === parseInt(selectedDoctor));

    const nuevoTurno = {
      id: Date.now(),
      paciente: currentUser.name,
      medico: medicoData.name,
      fecha: "MAÑANA (Único día disponible)",
      hora: selectedTime,
    };

    agendarTurno(nuevoTurno);
    setTurnoConfirmado(nuevoTurno); // Mostrar confirmación
  };

  return (
    <div style={{ padding: "20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1>Bienvenido, {currentUser?.name} ({currentUser?.role})</h1>
        <button onClick={handleLogout} style={{ background: "red", color: "white" }}>Cerrar Sesión</button>
      </header>

      {/* VISTA PACIENTE */}
      {currentUser?.role === "paciente" && !turnoConfirmado && (
        <div>
          <h3>Solicitar Turno para Mañana</h3>
          
          <label>1. Selecciona un Médico:</label>
          <select onChange={(e) => setSelectedDoctor(e.target.value)} style={{ margin: "10px" }}>
            <option value="">-- Seleccionar --</option>
            {medicos.length > 0 ? (
              medicos.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)
            ) : (
              <option disabled>No hay médicos registrados</option>
            )}
          </select>

          {selectedDoctor && (
            <>
              <label>2. Horarios disponibles (Mañana):</label>
              <div style={{ display: "flex", gap: "10px", margin: "10px 0" }}>
                {horarios.map((hora) => (
                  <button 
                    key={hora} 
                    onClick={() => setSelectedTime(hora)}
                    style={{ background: selectedTime === hora ? "blue" : "#eee", color: selectedTime === hora ? "white" : "black" }}
                  >
                    {hora}
                  </button>
                ))}
              </div>

              <button onClick={handleAgendar} style={{ marginTop: "20px", padding: "10px 20px" }}>
                Confirmar Turno
              </button>
            </>
          )}
        </div>
      )}

      {/* VISTA CONFIRMACIÓN (Impresión de datos) */}
      {turnoConfirmado && (
        <div style={{ border: "2px solid green", padding: "20px", marginTop: "20px" }}>
          <h2 style={{ color: "green" }}>¡Turno Confirmado!</h2>
          <p><strong>Paciente:</strong> {turnoConfirmado.paciente}</p>
          <p><strong>Médico:</strong> {turnoConfirmado.medico}</p>
          <p><strong>Día:</strong> {turnoConfirmado.fecha}</p>
          <p><strong>Hora:</strong> {turnoConfirmado.hora}</p>
          <button onClick={() => setTurnoConfirmado(null)}>Volver</button>
        </div>
      )}

      {/* VISTA MEDICO (Extra simple para que vean que funciona) */}
      {currentUser?.role === "medico" && (
        <div>
          <h3>Mis Turnos Asignados</h3>
          <ul>
            {turnos.filter(t => t.medico === currentUser.name).map(t => (
              <li key={t.id}>Paciente: {t.paciente} - Hora: {t.hora}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}