import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { mensajeDeError } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import SearchBar from "../components/SearchBar";
import { clp, FOTO_POR_DEFECTO, hoyISO } from "../format";

function ReservaForm({ depto, onListo }) {
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");
  const [estado, setEstado] = useState({ tipo: null, texto: "" });
  const [enviando, setEnviando] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setEstado({ tipo: null, texto: "" });
    try {
      await api.post("/api/reservas", { idDepartamento: depto.idDepartamento, fechaInicio: inicio, fechaFin: fin });
      setEstado({ tipo: "ok", texto: "¡Listo! Tu reserva quedó pendiente de confirmación." });
      setTimeout(onListo, 1800);
    } catch (err) {
      setEstado({ tipo: "error", texto: mensajeDeError(err, "No se pudo reservar") });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form className="reserva-form" onSubmit={onSubmit}>
      <div className="form-fila">
        <label>Llegada<input type="date" min={hoyISO()} value={inicio} onChange={(e) => setInicio(e.target.value)} required /></label>
        <label>Salida<input type="date" min={inicio || hoyISO()} value={fin} onChange={(e) => setFin(e.target.value)} required /></label>
      </div>
      {estado.texto && <div className={`alerta alerta-${estado.tipo}`}>{estado.texto}</div>}
      <div className="acciones">
        <button type="button" className="btn btn-secundario" onClick={onListo}>Cancelar</button>
        <button type="submit" className="btn btn-primario" disabled={enviando || !inicio || !fin}>
          {enviando ? "Reservando…" : "Confirmar"}
        </button>
      </div>
    </form>
  );
}

export default function HomePage() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reservando, setReservando] = useState(null);

  const fetchDepartamentos = useCallback((city = "") => {
    setLoading(true);
    setError("");
    api
      .get("/api/departamentos", { params: city ? { ciudad: city } : {} })
      .then((res) => setDepartamentos(res.data))
      .catch((err) => setError(mensajeDeError(err, "Error al cargar los departamentos")))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchDepartamentos();
  }, [fetchDepartamentos]);

  const reservar = (id) => {
    if (!usuario) return navigate("/login", { state: { desde: "/" } });
    setReservando(id);
  };

  return (
    <>
      <section className="hero">
        <h1>Encuentra tu próximo arriendo</h1>
        <p>Departamentos listos para tu próxima estadía, con reserva en línea.</p>
        <SearchBar onSearch={fetchDepartamentos} />
      </section>

      <div className="container">
        {loading && <p className="loading">Cargando departamentos…</p>}
        {error && <div className="alerta alerta-error">{error}</div>}
        {!loading && !error && departamentos.length === 0 && <p className="vacio">No hay departamentos disponibles.</p>}

        <div className="grid">
          {departamentos.map((dpto) => (
            <article key={dpto.idDepartamento} className="card">
              <img src={dpto.imagenUrl || FOTO_POR_DEFECTO} alt={dpto.nombre} />
              <div className="card-body">
                <h2>{dpto.nombre}</h2>
                {dpto.direccion && <p className="direccion">{dpto.direccion}</p>}
                <p className="detalle">
                  {[dpto.tipologia, dpto.metrosCuadrados && `${dpto.metrosCuadrados} m²`, dpto.numero && `N° ${dpto.numero}`]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {clp(dpto.precio) && (
                  <p className="precio">{clp(dpto.precio)} <span>/ noche</span></p>
                )}
                {reservando === dpto.idDepartamento ? (
                  <ReservaForm depto={dpto} onListo={() => setReservando(null)} />
                ) : (
                  <button className="btn btn-primario" onClick={() => reservar(dpto.idDepartamento)}>
                    {usuario ? "Reservar" : "Inicia sesión para reservar"}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
