import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { mensajeDeError } from "../api/client";
import AuthLayout from "./AuthLayout";
import CampoClave from "../components/CampoClave";

/** Se abre desde el enlace del correo: /restablecer-contrasena?token=... */
export default function RestablecerPage() {
  const navigate = useNavigate();
  // Se lee una vez y se quita de la barra de direcciones (no queda en el historial)
  const [token] = useState(() => new URLSearchParams(window.location.search).get("token") || "");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [listo, setListo] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (token) window.history.replaceState(null, "", window.location.pathname);
  }, [token]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("La contraseña debe tener al menos 8 caracteres");
    if (password !== confirmar) return setError("Las contraseñas no coinciden");
    setEnviando(true);
    try {
      const { data } = await api.post("/api/auth/restablecer", { token, password });
      setListo(data?.mensaje || "Listo, tu contraseña se cambió.");
    } catch (err) {
      setError(mensajeDeError(err, "No se pudo cambiar la contraseña"));
    } finally {
      setEnviando(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout titulo="Enlace incompleto"
                  subtitulo="Abre el enlace tal como llegó a tu correo, o pide uno nuevo.">
        <Link to="/recuperar-contrasena" className="btn btn-primario">Pedir un enlace nuevo</Link>
      </AuthLayout>
    );
  }

  if (listo) {
    return (
      <AuthLayout titulo="Contraseña actualizada">
        <div className="form">
          <div className="alerta alerta-ok" role="status">{listo}</div>
          <button type="button" className="btn btn-primario" onClick={() => navigate("/login", { replace: true })}>
            Iniciar sesión
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      titulo="Crea una nueva contraseña"
      subtitulo="Al guardarla se cerrarán las sesiones abiertas en otros dispositivos."
      pie={<Link to="/recuperar-contrasena">Pedir un enlace nuevo</Link>}
    >
      <form onSubmit={onSubmit} className="form" noValidate>
        {error && <div className="alerta alerta-error" role="alert">{error}</div>}
        <CampoClave label="Nueva contraseña" value={password} onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password" required autoFocus />
        <CampoClave label="Repite la contraseña" value={confirmar} onChange={(e) => setConfirmar(e.target.value)}
                    autoComplete="new-password" required />
        <p className="ayuda">Mínimo 8 caracteres.</p>
        <button type="submit" className="btn btn-primario" disabled={enviando || !password || !confirmar}>
          {enviando ? "Guardando…" : "Guardar contraseña"}
        </button>
      </form>
    </AuthLayout>
  );
}
