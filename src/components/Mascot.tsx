type Props = {
  petted?: boolean;
  onClick?: () => void;
};

export function Mascot({ petted = false, onClick }: Props) {
  return (
    <div
      className={`relative cursor-pointer select-none transition-transform duration-150 ${
        petted ? "scale-110" : "scale-100"
      }`}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 180 180"
        className={`w-44 h-44 animate-float drop-shadow-md ${petted ? "animate-none" : ""}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ears — small and round */}
        <circle cx="52" cy="52" r="22" fill="#f9c5a0" />
        <circle cx="128" cy="52" r="22" fill="#f9c5a0" />
        <circle cx="52" cy="52" r="13" fill="#f4a07a" />
        <circle cx="128" cy="52" r="13" fill="#f4a07a" />

        {/* Body — very round */}
        <ellipse cx="90" cy="128" rx="52" ry="46" fill="#fddec8" />

        {/* Tummy */}
        <ellipse cx="90" cy="134" rx="32" ry="28" fill="#fff3ec" />

        {/* Head — big and round */}
        <circle cx="90" cy="82" r="52" fill="#fddec8" />

        {/* Cheek pouches — signature hamster feature */}
        <ellipse cx="46" cy="96" rx="20" ry="17" fill="#f9c5a0" />
        <ellipse cx="134" cy="96" rx="20" ry="17" fill="#f9c5a0" />

        {petted ? (
          /* Happy closed eyes when petted */
          <>
            <path d="M 68 76 Q 76 70 84 76" stroke="#4a2c1a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M 96 76 Q 104 70 112 76" stroke="#4a2c1a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </>
        ) : (
          /* Normal round eyes */
          <>
            <circle cx="76" cy="78" r="10" fill="white" />
            <circle cx="104" cy="78" r="10" fill="white" />
            <circle cx="78" cy="80" r="6" fill="#2d1a0e" />
            <circle cx="106" cy="80" r="6" fill="#2d1a0e" />
            <circle cx="80" cy="77" r="2.5" fill="white" />
            <circle cx="108" cy="77" r="2.5" fill="white" />
          </>
        )}

        {/* Nose */}
        <ellipse cx="90" cy="91" rx="5" ry="4" fill="#e07060" />

        {/* Mouth */}
        {petted ? (
          <path d="M 82 97 Q 90 105 98 97" stroke="#c05040" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M 84 97 Q 90 103 96 97" stroke="#c05040" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}

        {/* Whiskers */}
        <line x1="24" y1="90" x2="64" y2="93" stroke="#d4956c" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="24" y1="98" x2="64" y2="97" stroke="#d4956c" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="116" y1="93" x2="156" y2="90" stroke="#d4956c" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="116" y1="97" x2="156" y2="98" stroke="#d4956c" strokeWidth="1.5" strokeLinecap="round" />

        {/* Arms / paws */}
        <ellipse cx="42" cy="134" rx="14" ry="20" fill="#fddec8" transform="rotate(20 42 134)" />
        <ellipse cx="138" cy="134" rx="14" ry="20" fill="#fddec8" transform="rotate(-20 138 134)" />

        {/* Paw details */}
        <ellipse cx="36" cy="148" rx="10" ry="7" fill="#f9c5a0" />
        <ellipse cx="144" cy="148" rx="10" ry="7" fill="#f9c5a0" />

        {/* Feet */}
        <ellipse cx="70" cy="170" rx="20" ry="10" fill="#f9c5a0" />
        <ellipse cx="110" cy="170" rx="20" ry="10" fill="#f9c5a0" />

        {/* Tiny tail */}
        <circle cx="142" cy="148" r="7" fill="#fff3ec" />
      </svg>

      {/* Floating hearts when petted */}
      {petted && (
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute top-0 left-1/2 -translate-x-1/2 text-xl animate-bounce">💗</span>
          <span className="absolute top-2 left-1/4 text-base animate-ping" style={{ animationDuration: "0.8s" }}>✨</span>
          <span className="absolute top-2 right-1/4 text-base animate-ping" style={{ animationDuration: "1s" }}>✨</span>
        </div>
      )}
    </div>
  );
}
