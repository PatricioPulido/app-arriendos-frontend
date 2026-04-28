// src/components/SearchBar.jsx
import { useState, useEffect } from "react";
import axios from "axios";

export default function SearchBar({ onSearch }) {
  const [regiones, setRegiones] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Cargar regiones al montar el componente
  useEffect(() => {
    fetchRegiones();
  }, []);

  // Cargar ciudades cuando se selecciona una región
  useEffect(() => {
    if (selectedRegion) {
      fetchCiudades(selectedRegion);
    } else {
      setCiudades([]);
      setSelectedCity("");
    }
  }, [selectedRegion]);

  const fetchRegiones = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/regiones");
      setRegiones(response.data);
    } catch (error) {
      console.error("Error al cargar regiones:", error);
    }
  };

  const fetchCiudades = async (regionId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/ciudades/region/${regionId}`);
      setCiudades(response.data);
    } catch (error) {
      console.error("Error al cargar ciudades:", error);
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.length > 2) {
      try {
        const response = await axios.get(`http://localhost:8080/api/ciudades/buscar-completo?q=${value}`);
        setSuggestions(response.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error en búsqueda:", error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (ciudad) => {
    setSearchInput(ciudad.nombre);
    setSelectedRegion(ciudad.regCodigo);
    setSelectedCity(ciudad.idCiudad);
    setShowSuggestions(false);
    
    // Ejecutar búsqueda inmediatamente
    onSearch(ciudad.nombre);
  };

  const handleSearch = () => {
    // Si hay una ciudad seleccionada en el dropdown
    if (selectedCity) {
      const ciudadSeleccionada = ciudades.find(c => c.idCiudad == selectedCity);
      if (ciudadSeleccionada) {
        onSearch(ciudadSeleccionada.nombre);
      } else {
        // Si no encuentra la ciudad, usar el texto del input
        onSearch(searchInput);
      }
    } 
    // Si hay texto en el input de búsqueda
    else if (searchInput) {
      onSearch(searchInput);
    } 
    // Si no hay nada, mostrar todos
    else {
      onSearch("");
    }
  };

  const clearFilters = () => {
    setSelectedRegion("");
    setSelectedCity("");
    setSearchInput("");
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch("");
  };

  return (
    <div className="search-bar-container">
      <div className="filters-row">
        {/* Selector de Región */}
        <div className="filter-group">
          <label>Región:</label>
          <select 
            value={selectedRegion} 
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas las regiones</option>
            {regiones.map(region => (
              <option key={region.regcodigo} value={region.regcodigo}>
                {region.regnombre}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de Ciudad (dependiente de la región) */}
        <div className="filter-group">
          <label>Ciudad:</label>
          <select 
            value={selectedCity} 
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedRegion}
            className="filter-select"
          >
            <option value="">Todas las ciudades</option>
            {ciudades.map(ciudad => (
              <option key={ciudad.idCiudad} value={ciudad.idCiudad}>
                {ciudad.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
            
      {/* Búsqueda con autocompletado */}
      <div className="search-with-suggestions">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Buscar ciudad..."
            value={searchInput}
            onChange={handleInputChange}
            onFocus={() => searchInput.length > 2 && setShowSuggestions(true)}
            className="search-input"
          />
          
          {/* Sugerencias de autocompletado */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map(ciudad => (
                <li 
                  key={ciudad.idCiudad}
                  onClick={() => handleSuggestionClick(ciudad)}
                  className="suggestion-item"
                >
                  {ciudad.nombre} - {ciudad.regionNombre}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <button onClick={clearFilters} className="clear-button">
          🗙 Limpiar
        </button>
        <button onClick={handleSearch} className="search-button">
          🔍 Buscar
        </button>
      </div>
    </div>
  );
}