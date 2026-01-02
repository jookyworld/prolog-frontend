"use client";

import { Button } from "@/components/ui/button";
import { ExerciseCard } from "@/components/workout/exercise-card";
import { ExerciseNavigation } from "@/components/workout/exercise-navigation";
import type { Exercise } from "@/components/workout/types";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Dumbbell, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

  // 초기 마운트 시 localStorage에서 선택된 종목 확인
  useEffect(() => {
    const selectedExercises = localStorage.getItem("selected_exercises");

    if (selectedExercises) {
      try {
        const newExercises = JSON.parse(selectedExercises);
        const exercisesToAdd = newExercises.map(
          (ex: { id: string; name: string }) => ({
            id: ex.id,
            name: ex.name,
            lastRecord: { weight: 0, reps: 0 },
            sets: [
              {
                id: "s1",
                setNumber: 1,
                weight: "",
                reps: "",
                completed: false,
              },
              {
                id: "s2",
                setNumber: 2,
                weight: "",
                reps: "",
                completed: false,
              },
              {
                id: "s3",
                setNumber: 3,
                weight: "",
                reps: "",
                completed: false,
              },
            ],
            is_temporary: true,
          })
        );
        setExercises(exercisesToAdd);
        localStorage.removeItem("selected_exercises");
      } catch (error) {
        console.error("Failed to parse selected exercises:", error);
        localStorage.removeItem("selected_exercises");
      }
    }
  }, []);

  // 실시간 종목 추가 (운동 중 추가 종목)
  useEffect(() => {
    const handleStorageUpdate = () => {
      const selectedExercises = localStorage.getItem("selected_exercises");
      if (selectedExercises) {
        try {
          const newExercises = JSON.parse(selectedExercises);
          const exercisesToAdd = newExercises.map(
            (ex: { id: string; name: string }) => ({
              id: ex.id,
              name: ex.name,
              lastRecord: { weight: 0, reps: 0 },
              sets: [
                {
                  id: "s1",
                  setNumber: 1,
                  weight: "",
                  reps: "",
                  completed: false,
                },
                {
                  id: "s2",
                  setNumber: 2,
                  weight: "",
                  reps: "",
                  completed: false,
                },
                {
                  id: "s3",
                  setNumber: 3,
                  weight: "",
                  reps: "",
                  completed: false,
                },
              ],
              is_temporary: true,
            })
          );
          setExercises((prev) => [...prev, ...exercisesToAdd]);
          localStorage.removeItem("selected_exercises");
        } catch (error) {
          console.error("Failed to parse selected exercises:", error);
          localStorage.removeItem("selected_exercises");
        }
      }
    };

    window.addEventListener("storage", handleStorageUpdate);
    return () => window.removeEventListener("storage", handleStorageUpdate);
  }, []);

  // 빈 상태일 때 자동으로 종목 선택 페이지로 이동하지 않음
  // useEffect 제거됨

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
      // 현재 보던 종목이 삭제되면 인덱스 조정
      if (deleteConfirmIndex === currentExerciseIndex) {
        if (newEx.length === 0) {
          setCurrentExerciseIndex(0);
        } else if (deleteConfirmIndex >= newEx.length) {
          setCurrentExerciseIndex(newEx.length - 1);
        }
      } else if (deleteConfirmIndex < currentExerciseIndex) {
        setCurrentExerciseIndex(currentExerciseIndex - 1);
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
    router.push("/routine/new/select-exercise?from=workout_free");
  };

  const handleQuit = () => {
    const confirmed = window.confirm(
      "운동을 그만두시겠습니까? 지금까지 기록한 내용은 저장되지 않습니다."
    );
    if (confirmed) {
      router.replace("/");
    }
  };

  const handleFinishWorkout = () => {
    setShowSaveDialog(true);
  };

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

    // TODO: API 호출로 운동 기록 저장
    // await fetch('/api/workout-logs', { method: 'POST', body: JSON.stringify(workoutData) });
    console.log("Free Mode - Workout saved:", workoutData);

    if (saveAsRoutine && routineName.trim()) {
      const routineData = {
        title: routineName.trim(),
        exercises: exercises.map((ex, idx) => ({
          order_no: idx + 1,
          name: ex.name,
          target_sets: ex.sets.length,
          rest_seconds: 120,
        })),
      };

      // TODO: API 호출로 루틴 저장
      // await fetch('/api/routines', { method: 'POST', body: JSON.stringify(routineData) });
      console.log("Saving as routine:", routineData);
      alert("운동 기록이 저장되고 새 루틴이 생성되었습니다! 🎉");
    } else {
      alert("운동 기록이 저장되었습니다! 💪");
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
              <p className="text-white/60 text-sm mb-8">
                원하는 종목을 추가하여 운동을 시작하세요
              </p>
              <Button
                onClick={handleAddExercise}
                className="w-full h-14 bg-[#3182F6] hover:bg-[#2563EB] text-white font-bold rounded-2xl shadow-lg shadow-[#3182F6]/25"
              >
                <Plus className="w-5 h-5 mr-2" />
                종목 추가
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

        {/* Bottom Action Bar - Next Exercise */}
        {exercises.length > 0 &&
          currentExerciseIndex < exercises.length - 1 && (
            <div className="flex-shrink-0 border-t border-white/5 bg-[#101012]/95 backdrop-blur-lg px-6 py-3">
              <Button
                variant="outline"
                className="w-full h-12 rounded-2xl border-white/10 text-white/80 hover:bg-white/5 bg-transparent"
                onClick={nextExercise}
              >
                다음 운동
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
      </div>

      {/* Delete Confirmation Drawer */}
      <AnimatePresence>
        {deleteConfirmIndex !== null && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm"
              onClick={() => setDeleteConfirmIndex(null)}
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[120] bg-[#17171C] rounded-t-3xl p-6 pb-8"
            >
              <div className="max-w-lg mx-auto w-full">
                <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />

                <h3 className="text-xl font-bold text-white mb-2">
                  "{exercises[deleteConfirmIndex]?.name}" 종목을
                  삭제하시겠습니까?
                </h3>
                <p className="text-white/60 text-sm mb-6">
                  이 작업은 취소할 수 없습니다.
                </p>

                <div className="space-y-2">
                  <Button
                    onClick={confirmRemoveExercise}
                    className="w-full h-12 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold"
                  >
                    삭제
                  </Button>
                  <Button
                    onClick={() => setDeleteConfirmIndex(null)}
                    variant="outline"
                    className="w-full h-12 rounded-2xl border-white/10 text-white/80 hover:bg-white/5 bg-transparent"
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
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center px-6">
          <div className="max-w-sm w-full bg-[#17171C] rounded-3xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">운동 완료</h2>
            <p className="text-white/70 text-sm mb-6">
              오늘 운동한 구성을 새 루틴으로 저장하시겠습니까?
            </p>

            {/* Routine Name Input */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-white/60 mb-2">
                루틴 이름
              </label>
              <input
                value={routineName}
                onChange={(e) => setRoutineName(e.target.value)}
                placeholder={`${new Date().toLocaleDateString("ko-KR")} 운동`}
                className="w-full bg-[#101012] px-4 py-3 text-base font-medium text-white placeholder:text-white/30 rounded-2xl outline-none focus:bg-white/[0.07] border border-white/10 focus:border-[#3182F6]/50 transition-colors"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={() => handleSaveWorkout(true)}
                disabled={!routineName.trim()}
                className="w-full h-12 rounded-2xl bg-[#3182F6] hover:bg-[#2563EB] text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                루틴으로 저장하고 완료
              </Button>
              <Button
                onClick={() => handleSaveWorkout(false)}
                variant="outline"
                className="w-full h-12 rounded-2xl border-white/10 text-white/80 hover:bg-white/5 bg-transparent"
              >
                기록만 저장하고 완료
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
