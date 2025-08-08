import { create } from "zustand";
import { PadGrid } from "@/lib/sound/types";
import { initial2x2 } from "@/lib/sound/presets";

interface PadStore {
  padGrid: PadGrid;
  initialPadGrid: PadGrid;
  padSize: number;
  setPadSize: (newsize: number) => void;
  setPadGrid: (newGrid: PadGrid) => void;
  resetPadGrid: () => void;
  updatePadKeys: (padKeys: Record<string, string>) => void;
}

export const usePadStore = create<PadStore>((set) => ({
  padGrid: initial2x2,
  initialPadGrid: initial2x2,
  padSize: 2,
  setPadSize: (newsize) =>
    set(() => ({
      padSize: newsize,
    })),
  setPadGrid: (newGrid) =>
    set(() => ({
      padGrid: newGrid,
      initialPadGrid: newGrid, // 초기 상태도 함께 덮어쓰기
    })),
  resetPadGrid: () =>
    set((state) => ({
      padGrid: state.initialPadGrid,
    })),

  updatePadKeys: (padKeys) =>
    set((state) => ({
      padGrid: state.padGrid.map((pad) => ({
        ...pad,
        key: padKeys[pad.id] || pad.key,
      })),
    })),
}));
