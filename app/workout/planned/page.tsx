"use client";

import { Button } from "@/components/ui/button";
import { ExerciseCard } from "@/components/workout/exercise-card";
import { ExerciseNavigation } from "@/components/workout/exercise-navigation";
import type { Exercise } from "@/components/workout/types";
import { WorkoutTimer } from "@/components/workout/workout-timer";
import { ChevronRight, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PlannedWorkoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routineId = searchParams.get("routineId");

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [routineTitle, setRoutineTitle] = useState("루틴 로딩 중...");

  const currentExercise = exercises[currentExerciseIndex];

  // 루틴 데이터 로드
  useEffect(() => {
    if (!routineId) {
      alert("루틴 ID가 없습니다.");
      router.replace("/routine");
      return;
    }

    const loadRoutine = async () => {
      try {
        // TODO: 실제 API 엔드포인트로 변경
        // const response = await fetch(`/api/routines/${routineId}`);
        // if (!response.ok) throw new Error('Failed to load routine');
        // const data = await response.json();

        // 임시 Mock 데이터 (실제로는 API 응답 사용)
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockRoutine = {
          id: routineId,
          title: "가슴 & 어깨",
          exercises: [
            {
              id: "1",
              name: "플랫 벤치프레스",
              lastRecord: { weight: 100, reps: 10 },
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
            },
            {
              id: "2",
              name: "인클라인 덤벨 프레스",
              lastRecord: { weight: 32, reps: 12 },
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
            },
          ],
        };

        setRoutineTitle(mockRoutine.title);
        setExercises(mockRoutine.exercises);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load routine:", error);
        alert("루틴을 불러오는데 실패했습니다.");
        router.replace("/routine");
      }
    };

    loadRoutine();
  }, [routineId, router]);

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

  const handleFinishWorkout = async () => {
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
      completedAt: new Date().toISOString(),
    };

    // TODO: API 호출로 운동 기록 저장
    // await fetch('/api/workout-logs', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(workoutData)
    // });

    console.log("Planned Mode - Workout saved:", workoutData);
    alert("오늘의 루틴을 완료했습니다! 🎉");
    router.replace("/routine");
  };

  return (
    <div className="min-h-screen bg-[#101012] text-white">
      {/* Header */}
      <header className="sticky top-0 bg-[#101012]/95 backdrop-blur-lg border-b border-white/5 z-10">
        <div className="h-14 flex items-center justify-between px-6">
          <button
            onClick={() => router.push("/routine")}
            className="p-2.5 hover:bg-white/5 rounded-xl transition-colors"
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold">{routineTitle}</h1>
            <WorkoutTimer isRunning={isRunning} onToggle={setIsRunning} />
          </div>

          <div className="w-10" />
        </div>
      </header>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#3182F6]/20 border-t-[#3182F6] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/60 text-sm">루틴을 불러오는 중...</p>
          </div>
        </div>
      )}

      {/* Exercise Content */}
      {!isLoading && exercises.length > 0 && (
        <div className="px-6 pt-6 pb-[180px]">
          <ExerciseNavigation
            exercises={exercises}
            currentIndex={currentExerciseIndex}
            onSelectExercise={setCurrentExerciseIndex}
          />

          <ExerciseCard
            exercise={currentExercise}
            onWeightChange={handleWeightChange}
            onRepsChange={handleRepsChange}
            onSetComplete={handleSetComplete}
            onAddSet={addSet}
          />

          {/* Next Exercise Button */}
          {currentExerciseIndex < exercises.length - 1 && (
            <div className="mt-5">
              <Button
                onClick={nextExercise}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-medium rounded-2xl h-12 border border-white/10"
              >
                다음 운동
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Bottom Action Bar */}
      {!isLoading && exercises.length > 0 && (
        <div className="fixed left-0 right-0 bottom-24 bg-[#101012]/95 backdrop-blur-lg border-t border-white/5 px-6 py-3 z-40">
          <Button
            onClick={handleFinishWorkout}
            className="w-full h-12 rounded-2xl bg-[#3182F6] hover:bg-[#2563EB] text-white font-bold shadow-lg shadow-[#3182F6]/25"
          >
            운동 완료
          </Button>
        </div>
      )}
    </div>
  );
}
