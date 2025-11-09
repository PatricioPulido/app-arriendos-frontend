// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} MiApp. Todos los derechos reservados.</p>
      <div className="socials">
        <a href="https://facebook.com" target="_blank">Facebook</a> |
        <a href="https://instagram.com" target="_blank">Instagram</a> |
        <a href="mailto:contacto@miapp.com">Email</a>
      </div>
    </footer>
  );
}
