import { Building2, Droplets, Grape, Landmark, Mountain, MountainSnow, Sailboat, Sun, Thermometer, TreePine, Waves } from "lucide-react";
import "./Destinos.css";

export const ICONOS = {
  mar: Waves,
  lago: Waves,
  sol: Sun,
  barco: Sailboat,
  patrimonio: Landmark,
  montana: MountainSnow,
  volcan: Mountain,
  ciudad: Building2,
  termas: Thermometer,
  rio: Droplets,
  vino: Grape,
  bosque: TreePine,
};

/** Etiqueta del atractivo turistico ("Vista a la cordillera", "Lago Villarrica"...). */
export default function Atractivo({ atractivo, className = "" }) {
  if (!atractivo) return null;
  const Icono = ICONOS[atractivo.icono] || Sun;
  return (
    <span className={`atractivo ${className}`}>
      <Icono size={14} aria-hidden="true" /> {atractivo.texto}
    </span>
  );
}
