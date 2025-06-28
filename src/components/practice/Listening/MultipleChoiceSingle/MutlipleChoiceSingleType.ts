import { BaseTopic } from "../../common/types";

// export interface MultipleChoiceQuestion extends BaseTopic{
//   id: number ; // Unique identifier for the question
//   audioText: string;
//   question: string;
//   options: string[];
//   correctAnswer: number; // Index of correct option (0-based)
// }

export interface MultipleChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean;
}


export interface MultipleChoiceQuestion extends BaseTopic {
  id: number;
  audioText?: string;
  question: string;
  options: MultipleChoiceOption[];
  explanation?: string;
}

export interface QuestionResult {
  questionId: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  score: number;
  maxScore: number;
  completedAt: Date;
  timeSpent: number;
}

export interface UserAttempt {
  questionId: number;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  score: number;
  timestamp: string;
}