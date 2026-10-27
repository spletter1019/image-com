import React from "react";
import { Grid, MatrixChannel, RGB, CellCoord } from "../types";
import { rgbToHex, getColorName } from "../utils/colorUtils";
import { MatrixDisplay } from "./MatrixDisplay";
import { Sparkles, ArrowRight, Info, AlertCircle, Copy, Check } from "lucide-react";

interface ResultSectionProps {
  grid1: Grid;
  grid2: Grid;
  resultGrid: Grid;
  overflows: boolean[][];
  matrixChannel: MatrixChannel;
  hoveredCell: CellCoord | null;
  setHoveredCell: (cell: CellCoord | null) => void;
}

export const ResultSection: React.FC<ResultSectionProps> = ({
  grid1,
  grid2,
  resultGrid,
  overflows,
  matrixChannel,
  hoveredCell,
  setHoveredCell,
}) => {
  const size = resultGrid.length;
  const [copied, setCopied] = React.useState(false);

  // Inspector cell
  const inspectRow = hoveredCell ? hoveredCell.r : 0;
  const inspectCol = hoveredCell ? hoveredCell.c : 0;
  const p1 = grid1[inspectRow]?.[inspectCol] || { r: 0, g: 0, b: 0 };
  const p2 = grid2[inspectRow]?.[inspectCol] || { r: 0, g: 0, b: 0 };
  const pres = resultGrid[inspectRow]?.[inspectCol] || { r: 0, g: 0, b: 0 };
  const hasOverflow = overflows[inspectRow]?.[inspectCol] || false;

  const handleCopyLatex = () => {
    let latex = "R_{합성} = \\begin{pmatrix}\n";
    for (let r = 0; r < size; r++) {
      latex += "  " + resultGrid[r].map(c => c.r).join(" & ") + " \\\\ \n";
    }
    latex += "\\end{pmatrix}\n\n";

    latex += "G_{합성} = \\begin{pmatrix}\n";
    for (let r = 0; r < size; r++) {
      latex += "  " + resultGrid[r].map(c => c.g).join(" & ") + " \\\\ \n";
    }
    latex += "\\end{pmatrix}\n\n";

    latex += "B_{합성} = \\begin{pmatrix}\n";
    for (let r = 0; r < size; r++) {
      latex += "  " + resultGrid[r].map(c => c.b).join(" & ") + " \\\\ \n";
    }
    latex += "\\end{pmatrix}";

    navigator.clipboard.writeText(latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-emerald-500/30 shadow-md p-4 flex flex-col gap-4">
      {/* Top Banner: Operation Title */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-1.5">
              <span>합성 결과 (이미지 1 + 이미지 2)</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                결과 이미지 및 행렬
              </span>
            </h2>
            <p className="text-xs text-gray-500">
              두 이미지의 R, G, B 성분을 각각 더하여 새로운 이미지를 생성합니다.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyLatex}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors cursor-pointer"
          title="LaTeX 행렬 수식 복사"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "복사 완료!" : "LaTeX 행렬 복사"}</span>
        </button>
      </div>

      {/* Visual Result Image & Result Matrix Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Result Image */}
        <div className="bg-gray-50/80 rounded-xl border border-gray-200 p-3.5 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
              <span>합성된 결과 이미지</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {size}×{size} 픽셀
            </span>
          </div>

          {/* The Result Pixel Table */}
          <div className="flex flex-col items-center select-none my-1">
            {/* Column coords */}
            <div className="flex pl-6 mb-1">
              {Array.from({ length: size }).map((_, c) => (
                <div 
                  key={c} 
                  className={`w-10 sm:w-12 text-center text-[10px] font-mono font-medium ${
                    hoveredCell?.c === c ? "text-emerald-600 font-bold" : "text-gray-400"
                  }`}
                >
                  {c + 1}열
                </div>
              ))}
            </div>

            {/* Rows */}
            <div className="flex flex-col gap-1">
              {resultGrid.map((row, r) => (
                <div key={r} className="flex items-center gap-1">
                  <div className={`w-5 text-right text-[10px] font-mono font-medium pr-1 ${
                    hoveredCell?.r === r ? "text-emerald-600 font-bold" : "text-gray-400"
                  }`}>
                    {r + 1}행
                  </div>

                  {row.map((cell, c) => {
                    const isHovered = hoveredCell?.r === r && hoveredCell?.c === c;
                    const hex = rgbToHex(cell);
                    const isOverflow = overflows[r]?.[c];
                    const isDark = (cell.r * 0.299 + cell.g * 0.587 + cell.b * 0.114) < 128;

                    return (
                      <div
                        key={c}
                        onMouseEnter={() => setHoveredCell({ r, c })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-md transition-all relative cursor-pointer border flex flex-col items-center justify-center ${
                          isHovered 
                            ? "ring-3 ring-emerald-500 ring-offset-1 z-20 scale-105 border-white shadow-lg" 
                            : "border-gray-200/90 shadow-2xs hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: hex }}
                        title={`(${r + 1}행, ${c + 1}열) RGB(${cell.r}, ${cell.g}, ${cell.b})`}
                      >
                        {isOverflow && (
                          <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-amber-400 ring-1 ring-white" title="255 초과로 255로 제한됨" />
                        )}

                        {isHovered && (
                          <div className={`text-[8px] sm:text-[9px] font-mono font-bold leading-tight ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}>
                            <span>{cell.r}</span>
                            <span>{cell.g}</span>
                            <span>{cell.b}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-gray-500 text-center mt-2">
            셀에 마우스를 올리면 각 이미지의 성분 덧셈 과정이 아래에 표시됩니다.
          </p>
        </div>

        {/* Result Matrix */}
        <MatrixDisplay
          label="합성 결과 행렬 (Matrix 1 + Matrix 2)"
          grid={resultGrid}
          channel={matrixChannel}
          hoveredCell={hoveredCell}
          setHoveredCell={setHoveredCell}
          themeColor="emerald"
        />
      </div>

      {/* Step-by-Step Pixel Math Inspector */}
      <div className="bg-emerald-50/50 rounded-xl border border-emerald-200 p-3.5">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-200/60">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>선택된 픽셀 ({inspectRow + 1}행 {inspectCol + 1}열) 성분별 덧셈 상세 계산</span>
          </div>
          {hasOverflow && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>255 초과 클램핑(최대 255) 적용됨</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Color Synthesis Visual */}
          <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-emerald-100 shadow-2xs">
            <div className="flex items-center gap-2">
              <div 
                className="w-7 h-7 rounded-md border border-black/10 shadow-2xs" 
                style={{ backgroundColor: rgbToHex(p1) }} 
                title="이미지 1 픽셀"
              />
              <span className="text-gray-400 font-bold">+</span>
              <div 
                className="w-7 h-7 rounded-md border border-black/10 shadow-2xs" 
                style={{ backgroundColor: rgbToHex(p2) }} 
                title="이미지 2 픽셀"
              />
              <ArrowRight className="w-4 h-4 text-emerald-600" />
              <div 
                className="w-7 h-7 rounded-md border border-black/10 shadow-2xs" 
                style={{ backgroundColor: rgbToHex(pres) }} 
                title="합성 픽셀"
              />
            </div>
            <div className="text-right">
              <div className="text-[11px] font-semibold text-gray-800">{getColorName(pres)}</div>
              <div className="text-[10px] text-gray-500 font-mono">RGB({pres.r}, {pres.g}, {pres.b})</div>
            </div>
          </div>

          {/* R, G, B Component Calculations */}
          <div className="md:col-span-2 grid grid-cols-3 gap-2">
            {/* Red */}
            <div className="bg-white p-2 rounded-lg border border-red-100 shadow-2xs">
              <div className="text-[11px] font-bold text-red-600 mb-1">R 성분 (빨강)</div>
              <div className="font-mono text-xs">
                {p1.r} + {p2.r} = <span className="font-bold text-red-700">{p1.r + p2.r}</span>
                {p1.r + p2.r > 255 && (
                  <span className="text-[10px] text-amber-600 block">→ 255로 제한</span>
                )}
              </div>
            </div>

            {/* Green */}
            <div className="bg-white p-2 rounded-lg border border-emerald-100 shadow-2xs">
              <div className="text-[11px] font-bold text-emerald-600 mb-1">G 성분 (초록)</div>
              <div className="font-mono text-xs">
                {p1.g} + {p2.g} = <span className="font-bold text-emerald-700">{p1.g + p2.g}</span>
                {p1.g + p2.g > 255 && (
                  <span className="text-[10px] text-amber-600 block">→ 255로 제한</span>
                )}
              </div>
            </div>

            {/* Blue */}
            <div className="bg-white p-2 rounded-lg border border-blue-100 shadow-2xs">
              <div className="text-[11px] font-bold text-blue-600 mb-1">B 성분 (파랑)</div>
              <div className="font-mono text-xs">
                {p1.b} + {p2.b} = <span className="font-bold text-blue-700">{p1.b + p2.b}</span>
                {p1.b + p2.b > 255 && (
                  <span className="text-[10px] text-amber-600 block">→ 255로 제한</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
