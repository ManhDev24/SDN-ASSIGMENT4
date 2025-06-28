export interface User {
  _id: string;
  username?: string;
  email: string;
  admin: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Question {
  _id: string;
  text: string;
  author: User | string;
  options: string[];
  keywords: string[];
  correctAnswerIndex: number;
}

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizResponse {
  message: string;
  statusCode: number;
  quizzes: Quiz[];
}

export interface QuizAttempt {
  _id: string;
  userId: string;
  quizId: string;
  answers: number[];
  score: number;
  completedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface QuizState {
  quizzes: QuizResponse | null;
  currentQuiz: Quiz | null;
  currentQuizAttempt: {
    answers: (number | null)[];
    currentQuestionIndex: number;
    startTime: Date | null;
  } | null;
  isLoading: boolean;
  error: string | null;
}

export interface QuestionState {
  questions: Question[];
  currentQuestion: Question | null;
  isLoading: boolean;
  error: string | null;
}
