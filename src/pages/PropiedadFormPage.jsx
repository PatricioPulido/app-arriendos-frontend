import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { mensajeDeError } from "../api/client";
import GaleriaEditor from "../components/GaleriaEditor";

const VACIO = {
  nombre: "", descripcion: "", direccion: "", numero: "", idZona: "", tipologia: "",
  capacidad: "", dormitorios: "", banos: "", metrosCuadrados: "", precio: "",
};
const NUMEROS = ["numero", "idZona", "capacidad", "dormitorios", "banos", "metrosCuadrados", "precio"];

/** Crear (/anfitrion/propiedades/nueva) o editar (/anfitrion/propiedades/:id) una propiedad. */
export default function PropiedadFormPage() {
  const { id } = useParams();
  const esNueva = !id;
  const navigate = useNavigate();
  const [form, setForm] = useState(VACIO);
  const [imagenes, setImagenes] = useState([]);
  const [imagenUrl, setImagenUrl] = useState(null); // se conserva si venia del panel admin antiguo
  const [ciudades, setCiudades] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [idCiudad, setIdCiudad] = useState("");
  const [cargando, setCargando] = useState(!esNueva);
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState(null);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    Promise.all([api.get("/api/ciudades"), api.get("/api/zonas")])
      .then(([c, z]) => { setCiudades(c.data); setZonas(z.data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (esNueva) return;
    api.get(`/api/departamentos/${id}`)
      .then(({ data }) => {
        setForm(Object.fromEntries(Object.keys(VACIO).map((k) => [k, data[k] ?? ""])));
        setImagenes(data.imagenes || []);
        setImagenUrl(data.imagenes?.length ? null : data.imagenUrl ?? null);
        setIdCiudad(data.idCiudad ?? "");
      })
      .catch((err) => setAviso({ tipo: "error", texto: mensajeDeError(err) }))
      .finally(() => setCargando(false));
  }, [id, esNueva]);

  const set = (c) => (e) => setForm({ ...form, [c]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    setAviso(null);
    setErrores({});
    setGuardando(true);
    const body = { ...form, imagenUrl };
    NUMEROS.forEach((k) => { body[k] = form[k] === "" ? null : Number(form[k]); });
    ["descripcion", "direccion", "tipologia"].forEach((k) => { if (!body[k]) body[k] = null; });
    try {
      if (esNueva) {
        const { data } = await api.post("/api/departamentos", body);
        // Igual que en Airbnb: primero los datos, despues las fotos
        navigate(`/anfitrion/propiedades/${data.idDepartamento}?nueva=1`, { replace: true });
      } else {
        await api.put(`/api/departamentos/${id}`, body);
        setAviso({ tipo: "ok", texto: "Cambios guardados" });
      }
    } catch (err) {
      setErrores(err.response?.data?.errores || {});
      setAviso({ tipo: "error", texto: mensajeDeError(err, "No se pudo guardar") });
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async () => {
    if (!window.confirm(`¿Eliminar "${form.nombre}" y todas sus fotos? No se puede deshacer.`)) return;
    try {
      await api.delete(`/api/departamentos/${id}`);
      navigate("/anfitrion", { replace: true });
    } catch (err) {
      setAviso({ tipo: "error", texto: mensajeDeError(err) });
    }
  };

  if (cargando) return <p className="loading">Cargando…</p>;

  const zonasDeCiudad = zonas.filter((z) => !idCiudad || String(z.idCiudad) === String(idCiudad));
  const recienCreada = new URLSearchParams(window.location.search).get("nueva");
  const campo = (c) => errores[c] && <span className="error-campo">{errores[c]}</span>;

  return (
    <div className="container container-angosto">
      <Link to="/anfitrion" className="volver">← Panel de anfitrión</Link>
      <h1 className="titulo-pagina">{esNueva ? "Publica tu propiedad" : form.nombre || "Editar propiedad"}</h1>
      {recienCreada && !aviso && imagenes.length === 0 && (
        <div className="alerta alerta-ok">¡Propiedad creada! Ahora agrega fotos: los huéspedes reservan más cuando ven bien el lugar.</div>
      )}
      {aviso && <div className={`alerta alerta-${aviso.tipo}`}>{aviso.texto}</div>}

      {!esNueva && (
        <section className="panel">
          <h3>Fotos</h3>
          <GaleriaEditor idDepartamento={id} imagenes={imagenes} onChange={setImagenes} />
        </section>
      )}

      <form className="panel form" onSubmit={guardar} noValidate>
        <h3>Datos del alojamiento</h3>
        <label>Título<input value={form.nombre} onChange={set("nombre")} maxLength={150} required
                            placeholder="Depto con vista al mar en Reñaca" />{campo("nombre")}</label>
        <label>Descripción
          <textarea rows={5} value={form.descripcion} onChange={set("descripcion")} maxLength={2000}
                    placeholder="Cuenta qué hace especial tu alojamiento, qué hay cerca y qué incluye." />
          {campo("descripcion")}
        </label>

        <div className="form-fila">
          <label>Ciudad
            <select value={idCiudad} onChange={(e) => { setIdCiudad(e.target.value); setForm({ ...form, idZona: "" }); }}>
              <option value="">Elige una ciudad</option>
              {ciudades.map((c) => <option key={c.idCiudad} value={c.idCiudad}>{c.nombre}</option>)}
            </select>
          </label>
          <label>Zona / barrio
            <select value={form.idZona} onChange={set("idZona")} disabled={!idCiudad}>
              <option value="">Elige una zona</option>
              {zonasDeCiudad.map((z) => <option key={z.idZona} value={z.idZona}>{z.nombre}</option>)}
            </select>
          </label>
        </div>
        <div className="form-fila">
          <label>Dirección<input value={form.direccion} onChange={set("direccion")} maxLength={255} /></label>
          <label className="campo-chico">N° depto<input type="number" min="1" value={form.numero} onChange={set("numero")} />{campo("numero")}</label>
        </div>

        <div className="form-fila">
          <label>Huéspedes<input type="number" min="1" max="50" value={form.capacidad} onChange={set("capacidad")} />{campo("capacidad")}</label>
          <label>Dormitorios<input type="number" min="0" max="50" value={form.dormitorios} onChange={set("dormitorios")} />{campo("dormitorios")}</label>
          <label>Baños<input type="number" min="0" max="50" value={form.banos} onChange={set("banos")} />{campo("banos")}</label>
        </div>
        <div className="form-fila">
          <label>m²<input type="number" min="0" value={form.metrosCuadrados} onChange={set("metrosCuadrados")} /></label>
          <label>Tipología<input value={form.tipologia} onChange={set("tipologia")} placeholder="2D2B" maxLength={50} /></label>
          <label>Precio por noche (CLP)<input type="number" min="0" value={form.precio} onChange={set("precio")} />{campo("precio")}</label>
        </div>

        <div className="acciones">
          {!esNueva && <button type="button" className="btn btn-peligro btn-inline" onClick={eliminar}>Eliminar propiedad</button>}
          <button type="submit" className="btn btn-primario" disabled={guardando || !form.nombre}>
            {guardando ? "Guardando…" : esNueva ? "Continuar y agregar fotos" : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
