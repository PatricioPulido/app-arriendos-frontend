import { LEMA, MARCA } from "../marca";
// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} {MARCA} · {LEMA}. Todos los derechos reservados.</p>
      <div className="socials">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a> |
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a> |
        <a href="mailto:contacto@miapp.com">Email</a>
      </div>
    </footer>
  );
}
