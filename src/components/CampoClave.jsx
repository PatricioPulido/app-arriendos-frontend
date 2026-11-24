import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Campo de contraseña con boton de ojo para mostrarla u ocultarla.
 * Recibe las mismas props que un <input> (value, onChange, autoComplete...).
 */
export default function CampoClave({ label, extra, ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <label>
      <span>{label}{extra}</span>
      <div className="campo-clave">
        <input {...props} type={visible ? "text" : "password"} />
        <button type="button" className="ver-clave"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
                aria-pressed={visible}
                title={visible ? "Ocultar contraseña" : "Mostrar contraseña"}>
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </label>
  );
}
