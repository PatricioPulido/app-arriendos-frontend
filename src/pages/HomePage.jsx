import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { mensajeDeError } from "../api/client";
import SearchBar from "../components/SearchBar";
import { clp, FOTO_POR_DEFECTO, resumenDepto, ubicacion } from "../format";

export default function HomePage() {
  const [departamentos, setDepartamentos] = useState([]);
  const [filtros, setFiltros] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const buscar = useCallback((f = {}) => {
    setFiltros(f);
    setLoading(true);
    setError("");
    api
      .get("/api/departamentos", { params: f })
      .then((res) => setDepartamentos(res.data))
      .catch((err) => setError(mensajeDeError(err, "Error al cargar los departamentos")))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    buscar();
  }, [buscar]);

  // Las fechas buscadas pasan al detalle para no escribirlas de nuevo
  const query = new URLSearchParams(
    Object.fromEntries(["llegada", "salida"].filter((k) => filtros[k]).map((k) => [k, filtros[k]]))
  ).toString();

  return (
    <>
      <section className="hero">
        <h1>Tu próximo destino en Chile</h1>
        <p>Arrienda lo que necesitas, donde lo necesites: en la costa, la cordillera o el sur.</p>
        <SearchBar onSearch={buscar} />
      </section>

      <div className="container">
        {loading && <p className="loading">Cargando departamentos…</p>}
        {error && <div className="alerta alerta-error">{error}</div>}
        {!loading && !error && departamentos.length === 0 && (
          <p className="vacio">No encontramos alojamientos con esos filtros.</p>
        )}

        <div className="grid">
          {departamentos.map((d) => (
            <Link key={d.idDepartamento} to={`/departamentos/${d.idDepartamento}${query ? `?${query}` : ""}`}
                  className="card card-link">
              <img src={d.imagenUrl || FOTO_POR_DEFECTO} alt={d.nombre} loading="lazy" />
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
