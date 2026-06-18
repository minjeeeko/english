import { useState, useEffect } from "react";

type Props = { petted?: boolean; onClick?: () => void };

const FLOAT_EMOJIS = ["💗","💕","✨","⭐","🌟","💫","🩷","💖","🎀","🌸"];
const IDLE_IMGS = ["/ham1.png","/ham2.png","/ham3.png","/ham4.png","/ham5.png","/ham6.png"];

export function Mascot({ petted = false, onClick }: Props) {
  const [idleImg, setIdleImg] = useState("/ham1.png");
  const [pettedImg, setPettedImg] = useState("/ham4.png");

  /* 앱 시작 시 idle 이미지 랜덤 선택 */
  useEffect(() => {
    setIdleImg(IDLE_IMGS[Math.floor(Math.random() * IDLE_IMGS.length)]);
  }, []);

  /* 쓰다듬을 때마다 다른 이미지 */
  useEffect(() => {
    if (petted) {
      const others = IDLE_IMGS.filter((img) => img !== idleImg);
      setPettedImg(others[Math.floor(Math.random() * others.length)]);
    }
  }, [petted]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={`relative cursor-pointer select-none transition-all duration-200 ${petted ? "scale-[1.1]" : "scale-100"}`}
      onClick={onClick}
    >
      <img
        src={petted ? pettedImg : idleImg}
        alt="mascot"
        className={`w-44 h-44 object-contain ${petted ? "" : "animate-float"}`}
        draggable={false}
      />

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
