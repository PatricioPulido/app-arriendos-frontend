import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

/** Muestra la pagina solo si hay sesion (y el rol pedido, si se indica). */
export default function ProtectedRoute({ rol, children }) {
  const { usuario, cargando } = useAuth();
  const location = useLocation();

  if (cargando) return <p className="loading">Cargando…</p>;
  if (!usuario) return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  if (rol && usuario.rol !== rol) return <Navigate to="/" replace />;
  return children;
}
