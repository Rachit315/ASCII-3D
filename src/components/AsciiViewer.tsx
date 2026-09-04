"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Play,
  Pause,
  Layers,
  Terminal,
  Palette,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AsciiObjectOptions, AsciiObjectInstance } from "@/components/canvasui/AsciiObject";

const DynamicAsciiObject = dynamic(
  () => import("@/components/canvasui/AsciiObject").then((mod) => mod.AsciiObject),
  { ssr: false }
);

interface AsciiViewerProps {
  options: AsciiObjectOptions;
  onOptionsChange: (updates: Partial<AsciiObjectOptions>) => void;
  onRegisterCanvas: (canvas: HTMLCanvasElement | null) => void;
  activeTitle: string;
}

export function AsciiViewer({
  options,
  onOptionsChange,
  onRegisterCanvas,
  activeTitle,
}: AsciiViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [prevSrc, setPrevSrc] = useState(options.src);
  const instanceRef = useRef<AsciiObjectInstance | null>(null);

  // Synchronize load state with prop change during render
  if (options.src !== prevSrc) {
    setPrevSrc(options.src);
    setIsLoading(true);
    setLoadError(null);
  }

  const optionsWithCallbacks: AsciiObjectOptions = {
    ...options,
    onLoad: () => {
      setIsLoading(false);
      setLoadError(null);
      options.onLoad?.();
    },
    onError: (err) => {
      setIsLoading(false);
      setLoadError("Asset format could not be decoded.");
      options.onError?.(err);
    },
  };

  return (
    <div className="relative w-full h-full min-h-0 flex-1 flex items-center justify-center overflow-hidden rounded-[12px] bg-black select-none shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)]">
      {/* Top Left Vercel Status Tag */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-2 bg-[#171717]/90 text-white backdrop-blur-md px-3 py-1.5 rounded-[6px] shadow-[0_0_0_1px_rgba(255,255,255,0.15)] text-xs font-normal">
          {/* 10px Status Indicator Dot */}
          <div className="size-2.5 rounded-full bg-[#6CDA75]" />
          <span>3D Viewport</span>
          <span className="text-[#8F8F8F]">·</span>
          <span className="font-mono text-[#EBEBEB]">{activeTitle}</span>
        </div>
      </div>

      {/* Top Right Instruction Hint */}
      <div className="absolute top-3 right-3 z-10 hidden sm:flex items-center pointer-events-none">
        <div className="bg-[#171717]/80 text-[#8F8F8F] backdrop-blur-md px-2.5 py-1 rounded-[6px] text-[11px] font-mono shadow-[0_0_0_1px_rgba(255,255,255,0.1)]">
          Drag to Orbit · Scroll to Zoom
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity">
          <div className="flex items-center gap-2.5 p-4 rounded-[8px] bg-white text-[#171717] shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.08)]">
            <Loader2 className="size-4 animate-spin text-[#171717]" />
            <span className="text-xs font-normal">Rendering 3D ASCII Object...</span>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {loadError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 p-6 text-center">
          <div className="max-w-sm p-4 rounded-[8px] bg-white text-[#171717] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#E5484D] font-medium">
              <div className="size-2.5 rounded-full bg-[#E5484D]" />
              {loadError}
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onOptionsChange({ src: "/samples/skull.svg" })}
              className="text-xs"
            >
              Reset to Cyber Skull
            </Button>
          </div>
        </div>
      )}

      {/* 3D WebGL Canvas */}
      <DynamicAsciiObject
        className="w-full h-full"
        onCanvasReady={onRegisterCanvas}
        onInstanceReady={(inst) => {
          instanceRef.current = inst;
        }}
        {...optionsWithCallbacks}
      />

      {/* Floating Bottom Toolbar (Vercel segmented pill) */}
      <div className="absolute bottom-3 inset-x-0 mx-auto w-fit z-10 flex items-center gap-1 p-1 rounded-[6px] bg-white/95 backdrop-blur-md shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.08)]">
        {/* Toggle Auto Rotate */}
        <button
          onClick={() => onOptionsChange({ autoRotate: !options.autoRotate })}
          className={`flex items-center gap-1.5 h-7 px-2.5 rounded-[4px] text-xs transition-colors cursor-pointer ${
            options.autoRotate
              ? "bg-[#171717] text-white font-medium"
              : "text-[#4D4D4D] hover:bg-[#EBEBEB] hover:text-[#171717]"
          }`}
          title="Toggle Turntable Auto Rotation"
        >
          {options.autoRotate ? (
            <>
              <Pause className="size-3" />
              <span>Rotate: On</span>
            </>
          ) : (
            <>
              <Play className="size-3" />
              <span>Auto-Rotate</span>
            </>
          )}
        </button>

        <div className="w-[1px] h-3.5 bg-[#EBEBEB]" />

        {/* Toggle ASCII vs Raw 3D */}
        <button
          onClick={() => onOptionsChange({ ascii: !options.ascii })}
          className={`flex items-center gap-1.5 h-7 px-2.5 rounded-[4px] text-xs transition-colors cursor-pointer ${
            !options.ascii
              ? "bg-[#171717] text-white font-medium"
              : "text-[#4D4D4D] hover:bg-[#EBEBEB] hover:text-[#171717]"
          }`}
          title="Toggle between ASCII and Raw 3D Mesh"
        >
          {options.ascii ? (
            <>
              <Terminal className="size-3" />
              <span>ASCII</span>
            </>
          ) : (
            <>
              <Layers className="size-3" />
              <span>Raw 3D</span>
            </>
          )}
        </button>

        <div className="w-[1px] h-3.5 bg-[#EBEBEB]" />

        {/* Toggle Color Mode */}
        <button
          onClick={() => onOptionsChange({ colored: !options.colored })}
          className={`flex items-center gap-1.5 h-7 px-2.5 rounded-[4px] text-xs transition-colors cursor-pointer ${
            options.colored
              ? "text-[#171717] font-medium"
              : "text-[#4D4D4D] hover:bg-[#EBEBEB] hover:text-[#171717]"
          }`}
          title="Toggle Color Mode"
        >
          <Palette className="size-3" />
          <span>{options.colored ? "Color" : "Mono"}</span>
        </button>
      </div>
    </div>
  );
}
