export interface UserProgress {
  totalTests: number;
  completedTests: number;
  averageScore: number;
  strongAreas: string[];
  weakAreas: string[];
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
  progress: UserProgress;
}
