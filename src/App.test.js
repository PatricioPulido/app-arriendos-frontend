import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import api, { refreshSession } from "./api/client";

jest.mock("./api/client", () => {
  const api = { get: jest.fn(), post: jest.fn(), put: jest.fn(), patch: jest.fn(), delete: jest.fn() };
  return {
    __esModule: true,
    default: api,
    refreshSession: jest.fn(),
    setAccessToken: jest.fn(),
    setOnSessionExpired: jest.fn(),
    mensajeDeError: (e, d) => d,
  };
});

// react-scripts reinicia los mocks antes de cada test, por eso se configuran aqui
beforeEach(() => {
  refreshSession.mockRejectedValue(new Error("sin sesion"));
  api.get.mockResolvedValue({
    data: [{ idDepartamento: 1, nombre: "Depto Vista Mar", precio: 45000, capacidad: 4, nombreCiudad: "Viña del Mar" }],
  });
});

test("sin sesion muestra el catalogo con enlace al detalle", async () => {
  window.history.pushState({}, "", "/");
  render(<App />);
  expect(await screen.findByText("Depto Vista Mar")).toBeInTheDocument();
  expect(screen.getByText("4 huéspedes")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Depto Vista Mar/ })).toHaveAttribute("href", "/departamentos/1");
  expect(screen.getAllByText("Iniciar sesión").length).toBeGreaterThan(0);
  expect(screen.getAllByText("Publica tu propiedad").length).toBeGreaterThan(0);
});

test("el registro deja elegir entre reservar y publicar", async () => {
  window.history.pushState({}, "", "/registro?tipo=anfitrion");
  render(<App />);
  const publicar = await screen.findByRole("radio", { name: /Quiero publicar/ });
  expect(publicar).toHaveAttribute("aria-checked", "true");
  expect(screen.getByRole("radio", { name: /Quiero reservar/ })).toHaveAttribute("aria-checked", "false");
});

test("el login deja ver la contraseña y tiene enlace para recuperarla", async () => {
  window.history.pushState({}, "", "/login");
  render(<App />);
  const clave = await screen.findByLabelText("Contraseña");
  expect(clave).toHaveAttribute("type", "password");
  fireEvent.click(screen.getByRole("button", { name: "Mostrar contraseña" }));
  expect(clave).toHaveAttribute("type", "text");
  fireEvent.click(screen.getByRole("button", { name: "Ocultar contraseña" }));
  expect(clave).toHaveAttribute("type", "password");
  expect(screen.getByRole("link", { name: "¿Olvidaste tu contraseña?" })).toHaveAttribute("href", "/recuperar-contrasena");
});

test("recuperar contraseña envia el email y muestra el aviso", async () => {
  api.post.mockResolvedValue({ data: { mensaje: "Si existe una cuenta con ese email, te enviamos un enlace." } });
  window.history.pushState({}, "", "/recuperar-contrasena");
  render(<App />);
  fireEvent.change(await screen.findByLabelText("Email"), { target: { value: "ana@test.cl" } });
  fireEvent.click(screen.getByRole("button", { name: "Enviar enlace" }));
  expect(await screen.findByText(/te enviamos un enlace/)).toBeInTheDocument();
  expect(api.post).toHaveBeenCalledWith("/api/auth/recuperar", { email: "ana@test.cl" });
});

test("el enlace del correo permite guardar una nueva contraseña", async () => {
  api.post.mockResolvedValue({ data: { mensaje: "Listo, tu contraseña se cambió." } });
  window.history.pushState({}, "", "/restablecer-contrasena?token=abc123");
  render(<App />);
  fireEvent.change(await screen.findByLabelText("Nueva contraseña"), { target: { value: "clave-nueva-1" } });
  fireEvent.change(screen.getByLabelText("Repite la contraseña"), { target: { value: "clave-nueva-1" } });
  fireEvent.click(screen.getByRole("button", { name: "Guardar contraseña" }));
  expect(await screen.findByText("Listo, tu contraseña se cambió.")).toBeInTheDocument();
  expect(api.post).toHaveBeenCalledWith("/api/auth/restablecer", { token: "abc123", password: "clave-nueva-1" });
  expect(window.location.search).toBe("");
});
