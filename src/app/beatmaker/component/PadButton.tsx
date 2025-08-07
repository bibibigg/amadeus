import { PadInfo } from "@/lib/sound/types";

interface PadButtonProps {
  // pad: PadInfo;
  rowIndex?: number;
  colIndex?: number;
  isPressed?: boolean;
  onPlay: () => void; // 사운드 재생 함수
}

export default function PadButton({
  // pad,
  onPlay,
  isPressed = false,
}: PadButtonProps) {
  return (
    <div className="p-[4px] bg-gradient-to-tr from-yellow-700 via-yellow-500 to-yellow-300 w-full h-full">
      <button
        onClick={onPlay}
        className={`w-full h-full aspect-square p-4 transition-all duration-75
          bg-gray-800
          outline-none
          active:bg-red-500 active:scale-95 active:brightness-125"
          ${isPressed ? "bg-red-500 scale-95 brightness-125" : ""}
        `}
      ></button>
    </div>
    // <button className="bg-gray-800 border-4 border-amber-300 aspect-square w-50 p-4"></button>
  );
}
