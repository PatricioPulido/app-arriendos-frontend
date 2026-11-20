import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import api, { mensajeDeError } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { clp, fecha, FOTO_POR_DEFECTO, resumenDepto, ubicacion } from "../format";

/** Para un huesped: invitacion a publicar. Activa el rol ANFITRION en su cuenta. */
function HazteAnfitrion() {
  const { hacermeAnfitrion } = useAuth();
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const activar = async () => {
    setEnviando(true);
    try {
      await hacermeAnfitrion();
    } catch (err) {
      setError(mensajeDeError(err));
      setEnviando(false);
    }
  };
  return (
    <div className="container">
      <div className="panel invitacion">
        <h1>Publica tu alojamiento</h1>
        <p>Activa tu cuenta de anfitrión para publicar tu propiedad, subir fotos y recibir reservas.
          Seguirás pudiendo reservar como huésped.</p>
        {error && <div className="alerta alerta-error">{error}</div>}
        <button className="btn btn-primario btn-inline" onClick={activar} disabled={enviando}>
          {enviando ? "Activando…" : "Quiero ser anfitrión"}
        </button>
      </div>
    </div>
  );
}

function Propiedades({ propiedades }) {
  if (propiedades.length === 0) {
    return (
      <div className="vacio">
        <p>Todavía no publicas ninguna propiedad.</p>
        <Link to="/anfitrion/propiedades/nueva" className="btn btn-primario btn-inline">Publicar mi primera propiedad</Link>
      </div>
    );
  }
  return (
    <div className="grid">
      {propiedades.map((d) => (
        <article key={d.idDepartamento} className="card">
          <img src={d.imagenUrl || FOTO_POR_DEFECTO} alt={d.nombre} loading="lazy" />
          <div className="card-body">
            <h2>{d.nombre}</h2>
            {ubicacion(d) && <p className="direccion">{ubicacion(d)}</p>}
            {resumenDepto(d) && <p className="detalle">{resumenDepto(d)}</p>}
            <p className="detalle">{d.imagenes?.length || 0} fotos</p>
            {clp(d.precio) && <p className="precio">{clp(d.precio)} <span>/ noche</span></p>}
            <div className="acciones">
              <Link to={`/departamentos/${d.idDepartamento}`} className="btn btn-secundario">Ver</Link>
              <Link to={`/anfitrion/propiedades/${d.idDepartamento}`} className="btn btn-primario">Editar</Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function ReservasRecibidas({ reservas, recargar, avisar }) {
  const cambiar = async (r, estado) => {
    try {
      const { data } = await api.patch(`/api/reservas/${r.idReserva}/estado`, { estado });
      avisar("ok", data.mensaje);
      recargar();
    } catch (err) {
      avisar("error", mensajeDeError(err));
    }
  };
  if (reservas.length === 0) return <p className="vacio">Aún no recibes reservas.</p>;
  return (
    <ul className="lista-reservas">
      {reservas.map((r) => (
        <li key={r.idReserva} className="reserva-item">
          <div>
            <strong>{r.nombreDepartamento}</strong>
            <span>{fecha(r.fechaInicio)} → {fecha(r.fechaFin)} · {r.nombreHuesped}</span>
            {r.emailHuesped && <span>{r.emailHuesped}{r.telefonoHuesped ? ` · ${r.telefonoHuesped}` : ""}</span>}
          </div>
          <div className="reserva-acciones">
            <span className={`badge badge-${(r.estado || "").toLowerCase()}`}>{r.estado}</span>
            {r.estado === "PENDIENTE" && (
              <>
                <button className="btn btn-primario btn-chico" onClick={() => cambiar(r, "CONFIRMADA")}>Confirmar</button>
                <button className="btn btn-peligro btn-chico" onClick={() => cambiar(r, "CANCELADA")}>Rechazar</button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function AnfitrionPage() {
  const { esAnfitrion } = useAuth();
  const [tab, setTab] = useState("propiedades");
  const [datos, setDatos] = useState(null);
  const [aviso, setAviso] = useState(null);

  const recargar = useCallback(() => {
    Promise.all([api.get("/api/departamentos/mios"), api.get("/api/reservas/anfitrion")])
      .then(([p, r]) => setDatos({ propiedades: p.data, reservas: r.data }))
      .catch((err) => setAviso({ tipo: "error", texto: mensajeDeError(err) }));
  }, []);

  useEffect(() => {
    if (esAnfitrion) recargar();
  }, [esAnfitrion, recargar]);

  if (!esAnfitrion) return <HazteAnfitrion />;

  const avisar = (tipo, texto) => {
    setAviso({ tipo, texto });
    setTimeout(() => setAviso(null), 3500);
  };
  const pendientes = datos?.reservas.filter((r) => r.estado === "PENDIENTE").length || 0;

  return (
    <div className="container">
      <div className="titulo-con-accion">
        <h1 className="titulo-pagina">Panel de anfitrión</h1>
        <Link to="/anfitrion/propiedades/nueva" className="btn btn-primario btn-inline"><Plus size={18} /> Publicar propiedad</Link>
      </div>
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === "propiedades"} className={`tab ${tab === "propiedades" ? "activa" : ""}`}
                onClick={() => setTab("propiedades")}>Mis propiedades ({datos?.propiedades.length ?? 0})</button>
        <button role="tab" aria-selected={tab === "reservas"} className={`tab ${tab === "reservas" ? "activa" : ""}`}
                onClick={() => setTab("reservas")}>Reservas recibidas{pendientes ? ` (${pendientes} por responder)` : ""}</button>
      </div>
      {aviso && <div className={`alerta alerta-${aviso.tipo}`}>{aviso.texto}</div>}
      {!datos && !aviso && <p className="loading">Cargando…</p>}
      {datos && tab === "propiedades" && <Propiedades propiedades={datos.propiedades} />}
      {datos && tab === "reservas" && <ReservasRecibidas reservas={datos.reservas} recargar={recargar} avisar={avisar} />}
    </div>
  );
}
