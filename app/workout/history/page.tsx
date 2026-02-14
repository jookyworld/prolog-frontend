"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorkoutSession } from "@/components/workout/types";
import { Dumbbell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

// Mock 데이터
const MOCK_WORKOUT_SESSIONS: WorkoutSession[] = [
  {
    id: "1",
    title: "상체 운동",
    type: "routine",
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    elapsedTime: 3600,
    totalSets: 12,
    totalVolume: 2400,
    exercises: [
      { id: "1", name: "벤치프레스" },
      { id: "2", name: "인클라인 덤벨프레스" },
      { id: "3", name: "덤벨 숄더프레스" },
    ],
    isModified: false,
  },
  {
    id: "2",
    title: "자유 운동",
    type: "free",
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    elapsedTime: 2400,
    totalSets: 8,
    totalVolume: 1600,
    exercises: [
      { id: "4", name: "스쿼트" },
      { id: "5", name: "레그프레스" },
      { id: "6", name: "렉 컬" },
    ],
    isModified: true,
  },
  {
    id: "3",
    title: "하체 운동",
    type: "routine",
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    elapsedTime: 3300,
    totalSets: 10,
    totalVolume: 2800,
    exercises: [
      { id: "7", name: "바벨 스쿼트" },
      { id: "8", name: "루마니안 데드리프트" },
      { id: "9", name: "레그 익스텐션" },
      { id: "10", name: "렉 컬" },
    ],
    isModified: false,
  },
  {
    id: "4",
    title: "등 운동",
    type: "routine",
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    elapsedTime: 3240,
    totalSets: 11,
    totalVolume: 3200,
    exercises: [
      { id: "11", name: "데드리프트" },
      { id: "12", name: "풀업" },
      { id: "13", name: "바벨 로우" },
      { id: "14", name: "시티드 로우" },
    ],
    isModified: false,
  },
  {
    id: "5",
    title: "자유 운동",
    type: "free",
    completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    elapsedTime: 1800,
    totalSets: 6,
    totalVolume: 800,
    exercises: [
      { id: "15", name: "덤벨 플라이" },
      { id: "16", name: "체스트 딥" },
    ],
    isModified: false,
  },
  {
    id: "6",
    title: "어깨 운동",
    type: "routine",
    completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    elapsedTime: 2700,
    totalSets: 9,
    totalVolume: 1200,
    exercises: [
      { id: "17", name: "밀리터리 프레스" },
      { id: "18", name: "레터럴 레이즈" },
      { id: "19", name: "리어 플라이" },
    ],
    isModified: false,
  },
];

type TypeFilter = "all" | "routine" | "free";

export default function WorkoutHistoryPage() {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const filteredSessions = useMemo(() => {
    let filtered = [...MOCK_WORKOUT_SESSIONS];

    if (typeFilter !== "all") {
      filtered = filtered.filter((session) => session.type === typeFilter);
    }

    filtered.sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );

    return filtered;
  }, [typeFilter]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}시간 ${minutes}분`;
    return `${minutes}분`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) return "오늘";
    if (diffDays === 1) return "어제";
    if (diffDays < 7) return `${diffDays}일 전`;

    return date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
    });
  };

  const handleCardClick = (id: string) => {
    router.push(`/workout/history/${id}`);
  };

  const typeFilters: { value: TypeFilter; label: string }[] = [
    { value: "all", label: "전체" },
    { value: "routine", label: "루틴" },
    { value: "free", label: "자유 운동" },
  ];

  return (
    <div className="min-h-screen bg-[#101012]">
      {/* Header - Type B (List/Action) */}
      <header className="sticky top-0 z-50 bg-[#101012]/90 backdrop-blur-xl">
        <div className="h-14 px-6 flex items-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            운동 기록
          </h1>
        </div>
      </header>

      {/* Filter Chips - 루틴 페이지 스타일 */}
      <div className="sticky top-14 z-40 bg-[#101012]/90 backdrop-blur-xl border-b border-white/5">
        <div className="px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {typeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setTypeFilter(filter.value)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${
                typeFilter === filter.value
                  ? "bg-[#3182F6] text-white border-transparent shadow-lg shadow-[#3182F6]/25"
                  : "bg-[#17171C] text-white/70 border-white/10 hover:text-white hover:border-white/20"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-6 py-6 pb-32">
        {filteredSessions.length === 0 ? (
          /* Empty State - 루틴 페이지 스타일 */
          <div className="bg-[#17171C] rounded-3xl p-8 border border-white/5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#3182F6]/15 border border-[#3182F6]/20 flex items-center justify-center flex-shrink-0">
                <Dumbbell className="w-6 h-6 text-[#3182F6]" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-white mb-1">
                  아직 운동 기록이 없어요
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  운동을 시작하면 여기에 기록이 쌓여요.
                  <br />
                  지금 바로 첫 운동을 시작해보세요!
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/workout/free")}
              className="w-full mt-6 bg-[#3182F6] hover:bg-[#2563EB] text-white rounded-2xl h-12 font-medium shadow-lg shadow-[#3182F6]/25"
            >
              운동 시작하기
            </Button>
          </div>
        ) : (
          /* Session Cards */
          <div className="space-y-3">
            {filteredSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => handleCardClick(session.id)}
                className="w-full text-left bg-[#17171C] rounded-3xl p-5 hover:bg-[#1F1F24] transition-colors border border-white/5 hover:border-white/10"
              >
                {/* Date */}
                <div className="text-xs text-white/40 mb-2">
                  {formatDate(session.completedAt)}
                </div>

                {/* Title + Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-base font-semibold text-white">
                    {session.title}
                  </h3>
                  <Badge
                    className={`${
                      session.type === "routine"
                        ? "bg-[#3182F6]/15 text-[#3182F6]"
                        : "bg-white/10 text-white/60"
                    } border-0 font-medium text-xs`}
                  >
                    {session.type === "routine" ? "루틴" : "자유"}
                  </Badge>
                  {session.isModified && (
                    <Badge
                      variant="secondary"
                      className="bg-white/10 text-white/50 border-0 text-xs"
                    >
                      수정됨
                    </Badge>
                  )}
                </div>

                {/* Summary line */}
                <div className="text-sm text-white/60 mb-3">
                  {formatTime(session.elapsedTime)} · {session.totalSets}세트 ·{" "}
                  {session.totalVolume.toLocaleString()}kg
                </div>

                {/* Exercise tags */}
                <div className="flex flex-wrap gap-1.5">
                  {session.exercises.map((exercise) => (
                    <span
                      key={exercise.id}
                      className="px-2.5 py-1 bg-white/5 rounded-lg text-xs text-white/50"
                    >
                      {exercise.name}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
