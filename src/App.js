import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RecuperarPage from "./pages/RecuperarPage";
import RestablecerPage from "./pages/RestablecerPage";
import MisReservasPage from "./pages/MisReservasPage";
import AdminPage from "./pages/AdminPage";
import DepartamentoPage from "./pages/DepartamentoPage";
import AnfitrionPage from "./pages/AnfitrionPage";
import PropiedadFormPage from "./pages/PropiedadFormPage";

const ANFITRIONES = ["ANFITRION", "ADMIN"];

function LayoutConMenu() {
  return (
    <>
      <Navbar />
      <main className="contenido"><Outlet /></main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/recuperar-contrasena" element={<RecuperarPage />} />
          <Route path="/restablecer-contrasena" element={<RestablecerPage />} />
          <Route element={<LayoutConMenu />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/departamentos/:id" element={<DepartamentoPage />} />
            {/* Un huesped que entra a /anfitrion ve la invitacion a publicar */}
            <Route path="/anfitrion" element={<ProtectedRoute><AnfitrionPage /></ProtectedRoute>} />
            <Route path="/anfitrion/propiedades/nueva" element={<ProtectedRoute rol={ANFITRIONES}><PropiedadFormPage /></ProtectedRoute>} />
            <Route path="/anfitrion/propiedades/:id" element={<ProtectedRoute rol={ANFITRIONES}><PropiedadFormPage key="editar" /></ProtectedRoute>} />
            <Route path="/mis-reservas" element={<ProtectedRoute><MisReservasPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute rol="ADMIN"><AdminPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
