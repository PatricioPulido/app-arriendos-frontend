import { useState } from "react";
import { Search } from "lucide-react";
import { hoyISO } from "../format";

/**
 * Buscador estilo Airbnb: destino, fechas y huespedes. Entrega un objeto con los
 * filtros que tengan valor; el backend acepta: ciudad, llegada, salida, huespedes,
 * precioMax, dormitorios, orden (ver DepartamentoController).
 */
export default function SearchBar({ onSearch }) {
  const [f, setF] = useState({ ciudad: "", llegada: "", salida: "", huespedes: "" });
  const set = (c) => (e) => setF({ ...f, [c]: e.target.value });

  const buscar = (e) => {
    e.preventDefault();
    const filtros = Object.fromEntries(Object.entries(f).filter(([, v]) => v !== ""));
    // Las fechas solo filtran si vienen las dos
    if (!filtros.llegada || !filtros.salida) {
      delete filtros.llegada;
      delete filtros.salida;
    }
    onSearch(filtros);
  };

  return (
    <form className="search-bar" onSubmit={buscar} role="search">
      <label className="sb-campo sb-destino">
        <span>Destino</span>
        <input type="text" placeholder="¿A dónde vas?" value={f.ciudad} onChange={set("ciudad")} />
      </label>
      <label className="sb-campo">
        <span>Llegada</span>
        <input type="date" min={hoyISO()} value={f.llegada} onChange={set("llegada")} />
      </label>
      <label className="sb-campo">
        <span>Salida</span>
        <input type="date" min={f.llegada || hoyISO()} value={f.salida} onChange={set("salida")} />
      </label>
      <label className="sb-campo sb-chico">
        <span>Huéspedes</span>
        <input type="number" min="1" max="50" placeholder="¿Cuántos?" value={f.huespedes} onChange={set("huespedes")} />
      </label>
      <button type="submit" aria-label="Buscar"><Search size={18} /> <span>Buscar</span></button>
    </form>
  );
}
