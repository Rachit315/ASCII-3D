"use client";

import React, { useState } from "react";
import {
  Type,
  Palette,
  Move3d,
  ImageIcon,
  RotateCcw,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadZone } from "@/components/UploadZone";
import type { AsciiObjectOptions } from "@/components/canvasui/AsciiObject";

export const CHARSET_PRESETS = [
  {
    name: "Full ASCII",
    tag: "Standard",
    charset: Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join(""),
    preview: "A-Z 0-9 !?#",
  },
  {
    name: "Matrix Hex",
    tag: "Cyber",
    charset: "0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ",
    preview: "01BF ｦｱｳ",
  },
  {
    name: "Block Shades",
    tag: "Dither",
    charset: " ░▒▓█▀▄▌▐■▪▫",
    preview: "░▒▓█",
  },
  {
    name: "Minimal Dots",
    tag: "Clean",
    charset: " .·:;*+oO#@",
    preview: ".·:*#@",
  },
  {
    name: "Binary",
    tag: "0 & 1",
    charset: " 01",
    preview: "0 1 0 1",
  },
  {
    name: "High Detail",
    tag: "Edge Snap",
    charset: " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
    preview: "Edge Crisp",
  },
];

const COLOR_SWATCHES = [
  { label: "White", value: "#ffffff" },
  { label: "Cyan", value: "#0062D1" },
  { label: "Green", value: "#398E4A" },
  { label: "Amber", value: "#FF990A" },
  { label: "Red", value: "#E5484D" },
  { label: "Purple", value: "#7820BC" },
];

const HIGHLIGHT_SWATCHES = [
  { label: "Blue", value: "#0062D1" },
  { label: "Purple", value: "#7820BC" },
  { label: "Teal", value: "#067A6E" },
  { label: "Green", value: "#398E4A" },
  { label: "Orange", value: "#FF990A" },
];

const BG_SWATCHES = [
  { label: "Transparent", value: "" },
  { label: "Pitch Black", value: "#000000" },
  { label: "Studio Dark", value: "#171717" },
];

function parseSliderVal(val: number | readonly number[]): number {
  if (typeof val === "number") return val;
  if (Array.isArray(val) || (val && typeof val === "object" && 0 in val)) {
    return (val as readonly number[])[0] ?? 0;
  }
  return Number(val) || 0;
}

interface ControlPanelProps {
  options: AsciiObjectOptions;
  onOptionsChange: (updates: Partial<AsciiObjectOptions>) => void;
  activeTitle: string;
  onSelectSrc: (src: string, title: string) => void;
  onReset: () => void;
}

export function ControlPanel({
  options,
  onOptionsChange,
  activeTitle,
  onSelectSrc,
  onReset,
}: ControlPanelProps) {
  const [customCharset, setCustomCharset] = useState(options.charset || "");

  const handleCharsetPreset = (charset: string) => {
    setCustomCharset(charset);
    onOptionsChange({ charset });
  };

  const handleCustomCharsetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomCharset(val);
    if (val.trim()) {
      onOptionsChange({ charset: val });
    }
  };

  return (
    <div className="w-full h-full min-h-0 bg-white rounded-[12px] p-4 sm:p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden">
      <Tabs defaultValue="source" className="w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Segmented Control Header */}
        <TabsList className="grid grid-cols-4 mb-4 shrink-0">
          <TabsTrigger value="source" className="gap-1 text-xs">
            <ImageIcon className="size-3.5" />
            <span>Source</span>
          </TabsTrigger>

          <TabsTrigger value="ascii" className="gap-1 text-xs">
            <Type className="size-3.5" />
            <span>Charset</span>
          </TabsTrigger>

          <TabsTrigger value="shading" className="gap-1 text-xs">
            <Palette className="size-3.5" />
            <span>Color</span>
          </TabsTrigger>

          <TabsTrigger value="motion" className="gap-1 text-xs">
            <Move3d className="size-3.5" />
            <span>Motion</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: SOURCE */}
        <TabsContent value="source" className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4 focus-visible:outline-none">
          <UploadZone
            currentSrc={options.src || ""}
            currentTitle={activeTitle}
            onSelectSrc={onSelectSrc}
          />

          <div className="pt-3 border-t border-[#F2F2F2] flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-[#171717] tracking-[-0.28px]">
                Render Pipeline
              </div>
              <div className="text-[11px] text-[#8F8F8F]">
                {options.ascii ? "ASCII Shape Shader" : "Textured 3D Mesh"}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#4D4D4D]">
                {options.ascii ? "ASCII" : "Mesh"}
              </span>
              <Switch
                checked={options.ascii ?? true}
                onCheckedChange={(checked) => onOptionsChange({ ascii: checked })}
              />
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: CHARSET & RESOLUTION */}
        <TabsContent value="ascii" className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4 focus-visible:outline-none">
          {/* Cell Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#171717] tracking-[-0.28px]">
                Cell Size
              </span>
              <span className="font-mono text-[#171717] text-xs">
                {options.cellSize ?? 10}px
              </span>
            </div>
            <Slider
              min={4}
              max={22}
              step={1}
              value={[options.cellSize ?? 10]}
              onValueChange={(v) => onOptionsChange({ cellSize: parseSliderVal(v) })}
            />
            <div className="flex justify-between text-[11px] text-[#8F8F8F] font-mono">
              <span>Fine (4px)</span>
              <span>Balanced (10px)</span>
              <span>Chunky (22px)</span>
            </div>
          </div>

          {/* Cell Aspect Ratio */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#171717] tracking-[-0.28px]">
                Cell Aspect Ratio
              </span>
              <span className="font-mono text-[#171717] text-xs">
                {(options.cellAspect ?? 0.6).toFixed(2)}
              </span>
            </div>
            <Slider
              min={0.35}
              max={1.1}
              step={0.05}
              value={[options.cellAspect ?? 0.6]}
              onValueChange={(v) => onOptionsChange({ cellAspect: parseSliderVal(v) })}
            />
            <div className="flex justify-between text-[11px] text-[#8F8F8F] font-mono">
              <span>Condensed (0.35)</span>
              <span>Default (0.60)</span>
              <span>Square (1.00)</span>
            </div>
          </div>

          {/* Glyph Presets */}
          <div className="space-y-2 pt-1">
            <div className="text-xs font-medium text-[#171717] tracking-[-0.28px]">
              Glyph Presets
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CHARSET_PRESETS.map((preset) => {
                const isSelected = options.charset === preset.charset;
                return (
                  <button
                    key={preset.name}
                    onClick={() => handleCharsetPreset(preset.charset)}
                    className={`flex flex-col items-start p-2.5 rounded-[6px] text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#FAFAFA] shadow-[0_0_0_2px_#171717]"
                        : "bg-white hover:bg-[#FAFAFA] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-medium text-[#171717]">{preset.name}</span>
                      <span className="text-[10px] font-mono text-[#8F8F8F]">
                        {preset.tag}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#8F8F8F] truncate w-full">
                      {preset.preview}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Characters Input */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-medium text-[#171717] tracking-[-0.28px]">
              Custom Character Set
            </label>
            <Input
              type="text"
              value={customCharset}
              onChange={handleCustomCharsetChange}
              placeholder="Enter glyphs (e.g. 0123ABC)..."
              className="font-mono text-xs"
            />
          </div>
        </TabsContent>

        {/* TAB 3: COLOR & SHADING */}
        <TabsContent value="shading" className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4 focus-visible:outline-none">
          {/* Color Mode Toggle */}
          <div className="flex items-center justify-between p-3 rounded-[6px] bg-[#FAFAFA] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
            <div>
              <div className="text-xs font-medium text-[#171717] tracking-[-0.28px]">
                Full Color Tint
              </div>
              <div className="text-[11px] text-[#8F8F8F]">
                {options.colored ? "Sample colors from 3D texture" : "Monochrome character glyphs"}
              </div>
            </div>
            <Switch
              checked={options.colored ?? true}
              onCheckedChange={(checked) => onOptionsChange({ colored: checked })}
            />
          </div>

          {/* Monochrome Swatches (when colored is false) */}
          {!options.colored && (
            <div className="space-y-2 p-3 rounded-[6px] bg-[#FAFAFA] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
              <div className="text-xs font-medium text-[#171717] tracking-[-0.28px]">
                Monochrome Color
              </div>
              <div className="flex flex-wrap gap-2">
                {COLOR_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.value}
                    onClick={() => onOptionsChange({ color: swatch.value })}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-xs font-normal cursor-pointer transition-colors ${
                      options.color === swatch.value
                        ? "bg-white shadow-[0_0_0_2px_#171717] text-[#171717]"
                        : "bg-white hover:bg-[#EBEBEB] text-[#4D4D4D] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
                    }`}
                  >
                    <div
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: swatch.value }}
                    />
                    {swatch.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Edge Contour Snap */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#171717] tracking-[-0.28px]">
                Edge Contour Snap
              </span>
              <span className="font-mono text-[#171717] text-xs">
                {(options.edgeContrast ?? 3).toFixed(1)}x
              </span>
            </div>
            <Slider
              min={1.0}
              max={6.0}
              step={0.2}
              value={[options.edgeContrast ?? 3]}
              onValueChange={(v) => onOptionsChange({ edgeContrast: parseSliderVal(v) })}
            />
          </div>

          {/* Tone Contrast */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#171717] tracking-[-0.28px]">
                Tone Contrast
              </span>
              <span className="font-mono text-[#171717] text-xs">
                {(options.contrast ?? 1.5).toFixed(1)}x
              </span>
            </div>
            <Slider
              min={0.5}
              max={3.5}
              step={0.1}
              value={[options.contrast ?? 1.5]}
              onValueChange={(v) => onOptionsChange({ contrast: parseSliderVal(v) })}
            />
          </div>

          {/* Exposure */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#171717] tracking-[-0.28px]">
                Exposure & Brightness
              </span>
              <span className="font-mono text-[#171717] text-xs">
                {(options.exposure ?? 1.0).toFixed(1)}x
              </span>
            </div>
            <Slider
              min={0.2}
              max={2.5}
              step={0.1}
              value={[options.exposure ?? 1.0]}
              onValueChange={(v) => onOptionsChange({ exposure: parseSliderVal(v) })}
            />
          </div>

          {/* Studio Accent Light */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-[#171717] tracking-[-0.28px]">
              Studio Highlight Light
            </div>
            <div className="flex flex-wrap gap-2">
              {HIGHLIGHT_SWATCHES.map((swatch) => (
                <button
                  key={swatch.value}
                  onClick={() => onOptionsChange({ highlight: swatch.value })}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-xs cursor-pointer transition-colors ${
                    options.highlight === swatch.value
                      ? "bg-white shadow-[0_0_0_2px_#171717] text-[#171717]"
                      : "bg-white hover:bg-[#FAFAFA] text-[#4D4D4D] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
                  }`}
                >
                  <div
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: swatch.value }}
                  />
                  {swatch.label}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Background */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-[#171717] tracking-[-0.28px]">
              Viewport Background
            </div>
            <div className="flex flex-wrap gap-2">
              {BG_SWATCHES.map((swatch) => (
                <button
                  key={swatch.label}
                  onClick={() => onOptionsChange({ background: swatch.value })}
                  className={`px-2.5 py-1 rounded-[6px] text-xs cursor-pointer transition-colors ${
                    (options.background ?? "") === swatch.value
                      ? "bg-white shadow-[0_0_0_2px_#171717] text-[#171717]"
                      : "bg-white hover:bg-[#FAFAFA] text-[#4D4D4D] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
                  }`}
                >
                  {swatch.label}
                </button>
              ))}
            </div>
          </div>

          {/* Invert Tones Switch */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-medium text-[#171717] tracking-[-0.28px]">
              Invert Tone Density
            </span>
            <Switch
              checked={options.invert ?? false}
              onCheckedChange={(checked) => onOptionsChange({ invert: checked })}
            />
          </div>
        </TabsContent>

        {/* TAB 4: MOTION & CAMERA */}
        <TabsContent value="motion" className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4 focus-visible:outline-none">
          {/* Turntable Auto-Rotate */}
          <div className="p-3 rounded-[6px] bg-[#FAFAFA] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[#171717] tracking-[-0.28px]">
                  Turntable Auto-Rotate
                </div>
                <div className="text-[11px] text-[#8F8F8F]">
                  Continuous 360° rotation
                </div>
              </div>
              <Switch
                checked={options.autoRotate ?? false}
                onCheckedChange={(checked) => onOptionsChange({ autoRotate: checked })}
              />
            </div>

            {options.autoRotate && (
              <div className="space-y-2 pt-2 border-t border-[#EBEBEB]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#4D4D4D] text-[11px]">Speed</span>
                  <span className="font-mono text-[#171717] text-[11px]">
                    {options.autoRotateSpeed ?? 2}
                  </span>
                </div>
                <Slider
                  min={-6}
                  max={6}
                  step={0.5}
                  value={[options.autoRotateSpeed ?? 2]}
                  onValueChange={(v) => onOptionsChange({ autoRotateSpeed: parseSliderVal(v) })}
                />
              </div>
            )}
          </div>

          {/* Floating Bob */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#171717] tracking-[-0.28px]">
                Floating Bob
              </span>
              <span className="font-mono text-[#171717] text-xs">
                {options.floatIntensity ?? 2}
              </span>
            </div>
            <Slider
              min={0}
              max={5}
              step={0.5}
              value={[options.floatIntensity ?? 2]}
              onValueChange={(v) => onOptionsChange({ floatIntensity: parseSliderVal(v) })}
            />
          </div>

          {/* Idle Rocking */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#171717] tracking-[-0.28px]">
                Idle Rocking
              </span>
              <span className="font-mono text-[#171717] text-xs">
                {options.rotationIntensity ?? 1}
              </span>
            </div>
            <Slider
              min={0}
              max={3}
              step={0.2}
              value={[options.rotationIntensity ?? 1]}
              onValueChange={(v) => onOptionsChange({ rotationIntensity: parseSliderVal(v) })}
            />
          </div>

          {/* Camera FOV */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#171717] tracking-[-0.28px]">
                Camera Field of View
              </span>
              <span className="font-mono text-[#171717] text-xs">
                {options.fov ?? 65}°
              </span>
            </div>
            <Slider
              min={35}
              max={85}
              step={5}
              value={[options.fov ?? 65]}
              onValueChange={(v) => onOptionsChange({ fov: parseSliderVal(v) })}
            />
          </div>

          {/* Camera Distance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#171717] tracking-[-0.28px]">
                Camera Distance
              </span>
              <span className="font-mono text-[#171717] text-xs">
                {(options.cameraDistance ?? 4.2).toFixed(1)}
              </span>
            </div>
            <Slider
              min={2.0}
              max={7.0}
              step={0.2}
              value={[options.cameraDistance ?? 4.2]}
              onValueChange={(v) => onOptionsChange({ cameraDistance: parseSliderVal(v) })}
            />
          </div>

          {/* Object Scale */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#171717] tracking-[-0.28px]">
                Object Size Scale
              </span>
              <span className="font-mono text-[#171717] text-xs">
                {options.scale ?? 3}
              </span>
            </div>
            <Slider
              min={1}
              max={6}
              step={0.2}
              value={[options.scale ?? 3]}
              onValueChange={(v) => onOptionsChange({ scale: parseSliderVal(v) })}
            />
          </div>

          {/* Reset Action */}
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="w-full text-xs text-[#4D4D4D] hover:text-[#171717]"
            >
              <RotateCcw className="size-3.5 mr-2 text-[#8F8F8F]" />
              Reset 3D Camera & Motion
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
