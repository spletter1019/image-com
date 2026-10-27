import React, { useState, useRef, useEffect } from "react";
import { 
  PaintBucket, 
  Pipette, 
  Eraser, 
  RotateCcw, 
  RotateCw, 
  BookOpen, 
  Layers, 
  Grid3X3, 
  Check,
  ChevronDown,
  Sparkles,
  FileSpreadsheet,
  Trash2
} from "lucide-react";
import { GridSize, MatrixChannel, RGB, ToolMode } from "../types";
import { 
  GOOGLE_SHEETS_PALETTE, 
  PRIMARY_MATH_COLORS, 
  PRESETS, 
  rgbToHex, 
  hexToRgb, 
  getColorName 
} from "../utils/colorUtils";

interface SheetsToolbarProps {
  activeColor: RGB;
  setActiveColor: (c: RGB) => void;
  toolMode: ToolMode;
  setToolMode: (m: ToolMode) => void;
  gridSize: GridSize;
  setGridSize: (s: GridSize) => void;
  matrixChannel: MatrixChannel;
  setMatrixChannel: (c: MatrixChannel) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onLoadPreset: (presetId: string) => void;
  onOpenTheory: () => void;
  onOpenQuiz: () => void;
  onClearAll: () => void;
}

export const SheetsToolbar: React.FC<SheetsToolbarProps> = ({
  activeColor,
  setActiveColor,
  toolMode,
  setToolMode,
  gridSize,
  setGridSize,
  matrixChannel,
  setMatrixChannel,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onLoadPreset,
  onOpenTheory,
  onOpenQuiz,
  onClearAll
}) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isPresetOpen, setIsPresetOpen] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const presetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setIsColorPickerOpen(false);
      }
      if (presetRef.current && !presetRef.current.contains(e.target as Node)) {
        setIsPresetOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectHex = (hex: string) => {
    setActiveColor(hexToRgb(hex));
    setIsColorPickerOpen(false);
  };

  const handleRgbChange = (channel: keyof RGB, value: number) => {
    const next = { ...activeColor, [channel]: Math.max(0, Math.min(255, value)) };
    setActiveColor(next);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-xs sticky top-0 z-40 select-none">
      {/* Top Google Sheets branding & document title bar */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-gray-800 leading-tight">
                92쪽 이미지 합성 실습실 : 행렬 연산을 이용한 이미지 합성
              </h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                교과서 92쪽
              </span>
            </div>
            <p className="text-xs text-gray-500 hidden sm:block">
              구글 시트 채우기 색상과 3×3, 4×4, 5×5 표를 이용한 R, G, B 행렬 덧셈 실시간 시뮬레이터
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenQuiz}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md border border-indigo-200 transition-colors cursor-pointer"
            title="교과서 92쪽 문제 3 실습 퀴즈"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>92쪽 [문제 3] 퍼즐 풀기</span>
          </button>

          <button
            onClick={onOpenTheory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
            title="교과서 92쪽 수학 원리 설명 보기"
          >
            <BookOpen className="w-4 h-4 text-gray-600" />
            <span>수학 원리 보기</span>
          </button>
        </div>
      </div>

      {/* Main Google Sheets Style Toolbar */}
      <div className="px-3 py-1.5 flex flex-wrap items-center gap-2 bg-[#f9fbfd] text-gray-700 text-sm">
        {/* Undo / Redo */}
        <div className="flex items-center bg-white rounded-md border border-gray-200 shadow-2xs">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent rounded-l-md transition-colors cursor-pointer disabled:cursor-not-allowed"
            title="실행 취소 (Undo)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent rounded-r-md transition-colors cursor-pointer disabled:cursor-not-allowed border-l border-gray-200"
            title="다시 실행 (Redo)"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        <div className="h-5 w-px bg-gray-300 mx-0.5 hidden sm:block" />

        {/* Tools: Bucket, Eyedropper, Eraser */}
        <div className="flex items-center bg-white rounded-md border border-gray-200 p-0.5 shadow-2xs">
          <button
            onClick={() => setToolMode("bucket")}
            className={`p-1.5 rounded transition-colors cursor-pointer flex items-center gap-1 text-xs ${
              toolMode === "bucket" ? "bg-emerald-100 text-emerald-800 font-medium" : "hover:bg-gray-100 text-gray-700"
            }`}
            title="채우기 도구 (클릭하거나 드래그하여 색상 칠하기)"
          >
            <PaintBucket className="w-4 h-4" />
            <span className="hidden md:inline">채우기</span>
          </button>
          <button
            onClick={() => setToolMode("eyedropper")}
            className={`p-1.5 rounded transition-colors cursor-pointer flex items-center gap-1 text-xs ${
              toolMode === "eyedropper" ? "bg-emerald-100 text-emerald-800 font-medium" : "hover:bg-gray-100 text-gray-700"
            }`}
            title="스포이트 도구 (표의 픽셀 색상 추출하기)"
          >
            <Pipette className="w-4 h-4" />
            <span className="hidden md:inline">스포이트</span>
          </button>
          <button
            onClick={() => setToolMode("eraser")}
            className={`p-1.5 rounded transition-colors cursor-pointer flex items-center gap-1 text-xs ${
              toolMode === "eraser" ? "bg-emerald-100 text-emerald-800 font-medium" : "hover:bg-gray-100 text-gray-700"
            }`}
            title="지우개 도구 (클릭한 셀을 빈칸(0,0,0)으로 지우기)"
          >
            <Eraser className="w-4 h-4" />
            <span className="hidden md:inline">지우개</span>
          </button>
        </div>

        <div className="h-5 w-px bg-gray-300 mx-0.5 hidden sm:block" />

        {/* GOOGLE SHEETS FILL COLOR BUTTON & DROPDOWN PALETTE */}
        <div className="relative" ref={colorPickerRef}>
          <button
            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-md shadow-2xs transition-colors cursor-pointer"
            title="구글 시트 채우기 색상 선택"
          >
            <div className="relative flex flex-col items-center">
              <PaintBucket className="w-4 h-4 text-gray-700" />
              <div 
                className="w-4 h-1 rounded-full mt-0.5 border border-black/20"
                style={{ backgroundColor: rgbToHex(activeColor) }}
              />
            </div>
            <span className="text-xs font-medium text-gray-800">채우기 색상</span>
            <div 
              className="w-4 h-4 rounded-xs border border-gray-300 shadow-2xs"
              style={{ backgroundColor: rgbToHex(activeColor) }}
            />
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </button>

          {/* Google Sheets Authentic Color Picker Popover */}
          {isColorPickerOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-80 bg-white border border-gray-200 rounded-lg shadow-xl p-3.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-700">구글 시트 채우기 색상표</span>
                <button
                  onClick={() => handleSelectHex("#000000")}
                  className="text-xs text-gray-600 hover:text-gray-900 px-2 py-0.5 rounded hover:bg-gray-100 border border-gray-200 cursor-pointer"
                >
                  재설정 (빈칸 / 0, 0, 0)
                </button>
              </div>

              {/* Primary Math Colors (Key RGB values from page 92) */}
              <div className="mb-3">
                <div className="text-[11px] font-semibold text-gray-500 mb-1 flex items-center justify-between">
                  <span>교과서 주요 합성 색상 (RGB 0 또는 255)</span>
                  <span className="text-[10px] text-emerald-600 font-mono">빛의 삼원색</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {PRIMARY_MATH_COLORS.map((item) => {
                    const isSelected = activeColor.r === item.rgb.r && activeColor.g === item.rgb.g && activeColor.b === item.rgb.b;
                    return (
                      <button
                        key={item.label}
                        onClick={() => {
                          setActiveColor(item.rgb);
                          setIsColorPickerOpen(false);
                        }}
                        className={`flex items-center gap-1.5 px-1.5 py-1 rounded text-[11px] border text-left cursor-pointer transition-transform active:scale-95 ${
                          isSelected ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-500 font-semibold" : "border-gray-200 hover:border-gray-400 bg-white"
                        }`}
                      >
                        <span 
                          className="w-3.5 h-3.5 rounded-xs border border-black/20 shrink-0" 
                          style={{ backgroundColor: item.hex }}
                        />
                        <span className="truncate text-gray-800">{item.label.split(" ")[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Standard Google Sheets 10x7 Color Grid */}
              <div className="space-y-1 mb-3">
                <div className="text-[11px] font-semibold text-gray-500 mb-1">구글 시트 표준 색상표</div>
                {GOOGLE_SHEETS_PALETTE.map((row, rIdx) => (
                  <div key={rIdx} className="grid grid-cols-10 gap-1">
                    {row.hexes.map((hex) => {
                      const rgb = hexToRgb(hex);
                      const isSelected = activeColor.r === rgb.r && activeColor.g === rgb.g && activeColor.b === rgb.b;
                      return (
                        <button
                          key={hex}
                          onClick={() => handleSelectHex(hex)}
                          className={`relative w-6 h-6 rounded-xs transition-transform hover:scale-110 cursor-pointer border ${
                            isSelected ? "ring-2 ring-emerald-600 ring-offset-1 border-white" : "border-black/10 hover:border-black/30"
                          }`}
                          style={{ backgroundColor: hex }}
                          title={`${hex} | RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                        >
                          {isSelected && (
                            <Check className={`w-3 h-3 absolute inset-0 m-auto ${
                              (rgb.r + rgb.g + rgb.b) > 400 ? "text-gray-900" : "text-white"
                            }`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Custom RGB Sliders & Hex Input */}
              <div className="pt-2 border-t border-gray-100 bg-gray-50 -mx-3.5 -mb-3.5 p-3 rounded-b-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-gray-700">맞춤 RGB 성분 직접 입력</span>
                  <span className="text-[11px] font-mono font-medium text-gray-600">{getColorName(activeColor)}</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  {/* Red slider */}
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-red-600 font-bold font-mono">R</span>
                    <input
                      type="range"
                      min={0}
                      max={255}
                      value={activeColor.r}
                      onChange={(e) => handleRgbChange("r", Number(e.target.value))}
                      className="flex-1 accent-red-600 h-1.5 bg-red-100 rounded-lg cursor-pointer"
                    />
                    <input
                      type="number"
                      min={0}
                      max={255}
                      value={activeColor.r}
                      onChange={(e) => handleRgbChange("r", Number(e.target.value))}
                      className="w-12 px-1 py-0.5 text-right font-mono border border-gray-300 rounded bg-white text-xs"
                    />
                  </div>

                  {/* Green slider */}
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-green-600 font-bold font-mono">G</span>
                    <input
                      type="range"
                      min={0}
                      max={255}
                      value={activeColor.g}
                      onChange={(e) => handleRgbChange("g", Number(e.target.value))}
                      className="flex-1 accent-green-600 h-1.5 bg-green-100 rounded-lg cursor-pointer"
                    />
                    <input
                      type="number"
                      min={0}
                      max={255}
                      value={activeColor.g}
                      onChange={(e) => handleRgbChange("g", Number(e.target.value))}
                      className="w-12 px-1 py-0.5 text-right font-mono border border-gray-300 rounded bg-white text-xs"
                    />
                  </div>

                  {/* Blue slider */}
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-blue-600 font-bold font-mono">B</span>
                    <input
                      type="range"
                      min={0}
                      max={255}
                      value={activeColor.b}
                      onChange={(e) => handleRgbChange("b", Number(e.target.value))}
                      className="flex-1 accent-blue-600 h-1.5 bg-blue-100 rounded-lg cursor-pointer"
                    />
                    <input
                      type="number"
                      min={0}
                      max={255}
                      value={activeColor.b}
                      onChange={(e) => handleRgbChange("b", Number(e.target.value))}
                      className="w-12 px-1 py-0.5 text-right font-mono border border-gray-300 rounded bg-white text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-gray-300 mx-0.5 hidden sm:block" />

        {/* GRID SIZE SELECTOR (3X3, 4X4, 5X5 중 선택) */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-md p-0.5 shadow-2xs">
          <span className="text-xs text-gray-500 pl-1.5 pr-0.5 font-medium flex items-center gap-1">
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>크기:</span>
          </span>
          {([3, 4, 5] as GridSize[]).map((size) => (
            <button
              key={size}
              onClick={() => setGridSize(size)}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${
                gridSize === size
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {size}×{size}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-gray-300 mx-0.5 hidden sm:block" />

        {/* PRESETS DROPDOWN */}
        <div className="relative" ref={presetRef}>
          <button
            onClick={() => setIsPresetOpen(!isPresetOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-md shadow-2xs text-xs font-medium text-gray-700 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>예제 불러오기</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {isPresetOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-72 bg-white border border-gray-200 rounded-lg shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="text-[11px] font-semibold text-gray-400 px-2 py-1">교과서 92쪽 실습 예제</div>
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onLoadPreset(p.id);
                    setIsPresetOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-md hover:bg-emerald-50 hover:text-emerald-900 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-800 group-hover:text-emerald-800">{p.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-mono">{p.size}×{p.size}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{p.description}</p>
                </button>
              ))}
              <div className="border-t border-gray-100 my-1" />
              <button
                onClick={() => {
                  onClearAll();
                  setIsPresetOpen(false);
                }}
                className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-rose-50 text-rose-700 text-xs font-medium cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>모든 표 초기화 (빈칸으로 리셋)</span>
              </button>
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-gray-300 mx-0.5 hidden sm:block" />

        {/* MATRIX DISPLAY CHANNELS TOGGLE */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-md p-0.5 shadow-2xs">
          <span className="text-xs text-gray-500 pl-1.5 pr-0.5 font-medium flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            <span>행렬:</span>
          </span>
          <button
            onClick={() => setMatrixChannel("all")}
            className={`px-2 py-1 text-xs rounded transition-colors cursor-pointer ${
              matrixChannel === "all" ? "bg-gray-800 text-white font-medium" : "text-gray-700 hover:bg-gray-100"
            }`}
            title="R, G, B 행렬 모두 함께 보기 (교과서 92쪽 형식)"
          >
            전체
          </button>
          <button
            onClick={() => setMatrixChannel("r")}
            className={`px-2 py-1 text-xs rounded transition-colors cursor-pointer ${
              matrixChannel === "r" ? "bg-red-600 text-white font-medium" : "text-red-700 hover:bg-red-50"
            }`}
            title="R (빨강) 성분 행렬만 보기"
          >
            R
          </button>
          <button
            onClick={() => setMatrixChannel("g")}
            className={`px-2 py-1 text-xs rounded transition-colors cursor-pointer ${
              matrixChannel === "g" ? "bg-emerald-600 text-white font-medium" : "text-emerald-700 hover:bg-emerald-50"
            }`}
            title="G (초록) 성분 행렬만 보기"
          >
            G
          </button>
          <button
            onClick={() => setMatrixChannel("b")}
            className={`px-2 py-1 text-xs rounded transition-colors cursor-pointer ${
              matrixChannel === "b" ? "bg-blue-600 text-white font-medium" : "text-blue-700 hover:bg-blue-50"
            }`}
            title="B (파랑) 성분 행렬만 보기"
          >
            B
          </button>
          <button
            onClick={() => setMatrixChannel("tuple")}
            className={`px-2 py-1 text-xs rounded transition-colors cursor-pointer ${
              matrixChannel === "tuple" ? "bg-gray-800 text-white font-medium" : "text-gray-700 hover:bg-gray-100"
            }`}
            title="(R, G, B) 튜플 형식으로 보기"
          >
            튜플
          </button>
        </div>
      </div>
    </header>
  );
};
