export interface IBlock {
  day?: number;
  exercises?: IExercises[];
  number?: number;
  series?: number;
  typeMuscle?: string;
}

interface IExercises {
  description?: string;
  name?: string;
  reps?: number;
}
type TypeMuscle = 'femoral' | 'cuadriceps';
