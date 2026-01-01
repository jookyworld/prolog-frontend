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
