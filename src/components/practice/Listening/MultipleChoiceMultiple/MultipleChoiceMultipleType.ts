import { BaseTopic } from "../../common/types";

// Listening Multiple Choice specific types
export interface ListeningMultipleChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface ListeningMultipleChoiceQuestion extends BaseTopic {
  category: string;
  timeLimit: number; // in minutes
  testSensitivity: string;
  audioUrl: string;
  question: string;
  options: ListeningMultipleChoiceOption[];
  explanation?: string;
  tags: string[];
  isNew: boolean;
  isMarked: boolean;
  pracStatus: 'Undone' | 'In Progress' | 'Done';
  hasExplanation: boolean;
  createdAt: string;
  updatedAt: string;
}

// Submission result interface
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

// Audio player state
export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: string | null;
}