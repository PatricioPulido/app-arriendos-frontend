export const clp = (n) =>
  n == null || n === ""
    ? null
    : Number(n).toLocaleString("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 });

export const fecha = (iso) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" }) : "";

export const hoyISO = () => new Date().toISOString().slice(0, 10);

export const FOTO_POR_DEFECTO = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800";
