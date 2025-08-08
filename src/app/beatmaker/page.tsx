"use client";
import BeatPad from "./component/beatPad";
import { PadGrid } from "@/lib/sound/types";
import { presetsBySize, initial2x2 } from "@/lib/sound/presets";
import { useEffect, useState } from "react";
import { usePadStore } from "@/store/usePadStore";

export default function PadPage() {
  const { setPadGrid, updatePadKeys, setPadSize } = usePadStore();
  useEffect(() => {
    // 로컬스토리지에서 패드 키 설정 불러오기
    const savedPadKeys = localStorage.getItem("padKeys");
    if (savedPadKeys) {
      try {
        // 로컬스토리지에 저장된 키가 있다면, 해당 키로 패드 설정
        const padKeys = JSON.parse(savedPadKeys);
        updatePadKeys(padKeys);
      } catch (error) {
        console.error(
          "로컬스토리지에서 패드 키 설정을 불러오는 중 오류 발생:",
          error
        );
      }
    }
  }, []);

  // 패드 크기 변경 핸들러
  const handlePadSizeChange = (newSize: 2 | 3 | 4) => {
    setPadSize(newSize);
    setPadGrid(presetsBySize[newSize]);
  };

  // const [padSize, setPadSize] = useState(2); // 기본 2x2 패드
  // const [padGrid, setPadGrid] = useState<string[][]>([[]]); // 2차원 배열 초기화
  return (
    <>
      {/*패드 크기 조정부분은 ui사이즈를 먼저 조정한 후 업데이트 진행 */}
      {/* <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          패드 크기: {padSize}x{padSize}
        </label>
        <div className="flex gap-2">
          {([2, 3, 4] as const).map((size) => (
            <button
              key={size}
              onClick={() => handlePadSizeChange(size)}
              className={`px-4 py-2 rounded ${
                padSize === size
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {size}x{size}
            </button>
          ))}
        </div>
      </div> */}
      <div className="relative w-full">
        <BeatPad />
      </div>
    </>
  );
}
