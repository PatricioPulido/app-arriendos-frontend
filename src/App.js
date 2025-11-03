import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  if (loading) return <p className="loading">Cargando departamentos...</p>;

  return (
    <div className="container">
      <h1>🏠 Arriendos disponibles</h1>
      <div className="grid">
        {departamentos.map((dpto) => (
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
              <button>Ver detalles</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
