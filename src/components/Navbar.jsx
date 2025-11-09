import { useState } from "react";
import { Menu, X } from "lucide-react"; // npm install lucide-react
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">Arrienda tu nuevo paraíso</div>

      {/* Botón hamburguesa visible solo en móviles */}
      <button
        className="menu-btn"
        onClick={() => setOpen(!open)}
        aria-label="Abrir menú"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      <ul className={`menu ${open ? "open" : ""}`}>
        <li><a href="/">Inicio</a></li>
        <li><a href="/contacto">Contacto</a></li>
        <li><a href="/login">Iniciar sesión</a></li>
      </ul>
    </nav>
  );
}
