import { useState } from "react";
import { setNickname } from "../lib/nickname";

export default function NicknamePage({ onDone }: { onDone: () => void }) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (!value.trim()) return;
    setNickname(value.trim());
    onDone();
  };

  return (
    <div className="min-h-screen bg-[#b2c7d9] flex flex-col items-center justify-center px-6 gap-6">
      <div className="text-[56px]">🐹</div>
      <div className="bg-white rounded-[20px] px-6 py-6 w-full max-w-sm shadow-subtle flex flex-col gap-4">
        <p className="text-[18px] font-[700] text-[#1c1c1e] text-center">
          안녕! 닉네임을 알려줘 👋
        </p>
        <p className="text-[13px] text-[#a5a8b5] text-center -mt-2">
          기억남/헷갈림이 닉네임별로 저장돼
        </p>
        <input
          className="w-full border border-[#e0e2e8] rounded-xl px-4 py-3 text-[16px] text-[#1c1c1e] placeholder-[#a5a8b5] focus:outline-none focus:border-[#34b3e0] transition-colors"
          placeholder="닉네임 입력…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          autoFocus
        />
        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="w-full py-3 rounded-full bg-[#fee500] disabled:bg-[#e0e0e0] text-[#1c1c1e] font-[700] text-[15px] transition-colors active:bg-[#fcd600]"
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
