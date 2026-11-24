// Destinos turisticos de la portada. Los nombres de "ciudad" y de las zonas son los
// mismos de las tablas CIUDAD y ZONA, asi cada alojamiento recibe la etiqueta de su lugar.
//
// paisaje: dibujo animado de la tarjeta (ver components/EscenaDestino.jsx):
//   costa | cerros | ciudad | cordillera | campo | lago | volcan | rio
// foto (opcional): URL de una foto real; si esta, se muestra en vez del dibujo.
// etiqueta: [texto, icono] del atractivo principal; zonas puede tener uno propio.
// Iconos: ver ICONOS en components/Atractivo.jsx

export const RUTAS = [
  { id: "litoral", nombre: "Litoral central", lema: "Playas, caletas y atardeceres frente al Pacífico" },
  { id: "santiago", nombre: "Santiago y cordillera", lema: "Ciudad, montaña y viñedos a pasos" },
  { id: "sur", nombre: "Sur de lagos y volcanes", lema: "Lagos, termas, bosques y volcanes nevados" },
];

export const DESTINOS = [
  // ===== Litoral central =====
  {
    ciudad: "Viña del Mar", region: "Valparaíso", ruta: "litoral", paisaje: "costa",
    lema: "La ciudad jardín frente al mar",
    etiqueta: ["Frente al mar", "mar"],
    zonas: { "Reñaca": ["Playa de Reñaca", "mar"], "Jardín del Mar": ["Vista al mar", "mar"], "Recreo": ["Miradores al mar", "mar"] },
  },
  {
    ciudad: "Concón", region: "Valparaíso", ruta: "litoral", paisaje: "costa",
    lema: "Dunas, roqueríos y la mejor empanada de mariscos",
    etiqueta: ["Dunas y mar", "mar"],
    zonas: { "Costa Brava": ["Roqueríos y vista al mar", "mar"], "Playa Amarilla": ["A pasos de la playa", "sol"] },
  },
  {
    ciudad: "Valparaíso", region: "Valparaíso", ruta: "litoral", paisaje: "cerros",
    lema: "Cerros de colores, ascensores y miradores",
    etiqueta: ["Cerros patrimoniales", "patrimonio"],
    zonas: { "Playa Ancha": ["Vista a la bahía", "mar"] },
  },
  {
    ciudad: "Puchuncaví", region: "Valparaíso", ruta: "litoral", paisaje: "costa",
    lema: "Maitencillo y Horcón: surf, parapente y caletas",
    etiqueta: ["Playa y caleta", "mar"],
    zonas: { "Maitencillo": ["Playa y parapente", "sol"], "Horcón": ["Caleta de pescadores", "barco"] },
  },
  {
    ciudad: "Zapallar", region: "Valparaíso", ruta: "litoral", paisaje: "costa",
    lema: "Bahías tranquilas y senderos entre el bosque y el mar",
    etiqueta: ["Bahía y bosque costero", "mar"],
    zonas: { "Cachagua": ["Isla de los pingüinos", "mar"] },
  },
  {
    ciudad: "Papudo", region: "Valparaíso", ruta: "litoral", paisaje: "costa",
    lema: "Una bahía tranquila para desconectarse",
    etiqueta: ["Bahía tranquila", "mar"],
  },
  {
    ciudad: "Algarrobo", region: "Valparaíso", ruta: "litoral", paisaje: "costa",
    lema: "Playas, náutica y la piscina más grande frente al mar",
    etiqueta: ["Playa y náutica", "barco"],
    zonas: { "San Alfonso del Mar": ["Laguna frente al mar", "mar"] },
  },
  {
    ciudad: "El Quisco", region: "Valparaíso", ruta: "litoral", paisaje: "costa",
    lema: "Playa, pinos y la casa de Neruda",
    etiqueta: ["Playa y pinos", "sol"],
    zonas: { "Isla Negra": ["Casa de Neruda", "patrimonio"], "Punta de Tralca": ["Roqueríos y mar", "mar"] },
  },
  {
    ciudad: "El Tabo", region: "Valparaíso", ruta: "litoral", paisaje: "costa",
    lema: "Playas familiares y acantilados",
    etiqueta: ["Playas familiares", "sol"],
    zonas: { "Las Cruces": ["Acantilados y mar", "mar"] },
  },

  // ===== Santiago y cordillera =====
  {
    ciudad: "Santiago", region: "Metropolitana", ruta: "santiago", paisaje: "ciudad",
    lema: "La capital, con los Andes de telón de fondo",
    etiqueta: ["Vista a la cordillera", "montana"],
    zonas: { "Santiago Centro": ["Barrio histórico", "patrimonio"], "Ñuñoa": ["Barrio con plazas y cafés", "ciudad"] },
  },
  {
    ciudad: "Cajón del Maipo", region: "Metropolitana", ruta: "santiago", paisaje: "cordillera",
    lema: "Montañas, río y termas a una hora de Santiago",
    etiqueta: ["Vista a la cordillera", "montana"],
    zonas: { "Baños Morales": ["Termas y glaciar", "termas"], "San Alfonso": ["Junto al río Maipo", "rio"] },
  },
  {
    ciudad: "Pirque", region: "Metropolitana", ruta: "santiago", paisaje: "campo",
    lema: "Viñas, campo y precordillera",
    etiqueta: ["Viñedos y precordillera", "vino"],
  },

  // ===== Sur =====
  {
    ciudad: "Temuco", region: "La Araucanía", ruta: "sur", paisaje: "rio",
    lema: "Puerta de entrada a la Araucanía",
    etiqueta: ["Puerta de la Araucanía", "bosque"],
  },
  {
    ciudad: "Villarrica", region: "La Araucanía", ruta: "sur", paisaje: "lago",
    lema: "A orillas del lago, con el volcán en el horizonte",
    etiqueta: ["Lago Villarrica", "lago"],
    zonas: { "Lican Ray": ["Lago Calafquén", "lago"] },
  },
  {
    ciudad: "Pucón", region: "La Araucanía", ruta: "sur", paisaje: "volcan",
    lema: "Volcán, termas y aventura todo el año",
    etiqueta: ["Vista al volcán Villarrica", "volcan"],
    zonas: { "Caburgua": ["Lago Caburgua", "lago"] },
  },
  {
    ciudad: "Valdivia", region: "Los Ríos", ruta: "sur", paisaje: "rio",
    lema: "Ríos, selva valdiviana y cerveza artesanal",
    etiqueta: ["Ciudad de los ríos", "rio"],
    zonas: { "Niebla": ["Fuertes y mar", "patrimonio"], "Isla Teja": ["Junto al río Calle-Calle", "rio"] },
  },
  {
    ciudad: "Máfil", region: "Los Ríos", ruta: "sur", paisaje: "campo",
    lema: "Campo sureño y tranquilidad",
    etiqueta: ["Campo sureño", "bosque"],
  },
  {
    ciudad: "Puerto Varas", region: "Los Lagos", ruta: "sur", paisaje: "volcan",
    lema: "Lago Llanquihue y el volcán Osorno",
    etiqueta: ["Vista al volcán Osorno", "volcan"],
    zonas: { "Frutillar": ["Lago Llanquihue", "lago"], "Ensenada": ["A los pies del volcán", "volcan"] },
  },
];

/** "Viña del Mar" -> "vina del mar", para comparar sin tildes ni mayusculas. */
export const normalizar = (s) =>
  (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

const POR_CIUDAD = new Map(DESTINOS.map((d) => [normalizar(d.ciudad), d]));

export const destinoDe = (depto) => POR_CIUDAD.get(normalizar(depto?.nombreCiudad));

/** Atractivo de un alojamiento segun su zona (o su ciudad): { texto, icono } o null. */
export function atractivoDe(depto) {
  const destino = destinoDe(depto);
  if (!destino) return null;
  const zona = Object.entries(destino.zonas || {}).find(([z]) => normalizar(z) === normalizar(depto.nombreZona));
  const [texto, icono] = zona ? zona[1] : destino.etiqueta;
  return { texto, icono };
}
