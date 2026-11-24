import { useEffect } from "react";
import { X } from "lucide-react";

/** Ventana sobre la pagina. Se cierra con la X, con Esc o tocando el fondo. */
export default function Modal({ titulo, onCerrar, children, className = "" }) {
  useEffect(() => {
    const alTeclear = (e) => { if (e.key === "Escape") onCerrar(); };
    document.addEventListener("keydown", alTeclear);
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // que no se mueva la pagina de atras
    return () => {
      document.removeEventListener("keydown", alTeclear);
      document.body.style.overflow = antes;
    };
  }, [onCerrar]);

  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <div className={`modal ${className}`} role="dialog" aria-modal="true" aria-label={titulo}
           onClick={(e) => e.stopPropagation()}>
        <div className="modal-cabecera">
          <button type="button" className="boton-icono" onClick={onCerrar} aria-label="Cerrar"><X size={20} /></button>
          {titulo && <h2>{titulo}</h2>}
        </div>
        <div className="modal-cuerpo">{children}</div>
      </div>
    </div>
  );
}
