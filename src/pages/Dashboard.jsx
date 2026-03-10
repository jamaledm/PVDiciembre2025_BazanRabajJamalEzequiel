import { useState, useEffect } from "react";
import { useTurnos } from "../hooks/useTurnos";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf"; // Importamos la librería para el PDF
import "../styles/dashboard.css"; // Estilos específicos para el panel

export default function Dashboard() {
  // Extraigo todo lo necesario del Contexto (Agregamos cancelarTurno)
  const { currentUser, logout, users, agendarTurno, turnos, getHorariosOcupados, cancelarTurno } = useTurnos();
  const navigate = useNavigate();

  // Estados locales para la interacción del usuario
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [horasOcupadas, setHorasOcupadas] = useState([]); // Array para guardar qué horas bloquear
  
  // feedback de turno agendado
  const [turnoConfirmado, setTurnoConfirmado] = useState(null);
  const [turnoCancelado, setTurnoCancelado] = useState(null);  // Estado para turno cancelado
  const [error, setError] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);  // Modal de confirmación
  const [turnoAborrar, setTurnoAborrar] = useState(null);  // Datos del turno a cancelar

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

  // Función para cancelar turno con confirmación personalizada
  const handleCancelTurno = (turnoId, nombreMedico, hora) => {
    setTurnoAborrar({ id: turnoId, medico: nombreMedico, hora: hora });
    setShowConfirmDialog(true);  // Mostrar modal
  };

  // Confirmar la cancelación
  const confirmCancellation = () => {
    if (turnoAborrar) {
      cancelarTurno(turnoAborrar.id);
      setTurnoCancelado({ medico: turnoAborrar.medico, hora: turnoAborrar.hora });
      setTimeout(() => setTurnoCancelado(null), 3000);
    }
    setShowConfirmDialog(false);
    setTurnoAborrar(null);
  };

  // Cancelar la confirmación (cerrar modal)
  const cancelConfirmation = () => {
    setShowConfirmDialog(false);
    setTurnoAborrar(null);
  };

  // Función para generar y descargar el PDF
  const generarPDF = (datosTurno) => {
    const doc = new jsPDF();
    
    // Encabezado
    doc.setFontSize(22);
    doc.setTextColor(0, 86, 179); // Azul Hospital
    doc.text("HOSPITAL CURTIDOR", 20, 20);
    
    // Subtitulo
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Comprobante de Turno Médico", 20, 35);
    
    // --- DATOS COMPLETOS PACIENTE ---
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Datos del Paciente:", 20, 50);
    doc.setTextColor(0);
    doc.text(`Nombre: ${datosTurno.paciente}`, 20, 60);
    doc.text(`DNI: ${datosTurno.pacienteDni || "No especificado"}`, 20, 70);
    doc.text(`Teléfono: ${datosTurno.pacienteTel || "No especificado"}`, 20, 80);
    doc.text(`Email: ${datosTurno.pacienteEmail || "No especificado"}`, 20, 90);

    // --- DATOS COMPLETOS MÉDICO ---
    doc.setTextColor(100);
    doc.text("Datos del Profesional:", 20, 110);
    doc.setTextColor(0);
    doc.text(`Médico: ${datosTurno.medico}`, 20, 120);
    doc.text(`DNI: ${datosTurno.medicoDni || "No especificado"}`, 20, 130);
    doc.text(`Teléfono: ${datosTurno.medicoTel || "No especificado"}`, 20, 140);
    doc.text(`Email: ${datosTurno.medicoEmail || "No especificado"}`, 20, 150);
    
    // --- DATOS DEL TURNO ---
    doc.setDrawColor(0);
    doc.line(20, 160, 190, 160); // Línea separadora
    doc.text(`Fecha: ${datosTurno.fecha}`, 20, 175);
    doc.text(`Hora: ${datosTurno.hora}`, 100, 175);
    doc.setTextColor(150);
    doc.text(`ID Turno: ${datosTurno.id}`, 20, 190);
    
    // Pie de página
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Por favor, preséntese 10 minutos antes.", 20, 210);
    
    doc.save(`Turno_${datosTurno.paciente}_${datosTurno.id}.pdf`);
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
      // --- Guardamos todos los datos del paciente ---
      paciente: currentUser.name,
      pacienteDni: currentUser.dni,
      pacienteTel: currentUser.phone,
      pacienteEmail: currentUser.email,
      
      // --- Guardamos todos los datos del médico ---
      medico: medicoData.name,
      medicoDni: medicoData.dni,
      medicoTel: medicoData.phone,
      medicoEmail: medicoData.email,
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
        {/* Flecha en el botón de salir */}
        <button className="logout-btn" onClick={handleLogout}>&#8592; Salir</button>
      </header>

      {/* Mensaje de error general si ocurre alguno */}
      {error && <div className="error-msg">{error}</div>}

      {/* Modal personalizado de confirmación */}
      {showConfirmDialog && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: "999"
        }}>
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            maxWidth: "400px",
            textAlign: "center"
          }}>
            <h3 style={{ color: "#333", marginBottom: "10px" }}>Confirmar Cancelación</h3>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              ¿Estas seguro de que quieres cancelar el turno con <strong>{turnoAborrar?.medico}</strong> a las <strong>{turnoAborrar?.hora}</strong>?
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={confirmCancellation}
                style={{
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "1rem"
                }}
              >
                Sí, Cancelar
              </button>
              <button
                onClick={cancelConfirmation}
                style={{
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "1rem"
                }}
              >
                No, Volver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje flotante de cancelación exitosa */}
      {turnoCancelado && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          background: "#fff3cd",
          border: "1px solid #ffc107",
          color: "#856404",
          padding: "15px",
          borderRadius: "5px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          zIndex: "1000"
        }}>
          <strong>✓ Turno Cancelado</strong><br />
          Has cancelado el turno con {turnoCancelado.medico} a las {turnoCancelado.hora}
        </div>
      )}

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

          {/* Sección para ver y cancelar turnos existentes */}
          <div style={{ marginTop: "40px", borderTop: "2px solid #eee", paddingTop: "20px" }}>
            <h3>Mis Turnos Agendados</h3>
            {turnos.filter(t => t.paciente === currentUser.name).length === 0 ? (
                <p>No tienes turnos pendientes.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {turnos.filter(t => t.paciente === currentUser.name).map(t => (
                        <li key={t.id} style={{ background: "#f9f9f9", margin: "10px 0", padding: "10px", borderRadius: "5px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span><strong>{t.medico}</strong> - {t.hora}</span>
                            <div>
                                {/* Botón Descargar PDF */}
                                <button 
                                    onClick={() => generarPDF(t)}
                                    style={{ marginRight: "10px", background: "#28a745", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}
                                >
                                    PDF
                                </button>
                                {/* Botón Cancelar */}
                                <button 
                                    onClick={() => handleCancelTurno(t.id, t.medico, t.hora)}
                                    style={{ background: "#dc3545", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
          </div>
        </div>
      )}

      {/* --- VISTA DE CONFIRMACIÓN --- */}
      {turnoConfirmado && (
        <div className="confirm-card">
          <h2 style={{color: 'green'}}>¡Turno Exitoso!</h2>
          <p><strong>Médico:</strong> {turnoConfirmado.medico}</p>
          <p><strong>Fecha:</strong> {turnoConfirmado.fecha}</p>
          <p><strong>Hora:</strong> {turnoConfirmado.hora}</p>
          
          {/* Botón para imprimir PDF desde la confirmación */}
          <button 
            className="btn-primary" 
            style={{ marginBottom: "10px", background: "#28a745" }}
            onClick={() => generarPDF(turnoConfirmado)}
          >
            Descargar Comprobante (PDF)
          </button>

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

      {/* Botón Flotante de WhatsApp */}
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