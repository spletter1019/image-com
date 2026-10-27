import React from "react";
import { Grid, MatrixChannel, RGB, CellCoord } from "../types";

interface MatrixDisplayProps {
  label: string;
  grid: Grid;
  channel: MatrixChannel;
  hoveredCell: CellCoord | null;
  setHoveredCell: (cell: CellCoord | null) => void;
  bracketStyle?: "curly" | "bracket";
  themeColor?: "red" | "blue" | "emerald" | "neutral";
  isResult?: boolean;
  overflows?: boolean[][];
}

export const MatrixDisplay: React.FC<MatrixDisplayProps> = ({
  label,
  grid,
  channel,
  hoveredCell,
  setHoveredCell,
  bracketStyle = "curly",
  themeColor = "neutral",
  isResult = false,
  overflows,
}) => {
  const size = grid.length;

  const renderSingleMatrix = (
    channelName: "R" | "G" | "B",
    colorClass: string,
    bgClass: string,
    borderClass: string
  ) => {
    return (
      <div className="flex items-center justify-center gap-1.5 my-1">
        <span className={`text-xs sm:text-sm font-serif font-bold w-7 text-right ${colorClass}`}>
          {channelName}=
        </span>

        {/* Matrix Bracket container styled like textbook page 92 curly braces { } */}
        <div className="relative px-2 py-0.5 bg-white/80 rounded-md">
          {/* Left bracket */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 border-l-2 border-t-2 border-b-2 border-gray-700 rounded-l-xs" />

          {/* Matrix entries */}
          <div className="flex flex-col gap-0.5">
            {grid.map((row, r) => (
              <div key={r} className="flex gap-1 items-center justify-center">
                {row.map((cell, c) => {
                  const val = channelName === "R" ? cell.r : channelName === "G" ? cell.g : cell.b;
                  const isHovered = hoveredCell?.r === r && hoveredCell?.c === c;
                  const isOverflow = isResult && overflows?.[r]?.[c] && val === 255;

                  return (
                    <div
                      key={c}
                      onMouseEnter={() => setHoveredCell({ r, c })}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`w-6 sm:w-7 h-5 sm:h-6 flex items-center justify-center font-mono text-[10px] sm:text-[11px] rounded transition-all cursor-pointer select-none ${
                        isHovered 
                          ? "ring-2 ring-emerald-500 font-bold bg-emerald-100 text-emerald-950 z-10 scale-110 shadow-xs" 
                          : val > 0 
                            ? `${bgClass} ${colorClass} font-semibold border ${borderClass}` 
                            : "text-gray-400 bg-gray-50/70 border border-transparent"
                      }`}
                      title={`(${r + 1}행, ${c + 1}열) ${channelName} = ${val}${isOverflow ? " (255로 제한)" : ""}`}
                    >
                      {val}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Right bracket */}
          <div className="absolute right-0 top-0 bottom-0 w-1.5 border-r-2 border-t-2 border-b-2 border-gray-700 rounded-r-xs" />
        </div>
      </div>
    );
  };

  const renderTupleMatrix = () => {
    return (
      <div className="relative px-2 py-1 bg-white/80 rounded-md">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 border-l-2 border-t-2 border-b-2 border-gray-700 rounded-l-xs" />
        <div className="flex flex-col gap-0.5">
          {grid.map((row, r) => (
            <div key={r} className="flex gap-1 items-center">
              {row.map((cell, c) => {
                const isHovered = hoveredCell?.r === r && hoveredCell?.c === c;
                return (
                  <div
                    key={c}
                    onMouseEnter={() => setHoveredCell({ r, c })}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`px-1 h-6 flex items-center justify-center font-mono text-[9px] rounded transition-all cursor-pointer ${
                      isHovered
                        ? "ring-2 ring-emerald-500 font-bold bg-emerald-100 text-emerald-900 z-10"
                        : "bg-gray-50 border border-gray-200 text-gray-700"
                    }`}
                  >
                    ({cell.r},{cell.g},{cell.b})
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1.5 border-r-2 border-t-2 border-b-2 border-gray-700 rounded-r-xs" />
      </div>
    );
  };

  return (
    <div className="w-full bg-[#fbfcfd] rounded-xl border border-gray-200 p-2.5 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-1 pb-1 border-b border-gray-100 text-[11px]">
        <span className="font-bold text-gray-700">{label}</span>
        <span className="text-[10px] text-gray-400 font-mono">{size}×{size} 행렬</span>
      </div>

      <div className="overflow-x-auto w-full flex flex-col items-center py-0.5">
        {channel === "all" ? (
          <div className="flex flex-col gap-1 w-full items-center">
            {renderSingleMatrix("R", "text-red-700", "bg-red-50", "border-red-200")}
            {renderSingleMatrix("G", "text-emerald-700", "bg-emerald-50", "border-emerald-200")}
            {renderSingleMatrix("B", "text-blue-700", "bg-blue-50", "border-blue-200")}
          </div>
        ) : channel === "r" ? (
          renderSingleMatrix("R", "text-red-700", "bg-red-50", "border-red-200")
        ) : channel === "g" ? (
          renderSingleMatrix("G", "text-emerald-700", "bg-emerald-50", "border-emerald-200")
        ) : channel === "b" ? (
          renderSingleMatrix("B", "text-blue-700", "bg-blue-50", "border-blue-200")
        ) : (
          renderTupleMatrix()
        )}
      </div>
    </div>
  );
};
