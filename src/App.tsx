import React, { useState, useMemo } from "react";
import { Grid, GridSize, MatrixChannel, RGB, ToolMode, CellCoord } from "./types";
import { 
  createEmptyGrid, 
  cloneGrid, 
  addGrids, 
  rgbToHex,
  isRgbEqual,
  getColorName,
  PRESETS 
} from "./utils/colorUtils";
import { SheetsToolbar } from "./components/SheetsToolbar";
import { ImageGrid } from "./components/ImageGrid";
import { MatrixDisplay } from "./components/MatrixDisplay";
import { 
  Plus, 
  ArrowRight, 
  Sparkles, 
  Info, 
  AlertCircle, 
  Copy, 
  Check, 
  LayoutGrid, 
  Columns, 
  X, 
  BookOpen, 
  CheckCircle, 
  CheckCircle2, 
  HelpCircle 
} from "lucide-react";

/* ------------------------------------------------------------- */
/* Inline Problem 3 Quiz Modal (Self-contained for Vercel build) */
/* ------------------------------------------------------------- */
function Problem3QuizModal({
  isOpen,
  onClose,
  currentResult,
  onApplyProblem3,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentResult: Grid;
  onApplyProblem3: () => void;
}) {
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
                      key={`target-${r}-${c}`}
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
                      key={`curr-${r}-${c}`}
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
}

/* ------------------------------------------------------------- */
/* Inline Theory Modal (Self-contained for Vercel build)         */
/* ------------------------------------------------------------- */
function TheoryModalView({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                교과서 92쪽 : 행렬의 연산을 이용한 이미지의 합성
              </h2>
              <p className="text-xs text-gray-500">인공지능 수학 교과서 III. 이미지 데이터 처리</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5 text-sm text-gray-700 leading-relaxed">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <h3 className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>3. 행렬의 연산을 이용한 이미지의 합성 핵심 개념</span>
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800">
              "행렬의 덧셈을 이용하면 두 이미지를 합성할 수 있다. 이때 세 행렬 R, G, B의 각각의 성분끼리의 합을 이용한다. 예를 들어 빨간색과 파란색으로 이루어진 두 이미지를 합성하면 교차 영역이 자홍색(마젠타)이 된다."
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-2">1. 픽셀 값과 행렬의 표현</h4>
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              컬러 이미지의 각 픽셀은 <strong>빨강(R), 초록(G), 파랑(B)</strong> 세 가지 색상 정보로 구성되며, 각각 0부터 255까지의 정수 값을 갖습니다.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-gray-50 border text-center">
                <div className="font-bold text-gray-800">검은색 (배경)</div>
                <div className="text-gray-500">(0, 0, 0)</div>
              </div>
              <div className="p-2 rounded bg-red-50 border border-red-200 text-center">
                <div className="font-bold text-red-700">빨간색 (Red)</div>
                <div className="text-red-500">(255, 0, 0)</div>
              </div>
              <div className="p-2 rounded bg-blue-50 border border-blue-200 text-center">
                <div className="font-bold text-blue-700">파란색 (Blue)</div>
                <div className="text-blue-500">(0, 0, 255)</div>
              </div>
              <div className="p-2 rounded bg-purple-50 border border-purple-200 text-center">
                <div className="font-bold text-purple-700">자홍색 (Magenta)</div>
                <div className="text-purple-500">(255, 0, 255)</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-2">2. 행렬 덧셈 공식 및 255 초과 제한 규칙</h4>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 font-mono text-xs sm:text-sm space-y-1">
              <div>R_합성 = min(255, R_1 + R_2)</div>
              <div>G_합성 = min(255, G_1 + G_2)</div>
              <div>B_합성 = min(255, B_1 + B_2)</div>
            </div>
            <p className="text-xs text-amber-700 mt-2 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              ※ 교과서 90쪽/92쪽 규칙: "픽셀의 값은 0부터 255까지만 가능하므로 255 이상은 모두 255로 처리하고, 0 이하는 모두 0으로 처리해요."
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-2">3. 빛의 삼원색 가산 혼합 (Additive Color Mixing)</h4>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-gray-600 space-y-1">
              <li><strong>빨강 (255, 0, 0) + 파랑 (0, 0, 255)</strong> = 자홍 / 마젠타 (255, 0, 255)</li>
              <li><strong>빨강 (255, 0, 0) + 초록 (0, 255, 0)</strong> = 노랑 / 옐로우 (255, 255, 0)</li>
              <li><strong>초록 (0, 255, 0) + 파랑 (0, 0, 255)</strong> = 청록 / 시안 (0, 255, 255)</li>
              <li><strong>빨강 + 초록 + 파랑</strong> = 흰색 / 화이트 (255, 255, 255)</li>
            </ul>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- */
/* Main Application Component                                   */
/* ------------------------------------------------------------- */
export default function App() {
  const [gridSize, setGridSize] = useState<GridSize>(5);
  const [activeColor, setActiveColor] = useState<RGB>({ r: 255, g: 0, b: 0 });
  const [toolMode, setToolMode] = useState<ToolMode>("bucket");
  const [matrixChannel, setMatrixChannel] = useState<MatrixChannel>("all");
  const [hoveredCell, setHoveredCell] = useState<CellCoord | null>(null);
  const [layoutMode, setLayoutMode] = useState<"textbook" | "split">("textbook");
  const [copied, setCopied] = useState(false);

  const defaultPreset = PRESETS[0];
  const [grid1, setGrid1] = useState<Grid>(cloneGrid(defaultPreset.grid1));
  const [grid2, setGrid2] = useState<Grid>(cloneGrid(defaultPreset.grid2));

  const [history, setHistory] = useState<{ g1: Grid; g2: Grid }[]>([]);
  const [redoStack, setRedoStack] = useState<{ g1: Grid; g2: Grid }[]>([]);

  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const saveStateToHistory = (newG1: Grid, newG2: Grid) => {
    setHistory((prev) => [...prev.slice(-20), { g1: cloneGrid(grid1), g2: cloneGrid(grid2) }]);
    setRedoStack([]);
  };

  const updateGrid1 = (newG1: Grid) => {
    saveStateToHistory(newG1, grid2);
    setGrid1(newG1);
  };

  const updateGrid2 = (newG2: Grid) => {
    saveStateToHistory(grid1, newG2);
    setGrid2(newG2);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack((prev) => [{ g1: cloneGrid(grid1), g2: cloneGrid(grid2) }, ...prev]);
    setGrid1(previous.g1);
    setGrid2(previous.g2);
    setGridSize(previous.g1.length as GridSize);
    setHistory((prev) => prev.slice(0, prev.length - 1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory((prev) => [...prev, { g1: cloneGrid(grid1), g2: cloneGrid(grid2) }]);
    setGrid1(next.g1);
    setGrid2(next.g2);
    setGridSize(next.g1.length as GridSize);
    setRedoStack((prev) => prev.slice(1));
  };

  const handleSizeChange = (newSize: GridSize) => {
    if (newSize === gridSize) return;
    saveStateToHistory(grid1, grid2);
    setGridSize(newSize);
    setGrid1(createEmptyGrid(newSize));
    setGrid2(createEmptyGrid(newSize));
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    saveStateToHistory(grid1, grid2);
    setGridSize(preset.size);
    setGrid1(cloneGrid(preset.grid1));
    setGrid2(cloneGrid(preset.grid2));
  };

  const handleClearAll = () => {
    saveStateToHistory(grid1, grid2);
    setGrid1(createEmptyGrid(gridSize));
    setGrid2(createEmptyGrid(gridSize));
  };

  const { result: resultGrid, overflows } = useMemo(() => {
    return addGrids(grid1, grid2);
  }, [grid1, grid2]);

  const inspectRow = hoveredCell ? hoveredCell.r : 0;
  const inspectCol = hoveredCell ? hoveredCell.c : 0;
  const p1 = grid1[inspectRow]?.[inspectCol] || { r: 0, g: 0, b: 0 };
  const p2 = grid2[inspectRow]?.[inspectCol] || { r: 0, g: 0, b: 0 };
  const pres = resultGrid[inspectRow]?.[inspectCol] || { r: 0, g: 0, b: 0 };
  const hasOverflow = overflows[inspectRow]?.[inspectCol] || false;

  const handleCopyLatex = () => {
    let latex = "R_{합성} = \\begin{pmatrix}\n";
    for (let r = 0; r < gridSize; r++) {
      latex += "  " + resultGrid[r].map(c => c.r).join(" & ") + " \\\\ \n";
    }
    latex += "\\end{pmatrix}\n\n";

    latex += "G_{합성} = \\begin{pmatrix}\n";
    for (let r = 0; r < gridSize; r++) {
      latex += "  " + resultGrid[r].map(c => c.g).join(" & ") + " \\\\ \n";
    }
    latex += "\\end{pmatrix}\n\n";

    latex += "B_{합성} = \\begin{pmatrix}\n";
    for (let r = 0; r < gridSize; r++) {
      latex += "  " + resultGrid[r].map(c => c.b).join(" & ") + " \\\\ \n";
    }
    latex += "\\end{pmatrix}";

    navigator.clipboard.writeText(latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-gray-900 flex flex-col font-sans">
      <SheetsToolbar
        activeColor={activeColor}
        setActiveColor={setActiveColor}
        toolMode={toolMode}
        setToolMode={setToolMode}
        gridSize={gridSize}
        setGridSize={handleSizeChange}
        matrixChannel={matrixChannel}
        setMatrixChannel={setMatrixChannel}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={history.length > 0}
        canRedo={redoStack.length > 0}
        onLoadPreset={handleLoadPreset}
        onOpenTheory={() => setIsTheoryOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onClearAll={handleClearAll}
      />

      <main className="flex-1 p-3 sm:p-5 max-w-[1750px] w-full mx-auto flex flex-col gap-4">
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-2.5 shadow-2xs flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-full bg-emerald-600 shrink-0" />
            <div>
              <div className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                <span>3. 행렬의 연산을 이용한 이미지의 합성</span>
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                  교과서 92쪽 배치
                </span>
              </div>
              <p className="text-xs text-gray-500">
                [이미지 1] + [이미지 2] ➔ [합성 결과 이미지]
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-xs">
              <button
                onClick={() => setLayoutMode("textbook")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  layoutMode === "textbook"
                    ? "bg-white text-emerald-800 shadow-2xs font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>교과서 92쪽 배치</span>
              </button>
              <button
                onClick={() => setLayoutMode("split")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  layoutMode === "split"
                    ? "bg-white text-emerald-800 shadow-2xs font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>좌우 분할 배치</span>
              </button>
            </div>

            <button
              onClick={handleCopyLatex}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "복사됨!" : "LaTeX 복사"}</span>
            </button>
          </div>
        </div>

        {layoutMode === "textbook" ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 lg:grid-cols-11 gap-3 items-stretch">
              
              {/* Column 1: Image 1 & Matrix 1 */}
              <div className="lg:col-span-3 bg-white rounded-2xl border-2 border-red-200 shadow-xs p-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-red-100">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300">
                      [이미지 1] (표 A)
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">{gridSize}×{gridSize}</span>
                  </div>

                  <ImageGrid
                    id="image-1"
                    title="이미지 1"
                    grid={grid1}
                    onChangeGrid={updateGrid1}
                    activeColor={activeColor}
                    toolMode={toolMode}
                    hoveredCell={hoveredCell}
                    setHoveredCell={setHoveredCell}
                    onPickColor={setActiveColor}
                    accentColor="red"
                  />
                </div>

                <div className="mt-2 pt-1.5 border-t border-gray-100">
                  <MatrixDisplay
                    label="이미지 1 행렬"
                    grid={grid1}
                    channel={matrixChannel}
                    hoveredCell={hoveredCell}
                    setHoveredCell={setHoveredCell}
                    themeColor="red"
                  />
                </div>
              </div>

              {/* Plus Operator */}
              <div className="lg:col-span-1 flex flex-col items-center justify-center py-2">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 shadow-xs flex items-center justify-center text-gray-700">
                  <Plus className="w-6 h-6 stroke-[3]" />
                </div>
                <span className="text-[10px] font-bold text-gray-500 mt-1">덧셈</span>
              </div>

              {/* Column 2: Image 2 & Matrix 2 */}
              <div className="lg:col-span-3 bg-white rounded-2xl border-2 border-blue-200 shadow-xs p-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-blue-100">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                      [이미지 2] (표 B)
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">{gridSize}×{gridSize}</span>
                  </div>

                  <ImageGrid
                    id="image-2"
                    title="이미지 2"
                    grid={grid2}
                    onChangeGrid={updateGrid2}
                    activeColor={activeColor}
                    toolMode={toolMode}
                    hoveredCell={hoveredCell}
                    setHoveredCell={setHoveredCell}
                    onPickColor={setActiveColor}
                    accentColor="blue"
                  />
                </div>

                <div className="mt-2 pt-1.5 border-t border-gray-100">
                  <MatrixDisplay
                    label="이미지 2 행렬"
                    grid={grid2}
                    channel={matrixChannel}
                    hoveredCell={hoveredCell}
                    setHoveredCell={setHoveredCell}
                    themeColor="blue"
                  />
                </div>
              </div>

              {/* Arrow Operator */}
              <div className="lg:col-span-1 flex flex-col items-center justify-center py-2">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white shadow-xs flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 stroke-[3]" />
                </div>
                <span className="text-[10px] font-bold text-emerald-800 mt-1">합성 결과</span>
              </div>

              {/* Column 3: Result Image & Result Matrix */}
              <div className="lg:col-span-3 bg-white rounded-2xl border-2 border-emerald-400 shadow-xs p-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-emerald-100">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-700" />
                      <span>[합성 결과 이미지]</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-mono font-semibold">{gridSize}×{gridSize}</span>
                  </div>

                  <ImageGrid
                    id="image-result"
                    title="합성 결과 이미지"
                    subtitle="자동 합성됨"
                    grid={resultGrid}
                    activeColor={activeColor}
                    toolMode={toolMode}
                    hoveredCell={hoveredCell}
                    setHoveredCell={setHoveredCell}
                    isReadOnly={true}
                    accentColor="emerald"
                  />
                </div>

                <div className="mt-2 pt-1.5 border-t border-gray-100">
                  <MatrixDisplay
                    label="합성 결과 행렬"
                    grid={resultGrid}
                    channel={matrixChannel}
                    hoveredCell={hoveredCell}
                    setHoveredCell={setHoveredCell}
                    themeColor="emerald"
                    isResult={true}
                    overflows={overflows}
                  />
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
            <section className="xl:col-span-7 flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="text-sm font-bold text-gray-800 mb-3">[이미지 1]과 대응 행렬</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <ImageGrid
                    id="image-1-split"
                    title="이미지 1 (표 A)"
                    grid={grid1}
                    onChangeGrid={updateGrid1}
                    activeColor={activeColor}
                    toolMode={toolMode}
                    hoveredCell={hoveredCell}
                    setHoveredCell={setHoveredCell}
                    onPickColor={setActiveColor}
                    accentColor="red"
                  />
                  <MatrixDisplay
                    label="이미지 1 행렬"
                    grid={grid1}
                    channel={matrixChannel}
                    hoveredCell={hoveredCell}
                    setHoveredCell={setHoveredCell}
                    themeColor="red"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">
                  <Plus className="w-4 h-4" />
                  <span>행렬 덧셈</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="text-sm font-bold text-gray-800 mb-3">[이미지 2]와 대응 행렬</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <ImageGrid
                    id="image-2-split"
                    title="이미지 2 (표 B)"
                    grid={grid2}
                    onChangeGrid={updateGrid2}
                    activeColor={activeColor}
                    toolMode={toolMode}
                    hoveredCell={hoveredCell}
                    setHoveredCell={setHoveredCell}
                    onPickColor={setActiveColor}
                    accentColor="blue"
                  />
                  <MatrixDisplay
                    label="이미지 2 행렬"
                    grid={grid2}
                    channel={matrixChannel}
                    hoveredCell={hoveredCell}
                    setHoveredCell={setHoveredCell}
                    themeColor="blue"
                  />
                </div>
              </div>
            </section>

            <section className="xl:col-span-5 bg-white rounded-2xl border-2 border-emerald-400 p-4">
              <div className="text-sm font-bold text-gray-800 mb-3">[합성 결과 이미지 및 행렬]</div>
              <div className="flex flex-col gap-4">
                <ImageGrid
                  id="image-res-split"
                  title="합성 결과 이미지"
                  grid={resultGrid}
                  activeColor={activeColor}
                  toolMode={toolMode}
                  hoveredCell={hoveredCell}
                  setHoveredCell={setHoveredCell}
                  isReadOnly={true}
                  accentColor="emerald"
                />
                <MatrixDisplay
                  label="합성 결과 행렬"
                  grid={resultGrid}
                  channel={matrixChannel}
                  hoveredCell={hoveredCell}
                  setHoveredCell={setHoveredCell}
                  themeColor="emerald"
                  isResult={true}
                  overflows={overflows}
                />
              </div>
            </section>
          </div>
        )}

        <section className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Info className="w-4 h-4 text-emerald-700" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-800">
                선택된 셀 ({inspectRow + 1}행 {inspectCol + 1}열) 성분별 덧셈 상세 계산기
              </h3>
            </div>
            {hasOverflow && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>255 초과 값은 교과서 규칙에 따라 255로 제한됩니다.</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-7 h-7 rounded-md border border-black/10 shadow-2xs" 
                  style={{ backgroundColor: rgbToHex(p1) }} 
                  title="이미지 1 픽셀"
                />
                <span className="font-bold text-gray-400">+</span>
                <div 
                  className="w-7 h-7 rounded-md border border-black/10 shadow-2xs" 
                  style={{ backgroundColor: rgbToHex(p2) }} 
                  title="이미지 2 픽셀"
                />
                <ArrowRight className="w-4 h-4 text-emerald-600" />
                <div 
                  className="w-7 h-7 rounded-md border border-black/10 shadow-2xs ring-1 ring-emerald-500" 
                  style={{ backgroundColor: rgbToHex(pres) }} 
                  title="합성 픽셀"
                />
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-gray-900">{getColorName(pres)}</div>
                <div className="text-[10px] text-gray-500 font-mono">({pres.r}, {pres.g}, {pres.b})</div>
              </div>
            </div>

            <div className="bg-red-50/60 p-3 rounded-xl border border-red-200">
              <div className="text-[11px] font-bold text-red-700 mb-1">R 성분 (빨강)</div>
              <div className="font-mono text-xs text-gray-800">
                {p1.r} + {p2.r} = <span className="font-bold text-red-700">{p1.r + p2.r}</span>
                {p1.r + p2.r > 255 && (
                  <span className="text-[11px] text-amber-600 font-semibold block">→ 255로 제한</span>
                )}
              </div>
            </div>

            <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
              <div className="text-[11px] font-bold text-emerald-700 mb-1">G 성분 (초록)</div>
              <div className="font-mono text-xs text-gray-800">
                {p1.g} + {p2.g} = <span className="font-bold text-emerald-700">{p1.g + p2.g}</span>
                {p1.g + p2.g > 255 && (
                  <span className="text-[11px] text-amber-600 font-semibold block">→ 255로 제한</span>
                )}
              </div>
            </div>

            <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200">
              <div className="text-[11px] font-bold text-blue-700 mb-1">B 성분 (파랑)</div>
              <div className="font-mono text-xs text-gray-800">
                {p1.b} + {p2.b} = <span className="font-bold text-blue-700">{p1.b + p2.b}</span>
                {p1.b + p2.b > 255 && (
                  <span className="text-[11px] text-amber-600 font-semibold block">→ 255로 제한</span>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <TheoryModalView
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
      />

      <Problem3QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        currentResult={resultGrid}
        onApplyProblem3={() => handleLoadPreset("p92-problem3")}
      />
    </div>
  );
}
