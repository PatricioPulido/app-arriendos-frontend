import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { FOTO_POR_DEFECTO } from "../format";
import "../ficha/Ficha.css";

/**
 * Galeria estilo Airbnb:
 * - Computador: mosaico (1 foto grande + hasta 4 chicas) y boton "Ver las N fotos".
 * - Celular: carrusel que se desliza con el dedo.
 * - Tocar una foto abre el visor a pantalla completa (flechas, Esc, deslizar).
 */
export default function Galeria({ imagenes, alt }) {
  const fotos = imagenes?.length ? imagenes.map((i) => i.url) : [FOTO_POR_DEFECTO];
  const total = fotos.length;
  const [visor, setVisor] = useState(null); // indice de la foto abierta, o null
  const [actualCarrusel, setActualCarrusel] = useState(0);
  const carrusel = useRef(null);

  const enMosaico = total >= 5 ? 5 : total >= 3 ? 3 : total;
  const onScroll = () => {
    const el = carrusel.current;
    if (el) setActualCarrusel(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div className="galeria-ficha">
      <div className={`galeria-mosaico mosaico-${enMosaico}`}>
        {fotos.slice(0, enMosaico).map((url, i) => (
          <button key={url} type="button" onClick={() => setVisor(i)} aria-label={`Ver foto ${i + 1} de ${total}`}>
            <img src={url} alt={i === 0 ? alt : ""} loading={i === 0 ? "eager" : "lazy"} />
          </button>
        ))}
        {total > 1 && (
          <button type="button" className="galeria-ver-todas" onClick={() => setVisor(0)}>
            <Images size={16} /> Ver las {total} fotos
          </button>
        )}
      </div>

      <div className="galeria-carrusel-wrap">
        <div className="galeria-carrusel" ref={carrusel} onScroll={onScroll}>
          {fotos.map((url, i) => (
            <button key={url} type="button" onClick={() => setVisor(i)} aria-label={`Ver foto ${i + 1} de ${total}`}>
              <img src={url} alt={i === 0 ? alt : ""} loading={i === 0 ? "eager" : "lazy"} />
            </button>
          ))}
        </div>
        {total > 1 && <span className="galeria-contador">{actualCarrusel + 1} / {total}</span>}
      </div>

      {visor != null && <Visor fotos={fotos} inicial={visor} alt={alt} onCerrar={() => setVisor(null)} />}
    </div>
  );
}

function Visor({ fotos, inicial, alt, onCerrar }) {
  const [actual, setActual] = useState(inicial);
  const total = fotos.length;
  const mover = useCallback((delta) => setActual((i) => (i + delta + total) % total), [total]);
  const toqueX = useRef(null);

  useEffect(() => {
    const alTeclear = (e) => {
      if (e.key === "Escape") onCerrar();
      if (e.key === "ArrowLeft") mover(-1);
      if (e.key === "ArrowRight") mover(1);
    };
    document.addEventListener("keydown", alTeclear);
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alTeclear);
      document.body.style.overflow = antes;
    };
  }, [mover, onCerrar]);

  // Deslizar con el dedo: mas de 40px hacia un lado cambia de foto
  const onTouchStart = (e) => { toqueX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (toqueX.current == null) return;
    const dx = e.changedTouches[0].clientX - toqueX.current;
    if (Math.abs(dx) > 40) mover(dx < 0 ? 1 : -1);
    toqueX.current = null;
  };

  return (
    <div className="visor" role="dialog" aria-modal="true" aria-label="Fotos del alojamiento"
         onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="visor-barra">
        <button type="button" className="visor-boton" onClick={onCerrar} aria-label="Cerrar"><X size={22} /></button>
        <span>{actual + 1} / {total}</span>
        <span />
      </div>
      <div className="visor-foto">
        <img src={fotos[actual]} alt={`${alt} - foto ${actual + 1} de ${total}`} />
        {total > 1 && (
          <>
            <button type="button" className="visor-boton visor-flecha izq" onClick={() => mover(-1)} aria-label="Foto anterior"><ChevronLeft size={26} /></button>
            <button type="button" className="visor-boton visor-flecha der" onClick={() => mover(1)} aria-label="Foto siguiente"><ChevronRight size={26} /></button>
          </>
        )}
      </div>
      {total > 1 && (
        <div className="visor-miniaturas">
          {fotos.map((url, i) => (
            <button key={url} type="button" className={i === actual ? "activa" : ""} onClick={() => setActual(i)} aria-label={`Ver foto ${i + 1}`}>
              <img src={url} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
