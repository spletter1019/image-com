import React, { useState } from "react";
import { Grid, RGB, ToolMode, CellCoord } from "../types";
import { rgbToHex, getColorName, cloneGrid } from "../utils/colorUtils";
import { PaintBucket, Trash2, RefreshCw } from "lucide-react";

interface ImageGridProps {
  id: string;
  title: string;
  subtitle?: string;
  grid: Grid;
  onChangeGrid?: (grid: Grid) => void;
  activeColor: RGB;
  toolMode: ToolMode;
  hoveredCell: CellCoord | null;
  setHoveredCell: (cell: CellCoord | null) => void;
  onPickColor?: (c: RGB) => void;
  isReadOnly?: boolean;
  accentColor?: "red" | "blue" | "emerald" | "purple";
  compact?: boolean;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  title,
  subtitle,
  grid,
  onChangeGrid,
  activeColor,
  toolMode,
  hoveredCell,
  setHoveredCell,
  onPickColor,
  isReadOnly = false,
  accentColor = "red",
}) => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const size = grid.length;

  const handleCellClick = (r: number, c: number) => {
    if (isReadOnly || !onChangeGrid) return;

    if (toolMode === "eyedropper") {
      if (onPickColor) onPickColor(grid[r][c]);
      return;
    }

    const next = cloneGrid(grid);
    if (toolMode === "eraser") {
      next[r][c] = { r: 0, g: 0, b: 0 };
    } else {
      next[r][c] = { ...activeColor };
    }
    onChangeGrid(next);
  };

  const handleMouseEnter = (r: number, c: number) => {
    setHoveredCell({ r, c });
    if (isMouseDown && !isReadOnly && onChangeGrid) {
      if (toolMode === "eyedropper") return;
      const next = cloneGrid(grid);
      if (toolMode === "eraser") {
        next[r][c] = { r: 0, g: 0, b: 0 };
      } else {
        next[r][c] = { ...activeColor };
      }
      onChangeGrid(next);
    }
  };

  const handleFillAll = () => {
    if (isReadOnly || !onChangeGrid) return;
    const next = cloneGrid(grid);
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        next[r][c] = { ...activeColor };
      }
    }
    onChangeGrid(next);
  };

  const handleClearAll = () => {
    if (isReadOnly || !onChangeGrid) return;
    const next = cloneGrid(grid);
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        next[r][c] = { r: 0, g: 0, b: 0 };
      }
    }
    onChangeGrid(next);
  };

  const handleInvert = () => {
    if (isReadOnly || !onChangeGrid) return;
    const next = cloneGrid(grid);
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        next[r][c] = {
          r: 255 - next[r][c].r,
          g: 255 - next[r][c].g,
          b: 255 - next[r][c].b,
        };
      }
    }
    onChangeGrid(next);
  };

  const accentBadge = {
    red: "bg-red-100 text-red-700 border-red-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
  }[accentColor];

  return (
    <div 
      className="bg-white rounded-xl border border-gray-200/90 shadow-2xs p-2.5 flex flex-col items-center justify-between"
      onMouseUp={() => setIsMouseDown(false)}
      onMouseLeave={() => {
        setIsMouseDown(false);
        setHoveredCell(null);
      }}
    >
      <div className="w-full flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-1.5 pb-1 border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${accentBadge}`}>
              {title}
            </span>
            {subtitle && <span className="text-[10px] text-gray-400">{subtitle}</span>}
          </div>
          <span className="text-[10px] font-mono text-gray-400">{size}×{size}</span>
        </div>

        {/* The Halved Pixel Grid Table (Compact 22px ~ 24px cells) */}
        <div className="flex flex-col items-center select-none my-1">
          {/* Column coordinates: 1, 2, 3.. */}
          <div className="flex pl-4 mb-0.5">
            {Array.from({ length: size }).map((_, c) => (
              <div 
                key={c} 
                className={`w-6 text-center text-[9px] font-mono ${
                  hoveredCell?.c === c ? "text-emerald-600 font-bold" : "text-gray-400"
                }`}
              >
                {c + 1}
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="flex flex-col gap-0.5">
            {grid.map((row, r) => (
              <div key={r} className="flex items-center gap-0.5">
                {/* Row coordinate */}
                <div className={`w-3.5 text-right text-[9px] font-mono pr-0.5 ${
                  hoveredCell?.r === r ? "text-emerald-600 font-bold" : "text-gray-400"
                }`}>
                  {r + 1}
                </div>

                {/* Halved Cells: w-6 h-6 (24px by 24px) */}
                {row.map((cell, c) => {
                  const isHovered = hoveredCell?.r === r && hoveredCell?.c === c;
                  const hex = rgbToHex(cell);

                  return (
                    <button
                      key={c}
                      type="button"
                      onMouseDown={() => {
                        setIsMouseDown(true);
                        handleCellClick(r, c);
                      }}
                      onMouseEnter={() => handleMouseEnter(r, c)}
                      className={`w-6 h-6 rounded-xs transition-all relative cursor-pointer border ${
                        isHovered 
                          ? "ring-2 ring-emerald-500 ring-offset-1 z-20 scale-125 border-white shadow-md" 
                          : "border-gray-300/80 hover:border-gray-500"
                      }`}
                      style={{ backgroundColor: hex }}
                      title={`(${r + 1}행, ${c + 1}열) RGB(${cell.r}, ${cell.g}, ${cell.b})`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Quick Action Buttons */}
      {!isReadOnly ? (
        <div className="w-full mt-2 pt-1.5 border-t border-gray-100 flex items-center justify-between text-[11px]">
          <button
            onClick={handleFillAll}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
            title="현재 선택한 채우기 색상으로 전체 채우기"
          >
            <PaintBucket className="w-3 h-3 text-gray-500" />
            <span>채우기</span>
          </button>

          <button
            onClick={handleInvert}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
            title="색상 반전 (255 - RGB)"
          >
            <RefreshCw className="w-3 h-3 text-gray-500" />
            <span>반전</span>
          </button>

          <button
            onClick={handleClearAll}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
            title="표의 모든 픽셀을 빈칸(0,0,0)으로 초기화"
          >
            <Trash2 className="w-3 h-3" />
            <span>지우기</span>
          </button>
        </div>
      ) : (
        <div className="w-full mt-2 pt-1.5 border-t border-gray-100 text-center text-[10px] text-gray-400">
          합성 결과 표시 전용
        </div>
      )}
    </div>
  );
};
