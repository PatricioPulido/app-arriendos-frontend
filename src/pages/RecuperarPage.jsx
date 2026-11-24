import { useState } from "react";
import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";
import api, { mensajeDeError } from "../api/client";
import AuthLayout from "./AuthLayout";

/** "¿Olvidaste tu contraseña?": pide el email y el backend envia un enlace. */
export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState("");
  const [enviando, setEnviando] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      const { data } = await api.post("/api/auth/recuperar", { email });
      setEnviado(data?.mensaje || "Si existe una cuenta con ese email, te enviamos un enlace.");
    } catch (err) {
      setError(mensajeDeError(err, "No se pudo enviar el enlace"));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <AuthLayout
      titulo="¿Olvidaste tu contraseña?"
      subtitulo="Escribe el email de tu cuenta y te enviaremos un enlace para crear una nueva."
      pie={<>¿La recordaste? <Link to="/login">Inicia sesión</Link></>}
    >
      {enviado ? (
        <div className="form">
          <div className="alerta alerta-ok" role="status">
            <MailCheck size={18} style={{ verticalAlign: "-3px", marginRight: 6 }} />
            {enviado}
          </div>
          <p className="ayuda" style={{ margin: 0 }}>El enlace vence en 30 minutos y sirve una sola vez.</p>
          <button type="button" className="btn btn-secundario" onClick={() => setEnviado("")}>
            Enviar de nuevo
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="form" noValidate>
          {error && <div className="alerta alerta-error" role="alert">{error}</div>}
          <label>
            Email
            <input type="email" autoComplete="email" value={email}
                   onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </label>
          <button type="submit" className="btn btn-primario" disabled={enviando || !email}>
            {enviando ? "Enviando…" : "Enviar enlace"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
