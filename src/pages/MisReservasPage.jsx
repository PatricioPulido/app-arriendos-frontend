import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { mensajeDeError } from "../api/client";
import { fecha } from "../format";

export default function MisReservasPage() {
  const [reservas, setReservas] = useState(null);
  const [deptos, setDeptos] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get("/api/reservas/mias"), api.get("/api/departamentos")])
      .then(([r, d]) => {
        setReservas(r.data);
        setDeptos(Object.fromEntries(d.data.map((x) => [x.idDepartamento, x])));
      })
      .catch((err) => setError(mensajeDeError(err)));
  }, []);

  return (
    <div className="container">
      <h1 className="titulo-pagina">Mis reservas</h1>
      {error && <div className="alerta alerta-error">{error}</div>}
      {reservas === null && !error && <p className="loading">Cargando…</p>}
      {reservas?.length === 0 && (
        <div className="vacio">
          <p>Aún no tienes reservas.</p>
          <Link to="/" className="btn btn-primario btn-inline">Explorar departamentos</Link>
        </div>
      )}
      <ul className="lista-reservas">
        {reservas?.map((r) => (
          <li key={r.idReserva} className="reserva-item">
            <div>
              <strong>{deptos[r.idDepartamento]?.nombre || `Departamento #${r.idDepartamento}`}</strong>
              <span>{fecha(r.fechaInicio)} → {fecha(r.fechaFin)}</span>
            </div>
            <span className={`badge badge-${(r.estado || "").toLowerCase()}`}>{r.estado}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
