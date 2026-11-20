import { Link } from "react-router-dom";

/** Marco comun de login y registro: panel de marca a la izquierda, formulario a la derecha. */
export default function AuthLayout({ titulo, subtitulo, children, pie }) {
  return (
    <div className="auth-page">
      <aside className="auth-brand">
        <Link to="/" className="auth-logo">Arrienda tu nuevo paraíso</Link>
        <div className="auth-brand-texto">
          <h2>Tu próximo destino te está esperando</h2>
          <p>Reserva departamentos en minutos o publica el tuyo y recibe huéspedes, todo desde un solo lugar.</p>
        </div>
        <ul className="auth-beneficios">
          <li>Reservas confirmadas por el anfitrión</li>
          <li>Tus datos protegidos</li>
          <li>Historial de estadías siempre a mano</li>
        </ul>
      </aside>
      <main className="auth-panel">
        <div className="auth-card">
          <h1>{titulo}</h1>
          {subtitulo && <p className="auth-subtitulo">{subtitulo}</p>}
          {children}
          {pie && <div className="auth-pie">{pie}</div>}
        </div>
      </main>
    </div>
  );
}
