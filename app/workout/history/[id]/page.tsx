"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorkoutSessionDetail } from "@/components/workout/types";
import { AlertCircle, ArrowLeft, Check } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// Mock 데이터
const MOCK_SESSIONS: Record<string, WorkoutSessionDetail> = {
  "1": {
    id: "1",
    title: "상체 운동",
    type: "routine",
    routineId: "routine-1",
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    startedAt: new Date(
      Date.now() - 1 * 24 * 60 * 60 * 1000 + 60000,
    ).toISOString(),
    endedAt: new Date(
      Date.now() - 1 * 24 * 60 * 60 * 1000 + 3660000,
    ).toISOString(),
    elapsedTime: 3600,
    note: "좋은 컨디션으로 진행했어. 벤치에서 항상 느끼던 좌우 불균형이 조금 개선되는 느낌이 들었다.",
    isEdited: false,
    updatedAt: null,
    totalSets: 12,
    totalVolume: 2400,
    exercises: [
      {
        id: "ex-1",
        orderNo: 1,
        exerciseId: "bench-press",
        name: "벤치프레스",
        targetRestSeconds: 120,
        sets: [
          {
            id: "s-1",
            setNo: 1,
            weight: 80,
            reps: 8,
            completed: true,
            isWarmup: true,
          },
          { id: "s-2", setNo: 2, weight: 100, reps: 6, completed: true },
          { id: "s-3", setNo: 3, weight: 100, reps: 6, completed: true },
          { id: "s-4", setNo: 4, weight: 100, reps: 5, completed: true },
        ],
      },
      {
        id: "ex-2",
        orderNo: 2,
        exerciseId: "incline-db-press",
        name: "인클라인 덤벨프레스",
        targetRestSeconds: 90,
        sets: [
          { id: "s-5", setNo: 1, weight: 40, reps: 10, completed: true },
          { id: "s-6", setNo: 2, weight: 40, reps: 9, completed: true },
          { id: "s-7", setNo: 3, weight: 40, reps: 8, completed: false },
        ],
      },
      {
        id: "ex-3",
        orderNo: 3,
        exerciseId: "dumbbell-shoulder-press",
        name: "덤벨 숄더프레스",
        targetRestSeconds: 90,
        sets: [
          { id: "s-8", setNo: 1, weight: 35, reps: 10, completed: true },
          { id: "s-9", setNo: 2, weight: 35, reps: 9, completed: true },
          { id: "s-10", setNo: 3, weight: 35, reps: 8, completed: true },
          { id: "s-11", setNo: 4, weight: 32, reps: 10, completed: true },
        ],
      },
    ],
  },
  "2": {
    id: "2",
    title: "자유 운동",
    type: "free",
    routineId: null,
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    startedAt: null,
    endedAt: null,
    elapsedTime: 2400,
    note: "",
    isEdited: true,
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    totalSets: 8,
    totalVolume: 1600,
    exercises: [
      {
        id: "ex-4",
        orderNo: 1,
        name: "스쿼트",
        targetRestSeconds: 180,
        sets: [
          { id: "s-12", setNo: 1, weight: 100, reps: 8, completed: true },
          { id: "s-13", setNo: 2, weight: 100, reps: 8, completed: true },
          { id: "s-14", setNo: 3, weight: 100, reps: 7, completed: true },
        ],
      },
      {
        id: "ex-5",
        orderNo: 2,
        name: "레그 컬",
        targetRestSeconds: 90,
        sets: [
          { id: "s-15", setNo: 1, weight: 60, reps: 12, completed: true },
          { id: "s-16", setNo: 2, weight: 60, reps: 10, completed: true },
          { id: "s-17", setNo: 3, weight: 55, reps: 12, completed: true },
          { id: "s-18", setNo: 4, weight: 55, reps: 10, completed: true },
        ],
      },
    ],
  },
};

const formatElapsedTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const calcExerciseVolume = (
  exerciseSets: (typeof MOCK_SESSIONS)["1"]["exercises"][0]["sets"],
): number => {
  return exerciseSets.reduce((sum, set) => sum + set.weight * set.reps, 0);
};

const calcTotalSets = (
  exercises: WorkoutSessionDetail["exercises"],
): number => {
  return exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
};

const calcTotalVolume = (
  exercises: WorkoutSessionDetail["exercises"],
): number => {
  return exercises.reduce((sum, ex) => sum + calcExerciseVolume(ex.sets), 0);
};

type EditSession = WorkoutSessionDetail & {
  exercises: Array<{
    id: string;
    orderNo: number;
    exerciseId?: string;
    name: string;
    targetRestSeconds?: number;
    sets: Array<{
      id: string;
      setNo: number;
      weight: number;
      reps: number;
      completed: boolean;
      isWarmup?: boolean;
    }>;
  }>;
};

export default function WorkoutHistoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const session = MOCK_SESSIONS[id];

  const [editMode, setEditMode] = useState(false);
  const [editSession, setEditSession] = useState<EditSession | null>(
    session ? { ...session } : null,
  );
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  if (!session) {
    return (
      <div className="min-h-screen bg-[#101012] flex flex-col items-center justify-center px-6 max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-white/30 mb-4" />
        <h2 className="text-lg font-semibold text-white mb-2">
          기록을 찾을 수 없어요
        </h2>
        <p className="text-white/50 text-sm mb-8">
          삭제되었거나 존재하지 않는 기록입니다.
        </p>
        <Button
          onClick={() => router.push("/workout/history")}
          className="bg-[#3182F6] hover:bg-[#2563EB] text-white rounded-full px-6"
        >
          목록으로
        </Button>
      </div>
    );
  }

  const handleEditToggle = () => {
    if (editMode) {
      setShowDiscardConfirm(true);
    } else {
      setEditMode(true);
      setEditSession({ ...session });
    }
  };

  const handleDiscardConfirm = () => {
    setShowDiscardConfirm(false);
    setEditMode(false);
    setEditSession(null);
  };

  const handleSave = () => {
    if (!editSession) return;

    const payload = {
      id: editSession.id,
      note: editSession.note,
      exercises: editSession.exercises.map((ex) => ({
        id: ex.id,
        sets: ex.sets.map((set) => ({
          id: set.id,
          weight: set.weight,
          reps: set.reps,
          completed: set.completed,
        })),
      })),
    };

    console.log("Save workout session:", payload);

    const updatedSession: WorkoutSessionDetail = {
      ...editSession,
      isEdited: true,
      updatedAt: new Date().toISOString(),
    };

    Object.assign(MOCK_SESSIONS[id], updatedSession);

    setEditMode(false);
    setEditSession(null);

    alert("운동 기록이 저장되었습니다!");
  };

  const displaySession = editMode && editSession ? editSession : session;

  return (
    <div className="min-h-screen bg-[#101012]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#101012]/95 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4 max-w-lg mx-auto">
          <button
            onClick={() => {
              if (editMode && editSession) {
                setShowDiscardConfirm(true);
              } else {
                router.back();
              }
            }}
            className="flex items-center justify-center w-8 h-8 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white">기록 상세</h1>
          <div className="flex items-center gap-2">
            {editMode ? (
              <>
                <button
                  onClick={() => setShowDiscardConfirm(true)}
                  className="text-white/60 hover:text-white transition-colors text-sm font-medium"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="text-[#3182F6] hover:text-[#2563EB] transition-colors text-sm font-medium"
                >
                  저장
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="text-[#3182F6] hover:text-[#2563EB] transition-colors text-sm font-medium"
              >
                수정
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Discard Confirm Dialog */}
      <AlertDialog
        open={showDiscardConfirm}
        onOpenChange={setShowDiscardConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>변경사항을 버릴까요?</AlertDialogTitle>
            <AlertDialogDescription>
              수정한 내용이 저장되지 않습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscardConfirm}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Content */}
      <div className="max-w-lg mx-auto px-6 py-6 pb-24">
        {/* Summary Card */}
        <div className="bg-[#17171C] rounded-3xl p-5 mb-6 border border-white/5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">
                {displaySession.title}
              </h2>
            </div>
            <Badge
              className={`${
                displaySession.type === "routine"
                  ? "bg-[#3182F6]/15 text-[#3182F6]"
                  : "bg-white/10 text-white/60"
              } border-0 font-medium whitespace-nowrap`}
            >
              {displaySession.type === "routine" ? "루틴" : "자유"}
            </Badge>
          </div>

          {displaySession.isEdited && displaySession.updatedAt && (
            <div className="text-xs text-white/50 mb-4 flex items-center gap-1">
              <span className="inline-block w-1 h-1 bg-white/50 rounded-full" />
              수정됨 · {formatDateTime(displaySession.updatedAt)}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-white/10">
            <div>
              <div className="text-xs text-white/50 mb-1">완료 날짜</div>
              <div className="text-sm font-medium text-white">
                {formatDate(displaySession.completedAt)}
              </div>
            </div>
            <div>
              <div className="text-xs text-white/50 mb-1">운동 시간</div>
              <div className="text-sm font-medium text-white">
                {formatElapsedTime(displaySession.elapsedTime)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-white/50 mb-1">총 세트</div>
              <div className="text-sm font-medium text-white">
                {calcTotalSets(displaySession.exercises)}개
              </div>
            </div>
            <div>
              <div className="text-xs text-white/50 mb-1">총 볼륨</div>
              <div className="text-sm font-medium text-white">
                {calcTotalVolume(displaySession.exercises).toLocaleString()} kg
              </div>
            </div>
          </div>
        </div>

        {/* Note Card */}
        {editMode && editSession ? (
          <div className="bg-[#17171C] rounded-3xl p-5 mb-6 border border-white/5">
            <label className="text-xs text-white/50 block mb-3">메모</label>
            <textarea
              value={editSession.note || ""}
              onChange={(e) => {
                setEditSession({
                  ...editSession,
                  note: e.target.value,
                });
              }}
              placeholder="오늘 컨디션/메모를 남겨보세요"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#3182F6] resize-none"
              rows={4}
            />
          </div>
        ) : displaySession.note ? (
          <div className="bg-[#17171C] rounded-3xl p-5 mb-6 border border-white/5">
            <div className="text-xs text-white/50 block mb-2">메모</div>
            <p className="text-sm text-white/80 whitespace-pre-wrap">
              {displaySession.note}
            </p>
          </div>
        ) : null}

        {/* Exercises */}
        <div className="space-y-4">
          {displaySession.exercises
            .sort((a, b) => a.orderNo - b.orderNo)
            .map((exercise, exIdx) => {
              const volume = calcExerciseVolume(exercise.sets);
              return (
                <div
                  key={exercise.id}
                  className="bg-[#17171C] rounded-3xl p-5 border border-white/5"
                >
                  {/* Exercise Header */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h3 className="text-base font-semibold text-white">
                      {exercise.name}
                    </h3>
                    <div className="text-sm font-medium text-[#3182F6]">
                      {volume.toLocaleString()} kg
                    </div>
                  </div>

                  {/* Sets - exercise-card grid layout */}
                  <div className="space-y-2">
                    {/* Header Row */}
                    <div className="grid grid-cols-[40px_1fr_1fr_48px] gap-3 items-center px-1">
                      <div className="text-xs text-white/30 text-center">
                        세트
                      </div>
                      <div className="text-xs text-white/30 text-center">
                        kg
                      </div>
                      <div className="text-xs text-white/30 text-center">
                        회
                      </div>
                      <div />
                    </div>

                    {exercise.sets.map((set) => (
                      <div
                        key={set.id}
                        className="grid grid-cols-[40px_1fr_1fr_48px] gap-3 items-center"
                      >
                        {/* Set Number */}
                        <div className="text-center text-sm text-[#3182F6] opacity-50 font-medium">
                          {set.isWarmup ? "W" : set.setNo}
                        </div>

                        {/* Weight */}
                        {editMode && editSession ? (
                          <div className="relative h-12 bg-white/5 border border-white/10 rounded-xl flex items-center px-3 focus-within:border-[#3182F6] focus-within:bg-white/10 transition-colors">
                            <input
                              type="number"
                              value={set.weight}
                              onChange={(e) => {
                                const newExercises = [...editSession.exercises];
                                newExercises[exIdx].sets[
                                  exercise.sets.indexOf(set)
                                ].weight = Number(e.target.value) || 0;
                                setEditSession({
                                  ...editSession,
                                  exercises: newExercises,
                                });
                              }}
                              className="w-full bg-transparent text-sm text-white text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <span className="absolute right-3 text-xs text-white/30">
                              kg
                            </span>
                          </div>
                        ) : (
                          <div className="h-12 bg-white/5 rounded-xl flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {set.weight}
                            </span>
                            <span className="text-xs text-white/30 ml-1">
                              kg
                            </span>
                          </div>
                        )}

                        {/* Reps */}
                        {editMode && editSession ? (
                          <div className="relative h-12 bg-white/5 border border-white/10 rounded-xl flex items-center px-3 focus-within:border-[#3182F6] focus-within:bg-white/10 transition-colors">
                            <input
                              type="number"
                              value={set.reps}
                              onChange={(e) => {
                                const newExercises = [...editSession.exercises];
                                newExercises[exIdx].sets[
                                  exercise.sets.indexOf(set)
                                ].reps = Number(e.target.value) || 0;
                                setEditSession({
                                  ...editSession,
                                  exercises: newExercises,
                                });
                              }}
                              className="w-full bg-transparent text-sm text-white text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <span className="absolute right-3 text-xs text-white/30">
                              회
                            </span>
                          </div>
                        ) : (
                          <div className="h-12 bg-white/5 rounded-xl flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {set.reps}
                            </span>
                            <span className="text-xs text-white/30 ml-1">
                              회
                            </span>
                          </div>
                        )}

                        {/* Complete Button */}
                        {editMode && editSession ? (
                          <button
                            onClick={() => {
                              const newExercises = [...editSession.exercises];
                              newExercises[exIdx].sets[
                                exercise.sets.indexOf(set)
                              ].completed = !set.completed;
                              setEditSession({
                                ...editSession,
                                exercises: newExercises,
                              });
                            }}
                            className={`h-12 w-12 rounded-xl border flex items-center justify-center transition-all flex-shrink-0 ${
                              set.completed
                                ? "bg-[#3182F6] border-[#3182F6] text-white"
                                : "bg-transparent border-white/10 text-white/40 hover:bg-white/5"
                            }`}
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        ) : (
                          <div
                            className={`h-12 w-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${
                              set.completed
                                ? "bg-[#3182F6] border-[#3182F6] text-white"
                                : "bg-transparent border-white/10 text-white/40"
                            }`}
                          >
                            <Check className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
