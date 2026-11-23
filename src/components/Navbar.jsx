import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { usuario, esAdmin, esAnfitrion, logout } = useAuth();
  const navigate = useNavigate();
  const cerrar = () => setOpen(false);

  const salir = async () => {
    cerrar();
    await logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo" onClick={cerrar}>Arrienda tu nuevo paraíso</Link>

      <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Abrir menú">
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      <ul className={`menu ${open ? "open" : ""}`}>
        <li><NavLink to="/" end onClick={cerrar}>Inicio</NavLink></li>
        {usuario && <li><NavLink to="/mis-reservas" onClick={cerrar}>Mis reservas</NavLink></li>}
        {usuario && (
          <li><NavLink to="/anfitrion" onClick={cerrar}>{esAnfitrion ? "Mis propiedades" : "Publica tu propiedad"}</NavLink></li>
        )}
        {esAdmin && <li><NavLink to="/admin" onClick={cerrar}>Administración</NavLink></li>}
        {usuario ? (
          <>
            <li className="usuario"><User size={16} /> {usuario.email}</li>
            <li><button className="link-btn" onClick={salir}><LogOut size={16} /> Salir</button></li>
          </>
        ) : (
          <>
            <li><NavLink to="/registro?tipo=anfitrion" onClick={cerrar}>Publica tu propiedad</NavLink></li>
            <li><NavLink to="/login" onClick={cerrar}>Iniciar sesión</NavLink></li>
            <li><Link to="/registro" className="btn-nav" onClick={cerrar}>Crear cuenta</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
