import { useCallback, useEffect, useState } from "react";
import api, { mensajeDeError } from "../api/client";
import { clp, fecha } from "../format";

const ESTADOS = ["PENDIENTE", "CONFIRMADA", "CANCELADA", "FINALIZADA"];
const DEPTO_VACIO = { nombre: "", numero: "", direccion: "", tipologia: "", metrosCuadrados: "", precio: "", imagenUrl: "" };

function Departamentos({ deptos, recargar, avisar }) {
  const [form, setForm] = useState(DEPTO_VACIO);
  const set = (c) => (e) => setForm({ ...form, [c]: e.target.value });

  const crear = async (e) => {
    e.preventDefault();
    const num = (v) => (v === "" ? null : Number(v));
    try {
      const { data } = await api.post("/api/departamentos", {
        ...form,
        numero: num(form.numero),
        metrosCuadrados: num(form.metrosCuadrados),
        precio: num(form.precio),
        imagenUrl: form.imagenUrl || null,
      });
      avisar("ok", data.mensaje || "Departamento creado");
      setForm(DEPTO_VACIO);
      recargar();
    } catch (err) {
      avisar("error", mensajeDeError(err));
    }
  };

  const eliminar = async (d) => {
    if (!window.confirm(`¿Eliminar "${d.nombre}"?`)) return;
    try {
      await api.delete(`/api/departamentos/${d.idDepartamento}`);
      avisar("ok", "Departamento eliminado");
      recargar();
    } catch (err) {
      avisar("error", mensajeDeError(err));
    }
  };

  return (
    <>
      <form className="panel form" onSubmit={crear}>
        <h3>Nuevo departamento</h3>
        <div className="form-fila">
          <label>Nombre<input value={form.nombre} onChange={set("nombre")} required /></label>
          <label>Número<input type="number" min="1" value={form.numero} onChange={set("numero")} /></label>
        </div>
        <label>Dirección<input value={form.direccion} onChange={set("direccion")} /></label>
        <div className="form-fila">
          <label>Tipología<input value={form.tipologia} onChange={set("tipologia")} placeholder="2D2B" /></label>
          <label>m²<input type="number" min="0" value={form.metrosCuadrados} onChange={set("metrosCuadrados")} /></label>
          <label>Precio por noche (CLP)<input type="number" min="0" value={form.precio} onChange={set("precio")} /></label>
        </div>
        <label>URL de la foto<input type="url" value={form.imagenUrl} onChange={set("imagenUrl")} placeholder="https://…" /></label>
        <button className="btn btn-primario btn-inline" disabled={!form.nombre}>Crear departamento</button>
      </form>

      <div className="tabla-wrap">
        <table className="tabla">
          <thead><tr><th>Nombre</th><th>N°</th><th>Tipología</th><th>Precio</th><th></th></tr></thead>
          <tbody>
            {deptos.map((d) => (
              <tr key={d.idDepartamento}>
                <td>{d.nombre}</td><td>{d.numero}</td><td>{d.tipologia}</td><td>{clp(d.precio)}</td>
                <td><button className="btn btn-peligro btn-chico" onClick={() => eliminar(d)}>Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Reservas({ reservas, deptos, arrendatarios, recargar, avisar }) {
  const cambiarEstado = async (r, estado) => {
    try {
      await api.put(`/api/reservas/${r.idReserva}`, { ...r, estado });
      avisar("ok", `Reserva #${r.idReserva}: ${estado}`);
      recargar();
    } catch (err) {
      avisar("error", mensajeDeError(err));
    }
  };
  const nombreDepto = (id) => deptos.find((d) => d.idDepartamento === id)?.nombre || `#${id}`;
  const nombreArr = (id) => {
    const a = arrendatarios.find((x) => x.idArrendatario === id);
    return a ? `${a.nombre} ${a.apellido}` : `#${id}`;
  };

  if (reservas.length === 0) return <p className="vacio">No hay reservas todavía.</p>;
  return (
    <div className="tabla-wrap">
      <table className="tabla">
        <thead><tr><th>#</th><th>Departamento</th><th>Arrendatario</th><th>Fechas</th><th>Estado</th></tr></thead>
        <tbody>
          {reservas.map((r) => (
            <tr key={r.idReserva}>
              <td>{r.idReserva}</td>
              <td>{nombreDepto(r.idDepartamento)}</td>
              <td>{nombreArr(r.idArrendatario)}</td>
              <td>{fecha(r.fechaInicio)} → {fecha(r.fechaFin)}</td>
              <td>
                <select value={r.estado} onChange={(e) => cambiarEstado(r, e.target.value)}>
                  {ESTADOS.map((e) => <option key={e}>{e}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Arrendatarios({ arrendatarios }) {
  return (
    <div className="tabla-wrap">
      <table className="tabla">
        <thead><tr><th>Nombre</th><th>Email</th><th>Teléfono</th></tr></thead>
        <tbody>
          {arrendatarios.map((a) => (
            <tr key={a.idArrendatario}><td>{a.nombre} {a.apellido}</td><td>{a.email}</td><td>{a.telefono}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState("reservas");
  const [datos, setDatos] = useState({ deptos: [], reservas: [], arrendatarios: [] });
  const [aviso, setAviso] = useState(null);

  const recargar = useCallback(() => {
    Promise.all([api.get("/api/departamentos", { params: { limite: 100 } }), api.get("/api/reservas"), api.get("/api/arrendatarios")])
      .then(([d, r, a]) => setDatos({ deptos: d.data, reservas: r.data, arrendatarios: a.data }))
      .catch((err) => setAviso({ tipo: "error", texto: mensajeDeError(err) }));
  }, []);

  useEffect(() => { recargar(); }, [recargar]);

  const avisar = (tipo, texto) => {
    setAviso({ tipo, texto });
    setTimeout(() => setAviso(null), 3500);
  };

  const tabs = [
    ["reservas", `Reservas (${datos.reservas.length})`],
    ["departamentos", `Departamentos (${datos.deptos.length})`],
    ["arrendatarios", `Arrendatarios (${datos.arrendatarios.length})`],
  ];

  return (
    <div className="container">
      <h1 className="titulo-pagina">Panel de administración</h1>
      <div className="tabs" role="tablist">
        {tabs.map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id}
                  className={`tab ${tab === id ? "activa" : ""}`} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>
      {aviso && <div className={`alerta alerta-${aviso.tipo}`}>{aviso.texto}</div>}
      {tab === "reservas" && <Reservas {...datos} recargar={recargar} avisar={avisar} />}
      {tab === "departamentos" && <Departamentos deptos={datos.deptos} recargar={recargar} avisar={avisar} />}
      {tab === "arrendatarios" && <Arrendatarios arrendatarios={datos.arrendatarios} />}
    </div>
  );
}
