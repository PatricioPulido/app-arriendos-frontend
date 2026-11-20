import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImagePlus, Star, Trash2 } from "lucide-react";
import api, { mensajeDeError } from "../api/client";

const MAX_MB = 5;
const TIPOS = ["image/jpeg", "image/png", "image/webp"];

/**
 * Gestiona las fotos de una propiedad: subir varias, borrar, mover y elegir portada
 * (la primera). Cada cambio se guarda al tiro en el backend.
 */
export default function GaleriaEditor({ idDepartamento, imagenes, onChange }) {
  const input = useRef(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

  const subir = async (archivos) => {
    setError("");
    const lista = Array.from(archivos || []);
    if (lista.length === 0) return;
    const malo = lista.find((f) => !TIPOS.includes(f.type) || f.size > MAX_MB * 1024 * 1024);
    if (malo) {
      setError(`"${malo.name}": solo JPG, PNG o WebP de hasta ${MAX_MB} MB.`);
      return;
    }
    const form = new FormData();
    lista.forEach((f) => form.append("archivos", f));
    setSubiendo(true);
    try {
      const { data } = await api.post(`/api/departamentos/${idDepartamento}/imagenes`, form);
      onChange(data);
    } catch (err) {
      setError(mensajeDeError(err, "No se pudieron subir las fotos"));
    } finally {
      setSubiendo(false);
      if (input.current) input.current.value = "";
    }
  };

  const borrar = async (img) => {
    if (!window.confirm("¿Eliminar esta foto?")) return;
    try {
      const { data } = await api.delete(`/api/departamentos/${idDepartamento}/imagenes/${img.idImagen}`);
      onChange(data);
    } catch (err) {
      setError(mensajeDeError(err));
    }
  };

  const reordenar = async (ids) => {
    try {
      const { data } = await api.put(`/api/departamentos/${idDepartamento}/imagenes/orden`, ids);
      onChange(data);
    } catch (err) {
      setError(mensajeDeError(err));
    }
  };

  const ids = imagenes.map((i) => i.idImagen);
  const mover = (i, delta) => {
    const nuevo = [...ids];
    [nuevo[i], nuevo[i + delta]] = [nuevo[i + delta], nuevo[i]];
    reordenar(nuevo);
  };
  const portada = (i) => reordenar([ids[i], ...ids.filter((_, j) => j !== i)]);

  return (
    <div className="galeria-editor">
      {error && <div className="alerta alerta-error">{error}</div>}
      <div className="galeria-editor-grid">
        {imagenes.map((img, i) => (
          <figure key={img.idImagen} className={i === 0 ? "es-portada" : ""}>
            <img src={img.url} alt={`Foto ${i + 1}`} />
            {i === 0 && <span className="etiqueta-portada">Portada</span>}
            <figcaption>
              <button type="button" onClick={() => mover(i, -1)} disabled={i === 0} aria-label="Mover a la izquierda"><ChevronLeft size={16} /></button>
              <button type="button" onClick={() => portada(i)} disabled={i === 0} aria-label="Usar de portada" title="Usar de portada"><Star size={16} /></button>
              <button type="button" onClick={() => mover(i, 1)} disabled={i === imagenes.length - 1} aria-label="Mover a la derecha"><ChevronRight size={16} /></button>
              <button type="button" onClick={() => borrar(img)} aria-label="Eliminar foto" className="peligro"><Trash2 size={16} /></button>
            </figcaption>
          </figure>
        ))}
        <button type="button" className="galeria-agregar"
                onClick={() => input.current?.click()} disabled={subiendo}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); subir(e.dataTransfer.files); }}>
          <ImagePlus size={28} />
          <span>{subiendo ? "Subiendo…" : "Agregar fotos"}</span>
          <small>o arrástralas aquí</small>
        </button>
      </div>
      <input ref={input} type="file" accept={TIPOS.join(",")} multiple hidden onChange={(e) => subir(e.target.files)} />
      <p className="ayuda">JPG, PNG o WebP, hasta {MAX_MB} MB cada una y 20 por propiedad. La primera es la portada.</p>
    </div>
  );
}
