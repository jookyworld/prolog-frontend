"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, Pause, Play, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Set {
  id: string;
  setNumber: number;
  weight: string;
  reps: string;
  completed: boolean;
}

interface Exercise {
  id: string;
  name: string;
  lastRecord: {
    weight: number;
    reps: number;
  };
  sets: Set[];
}

export default function WorkoutPage() {
  const router = useRouter();
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: "1",
      name: "플랫 벤치프레스",
      lastRecord: { weight: 100, reps: 10 },
      sets: [
        { id: "s1", setNumber: 1, weight: "", reps: "", completed: false },
        { id: "s2", setNumber: 2, weight: "", reps: "", completed: false },
        { id: "s3", setNumber: 3, weight: "", reps: "", completed: false },
      ],
    },
    {
      id: "2",
      name: "인클라인 덤벨 프레스",
      lastRecord: { weight: 32, reps: 12 },
      sets: [
        { id: "s1", setNumber: 1, weight: "", reps: "", completed: false },
        { id: "s2", setNumber: 2, weight: "", reps: "", completed: false },
        { id: "s3", setNumber: 3, weight: "", reps: "", completed: false },
      ],
    },
  ]);

  const currentExercise = exercises[currentExerciseIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isRunning) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSetComplete = (setId: string) => {
    setExercises((prev) =>
      prev.map((exercise, idx) => {
        if (idx !== currentExerciseIndex) return exercise;
        return {
          ...exercise,
          sets: exercise.sets.map((set) =>
            set.id === setId ? { ...set, completed: !set.completed } : set
          ),
        };
      })
    );
  };

  const handleWeightChange = (setId: string, value: string) => {
    setExercises((prev) =>
      prev.map((exercise, idx) => {
        if (idx !== currentExerciseIndex) return exercise;
        return {
          ...exercise,
          sets: exercise.sets.map((set) =>
            set.id === setId ? { ...set, weight: value } : set
          ),
        };
      })
    );
  };

  const handleRepsChange = (setId: string, value: string) => {
    setExercises((prev) =>
      prev.map((exercise, idx) => {
        if (idx !== currentExerciseIndex) return exercise;
        return {
          ...exercise,
          sets: exercise.sets.map((set) =>
            set.id === setId ? { ...set, reps: value } : set
          ),
        };
      })
    );
  };

  const addSet = () => {
    setExercises((prev) =>
      prev.map((exercise, idx) => {
        if (idx !== currentExerciseIndex) return exercise;
        const newSetNumber = exercise.sets.length + 1;
        return {
          ...exercise,
          sets: [
            ...exercise.sets,
            {
              id: `s${newSetNumber}`,
              setNumber: newSetNumber,
              weight: "",
              reps: "",
              completed: false,
            },
          ],
        };
      })
    );
  };

  const nextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#101012] text-white">
      {/* Header */}
      <header className="sticky top-0 bg-[#101012]/95 backdrop-blur-lg border-b border-white/5 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <button
            onClick={() => router.push("/")}
            className="p-2.5 hover:bg-white/5 rounded-xl transition-colors"
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold">가슴 & 어깨</h1>
            <div className="flex items-center justify-center gap-2 mt-1">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                aria-label="타이머 토글"
              >
                {isRunning ? (
                  <Pause className="w-4 h-4 text-[#3182F6]" />
                ) : (
                  <Play className="w-4 h-4 text-[#3182F6]" />
                )}
              </button>
              <p className="text-2xl font-mono font-bold text-[#3182F6]">
                {formatTime(timer)}
              </p>
            </div>
          </div>

          <div className="w-10" />
        </div>
      </header>

      {/* ✅ 하단 바(축소됨) + BottomNav 고려 */}
      <div className="px-6 pt-6 pb-[180px]">
        {/* Exercise Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
          {exercises.map((exercise, idx) => (
            <button
              key={exercise.id}
              onClick={() => setCurrentExerciseIndex(idx)}
              className={`min-w-fit px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                idx === currentExerciseIndex
                  ? "bg-[#3182F6] text-white"
                  : "bg-[#17171C] text-white/60 hover:text-white"
              }`}
            >
              {exercise.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentExercise.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.18 }}
            className="space-y-5"
          >
            {/* Current Exercise Header */}
            <div className="bg-[#17171C] rounded-3xl p-6">
              <h2 className="text-2xl font-bold mb-3">
                {currentExercise.name}
              </h2>

              {/* Last Record */}
              <div className="bg-[#101012] rounded-2xl p-4 border border-white/5">
                <p className="text-xs text-white/40 mb-2">
                  지난 기록 (Last Record)
                </p>
                <p className="text-sm text-white/70">
                  1세트{" "}
                  <span className="text-white font-bold">
                    {currentExercise.lastRecord.weight}kg
                  </span>{" "}
                  ×{" "}
                  <span className="text-white font-bold">
                    {currentExercise.lastRecord.reps}회
                  </span>
                </p>
              </div>
            </div>

            {/* Sets Table */}
            <div className="bg-[#17171C] rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white/60">세트 기록</h3>
                <button
                  onClick={addSet}
                  className="text-sm font-bold text-[#3182F6] hover:opacity-90 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  세트 추가
                </button>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-[40px_minmax(70px,1fr)_minmax(70px,1fr)_44px] gap-2 mb-2 px-1">
                <div className="text-[11px] text-white/40 font-medium text-center">
                  세트
                </div>
                <div className="text-[11px] text-white/40 font-medium text-center">
                  kg
                </div>
                <div className="text-[11px] text-white/40 font-medium text-center">
                  reps
                </div>
                <div className="text-[11px] text-white/40 font-medium text-center">
                  ✓
                </div>
              </div>

              {/* Sets */}
              <div className="space-y-2">
                {currentExercise.sets.map((set) => (
                  <motion.div
                    key={`${currentExercise.id}-${set.id}`}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`grid grid-cols-[40px_minmax(70px,1fr)_minmax(70px,1fr)_44px] gap-2 items-center rounded-2xl px-3 py-2 border transition-all ${
                      set.completed
                        ? "bg-[#3182F6]/10 border-[#3182F6]/60"
                        : "bg-[#101012] border-white/5"
                    }`}
                  >
                    {/* Set Number */}
                    <div className="text-center">
                      <span
                        className={`text-base font-bold ${
                          set.completed ? "text-[#3182F6]" : "text-white/60"
                        }`}
                      >
                        {set.setNumber}
                      </span>
                    </div>

                    {/* Weight Input */}
                    <input
                      type="number"
                      inputMode="decimal"
                      value={set.weight}
                      onChange={(e) =>
                        handleWeightChange(set.id, e.target.value)
                      }
                      placeholder={currentExercise.lastRecord.weight.toString()}
                      className="bg-white/5 border border-white/10 rounded-xl h-12 text-center text-base font-bold text-white placeholder:text-white/30 focus:outline-none focus:border-[#3182F6] focus:bg-white/10 transition-all"
                    />

                    {/* Reps Input */}
                    <input
                      type="number"
                      inputMode="numeric"
                      value={set.reps}
                      onChange={(e) => handleRepsChange(set.id, e.target.value)}
                      placeholder={currentExercise.lastRecord.reps.toString()}
                      className="bg-white/5 border border-white/10 rounded-xl h-12 text-center text-base font-bold text-white placeholder:text-white/30 focus:outline-none focus:border-[#3182F6] focus:bg-white/10 transition-all"
                    />

                    {/* Complete Toggle */}
                    <button
                      onClick={() => handleSetComplete(set.id)}
                      className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all border ${
                        set.completed
                          ? "bg-[#3182F6] border-[#3182F6] text-white"
                          : "bg-transparent border-white/10 text-white/40 hover:bg-white/5 hover:text-white"
                      }`}
                      aria-label="세트 완료"
                    >
                      <Check className="w-5 h-5" strokeWidth={3} />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* (기존 큰 Add Set Button 제거됨) */}
            </div>

            {/* Next Exercise Button */}
            {currentExerciseIndex < exercises.length - 1 && (
              <Button
                onClick={nextExercise}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-medium rounded-2xl h-12 border border-white/10"
              >
                다음 운동
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ✅ 하단 액션바: 한 줄로 축소 + BottomNav 위로 */}
      <div className="fixed left-0 right-0 bottom-24 bg-[#101012]/95 backdrop-blur-lg border-t border-white/5 px-6 py-3 z-40">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-12 rounded-2xl border-white/10 text-white/80 hover:bg-white/5 bg-transparent"
            onClick={() => console.log("[v0] add exercise")}
          >
            <Plus className="w-5 h-5 mr-2" />
            종목 추가
          </Button>
          <Button
            onClick={() => router.push("/")}
            className="h-12 rounded-2xl bg-[#3182F6] hover:bg-[#2563EB] text-white font-bold shadow-lg shadow-[#3182F6]/25"
          >
            운동 완료
          </Button>
        </div>
      </div>
    </div>
  );
}
