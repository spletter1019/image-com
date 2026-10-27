const fs = require('fs');

// Ensure directories
fs.mkdirSync('src/utils', { recursive: true });
fs.mkdirSync('src/components', { recursive: true });

// 1. src/utils/colorUtils.ts
const colorUtilsCode = `import { Grid, GridSize, RGB, Preset } from "../types";

export const clamp = (val: number, min = 0, max = 255): number => {
  return Math.max(min, Math.min(max, Math.round(val)));
};

export const rgbToHex = ({ r, g, b }: RGB): string => {
  const toHex = (c: number) => clamp(c).toString(16).padStart(2, "0");
  return "#" + toHex(r) + toHex(g) + toHex(b);
};

export const hexToRgb = (hex: string): RGB => {
  let cleaned = hex.replace("#", "");
  if (cleaned.length === 3) {
    cleaned = cleaned.split("").map((c) => c + c).join("");
  }
  const num = parseInt(cleaned, 16);
  if (isNaN(num)) return { r: 0, g: 0, b: 0 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
};

export const isRgbEqual = (a: RGB, b: RGB): boolean => {
  return a.r === b.r && a.g === b.g && a.b === b.b;
};

export const createEmptyGrid = (size: GridSize, defaultColor: RGB = { r: 0, g: 0, b: 0 }): Grid => {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ ...defaultColor }))
  );
};

export const cloneGrid = (g: Grid): Grid => {
  return g.map(row => row.map(cell => ({ ...cell })));
};

export const addGrids = (g1: Grid, g2: Grid): { result: Grid; overflows: boolean[][] } => {
  const size = g1.length;
  const result: Grid = [];
  const overflows: boolean[][] = [];

  for (let r = 0; r < size; r++) {
    result[r] = [];
    overflows[r] = [];
    for (let c = 0; c < size; c++) {
      const p1 = g1[r]?.[c] || { r: 0, g: 0, b: 0 };
      const p2 = g2[r]?.[c] || { r: 0, g: 0, b: 0 };

      const rSum = p1.r + p2.r;
      const gSum = p1.g + p2.g;
      const bSum = p1.b + p2.b;

      overflows[r][c] = rSum > 255 || gSum > 255 || bSum > 255;

      result[r][c] = {
        r: clamp(rSum),
        g: clamp(gSum),
        b: clamp(bSum),
      };
    }
  }

  return { result, overflows };
};

export const getColorName = ({ r, g, b }: RGB): string => {
  if (r === 0 && g === 0 && b === 0) return "검은색 (배경 0, 0, 0)";
  if (r === 255 && g === 255 && b === 255) return "흰색 (255, 255, 255)";
  if (r === 255 && g === 0 && b === 0) return "빨간색 (Red)";
  if (r === 0 && g === 255 && b === 0) return "초록색 (Green)";
  if (r === 0 && g === 0 && b === 255) return "파란색 (Blue)";
  if (r === 255 && g === 255 && b === 0) return "노란색 (Yellow)";
  if (r === 0 && g === 255 && b === 255) return "청록색 (Cyan)";
  if (r === 255 && g === 0 && b === 255) return "자홍색 (Magenta)";
  if (r === g && g === b) return "회색 (" + r + ", " + g + ", " + b + ")";
  return "RGB(" + r + ", " + g + ", " + b + ")";
};

// Google Sheets Standard 80-Color Palette
export const GOOGLE_SHEETS_PALETTE: { name: string; hexes: string[] }[] = [
  {
    name: "기본 흑백/무채색",
    hexes: ["#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3", "#ffffff"],
  },
  {
    name: "원색 및 주요색",
    hexes: ["#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff"],
  },
  {
    name: "파스텔 톤",
    hexes: ["#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc"],
  },
  {
    name: "밝은 톤",
    hexes: ["#dd7e6b", "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#a4c2f4", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
  },
  {
    name: "중간 톤",
    hexes: ["#cc4125", "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6d9eeb", "#6fa8dc", "#8e7cc3", "#c27ba0"],
  },
  {
    name: "짙은 톤",
    hexes: ["#a61c00", "#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3c78d8", "#3d85c6", "#674ea7", "#a64d79"],
  },
  {
    name: "어두운 음영",
    hexes: ["#5b0f00", "#660000", "#783f04", "#7f6000", "#274e13", "#0c343d", "#1155cc", "#073763", "#20124d", "#4c1130"],
  },
];

export const PRIMARY_MATH_COLORS: { label: string; rgb: RGB; hex: string }[] = [
  { label: "빨강 (R=255)", rgb: { r: 255, g: 0, b: 0 }, hex: "#ff0000" },
  { label: "초록 (G=255)", rgb: { r: 0, g: 255, b: 0 }, hex: "#00ff00" },
  { label: "파랑 (B=255)", rgb: { r: 0, g: 0, b: 255 }, hex: "#0000ff" },
  { label: "노랑 (R+G)", rgb: { r: 255, g: 255, b: 0 }, hex: "#ffff00" },
  { label: "청록 (G+B)", rgb: { r: 0, g: 255, b: 255 }, hex: "#00ffff" },
  { label: "자홍 (R+B)", rgb: { r: 255, g: 0, b: 255 }, hex: "#ff00ff" },
  { label: "흰색 (RGB)", rgb: { r: 255, g: 255, b: 255 }, hex: "#ffffff" },
  { label: "검정 (0,0,0)", rgb: { r: 0, g: 0, b: 0 }, hex: "#000000" },
];

export const PRESETS: Preset[] = [
  {
    id: "p92-example",
    name: "교과서 92쪽 본문 예제 (빨강 + 파랑 = 마젠타)",
    description: "빨간색 이미지와 파란색 이미지를 더해 겹치는 영역이 자홍색(Magenta)이 되는 교과서 대표 예제",
    size: 5,
    grid1: [
      [{r:0,g:0,b:0}, {r:0,g:0,b:0}, {r:0,g:0,b:0}, {r:0,g:0,b:0}, {r:0,g:0,b:0}],
      [{r:255,g:0,b:0}, {r:255,g:0,b:0}, {r:255,g:0,b:0}, {r:255,g:0,b:0}, {r:255,g:0,b:0}],
      [{r:255,g:0,b:0}, {r:255,g:0,b:0}, {r:255,g:0,b:0}, {r:255,g:0,b:0}, {r:255,g:0,b:0}],
      [{r:0,g:0,b:0}, {r:0,g:0,b:0}, {r:0,g:0,b:0}, {r:255,g:0,b:0}, {r:255,g:0,b:0}],
      [{r:0,g:0,b:0}, {r:0,g:0,b:0}, {r:0,g:0,b:0}, {r:255,g:0,b:0}, {r:255,g:0,b:0}],
    ],
    grid2: [
      [{r:0,g:0,b:255}, {r:0,g:0,b:255}, {r:0,g:0,b:0}, {r:0,g:0,b:0}, {r:0,g:0,b:0}],
      [{r:0,g:0,b:255}, {r:0,g:0,b:255}, {r:0,g:0,b:0}, {r:0,g:0,b:0}, {r:0,g:0,b:0}],
      [{r:0,g:0,b:255}, {r:0,g:0,b:255}, {r:0,g:0,b:255}, {r:0,g:0,b:255}, {r:0,g:0,b:255}],
      [{r:0,g:0,b:255}, {r:0,g:0,b:255}, {r:0,g:0,b:255}, {r:0,g:0,b:255}, {r:0,g:0,b:255}],
      [{r:0,g:0,b:0}, {r:0,g:0,b:0}, {r:0,g:0,b:0}, {r:0,g:0,b:0}, {r:0,g:0,b:0}],
    ],
  },
  {
    id: "p92-problem3",
    name: "교과서 92쪽 [문제 3] 실습 퍼즐",
    description: "[이미지 1]과 [이미지 2]를 더해 [이미지 3]을 합성하는 문제",
    size: 5,
    grid1: [
      [{r:255,g:255,b:0}, {r:255,g:0,b:0}, {r:255,g:255,b:0}, {r:255,g:255,b:0}, {r:255,g:255,b:0}],
      [{r:255,g:0,b:0},   {r:255,g:0,b:0}, {r:255,g:0,b:0},   {r:255,g:0,b:0},   {r:255,g:0,b:0}],
      [{r:255,g:255,b:0}, {r:255,g:0,b:0}, {r:255,g:255,b:0}, {r:255,g:255,b:0}, {r:255,g:255,b:0}],
      [{r:255,g:255,b:0}, {r:255,g:0,b:0}, {r:255,g:255,b:0}, {r:255,g:255,b:0}, {r:255,g:255,b:0}],
      [{r:0,g:0,b:0},     {r:0,g:0,b:0},   {r:0,g:0,b:0},     {r:0,g:0,b:0},     {r:0,g:0,b:0}],
    ],
    grid2: [
      [{r:0,g:0,b:255}, {r:0,g:255,b:0}, {r:0,g:0,b:255}, {r:0,g:0,b:255}, {r:0,g:0,b:255}],
      [{r:0,g:255,b:0}, {r:0,g:255,b:0}, {r:0,g:255,b:0}, {r:0,g:255,b:0}, {r:0,g:255,b:0}],
      [{r:0,g:0,b:255}, {r:0,g:255,b:0}, {r:0,g:0,b:255}, {r:0,g:0,b:255}, {r:0,g:0,b:255}],
      [{r:0,g:0,b:255}, {r:0,g:255,b:0}, {r:0,g:0,b:255}, {r:0,g:0,b:255}, {r:0,g:0,b:255}],
      [{r:255,g:0,b:255},{r:0,g:0,b:0},  {r:255,g:0,b:255},{r:255,g:0,b:255},{r:255,g:0,b:255}],
    ],
    targetGrid: [
      [{r:255,g:255,b:255}, {r:255,g:255,b:0},   {r:255,g:255,b:255}, {r:255,g:255,b:255}, {r:255,g:255,b:255}],
      [{r:255,g:255,b:0},   {r:255,g:255,b:0},   {r:255,g:255,b:0},   {r:255,g:255,b:0},   {r:255,g:255,b:0}],
      [{r:255,g:255,b:255}, {r:255,g:255,b:0},   {r:255,g:255,b:255}, {r:255,g:255,b:255}, {r:255,g:255,b:255}],
      [{r:255,g:255,b:255}, {r:255,g:255,b:0},   {r:255,g:255,b:255}, {r:255,g:255,b:255}, {r:255,g:255,b:255}],
      [{r:255,g:0,b:255},   {r:0,g:0,b:0},       {r:255,g:0,b:255},   {r:255,g:0,b:255},   {r:255,g:0,b:255}],
    ],
  },
  {
    id: "rgb-primary-3x3",
    name: "3×3 기본 삼원색 합성 (빨강 + 초록 = 노랑)",
    description: "빨강 행렬과 초록 행렬을 더해 빛의 삼원색(노랑)이 나타나는 3×3 예시",
    size: 3,
    grid1: [
      [{r:255,g:0,b:0}, {r:255,g:0,b:0}, {r:0,g:0,b:0}],
      [{r:255,g:0,b:0}, {r:255,g:0,b:0}, {r:0,g:0,b:0}],
      [{r:0,g:0,b:0},   {r:0,g:0,b:0},   {r:0,g:0,b:0}],
    ],
    grid2: [
      [{r:0,g:0,b:0},   {r:0,g:255,b:0}, {r:0,g:255,b:0}],
      [{r:0,g:0,b:0},   {r:0,g:255,b:0}, {r:0,g:255,b:0}],
      [{r:0,g:0,b:0},   {r:0,g:0,b:0},   {r:0,g:0,b:0}],
    ],
  },
  {
    id: "pattern-4x4",
    name: "4×4 패턴 합성 (대각선 파랑 + 역대각선 빨강)",
    description: "두 대각선이 교차하며 중앙에서 자홍색(마젠타)을 형성하는 4×4 합성",
    size: 4,
    grid1: [
      [{r:255,g:0,b:0}, {r:0,g:0,b:0},   {r:0,g:0,b:0},   {r:255,g:0,b:0}],
      [{r:0,g:0,b:0},   {r:255,g:0,b:0}, {r:255,g:0,b:0}, {r:0,g:0,b:0}],
      [{r:0,g:0,b:0},   {r:255,g:0,b:0}, {r:255,g:0,b:0}, {r:0,g:0,b:0}],
      [{r:255,g:0,b:0}, {r:0,g:0,b:0},   {r:0,g:0,b:0},   {r:255,g:0,b:0}],
    ],
    grid2: [
      [{r:0,g:0,b:255}, {r:0,g:0,b:0},   {r:0,g:0,b:0},   {r:0,g:0,b:255}],
      [{r:0,g:0,b:255}, {r:0,g:0,b:255}, {r:0,g:0,b:255}, {r:0,g:0,b:0}],
      [{r:0,g:0,b:0},   {r:0,g:0,b:255}, {r:0,g:0,b:255}, {r:0,g:0,b:255}],
      [{r:0,g:0,b:255}, {r:0,g:0,b:0},   {r:0,g:0,b:0},   {r:0,g:0,b:255}],
    ],
  },
];
`;

fs.writeFileSync('src/utils/colorUtils.ts', colorUtilsCode.trim() + '\n');
console.log('src/utils/colorUtils.ts written');
