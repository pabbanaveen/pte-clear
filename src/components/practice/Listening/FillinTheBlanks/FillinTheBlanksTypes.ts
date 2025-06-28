// TypeScript interfaces for Listening Fill in the Blanks feature

import { BaseTopic } from "../../common/types";


export interface WordBankWord {
  id: string;
  word: string;
  isUsed: boolean;
  correctPosition?: number;
}

export interface BlankPosition {
  id: string;
  position: number;
  correctAnswer: string;
  filledWord?: string;
  isCorrect?: boolean;
}

export interface ListeningPassage extends BaseTopic {
  id: number;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeLimit: number; // in seconds
  audioUrl?: string;
  audioText?: string; // For TextToSpeech
  duration: string;
  text: string;
  blanks: BlankPosition[];
  wordBank: WordBankWord[];
  instructions: string;
  category: string;
  tags: string[];
  maxScore: number;
}

export interface QuestionResult {
  questionId: string;
  score: number;
  maxScore: number;
  correctAnswers: number;
  totalBlanks: number;
  completedAt: Date;
  timeSpent: number;
  answers: BlankPosition[];
}

export interface StudentProgress {
  studentName: string;
  questionNumber: number;
  testedCount: number;
  totalQuestions: number;
  currentStreak: number;
  averageScore: number;
}

export interface TimerState {
  timeRemaining: number;
  isRunning: boolean;
  warningThreshold: number;
  autoSubmit: boolean;
}

export interface DragDropState {
  draggedWord: WordBankWord | null;
  targetBlank: BlankPosition | null;
  isDragging: boolean;
}

export interface UserAttempt {
  questionId: number;
  answers: Array<{
    blankId: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }>;
  score: number;
  timestamp: string;
}