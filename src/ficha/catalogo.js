// Catalogo de comodidades y destacados de la ficha del alojamiento.
// La BD solo guarda el CODIGO ("wifi"); aqui se decide el texto y el icono.
// Para sumar una comodidad: agrega una linea en el grupo que corresponda.
// No cambies un codigo que ya se use: las propiedades que lo tenian dejarian de mostrarlo.
import {
  AirVent, AlarmSmoke, ArrowUpDown, Baby, Bath, BedDouble, Bike, BriefcaseMedical, CarFront, Cctv,
  ConciergeBell, Coffee, CookingPot, Droplets, Dumbbell, Fence, FireExtinguisher, Flame, FlameKindling,
  Heater, KeyRound, Laptop, MapPin, Microwave, MonitorPlay, MountainSnow, PawPrint, Refrigerator,
  Shirt, ShowerHead, Snowflake, Sofa, Sparkles, Sun, Sunset, TreePalm, Trees, Tv, UsersRound,
  UtensilsCrossed, WashingMachine, Waves, Wifi, Wind,
} from "lucide-react";

export const GRUPOS_COMODIDADES = [
  {
    titulo: "Lo básico",
    items: [
      { codigo: "wifi", texto: "Wifi", icono: Wifi },
      { codigo: "agua_caliente", texto: "Agua caliente", icono: ShowerHead },
      { codigo: "ropa_de_cama", texto: "Ropa de cama", icono: BedDouble },
      { codigo: "toallas", texto: "Toallas", icono: Droplets },
      { codigo: "secador_pelo", texto: "Secador de pelo", icono: Wind },
      { codigo: "calefaccion", texto: "Calefacción", icono: Heater },
      { codigo: "aire_acondicionado", texto: "Aire acondicionado", icono: AirVent },
      { codigo: "chimenea", texto: "Chimenea o salamandra", icono: FlameKindling },
    ],
  },
  {
    titulo: "Cocina",
    items: [
      { codigo: "cocina", texto: "Cocina equipada", icono: CookingPot },
      { codigo: "refrigerador", texto: "Refrigerador", icono: Refrigerator },
      { codigo: "microondas", texto: "Microondas", icono: Microwave },
      { codigo: "cafetera", texto: "Cafetera", icono: Coffee },
      { codigo: "vajilla", texto: "Vajilla y utensilios", icono: UtensilsCrossed },
    ],
  },
  {
    titulo: "Lavado",
    items: [
      { codigo: "lavadora", texto: "Lavadora", icono: WashingMachine },
      { codigo: "secadora", texto: "Secadora", icono: Wind },
      { codigo: "plancha", texto: "Plancha", icono: Shirt },
    ],
  },
  {
    titulo: "Entretenimiento",
    items: [
      { codigo: "tv", texto: "TV", icono: Tv },
      { codigo: "streaming", texto: "Netflix u otro streaming", icono: MonitorPlay },
      { codigo: "bicicletas", texto: "Bicicletas", icono: Bike },
    ],
  },
  {
    titulo: "Exterior y vistas",
    items: [
      { codigo: "vista_al_mar", texto: "Vista al mar", icono: Waves },
      { codigo: "vista_montana", texto: "Vista a la montaña o volcán", icono: MountainSnow },
      { codigo: "acceso_playa", texto: "Acceso a la playa", icono: TreePalm },
      { codigo: "terraza", texto: "Terraza o balcón", icono: Sunset },
      { codigo: "jardin", texto: "Jardín o patio", icono: Trees },
      { codigo: "parrilla", texto: "Parrilla", icono: Flame },
      { codigo: "quincho", texto: "Quincho", icono: Fence },
      { codigo: "piscina", texto: "Piscina", icono: Waves },
      { codigo: "tinaja", texto: "Tinaja o jacuzzi", icono: Bath },
      { codigo: "muebles_exterior", texto: "Muebles de exterior", icono: Sofa },
    ],
  },
  {
    titulo: "Edificio y estacionamiento",
    items: [
      { codigo: "estacionamiento", texto: "Estacionamiento gratis", icono: CarFront },
      { codigo: "ascensor", texto: "Ascensor", icono: ArrowUpDown },
      { codigo: "conserjeria", texto: "Conserjería 24 h", icono: ConciergeBell },
      { codigo: "gimnasio", texto: "Gimnasio", icono: Dumbbell },
    ],
  },
  {
    titulo: "Familia y trabajo",
    items: [
      { codigo: "cuna", texto: "Cuna", icono: Baby },
      { codigo: "espacio_trabajo", texto: "Espacio para trabajar", icono: Laptop },
    ],
  },
  {
    titulo: "Seguridad",
    items: [
      { codigo: "detector_humo", texto: "Detector de humo", icono: AlarmSmoke },
      { codigo: "extintor", texto: "Extintor", icono: FireExtinguisher },
      { codigo: "botiquin", texto: "Botiquín", icono: BriefcaseMedical },
      { codigo: "camaras_exteriores", texto: "Cámaras en el exterior", icono: Cctv },
    ],
  },
];

/** "Lo mejor de este lugar": el anfitrion elige hasta 3. */
export const DESTACADOS = [
  { codigo: "llegada_autonoma", titulo: "Llegada autónoma", texto: "Entras cuando quieras con caja de llaves o cerradura digital.", icono: KeyRound },
  { codigo: "vista_al_mar", titulo: "Vista al mar", texto: "Despierta mirando el océano.", icono: Waves },
  { codigo: "frente_playa", titulo: "A pasos de la playa", texto: "Llegas caminando a la arena en pocos minutos.", icono: TreePalm },
  { codigo: "ubicacion", titulo: "Excelente ubicación", texto: "Cerca de restaurantes, comercio y transporte.", icono: MapPin },
  { codigo: "familias", titulo: "Ideal para familias", texto: "Espacio cómodo y seguro para grupos con niños.", icono: UsersRound },
  { codigo: "teletrabajo", titulo: "Ideal para teletrabajo", texto: "Wifi rápido y un espacio cómodo para trabajar.", icono: Laptop },
  { codigo: "naturaleza", titulo: "Rodeado de naturaleza", texto: "Tranquilidad, verde y aire puro.", icono: Trees },
  { codigo: "piscina", titulo: "Piscina para disfrutar", texto: "Ideal para los días de calor.", icono: Sun },
  { codigo: "tinaja", titulo: "Tinaja o jacuzzi", texto: "Relájate en agua caliente al aire libre.", icono: Bath },
  { codigo: "estacionamiento", titulo: "Estacionamiento incluido", texto: "Llega en auto sin preocuparte de dónde dejarlo.", icono: CarFront },
  { codigo: "mascotas", titulo: "Tu mascota es bienvenida", texto: "Viaja con tu perro o gato.", icono: PawPrint },
  { codigo: "invierno", titulo: "Acogedor en invierno", texto: "Calefacción o chimenea para los días fríos.", icono: Snowflake },
  { codigo: "limpieza", titulo: "Impecable", texto: "Limpieza profunda antes de cada llegada.", icono: Sparkles },
];

export const COMODIDADES = GRUPOS_COMODIDADES.flatMap((g) => g.items);
const porCodigo = (lista) => Object.fromEntries(lista.map((x) => [x.codigo, x]));
const COMODIDAD = porCodigo(COMODIDADES);
const DESTACADO = porCodigo(DESTACADOS);

/** Solo las que el front conoce, en el orden del catalogo. */
export const comodidadesDe = (codigos = []) => COMODIDADES.filter((c) => codigos.includes(c.codigo));
export const destacadosDe = (codigos = []) => codigos.map((c) => DESTACADO[c]).filter(Boolean);
export const comodidad = (codigo) => COMODIDAD[codigo];

export const MAX_DESTACADOS = 3;
