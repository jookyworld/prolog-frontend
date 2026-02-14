export interface Set {
  id: string;
  setNumber: number;
  weight: string;
  reps: string;
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  lastRecord: {
    weight: number;
    reps: number;
  };
  sets: Set[];
  is_temporary?: boolean; // 실시간 추가된 종목 플래그
}

export interface ExerciseSessionItem {
  id: string;
  name: string;
}

export interface WorkoutSession {
  id: string;
  title: string;
  type: "routine" | "free";
  completedAt: string;
  elapsedTime: number; // seconds
  totalSets: number;
  totalVolume: number; // kg
  exercises: ExerciseSessionItem[];
  isModified?: boolean;
}

// Detailed session types
export interface WorkoutSet {
  id: string;
  setNo: number;
  weight: number;
  reps: number;
  completed: boolean;
  isWarmup?: boolean;
}

export interface WorkoutExercise {
  id: string;
  orderNo: number;
  exerciseId?: string;
  name: string;
  targetRestSeconds?: number;
  sets: WorkoutSet[];
}

export interface WorkoutSessionDetail {
  id: string;
  title: string;
  type: "routine" | "free";
  routineId?: string | null;
  completedAt: string;
  startedAt?: string | null;
  endedAt?: string | null;
  elapsedTime: number; // seconds
  note?: string;
  isEdited?: boolean;
  updatedAt?: string | null;
  totalSets: number;
  totalVolume: number;
  exercises: WorkoutExercise[];
}
