import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api, { refreshSession, setAccessToken, setOnSessionExpired } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  // true mientras se intenta recuperar la sesion al cargar la pagina
  const [cargando, setCargando] = useState(true);

  const aplicarSesion = useCallback((data) => {
    setAccessToken(data.accessToken);
    setUsuario(data.usuario);
    return data.usuario;
  }, []);

  // Al abrir la app, si hay cookie de refresh valida, se recupera la sesion sin pedir clave
  useEffect(() => {
    setOnSessionExpired(() => setUsuario(null));
    refreshSession()
      .then((data) => setUsuario(data.usuario))
      .catch(() => setUsuario(null))
      .finally(() => setCargando(false));
  }, []);

  const login = useCallback(
    async (email, password) => {
      const { data } = await api.post("/api/auth/login", { email, password });
      return aplicarSesion(data);
    },
    [aplicarSesion]
  );

  const register = useCallback(
    async (datos) => {
      const { data } = await api.post("/api/auth/register", datos);
      return aplicarSesion(data);
    },
    [aplicarSesion]
  );

  /** Un huesped activa su cuenta de anfitrion; el backend entrega tokens con el rol nuevo. */
  const hacermeAnfitrion = useCallback(async () => {
    const { data } = await api.post("/api/auth/hacerme-anfitrion");
    return aplicarSesion(data);
  }, [aplicarSesion]);

  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
      setAccessToken(null);
      setUsuario(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      usuario,
      cargando,
      login,
      register,
      logout,
      hacermeAnfitrion,
      esAdmin: usuario?.rol === "ADMIN",
      // ADMIN tambien puede publicar y gestionar propiedades
      esAnfitrion: usuario?.rol === "ANFITRION" || usuario?.rol === "ADMIN",
    }),
    [usuario, cargando, login, register, logout, hacermeAnfitrion]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
