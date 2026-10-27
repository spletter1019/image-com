import React, { useState, useMemo } from "react";
import { Grid, GridSize, MatrixChannel, RGB, ToolMode, CellCoord } from "./types";
import { 
  createEmptyGrid, 
  cloneGrid, 
  addGrids, 
  rgbToHex,
  getColorName,
  PRESETS 
} from "./utils/colorUtils";
import { SheetsToolbar } from "./components/SheetsToolbar";
import { ImageGrid } from "./components/ImageGrid";
import { MatrixDisplay } from "./components/MatrixDisplay";
import { TheoryModal } from "./components/TheoryModal";
import { Problem3Quiz } from "./components/Problem3Quiz";
import { Plus, ArrowRight, Sparkles, Info, AlertCircle, Copy, Check, LayoutGrid, Columns } from "lucide-react";

export default function App() {
  const [gridSize, setGridSize] = useState<GridSize>(5);
  const [activeColor, setActiveColor] = useState<RGB>({ r: 255, g: 0, b: 0 }); // Default red
  const [toolMode, setToolMode] = useState<ToolMode>("bucket");
  const [matrixChannel, setMatrixChannel] = useState<MatrixChannel>("all");
  const [hoveredCell, setHoveredCell] = useState<CellCoord | null>(null);
  const [layoutMode, setLayoutMode] = useState<"textbook" | "split">("textbook");
  const [copied, setCopied] = useState(false);

  // Default initialize with Textbook page 92 example
  const defaultPreset = PRESETS[0];
  const [grid1, setGrid1] = useState<Grid>(cloneGrid(defaultPreset.grid1));
  const [grid2, setGrid2] = useState<Grid>(cloneGrid(defaultPreset.grid2));

  // History for Undo/Redo
  const [history, setHistory] = useState<{ g1: Grid; g2: Grid }[]>([]);
  const [redoStack, setRedoStack] = useState<{ g1: Grid; g2: Grid }[]>([]);

  // Modals
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Save state for undo
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

  // Grid size change handler
  const handleSizeChange = (newSize: GridSize) => {
    if (newSize === gridSize) return;
    saveStateToHistory(grid1, grid2);
    setGridSize(newSize);
    setGrid1(createEmptyGrid(newSize));
    setGrid2(createEmptyGrid(newSize));
  };

  // Load Preset
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

  // Result Calculation (Sum with clamp to 255)
  const { result: resultGrid, overflows } = useMemo(() => {
    return addGrids(grid1, grid2);
  }, [grid1, grid2]);

  // Inspector cell
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
      {/* (1) Google Sheets Fill Color & Tooling bar */}
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

      {/* Main Container */}
      <main className="flex-1 p-3 sm:p-5 max-w-[1750px] w-full mx-auto flex flex-col gap-4">

        {/* Textbook 92 Title Banner & Layout Switcher */}
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-2.5 shadow-2xs flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-full bg-emerald-600 shrink-0" />
            <div>
              <div className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                <span>3. 행렬의 연산을 이용한 이미지의 합성</span>
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                  교과서 92쪽 배치 구조
                </span>
              </div>
              <p className="text-xs text-gray-500">
                두 이미지를 나타내는 행렬의 R, G, B 성분을 각각 더하여 새로운 이미지를 합성합니다: [이미지 1] + [이미지 2] ➔ [합성 결과 이미지]
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Layout switch */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-xs">
              <button
                onClick={() => setLayoutMode("textbook")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  layoutMode === "textbook"
                    ? "bg-white text-emerald-800 shadow-2xs font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                title="교과서 92쪽과 동일한 가로 3단(이미지 1 + 이미지 2 ➔ 결과) 배치"
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
                title="좌우 2단 분할 배치"
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

        {/* ---------------------------------------------------- */}
        {/* LAYOUT OPTION A: AUTHENTIC TEXTBOOK 92 3-COLUMN FLOW */}
        {/* [Image 1]    +    [Image 2]    ➔    [Result Image]   */}
        {/*   R, G, B            R, G, B              R, G, B    */}
        {/* ---------------------------------------------------- */}
        {layoutMode === "textbook" ? (
          <div className="flex flex-col gap-4">
            {/* The 3 Columns Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-11 gap-3 items-stretch">
              
              {/* COLUMN 1: Image 1 & Matrix 1 */}
              <div className="lg:col-span-3 bg-white rounded-2xl border-2 border-red-200 shadow-xs p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-red-100">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300">
                      [이미지 1] (표 A)
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">{gridSize}×{gridSize}</span>
                  </div>

                  {/* Top: Image Grid 1 */}
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

                {/* Bottom: Matrix 1 (R, G, B) */}
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <MatrixDisplay
                    label="이미지 1의 행렬"
                    grid={grid1}
                    channel={matrixChannel}
                    hoveredCell={hoveredCell}
                    setHoveredCell={setHoveredCell}
                    themeColor="red"
                  />
                </div>
              </div>

              {/* PLUS OPERATOR DIVIDER */}
              <div className="lg:col-span-1 flex flex-col items-center justify-center py-2">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 shadow-sm flex items-center justify-center text-gray-700">
                  <Plus className="w-7 h-7 stroke-[3]" />
                </div>
                <span className="text-[11px] font-bold text-gray-500 mt-1">덧셈</span>
              </div>

              {/* COLUMN 2: Image 2 & Matrix 2 */}
              <div className="lg:col-span-3 bg-white rounded-2xl border-2 border-blue-200 shadow-xs p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-blue-100">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                      [이미지 2] (표 B)
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">{gridSize}×{gridSize}</span>
                  </div>

                  {/* Top: Image Grid 2 */}
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

                {/* Bottom: Matrix 2 (R, G, B) */}
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <MatrixDisplay
                    label="이미지 2의 행렬"
                    grid={grid2}
                    channel={matrixChannel}
                    hoveredCell={hoveredCell}
                    setHoveredCell={setHoveredCell}
                    themeColor="blue"
                  />
                </div>
              </div>

              {/* ARROW OPERATOR DIVIDER */}
              <div className="lg:col-span-1 flex flex-col items-center justify-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white shadow-sm flex items-center justify-center">
                  <ArrowRight className="w-7 h-7 stroke-[3]" />
                </div>
                <span className="text-[11px] font-bold text-emerald-800 mt-1">합성 결과</span>
              </div>

              {/* COLUMN 3: Result Image & Result Matrix */}
              <div className="lg:col-span-3 bg-white rounded-2xl border-2 border-emerald-400 shadow-sm p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-100">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span>[합성 결과 이미지]</span>
                    </span>
                    <span className="text-[11px] text-emerald-700 font-mono font-semibold">{gridSize}×{gridSize}</span>
                  </div>

                  {/* Top: Result Image (Read-only visual) */}
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

                {/* Bottom: Result Matrix (R, G, B) */}
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <MatrixDisplay
                    label="합성 결과 행렬 (A + B)"
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
          /* ---------------------------------------------------- */
          /* LAYOUT OPTION B: SPLIT 2-COLUMN VIEW                 */
          /* ---------------------------------------------------- */
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

        {/* Detailed Pixel Arithmetic Inspector (Bottom Section) */}
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
            {/* Color preview chip */}
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-md border border-black/10 shadow-2xs" 
                  style={{ backgroundColor: rgbToHex(p1) }} 
                  title="이미지 1 픽셀"
                />
                <span className="font-bold text-gray-400">+</span>
                <div 
                  className="w-8 h-8 rounded-md border border-black/10 shadow-2xs" 
                  style={{ backgroundColor: rgbToHex(p2) }} 
                  title="이미지 2 픽셀"
                />
                <ArrowRight className="w-4 h-4 text-emerald-600" />
                <div 
                  className="w-8 h-8 rounded-md border border-black/10 shadow-2xs ring-1 ring-emerald-500" 
                  style={{ backgroundColor: rgbToHex(pres) }} 
                  title="합성 픽셀"
                />
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-gray-900">{getColorName(pres)}</div>
                <div className="text-[10px] text-gray-500 font-mono">({pres.r}, {pres.g}, {pres.b})</div>
              </div>
            </div>

            {/* Red math */}
            <div className="bg-red-50/60 p-3 rounded-xl border border-red-200">
              <div className="text-[11px] font-bold text-red-700 mb-1">R 성분 (빨강)</div>
              <div className="font-mono text-xs text-gray-800">
                {p1.r} + {p2.r} = <span className="font-bold text-red-700">{p1.r + p2.r}</span>
                {p1.r + p2.r > 255 && (
                  <span className="text-[11px] text-amber-600 font-semibold block">→ 255로 제한</span>
                )}
              </div>
            </div>

            {/* Green math */}
            <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
              <div className="text-[11px] font-bold text-emerald-700 mb-1">G 성분 (초록)</div>
              <div className="font-mono text-xs text-gray-800">
                {p1.g} + {p2.g} = <span className="font-bold text-emerald-700">{p1.g + p2.g}</span>
                {p1.g + p2.g > 255 && (
                  <span className="text-[11px] text-amber-600 font-semibold block">→ 255로 제한</span>
                )}
              </div>
            </div>

            {/* Blue math */}
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

      {/* Modals */}
      <TheoryModal
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
      />

      <Problem3Quiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        currentResult={resultGrid}
        onApplyProblem3={() => handleLoadPreset("p92-problem3")}
      />
    </div>
  );
}
