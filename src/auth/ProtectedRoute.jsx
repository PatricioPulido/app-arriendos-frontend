import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

/** Muestra la pagina solo si hay sesion (y uno de los roles pedidos, si se indica: "ADMIN" o ["ADMIN", "ANFITRION"]). */
export default function ProtectedRoute({ rol, children }) {
  const { usuario, cargando } = useAuth();
  const location = useLocation();

  if (cargando) return <p className="loading">Cargando…</p>;
  if (!usuario) return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  const permitidos = rol ? [].concat(rol) : null;
  if (permitidos && !permitidos.includes(usuario.rol)) return <Navigate to="/" replace />;
  return children;
}
