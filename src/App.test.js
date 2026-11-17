import { render, screen } from "@testing-library/react";
import App from "./App";
import api, { refreshSession } from "./api/client";

jest.mock("./api/client", () => {
  const api = { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() };
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
  api.get.mockResolvedValue({ data: [{ idDepartamento: 1, nombre: "Depto Vista Mar", precio: 45000 }] });
});

test("sin sesion muestra el catalogo y el boton para iniciar sesion", async () => {
  render(<App />);
  expect(await screen.findByText("Depto Vista Mar")).toBeInTheDocument();
  expect(screen.getByText("Inicia sesión para reservar")).toBeInTheDocument();
  expect(screen.getAllByText("Iniciar sesión").length).toBeGreaterThan(0);
});
