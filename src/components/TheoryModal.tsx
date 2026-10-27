import React from "react";
import { X, BookOpen, CheckCircle2 } from "lucide-react";

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({ isOpen, onClose }) => {
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
};
