import { BaseTopic } from "../../common/types";

export interface SummarizeSpokenTextTopic extends BaseTopic {
  type: 'listening';
  taskType: 'SST';
  audioUrl: string;
  audioDuration: number; // in seconds
  wordLimit: {
    min: number;
    max: number;
  };
  timeLimit: number; // in minutes
  sampleSummary?: string;
  keyPoints?: string[];
  transcript?: string; // For reference
}

export interface SummaryResponse {
  text: string;
  wordCount: number;
  timeSpent: number;
  isSubmitted: boolean;
}
