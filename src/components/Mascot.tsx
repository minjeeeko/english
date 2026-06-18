type Props = {
  petted?: boolean;
  onClick?: () => void;
};

const FLOAT_EMOJIS = ["💗", "💕", "✨", "⭐", "🌟", "💫", "🩷", "💖", "🎀", "🌸"];

const S = { stroke: "#5a3010", strokeWidth: "2.2", strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const ST = { stroke: "#5a3010", strokeWidth: "1.5", strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

export function Mascot({ petted = false, onClick }: Props) {
  return (
    <div
      className={`relative cursor-pointer select-none transition-all duration-200 ${petted ? "scale-[1.1]" : "scale-100"}`}
      onClick={onClick}
    >
      <svg viewBox="0 0 200 210" className={`w-48 h-48 ${petted ? "" : "animate-float"}`} xmlns="http://www.w3.org/2000/svg">

        {/* ── Left ear ── */}
        <path d="M 65 33 C 76 31,88 41,87 54 C 86 67,77 77,64 76 C 51 75,42 65,43 53 C 44 40,54 35,65 33 Z" fill="#7a4828" {...S} />
        <path d="M 65 43 C 71 41,78 46,78 54 C 78 62,73 68,64 67 C 55 66,51 60,52 53 C 53 46,59 45,65 43 Z" fill="#c07848" {...ST} />

        {/* ── Right ear ── */}
        <path d="M 135 33 C 146 35,156 40,157 53 C 158 66,149 75,136 76 C 123 77,114 67,113 54 C 112 41,124 31,135 33 Z" fill="#7a4828" {...S} />
        <path d="M 135 43 C 141 45,147 46,148 53 C 149 60,145 66,136 67 C 127 68,122 62,123 55 C 124 46,129 41,135 43 Z" fill="#c07848" {...ST} />

        {/* ── Main body ── */}
        <path
          d="M 103 56 C 128 53,156 64,170 86 C 184 108,182 142,172 164 C 162 186,140 206,100 205 C 60 204,36 186,26 164 C 16 142,18 106,34 84 C 50 62,78 59,103 56 Z"
          fill="#f2c278" {...S}
        />

        {/* ── Tummy ── */}
        <path
          d="M 100 98 C 118 96,142 110,144 128 C 146 146,136 170,118 178 C 106 183,94 183,82 178 C 64 170,55 148,57 130 C 59 112,82 100,100 98 Z"
          fill="#f8dfa8" {...ST}
        />

        {/* ── Chubby cheeks (beige) ── */}
        <path d="M 57 108 C 68 106,83 114,83 128 C 83 142,70 151,56 150 C 42 149,30 140,31 128 C 32 115,46 110,57 108 Z" fill="#f5d090" {...ST} />
        <path d="M 143 108 C 154 110,168 115,169 128 C 170 140,158 149,144 150 C 130 151,117 142,117 128 C 117 114,132 106,143 108 Z" fill="#f5d090" {...ST} />

        {/* ── Eyes ── */}
        {petted ? (
          <>
            <path d="M 73 107 C 77 100,85 100,89 107" fill="none" stroke="#2a1008" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M 111 107 C 115 100,123 100,127 107" fill="none" stroke="#2a1008" strokeWidth="3.2" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="81" cy="109" r="6.5" fill="#2a1008" />
            <circle cx="119" cy="109" r="6.5" fill="#2a1008" />
            <circle cx="83" cy="107" r="2.5" fill="white" />
            <circle cx="121" cy="107" r="2.5" fill="white" />
          </>
        )}

        {/* ── Nose ── */}
        <path d="M 92 121 C 93 115,108 115,108 122 C 108 128,104 130,100 130 C 96 130,91 127,92 121 Z" fill="#e07888" {...ST} />
        <ellipse cx="100" cy="120" rx="5" ry="3" fill="#f4aabb" opacity="0.55" />

        {/* ── Mouth ── */}
        {petted ? (
          <>
            <path d="M 90 132 C 96 142,104 142,110 132" fill="none" stroke="#c05868" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M 94 138 C 96 146,104 146,106 138" fill="#f07888" stroke="none" />
          </>
        ) : (
          <path d="M 93 130 C 97 136,103 137,107 130" fill="none" stroke="#c05868" strokeWidth="2" strokeLinecap="round" />
        )}

        {/* ── Blush ── */}
        <ellipse cx="67" cy="126" rx="16" ry="11" fill="#f4a0b8" opacity="0.5" />
        <ellipse cx="133" cy="126" rx="16" ry="11" fill="#f4a0b8" opacity="0.5" />

        {/* ── Left arm ── */}
        <path d="M 46 155 C 36 144,20 140,20 152 C 20 162,30 168,42 165 C 52 162,54 162,46 155 Z" fill="#f2c278" {...S} />
        <path d="M 28 152 C 24 144,18 138,24 136 C 30 134,36 138,36 146 C 36 152,30 154,28 152 Z" fill="#f2c278" {...S} />
        <circle cx="26" cy="139" r="4.5" fill="#f4a0b8" opacity="0.65" />

        {/* ── Right arm ── */}
        <path d="M 154 155 C 146 162,148 162,158 165 C 170 168,180 162,180 152 C 180 140,164 144,154 155 Z" fill="#f2c278" {...S} />
        <path d="M 172 152 C 174 154,170 152,164 146 C 164 138,170 134,176 136 C 182 138,176 144,172 152 Z" fill="#f2c278" {...S} />
        <circle cx="174" cy="139" r="4.5" fill="#f4a0b8" opacity="0.65" />

        {/* ── Left foot ── */}
        <path d="M 55 186 C 60 182,80 182,90 188 C 98 193,96 204,82 207 C 68 210,54 204,52 196 C 50 190,52 188,55 186 Z" fill="#f2c278" {...S} />
        <ellipse cx="73" cy="200" rx="12" ry="6" fill="#f4a0b8" opacity="0.55" />

        {/* ── Right foot ── */}
        <path d="M 145 186 C 148 188,150 190,148 196 C 146 204,132 210,118 207 C 104 204,102 193,110 188 C 120 182,140 182,145 186 Z" fill="#f2c278" {...S} />
        <ellipse cx="127" cy="200" rx="12" ry="6" fill="#f4a0b8" opacity="0.55" />

        {/* ── Tail ── */}
        <path d="M 174 155 C 182 154,185 160,183 167 C 181 174,174 175,170 170 C 166 165,166 156,174 155 Z" fill="#f8dfa8" {...ST} />

      </svg>

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
