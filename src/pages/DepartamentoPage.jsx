import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import api, { mensajeDeError } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import Galeria from "../components/Galeria";
import Atractivo from "../components/Atractivo";
import { atractivoDe, destinoDe } from "../destinos";
import { clp, hoyISO, noches, resumenDepto, ubicacion } from "../format";

function Reservar({ depto }) {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [inicio, setInicio] = useState(params.get("llegada") || "");
  const [fin, setFin] = useState(params.get("salida") || "");
  const [estado, setEstado] = useState({ tipo: null, texto: "" });
  const [enviando, setEnviando] = useState(false);

  const esDueno = usuario && usuario.idUsuario === depto.idAnfitrion;
  const n = noches(inicio, fin);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!usuario) return navigate("/login", { state: { desde: `/departamentos/${depto.idDepartamento}` } });
    setEnviando(true);
    setEstado({ tipo: null, texto: "" });
    try {
      await api.post("/api/reservas", { idDepartamento: depto.idDepartamento, fechaInicio: inicio, fechaFin: fin });
      setEstado({ tipo: "ok", texto: "¡Listo! Tu reserva quedó pendiente de confirmación del anfitrión." });
    } catch (err) {
      setEstado({ tipo: "error", texto: mensajeDeError(err, "No se pudo reservar") });
    } finally {
      setEnviando(false);
    }
  };

  if (esDueno) {
    return (
      <aside className="panel reserva-panel">
        <p>Esta es tu propiedad.</p>
        <Link to={`/anfitrion/propiedades/${depto.idDepartamento}`} className="btn btn-primario">Editar propiedad</Link>
      </aside>
    );
  }

  return (
    <aside className="panel reserva-panel">
      {clp(depto.precio) && <p className="precio">{clp(depto.precio)} <span>/ noche</span></p>}
      <form className="reserva-form" onSubmit={onSubmit}>
        <div className="form-fila">
          <label>Llegada<input type="date" min={hoyISO()} value={inicio} onChange={(e) => setInicio(e.target.value)} required /></label>
          <label>Salida<input type="date" min={inicio || hoyISO()} value={fin} onChange={(e) => setFin(e.target.value)} required /></label>
        </div>
        {n > 0 && depto.precio != null && (
          <p className="total">{clp(depto.precio)} x {n} {n === 1 ? "noche" : "noches"} = <strong>{clp(depto.precio * n)}</strong></p>
        )}
        {estado.texto && <div className={`alerta alerta-${estado.tipo}`}>{estado.texto}</div>}
        {estado.tipo === "ok" ? (
          <Link to="/mis-reservas" className="btn btn-secundario">Ver mis reservas</Link>
        ) : (
          <button type="submit" className="btn btn-primario" disabled={enviando || (usuario && (!inicio || !fin))}>
            {!usuario ? "Inicia sesión para reservar" : enviando ? "Reservando…" : "Reservar"}
          </button>
        )}
      </form>
    </aside>
  );
}

export default function DepartamentoPage() {
  const { id } = useParams();
  const [depto, setDepto] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/api/departamentos/${id}`)
      .then((res) => setDepto(res.data))
      .catch((err) => setError(mensajeDeError(err, "No se pudo cargar el alojamiento")));
  }, [id]);

  if (error) return <div className="container"><div className="alerta alerta-error">{error}</div></div>;
  if (!depto) return <p className="loading">Cargando…</p>;

  return (
    <div className="container">
      <h1 className="titulo-pagina">{depto.nombre}</h1>
      {(ubicacion(depto) || depto.direccion) && (
        <p className="direccion">{[ubicacion(depto), depto.direccion].filter(Boolean).join(" · ")}</p>
      )}
      {atractivoDe(depto) && (
        <p className="detalle-atractivo">
          <Atractivo atractivo={atractivoDe(depto)} className="atractivo-detalle" />
          <span>{destinoDe(depto).lema}</span>
        </p>
      )}
      <Galeria imagenes={depto.imagenes} alt={depto.nombre} />
      <div className="detalle-layout">
        <section>
          {resumenDepto(depto) && <h2 className="detalle-resumen">{resumenDepto(depto)}</h2>}
          {depto.nombreAnfitrion && <p className="anfitrion">Anfitrión: <strong>{depto.nombreAnfitrion}</strong></p>}
          {depto.descripcion && <p className="descripcion">{depto.descripcion}</p>}
          {depto.tipologia && <p className="detalle">Tipología: {depto.tipologia}</p>}
        </section>
        <Reservar depto={depto} />
      </div>
    </div>
  );
}
