import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";

function App() {
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Búsqueda mejorada que puede recibir ciudad o región
  const fetchDepartamentos = (searchTerm = "") => {
    setLoading(true);

    // Si el searchTerm está vacío, cargar todos los departamentos
    if (!searchTerm) {
      axios
        .get("http://localhost:8080/api/departamentos")
        .then((res) => {
          setDepartamentos(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error al cargar los departamentos:", err);
          setLoading(false);
        });
      return;
    }

    // Si hay searchTerm, buscar por ciudad
    axios
      .get("http://localhost:8080/api/departamentos", {
        params: { ciudad: searchTerm },
      })
      .then((res) => {
        setDepartamentos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar los departamentos:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  if (loading) return <p className="loading">Cargando departamentos...</p>;

  const handleWhatsApp = (dpto) => {
    const numero = "56912345678"; // 🔥 CAMBIA ESTO

    const mensaje = `Hola! 👋 Me interesa el departamento "${dpto.nombre}" en ${dpto.direccion} 🏠. ¿Está disponible?`;

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");
  };

  const handleReservaFutura = () => {
    alert("💳 Reserva online en construcción.\nPor ahora contáctanos por WhatsApp 📲");
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>🏠 Arriendos disponibles</h1>

        <SearchBar onSearch={fetchDepartamentos} />

        <div className="grid">
          {departamentos.length > 0 ? (
            departamentos.map((dpto) => (
              <div key={dpto.idDepartamento} className="card">
                <img
                  src={
                    dpto.imagenUrl ||
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
                  }
                  alt={dpto.nombre}
                />
                <div className="card-body">
                  <h2>{dpto.nombre}</h2>
                  <p className="direccion">{dpto.direccion}</p>
                  <p className="detalle">
                    🏠 {dpto.tipologia} | 📐 {dpto.metrosCuadrados} m²
                  </p>
                  <p className="numero">N° {dpto.numero}</p>
                  <p className="precio">
                    {dpto.precio?.toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP",
                      minimumFractionDigits: 0,
                    })}{" "}
                    por noche
                  </p>
                  <div className="card-buttons">
                    <button
                      className="btn-wsp"
                      onClick={() => handleWhatsApp(dpto)}
                    >
                      📲 WhatsApp
                    </button>

                    <button
                      className="btn-reservar"
                      onClick={handleReservaFutura}
                    >
                      💳 Reservar ahora
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="loading">No se encontraron departamentos</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;