"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import confetti from "canvas-confetti";
import { Header } from "@/components/Header";
import { AsciiViewer } from "@/components/AsciiViewer";
import { ControlPanel } from "@/components/ControlPanel";
import type { AsciiObjectOptions } from "@/components/canvasui/AsciiObject";
import { Upload } from "lucide-react";

const DEFAULT_OPTIONS: Required<AsciiObjectOptions> = {
  src: "/samples/skull.svg",
  ascii: true,
  cellSize: 10,
  cellAspect: 0.6,
  charset: Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join(""),
  colored: true,
  color: "#ffffff",
  contrast: 1.5,
  edgeContrast: 3.0,
  exposure: 1.0,
  invert: false,
  background: "",
  highlight: "#0062D1",
  environmentIntensity: 1.0,
  roughness: -1,
  scale: 3,
  xOffset: 0,
  yOffset: 0,
  floatIntensity: 2,
  rotationIntensity: 1,
  floatSpeed: 2,
  orbit: true,
  zoom: true,
  autoRotate: false,
  autoRotateSpeed: 2,
  fov: 65,
  cameraDistance: 4.2,
  dracoDecoderPath: "https://www.gstatic.com/draco/versioned/decoders/1.5.7/",
  onLoad: null,
  onError: null,
};

export default function Ascii3DStudio() {
  const [options, setOptions] = useState<AsciiObjectOptions>(DEFAULT_OPTIONS);
  const [activeTitle, setActiveTitle] = useState("Cyber Skull");
  const [isWindowDragging, setIsWindowDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleOptionsChange = useCallback((updates: Partial<AsciiObjectOptions>) => {
    setOptions((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleSelectSrc = useCallback((src: string, title: string) => {
    setActiveTitle(title);
    setOptions((prev) => ({ ...prev, src }));
  }, []);

  const handleReset = useCallback(() => {
    setOptions({
      ...DEFAULT_OPTIONS,
      src: options.src,
    });
  }, [options.src]);

  const handleSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      const safeTitle = activeTitle.toLowerCase().replace(/[^a-z0-9]/g, "-");
      link.download = `ascii-3d-${safeTitle}.png`;
      link.href = dataUrl;
      link.click();

      // Vercel-style clean monochromatic confetti
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.85 },
        colors: ["#171717", "#0072F5", "#8F8F8F", "#EBEBEB"],
      });
    } catch (e) {
      console.error("Snapshot error:", e);
    }
  }, [activeTitle]);

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.types.includes("Files")) {
        setIsWindowDragging(true);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDragLeave = (e: DragEvent) => {
      if (e.relatedTarget === null) {
        setIsWindowDragging(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsWindowDragging(false);
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        const objectUrl = URL.createObjectURL(file);
        handleSelectSrc(objectUrl, file.name);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === "Space") {
        e.preventDefault();
        setOptions((prev) => ({ ...prev, autoRotate: !prev.autoRotate }));
      } else if (e.key === "s" || e.key === "S") {
        if (!e.metaKey && !e.ctrlKey) {
          handleSnapshot();
        }
      } else if (e.key === "r" || e.key === "R") {
        if (!e.metaKey && !e.ctrlKey) {
          handleReset();
        }
      }
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSelectSrc, handleSnapshot, handleReset]);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#FAFAFA] text-[#171717] overflow-hidden">
      {/* Fullscreen Drag Overlay */}
      {isWindowDragging && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md shadow-[0_0_0_2px_#0072F5]">
          <div className="p-8 rounded-[12px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.08)] flex flex-col items-center gap-3 text-center">
            <Upload className="size-8 text-[#0072F5]" />
            <h3 className="text-xl font-medium tracking-tight text-[#171717]">
              Drop file to convert
            </h3>
            <p className="text-xs text-[#8F8F8F]">
              PNG, JPG, SVG, WebP, GIF, or GLB/glTF
            </p>
          </div>
        </div>
      )}

      {/* Vercel 56px Header */}
      <Header
        onSnapshot={handleSnapshot}
        onReset={handleReset}
      />

      {/* Main Studio Viewport: Fills 100% of remaining screen height (NO SCROLL) */}
      <main className="flex-1 min-h-0 w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex flex-col gap-2.5 overflow-hidden">
        {/* Compact Sub-Bar: Title, Subtitle, & Keyboard Shortcuts in a single slim row */}
        <div className="flex items-center justify-between shrink-0 h-6">
          <div className="flex items-baseline gap-2.5">
            <h1 className="text-sm sm:text-base font-semibold tracking-[-0.28px] text-[#171717]">
              ASCII 3D
            </h1>
            <span className="text-xs text-[#8F8F8F] hidden sm:inline">·</span>
            <p className="text-xs text-[#4D4D4D] hidden sm:block">
              Interactive WebGL 3D ASCII Object Studio
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#8F8F8F] font-mono">
            <span className="hidden md:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded-[4px] bg-[#EBEBEB] text-[#171717] text-[10px]">Space</kbd> Rotate
            </span>
            <span className="hidden md:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded-[4px] bg-[#EBEBEB] text-[#171717] text-[10px]">S</kbd> Snapshot
            </span>
            <span className="hidden md:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded-[4px] bg-[#EBEBEB] text-[#171717] text-[10px]">R</kbd> Reset
            </span>
            <div className="size-2.5 rounded-full bg-[#398E4A]" title="WebGL 2.0 Active" />
          </div>
        </div>

        {/* 12-Column Responsive Layout: Fills 100% height */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 flex-1 min-h-0 w-full overflow-hidden items-stretch">
          {/* Left Column: 3D Viewport (7 cols) */}
          <section className="lg:col-span-7 xl:col-span-8 flex flex-col h-full min-h-0 overflow-hidden">
            <AsciiViewer
              options={options}
              onOptionsChange={handleOptionsChange}
              onRegisterCanvas={(c) => {
                canvasRef.current = c;
              }}
              activeTitle={activeTitle}
            />
          </section>

          {/* Right Column: Control Panel (5 cols) */}
          <section className="lg:col-span-5 xl:col-span-4 flex flex-col h-full min-h-0 overflow-hidden">
            <ControlPanel
              options={options}
              onOptionsChange={handleOptionsChange}
              activeTitle={activeTitle}
              onSelectSrc={handleSelectSrc}
              onReset={handleReset}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
