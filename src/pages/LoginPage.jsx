import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { mensajeDeError } from "../api/client";
import AuthLayout from "./AuthLayout";
import CampoClave from "../components/CampoClave";

export default function LoginPage() {
  const { login, usuario } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Con sesion iniciada (recien logueado o ya lo estaba) se va a la pagina que pidio, o a la de su rol
  if (usuario) {
    const destino = location.state?.desde || ({ ADMIN: "/admin", ANFITRION: "/anfitrion" }[usuario.rol] || "/");
    return <Navigate to={destino} replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      await login(email, password); // al guardar el usuario, el componente redirige
    } catch (err) {
      setError(mensajeDeError(err, "No se pudo iniciar sesión"));
      setEnviando(false);
    }
  };

  return (
    <AuthLayout
      titulo="Bienvenido de vuelta"
      subtitulo="Ingresa para ver y gestionar tus reservas."
      pie={<>¿No tienes cuenta? <Link to="/registro">Regístrate gratis</Link></>}
    >
      <form onSubmit={onSubmit} className="form" noValidate>
        {error && <div className="alerta alerta-error" role="alert">{error}</div>}
        <label>
          Email
          <input type="email" autoComplete="email" value={email}
                 onChange={(e) => setEmail(e.target.value)} required autoFocus />
        </label>
        <CampoClave label="Contraseña" autoComplete="current-password" value={password}
                    onChange={(e) => setPassword(e.target.value)} required />
        <Link to="/recuperar-contrasena" className="link-olvido">¿Olvidaste tu contraseña?</Link>
        <button type="submit" className="btn btn-primario" disabled={enviando || !email || !password}>
          {enviando ? "Ingresando…" : "Iniciar sesión"}
        </button>
      </form>
    </AuthLayout>
  );
}
