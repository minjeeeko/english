type Props = {
  petted?: boolean;
  onClick?: () => void;
};

const FLOAT_EMOJIS = ["💗", "💕", "✨", "⭐", "🌟", "💫", "🩷", "💖", "🎀", "🌸"];

export function Mascot({ petted = false, onClick }: Props) {
  return (
    <div
      className={`relative cursor-pointer select-none transition-all duration-200 ${
        petted ? "scale-[1.1]" : "scale-100"
      }`}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 200 210"
        className={`w-48 h-48 ${petted ? "" : "animate-float"}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Ears ── */}
        <circle cx="64" cy="54" r="22" fill="#7a4828" />
        <circle cx="136" cy="54" r="22" fill="#7a4828" />
        <circle cx="64" cy="54" r="13" fill="#c07848" />
        <circle cx="136" cy="54" r="13" fill="#c07848" />

        {/* ── Main body (one big round blob) ── */}
        <ellipse cx="100" cy="128" rx="76" ry="74" fill="#f2c278" />

        {/* ── Tummy lighter patch ── */}
        <ellipse cx="100" cy="140" rx="44" ry="42" fill="#f8dfa8" />

        {/* ── Chubby cheeks ── */}
        <ellipse cx="56" cy="128" rx="26" ry="22" fill="#f5d090" />
        <ellipse cx="144" cy="128" rx="26" ry="22" fill="#f5d090" />

        {petted ? (
          /* ── Happy ^ ^ eyes ── */
          <>
            <path d="M 72 106 Q 82 98 92 106" stroke="#2a1008" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M 108 106 Q 118 98 128 106" stroke="#2a1008" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </>
        ) : (
          /* ── Normal small dot eyes ── */
          <>
            <circle cx="82" cy="108" r="6" fill="#2a1008" />
            <circle cx="118" cy="108" r="6" fill="#2a1008" />
            <circle cx="84" cy="106" r="2.5" fill="white" />
            <circle cx="120" cy="106" r="2.5" fill="white" />
          </>
        )}

        {/* ── Pink nose (prominent, centered) ── */}
        <ellipse cx="100" cy="122" rx="9" ry="7" fill="#e07888" />
        <ellipse cx="100" cy="120" rx="5" ry="3" fill="#f09aaa" opacity="0.6" />

        {/* ── Mouth ── */}
        {petted ? (
          <>
            <path d="M 90 130 Q 100 140 110 130" stroke="#c05868" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* little tongue */}
            <ellipse cx="100" cy="137" rx="7" ry="5" fill="#f07888" />
          </>
        ) : (
          <path d="M 93 130 Q 100 136 107 130" stroke="#c05868" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}

        {/* ── Blush ── */}
        <ellipse cx="68" cy="126" rx="16" ry="11" fill="#f4a0b8" opacity="0.55" />
        <ellipse cx="132" cy="126" rx="16" ry="11" fill="#f4a0b8" opacity="0.55" />

        {/* ── Arms / paws (hihi pose — raised toward face) ── */}
        <ellipse cx="38" cy="148" rx="14" ry="10" fill="#f2c278" transform="rotate(-45 38 148)" />
        <ellipse cx="162" cy="148" rx="14" ry="10" fill="#f2c278" transform="rotate(45 162 148)" />
        {/* paw tips */}
        <circle cx="30" cy="138" r="8" fill="#f2c278" />
        <circle cx="170" cy="138" r="8" fill="#f2c278" />
        <circle cx="28" cy="136" r="4" fill="#f4a0b8" opacity="0.7" />
        <circle cx="172" cy="136" r="4" fill="#f4a0b8" opacity="0.7" />

        {/* ── Feet ── */}
        <ellipse cx="74" cy="196" rx="22" ry="12" fill="#f2c278" />
        <ellipse cx="126" cy="196" rx="22" ry="12" fill="#f2c278" />
        {/* foot pads */}
        <ellipse cx="74" cy="200" rx="12" ry="7" fill="#f4a0b8" opacity="0.6" />
        <ellipse cx="126" cy="200" rx="12" ry="7" fill="#f4a0b8" opacity="0.6" />

        {/* ── Tiny tail ── */}
        <circle cx="174" cy="162" r="8" fill="#f8dfa8" />
      </svg>

      {/* Floating emojis when petted */}
      {petted && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {FLOAT_EMOJIS.map((emoji, i) => (
            <span
              key={i}
              className="absolute text-base animate-bounce"
              style={{
                top: `${-15 + (i % 4) * 6}%`,
                left: `${5 + (i * 10) % 88}%`,
                animationDelay: `${i * 0.08}s`,
                animationDuration: `${0.5 + (i % 4) * 0.15}s`,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
