"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Check, ChevronRight, Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface Set {
  id: string
  setNumber: number
  weight: string
  reps: string
  completed: boolean
}

interface Exercise {
  id: string
  name: string
  lastRecord: {
    weight: number
    reps: number
  }
  sets: Set[]
}

export default function WorkoutPage() {
  const router = useRouter()
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
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
  ])

  const currentExercise = exercises[currentExerciseIndex]

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSetComplete = (setId: string) => {
    setExercises((prev) =>
      prev.map((exercise, idx) => {
        if (idx === currentExerciseIndex) {
          return {
            ...exercise,
            sets: exercise.sets.map((set) => (set.id === setId ? { ...set, completed: !set.completed } : set)),
          }
        }
        return exercise
      }),
    )
  }

  const handleWeightChange = (setId: string, value: string) => {
    setExercises((prev) =>
      prev.map((exercise, idx) => {
        if (idx === currentExerciseIndex) {
          return {
            ...exercise,
            sets: exercise.sets.map((set) => (set.id === setId ? { ...set, weight: value } : set)),
          }
        }
        return exercise
      }),
    )
  }

  const handleRepsChange = (setId: string, value: string) => {
    setExercises((prev) =>
      prev.map((exercise, idx) => {
        if (idx === currentExerciseIndex) {
          return {
            ...exercise,
            sets: exercise.sets.map((set) => (set.id === setId ? { ...set, reps: value } : set)),
          }
        }
        return exercise
      }),
    )
  }

  const addSet = () => {
    setExercises((prev) =>
      prev.map((exercise, idx) => {
        if (idx === currentExerciseIndex) {
          const newSetNumber = exercise.sets.length + 1
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
          }
        }
        return exercise
      }),
    )
  }

  const nextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1)
    }
  }

  return (
    <div className="min-h-screen bg-[#101012] text-white pb-32">
      {/* Header */}
      <header className="sticky top-0 bg-[#101012]/95 backdrop-blur-lg border-b border-white/5 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <button onClick={() => router.push("/")} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold">가슴 & 어깨</h1>
            <div className="flex items-center justify-center gap-2 mt-1">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="p-1 hover:bg-white/5 rounded-lg transition-colors"
              >
                {isRunning ? <Pause className="w-4 h-4 text-[#3182F6]" /> : <Play className="w-4 h-4 text-[#3182F6]" />}
              </button>
              <p className="text-2xl font-mono font-bold text-[#3182F6]">{formatTime(timer)}</p>
            </div>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <div className="px-6 pt-6">
        {/* Exercise Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
          {exercises.map((exercise, idx) => (
            <button
              key={exercise.id}
              onClick={() => setCurrentExerciseIndex(idx)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                idx === currentExerciseIndex ? "bg-[#3182F6] text-white" : "bg-[#17171C] text-white/60 hover:text-white"
              }`}
            >
              {exercise.name}
            </button>
          ))}
        </div>

        {/* Exercise Card with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExercise.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {/* Current Exercise Header */}
            <div className="bg-[#17171C] rounded-3xl p-6">
              <h2 className="text-2xl font-bold mb-3">{currentExercise.name}</h2>
              {/* Last Record */}
              <div className="bg-[#101012] rounded-2xl p-4 border border-white/5">
                <p className="text-xs text-white/40 mb-2">지난 기록 (Last Record)</p>
                <p className="text-sm text-white/70">
                  1세트 <span className="text-white font-bold">{currentExercise.lastRecord.weight}kg</span> x{" "}
                  <span className="text-white font-bold">{currentExercise.lastRecord.reps}회</span>
                </p>
              </div>
            </div>

            {/* Sets Table */}
            <div className="bg-[#17171C] rounded-3xl p-6">
              <h3 className="text-sm font-bold text-white/60 mb-4">세트 기록</h3>

              {/* Table Header */}
              <div className="grid grid-cols-[60px_1fr_1fr_60px] gap-3 mb-3 px-2">
                <div className="text-xs text-white/40 font-medium">세트</div>
                <div className="text-xs text-white/40 font-medium text-center">kg</div>
                <div className="text-xs text-white/40 font-medium text-center">reps</div>
                <div className="text-xs text-white/40 font-medium text-center">완료</div>
              </div>

              {/* Sets */}
              <div className="space-y-3">
                {currentExercise.sets.map((set) => (
                  <motion.div
                    key={set.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`grid grid-cols-[60px_1fr_1fr_60px] gap-3 items-center rounded-2xl p-3 transition-all ${
                      set.completed
                        ? "bg-[#3182F6]/10 border-2 border-[#3182F6]"
                        : "bg-[#101012] border-2 border-transparent"
                    }`}
                  >
                    {/* Set Number */}
                    <div className="text-center">
                      <span className={`text-lg font-bold ${set.completed ? "text-[#3182F6]" : "text-white/60"}`}>
                        {set.setNumber}
                      </span>
                    </div>

                    {/* Weight Input */}
                    <input
                      type="number"
                      inputMode="decimal"
                      value={set.weight}
                      onChange={(e) => handleWeightChange(set.id, e.target.value)}
                      placeholder={currentExercise.lastRecord.weight.toString()}
                      className="bg-white/5 border border-white/10 rounded-xl h-14 text-center text-lg font-bold text-white placeholder:text-white/30 focus:outline-none focus:border-[#3182F6] focus:bg-white/10 transition-all"
                    />

                    {/* Reps Input */}
                    <input
                      type="number"
                      inputMode="numeric"
                      value={set.reps}
                      onChange={(e) => handleRepsChange(set.id, e.target.value)}
                      placeholder={currentExercise.lastRecord.reps.toString()}
                      className="bg-white/5 border border-white/10 rounded-xl h-14 text-center text-lg font-bold text-white placeholder:text-white/30 focus:outline-none focus:border-[#3182F6] focus:bg-white/10 transition-all"
                    />

                    {/* Complete Button */}
                    <button
                      onClick={() => handleSetComplete(set.id)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        set.completed
                          ? "bg-[#3182F6] text-white"
                          : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Check className="w-6 h-6" strokeWidth={3} />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Add Set Button */}
              <Button
                onClick={addSet}
                className="w-full mt-4 bg-transparent hover:bg-white/5 text-white/60 hover:text-white font-medium rounded-2xl h-14 border border-white/10 hover:border-white/20 transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                세트 추가
              </Button>
            </div>

            {/* Next Exercise Button */}
            {currentExerciseIndex < exercises.length - 1 && (
              <Button
                onClick={nextExercise}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-medium rounded-2xl h-14 border border-white/10"
              >
                다음 운동
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#101012] border-t border-white/5 p-6 space-y-3">
        <Button className="w-full bg-transparent hover:bg-white/5 text-white/60 hover:text-white font-medium rounded-2xl h-14 border border-white/10 hover:border-white/20 transition-all">
          <Plus className="w-5 h-5 mr-2" />
          종목 추가
        </Button>
        <Button
          onClick={() => router.push("/")}
          className="w-full bg-[#3182F6] hover:bg-[#2563EB] text-white font-bold rounded-2xl h-16 text-lg shadow-xl shadow-[#3182F6]/30 transition-all"
        >
          운동 완료
        </Button>
      </div>
    </div>
  )
}
