// export interface AdminQuestion {
//   id?: number | string;
//   title: string;
//   difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
//   category: string;
//   tags: string[];
//   isNew: boolean;
//   isMarked: boolean;
//   pracStatus: 'Undone' | 'Done' | 'In Progress';
//   hasExplanation: boolean;
//   createdAt: string;
//   updatedAt: string;
//   [key: string]: any; // For type-specific fields
// }

// export interface ExcelUploadData {
//   file: File;
//   mainType: string;
//   subType: string;
// }

// export interface ApiResponse<T = any> {
//   success: boolean;
//   data?: T;
//   message: string;
// }

// class AdminService {
//   private baseUrl = '/api/admin';

//   // Reading endpoints
//   async getReadingQuestions(subType: string): Promise<ApiResponse<AdminQuestion[]>> {
//     console.log(`GET /api/admin/reading/${subType}/questions`);
    
//     // Mock successful response
//     return {
//       success: true,
//       data: [],
//       message: `Successfully fetched reading ${subType} questions`
//     };
//   }

//   async createReadingQuestion(subType: string, question: AdminQuestion): Promise<ApiResponse<AdminQuestion>> {
//     console.log(`POST /api/admin/reading/${subType}/questions`, question);
    
//     return {
//       success: true,
//       data: { ...question, id: Date.now() },
//       message: `Successfully created reading ${subType} question`
//     };
//   }

//   async updateReadingQuestion(subType: string, id: string | number, question: AdminQuestion): Promise<ApiResponse<AdminQuestion>> {
//     console.log(`PUT /api/admin/reading/${subType}/questions/${id}`, question);
    
//     return {
//       success: true,
//       data: { ...question, id },
//       message: `Successfully updated reading ${subType} question`
//     };
//   }

//   async deleteReadingQuestion(subType: string, id: string | number): Promise<ApiResponse> {
//     console.log(`DELETE /api/admin/reading/${subType}/questions/${id}`);
    
//     return {
//       success: true,
//       message: `Successfully deleted reading ${subType} question`
//     };
//   }

//   async uploadReadingExcel(subType: string, uploadData: ExcelUploadData): Promise<ApiResponse> {
//     console.log(`POST /api/admin/reading/${subType}/upload`, uploadData);
    
//     return {
//       success: true,
//       message: `Successfully uploaded reading ${subType} Excel file`
//     };
//   }

//   // Listening endpoints
//   async getListeningQuestions(subType: string): Promise<ApiResponse<AdminQuestion[]>> {
//     console.log(`GET /api/admin/listening/${subType}/questions`);
    
//     return {
//       success: true,
//       data: [],
//       message: `Successfully fetched listening ${subType} questions`
//     };
//   }

//   async createListeningQuestion(subType: string, question: AdminQuestion): Promise<ApiResponse<AdminQuestion>> {
//     console.log(`POST /api/admin/listening/${subType}/questions`, question);
    
//     return {
//       success: true,
//       data: { ...question, id: Date.now() },
//       message: `Successfully created listening ${subType} question`
//     };
//   }

//   async updateListeningQuestion(subType: string, id: string | number, question: AdminQuestion): Promise<ApiResponse<AdminQuestion>> {
//     console.log(`PUT /api/admin/listening/${subType}/questions/${id}`, question);
    
//     return {
//       success: true,
//       data: { ...question, id },
//       message: `Successfully updated listening ${subType} question`
//     };
//   }

//   async deleteListeningQuestion(subType: string, id: string | number): Promise<ApiResponse> {
//     console.log(`DELETE /api/admin/listening/${subType}/questions/${id}`);
    
//     return {
//       success: true,
//       message: `Successfully deleted listening ${subType} question`
//     };
//   }

//   async uploadListeningExcel(subType: string, uploadData: ExcelUploadData): Promise<ApiResponse> {
//     console.log(`POST /api/admin/listening/${subType}/upload`, uploadData);
    
//     return {
//       success: true,
//       message: `Successfully uploaded listening ${subType} Excel file`
//     };
//   }

//   // Speaking endpoints
//   async getSpeakingQuestions(subType: string): Promise<ApiResponse<AdminQuestion[]>> {
//     console.log(`GET /api/admin/speaking/${subType}/questions`);
    
//     return {
//       success: true,
//       data: [],
//       message: `Successfully fetched speaking ${subType} questions`
//     };
//   }

//   async createSpeakingQuestion(subType: string, question: AdminQuestion): Promise<ApiResponse<AdminQuestion>> {
//     console.log(`POST /api/admin/speaking/${subType}/questions`, question);
    
//     return {
//       success: true,
//       data: { ...question, id: Date.now() },
//       message: `Successfully created speaking ${subType} question`
//     };
//   }

//   async updateSpeakingQuestion(subType: string, id: string | number, question: AdminQuestion): Promise<ApiResponse<AdminQuestion>> {
//     console.log(`PUT /api/admin/speaking/${subType}/questions/${id}`, question);
    
//     return {
//       success: true,
//       data: { ...question, id },
//       message: `Successfully updated speaking ${subType} question`
//     };
//   }

//   async deleteSpeakingQuestion(subType: string, id: string | number): Promise<ApiResponse> {
//     console.log(`DELETE /api/admin/speaking/${subType}/questions/${id}`);
    
//     return {
//       success: true,
//       message: `Successfully deleted speaking ${subType} question`
//     };
//   }

//   async uploadSpeakingExcel(subType: string, uploadData: ExcelUploadData): Promise<ApiResponse> {
//     console.log(`POST /api/admin/speaking/${subType}/upload`, uploadData);
    
//     return {
//       success: true,
//       message: `Successfully uploaded speaking ${subType} Excel file`
//     };
//   }

//   // Writing endpoints
//   async getWritingQuestions(subType: string): Promise<ApiResponse<AdminQuestion[]>> {
//     console.log(`GET /api/admin/writing/${subType}/questions`);
    
//     return {
//       success: true,
//       data: [],
//       message: `Successfully fetched writing ${subType} questions`
//     };
//   }

//   async createWritingQuestion(subType: string, question: AdminQuestion): Promise<ApiResponse<AdminQuestion>> {
//     console.log(`POST /api/admin/writing/${subType}/questions`, question);
    
//     return {
//       success: true,
//       data: { ...question, id: Date.now() },
//       message: `Successfully created writing ${subType} question`
//     };
//   }

//   async updateWritingQuestion(subType: string, id: string | number, question: AdminQuestion): Promise<ApiResponse<AdminQuestion>> {
//     console.log(`PUT /api/admin/writing/${subType}/questions/${id}`, question);
    
//     return {
//       success: true,
//       data: { ...question, id },
//       message: `Successfully updated writing ${subType} question`
//     };
//   }

//   async deleteWritingQuestion(subType: string, id: string | number): Promise<ApiResponse> {
//     console.log(`DELETE /api/admin/writing/${subType}/questions/${id}`);
    
//     return {
//       success: true,
//       message: `Successfully deleted writing ${subType} question`
//     };
//   }

//   async uploadWritingExcel(subType: string, uploadData: ExcelUploadData): Promise<ApiResponse> {
//     console.log(`POST /api/admin/writing/${subType}/upload`, uploadData);
    
//     return {
//       success: true,
//       message: `Successfully uploaded writing ${subType} Excel file`
//     };
//   }

//   // Generic method to handle all types
//   async getQuestions(mainType: string, subType: string): Promise<ApiResponse<AdminQuestion[]>> {
//     switch (mainType.toLowerCase()) {
//       case 'reading':
//         return this.getReadingQuestions(subType);
//       case 'listening':
//         return this.getListeningQuestions(subType);
//       case 'speaking':
//         return this.getSpeakingQuestions(subType);
//       case 'writing':
//         return this.getWritingQuestions(subType);
//       default:
//         return {
//           success: false,
//           message: 'Invalid main type'
//         };
//     }
//   }

//   async createQuestion(mainType: string, subType: string, question: AdminQuestion): Promise<ApiResponse<AdminQuestion>> {
//     switch (mainType.toLowerCase()) {
//       case 'reading':
//         return this.createReadingQuestion(subType, question);
//       case 'listening':
//         return this.createListeningQuestion(subType, question);
//       case 'speaking':
//         return this.createSpeakingQuestion(subType, question);
//       case 'writing':
//         return this.createWritingQuestion(subType, question);
//       default:
//         return {
//           success: false,
//           message: 'Invalid main type'
//         };
//     }
//   }

//   async updateQuestion(mainType: string, subType: string, id: string | number, question: AdminQuestion): Promise<ApiResponse<AdminQuestion>> {
//     switch (mainType.toLowerCase()) {
//       case 'reading':
//         return this.updateReadingQuestion(subType, id, question);
//       case 'listening':
//         return this.updateListeningQuestion(subType, id, question);
//       case 'speaking':
//         return this.updateSpeakingQuestion(subType, id, question);
//       case 'writing':
//         return this.updateWritingQuestion(subType, id, question);
//       default:
//         return {
//           success: false,
//           message: 'Invalid main type'
//         };
//     }
//   }

//   async deleteQuestion(mainType: string, subType: string, id: string | number): Promise<ApiResponse> {
//     switch (mainType.toLowerCase()) {
//       case 'reading':
//         return this.deleteReadingQuestion(subType, id);
//       case 'listening':
//         return this.deleteListeningQuestion(subType, id);
//       case 'speaking':
//         return this.deleteSpeakingQuestion(subType, id);
//       case 'writing':
//         return this.deleteWritingQuestion(subType, id);
//       default:
//         return {
//           success: false,
//           message: 'Invalid main type'
//         };
//     }
//   }

//   async uploadExcel(mainType: string, subType: string, uploadData: ExcelUploadData): Promise<ApiResponse> {
//     switch (mainType.toLowerCase()) {
//       case 'reading':
//         return this.uploadReadingExcel(subType, uploadData);
//       case 'listening':
//         return this.uploadListeningExcel(subType, uploadData);
//       case 'speaking':
//         return this.uploadSpeakingExcel(subType, uploadData);
//       case 'writing':
//         return this.uploadWritingExcel(subType, uploadData);
//       default:
//         return {
//           success: false,
//           message: 'Invalid main type'
//         };
//     }
//   }
// }

// export const adminService = new AdminService();



interface AdminApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class AdminService {
  private static instance: AdminService;
  
  static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  // Generic CRUD operations for any module
  async getQuestions(module: string, subModule: string): Promise<AdminApiResponse> {
    console.log(`🔍 GET Questions - Module: ${module}, SubModule: ${subModule}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      data: [],
      message: `Successfully fetched ${subModule} questions from ${module} module`
    };
  }

  async createQuestion(module: string, subModule: string, questionData: any): Promise<AdminApiResponse> {
    console.log(`✅ CREATE Question - Module: ${module}, SubModule: ${subModule}`, questionData);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      data: { id: Date.now(), ...questionData },
      message: `Successfully created ${subModule} question in ${module} module`
    };
  }

  async updateQuestion(module: string, subModule: string, questionId: string, questionData: any): Promise<AdminApiResponse> {
    console.log(`📝 UPDATE Question - Module: ${module}, SubModule: ${subModule}, ID: ${questionId}`, questionData);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      data: { id: questionId, ...questionData },
      message: `Successfully updated ${subModule} question in ${module} module`
    };
  }

  async deleteQuestion(module: string, subModule: string, questionId: string): Promise<AdminApiResponse> {
    console.log(`🗑️ DELETE Question - Module: ${module}, SubModule: ${subModule}, ID: ${questionId}`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: `Successfully deleted ${subModule} question from ${module} module`
    };
  }

  async uploadExcel(module: string, subModule: string, file: File): Promise<AdminApiResponse> {
    console.log(`📤 UPLOAD Excel - Module: ${module}, SubModule: ${subModule}, File: ${file.name}`);
    
    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return {
        success: false,
        error: 'Please upload a valid Excel file (.xlsx or .xls)'
      };
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      data: { uploadedCount: Math.floor(Math.random() * 50) + 10 },
      message: `Successfully uploaded ${file.name} with questions for ${subModule} in ${module} module`
    };
  }

  async downloadTemplate(module: string, subModule: string): Promise<AdminApiResponse> {
    console.log(`📥 DOWNLOAD Template - Module: ${module}, SubModule: ${subModule}`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: { templateUrl: `/templates/${module}_${subModule}_template.xlsx` },
      message: `Template for ${subModule} in ${module} module downloaded successfully`
    };
  }

  async exportQuestions(module: string, subModule: string): Promise<AdminApiResponse> {
    console.log(`📊 EXPORT Questions - Module: ${module}, SubModule: ${subModule}`);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      data: { exportUrl: `/exports/${module}_${subModule}_questions.xlsx` },
      message: `Successfully exported ${subModule} questions from ${module} module`
    };
  }

  // Module and sub-module mapping
  getModuleConfig() {
    return {
      Speaking: [
        { value: 'read-aloud', label: 'Read Aloud' },
        { value: 'repeat-sentence', label: 'Repeat Sentence' },
        { value: 'describe-image', label: 'Describe Image' },
        { value: 'answer-short-questions', label: 'Answer Short Questions' },
        { value: 'retell-lecture', label: 'Retell Lecture' }
      ],
      Writing: [
        { value: 'summarize-text', label: 'Summarize Text' },
        { value: 'write-email', label: 'Write Email' },
        { value: 'writing-essay', label: 'Writing Essay' }
      ],
      Reading: [
        { value: 'fill-blanks', label: 'Fill in Blanks' },
        { value: 'reading-fill-blanks', label: 'Reading Fill in Blanks' },
        { value: 'multiple-choice-multiple', label: 'Multiple Choice (Multiple)' },
        { value: 'multiple-choice-single', label: 'Multiple Choice (Single)' },
        { value: 'reorder-paragraphs', label: 'Reorder Paragraphs' }
      ],
      Listening: [
        { value: 'summarize-spoken-text', label: 'Summarize Spoken Text' },
        { value: 'multiple-choice-multiple', label: 'Multiple Choice (Multiple)' },
        { value: 'multiple-choice-single', label: 'Multiple Choice (Single)' },
        { value: 'fill-blanks', label: 'Fill in Blanks' },
        { value: 'highlight-correct-summary', label: 'Highlight Correct Summary' },
        { value: 'highlight-incorrect-words', label: 'Highlight Incorrect Words' },
        { value: 'select-missing-word', label: 'Select Missing Word' },
        { value: 'write-from-dictation', label: 'Write From Dictation' }
      ]
    };
  }
}

export const adminService = AdminService.getInstance();