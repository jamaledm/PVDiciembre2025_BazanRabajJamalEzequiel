import { useContext } from "react";
import { TurnosContext } from "../context/TurnosContext";

// Hook personalizado para no importar el useContext en cada componente
// Simplemente llamo a useTurnos() y tengo acceso a todo.
export const useTurnos = () => {
  const context = useContext(TurnosContext);
  if (!context) {
    throw new Error("useTurnos debe ser usado dentro de un TurnosProvider");
  }
  return context;
};