"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Check } from "lucide-react";
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
        {/* Sets Table */}

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#3182F6]" />
              세트 기록
            </h2>
            <span className="text-sm font-medium text-white/30 tracking-tighter">
              {exercise.sets.length}개 세트
            </span>
          </div>

          <div className="space-y-3">
            {exercise.sets.map((set, index) => (
              <motion.div
                key={set.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
                className="bg-[#17171C] rounded-[24px] overflow-hidden border border-white/5 transition-all active:scale-[0.98]"
              >
                <div className="p-2">
                  {/* Grid Layout: 세트번호 | kg입력 | reps입력 | 완료버튼 */}
                  <div className="grid grid-cols-[40px_minmax(0,1fr)_minmax(0,1fr)_48px] gap-3 items-center">
                    {/* Set Number */}
                    <div className="text-center">
                      <span className="text-[13px] font-black text-[#3182F6] opacity-50">
                        0{index + 1}
                      </span>
                    </div>

                    {/* Weight Input with inline unit */}
                    <div className="min-w-0">
                      <div className="relative bg-white/5 border border-white/10 rounded-xl h-12 flex items-center justify-center px-3 focus-within:border-[#3182F6] focus-within:bg-white/10 transition-all">
                        <input
                          type="number"
                          inputMode="decimal"
                          value={set.weight}
                          onChange={(e) =>
                            onWeightChange(set.id, e.target.value)
                          }
                          placeholder="0"
                          className="w-full bg-transparent text-center text-base font-bold text-white placeholder:text-white/30 focus:outline-none [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-xs font-bold text-white/40 ml-1 flex-shrink-0">
                          kg
                        </span>
                      </div>
                    </div>

                    {/* Reps Input with inline unit */}
                    <div className="min-w-0">
                      <div className="relative bg-white/5 border border-white/10 rounded-xl h-12 flex items-center justify-center px-3 focus-within:border-[#3182F6] focus-within:bg-white/10 transition-all">
                        <input
                          type="number"
                          inputMode="numeric"
                          value={set.reps}
                          onChange={(e) => onRepsChange(set.id, e.target.value)}
                          placeholder="0"
                          className="w-full bg-transparent text-center text-base font-bold text-white placeholder:text-white/30 focus:outline-none [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-xs font-bold text-white/40 ml-1 flex-shrink-0">
                          reps
                        </span>
                      </div>
                    </div>

                    {/* Complete Toggle */}
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => onSetComplete(set.id)}
                        className={`h-12 w-12 mx-auto rounded-xl flex items-center justify-center transition-all border ${
                          set.completed
                            ? "bg-[#3182F6] border-[#3182F6] text-white"
                            : "bg-transparent border-white/10 text-white/40 hover:bg-white/5 hover:text-white"
                        }`}
                        aria-label="세트 완료"
                      >
                        <Check className="w-5 h-5" strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.div>
    </AnimatePresence>
  );
}
