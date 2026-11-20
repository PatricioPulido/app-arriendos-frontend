export const clp = (n) =>
  n == null || n === ""
    ? null
    : Number(n).toLocaleString("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 });

export const fecha = (iso) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" }) : "";

export const hoyISO = () => new Date().toISOString().slice(0, 10);

export const FOTO_POR_DEFECTO = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800";

/** "4 huéspedes · 2 dormitorios · 1 baño" con lo que tenga la propiedad. */
export const resumenDepto = (d) =>
  [
    d.capacidad && `${d.capacidad} ${d.capacidad === 1 ? "huésped" : "huéspedes"}`,
    d.dormitorios != null && `${d.dormitorios} ${d.dormitorios === 1 ? "dormitorio" : "dormitorios"}`,
    d.banos != null && `${d.banos} ${d.banos === 1 ? "baño" : "baños"}`,
    d.metrosCuadrados && `${d.metrosCuadrados} m²`,
  ]
    .filter(Boolean)
    .join(" · ");

export const ubicacion = (d) => [d.nombreZona, d.nombreCiudad].filter(Boolean).join(", ");

export const noches = (inicio, fin) =>
  inicio && fin ? Math.round((new Date(fin) - new Date(inicio)) / 86400000) : 0;
