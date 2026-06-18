type Props = {
  petted?: boolean;
  onClick?: () => void;
};

const FLOAT_EMOJIS = ["💗", "💕", "✨", "⭐", "🌟", "💫", "🩷", "💖", "🎀", "🌸"];

const STROKE = { stroke: "#5a3010", strokeWidth: "2.2", strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const STROKE_THIN = { stroke: "#5a3010", strokeWidth: "1.6", strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

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
        {/* ── Left ear (wobbly) ── */}
        <path
          d="M 66 34 C 76 30, 88 38, 88 52 C 88 66, 78 78, 65 77 C 52 76, 41 66, 42 53 C 43 40, 55 38, 66 34 Z"
          fill="#7a4828" {...STROKE}
        />
        <path
          d="M 66 44 C 72 41, 78 46, 78 53 C 78 60, 73 68, 65 68 C 57 68, 52 61, 53 54 C 54 47, 60 47, 66 44 Z"
          fill="#c07848" {...STROKE_THIN}
        />

        {/* ── Right ear (wobbly) ── */}
        <path
          d="M 134 34 C 145 38, 157 40, 158 53 C 159 66, 148 76, 135 77 C 122 78, 112 66, 112 52 C 112 38, 122 30, 134 34 Z"
          fill="#7a4828" {...STROKE}
        />
        <path
          d="M 134 44 C 140 47, 146 47, 147 54 C 148 61, 143 68, 135 68 C 127 68, 122 60, 123 53 C 124 46, 128 41, 134 44 Z"
          fill="#c07848" {...STROKE_THIN}
        />

        {/* ── Main body (wobbly blob) ── */}
        <path
          d="M 102 56
             C 124 53, 150 60, 165 76
             C 180 92, 182 114, 179 134
             C 176 154, 166 174, 150 188
             C 134 202, 116 207, 99 206
             C 82 205, 64 200, 50 187
             C 36 174, 22 154, 21 132
             C 20 110, 24 88, 38 73
             C 52 58, 80 59, 102 56 Z"
          fill="#f2c278" {...STROKE}
        />

        {/* ── Tummy lighter patch (wobbly) ── */}
        <path
          d="M 100 100
             C 116 98, 132 110, 134 124
             C 136 138, 130 160, 116 168
             C 104 175, 94 175, 83 167
             C 70 159, 64 138, 67 124
             C 70 110, 84 102, 100 100 Z"
          fill="#f8dfa8" {...STROKE_THIN}
        />

        {/* ── Eyes ── */}
        {petted ? (
          <>
            <path d="M 72 107 C 76 100, 84 100, 88 107" {...STROKE} fill="none" strokeWidth="3" />
            <path d="M 112 107 C 116 100, 124 100, 128 107" {...STROKE} fill="none" strokeWidth="3" />
          </>
        ) : (
          <>
            <circle cx="81" cy="109" r="6.5" fill="#2a1008" />
            <circle cx="119" cy="109" r="6.5" fill="#2a1008" />
            <circle cx="83" cy="107" r="2.5" fill="white" />
            <circle cx="121" cy="107" r="2.5" fill="white" />
          </>
        )}

        {/* ── Nose (wobbly) ── */}
        <path
          d="M 93 121 C 94 116, 107 116, 108 121 C 109 126, 105 130, 100 130 C 95 130, 92 126, 93 121 Z"
          fill="#e07888" {...STROKE_THIN}
        />
        <ellipse cx="100" cy="120" rx="5" ry="3" fill="#f4aabb" opacity="0.55" />

        {/* ── Blush (soft, no stroke) ── */}
        <ellipse cx="68" cy="126" rx="16" ry="11" fill="#f4a0b8" opacity="0.5" />
        <ellipse cx="132" cy="126" rx="16" ry="11" fill="#f4a0b8" opacity="0.5" />

        {/* ── Left arm / paw (wobbly) ── */}
        <path
          d="M 44 152 C 36 144, 24 142, 22 152 C 20 162, 28 168, 38 166 C 48 164, 52 156, 44 152 Z"
          fill="#f2c278" {...STROKE}
        />
        <ellipse cx="30" cy="158" rx="5" ry="4" fill="#f4a0b8" opacity="0.6" />

        {/* ── Right arm / paw (wobbly) ── */}
        <path
          d="M 156 152 C 164 156, 178 142, 178 152 C 178 162, 170 168, 160 166 C 150 164, 148 144, 156 152 Z"
          fill="#f2c278" {...STROKE}
        />
        <ellipse cx="170" cy="158" rx="5" ry="4" fill="#f4a0b8" opacity="0.6" />

        {/* ── Left foot (wobbly) ── */}
        <path
          d="M 56 192 C 58 184, 72 182, 82 185 C 92 188, 96 196, 90 201 C 82 206, 64 206, 56 200 C 50 196, 54 196, 56 192 Z"
          fill="#f2c278" {...STROKE}
        />
        <ellipse cx="74" cy="198" rx="11" ry="6" fill="#f4a0b8" opacity="0.55" />

        {/* ── Right foot (wobbly) ── */}
        <path
          d="M 144 192 C 146 196, 150 196, 144 200 C 136 206, 118 206, 110 201 C 104 196, 108 188, 118 185 C 128 182, 142 184, 144 192 Z"
          fill="#f2c278" {...STROKE}
        />
        <ellipse cx="126" cy="198" rx="11" ry="6" fill="#f4a0b8" opacity="0.55" />

        {/* ── Tail ── */}
        <path
          d="M 166 160 C 174 156, 182 162, 180 170 C 178 178, 168 180, 162 174 C 156 168, 158 162, 166 160 Z"
          fill="#f8dfa8" {...STROKE_THIN}
        />
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
