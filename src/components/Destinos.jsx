import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { DESTINOS, RUTAS } from "../destinos";
import Atractivo from "./Atractivo";
import EscenaDestino from "./EscenaDestino";
import "./Destinos.css";

/** Agrega la clase "visible" cuando el elemento entra en pantalla (animacion de aparicion). */
export function useAparecer() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("visible");
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/** Fondo del destino: foto real si la tiene, si no la ilustracion animada de su paisaje. */
export function FondoDestino({ destino }) {
  return destino.foto ? (
    <img className="escena" src={destino.foto} alt="" loading="lazy" />
  ) : (
    <EscenaDestino paisaje={destino.paisaje} />
  );
}

/**
 * "Explora por destino": pestañas por ruta (litoral, Santiago, sur) y tarjetas grandes
 * con la ilustracion del lugar. Al tocar una, onElegir(destino) filtra los alojamientos.
 */
export default function Destinos({ conteo = {}, onElegir, activo }) {
  const [ruta, setRuta] = useState("todas");
  const carrusel = useRef(null);
  const seccion = useAparecer();
  const lista = ruta === "todas" ? DESTINOS : DESTINOS.filter((d) => d.ruta === ruta);
  const lema = RUTAS.find((r) => r.id === ruta)?.lema || "Elige un lugar y te mostramos dónde quedarte";

  const mover = (dir) => carrusel.current?.scrollBy({ left: dir * carrusel.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <section className="destinos aparecer" ref={seccion} aria-labelledby="titulo-destinos">
      <div className="destinos-cabecera">
        <div>
          <h2 id="titulo-destinos">Explora por destino</h2>
          <p key={ruta} className="destinos-lema">{lema}</p>
        </div>
        <div className="destinos-flechas">
          <button type="button" onClick={() => mover(-1)} aria-label="Anteriores"><ChevronLeft size={18} /></button>
          <button type="button" onClick={() => mover(1)} aria-label="Siguientes"><ChevronRight size={18} /></button>
        </div>
      </div>

      <div className="rutas" role="tablist" aria-label="Rutas">
        {[{ id: "todas", nombre: "Todos" }, ...RUTAS].map((r) => (
          <button key={r.id} type="button" role="tab" aria-selected={ruta === r.id}
                  className={`ruta ${ruta === r.id ? "activa" : ""}`}
                  onClick={() => {
                    setRuta(r.id);
                    carrusel.current?.scrollTo({ left: 0 });
                  }}>
            {r.nombre}
          </button>
        ))}
      </div>

      <div className="destinos-carrusel" ref={carrusel} key={ruta}>
        {lista.map((d, i) => {
          const n = conteo[d.ciudad] || 0;
          return (
            <button key={d.ciudad} type="button" style={{ "--i": i }}
                    className={`destino ${activo === d.ciudad ? "activo" : ""}`}
                    onClick={() => onElegir?.(d)} aria-pressed={activo === d.ciudad}>
              <FondoDestino destino={d} />
              <Atractivo atractivo={{ texto: d.etiqueta[0], icono: d.etiqueta[1] }} className="destino-etiqueta" />
              <span className="destino-texto">
                <strong>{d.ciudad}</strong>
                <span className="destino-lema">{d.lema}</span>
                <span className="destino-pie">
                  <MapPin size={13} aria-hidden="true" /> {d.region}
                  <span className="destino-conteo">
                    {n ? `${n} ${n === 1 ? "alojamiento" : "alojamientos"}` : "Próximamente"}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
