// Shared types for both components
export interface User {
    id: string;
    name: string;
    email: string;
  }
  
//   export interface BaseTopic {
    // id: number;
    // title: string;
    // duration: string;
    // speaker: string;
    // difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    // link: string;
    // category?: string;
    // tags?: string[];
    // isNew?: boolean;
    // isMarked?: boolean;
    // pracStatus?: 'Done' | 'Undone' | 'In Progress';
    // hasExplanation?: boolean;
    // createdAt?: string;
    // updatedAt?: string;
    // type?: string;
    export interface BaseTopic {
        id: number;
        title: string;
        duration?: string;
        speaker?: string;
        difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
        link?: string;
        type?: 'question' | 'lecture';
        preparationTime?: number;
        recordingTime?: number;
        category: string;
        tags: string[];
        isNew: boolean;
        isMarked: boolean;
        pracStatus: 'Undone' | 'Done' | 'In Progress';
        hasExplanation: boolean;
        createdAt: string;
        updatedAt: string;
        questionType?: 'ASQ' | 'MCQ' | 'Essay'; // Only for question topics
      }
//   }
  
  export interface AudioTopic extends BaseTopic {
    type: 'lecture';
    preparationTime: number; // in seconds
    recordingTime: number; // in seconds
  }

  export interface SummarizeTextTopic extends  BaseTopic {

    timeLimit: number;
    sampleAnswer: string;
    passage: string;
    wordLimit: Record<string, number>;
  }
  
  export interface QuestionTopic extends BaseTopic {
    type: 'question';
    questionType: 'ASQ' | 'MCQ' | 'Essay';
    preparationTime: number; // in seconds
    recordingTime: number; // in seconds
  }
  
  export interface PracticeTestsProps {
    user: User | null;
  }
  
  export interface FilterOptions {
    new: string;
    mark: string;
    pracStatus: string;
    difficulty: string;
    explanation: string;
    category?: string;
  }
  
  export interface TopicSelectionDrawerProps {
    open: boolean;
    onClose: () => void;
    onSelect: (topic: any) => void;
    topics: BaseTopic[];
    title: string;
    type?: 'lecture' | 'question';
  }