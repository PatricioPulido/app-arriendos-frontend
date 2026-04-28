// src/components/Footer.jsx
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
// src/components/Footer.jsx (agregá esta línea al principio)
import "./Footer.css";
export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Tus datos reales
  const instagramUrl = "https://www.instagram.com/studio_vistacordillera";
  const whatsappUrl = "https://wa.me/56949384318?text=Hola%20me%20interesa%20el%20depto%20en%20Villarrica";

  return (
    <footer id="contacto" className="footer">
      <div className="footer-content">
        <p className="copyright">
          © {currentYear} Studio Vista Cordillera. Todos los derechos reservados.
        </p>

        <div className="social-links">
          <a 
            href={instagramUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-icon instagram"
          >
            <FaInstagram />
            <span>@studio_vistacordillera</span>
          </a>

          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-icon whatsapp"
          >
            <FaWhatsapp />
            <span>+569 4938 4318</span>
          </a>
        </div>
      </div>
      <br />
      <p className="copyright">App chilena para arriendos sin comisión</p>
    </footer>
  );
}