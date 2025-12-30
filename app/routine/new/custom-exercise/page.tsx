"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type BodyPart =
  | "가슴"
  | "등"
  | "어깨"
  | "하체"
  | "팔"
  | "코어"
  | "유산소"
  | "기타";

const BODY_PARTS: BodyPart[] = [
  "가슴",
  "등",
  "어깨",
  "하체",
  "팔",
  "코어",
  "유산소",
  "기타",
];

export default function CustomExercisePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [exerciseName, setExerciseName] = useState("");
  const [bodyPart, setBodyPart] = useState<BodyPart | "">("");
  const [partDetail, setPartDetail] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // URL 쿼리에서 name 가져와 초기값 설정
  useEffect(() => {
    const nameFromQuery = searchParams.get("name");
    if (nameFromQuery) {
      setExerciseName(nameFromQuery);
    }
    // 자동 포커스
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [searchParams]);

  const handleCancel = () => {
    router.back();
  };

  const handleComplete = () => {
    const trimmedName = exerciseName.trim();
    if (!trimmedName || !bodyPart) return;

    // localStorage에 커스텀 종목 정보 저장
    const customExercise = {
      id: `custom_${Date.now()}`,
      name: trimmedName,
      body_part: bodyPart,
      part_detail: partDetail.trim() || undefined,
      is_custom: true,
      timestamp: Date.now(),
    };

    localStorage.setItem(
      "pending_custom_exercise",
      JSON.stringify(customExercise)
    );

    // 루틴 생성 페이지로 이동 (히스토리를 남기지 않음)
    router.replace("/routine/new");
  };

  // 완료 버튼 활성화 조건: name과 body_part 모두 필수
  const canComplete = exerciseName.trim().length > 0 && bodyPart !== "";

  return (
    <div className="fixed inset-0 z-[110] bg-[#101012] overflow-y-auto">
      <div className="min-h-screen text-white pb-32">
        {/* Header - Type B (List/Action) */}
        <header className="sticky top-0 z-50 bg-[#101012]/90 backdrop-blur-xl border-b border-white/5">
          <div className="h-14 px-6 flex items-center justify-between">
            <button
              onClick={handleCancel}
              className="h-10 px-3 flex items-center text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              취소
            </button>

            <h1 className="text-xl font-bold tracking-tight">
              커스텀 종목 추가
            </h1>

            <button
              onClick={handleComplete}
              disabled={!canComplete}
              className={`h-10 px-3 flex items-center text-sm font-bold transition-colors ${
                canComplete
                  ? "text-[#3182F6] hover:text-[#2563EB]"
                  : "text-white/30 cursor-not-allowed"
              }`}
            >
              완료
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="px-6 pt-8 space-y-8">
          {/* 종목 이름 입력 */}
          <div>
            <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
              종목 이름
            </label>
            <input
              ref={inputRef}
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canComplete) {
                  handleComplete();
                }
              }}
              placeholder="예: 나만의 스트레칭, 맨몸 운동"
              className="w-full bg-[#17171C] px-5 py-5 text-2xl font-bold text-white placeholder:text-white/30 rounded-3xl outline-none focus:bg-white/[0.07] border border-white/5 focus:border-[#3182F6]/30 transition-colors"
            />
          </div>

          {/* 운동 부위 선택 (필수) */}
          <div>
            <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
              운동 부위 <span className="text-[#3182F6]">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {BODY_PARTS.map((part) => {
                const isSelected = bodyPart === part;
                return (
                  <button
                    key={part}
                    onClick={() => setBodyPart(part)}
                    className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
                      isSelected
                        ? "bg-[#3182F6] text-white shadow-lg shadow-[#3182F6]/25"
                        : "bg-[#17171C] text-white/60 hover:bg-white/[0.07] hover:text-white border border-white/5"
                    }`}
                  >
                    {part}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 상세 부위 입력 (선택) */}
          <div>
            <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
              상세 부위{" "}
              <span className="text-white/30 font-normal lowercase">
                (선택)
              </span>
            </label>
            <input
              value={partDetail}
              onChange={(e) => setPartDetail(e.target.value)}
              placeholder="예: 윗가슴, 광배근, 측면 어깨"
              className="w-full bg-[#17171C] px-4 py-3.5 text-base text-white placeholder:text-white/30 rounded-2xl outline-none focus:bg-white/[0.07] border border-white/5 focus:border-[#3182F6]/30 transition-colors"
            />
            <p className="mt-2 text-xs text-white/40 px-1">
              더 구체적인 부위를 입력하면 나중에 찾기 쉬워요
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-gradient-to-br from-[#3182F6]/10 to-[#17171C] rounded-3xl p-6 border border-[#3182F6]/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#3182F6]/20 border border-[#3182F6]/30 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💡</span>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white mb-2">
                  커스텀 종목이란?
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  DB에 등록되지 않은 운동을 임시로 추가할 수 있어요. 추가한
                  종목은 루틴에 바로 반영되며, 세트와 휴식 시간을 자유롭게
                  설정할 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* Example Card */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider px-1">
              예시
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { emoji: "🏃‍♂️", name: "인터벌 러닝", part: "전신" },
                { emoji: "🧘‍♀️", name: "요가", part: "전신" },
                { emoji: "🏋️", name: "농구 연습", part: "전신" },
                { emoji: "💪", name: "홈트레이닝", part: "전신" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#17171C] rounded-2xl px-4 py-3.5 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-sm font-bold text-white">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 ml-7">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3182F6]/60"></div>
                    <span className="text-xs text-white/40">{item.part}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
