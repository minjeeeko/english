type Props = { petted?: boolean; onClick?: () => void };

const FLOAT_EMOJIS = ["💗","💕","✨","⭐","🌟","💫","🩷","💖","🎀","🌸"];

/* stroke 공통 속성 */
const S  = { stroke:"#b06040", strokeWidth:"3",   strokeLinejoin:"round" as const, strokeLinecap:"round" as const };
const ST = { stroke:"#b06040", strokeWidth:"2",   strokeLinejoin:"round" as const, strokeLinecap:"round" as const };
const SW = { stroke:"#c8956c", strokeWidth:"1.8", strokeLinecap:"round" as const };

export function Mascot({ petted = false, onClick }: Props) {
  return (
    <div
      className={`relative cursor-pointer select-none transition-all duration-200 ${petted ? "scale-[1.1]" : "scale-100"}`}
      onClick={onClick}
    >
      <svg viewBox="0 0 160 160" className={`w-44 h-44 ${petted ? "" : "animate-float"}`} xmlns="http://www.w3.org/2000/svg">

        {/* ── 왼쪽 귀 ── */}
        <path d="M 34 33 C 46 29,60 38,59 54 C 58 70,47 86,32 85 C 17 84,5 72,7 56 C 9 40,22 37,34 33 Z"
          fill="#f5c2a0" {...S} />
        <path d="M 34 44 C 41 41,50 46,49 55 C 48 64,43 73,33 72 C 23 71,17 63,18 55 C 19 47,27 47,34 44 Z"
          fill="#f9a07a" {...ST} />

        {/* ── 오른쪽 귀 ── */}
        <path d="M 126 33 C 138 37,151 40,153 56 C 155 72,143 84,128 85 C 113 86,102 70,101 54 C 100 38,114 29,126 33 Z"
          fill="#f5c2a0" {...S} />
        <path d="M 126 44 C 133 47,141 47,142 55 C 143 63,137 71,127 72 C 117 73,112 64,111 55 C 110 46,119 41,126 44 Z"
          fill="#f9a07a" {...ST} />

        {/* ── 몸통 (머리 뒤에 먼저 그림) ── */}
        <path d="M 82 71 C 106 68,130 86,129 112 C 128 137,110 156,80 155 C 50 154,32 136,31 112 C 30 87,58 74,82 71 Z"
          fill="#f5c2a0" {...S} />

        {/* ── 배 패치 ── */}
        <path d="M 81 93 C 95 91,111 101,110 118 C 109 133,98 145,80 144 C 62 143,50 132,52 118 C 54 103,68 95,81 93 Z"
          fill="#fde8d8" {...ST} />

        {/* ── 머리 ── */}
        <path d="M 83 31 C 102 28,124 44,125 67 C 126 90,112 115,80 114 C 48 113,35 90,36 68 C 37 45,64 34,83 31 Z"
          fill="#f5c2a0" {...S} />

        {/* ── 볼 주머니 ── */}
        <path d="M 46 70 C 56 68,63 73,62 81 C 61 89,55 96,44 95 C 33 94,27 87,29 80 C 31 73,38 72,46 70 Z"
          fill="#f9a07a" {...ST} style={{opacity:0.72}} />
        <path d="M 114 70 C 122 72,129 73,131 80 C 133 87,127 94,116 95 C 105 96,99 89,98 81 C 97 73,104 68,114 70 Z"
          fill="#f9a07a" {...ST} style={{opacity:0.72}} />

        {/* ── 눈 ── */}
        {petted ? (
          <>
            <path d="M 57 63 C 61 56,68 56,72 63" fill="none" stroke="#2d1a0e" strokeWidth="3.2" strokeLinecap="round"/>
            <path d="M 88 63 C 92 56,99 56,103 63" fill="none" stroke="#2d1a0e" strokeWidth="3.2" strokeLinecap="round"/>
          </>
        ) : (
          <>
            {/* 흰자 */}
            <path d="M 66 57 C 72 55,75 60,74 66 C 73 72,68 75,64 74 C 58 73,56 67,58 62 C 60 57,62 59,66 57 Z"
              fill="white" {...ST} />
            <path d="M 94 57 C 98 59,102 57,102 62 C 102 67,100 73,95 74 C 91 75,87 72,86 66 C 85 60,88 55,94 57 Z"
              fill="white" {...ST} />
            {/* 동공 */}
            <circle cx="67" cy="67" r="5" fill="#2d1a0e" />
            <circle cx="97" cy="67" r="5" fill="#2d1a0e" />
            <circle cx="69" cy="65" r="2" fill="white" />
            <circle cx="99" cy="65" r="2" fill="white" />
          </>
        )}

        {/* ── 코 ── */}
        <path d="M 77 79 C 77 75,84 75,83 79 C 82 83,78 83,77 79 Z"
          fill="#e07060" {...ST} />

        {/* ── 입 ── */}
        {petted ? (
          <>
            <path d="M 73 85 C 77 91,84 91,87 85" fill="none" stroke="#c05040" strokeWidth="2.4" strokeLinecap="round"/>
            <ellipse cx="80" cy="90" rx="5" ry="3.5" fill="#f07060" />
          </>
        ) : (
          <path d="M 74 84 C 77 89,83 89,86 84" fill="none" stroke="#c05040" strokeWidth="2.2" strokeLinecap="round"/>
        )}

        {/* ── 수염 ── */}
        <line x1="30" y1="78" x2="62" y2="80" {...SW}/>
        <line x1="30" y1="84" x2="62" y2="83" {...SW}/>
        <line x1="98" y1="80" x2="130" y2="78" {...SW}/>
        <line x1="98" y1="83" x2="130" y2="84" {...SW}/>

        {/* ── 왼팔 ── */}
        <path d="M 24 102 C 16 110,18 128,28 135 C 38 141,50 137,50 125 C 50 112,32 96,24 102 Z"
          fill="#f5c2a0" {...S} />

        {/* ── 오른팔 ── */}
        <path d="M 136 102 C 128 96,110 112,110 125 C 110 137,122 141,132 135 C 142 128,144 110,136 102 Z"
          fill="#f5c2a0" {...S} />

        {/* ── 왼발 ── */}
        <path d="M 63 144 C 74 142,83 146,82 153 C 81 159,72 163,62 162 C 51 161,44 156,45 152 C 46 146,54 146,63 144 Z"
          fill="#f9a07a" {...S} />

        {/* ── 오른발 ── */}
        <path d="M 97 144 C 106 146,114 146,115 152 C 116 156,109 161,98 162 C 88 163,79 159,78 153 C 77 146,86 142,97 144 Z"
          fill="#f9a07a" {...S} />

        {/* ── 꼬리 ── */}
        <path d="M 126 124 C 133 123,136 127,135 132 C 134 137,129 138,125 136 C 121 134,119 129,121 126 C 123 123,124 125,126 124 Z"
          fill="#fde8d8" {...ST} />

      </svg>

      {petted && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {FLOAT_EMOJIS.map((emoji, i) => (
            <span key={i} className="absolute text-base animate-bounce"
              style={{ top:`${-15+(i%4)*6}%`, left:`${5+(i*10)%88}%`, animationDelay:`${i*0.08}s`, animationDuration:`${0.5+(i%4)*0.15}s` }}>
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
