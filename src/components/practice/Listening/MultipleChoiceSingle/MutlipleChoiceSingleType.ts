import { BaseTopic } from "../../common/types";

export interface MultipleChoiceQuestion extends BaseTopic{
  id: number ; // Unique identifier for the question
  audioText: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-based)
}
