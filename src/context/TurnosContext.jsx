import { createContext, useState, useEffect } from "react";
// Crea el contexto
export const TurnosContext = createContext();
// Provider: Envuelve la app y da acceso a los datos
export const TurnosProvider = ({ children }) => {
  // ESTADO: Usuarios registrados (se carga del localStorage si existe)
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  // ESTADO: Usuario actual logueado (null si no hay nadie)
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  // ESTADO: Turnos guardados
  const [turnos, setTurnos] = useState(() => {
    const savedTurnos = localStorage.getItem("turnos");
    return savedTurnos ? JSON.parse(savedTurnos) : [];
  });
  // EFECTO: Cada vez que 'users' cambie, actualizamos el localStorage
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);
  // EFECTO: Guardar sesión actual
  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);
  // EFECTO: Guardar turnos
  useEffect(() => {
    localStorage.setItem("turnos", JSON.stringify(turnos));
  }, [turnos]);
  // FUNCION: Registrar usuario
  const registerUser = (user) => {
    // Verificamos si el email ya existe
    if (users.find((u) => u.email === user.email)) {
      return { success: false, message: "El usuario ya existe" };
    }
    setUsers([...users, user]);
    return { success: true };
  };
  // FUNCION: Login
  const loginUser = (email, password) => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return { success: true };
    }
    return { success: false, message: "Credenciales incorrectas" };
  };
  // FUNCION: Logout
  const logout = () => setCurrentUser(null);
  // FUNCION: Guardar Turno
  const agendarTurno = (nuevoTurno) => {
    setTurnos([...turnos, nuevoTurno]);
  };
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
      }}
    >
      {children}
    </TurnosContext.Provider>
  );
};