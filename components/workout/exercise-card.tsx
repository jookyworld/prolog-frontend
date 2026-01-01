"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import type { Exercise } from "./types";

interface ExerciseCardProps {
  exercise: Exercise;
  onWeightChange: (setId: string, value: string) => void;
  onRepsChange: (setId: string, value: string) => void;
  onSetComplete: (setId: string) => void;
  onAddSet: () => void;
}

export function ExerciseCard({
  exercise,
  onWeightChange,
  onRepsChange,
  onSetComplete,
  onAddSet,
}: ExerciseCardProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={exercise.id}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -16 }}
        transition={{ duration: 0.18 }}
        className="space-y-5"
      >
        {/* Current Exercise Header */}
        <div className="bg-[#17171C] rounded-3xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-bold">{exercise.name}</h2>
            {exercise.is_temporary && (
              <span className="px-2.5 py-1 rounded-lg bg-[#3182F6]/20 text-[#3182F6] text-xs font-bold">
                NEW
              </span>
            )}
          </div>

          {/* Last Record */}
          {exercise.lastRecord.weight > 0 && (
            <div className="bg-[#101012] rounded-2xl p-4 border border-white/5">
              <p className="text-xs text-white/40 mb-2">
                지난 기록 (Last Record)
              </p>
              <p className="text-sm text-white/70">
                1세트{" "}
                <span className="text-white font-bold">
                  {exercise.lastRecord.weight}kg
                </span>{" "}
                ×{" "}
                <span className="text-white font-bold">
                  {exercise.lastRecord.reps}회
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Sets Table */}
        <div className="bg-[#17171C] rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white/60">세트 기록</h3>
            <button
              onClick={onAddSet}
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
            {exercise.sets.map((set) => (
              <motion.div
                key={`${exercise.id}-${set.id}`}
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
                  onChange={(e) => onWeightChange(set.id, e.target.value)}
                  placeholder={
                    exercise.lastRecord.weight > 0
                      ? exercise.lastRecord.weight.toString()
                      : "0"
                  }
                  className="bg-white/5 border border-white/10 rounded-xl h-12 text-center text-base font-bold text-white placeholder:text-white/30 focus:outline-none focus:border-[#3182F6] focus:bg-white/10 transition-all"
                />

                {/* Reps Input */}
                <input
                  type="number"
                  inputMode="numeric"
                  value={set.reps}
                  onChange={(e) => onRepsChange(set.id, e.target.value)}
                  placeholder={
                    exercise.lastRecord.reps > 0
                      ? exercise.lastRecord.reps.toString()
                      : "0"
                  }
                  className="bg-white/5 border border-white/10 rounded-xl h-12 text-center text-base font-bold text-white placeholder:text-white/30 focus:outline-none focus:border-[#3182F6] focus:bg-white/10 transition-all"
                />

                {/* Complete Toggle */}
                <button
                  onClick={() => onSetComplete(set.id)}
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
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
