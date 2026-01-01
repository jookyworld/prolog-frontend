"use client";

import type { Exercise } from "./types";

interface ExerciseNavigationProps {
  exercises: Exercise[];
  currentIndex: number;
  onSelectExercise: (index: number) => void;
}

export function ExerciseNavigation({
  exercises,
  currentIndex,
  onSelectExercise,
}: ExerciseNavigationProps) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
      {exercises.map((exercise, idx) => (
        <button
          key={exercise.id}
          onClick={() => onSelectExercise(idx)}
          className={`min-w-fit px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            idx === currentIndex
              ? "bg-[#3182F6] text-white"
              : "bg-[#17171C] text-white/60 hover:text-white"
          }`}
        >
          {exercise.name}
          {exercise.is_temporary && (
            <span className="ml-1.5 text-xs opacity-60">+</span>
          )}
        </button>
      ))}
    </div>
  );
}
