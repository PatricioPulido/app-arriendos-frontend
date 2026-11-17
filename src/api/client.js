// Cliente HTTP unico para hablar con el backend.
// - El access token vive SOLO en memoria (no en localStorage) para que un script
//   malicioso no pueda robarlo.
// - El refresh token esta en una cookie HttpOnly que maneja el navegador.
// - Si una peticion responde 401, se renueva el token una vez y se reintenta.
import axios from "axios";

// En produccion (Vercel) el front llama a /api del mismo dominio y vercel.json lo
// reenvia al backend: la cookie del refresh queda "propia" y no hace falta CORS.
// En desarrollo apunta al backend local. REACT_APP_API_URL sobreescribe ambos.
const DEFAULT_API_URL = process.env.NODE_ENV === "production" ? "" : "http://localhost:8080";
export const API_URL = (process.env.REACT_APP_API_URL ?? DEFAULT_API_URL).replace(/\/$/, "");

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // necesario para que viaje la cookie del refresh token
});

let accessToken = null;
let onSessionExpired = () => {};
let refreshPromise = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function setOnSessionExpired(fn) {
  onSessionExpired = fn;
}

/**
 * Pide un access token nuevo usando la cookie. Si hay varias llamadas a la vez
 * (por ejemplo, varias peticiones vencidas o el doble render de React en desarrollo)
 * comparten la misma peticion: el backend rota el refresh token y un segundo uso
 * del token viejo cerraria todas las sesiones.
 */
export function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${API_URL}/api/auth/refresh`, null, { withCredentials: true })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        return res.data;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const esAuth = original?.url?.includes("/api/auth/");
    if (status === 401 && accessToken && !original._reintento && !esAuth) {
      original._reintento = true;
      try {
        await refreshSession();
        return api(original);
      } catch (e) {
        setAccessToken(null);
        onSessionExpired();
      }
    }
    return Promise.reject(error);
  }
);

/** Mensaje legible a partir de un error del backend. */
export function mensajeDeError(error, porDefecto = "Ocurrió un error inesperado") {
  const data = error?.response?.data;
  if (data?.errores) return Object.values(data.errores).join(". ");
  if (data?.mensaje) return data.mensaje;
  if (!error?.response) return "No se pudo conectar con el servidor";
  return porDefecto;
}

export default api;
