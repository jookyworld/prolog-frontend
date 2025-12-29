"use client";

import {
  ChevronDown,
  ChevronUp,
  Dumbbell,
  GripVertical,
  Plus,
  Timer,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

type RoutineExerciseDraft = {
  id: string;
  name: string;
  target_sets: number;
  rest_seconds: number;
};

type RoutineDraft = {
  id: string;
  title: string;
  description: string;
  exercises: RoutineExerciseDraft[];
};

function uid(prefix = "id") {
  return `${prefix}_${Math.random()
    .toString(16)
    .slice(2)}_${Date.now().toString(16)}`;
}

const REST_PRESETS = [30, 60, 90] as const;

export default function RoutineCreatePage() {
  const [routine, setRoutine] = useState<RoutineDraft>(() => ({
    id: uid("routine"),
    title: "",
    description: "",
    exercises: [
      { id: uid("ex"), name: "벤치프레스", target_sets: 4, rest_seconds: 90 },
      {
        id: uid("ex"),
        name: "케이블 플라이",
        target_sets: 3,
        rest_seconds: 60,
      },
    ],
  }));

  const [newExerciseName, setNewExerciseName] = useState("");

  const canSave = useMemo(() => {
    const hasTitle = routine.title.trim().length > 0;
    const hasExercises = routine.exercises.length > 0;
    return hasTitle && hasExercises;
  }, [routine.title, routine.exercises.length]);

  const updateTitle = (v: string) => setRoutine((p) => ({ ...p, title: v }));
  const updateDescription = (v: string) =>
    setRoutine((p) => ({ ...p, description: v }));

  const addExercise = () => {
    const name = newExerciseName.trim();
    if (!name) return;

    setRoutine((p) => ({
      ...p,
      exercises: [
        ...p.exercises,
        { id: uid("ex"), name, target_sets: 3, rest_seconds: 60 },
      ],
    }));
    setNewExerciseName("");
  };

  const removeExercise = (exerciseId: string) => {
    setRoutine((p) => ({
      ...p,
      exercises: p.exercises.filter((ex) => ex.id !== exerciseId),
    }));
  };

  const changeTargetSets = (exerciseId: string, next: number) => {
    const clamped = Math.max(1, Math.min(20, next));
    setRoutine((p) => ({
      ...p,
      exercises: p.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, target_sets: clamped } : ex
      ),
    }));
  };

  const setRestSeconds = (exerciseId: string, seconds: number) => {
    const clamped = Math.max(0, Math.min(600, seconds));
    setRoutine((p) => ({
      ...p,
      exercises: p.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, rest_seconds: clamped } : ex
      ),
    }));
  };

  const moveExercise = (exerciseId: string, direction: -1 | 1) => {
    setRoutine((p) => {
      const idx = p.exercises.findIndex((e) => e.id === exerciseId);
      if (idx < 0) return p;

      const nextIdx = idx + direction;
      if (nextIdx < 0 || nextIdx >= p.exercises.length) return p;

      const copy = [...p.exercises];
      const [picked] = copy.splice(idx, 1);
      copy.splice(nextIdx, 0, picked);
      return { ...p, exercises: copy };
    });
  };

  const onSave = () => {
    const payload = {
      id: routine.id,
      title: routine.title.trim(),
      description: routine.description.trim(),
      exercises: routine.exercises.map((ex, idx) => ({
        order_no: idx + 1,
        id: ex.id,
        name: ex.name,
        target_sets: ex.target_sets,
        rest_seconds: ex.rest_seconds,
      })),
    };

    console.log("SAVE ROUTINE PAYLOAD:", payload);
    alert("저장 (콘솔 확인)");
  };

  const onBack = () => {
    history.back();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#101012] overflow-y-auto">
      <div className="max-w-lg mx-auto min-h-screen text-white pb-32">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#101012]/90 backdrop-blur-xl border-b border-white/5">
          <div className="px-6 py-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">루틴 생성</h1>

              <div className="flex items-center gap-4">
                <button
                  onClick={onBack}
                  className="text-sm font-medium text-white/60 hover:text-white transition-colors"
                  aria-label="취소"
                >
                  취소
                </button>
                <button
                  onClick={onSave}
                  disabled={!canSave}
                  className={`text-sm font-bold transition-colors ${
                    canSave
                      ? "text-[#3182F6] hover:text-[#2563EB]"
                      : "text-white/30 cursor-not-allowed"
                  }`}
                  aria-label="저장"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Form */}
        <div className="px-6 pt-6 space-y-6">
          {/* Routine Title & Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/60 mb-2">
                루틴 이름
              </label>
              <input
                value={routine.title}
                onChange={(e) => updateTitle(e.target.value)}
                placeholder="루틴 이름을 입력해주세요 (예: 월요일 가슴/어깨)"
                className="w-full bg-[#17171C] px-4 py-3.5 text-base font-bold text-white placeholder:text-white/30 rounded-2xl outline-none focus:bg-white/[0.07] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/60 mb-2">
                루틴 설명 (선택)
              </label>
              <textarea
                value={routine.description}
                onChange={(e) => updateDescription(e.target.value)}
                placeholder="루틴에 대한 짧은 메모를 남겨주세요"
                rows={3}
                className="w-full bg-[#17171C] px-4 py-3 text-sm text-white placeholder:text-white/30 rounded-2xl outline-none focus:bg-white/[0.07] transition-colors resize-none"
              />
            </div>
          </div>

          {/* Exercise List Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <Dumbbell className="w-5 h-5 text-white/60" />
              <span className="text-base font-bold text-white/80">
                종목 리스트
              </span>
            </div>
            <span className="text-sm text-white/40">
              {routine.exercises.length}개
            </span>
          </div>

          {/* Exercise Cards */}
          <div className="space-y-3">
            {routine.exercises.map((ex, index) => (
              <div
                key={ex.id}
                className="bg-[#17171C] rounded-3xl p-4 border border-white/5"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <GripVertical
                      className="w-4 h-4 text-white/40 flex-shrink-0"
                      aria-hidden
                    />
                    <h3 className="text-base font-bold text-white truncate">
                      {ex.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => moveExercise(ex.id, -1)}
                      disabled={index === 0}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-white/60 disabled:opacity-30 transition-colors"
                      aria-label="위로 이동"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveExercise(ex.id, 1)}
                      disabled={index === routine.exercises.length - 1}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-white/60 disabled:opacity-30 transition-colors"
                      aria-label="아래로 이동"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => removeExercise(ex.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-red-400/60 hover:text-red-400 transition-colors"
                      aria-label="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Controls: Grid Layout */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Target sets */}
                  <div className="bg-white/[0.03] rounded-2xl p-3">
                    <div className="text-xs font-bold text-white/50 mb-2">
                      목표 세트
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() =>
                          changeTargetSets(ex.id, ex.target_sets - 1)
                        }
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#3182F6]/10 text-[#3182F6] transition-colors text-xl font-bold"
                        aria-label="세트 감소"
                      >
                        −
                      </button>

                      <div className="text-center">
                        <div className="text-xl font-bold text-white">
                          {ex.target_sets}
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          changeTargetSets(ex.id, ex.target_sets + 1)
                        }
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#3182F6]/10 text-[#3182F6] transition-colors text-xl font-bold"
                        aria-label="세트 증가"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Rest seconds */}
                  <div className="bg-white/[0.03] rounded-2xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-bold text-white/50">
                        휴식
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-white/50">
                        <Timer className="w-3 h-3" />
                        {ex.rest_seconds}s
                      </div>
                    </div>

                    <div className="flex gap-1.5">
                      {REST_PRESETS.map((s) => {
                        const active = ex.rest_seconds === s;
                        return (
                          <button
                            key={s}
                            onClick={() => setRestSeconds(ex.id, s)}
                            className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-colors ${
                              active
                                ? "bg-[#3182F6] text-white"
                                : "bg-white/5 text-white/50 hover:bg-white/10"
                            }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Exercise */}
          <div className="bg-[#17171C] rounded-3xl p-5 border border-white/5">
            <div className="text-sm font-bold text-white/70 mb-3">
              종목 추가
            </div>

            <div className="flex gap-2 min-w-0">
              <input
                value={newExerciseName}
                onChange={(e) => setNewExerciseName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addExercise();
                }}
                placeholder="예: 스쿼트, 풀업, 인클라인 덤벨프레스"
                className="flex-1 min-w-0 bg-white/5 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-white/30 outline-none focus:bg-white/[0.07] transition-colors"
              />
              <button
                onClick={addExercise}
                className="px-4 py-3 rounded-xl bg-[#3182F6] hover:bg-[#2563EB] text-white text-sm font-bold transition-colors flex items-center gap-1.5 flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                추가
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
