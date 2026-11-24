import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api, { mensajeDeError } from "../api/client";
import SearchBar from "../components/SearchBar";
import Destinos, { FondoDestino } from "../components/Destinos";
import Atractivo from "../components/Atractivo";
import { atractivoDe, destinoDe } from "../destinos";
import { clp, FOTO_POR_DEFECTO, resumenDepto, ubicacion } from "../format";

export default function HomePage() {
  const [departamentos, setDepartamentos] = useState([]);
  const [todos, setTodos] = useState(null); // primera carga sin filtros: cuenta alojamientos por destino
  const [filtros, setFiltros] = useState({});
  const [destino, setDestino] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const resultados = useRef(null);

  const buscar = useCallback((f = {}) => {
    setFiltros(f);
    setLoading(true);
    setError("");
    api
      .get("/api/departamentos", { params: f })
      .then((res) => {
        setDepartamentos(res.data);
        if (Object.keys(f).length === 0) setTodos(res.data);
      })
      .catch((err) => setError(mensajeDeError(err, "Error al cargar los departamentos")))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    buscar();
  }, [buscar]);

  const conteo = useMemo(() => {
    const c = {};
    (todos || []).forEach((d) => {
      const dest = destinoDe(d);
      if (dest) c[dest.ciudad] = (c[dest.ciudad] || 0) + 1;
    });
    return c;
  }, [todos]);

  const elegirDestino = (d) => {
    const quitar = destino?.ciudad === d.ciudad;
    setDestino(quitar ? null : d);
    buscar(quitar ? {} : { ciudad: d.ciudad });
    if (!quitar) setTimeout(() => resultados.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const buscarDesdeBarra = (f) => {
    setDestino(null);
    buscar(f);
  };

  const verTodos = () => {
    setDestino(null);
    buscar();
  };

  // Las fechas buscadas pasan al detalle para no escribirlas de nuevo
  const query = new URLSearchParams(
    Object.fromEntries(["llegada", "salida"].filter((k) => filtros[k]).map((k) => [k, filtros[k]]))
  ).toString();

  return (
    <>
      <section className="hero">
        <h1>Encuentra tu próximo arriendo</h1>
        <p>Del mar a la cordillera y a los lagos del sur, con reserva en línea.</p>
        <SearchBar onSearch={buscarDesdeBarra} />
      </section>

      <Destinos conteo={conteo} onElegir={elegirDestino} activo={destino?.ciudad} />

      <div className="container resultados" ref={resultados}>
        {destino ? (
          <div className="destino-banner" key={destino.ciudad}>
            <FondoDestino destino={destino} />
            <div>
              <Atractivo atractivo={{ texto: destino.etiqueta[0], icono: destino.etiqueta[1] }} />
              <h2>Alojamientos en {destino.ciudad}</h2>
              <p>{destino.lema}</p>
              <button type="button" className="btn btn-inline btn-chico" onClick={verTodos}>Ver todos los destinos</button>
            </div>
          </div>
        ) : (
          <h2 className="titulo-seccion">{Object.keys(filtros).length ? "Resultados de tu búsqueda" : "Alojamientos destacados"}</h2>
        )}

        {loading && <p className="loading">Cargando departamentos…</p>}
        {error && <div className="alerta alerta-error">{error}</div>}
        {!loading && !error && departamentos.length === 0 && (
          <p className="vacio">
            {destino
              ? `Todavía no hay alojamientos publicados en ${destino.ciudad}. ¡Pronto habrá!`
              : "No encontramos alojamientos con esos filtros."}
          </p>
        )}

        <div className="grid">
          {departamentos.map((d, i) => (
            <Link key={d.idDepartamento} to={`/departamentos/${d.idDepartamento}${query ? `?${query}` : ""}`}
                  className="card card-link card-aparece" style={{ "--i": Math.min(i, 8) }}>
              <div className="card-foto">
                <img src={d.imagenUrl || FOTO_POR_DEFECTO} alt={d.nombre} loading="lazy" />
                <Atractivo atractivo={atractivoDe(d)} />
              </div>
              <div className="card-body">
                <h2>{d.nombre}</h2>
                {(ubicacion(d) || d.direccion) && <p className="direccion">{ubicacion(d) || d.direccion}</p>}
                {resumenDepto(d) && <p className="detalle">{resumenDepto(d)}</p>}
                {clp(d.precio) && <p className="precio">{clp(d.precio)} <span>/ noche</span></p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
