type Props = { size?: number; mood?: "normal" | "sleepy" };

export function HamSVG({ size = 60, mood = "normal" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ears — small and close together on top */}
      <ellipse cx="33" cy="22" rx="10" ry="9" fill="#f0c8a0" stroke="#1c1c1e" strokeWidth="2.5" />
      <ellipse cx="33" cy="23" rx="5" ry="4.5" fill="#f4a0b0" />
      <ellipse cx="67" cy="22" rx="10" ry="9" fill="#f0c8a0" stroke="#1c1c1e" strokeWidth="2.5" />
      <ellipse cx="67" cy="23" rx="5" ry="4.5" fill="#f4a0b0" />

      {/* Cheek pouches — the defining hamster feature, very round and prominent */}
      <ellipse cx="17" cy="62" rx="15" ry="16" fill="#f5ddb8" stroke="#1c1c1e" strokeWidth="2.5" />
      <ellipse cx="83" cy="62" rx="15" ry="16" fill="#f5ddb8" stroke="#1c1c1e" strokeWidth="2.5" />

      {/* Main face — wide and round, sits on top of the cheeks */}
      <ellipse cx="50" cy="54" rx="32" ry="30" fill="#f5ddb8" stroke="#1c1c1e" strokeWidth="2.5" />

      {/* Belly / mouth area — lighter patch */}
      <ellipse cx="50" cy="66" rx="18" ry="13" fill="#fff8ee" />

      {/* Eyes — small and beady */}
      {mood === "normal" ? (
        <>
          <circle cx="39" cy="50" r="4.5" fill="#1c1c1e" />
          <circle cx="61" cy="50" r="4.5" fill="#1c1c1e" />
          <circle cx="40.5" cy="48.5" r="1.5" fill="white" />
          <circle cx="62.5" cy="48.5" r="1.5" fill="white" />
        </>
      ) : (
        <>
          <path d="M35 50 Q39 47 43 50" stroke="#1c1c1e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M57 50 Q61 47 65 50" stroke="#1c1c1e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </>
      )}

      {/* Nose — small pink button */}
      <ellipse cx="50" cy="60" rx="3.5" ry="2.5" fill="#e8809a" stroke="#1c1c1e" strokeWidth="1.5" />

      {/* Subtle whiskers */}
      <line x1="26" y1="61" x2="42" y2="63" stroke="#1c1c1e" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      <line x1="26" y1="65" x2="42" y2="65" stroke="#1c1c1e" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      <line x1="74" y1="61" x2="58" y2="63" stroke="#1c1c1e" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      <line x1="74" y1="65" x2="58" y2="65" stroke="#1c1c1e" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}
