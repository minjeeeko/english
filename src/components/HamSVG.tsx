type Props = { size?: number; mood?: "normal" | "sleepy" };

export function HamSVG({ size = 60, mood = "normal" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ears */}
      <circle cx="24" cy="26" r="13" fill="#f6e2bd" stroke="#2e3338" strokeWidth="3" />
      <circle cx="24" cy="26" r="6" fill="#ffd0d6" />
      <circle cx="76" cy="26" r="13" fill="#f6e2bd" stroke="#2e3338" strokeWidth="3" />
      <circle cx="76" cy="26" r="6" fill="#ffd0d6" />
      {/* Face */}
      <ellipse cx="50" cy="56" rx="38" ry="34" fill="#f6e2bd" stroke="#2e3338" strokeWidth="3" />
      {/* Mouth area */}
      <ellipse cx="50" cy="66" rx="18" ry="11" fill="#fff7e8" />
      {/* Cheeks */}
      <ellipse cx="23" cy="66" rx="8" ry="5" fill="#ffc2cb" opacity="0.7" />
      <ellipse cx="77" cy="66" rx="8" ry="5" fill="#ffc2cb" opacity="0.7" />
      {/* Eyes */}
      {mood === "normal" ? (
        <>
          <circle cx="37" cy="54" r="5" fill="#2e3338" />
          <circle cx="63" cy="54" r="5" fill="#2e3338" />
          <circle cx="39" cy="52" r="1.5" fill="white" />
          <circle cx="65" cy="52" r="1.5" fill="white" />
        </>
      ) : (
        <>
          <line x1="32" y1="54" x2="42" y2="54" stroke="#2e3338" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="58" y1="54" x2="68" y2="54" stroke="#2e3338" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
      {/* Nose */}
      <ellipse cx="50" cy="63" rx="4" ry="2.5" fill="#e98aa0" stroke="#2e3338" strokeWidth="1.5" />
      {/* Mouth */}
      <path d="M44 68 Q50 73 56 68" stroke="#2e3338" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
