import { BaseTopic } from "../../common/types";

export interface MultipleChoiceOption {
    id: string;
    text: string;
    isCorrect: boolean;
  }
  
  export interface MultipleChoiceQuestion extends BaseTopic {
    id: number;
    title: string;
    category: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    timeLimit: number; // minutes
    passage: string;
    question: string;
    options: MultipleChoiceOption[];
    explanation?: string;
    tags: string[];
    isNew: boolean;
    isMarked: boolean;
    pracStatus: 'Undone' | 'Done' | 'In Progress';
    hasExplanation: boolean;
    createdAt: string;
    updatedAt: string;
    testSensitivity?: string;
  }
  
  export interface UserAnswer {
    questionId: number;
    selectedOptions: string[];
    isCorrect: boolean;
    score: number;
    submittedAt: string;
  }
  
  export interface SubmissionResult {
    score: number;
    correctAnswers: string[];
    selectedAnswers: string[];
    feedback: {
      correct: string[];
      incorrect: string[];
      missed: string[];
    };
  }