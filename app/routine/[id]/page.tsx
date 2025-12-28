"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Dumbbell, Heart, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RoutineDetailPage() {
  const router = useRouter();

  // Mock data - 실제로는 API에서 가져올 데이터
  const routineData = {
    author: "주권영",
    title: "초고강도 5분할 등 루틴",
    description:
      "등 운동의 핵심은 수축과 이완입니다. 각 동작마다 1초 멈춤을 꼭 지켜주세요. 무게보다는 정확한 자세가 중요합니다.",
    likes: 342,
    usageCount: 1250,
    exercises: [
      {
        id: 1,
        name: "랫풀다운",
        sets: 4,
        restTime: 60,
        lastRecord: { weight: 120, reps: 8 },
      },
      {
        id: 2,
        name: "시티드 로우",
        sets: 4,
        restTime: 60,
        lastRecord: { weight: 95, reps: 10 },
      },
      {
        id: 3,
        name: "덤벨 로우",
        sets: 3,
        restTime: 45,
        lastRecord: { weight: 40, reps: 12 },
      },
      {
        id: 4,
        name: "풀업",
        sets: 3,
        restTime: 90,
        lastRecord: { weight: 0, reps: 15 },
      },
      {
        id: 5,
        name: "페이스 풀",
        sets: 3,
        restTime: 45,
        lastRecord: { weight: 30, reps: 15 },
      },
      {
        id: 6,
        name: "바벨 컬",
        sets: 4,
        restTime: 60,
        lastRecord: { weight: 40, reps: 10 },
      },
      {
        id: 7,
        name: "해머 컬",
        sets: 3,
        restTime: 45,
        lastRecord: { weight: 18, reps: 12 },
      },
      {
        id: 8,
        name: "케이블 컬",
        sets: 3,
        restTime: 45,
        lastRecord: { weight: 25, reps: 15 },
      },
    ],
  };

  const handleStartRoutine = () => {
    console.log("[v0] Starting routine");
    router.push("/workout");
  };

  return (
    <div className="min-h-screen bg-[#101012] text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#101012]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4">
          <button
            onClick={() => router.back()}
            className="p-3 hover:bg-white/5 rounded-xl transition-colors"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">루틴 상세</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* ✅ Bottom 버튼 + BottomNav를 고려해 충분히 padding 확보 */}
      <div className="px-6 pt-6 space-y-5 pb-[220px]">
        {/* Author & Title Section */}
        <div className="bg-[#17171C] rounded-3xl p-7">
          <div className="mb-4">
            <p className="text-xs text-white/60 mb-2">
              {routineData.author}님의 루틴
            </p>
            <h2 className="text-2xl font-bold mb-3 leading-tight">
              {routineData.title}
            </h2>
            <p className="text-base text-white/80 leading-relaxed">
              {routineData.description}
            </p>
          </div>

          {/* Engagement Metrics */}
          <div className="flex items-center gap-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 rounded-full">
              <Heart className="w-4 h-4 text-[#FF4E83]" fill="#FF4E83" />
              <span className="text-sm font-bold">{routineData.likes}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#3182F6]/10 rounded-full">
              <Users className="w-4 h-4 text-[#3182F6]" />
              <span className="text-sm font-bold text-[#3182F6]">
                {routineData.usageCount}명
              </span>
              <span className="text-sm text-white/60">가져감</span>
            </div>
          </div>
        </div>

        {/* Exercise List */}
        <div>
          <h3 className="text-lg font-bold mb-4 px-1">
            운동 종목 ({routineData.exercises.length}개)
          </h3>
          <div className="space-y-3">
            {routineData.exercises.map((exercise, index) => (
              <div key={exercise.id} className="bg-[#17171C] rounded-3xl p-6">
                {/* Exercise Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#3182F6]/10 text-[#3182F6] font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-2">
                        {exercise.name}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-white/60">
                        <div className="flex items-center gap-1.5">
                          <Dumbbell className="w-4 h-4" />
                          <span>{exercise.sets}세트</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>{exercise.restTime}초 휴식</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Author's Last Record - 핵심 기능 */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <p className="text-xs text-white/50 mb-2">
                    작성자의 최고 기록
                  </p>
                  <div className="flex items-baseline gap-2">
                    {exercise.lastRecord.weight > 0 && (
                      <>
                        <span className="text-2xl font-bold text-[#45FFBC]">
                          {exercise.lastRecord.weight}kg
                        </span>
                        <span className="text-white/60">×</span>
                      </>
                    )}
                    <span className="text-2xl font-bold text-[#45FFBC]">
                      {exercise.lastRecord.reps}회
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-[#3182F6]/10 to-[#45FFBC]/10 rounded-3xl p-6 border border-[#3182F6]/20">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#3182F6] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <h4 className="font-bold mb-1">루틴 가져가기 팁</h4>
              <p className="text-sm text-white/70 leading-relaxed">
                이 루틴을 시작하면 작성자의 기록을 참고하며 운동할 수 있어요.
                본인의 체력에 맞게 무게를 조절해주세요.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ BottomNav가 있으니, 버튼은 BottomNav 위로 띄움 */}
      <div className="fixed left-0 right-0 bottom-24 bg-gradient-to-t from-[#101012] via-[#101012] to-transparent pt-6 pb-8 px-6 z-40">
        <Button
          onClick={handleStartRoutine}
          className="w-full h-16 bg-[#3182F6] hover:bg-[#2563EB] text-white font-bold rounded-full text-lg shadow-xl shadow-[#3182F6]/30 transition-all"
        >
          이 루틴으로 바로 시작하기
        </Button>
      </div>
    </div>
  );
}
