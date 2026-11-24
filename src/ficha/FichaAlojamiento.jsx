// Secciones de la ficha del alojamiento, al estilo Airbnb/Booking:
// "Lo mejor de este lugar", comodidades, reglas y horarios, y ubicacion.
// Cada seccion se oculta sola si el anfitrion no cargo esos datos.
import { useState } from "react";
import { Ban, Check, Cigarette, Clock3, LogIn, LogOut, PartyPopper, PawPrint, UsersRound } from "lucide-react";
import Modal from "./Modal";
import { GRUPOS_COMODIDADES, comodidadesDe, destacadosDe } from "./catalogo";
import { ubicacion } from "../format";
import "./Ficha.css";

const VISIBLES = 10; // comodidades que se ven antes de "Mostrar todas"

export function Destacados({ depto }) {
  const lista = destacadosDe(depto.destacados);
  if (!lista.length) return null;
  return (
    <section className="ficha-seccion">
      <h2>Lo mejor de este lugar</h2>
      <ul className="destacados">
        {lista.map(({ codigo, titulo, texto, icono: Icono }) => (
          <li key={codigo}>
            <Icono size={28} strokeWidth={1.6} />
            <div><strong>{titulo}</strong><span>{texto}</span></div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Comodidades({ depto }) {
  const [verTodas, setVerTodas] = useState(false);
  const lista = comodidadesDe(depto.comodidades);
  if (!lista.length) return null;
  const tiene = new Set(depto.comodidades);

  return (
    <section className="ficha-seccion">
      <h2>Lo que este lugar ofrece</h2>
      <ul className="comodidades">
        {lista.slice(0, VISIBLES).map(({ codigo, texto, icono: Icono }) => (
          <li key={codigo}><Icono size={24} strokeWidth={1.6} />{texto}</li>
        ))}
      </ul>
      {lista.length > VISIBLES && (
        <button type="button" className="btn btn-secundario btn-inline" onClick={() => setVerTodas(true)}>
          Mostrar las {lista.length} comodidades
        </button>
      )}
      {verTodas && (
        <Modal titulo="Lo que este lugar ofrece" onCerrar={() => setVerTodas(false)}>
          {GRUPOS_COMODIDADES.map((g) => {
            const items = g.items.filter((c) => tiene.has(c.codigo));
            if (!items.length) return null;
            return (
              <div key={g.titulo} className="comodidades-grupo">
                <h3>{g.titulo}</h3>
                <ul>
                  {items.map(({ codigo, texto, icono: Icono }) => (
                    <li key={codigo}><Icono size={24} strokeWidth={1.6} />{texto}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </Modal>
      )}
    </section>
  );
}

/** Una regla si/no. null = el anfitrion no la indico, no se muestra. */
function Regla({ valor, icono: Icono, si, no }) {
  if (valor == null) return null;
  return (
    <li className={valor ? "" : "regla-no"}>
      <span className="regla-icono"><Icono size={22} strokeWidth={1.6} />{!valor && <Ban className="tachado" size={30} strokeWidth={1.4} />}</span>
      {valor ? si : no}
    </li>
  );
}

export function ReglasYHorarios({ depto }) {
  const hayAlgo = depto.horaCheckIn || depto.horaCheckOut || depto.capacidad || depto.reglasAdicionales
    || [depto.permiteMascotas, depto.permiteFumar, depto.permiteFiestas].some((v) => v != null);
  if (!hayAlgo) return null;
  return (
    <section className="ficha-seccion">
      <h2>Reglas de la casa</h2>
      <ul className="reglas">
        {depto.horaCheckIn && <li><span className="regla-icono"><LogIn size={22} strokeWidth={1.6} /></span>Llegada (check-in) desde las {depto.horaCheckIn}</li>}
        {depto.horaCheckOut && <li><span className="regla-icono"><LogOut size={22} strokeWidth={1.6} /></span>Salida (check-out) hasta las {depto.horaCheckOut}</li>}
        {depto.capacidad && <li><span className="regla-icono"><UsersRound size={22} strokeWidth={1.6} /></span>Máximo {depto.capacidad} {depto.capacidad === 1 ? "huésped" : "huéspedes"}</li>}
        <Regla valor={depto.permiteMascotas} icono={PawPrint} si="Se admiten mascotas" no="No se admiten mascotas" />
        <Regla valor={depto.permiteFumar} icono={Cigarette} si="Se permite fumar" no="No se permite fumar" />
        <Regla valor={depto.permiteFiestas} icono={PartyPopper} si="Se permiten fiestas y eventos" no="No se permiten fiestas ni eventos" />
      </ul>
      {depto.reglasAdicionales && (
        <div className="reglas-extra">
          <h3><Clock3 size={18} /> Además ten en cuenta</h3>
          <p>{depto.reglasAdicionales}</p>
        </div>
      )}
    </section>
  );
}

/** Mapa de la zona (no de la direccion exacta), con Google Maps sin API key. */
export function Ubicacion({ depto }) {
  const donde = ubicacion(depto);
  if (!donde && !depto.sobreLaZona) return null;
  const consulta = encodeURIComponent(`${donde}, Chile`);
  return (
    <section className="ficha-seccion ficha-ubicacion">
      <h2>Dónde vas a estar</h2>
      {donde && (
        <>
          <p className="ubicacion-nombre">{donde}</p>
          <div className="mapa">
            <iframe title={`Mapa de ${donde}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${consulta}&z=13&output=embed`} />
          </div>
          <p className="ayuda-mapa"><Check size={14} /> El mapa muestra la zona aproximada del alojamiento.</p>
        </>
      )}
      {depto.sobreLaZona && <p className="descripcion">{depto.sobreLaZona}</p>}
    </section>
  );
}
