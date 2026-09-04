"use client";

import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";

export interface PresetItem {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  tag: string;
  dotColor: string;
}

export const SAMPLE_PRESETS: PresetItem[] = [
  {
    id: "skull",
    title: "Cyber Skull",
    subtitle: "Vector contours & depth",
    src: "/samples/skull.svg",
    tag: "SVG",
    dotColor: "#0062D1", // Blue dot
  },
  {
    id: "planet",
    title: "Retro Saturn",
    subtitle: "Ringed planet surface",
    src: "/samples/planet.svg",
    tag: "Space",
    dotColor: "#FF990A", // Orange dot
  },
  {
    id: "diamond",
    title: "Neon Diamond",
    subtitle: "Multi-faceted gemstone",
    src: "/samples/diamond.svg",
    tag: "Crystal",
    dotColor: "#7820BC", // Purple dot
  },
  {
    id: "arcade",
    title: "Arcade Alien",
    subtitle: "8-bit retro pixel sprite",
    src: "/samples/arcade.svg",
    tag: "8-Bit",
    dotColor: "#398E4A", // Green dot
  },
];

interface UploadZoneProps {
  currentSrc: string;
  currentTitle: string;
  onSelectSrc: (src: string, title: string) => void;
}

export function UploadZone({
  currentSrc,
  currentTitle,
  onSelectSrc,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    const friendlyName =
      file.name.length > 25 ? file.name.substring(0, 22) + "..." : file.name;
    onSelectSrc(objectUrl, friendlyName);
  };

  return (
    <div className="space-y-4">
      {/* Vercel Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative rounded-[6px] p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? "bg-[#FAFAFA] shadow-[0_0_0_2px_#0072F5]"
            : "bg-[#FAFAFA] hover:bg-[#F2F2F2] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,.glb,.gltf"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-[6px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] text-[#171717]">
            <Upload className="size-4" />
          </div>

          <div className="space-y-0.5">
            <p className="text-sm font-normal text-[#171717]">
              Drop image or <span className="text-[#0072F5] hover:underline">browse</span>
            </p>
            <p className="text-xs text-[#8F8F8F]">
              PNG, JPG, SVG, WebP, GIF, or GLB/glTF
            </p>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-medium text-[#171717] tracking-[-0.28px]">
            Presets
          </h2>
          {currentTitle ? (
            <span className="text-[11px] text-[#8F8F8F] font-mono truncate max-w-[140px]" title={currentTitle}>
              {currentTitle}
            </span>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {SAMPLE_PRESETS.map((preset) => {
            const isSelected = currentSrc === preset.src;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectSrc(preset.src, preset.title)}
                className={`flex flex-col items-start p-3 rounded-[6px] text-left transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-white shadow-[0_0_0_2px_#171717]"
                    : "bg-white hover:bg-[#FAFAFA] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  {/* 10px Status Indicator Dot */}
                  <div
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: preset.dotColor }}
                  />
                  <span className="text-[11px] font-mono text-[#8F8F8F]">
                    {preset.tag}
                  </span>
                </div>
                <div className="text-xs font-medium text-[#171717]">
                  {preset.title}
                </div>
                <div className="text-[11px] text-[#8F8F8F] leading-tight mt-0.5 truncate w-full">
                  {preset.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
