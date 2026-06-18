export function Mascot() {
  return (
    <svg
      viewBox="0 0 120 140"
      className="w-40 h-40 animate-float drop-shadow-2xl"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body */}
      <ellipse cx="60" cy="85" rx="44" ry="46" fill="#6366f1" />
      {/* Head */}
      <circle cx="60" cy="48" r="36" fill="#818cf8" />
      {/* Ears */}
      <circle cx="25" cy="38" r="10" fill="#818cf8" />
      <circle cx="95" cy="38" r="10" fill="#818cf8" />
      <circle cx="25" cy="38" r="5" fill="#a5b4fc" />
      <circle cx="95" cy="38" r="5" fill="#a5b4fc" />
      {/* Eyes */}
      <ellipse cx="48" cy="44" rx="7" ry="8" fill="white" />
      <ellipse cx="72" cy="44" rx="7" ry="8" fill="white" />
      <circle cx="50" cy="46" r="4" fill="#1e1b4b" />
      <circle cx="74" cy="46" r="4" fill="#1e1b4b" />
      <circle cx="52" cy="44" r="1.5" fill="white" />
      <circle cx="76" cy="44" r="1.5" fill="white" />
      {/* Smile */}
      <path
        d="M 48 58 Q 60 68 72 58"
        stroke="white"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* Arms */}
      <ellipse
        cx="18"
        cy="88"
        rx="10"
        ry="18"
        fill="#6366f1"
        transform="rotate(-20 18 88)"
      />
      <ellipse
        cx="102"
        cy="88"
        rx="10"
        ry="18"
        fill="#6366f1"
        transform="rotate(20 102 88)"
      />
      {/* Feet */}
      <ellipse cx="46" cy="128" rx="16" ry="8" fill="#4f46e5" />
      <ellipse cx="74" cy="128" rx="16" ry="8" fill="#4f46e5" />
    </svg>
  );
}
