"use client";
import useBeatPad from "@/hooks/useBeatPad";
import useMetronome from "@/hooks/useMetronome";
import PadButton from "@/app/beatmaker/component/PadButton";
import { usePadStore } from "@/store/usePadStore";
import { FaCaretSquareUp } from "react-icons/fa";
import { FaCaretSquareDown } from "react-icons/fa";
// 이름수정
export default function BeatPad() {
  const { padGrid, padSize } = usePadStore();
  const { bpm, setBpm, isPlaying, start, stop } = useMetronome(80);
  const { pressedPadButtons, playSound } = useBeatPad(padGrid);

  const handleBPMUp = () => {
    setBpm((prevBPM) => Math.min(prevBPM + 1, 300)); // 최대 BPM 300
  };
  const handleBPMDown = () => {
    setBpm((prevBPM) => Math.max(prevBPM - 1, 30)); // 최소 BPM 30
  };

  let gridclass = "grid-cols-2";
  if (padSize === 3) {
    gridclass = "grid-cols-3";
  } else if (padSize === 4) {
    gridclass = "grid-cols-4";
  }

  return (
    <>
      <div className="flex flex-col mx-auto  items-center justify-center aspect-square w-120 md:w-180 bg-[#d63c3c] ">
        <div className=" w-full flex items-center justify-center gap-1 bg-white/20 px-6 py-4">
          {/*임시로 ml로 비트표기 가운데로 위치 추후 이곳에 볼륨조절등의 버튼을 위치할것 */}
          <button className="ml-18 outline-none" onClick={handleBPMUp}>
            <FaCaretSquareUp size={35} />
          </button>
          <div className="w-22 bg-black font-digital text-2xl text-center text-green-300">
            {bpm}
          </div>
          <button className="outline-none" onClick={handleBPMDown}>
            <FaCaretSquareDown size={35} />
          </button>
          <button
            onClick={isPlaying ? stop : start}
            className={`ml-4 px-4 py-2 rounded font-medium text-white outline-none transition-colors ${
              isPlaying ? "bg-red-600 " : "bg-gray-400"
            }`}
          >
            {isPlaying ? "중지" : "시작"}
          </button>
        </div>

        <div className={`grid ${gridclass} gap-4 w-full h-full p-14`}>
          {padGrid.map((pad) => (
            <PadButton
              key={pad.id}
              isPressed={pressedPadButtons.has(pad.id)}
              onPlay={() => playSound(pad)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
