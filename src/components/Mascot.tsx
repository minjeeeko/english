type Props = {
  petted?: boolean;
  onClick?: () => void;
};

const FLOAT_EMOJIS = ["💗", "💕", "✨", "⭐", "🌟", "💫", "🩷", "💖"];

export function Mascot({ petted = false, onClick }: Props) {
  return (
    <div
      className={`relative cursor-pointer select-none transition-all duration-200 ${
        petted ? "scale-[1.12]" : "scale-100"
      }`}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 200 200"
        className={`w-48 h-48 ${petted ? "" : "animate-float"} drop-shadow-sm`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ears */}
        <circle cx="55" cy="55" r="24" fill="#fbbf9a" />
        <circle cx="145" cy="55" r="24" fill="#fbbf9a" />
        <circle cx="55" cy="55" r="14" fill="#f9956a" />
        <circle cx="145" cy="55" r="14" fill="#f9956a" />

        {/* Body */}
        <ellipse cx="100" cy="148" rx="58" ry="48" fill="#fde8d0" />
        {/* Tummy */}
        <ellipse cx="100" cy="154" rx="36" ry="32" fill="#fff5ee" />

        {/* Head — big round */}
        <circle cx="100" cy="92" r="58" fill="#fde8d0" />

        {/* Blush */}
        <ellipse cx="60" cy="108" rx="16" ry="10" fill="#f9a07a" opacity="0.5" />
        <ellipse cx="140" cy="108" rx="16" ry="10" fill="#f9a07a" opacity="0.5" />

        {/* Cheek pouches */}
        <ellipse cx="50" cy="100" rx="22" ry="19" fill="#fbbf9a" opacity="0.8" />
        <ellipse cx="150" cy="100" rx="22" ry="19" fill="#fbbf9a" opacity="0.8" />

        {/* Eyes */}
        {petted ? (
          <>
            {/* Happy ^ ^ eyes */}
            <path d="M 72 86 Q 82 78 92 86" stroke="#3b1f0e" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 108 86 Q 118 78 128 86" stroke="#3b1f0e" strokeWidth="4" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="82" cy="88" r="12" fill="white" />
            <circle cx="118" cy="88" r="12" fill="white" />
            {/* Iris */}
            <circle cx="84" cy="90" r="7.5" fill="#2d1a0e" />
            <circle cx="120" cy="90" r="7.5" fill="#2d1a0e" />
            {/* Shine */}
            <circle cx="87" cy="86" r="3" fill="white" />
            <circle cx="123" cy="86" r="3" fill="white" />
            <circle cx="82" cy="92" r="1.2" fill="white" opacity="0.6" />
            <circle cx="118" cy="92" r="1.2" fill="white" opacity="0.6" />
          </>
        )}

        {/* Nose */}
        <ellipse cx="100" cy="102" rx="5.5" ry="4.5" fill="#e06858" />

        {/* Mouth */}
        {petted ? (
          <>
            <path d="M 90 108 Q 100 118 110 108" stroke="#c04838" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Tongue */}
            <ellipse cx="100" cy="116" rx="6" ry="4" fill="#f07060" />
          </>
        ) : (
          <path d="M 92 108 Q 100 114 108 108" stroke="#c04838" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}

        {/* Whiskers */}
        <line x1="20" y1="96" x2="68" y2="100" stroke="#d4906a" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <line x1="20" y1="104" x2="68" y2="104" stroke="#d4906a" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <line x1="132" y1="100" x2="180" y2="96" stroke="#d4906a" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <line x1="132" y1="104" x2="180" y2="104" stroke="#d4906a" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

        {/* Arms */}
        <ellipse cx="44" cy="152" rx="16" ry="22" fill="#fde8d0" transform="rotate(18 44 152)" />
        <ellipse cx="156" cy="152" rx="16" ry="22" fill="#fde8d0" transform="rotate(-18 156 152)" />
        <ellipse cx="36" cy="168" rx="12" ry="8" fill="#fbbf9a" />
        <ellipse cx="164" cy="168" rx="12" ry="8" fill="#fbbf9a" />

        {/* Feet */}
        <ellipse cx="76" cy="190" rx="22" ry="11" fill="#fbbf9a" />
        <ellipse cx="124" cy="190" rx="22" ry="11" fill="#fbbf9a" />

        {/* Tail */}
        <circle cx="158" cy="168" r="9" fill="#fff5ee" />
      </svg>

      {/* Floating emojis when petted */}
      {petted && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {FLOAT_EMOJIS.map((emoji, i) => (
            <span
              key={i}
              className="absolute text-lg animate-bounce"
              style={{
                top: `${-10 + (i % 3) * 8}%`,
                left: `${10 + (i * 11) % 80}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${0.6 + (i % 3) * 0.2}s`,
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
