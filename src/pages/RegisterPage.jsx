import { useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Home, Luggage } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { mensajeDeError } from "../api/client";
import AuthLayout from "./AuthLayout";

const VACIO = { nombre: "", apellido: "", email: "", telefono: "", password: "", confirmar: "" };

export default function RegisterPage() {
  const { register, usuario } = useAuth();
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    ...VACIO,
    tipoCuenta: params.get("tipo") === "anfitrion" ? "ANFITRION" : "HUESPED",
  });
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (usuario) return <Navigate to={usuario.rol === "ANFITRION" ? "/anfitrion" : "/"} replace />;

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) return setError("La contraseña debe tener al menos 8 caracteres");
    if (form.password !== form.confirmar) return setError("Las contraseñas no coinciden");
    setEnviando(true);
    try {
      const { confirmar, ...datos } = form;
      await register(datos); // al guardar el usuario, el componente redirige al inicio
    } catch (err) {
      setError(mensajeDeError(err, "No se pudo crear la cuenta"));
      setEnviando(false);
    }
  };

  return (
    <AuthLayout
      titulo="Crea tu cuenta"
      subtitulo="¿Qué quieres hacer? Puedes cambiarlo después."
      pie={<>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></>}
    >
      <form onSubmit={onSubmit} className="form" noValidate>
        {error && <div className="alerta alerta-error" role="alert">{error}</div>}
        <div className="tipo-cuenta" role="radiogroup" aria-label="Tipo de cuenta">
          {[
            ["HUESPED", Luggage, "Quiero reservar", "Busca y reserva alojamientos"],
            ["ANFITRION", Home, "Quiero publicar", "Ofrece tu propiedad y recibe reservas"],
          ].map(([valor, Icono, titulo, texto]) => (
            <button key={valor} type="button" role="radio" aria-checked={form.tipoCuenta === valor}
                    className={`tipo-opcion ${form.tipoCuenta === valor ? "activa" : ""}`}
                    onClick={() => setForm({ ...form, tipoCuenta: valor })}>
              <Icono size={22} />
              <strong>{titulo}</strong>
              <span>{texto}</span>
            </button>
          ))}
        </div>
        <div className="form-fila">
          <label>Nombre<input value={form.nombre} onChange={set("nombre")} autoComplete="given-name" required autoFocus /></label>
          <label>Apellido<input value={form.apellido} onChange={set("apellido")} autoComplete="family-name" required /></label>
        </div>
        <label>Email<input type="email" value={form.email} onChange={set("email")} autoComplete="email" required /></label>
        <label>Teléfono <span className="opcional">(opcional)</span>
          <input type="tel" value={form.telefono} onChange={set("telefono")} autoComplete="tel" placeholder="+56 9 1234 5678" />
        </label>
        <div className="form-fila">
          <label>Contraseña<input type="password" value={form.password} onChange={set("password")} autoComplete="new-password" required /></label>
          <label>Repite la contraseña<input type="password" value={form.confirmar} onChange={set("confirmar")} autoComplete="new-password" required /></label>
        </div>
        <p className="ayuda">Mínimo 8 caracteres.</p>
        <button type="submit" className="btn btn-primario"
                disabled={enviando || !form.nombre || !form.apellido || !form.email || !form.password}>
          {enviando ? "Creando cuenta…" : "Crear cuenta"}
        </button>
      </form>
    </AuthLayout>
  );
}
