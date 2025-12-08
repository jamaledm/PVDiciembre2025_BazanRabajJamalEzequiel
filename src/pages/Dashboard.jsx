import { useState, useEffect } from "react";
import { useTurnos } from "../hooks/useTurnos";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css"; // Estilos específicos para el panel

export default function Dashboard() {
  // Extraigo todo lo necesario del Contexto
  const { currentUser, logout, users, agendarTurno, turnos, getHorariosOcupados } = useTurnos();
  const navigate = useNavigate();

  // Estados locales para la interacción del usuario
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [horasOcupadas, setHorasOcupadas] = useState([]); // Array para guardar qué horas bloquear
  
  // feedback de turno agendado
  const [turnoConfirmado, setTurnoConfirmado] = useState(null);
  const [error, setError] = useState(null);

  // Filtramos usuarios para obtener solo los médicos y mostrar en el select
  const medicos = users.filter((u) => u.role === "medico");
  const horarios = ["09:00", "10:00", "11:00", "12:00", "13:00"]; // Horarios fijos

  // Actualizar disponibilidad cuando se elige médico.
  // useEffect escucha cambios en 'selectedDoctorId'. Si cambia, llama a getHorariosOcupados
  // y actualiza el estado 'horasOcupadas'. También resetea la hora seleccionada anteriormente.
  useEffect(() => {
    if (selectedDoctorId) {
      const ocupadas = getHorariosOcupados(parseInt(selectedDoctorId));
      setHorasOcupadas(ocupadas);
      setSelectedTime(""); 
      setError(null);
    }
  }, [selectedDoctorId, turnos]); // Se ejecuta si cambia el médico O si alguien toma un turno nuevo

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Procesar la reserva del turno.
  const handleAgendar = () => {
    // Validaciones básicas
    if (!selectedDoctorId || !selectedTime) {
      setError("Debes seleccionar médico y hora.");
      return;
    }

    // Busco el objeto médico completo usando el ID
    const medicoData = users.find(u => u.id === parseInt(selectedDoctorId));

    const nuevoTurno = {
      id: Date.now(),
      paciente: currentUser.name,
      medico: medicoData.name,
      medicoId: medicoData.id, // Guardamos ID para facilitar validaciones futuras
      fecha: "MAÑANA",
      hora: selectedTime,
    };

    // Intentamos agendar en el contexto
    const res = agendarTurno(nuevoTurno);

    if (res.success) {
      setTurnoConfirmado(nuevoTurno); // Mostramos tarjeta de éxito
      setError(null);
    } else {
      setError(res.message); // Mostrar error si alguien ganó el turno
      // Recargamos las horas ocupadas por si acaso
      setHorasOcupadas(getHorariosOcupados(parseInt(selectedDoctorId)));
    }
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>Hola, {currentUser?.name}</h1>
        <button className="logout-btn" onClick={handleLogout}>Salir</button>
      </header>

      {/* Mensaje de error general si ocurre alguno */}
      {error && <div className="error-msg">{error}</div>}

      {/* --- VISTA PARA PACIENTES --- */}
      {currentUser?.role === "paciente" && !turnoConfirmado && (
        <div>
          <h3>Solicitar Turno</h3>
          
          <label>Selecciona Profesional:</label>
          <select 
            className="form-input" 
            onChange={(e) => setSelectedDoctorId(e.target.value)}
          >
            <option value="">-- Seleccionar --</option>
            {medicos.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>

          {/* Solo muetra los horarios si ya eligió médico */}
          {selectedDoctorId && (
            <>
              <p>Horarios Disponibles para mañana:</p>
              <div className="time-grid">
                {horarios.map((hora) => {
                  // Verifico si esta hora específica está en el array de ocupadas
                  const isTaken = horasOcupadas.includes(hora); 
                  
                  return (
                    <button 
                      key={hora} 
                      disabled={isTaken} // Deshabilita el click HTML
                      onClick={() => !isTaken && setSelectedTime(hora)}
                      // Si está ocupado añade 'disabled', si está seleccionado añade 'selected'
                      className={`time-btn ${selectedTime === hora ? 'selected' : ''} ${isTaken ? 'disabled' : ''}`}
                    >
                      {hora} {isTaken ? '(Ocupado)' : ''}
                    </button>
                  )
                })}
              </div>

              <button className="btn-primary" onClick={handleAgendar} style={{marginTop: '20px'}}>
                Confirmar Reserva
              </button>
            </>
          )}
        </div>
      )}

      {/* --- VISTA DE CONFIRMACIÓN (Resumen) --- */}
      {turnoConfirmado && (
        <div className="confirm-card">
          <h2 style={{color: 'green'}}>¡Turno Exitoso!</h2>
          <p><strong>Médico:</strong> {turnoConfirmado.medico}</p>
          <p><strong>Fecha:</strong> {turnoConfirmado.fecha}</p>
          <p><strong>Hora:</strong> {turnoConfirmado.hora}</p>
          <button className="btn-primary" onClick={() => setTurnoConfirmado(null)}>
            Volver al inicio
          </button>
        </div>
      )}
      
      {/* --- VISTA PARA MÉDICOS --- */}
      {currentUser?.role === "medico" && (
        <div>
            <h3>Mis Turnos Asignados</h3>
             {turnos.filter(t => t.medicoId === currentUser.id).length === 0 ? (
               <p>No tienes pacientes agendados aún.</p>
             ) : (
               <ul>
                 {/* Filtramos los turnos globales para ver solo los de este médico */}
                 {turnos
                   .filter(t => t.medicoId === currentUser.id)
                   .map(t => (
                     <li key={t.id}>
                       <strong>{t.hora}:</strong> Paciente {t.paciente}
                     </li>
                   ))
                 }
               </ul>
             )}
        </div>
      )}
    </div>
  );
}