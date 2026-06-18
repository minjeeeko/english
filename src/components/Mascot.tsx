export function Mascot() {
  return (
    <svg
      viewBox="0 0 160 160"
      className="w-44 h-44 animate-float drop-shadow-lg"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Big round ears */}
      <circle cx="32" cy="58" r="26" fill="#f5c2a0" />
      <circle cx="128" cy="58" r="26" fill="#f5c2a0" />
      <circle cx="32" cy="58" r="16" fill="#f9a07a" />
      <circle cx="128" cy="58" r="16" fill="#f9a07a" />

      {/* Body */}
      <ellipse cx="80" cy="112" rx="46" ry="42" fill="#f5c2a0" />

      {/* Tummy */}
      <ellipse cx="80" cy="118" rx="28" ry="26" fill="#fde8d8" />

      {/* Head */}
      <ellipse cx="80" cy="72" rx="44" ry="42" fill="#f5c2a0" />

      {/* Cheek pouches */}
      <ellipse cx="44" cy="82" rx="16" ry="13" fill="#f9a07a" opacity="0.7" />
      <ellipse cx="116" cy="82" rx="16" ry="13" fill="#f9a07a" opacity="0.7" />

      {/* Eyes */}
      <ellipse cx="65" cy="65" rx="8" ry="9" fill="white" />
      <ellipse cx="95" cy="65" rx="8" ry="9" fill="white" />
      <circle cx="67" cy="67" r="5" fill="#2d1a0e" />
      <circle cx="97" cy="67" r="5" fill="#2d1a0e" />
      <circle cx="69" cy="65" r="2" fill="white" />
      <circle cx="99" cy="65" r="2" fill="white" />

      {/* Nose */}
      <ellipse cx="80" cy="79" rx="4" ry="3" fill="#e07060" />

      {/* Mouth */}
      <path d="M 74 83 Q 80 88 86 83" stroke="#c05040" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Whiskers */}
      <line x1="30" y1="78" x2="60" y2="80" stroke="#c8956c" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="30" y1="83" x2="60" y2="83" stroke="#c8956c" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="100" y1="80" x2="130" y2="78" stroke="#c8956c" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="100" y1="83" x2="130" y2="83" stroke="#c8956c" strokeWidth="1.2" strokeLinecap="round" />

      {/* Arms */}
      <ellipse cx="36" cy="116" rx="12" ry="18" fill="#f5c2a0" transform="rotate(15 36 116)" />
      <ellipse cx="124" cy="116" rx="12" ry="18" fill="#f5c2a0" transform="rotate(-15 124 116)" />

      {/* Feet */}
      <ellipse cx="62" cy="152" rx="18" ry="9" fill="#f9a07a" />
      <ellipse cx="98" cy="152" rx="18" ry="9" fill="#f9a07a" />

      {/* Tiny tail */}
      <ellipse cx="126" cy="130" rx="8" ry="6" fill="#fde8d8" />
    </svg>
  );
}
