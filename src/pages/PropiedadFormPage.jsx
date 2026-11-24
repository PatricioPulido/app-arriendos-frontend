import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { mensajeDeError } from "../api/client";
import GaleriaEditor from "../components/GaleriaEditor";
import { DESTACADOS, GRUPOS_COMODIDADES, MAX_DESTACADOS } from "../ficha/catalogo";
import "../ficha/Ficha.css";

const VACIO = {
  nombre: "", descripcion: "", direccion: "", numero: "", idZona: "", tipologia: "",
  capacidad: "", dormitorios: "", banos: "", metrosCuadrados: "", precio: "",
  // Ficha estilo Airbnb
  comodidades: [], destacados: [], horaCheckIn: "", horaCheckOut: "",
  permiteMascotas: null, permiteFumar: null, permiteFiestas: null,
  reglasAdicionales: "", sobreLaZona: "",
};
const TEXTOS_OPCIONALES = ["descripcion", "direccion", "tipologia", "horaCheckIn", "horaCheckOut", "reglasAdicionales", "sobreLaZona"];

/** Si / No / Sin indicar, para las reglas de la casa (null = sin indicar). */
function SelectorRegla({ etiqueta, valor, onChange }) {
  const v = valor === true ? "si" : valor === false ? "no" : "";
  return (
    <label>{etiqueta}
      <select value={v} onChange={(e) => onChange(e.target.value === "" ? null : e.target.value === "si")}>
        <option value="">Sin indicar</option>
        <option value="si">Sí</option>
        <option value="no">No</option>
      </select>
    </label>
  );
}
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
        setForm(Object.fromEntries(Object.keys(VACIO).map((k) => [k, data[k] ?? VACIO[k]])));
        setImagenes(data.imagenes || []);
        setImagenUrl(data.imagenes?.length ? null : data.imagenUrl ?? null);
        setIdCiudad(data.idCiudad ?? "");
      })
      .catch((err) => setAviso({ tipo: "error", texto: mensajeDeError(err) }))
      .finally(() => setCargando(false));
  }, [id, esNueva]);

  const set = (c) => (e) => setForm({ ...form, [c]: e.target.value });
  const setValor = (c) => (v) => setForm({ ...form, [c]: v });
  /** Marca o desmarca un codigo en comodidades o destacados. */
  const alternar = (campo, codigo) => {
    const lista = form[campo];
    setForm({ ...form, [campo]: lista.includes(codigo) ? lista.filter((c) => c !== codigo) : [...lista, codigo] });
  };

  const guardar = async (e) => {
    e.preventDefault();
    setAviso(null);
    setErrores({});
    setGuardando(true);
    const body = { ...form, imagenUrl };
    NUMEROS.forEach((k) => { body[k] = form[k] === "" ? null : Number(form[k]); });
    TEXTOS_OPCIONALES.forEach((k) => { if (!body[k]) body[k] = null; });
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

        <div className="seccion-form">
          <h3>Lo mejor de tu alojamiento</h3>
          <p className="ayuda">Elige hasta {MAX_DESTACADOS}. Es lo primero que lee el huésped y lo que más ayuda a que reserve.</p>
          <p className="contador-destacados">{form.destacados.length} de {MAX_DESTACADOS} elegidos</p>
          <div className="tarjetas-destacado">
            {DESTACADOS.map(({ codigo, titulo, texto, icono: Icono }) => {
              const activa = form.destacados.includes(codigo);
              return (
                <button key={codigo} type="button" className={`tarjeta-destacado ${activa ? "activa" : ""}`}
                        aria-pressed={activa} onClick={() => alternar("destacados", codigo)}
                        disabled={!activa && form.destacados.length >= MAX_DESTACADOS}>
                  <Icono size={22} /><div><strong>{titulo}</strong><span>{texto}</span></div>
                </button>
              );
            })}
          </div>
          {campo("destacados")}
        </div>

        <div className="seccion-form">
          <h3>Comodidades</h3>
          <p className="ayuda">Marca todo lo que ofreces. Los huéspedes filtran y comparan por esto.</p>
          {GRUPOS_COMODIDADES.map((g) => (
            <div key={g.titulo} className="selector-grupo">
              <h4>{g.titulo}</h4>
              <div className="chips">
                {g.items.map(({ codigo, texto, icono: Icono }) => {
                  const activa = form.comodidades.includes(codigo);
                  return (
                    <button key={codigo} type="button" className={`chip ${activa ? "activa" : ""}`}
                            aria-pressed={activa} onClick={() => alternar("comodidades", codigo)}>
                      <Icono size={18} />{texto}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="seccion-form">
          <h3>Horarios y reglas de la casa</h3>
          <div className="form-fila">
            <label>Llegada (check-in) desde<input type="time" value={form.horaCheckIn} onChange={set("horaCheckIn")} />{campo("horaCheckIn")}</label>
            <label>Salida (check-out) hasta<input type="time" value={form.horaCheckOut} onChange={set("horaCheckOut")} />{campo("horaCheckOut")}</label>
          </div>
          <div className="form-fila">
            <SelectorRegla etiqueta="¿Se admiten mascotas?" valor={form.permiteMascotas} onChange={setValor("permiteMascotas")} />
            <SelectorRegla etiqueta="¿Se puede fumar?" valor={form.permiteFumar} onChange={setValor("permiteFumar")} />
            <SelectorRegla etiqueta="¿Fiestas o eventos?" valor={form.permiteFiestas} onChange={setValor("permiteFiestas")} />
          </div>
          <label>Otras reglas
            <textarea rows={3} value={form.reglasAdicionales} onChange={set("reglasAdicionales")} maxLength={1000}
                      placeholder="Ej: silencio desde las 23:00, no usar la piscina después de las 21:00." />
            {campo("reglasAdicionales")}
          </label>
        </div>

        <div className="seccion-form">
          <h3>La zona</h3>
          <label>¿Qué hay cerca?
            <textarea rows={3} value={form.sobreLaZona} onChange={set("sobreLaZona")} maxLength={1000}
                      placeholder="Ej: a 3 cuadras de la playa, supermercado a 5 minutos caminando, micro a Viña en la esquina." />
            {campo("sobreLaZona")}
          </label>
          <p className="ayuda">En la ficha se muestra un mapa de la zona, no la dirección exacta.</p>
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
