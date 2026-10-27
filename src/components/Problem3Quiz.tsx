import React, { useState } from "react";
import { Grid } from "../types";
import { rgbToHex, isRgbEqual, PRESETS } from "../utils/colorUtils";
import { Sparkles, X, CheckCircle, HelpCircle } from "lucide-react";

export interface Problem3QuizProps {
  isOpen: boolean;
  onClose: () => void;
  currentResult: Grid;
  onApplyProblem3: () => void;
}

export const Problem3Quiz: React.FC<Problem3QuizProps> = ({
  isOpen,
  onClose,
  currentResult,
  onApplyProblem3,
}) => {
  const [showHint, setShowHint] = useState(false);
  const p3 = PRESETS.find(p => p.id === "p92-problem3");
  if (!isOpen || !p3 || !p3.targetGrid) return null;

  const target = p3.targetGrid;
  const size = target.length;

  let matchedCells = 0;
  const totalCells = size * size;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (isRgbEqual(currentResult[r]?.[c] || { r: 0, g: 0, b: 0 }, target[r][c])) {
        matchedCells++;
      }
    }
  }
  const matchPct = Math.round((matchedCells / totalCells) * 100);
  const isPerfect = matchPct === 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                교과서 92쪽 [문제 3] 퍼즐 도전
              </h2>
              <p className="text-xs text-gray-500">두 행렬을 더하여 [이미지 3]을 만드는 행렬 구하기</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 text-sm text-gray-700">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5">
            <h3 className="font-bold text-indigo-900 mb-1 text-xs sm:text-sm">
              [문제 3] 본문 내용
            </h3>
            <p className="text-xs text-indigo-800 leading-relaxed">
              "[이미지 1]과 [이미지 2]를 나타내는 두 행렬을 더하여 [이미지 3]을 만들려고 한다. 이미지 2를 구성하는 픽셀의 색상 정보는 (0, 0, 255)이고 픽셀의 색상 정보는 (0, 255, 0)이다. [이미지 2]를 나타내는 세 행렬 R, G, B를 각각 구하시오."
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex flex-col items-center">
              <span className="text-xs font-bold text-gray-800 mb-2">목표: 교과서 [이미지 3]</span>
              <div className="grid grid-cols-5 gap-0.5">
                {target.map((row, r) =>
                  row.map((cell, c) => (
                    <div
                      key={`${r}-${c}`}
                      className="w-5 h-5 rounded-xs border border-gray-300"
                      style={{ backgroundColor: rgbToHex(cell) }}
                      title={`RGB(${cell.r}, ${cell.g}, ${cell.b})`}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex flex-col items-center">
              <span className="text-xs font-bold text-gray-800 mb-2">현재 합성된 이미지</span>
              <div className="grid grid-cols-5 gap-0.5">
                {currentResult.slice(0, 5).map((row, r) =>
                  row.slice(0, 5).map((cell, c) => (
                    <div
                      key={`${r}-${c}`}
                      className="w-5 h-5 rounded-xs border border-gray-300"
                      style={{ backgroundColor: rgbToHex(cell) }}
                      title={`RGB(${cell.r}, ${cell.g}, ${cell.b})`}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span>목표 이미지와 일치율</span>
              <span className={isPerfect ? "text-emerald-600 font-bold" : "text-indigo-600"}>
                {matchedCells} / {totalCells} 픽셀 ({matchPct}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  isPerfect ? "bg-emerald-500" : "bg-indigo-600"
                }`}
                style={{ width: `${matchPct}%` }}
              />
            </div>
            {isPerfect ? (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200 mt-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>축하합니다! 문제 3의 목표 이미지와 100% 완벽하게 일치합니다! 🎉</span>
              </div>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                화면의 <strong>[이미지 2]</strong>에 초록색(0, 255, 0)과 파란색(0, 0, 255)을 채워서 목표 이미지 3을 완성해보세요.
              </p>
            )}
          </div>

          <div>
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHint ? "힌트 숨기기" : "문제 3 풀이 힌트 보기"}</span>
            </button>
            {showHint && (
              <div className="mt-2 p-3 bg-indigo-50/70 border border-indigo-200 rounded-lg text-xs space-y-1 text-indigo-900">
                <p>• [이미지 1]의 빨간색 픽셀에 초록색(0, 255, 0)을 더하면 노란색(255, 255, 0)이 됩니다.</p>
                <p>• [이미지 1]의 노란색 픽셀에 파란색(0, 0, 255)을 더하면 흰색(255, 255, 255)이 됩니다.</p>
                <p>• 부족한 색상 채널 성분을 [이미지 2]에 채워 넣으면 목표 [이미지 3]이 완성됩니다.</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={() => {
              onApplyProblem3();
              onClose();
            }}
            className="px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
          >
            문제 3 초기 상태 세팅하기
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Problem3Quiz;
