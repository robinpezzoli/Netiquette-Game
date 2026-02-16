
export interface Scenario {
  id: string;
  category: string;
  description: string;
  options: Option[];
  correctOptionId: number;
  explanation: string;
}

export interface Option {
  id: number;
  text: string;
}

export interface GameState {
  currentQuestionIndex: number;
  score: number;
  scenarios: Scenario[];
  isGameOver: boolean;
  status: 'idle' | 'loading' | 'playing' | 'error';
  totalQuestions: number;
}
