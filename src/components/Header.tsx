"use client";

import React, { useState } from "react";
import {
  Camera,
  RotateCcw,
  Check,
  Maximize2,
  Minimize2,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CanvasUiLogo } from "@/components/canvasui/CanvasUiLogo";

interface HeaderProps {
  onSnapshot: () => void;
  onReset: () => void;
}

export function Header({
  onSnapshot,
  onReset,
}: HeaderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const handleSnapshotClick = () => {
    onSnapshot();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <header className="w-full h-14 bg-[#FAFAFA] shadow-[0_1px_0_0_rgba(0,0,0,0.1)] sticky top-0 z-40 px-3 sm:px-6 flex items-center justify-between shrink-0">
      <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo & Product Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Vercel Geometric Mark */}
          <div className="flex items-center justify-center size-7 rounded-[6px] bg-[#171717] text-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
            <svg
              width="14"
              height="14"
              viewBox="0 0 76 65"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M38 0L76 65H0L38 0Z" fill="currentColor" />
            </svg>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-sm font-medium text-[#171717] tracking-tight whitespace-nowrap">
              ASCII 3D
            </span>
            <span className="text-xs text-[#8F8F8F]">/</span>
            <span className="text-xs text-[#4D4D4D] font-mono hidden xs:inline">
              studio
            </span>
          </div>
        </div>

        {/* Center: Made with Canvas UI Link */}
        <div className="flex items-center justify-center">
          <a
            href="https://canvasui.dev/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Made with Canvas UI - Opens in a new tab"
            title="Made with Canvas UI - https://canvasui.dev/"
            className="group inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-[6px] bg-white hover:bg-[#F5F5F5] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] hover:shadow-[0_0_0_1px_rgba(0,0,0,0.16)] transition-all duration-150 focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_#FFFFFF,0_0_0_4px_#0072F5]"
          >
            <span className="text-[11px] sm:text-xs text-[#8F8F8F] group-hover:text-[#4D4D4D] transition-colors font-normal whitespace-nowrap">
              Made with
            </span>
            <div className="flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-[4px] bg-[#000000] text-white shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
              <CanvasUiLogo className="h-3 sm:h-3.5 w-auto" />
            </div>
            <ArrowUpRight className="size-3 text-[#8F8F8F] group-hover:text-[#171717] transition-colors shrink-0" />
          </a>
        </div>


        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Reset Defaults */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs text-[#4D4D4D] hover:text-[#171717]"
            title="Reset settings to defaults"
          >
            <RotateCcw className="size-3.5 mr-1.5 text-[#8F8F8F]" />
            Reset
          </Button>

          {/* Snapshot PNG (Primary Vercel Button) */}
          <Button
            size="sm"
            onClick={handleSnapshotClick}
            className="text-xs"
            title="Export high-resolution PNG snapshot"
          >
            {saved ? (
              <>
                <Check className="size-3.5 mr-1.5 text-white" />
                Saved
              </>
            ) : (
              <>
                <Camera className="size-3.5 mr-1.5" />
                Snapshot PNG
              </>
            )}
          </Button>

          {/* Fullscreen Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            className="text-[#4D4D4D] hover:text-[#171717]"
          >
            {isFullscreen ? (
              <Minimize2 className="size-4" />
            ) : (
              <Maximize2 className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
