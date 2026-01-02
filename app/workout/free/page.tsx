"use client";

import { Button } from "@/components/ui/button";
import { ExerciseCard } from "@/components/workout/exercise-card";
import { ExerciseNavigation } from "@/components/workout/exercise-navigation";
import type { Exercise } from "@/components/workout/types";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Dumbbell, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ✅ 고유 ID 생성을 위한 유틸리티 (중복 방지 핵심)
const generateUniqueId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;

export default function FreeWorkoutPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [routineName, setRoutineName] = useState("");
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(
    null
  );

  const currentExercise = exercises[currentExerciseIndex];

  // 1. 상태 변화 감지 및 로컬 스토리지 실시간 저장
  useEffect(() => {
    if (exercises.length > 0) {
      localStorage.setItem(
        "active_workout_exercises",
        JSON.stringify(exercises)
      );
    }
  }, [exercises]);

  // 2. 종목 추가 및 기존 데이터 복구 통합 로직
  useEffect(() => {
    const syncExercises = () => {
      // A. 기존 진행 중인 데이터 로드
      const saved = localStorage.getItem("active_workout_exercises");
      let currentData: Exercise[] = [];
      if (saved) {
        try {
          currentData = JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }

      // B. 새로 선택된 종목들 확인
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

      // 🟢 핵심: 기존 데이터(currentData)와 새 데이터(itemsToAdd)를 합친 최종 결과물 생성
      if (itemsToAdd.length > 0) {
        const finalMerged = [...currentData, ...itemsToAdd];
        setExercises(finalMerged);
        // 스토리지를 즉시 업데이트하여 다음 로직에서 꼬이지 않게 방어
        localStorage.setItem(
          "active_workout_exercises",
          JSON.stringify(finalMerged)
        );
      } else if (currentData.length > 0 && exercises.length === 0) {
        // 추가할 건 없지만 페이지 복구 시점인 경우
        setExercises(currentData);
      }
    };

    syncExercises();

    // 'focus' 이벤트는 페이지로 돌아올 때(뒤로가기 등) 트리거됩니다.
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

  // ✅ 삭제 확인 및 인덱스 방어 로직 (수정됨)
  const confirmRemoveExercise = () => {
    if (deleteConfirmIndex === null) return;

    setExercises((prev) => {
      const newEx = prev.filter((_, i) => i !== deleteConfirmIndex);

      if (newEx.length === 0) {
        setCurrentExerciseIndex(0);
      } else {
        // ✅ 현재 보고 있는 종목을 삭제할 때
        if (deleteConfirmIndex === currentExerciseIndex) {
          const nextIdx =
            deleteConfirmIndex >= newEx.length
              ? newEx.length - 1
              : deleteConfirmIndex;
          setCurrentExerciseIndex(nextIdx);
        }
        // ✅ 현재 보고 있는 종목보다 앞의 종목을 삭제할 때 (인덱스 하나 당김)
        else if (deleteConfirmIndex < currentExerciseIndex) {
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
    router.push("/exercise?from=free_start");
  };

  const handleQuit = () => {
    if (window.confirm("운동을 그만두시겠습니까? 기록은 저장되지 않습니다.")) {
      router.replace("/");
    }
  };

  const handleFinishWorkout = () => setShowSaveDialog(true);

  const handleSaveWorkout = async (saveAsRoutine: boolean) => {
    const workoutData = {
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
      completedAt: new Date().toISOString(),
    };

    console.log("Workout saved:", workoutData);

    if (saveAsRoutine && routineName.trim()) {
      console.log("New routine created:", routineName);
      alert("기록 저장 및 새 루틴이 생성되었습니다!");
    } else {
      alert("운동 기록이 저장되었습니다!");
    }
    router.replace("/");
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#101012] flex flex-col">
      <div className="max-w-lg mx-auto w-full flex flex-col h-full">
        {/* Header */}
        <header className="h-14 px-6 flex items-center justify-between border-b border-white/5 backdrop-blur-xl bg-[#101012]/95 flex-shrink-0">
          <button
            onClick={handleQuit}
            className="text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            그만하기
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold text-white">자유 운동</h1>
          </div>
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
        </header>

        {/* Empty State */}
        {exercises.length === 0 && (
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="text-center max-w-sm">
              <div className="w-24 h-24 rounded-full bg-[#3182F6]/10 flex items-center justify-center mx-auto mb-6">
                <Dumbbell className="w-12 h-12 text-[#3182F6]" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">
                아직 추가된 종목이 없어요
              </h2>
              <Button
                onClick={handleAddExercise}
                className="w-full h-14 bg-[#3182F6] hover:bg-[#2563EB] text-white font-bold rounded-2xl shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" /> 종목 추가
              </Button>
            </div>
          </div>
        )}

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
          </div>
        )}

        {/* Bottom Action Bar */}
        {exercises.length > 0 &&
          currentExerciseIndex < exercises.length - 1 && (
            <div className="flex-shrink-0 border-t border-white/5 bg-[#101012]/95 px-6 py-3">
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

      {/* Delete Confirmation Sheet (바텀 시트 형식) */}
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
                <div className="space-y-3">
                  <Button
                    onClick={confirmRemoveExercise}
                    className="w-full h-14 rounded-2xl bg-red-500 hover:bg-red-600 font-bold"
                  >
                    삭제
                  </Button>
                  <Button
                    onClick={() => setDeleteConfirmIndex(null)}
                    variant="ghost"
                    className="w-full h-12 text-white/40 font-medium"
                  >
                    취소
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
            <h2 className="text-xl font-bold text-white mb-4">운동 완료</h2>
            <div className="mb-6">
              <label className="block text-xs font-bold text-white/40 mb-2 uppercase tracking-widest">
                루틴 이름
              </label>
              <input
                value={routineName}
                onChange={(e) => setRoutineName(e.target.value)}
                placeholder={`${new Date().toLocaleDateString()} 운동`}
                className="w-full bg-white/5 px-4 py-3 text-white rounded-xl outline-none focus:ring-1 focus:ring-[#3182F6]"
              />
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => handleSaveWorkout(true)}
                disabled={!routineName.trim()}
                className="w-full h-14 bg-[#3182F6] font-bold rounded-xl"
              >
                루틴으로 저장하고 완료
              </Button>
              <Button
                onClick={() => handleSaveWorkout(false)}
                variant="ghost"
                className="w-full h-12 text-white/60 font-medium"
              >
                기록만 저장
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
