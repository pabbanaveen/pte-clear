import { api } from './api';
import { 
  BaseQuestion, 
  ReadAloudQuestion, 
  RepeatSentenceQuestion, 
  DescribeImageQuestion,
  WritingEssayQuestion,
  ReadingFillBlanksQuestion,
  MultipleChoiceQuestion,
  ReorderParagraphsQuestion,
  TestResult,
  PaginatedResponse,
  FilterOptions,
  QuestionType,
  PteSkill
} from '../types';

export const questionService = {
  // Get questions by type
  getQuestions: async (type: QuestionType, filters?: FilterOptions) => {
    return await api.get<PaginatedResponse<BaseQuestion>>(`/questions/${type}`, filters);
  },

  // Get question by ID
  getQuestion: async (id: string) => {
    return await api.get<BaseQuestion>(`/questions/${id}`);
  },

  // Create new question (Admin only)
  createQuestion: async (questionData: Partial<BaseQuestion>) => {
    return await api.post<BaseQuestion>('/questions', questionData);
  },

  // Update question (Admin only)
  updateQuestion: async (id: string, questionData: Partial<BaseQuestion>) => {
    return await api.put<BaseQuestion>(`/questions/${id}`, questionData);
  },

  // Delete question (Admin only)
  deleteQuestion: async (id: string) => {
    return await api.delete(`/questions/${id}`);
  },

  // Upload questions from Excel (Admin only)
  uploadQuestionsFromExcel: async (file: File, type: QuestionType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return await api.upload<{ imported: number; errors: string[] }>('/questions/upload', formData);
  },

  // Submit answer and get score
  submitAnswer: async (questionId: string, answer: any) => {
    return await api.post<TestResult>(`/questions/${questionId}/submit`, { answer });
  },

  // Get questions by skill
  getQuestionsBySkill: async (skill: PteSkill, filters?: FilterOptions) => {
    return await api.get<PaginatedResponse<BaseQuestion>>(`/questions/skill/${skill}`, filters);
  },

  // Get random practice question
  getRandomQuestion: async (type: QuestionType) => {
    return await api.get<BaseQuestion>(`/questions/${type}/random`);
  },

  // Specific question type services
  readAloud: {
    getQuestions: async (filters?: FilterOptions) => {
      return await api.get<PaginatedResponse<ReadAloudQuestion>>('/questions/read-aloud', filters);
    },
    submit: async (questionId: string, audioData: Blob) => {
      const formData = new FormData();
      formData.append('audio', audioData);
      return await api.upload<TestResult>(`/questions/${questionId}/submit-audio`, formData);
    },
  },

  repeatSentence: {
    getQuestions: async (filters?: FilterOptions) => {
      return await api.get<PaginatedResponse<RepeatSentenceQuestion>>('/questions/repeat-sentence', filters);
    },
    submit: async (questionId: string, audioData: Blob) => {
      const formData = new FormData();
      formData.append('audio', audioData);
      return await api.upload<TestResult>(`/questions/${questionId}/submit-audio`, formData);
    },
  },

  describeImage: {
    getQuestions: async (filters?: FilterOptions) => {
      return await api.get<PaginatedResponse<DescribeImageQuestion>>('/questions/describe-image', filters);
    },
    submit: async (questionId: string, audioData: Blob) => {
      const formData = new FormData();
      formData.append('audio', audioData);
      return await api.upload<TestResult>(`/questions/${questionId}/submit-audio`, formData);
    },
  },

  writingEssay: {
    getQuestions: async (filters?: FilterOptions) => {
      return await api.get<PaginatedResponse<WritingEssayQuestion>>('/questions/write-essay', filters);
    },
    submit: async (questionId: string, essay: string) => {
      return await api.post<TestResult>(`/questions/${questionId}/submit`, { essay });
    },
  },

  readingFillBlanks: {
    getQuestions: async (filters?: FilterOptions) => {
      return await api.get<PaginatedResponse<ReadingFillBlanksQuestion>>('/questions/reading-fill-blanks', filters);
    },
    submit: async (questionId: string, answers: Record<string, string>) => {
      return await api.post<TestResult>(`/questions/${questionId}/submit`, { answers });
    },
  },

  multipleChoice: {
    getQuestions: async (filters?: FilterOptions) => {
      return await api.get<PaginatedResponse<MultipleChoiceQuestion>>('/questions/multiple-choice', filters);
    },
    submit: async (questionId: string, selectedAnswers: string[]) => {
      return await api.post<TestResult>(`/questions/${questionId}/submit`, { selectedAnswers });
    },
  },

  reorderParagraphs: {
    getQuestions: async (filters?: FilterOptions) => {
      return await api.get<PaginatedResponse<ReorderParagraphsQuestion>>('/questions/reorder-paragraphs', filters);
    },
    submit: async (questionId: string, order: number[]) => {
      return await api.post<TestResult>(`/questions/${questionId}/submit`, { order });
    },
  },
};
