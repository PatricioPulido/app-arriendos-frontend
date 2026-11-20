import { render, screen } from "@testing-library/react";
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
