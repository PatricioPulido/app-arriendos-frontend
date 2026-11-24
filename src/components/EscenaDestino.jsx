import { useId } from "react";

/**
 * Ilustracion animada de un tipo de paisaje (mar, cordillera, lago con volcan...).
 * Es SVG liviano, sin fotos externas: siempre carga y se anima con CSS (Destinos.css).
 * Si el destino tiene "foto", Destinos.jsx muestra la foto en vez de esto.
 */
export default function EscenaDestino({ paisaje = "costa", className = "" }) {
  const id = useId().replace(/:/g, "");
  const Escena = ESCENAS[paisaje] || ESCENAS.costa;
  const cielo = CIELOS[paisaje] || CIELOS.costa;
  return (
    <svg className={`escena escena-${paisaje} ${className}`} viewBox="0 0 400 260"
         preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`cielo${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={cielo[0]} />
          <stop offset="1" stopColor={cielo[1]} />
        </linearGradient>
        <linearGradient id={`agua${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0c4a6e" />
        </linearGradient>
        <radialGradient id={`sol${id}`}>
          <stop offset="0" stopColor="#fff7ed" />
          <stop offset="0.45" stopColor={cielo[2]} />
          <stop offset="1" stopColor={cielo[2]} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="260" fill={`url(#cielo${id})`} />
      <circle className="sol" cx={cielo[3]} cy={cielo[4]} r="46" fill={`url(#sol${id})`} />
      <Nubes />
      <Escena agua={`url(#agua${id})`} />
    </svg>
  );
}

// [cielo arriba, cielo abajo, color del sol, x del sol, y del sol]
const CIELOS = {
  costa: ["#38bdf8", "#fed7aa", "#fb923c", 170, 128],
  cerros: ["#7dd3fc", "#e0f2fe", "#fde047", 260, 50],
  ciudad: ["#a5b4fc", "#fbcfe8", "#fb7185", 140, 90],
  cordillera: ["#60a5fa", "#dbeafe", "#fde047", 260, 40],
  campo: ["#fdba74", "#fef3c7", "#f97316", 150, 92],
  lago: ["#7dd3fc", "#ecfeff", "#fde047", 140, 55],
  volcan: ["#93c5fd", "#fce7f3", "#fdba74", 270, 60],
  rio: ["#86efac", "#ecfccb", "#fde047", 250, 50],
};

function Nubes() {
  return (
    <g className="nubes" fill="white">
      <g className="nube" opacity="0.85">
        <ellipse cx="70" cy="48" rx="30" ry="10" />
        <ellipse cx="88" cy="42" rx="20" ry="11" />
      </g>
      <g className="nube nube-2" opacity="0.7">
        <ellipse cx="230" cy="30" rx="26" ry="8" />
        <ellipse cx="245" cy="25" rx="16" ry="9" />
      </g>
    </g>
  );
}

const Pino = ({ x, y, s = 1, color = "#14532d" }) => (
  <polygon points={`${x},${y - 34 * s} ${x - 11 * s},${y} ${x + 11 * s},${y}`} fill={color} />
);

/** Olas: el trazado mide el doble de ancho y se desplaza en loop. */
const Olas = ({ y, color = "white", opacidad = 0.55, clase = "" }) => (
  <path className={`ola ${clase}`} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" opacity={opacidad}
        d={`M-400 ${y} ${Array.from({ length: 20 }, (_, i) => `q20 -8 40 0`).join(" ")}`} />
);

const ESCENAS = {
  costa: ({ agua }) => (
    <>
      <rect y="150" width="400" height="110" fill={agua} />
      <Olas y={168} />
      <Olas y={190} clase="ola-2" opacidad={0.4} />
      <path d="M235 152 L262 128 L292 124 L330 140 L400 132 L400 175 Q330 168 235 152Z" fill="#475569" />
      <g className="faro">
        <polygon points="276,126 280,92 290,92 294,126" fill="white" />
        <rect x="278" y="104" width="14" height="6" fill="#ef4444" />
        <rect x="279" y="84" width="12" height="8" fill="#fde047" className="faro-luz" />
        <polygon points="277,84 285,76 293,84" fill="#ef4444" />
      </g>
      <path className="velero" d="M110 168 L140 168 L134 175 L116 175Z M126 167 L126 143 L140 165Z" fill="white" />
      <path d="M0 215 Q120 200 230 232 T400 240 L400 260 L0 260Z" fill="#fde68a" />
      <path className="espuma" d="M0 215 Q120 200 230 232 T400 240" fill="none" stroke="white" strokeWidth="4" opacity="0.8" />
    </>
  ),
  cerros: ({ agua }) => (
    <>
      <rect y="200" width="400" height="60" fill={agua} />
      <Olas y={220} opacidad={0.4} />
      <path d="M0 210 L0 120 Q120 70 230 110 Q320 140 400 125 L400 210Z" fill="#a3a36a" />
      {[
        [30, 130, "#ef4444"], [62, 118, "#facc15"], [94, 108, "#3b82f6"], [126, 102, "#ec4899"], [158, 104, "#22c55e"],
        [190, 110, "#f97316"], [222, 118, "#8b5cf6"], [254, 128, "#06b6d4"], [286, 136, "#facc15"], [318, 136, "#ef4444"],
        [46, 160, "#3b82f6"], [78, 152, "#f97316"], [110, 146, "#facc15"], [142, 144, "#ef4444"], [174, 146, "#06b6d4"],
        [206, 152, "#ec4899"], [238, 160, "#22c55e"], [270, 166, "#3b82f6"], [302, 168, "#f97316"], [350, 160, "#8b5cf6"],
      ].map(([x, y, c], i) => (
        <g key={i} className={i % 4 === 0 ? "ventana" : undefined}>
          <rect x={x} y={y} width="26" height="22" fill={c} rx="2" />
          <polygon points={`${x - 2},${y} ${x + 13},${y - 9} ${x + 28},${y}`} fill="#7c2d12" />
          <rect x={x + 9} y={y + 7} width="8" height="7" fill="#fef9c3" opacity="0.85" />
        </g>
      ))}
    </>
  ),
  ciudad: () => (
    <>
      <path d="M0 160 L60 90 L95 120 L150 60 L210 115 L260 70 L320 120 L370 85 L400 110 L400 180 L0 180Z" fill="#c7d2fe" />
      <path d="M150 60 L132 77 L142 74 L150 80 L160 72 L170 79Z M260 70 L244 85 L260 82 L274 84Z M60 90 L48 104 L62 100 L72 103Z" fill="white" />
      <g fill="#334155">
        <rect x="20" y="170" width="40" height="90" />
        <rect x="65" y="150" width="34" height="110" />
        <rect x="104" y="185" width="44" height="75" />
        <polygon points="180,260 186,105 202,105 208,260" />
        <rect x="215" y="160" width="40" height="100" />
        <rect x="260" y="180" width="50" height="80" />
        <rect x="315" y="155" width="36" height="105" />
        <rect x="356" y="190" width="44" height="70" />
      </g>
      <g className="luces" fill="#fde68a">
        {[[28, 182], [44, 200], [72, 165], [86, 190], [114, 200], [130, 220], [190, 130], [194, 170], [224, 175],
          [240, 205], [270, 195], [292, 215], [322, 170], [338, 200], [366, 205], [384, 225]].map(([x, y], i) => (
          <rect key={i} className={`luz luz-${i % 3}`} x={x} y={y} width="6" height="6" />
        ))}
      </g>
    </>
  ),
  cordillera: ({ agua }) => (
    <>
      <path d="M0 170 L70 70 L120 120 L190 40 L260 115 L310 75 L400 150 L400 260 L0 260Z" fill="#64748b" />
      <path d="M190 40 L168 66 L182 62 L192 72 L204 60 L214 68Z M70 70 L56 90 L70 86 L82 90Z M310 75 L296 92 L312 88 L326 90Z" fill="white" />
      <path d="M0 200 L90 130 L170 185 L250 140 L330 180 L400 150 L400 260 L0 260Z" fill="#475569" />
      <path d="M0 230 Q100 205 200 225 T400 215 L400 260 L0 260Z" fill="#166534" />
      <path className="rio" d="M-10 250 Q120 228 200 244 T410 236" fill="none" stroke={agua} strokeWidth="9" strokeLinecap="round" />
      <path className="rio-brillo" d="M-10 250 Q120 228 200 244 T410 236" fill="none" stroke="white" strokeWidth="2" strokeDasharray="10 18" opacity="0.7" />
      {[30, 52, 340, 362, 384].map((x, i) => <Pino key={i} x={x} y={232 - (i % 2) * 4} s={0.8} />)}
    </>
  ),
  campo: () => (
    <>
      <path d="M0 140 L80 90 L150 125 L230 80 L320 120 L400 95 L400 170 L0 170Z" fill="#c4b5fd" opacity="0.8" />
      <path d="M0 170 Q100 140 210 165 T400 150 L400 260 L0 260Z" fill="#84cc16" />
      <path d="M0 200 Q140 175 260 205 T400 195 L400 260 L0 260Z" fill="#4d7c0f" />
      <g stroke="#365314" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 9" fill="none">
        {[214, 226, 238, 250].map((y, i) => <path key={i} d={`M-10 ${y} Q140 ${y - 22} 260 ${y + 6} T410 ${y - 4}`} />)}
      </g>
      <g className="hojas" fill="#a3e635">
        {[[60, 175], [150, 168], [300, 160], [350, 172]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="9" />)}
      </g>
    </>
  ),
  lago: ({ agua }) => <Lago agua={agua} volcanX={235} alto={95} />,
  volcan: ({ agua }) => <Lago agua={agua} volcanX={200} alto={130} />,
  rio: ({ agua }) => (
    <>
      <path d="M0 150 Q80 100 160 140 T320 120 T400 130 L400 260 L0 260Z" fill="#15803d" />
      <path d="M0 190 Q100 160 200 185 T400 175 L400 260 L0 260Z" fill="#166534" />
      <path d="M150 260 Q190 220 170 200 T230 170 T260 150" fill="none" stroke={agua} strokeWidth="26" strokeLinecap="round" />
      <path className="rio-brillo" d="M150 260 Q190 220 170 200 T230 170 T260 150" fill="none" stroke="white" strokeWidth="2" strokeDasharray="8 16" opacity="0.8" />
      {[[30, 190], [60, 200], [95, 185], [290, 182], [325, 195], [360, 186], [390, 200], [120, 230], [80, 245], [320, 240], [355, 250]].map(([x, y], i) => (
        <Pino key={i} x={x} y={y} s={1.1 - (i % 3) * 0.15} color={i % 2 ? "#14532d" : "#064e3b"} />
      ))}
    </>
  ),
};

/** Lago con volcan nevado que humea y reflejos en el agua (Villarrica, Pucon, Puerto Varas). */
function Lago({ agua, volcanX, alto }) {
  const cima = 170 - alto;
  return (
    <>
      <path d="M0 160 L60 130 L120 150 L180 128 L260 150 L340 125 L400 145 L400 175 L0 175Z" fill="#94a3b8" opacity="0.7" />
      <path d={`M${volcanX - 120} 172 L${volcanX - 14} ${cima} L${volcanX + 14} ${cima} L${volcanX + 120} 172Z`} fill="#64748b" />
      <path d={`M${volcanX - 14} ${cima} L${volcanX - 40} ${cima + 34} L${volcanX - 20} ${cima + 28} L${volcanX - 4} ${cima + 38} L${volcanX + 14} ${cima + 26} L${volcanX + 40} ${cima + 34} L${volcanX + 14} ${cima}Z`} fill="white" />
      <g className="humo" fill="white" opacity="0.75">
        <circle cx={volcanX} cy={cima - 10} r="7" />
        <circle cx={volcanX + 10} cy={cima - 24} r="10" />
        <circle cx={volcanX + 24} cy={cima - 40} r="12" />
      </g>
      <rect y="172" width="400" height="88" fill={agua} />
      <g className="reflejos" stroke="white" strokeLinecap="round" opacity="0.6">
        {[[60, 190, 40], [170, 200, 60], [280, 188, 30], [110, 222, 50], [250, 230, 70], [340, 212, 36]].map(([x, y, w], i) => (
          <line key={i} className={`reflejo reflejo-${i % 3}`} x1={x} y1={y} x2={x + w} y2={y} strokeWidth="2.5" />
        ))}
      </g>
      <path d="M0 172 L0 160 Q40 150 70 168 L70 172Z" fill="#166534" />
      {[12, 30, 48, 360, 380].map((x, i) => <Pino key={i} x={x} y={174} s={0.7 + (i % 2) * 0.2} />)}
      <path className="velero" d="M120 205 L150 205 L144 212 L126 212Z M136 204 L136 180 L150 202Z" fill="white" />
    </>
  );
}
