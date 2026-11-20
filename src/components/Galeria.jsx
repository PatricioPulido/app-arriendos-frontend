import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FOTO_POR_DEFECTO } from "../format";

/** Foto grande con flechas y miniaturas. Teclado: flechas izquierda/derecha. */
export default function Galeria({ imagenes, alt }) {
  const fotos = imagenes?.length ? imagenes.map((i) => i.url) : [FOTO_POR_DEFECTO];
  const [actual, setActual] = useState(0);
  const total = fotos.length;
  const mover = (delta) => setActual((i) => (i + delta + total) % total);

  useEffect(() => setActual(0), [total]);

  return (
    <div className="galeria"
         onKeyDown={(e) => { if (e.key === "ArrowLeft") mover(-1); if (e.key === "ArrowRight") mover(1); }}>
      <div className="galeria-principal">
        <img src={fotos[actual]} alt={`${alt} - foto ${actual + 1} de ${total}`} />
        {total > 1 && (
          <>
            <button type="button" className="galeria-flecha izq" onClick={() => mover(-1)} aria-label="Foto anterior">
              <ChevronLeft size={22} />
            </button>
            <button type="button" className="galeria-flecha der" onClick={() => mover(1)} aria-label="Foto siguiente">
              <ChevronRight size={22} />
            </button>
            <span className="galeria-contador">{actual + 1} / {total}</span>
          </>
        )}
      </div>
      {total > 1 && (
        <div className="galeria-miniaturas">
          {fotos.map((url, i) => (
            <button key={url} type="button" className={i === actual ? "activa" : ""} onClick={() => setActual(i)}
                    aria-label={`Ver foto ${i + 1}`}>
              <img src={url} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
