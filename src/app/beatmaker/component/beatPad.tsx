"use client";
import { useEffect, useRef, useState } from "react";
import { PadGrid, PadInfo } from "@/lib/sound/types";
import PadButton from "@/app/beatmaker/component/PadButton";
import { useCallback } from "react";
import { supabase } from "@/lib/supabase";

type BeatPadProps = {
  padGrid: PadGrid; // string[][]에서 PadGrid로 변경
};

export default function BeatPad({ padGrid }: BeatPadProps) {
  const [pressedPadButtons, setPressedPadButtons] = useState<Set<string>>(
    new Set()
  );
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  // 업로드 기능 구현 시 uuid를 사용하여 파일 업로드, wav파일만 업로드

  // Supabase에서 사운드 URL 가져오기
  const getSupabaseUrl = (filename: string) => {
    const { data } = supabase.storage.from("amadeus").getPublicUrl(filename);
    if (data) {
    }
    return data.publicUrl;
  };

  // 오디오 초기화

  useEffect(() => {
    const allPads = padGrid.flat();
    allPads.forEach((pad) => {
      if (pad.soundUrl && !audioRefs.current[pad.id]) {
        const audio = new Audio(getSupabaseUrl(pad.soundUrl));
        audio.preload = "auto";
        audioRefs.current[pad.id] = audio;
      }
    });

    // 컴포넌트 언마운트 시 오디오 객체 정리
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        audio.src = "";
      });
      audioRefs.current = {};
    };
  }, [padGrid]);

  // 사운드 재생 함수
  const playSound = useCallback(async (pad: PadInfo) => {
    const audio = audioRefs.current[pad.id];

    if (audio) {
      try {
        audio.currentTime = 0;
        await audio.play();
        console.log(`Playing sound: ${pad.label}`);
      } catch (error) {
        console.error("사운드 재생 실패:", error);
      }
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.repeat) return; //  키를 누르고 있는동안 반복 방지

      // 입력 필드나 텍스트 영역에서의 키 입력은 무시
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      const foundPad = padGrid.flat().find((pad) => pad.key === key);

      if (foundPad) {
        setPressedPadButtons((prev) => new Set([...prev, foundPad.id]));
        playSound(foundPad);
      }
    },
    [padGrid, playSound]
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const foundPad = padGrid.flat().find((pad) => pad.key === key);

      if (foundPad) {
        // 키보드로 눌린 패드 상태 제거
        setPressedPadButtons((prev) => {
          const newSet = new Set(prev);
          newSet.delete(foundPad.id);
          return newSet;
        });
      }
    },
    [padGrid]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  let gridclass = "grid-cols-2";
  if (padGrid.length === 3) {
    gridclass = "grid-cols-3";
  } else if (padGrid.length === 4) {
    gridclass = "grid-cols-4";
  }

  return (
    <div className="flex flex-col mx-auto items-center justify-center aspect-square w-120 md:w-180 bg-[#d63c3c] ">
      <div className={`grid ${gridclass} gap-4 w-full h-full p-14`}>
        {padGrid.map((row, rowIndex) =>
          row.map((pad, colIndex) => (
            <PadButton
              key={pad.id}
              pad={pad}
              // rowIndex={rowIndex}
              // colIndex={colIndex}
              isPressed={pressedPadButtons.has(pad.id)}
              onPlay={() => playSound(pad)}
            />
          ))
        )}
      </div>
    </div>
  );
}
