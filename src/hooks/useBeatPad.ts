import { useEffect, useRef, useState, useCallback } from "react";
import { PadInfo } from "@/lib/sound/types";
import { supabase } from "@/lib/supabase";

export default function useBeatPad(padGrid: PadInfo[]) {
  //눌린 패드 버튼
  const [pressedPadButtons, setPressedPadButtons] = useState<Set<string>>(
    new Set()
  );

  // AudioContext 전역 생성
  const audioContextRef = useRef<AudioContext | null>(null);

  // AudioBuffer 저장용
  const audioBuffersRef = useRef<Record<string, AudioBuffer>>({});

  // 업로드 기능 구현 시 uuid를 사용하여 파일 업로드, wav파일만 업로드

  // Supabase에서 사운드 URL 가져오기
  const getSupabaseUrl = (filename: string) => {
    const { data } = supabase.storage.from("amadeus").getPublicUrl(filename);
    if (data) {
    }
    return data.publicUrl;
  };

  // 렌더링 시 초기 비트샘플 로딩
  useEffect(() => {
    // AudioContext 초기화
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    padGrid.forEach(async (pad) => {
      if (pad.soundUrl && !audioBuffersRef.current[pad.id]) {
        try {
          const response = await fetch(getSupabaseUrl(pad.soundUrl));
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await audioContextRef.current!.decodeAudioData(
            arrayBuffer
          );
          audioBuffersRef.current[pad.id] = audioBuffer;
        } catch (error) {
          console.log("오디오 로딩 실패", error);
        }
      }
    });

    // 컴포넌트 언마운트 시 오디오 객체 정리
    return () => {
      audioBuffersRef.current = {};
      audioContextRef.current?.close();
      audioContextRef.current = null;
    };
  }, [padGrid]);

  // 사운드 재생 함수
  const playSound = useCallback(async (pad: PadInfo) => {
    const audioContext = audioContextRef.current;
    const buffer = audioBuffersRef.current[pad.id];

    if (audioContext && buffer) {
      try {
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start(0); // 즉시 재생
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
      const foundPad = padGrid.find((pad) => pad.key === key);

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
      const foundPad = padGrid.find((pad) => pad.key === key);

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

  return {
    pressedPadButtons,
    playSound,
  };
}
