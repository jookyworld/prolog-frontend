"use client";

import { Button } from "@/components/ui/button";
import { ExerciseCard } from "@/components/workout/exercise-card";
import { ExerciseNavigation } from "@/components/workout/exercise-navigation";
import type { Exercise } from "@/components/workout/types";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Clock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// ✅ 고유 ID 생성을 위한 유틸리티 (중복 방지 핵심)
const generateUniqueId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;

// ✅ 타이머 포맷 함수 (HH:MM:SS)
const formatElapsedTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
    2,
    "0"
  )}:${String(secs).padStart(2, "0")}`;
};

export default function PlannedWorkoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routineId = searchParams.get("routineId");

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0); // ✅ 운동 경과 시간 (초)
  const [routineTitle, setRoutineTitle] = useState("");
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(
    null
  );
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const currentExercise = exercises[currentExerciseIndex];

  // ✅ 타이머 로직 (1초마다 증가)
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // ✅ 1. 상태 변화 감지 및 로컬 스토리지 실시간 저장
  useEffect(() => {
    if (exercises.length > 0) {
      localStorage.setItem(
        "active_workout_exercises",
        JSON.stringify(exercises)
      );
      localStorage.setItem(
        "active_workout_metadata",
        JSON.stringify({
          routineId,
          routineTitle,
          elapsedTime,
          isPlanned: true,
        })
      );
    }
  }, [exercises, routineId, routineTitle, elapsedTime]);

  // ✅ 2. 루틴 데이터 로드 및 복구 로직 통합
  useEffect(() => {
    const initWorkout = async () => {
      // A. 진행 중인 운동 데이터 확인
      const savedExercises = localStorage.getItem("active_workout_exercises");
      const savedMeta = localStorage.getItem("active_workout_metadata");

      if (savedExercises && savedMeta) {
        try {
          const parsedExercises = JSON.parse(savedExercises);
          const parsedMeta = JSON.parse(savedMeta);

          // 같은 루틴이고 planned 모드라면 복구
          if (parsedMeta.isPlanned && parsedMeta.routineId === routineId) {
            setExercises(parsedExercises);
            setRoutineTitle(parsedMeta.routineTitle);
            setElapsedTime(parsedMeta.elapsedTime || 0);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }

      // B. 루틴 데이터 새로 로드
      if (!routineId) {
        alert("루틴 ID가 없습니다.");
        router.replace("/routine");
        return;
      }

      try {
        // TODO: 실제 API 엔드포인트로 변경
        // const response = await fetch(`/api/routines/${routineId}`);
        // if (!response.ok) throw new Error('Failed to load routine');
        // const data = await response.json();

        // 임시 Mock 데이터 (실제로는 API 응답 사용)
        await new Promise((resolve) => setTimeout(resolve, 300));

        const mockRoutine = {
          id: routineId,
          title: "가슴 & 어깨",
          exercises: [
            {
              id: "1",
              name: "플랫 벤치프레스",
              lastRecord: { weight: 100, reps: 10 },
            },
            {
              id: "2",
              name: "인클라인 덤벨 프레스",
              lastRecord: { weight: 32, reps: 12 },
            },
            {
              id: "3",
              name: "덤벨 숄더 프레스",
              lastRecord: { weight: 24, reps: 10 },
            },
          ],
        };

        // ✅ 고유 ID를 부여하여 초기 exercises 생성
        const initialExercises: Exercise[] = mockRoutine.exercises.map(
          (ex: any) => ({
            id: generateUniqueId(ex.id),
            name: ex.name,
            lastRecord: ex.lastRecord,
            sets: [1, 2, 3].map((n) => ({
              id: generateUniqueId(`s${n}`),
              setNumber: n,
              weight: "",
              reps: "",
              completed: false,
            })),
            is_temporary: false,
          })
        );

        setRoutineTitle(mockRoutine.title);
        setExercises(initialExercises);
        setElapsedTime(0);
      } catch (error) {
        console.error("Failed to load routine:", error);
        alert("루틴을 불러오는데 실패했습니다.");
        router.replace("/routine");
      }
    };

    initWorkout();
  }, [routineId, router]);

  // ✅ 3. 종목 추가 로직 (free 페이지와 동일)
  useEffect(() => {
    const syncExercises = () => {
      const saved = localStorage.getItem("active_workout_exercises");
      let currentData: Exercise[] = [];
      if (saved) {
        try {
          currentData = JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }

      const selected = localStorage.getItem("selected_exercises");
      const pendingCustom = localStorage.getItem("pending_custom_exercise");

      let itemsToAdd: Exercise[] = [];

      if (selected) {
        try {
          const newExs = JSON.parse(selected);
          itemsToAdd = [
            ...itemsToAdd,
            ...newExs.map((ex: any) => ({
              id: generateUniqueId(ex.id),
              name: ex.name,
              lastRecord: { weight: 0, reps: 0 },
              sets: [1, 2, 3].map((n) => ({
                id: generateUniqueId(`s${n}`),
                setNumber: n,
                weight: "",
                reps: "",
                completed: false,
              })),
              is_temporary: true,
            })),
          ];
          localStorage.removeItem("selected_exercises");
        } catch (e) {
          console.error(e);
        }
      }

      if (pendingCustom) {
        try {
          const ex = JSON.parse(pendingCustom);
          itemsToAdd.push({
            id: generateUniqueId("custom"),
            name: ex.name,
            lastRecord: { weight: 0, reps: 0 },
            sets: [1, 2, 3].map((n) => ({
              id: generateUniqueId(`s${n}`),
              setNumber: n,
              weight: "",
              reps: "",
              completed: false,
            })),
            is_temporary: true,
          });
          localStorage.removeItem("pending_custom_exercise");
        } catch (e) {
          console.error(e);
        }
      }

      if (itemsToAdd.length > 0) {
        const finalMerged = [...currentData, ...itemsToAdd];
        setExercises(finalMerged);
        localStorage.setItem(
          "active_workout_exercises",
          JSON.stringify(finalMerged)
        );
      } else if (currentData.length > 0 && exercises.length === 0) {
        setExercises(currentData);
      }
    };

    syncExercises();
    window.addEventListener("focus", syncExercises);
    return () => window.removeEventListener("focus", syncExercises);
  }, []);

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
              id: generateUniqueId(`s${newSetNumber}`),
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

  const removeLastSet = () => {
    setExercises((prev) =>
      prev.map((exercise, idx) => {
        if (idx !== currentExerciseIndex) return exercise;
        if (exercise.sets.length <= 1) return exercise;
        return {
          ...exercise,
          sets: exercise.sets.slice(0, -1),
        };
      })
    );
  };

  const handleRemoveExercise = (index: number) => {
    setDeleteConfirmIndex(index);
  };

  const confirmRemoveExercise = () => {
    if (deleteConfirmIndex === null) return;

    setExercises((prev) => {
      const newEx = prev.filter((_, i) => i !== deleteConfirmIndex);

      if (newEx.length === 0) {
        setCurrentExerciseIndex(0);
      } else {
        if (deleteConfirmIndex === currentExerciseIndex) {
          const nextIdx =
            deleteConfirmIndex >= newEx.length
              ? newEx.length - 1
              : deleteConfirmIndex;
          setCurrentExerciseIndex(nextIdx);
        } else if (deleteConfirmIndex < currentExerciseIndex) {
          setCurrentExerciseIndex(currentExerciseIndex - 1);
        }
      }
      return newEx;
    });
    setDeleteConfirmIndex(null);
  };

  const handleMoveExercise = (direction: -1 | 1) => {
    const newIndex = currentExerciseIndex + direction;
    if (newIndex < 0 || newIndex >= exercises.length) return;

    setExercises((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(currentExerciseIndex, 1);
      copy.splice(newIndex, 0, moved);
      return copy;
    });
    setCurrentExerciseIndex(newIndex);
  };

  const nextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    }
  };

  const handleAddExercise = () => {
    router.push("/exercise?from=planned_start");
  };

  const handleQuit = () => {
    const confirmed = window.confirm(
      "운동을 그만두시겠습니까? 지금까지 기록한 내용은 저장되지 않습니다."
    );
    if (confirmed) {
      localStorage.removeItem("active_workout_exercises");
      localStorage.removeItem("active_workout_metadata");
      localStorage.removeItem("selected_exercises");
      localStorage.removeItem("pending_custom_exercise");
      router.replace("/");
    }
  };

  const handleFinishWorkout = () => setShowSaveDialog(true);

  const handleSaveWorkout = async () => {
    const workoutData = {
      routineId,
      routineTitle,
      exercises: exercises.map((ex) => ({
        id: ex.id,
        name: ex.name,
        sets: ex.sets
          .filter((s) => s.completed)
          .map((s) => ({
            weight: parseFloat(s.weight) || 0,
            reps: parseInt(s.reps) || 0,
          })),
      })),
      elapsedTime, // ✅ 운동 시간 포함
      completedAt: new Date().toISOString(),
      type: "routine", // ✅ 루틴 운동임을 표시
    };

    // TODO: API 호출로 운동 기록 저장
    console.log("Planned Workout saved:", workoutData);

    localStorage.removeItem("active_workout_exercises");
    localStorage.removeItem("active_workout_metadata");
    localStorage.removeItem("selected_exercises");
    localStorage.removeItem("pending_custom_exercise");

    alert("루틴 운동이 완료되었습니다! 🎉");
    router.replace("/");
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#101012] flex flex-col">
      <div className="max-w-lg mx-auto w-full flex flex-col h-full">
        {/* Header */}
        <header className="h-14 px-6 flex items-center border-b border-white/5 backdrop-blur-xl bg-[#101012]/95 flex-shrink-0">
          <div className="w-20">
            <button
              onClick={handleQuit}
              className="text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              그만하기
            </button>
          </div>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold text-white">
              {routineTitle || "루틴 운동"}
            </h1>
          </div>
          <div className="w-20 flex justify-end">
            <button
              onClick={handleFinishWorkout}
              disabled={exercises.length === 0}
              className={`text-sm font-bold transition-colors ${
                exercises.length > 0
                  ? "text-[#3182F6] hover:text-[#2563EB]"
                  : "text-white/30 cursor-not-allowed"
              }`}
            >
              완료
            </button>
          </div>
        </header>

        {/* Exercise Content */}
        {exercises.length > 0 && (
          <div className="flex-1 overflow-y-auto px-6 pt-6 pb-6">
            <ExerciseNavigation
              exercises={exercises}
              currentIndex={currentExerciseIndex}
              onSelectExercise={setCurrentExerciseIndex}
              onAddExercise={handleAddExercise}
              onRemoveExercise={handleRemoveExercise}
            />
            <ExerciseCard
              exercise={currentExercise}
              onWeightChange={handleWeightChange}
              onRepsChange={handleRepsChange}
              onSetComplete={handleSetComplete}
              onAddSet={addSet}
              onRemoveLastSet={removeLastSet}
              onMoveExercise={handleMoveExercise}
            />

            {/* Next Exercise Button */}
            {currentExerciseIndex < exercises.length - 1 && (
              <div className="mt-5">
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-2xl border-white/10 text-white/80 hover:bg-white/5 bg-transparent"
                  onClick={nextExercise}
                >
                  다음 운동 <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Bottom Timer Bar */}
        {exercises.length > 0 && (
          <div className="flex-shrink-0 border-t border-white/5 bg-[#101012]/95 px-6 py-4">
            <div className="flex items-center justify-center gap-3">
              <Clock className="w-5 h-5 text-[#3182F6]" />
              <span className="text-2xl font-mono font-bold text-white">
                {formatElapsedTime(elapsedTime)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Sheet */}
      <AnimatePresence>
        {deleteConfirmIndex !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm"
              onClick={() => setDeleteConfirmIndex(null)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[120] bg-[#17171C] rounded-t-3xl p-6 pb-10"
            >
              <div className="max-w-lg mx-auto w-full text-center">
                <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-6" />
                <h3 className="text-xl font-bold text-white mb-6">
                  "{exercises[deleteConfirmIndex]?.name}" 종목을 삭제할까요?
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => setDeleteConfirmIndex(null)}
                    variant="ghost"
                    className="w-full h-12 text-white/40 font-medium"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={confirmRemoveExercise}
                    className="w-full h-14 rounded-2xl bg-red-500 hover:bg-red-600 font-bold"
                  >
                    삭제
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center px-6">
          <div className="max-w-sm w-full bg-[#17171C] rounded-3xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">
              루틴 운동 완료
            </h2>
            <p className="text-sm text-white/60 mb-6">
              운동 시간: {formatElapsedTime(elapsedTime)}
            </p>
            <div className="space-y-3">
              <Button
                onClick={handleSaveWorkout}
                className="w-full h-12 rounded-2xl bg-[#3182F6] hover:bg-[#2563EB] text-white font-bold"
              >
                운동 기록 저장
              </Button>
              <Button
                onClick={() => setShowSaveDialog(false)}
                variant="ghost"
                className="w-full h-12 rounded-2xl text-white/60 hover:bg-white/5"
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
