import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MisReservasPage from "./pages/MisReservasPage";
import AdminPage from "./pages/AdminPage";

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
          <Route element={<LayoutConMenu />}>
            <Route path="/" element={<HomePage />} />
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
