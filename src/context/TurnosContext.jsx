import { createContext, useState, useEffect } from "react";
// Creamos el contexto que permitirá compartir datos entre componentes
export const TurnosContext = createContext();
export const TurnosProvider = ({ children }) => {
  //Mantener los datos persistentes aunque se recargue la página.
  //Usamos una función dentro de useState para leer el localStorage solo al iniciar.
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("users");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [turnos, setTurnos] = useState(() => {
    const saved = localStorage.getItem("turnos");
    return saved ? JSON.parse(saved) : [];
  });
  //Guardar automáticamente cualquier cambio en los estados hacia el navegador.
  //useEffect detecta cambios en [users], [currentUser] o [turnos] y escribe en localStorage.
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);
  useEffect(() => {
    localStorage.setItem("turnos", JSON.stringify(turnos));
  }, [turnos]);
  //Registro de nuevos usuarios.
  //Verifica si el email ya existe en el array. Si no, agrega el usuario al estado.
  const registerUser = (user) => {
    const existe = users.find((u) => u.email === user.email);
    if (existe) {
      return { success: false, message: "⚠️ El correo ya está registrado." };
    }
    setUsers([...users, user]); // Spread operator para agregar al array existente
    return { success: true };
  };

  //Iniciar sesión.
  //Busca coincidencias exactas de email y password. Si encuentra, setea currentUser.
  const loginUser = (email, password) => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return { success: true };
    }
    return { success: false, message: "❌ Credenciales incorrectas." };
  };
  // Cerrar sesión.
  // Devuelve el estado de currentUser a null.
  const logout = () => setCurrentUser(null);
  // Agendar un turno verificando conflictos.
  // Usa .some() para ver si ya existe un turno con el mismo medicoId y la misma hora.
  const agendarTurno = (nuevoTurno) => {
    // Validación de disponibilidad
    const turnoOcupado = turnos.some(
      (t) => t.medicoId === nuevoTurno.medicoId && t.hora === nuevoTurno.hora
    );

    if (turnoOcupado) {
      return { success: false, message: "⚠️ Lo sentimos, ese turno acaba de ser ocupado por otro paciente." };
    }

    // Si está libre, guardamos
    setTurnos([...turnos, nuevoTurno]);
    return { success: true };
  };

  // Obtener horarios ocupados de un médico específico.
  // Filtra los turnos por ID del médico y devuelve solo un array de las horas ["10:00", "11:00"].
  // Esto sirve para que el Dashboard sepa qué botones deshabilitar.
  const getHorariosOcupados = (medicoId) => {
    return turnos
      .filter((t) => t.medicoId === medicoId)
      .map((t) => t.hora);
  };

  // Retornamos el Provider con todas las funciones y estados accesibles
  return (
    <TurnosContext.Provider
      value={{
        users,
        currentUser,
        turnos,
        registerUser,
        loginUser,
        logout,
        agendarTurno,
        getHorariosOcupados,
      }}
    >
      {children}
    </TurnosContext.Provider>
  );
};