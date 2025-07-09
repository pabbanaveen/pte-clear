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

  // Process Excel import with enhanced audio support
  async uploadExcel(module: string, subModule: string, file: File): Promise<{ success: boolean; message?: string; error?: string; data?: any }> {
    try {
      // Simulate API call with validation
      const result = await this.processExcelFile(file, module, subModule);
      
      if (result.errors.length > 0) {
        return {
          success: false,
          error: `Validation errors found:\n${result.errors.join('\n')}`,
          data: { errors: result.errors }
        };
      }

      return {
        success: true,
        message: `Successfully imported ${result.imported} questions`,
        data: { imported: result.imported, processed: result.data }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to process Excel file. Please check the format and try again.'
      };
    }
  }

  private async processExcelFile(file: File, module: string, subModule: string): Promise<{ imported: number; errors: string[]; data: any[] }> {
    return new Promise(async (resolve) => {
      const XLSX = await import('xlsx');
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const errors: string[] = [];
          const processedData: any[] = [];
          let imported = 0;

          jsonData.forEach((row: any, index: number) => {
            const rowNumber = index + 2; // Account for header row
            const validation = this.validateRow(row, module, subModule, rowNumber);
            
            if (validation.errors.length > 0) {
              errors.push(...validation.errors);
            } else {
              processedData.push(validation.processedRow);
              imported++;
            }
          });

          resolve({ imported, errors, data: processedData });
        } catch (error) {
          resolve({ imported: 0, errors: ['Failed to parse Excel file'], data: [] });
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  private validateRow(row: any, module: string, subModule: string, rowNumber: number): { errors: string[]; processedRow: any } {
    const errors: string[] = [];
    const processedRow: any = { ...row };

    // Basic validation
    if (!row.title) {
      errors.push(`Row ${rowNumber}: Title is required`);
    }

    // Listening module audio validation
    if (module === 'Listening') {
      const hasAudioUrl = row.audioUrl && row.audioUrl.trim();
      const hasAudioText = row.audioText && row.audioText.trim();

      if (!hasAudioUrl && !hasAudioText) {
        errors.push(`Row ${rowNumber}: Either audioUrl or audioText is required for Listening module`);
      }

      if (hasAudioUrl && !this.isValidUrl(row.audioUrl)) {
        errors.push(`Row ${rowNumber}: Invalid audioUrl format`);
      }

      if (hasAudioText && row.audioText.length < 10) {
        errors.push(`Row ${rowNumber}: audioText should be at least 10 characters long`);
      }

      // Structure audio data properly
      processedRow.audio = {
        audioUrl: row.audioUrl || '',
        audioText: row.audioText || '',
        audioFormat: row.audioFormat || (hasAudioUrl ? this.extractAudioFormat(row.audioUrl) : ''),
        audioDuration: row.audioDuration ? parseInt(row.audioDuration) : undefined,
        audioTitle: row.audioTitle || row.title || 'Untitled Audio'
      };
    }

    // Module-specific validation
    switch (`${module}-${subModule}`) {
      case 'Listening-summarize-spoken-text':
        if (!row.transcript && !row.audioText) {
          errors.push(`Row ${rowNumber}: Transcript or audioText is required`);
        }
        break;
      case 'Listening-multiple-choice-multiple':
      case 'Listening-multiple-choice-single':
        if (!row.question) {
          errors.push(`Row ${rowNumber}: Question is required`);
        }
        break;
      case 'Listening-fill-blanks':
        if (!row.text) {
          errors.push(`Row ${rowNumber}: Text with blanks is required`);
        }
        break;
    }

    return { errors, processedRow };
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private extractAudioFormat(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    return ['mp3', 'wav', 'ogg', 'm4a', 'aac'].includes(extension || '') ? extension || 'mp3' : 'mp3';
  }

  async downloadTemplate(module: string, subModule: string): Promise<AdminApiResponse> {
    console.log(`📥 DOWNLOAD Template - Module: ${module}, SubModule: ${subModule}`);
    
    try {
      // Import XLSX library dynamically
      const XLSX = await import('xlsx');
      
      // Get template data based on module and sub-module
      const templateData = this.getTemplateData(module, subModule);
      
      if (!templateData) {
        return {
          success: false,
          error: `No template available for ${module} - ${subModule}`
        };
      }
      
      // Create workbook
      const workbook = XLSX.utils.book_new();
      
      // Create worksheet with template data
      const worksheet = XLSX.utils.aoa_to_sheet(templateData.data);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, templateData.sheetName);
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
      // Create blob and download
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${module}_${subModule}_Template.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return {
        success: true,
        message: `Template for ${subModule} in ${module} module downloaded successfully`
      };
    } catch (error) {
      console.error('Error generating template:', error);
      return {
        success: false,
        error: 'Failed to generate template'
      };
    }
  }

  // Generate template data based on module and sub-module
  private getTemplateData(module: string, subModule: string): { data: any[][], sheetName: string } | null {
    const key = `${module}-${subModule}`;
    
    switch (key) {
      // Speaking Module Templates
      case 'Speaking-read-aloud':
        return {
          sheetName: 'Read Aloud Template',
          data: [
            ['id', 'text', 'preparationTime', 'recordingTime', 'difficulty', 'category', 'tags', 'expectedAnswer', 'title'],
            ['1', 'Climate change is a pressing global issue. Scientists are researching its impacts, such as melting ice caps, rising sea levels, and extreme weather. Immediate action from governments and individuals is essential to reduce emissions.', '40', '40', 'Intermediate', 'Environmental Science', 'climate,environment,science', 'Read the text clearly, emphasizing key terms like "climate change" and "emissions."', 'Climate Change Reading'],
            ['2', 'Artificial intelligence is transforming industries like healthcare and transportation. Machine learning enhances efficiency, but raises concerns about job displacement and ethics.', '40', '40', 'Advanced', 'Technology', 'AI,technology,ethics', 'Pronounce technical terms like "artificial intelligence" accurately with a steady pace.', 'AI Technology'],
            ['3', 'Education shapes society\'s future. Online platforms and virtual reality are making learning more accessible and interactive for students worldwide.', '40', '40', 'Beginner', 'Education', 'education,online learning,technology', 'Read with enthusiasm, stressing words like "accessible" and "interactive."', 'Future of Education']
          ]
        };
        
      case 'Speaking-repeat-sentence':
        return {
          sheetName: 'Repeat Sentence Template',
          data: [
            ['id', 'audioUrl', 'sentence', 'recordingTime', 'difficulty', 'category', 'tags', 'title'],
            ['1', 'https://example.com/audio1.mp3', 'The weather today is quite pleasant.', '15', 'Beginner', 'General', 'weather,daily,conversation', 'Weather Sentence'],
            ['2', 'https://example.com/audio2.mp3', 'Technology has revolutionized modern communication systems.', '15', 'Intermediate', 'Technology', 'technology,communication,modern', 'Technology Communication'],
            ['3', 'https://example.com/audio3.mp3', 'The environmental implications of climate change require immediate attention.', '20', 'Advanced', 'Environment', 'environment,climate,change', 'Climate Implications']
          ]
        };
        
      case 'Speaking-describe-image':
        return {
          sheetName: 'Describe Image Template',
          data: [
            ['id', 'imageUrl', 'imageType', 'preparationTime', 'speakingTime', 'difficulty', 'category', 'keyPoints', 'sampleAnswer', 'title'],
            ['1', 'https://example.com/chart1.jpg', 'chart', '25', '40', 'Intermediate', 'Charts', 'title,trends,data,conclusion', 'This chart shows the population growth over the last decade with increasing trends.', 'Population Growth Chart'],
            ['2', 'https://example.com/graph2.jpg', 'graph', '25', '40', 'Advanced', 'Graphs', 'axis,values,comparison,analysis', 'The graph displays comparative data between different regions showing significant variations.', 'Regional Comparison Graph'],
            ['3', 'https://example.com/photo3.jpg', 'photo', '25', '40', 'Beginner', 'Photos', 'people,activity,location,description', 'This photo shows people engaged in outdoor activities in a park setting.', 'Outdoor Activities Photo']
          ]
        };
        
      case 'Speaking-answer-short-questions':
        return {
          sheetName: 'Answer Short Questions Template',
          data: [
            ['id', 'audioUrl', 'question', 'correctAnswer', 'acceptableAnswers', 'difficulty', 'category', 'tags', 'title'],
            ['1', 'https://example.com/audio1.mp3', 'What is the largest planet in our solar system?', 'Jupiter', 'Jupiter;jupiter;JUPITER', 'Beginner', 'Science', 'space,planets,solar system', 'Solar System Question'],
            ['2', 'https://example.com/audio2.mp3', 'What is the capital of Australia?', 'Canberra', 'Canberra;canberra;CANBERRA', 'Intermediate', 'Geography', 'geography,capitals,Australia', 'Australian Capital'],
            ['3', 'https://example.com/audio3.mp3', 'What gas do plants absorb from the atmosphere?', 'Carbon dioxide', 'Carbon dioxide;CO2;carbon dioxide', 'Beginner', 'Science', 'plants,photosynthesis,gases', 'Plant Biology Question']
          ]
        };
        
      case 'Speaking-retell-lecture':
        return {
          sheetName: 'Retell Lecture Template',
          data: [
            ['id', 'audioUrl', 'transcript', 'duration', 'keyPoints', 'subject', 'preparationTime', 'speakingTime', 'difficulty', 'category', 'title'],
            ['1', 'https://example.com/lecture1.mp3', 'Today we will discuss the principles of renewable energy and how they can help create a more sustainable future.', '60', 'renewable energy;solar power;environmental benefits;cost effectiveness', 'Environmental Science', '10', '40', 'Intermediate', 'Science', 'Renewable Energy Basics'],
            ['2', 'https://example.com/lecture2.mp3', 'The impact of artificial intelligence on modern healthcare systems has been transformative.', '90', 'AI;healthcare;transformation;technology;benefits', 'Technology', '10', '40', 'Advanced', 'Technology', 'AI in Healthcare'],
            ['3', 'https://example.com/lecture3.mp3', 'Understanding the basics of economics helps individuals make better financial decisions.', '75', 'economics;finance;decision making;money management', 'Economics', '10', '40', 'Beginner', 'Economics', 'Economics Basics']
          ]
        };
        
      // Writing Module Templates
      case 'Writing-summarize-text':
        return {
          sheetName: 'Summarize Text Template',
          data: [
            ['id', 'passage', 'wordLimit', 'timeLimit', 'sampleSummary', 'keyIdeas', 'difficulty', 'category', 'title'],
            ['1', 'Artificial intelligence has revolutionized many industries by introducing automation and improving efficiency. Companies are now able to process large amounts of data quickly and make informed decisions.', '75', '10', 'AI has transformed industries through automation and efficiency, enabling faster data processing and better decision-making.', 'AI transformation;automation;efficiency;industry impact', 'Intermediate', 'Technology', 'AI in Industries'],
            ['2', 'Climate change represents one of the most significant challenges facing humanity. Rising temperatures and extreme weather events require immediate global action to reduce greenhouse gas emissions.', '75', '10', 'Climate change poses major challenges through rising temperatures and extreme weather, requiring urgent global emission reduction efforts.', 'climate change;global warming;emissions;environmental action', 'Advanced', 'Environment', 'Climate Change Challenge'],
            ['3', 'Online education has become increasingly popular due to its flexibility and accessibility. Students can learn at their own pace and access courses from anywhere in the world.', '75', '10', 'Online education offers flexibility and accessibility, allowing students to learn at their own pace from anywhere globally.', 'online education;flexibility;accessibility;global learning', 'Beginner', 'Education', 'Online Learning Benefits']
          ]
        };
        
      case 'Writing-write-email':
        return {
          sheetName: 'Write Email Template',
          data: [
            ['id', 'scenario', 'recipient', 'purpose', 'keyPoints', 'wordLimit', 'timeLimit', 'tone', 'sampleEmail', 'difficulty', 'category', 'title'],
            ['1', 'You need to request a meeting with your supervisor to discuss a project.', 'Your supervisor', 'Request a meeting', 'project discussion;available times;meeting duration;urgent matter', '120', '20', 'formal', 'Dear [Supervisor Name], I would like to request a meeting to discuss the current project status and address some important matters that require your guidance.', 'Intermediate', 'Workplace', 'Meeting Request'],
            ['2', 'You need to apologize to a customer for a delayed shipment.', 'Customer', 'Apologize for delay', 'sincere apology;explanation;compensation;future prevention', '150', '20', 'formal', 'Dear Valued Customer, We sincerely apologize for the delay in your recent order shipment and any inconvenience this may have caused.', 'Advanced', 'Customer Service', 'Shipment Delay Apology'],
            ['3', 'You want to invite a friend to your birthday party.', 'Friend', 'Party invitation', 'date;time;location;dress code;RSVP', '100', '15', 'informal', 'Hey! I\'m having a birthday party next Saturday and would love for you to come celebrate with me!', 'Beginner', 'Personal', 'Birthday Invitation']
          ]
        };
        
      case 'Writing-writing-essay':
        return {
          sheetName: 'Writing Essay Template',
          data: [
            ['id', 'prompt', 'essayType', 'wordLimit', 'timeLimit', 'rubricContent', 'rubricForm', 'rubricGrammar', 'rubricVocabulary', 'sampleEssay', 'difficulty', 'category', 'title'],
            ['1', 'Some people believe that technology makes life easier. Do you agree or disagree?', 'agree-disagree', '300', '20', 'Clear position, relevant examples, logical structure', 'Grammar accuracy, sentence variety, vocabulary range', 'Correct grammar usage, minimal errors', 'Appropriate word choice, academic vocabulary', 'Technology has undoubtedly made many aspects of life easier through automation and connectivity, though it also presents certain challenges.', 'Intermediate', 'Opinion', 'Technology and Life'],
            ['2', 'Should governments spend more money on public transportation or road infrastructure?', 'argumentative', '350', '20', 'Strong arguments, evidence, counterarguments', 'Coherent paragraphs, transitions, conclusion', 'Complex sentences, proper tenses', 'Formal vocabulary, precise expressions', 'Governments should prioritize public transportation investment over road infrastructure due to environmental and economic benefits.', 'Advanced', 'Policy', 'Transportation Investment'],
            ['3', 'Do you think social media has a positive or negative impact on society?', 'agree-disagree', '250', '20', 'Clear opinion, supporting examples', 'Basic structure, simple transitions', 'Correct basic grammar', 'Appropriate vocabulary level', 'Social media has both positive and negative impacts on society, but the benefits generally outweigh the drawbacks.', 'Beginner', 'Social Issues', 'Social Media Impact']
          ]
        };
        
      // Reading Module Templates
      case 'Reading-fill-blanks':
        return {
          sheetName: 'Reading Fill Blanks Template',
          data: [
            ['id', 'title', 'text', 'blank1_answer', 'blank1_options', 'blank2_answer', 'blank2_options', 'blank3_answer', 'blank3_options', 'blank4_answer', 'blank4_options', 'blank5_answer', 'blank5_options', 'difficulty', 'category'],
            ['1', 'Renewable Energy Sources', 'Solar energy has become increasingly [BLANK_1] as a renewable energy source in recent years. The technology has [BLANK_2] significantly, making it more [BLANK_3] for both residential and commercial applications.', 'popular', 'popular;expensive;dangerous;complicated', 'improved', 'improved;declined;stagnated;disappeared', 'affordable', 'affordable;difficult;unreliable;temporary', '', '', '', '', 'Beginner', 'Energy'],
            ['2', 'Climate Change Effects', 'Global warming continues to [BLANK_1] weather patterns worldwide. Scientists have [BLANK_2] that immediate action is [BLANK_3] to prevent catastrophic environmental changes.', 'affect', 'affect;improve;stabilize;control', 'warned', 'warned;suggested;hoped;denied', 'necessary', 'necessary;optional;impossible;unlikely', '', '', '', '', 'Intermediate', 'Environment'],
            ['3', 'Artificial Intelligence Development', 'Machine learning algorithms have [BLANK_1] dramatically in recent years. These [BLANK_2] can now perform complex tasks that were previously [BLANK_3] only by humans.', 'advanced', 'advanced;declined;stagnated;failed', 'systems', 'systems;programs;methods;tools', 'possible', 'possible;impossible;difficult;easy', '', '', '', '', 'Advanced', 'Technology']
          ]
        };
        
      case 'Reading-reading-fill-blanks':
        return {
          sheetName: 'Reading Fill Blanks RW Template',
          data: [
            ['id', 'title', 'passage', 'timeLimit', 'blank1_answer', 'blank1_options', 'blank2_answer', 'blank2_options', 'blank3_answer', 'blank3_options', 'difficulty', 'category'],
            ['1', 'Climate Change Effects', 'Climate change affects weather patterns [BLANK_1] around the world, causing extreme weather events and [BLANK_2] environmental consequences.', '10', 'significantly', 'significantly;slightly;rarely;never', 'serious', 'serious;minor;positive;temporary', '', '', 'Intermediate', 'Environment'],
            ['2', 'Technology Innovation', 'Modern technology has [BLANK_1] the way people communicate and [BLANK_2] information in the digital age.', '10', 'transformed', 'transformed;complicated;limited;reduced', 'share', 'share;hide;lose;destroy', '', '', 'Beginner', 'Technology'],
            ['3', 'Economic Development', 'Sustainable economic growth requires [BLANK_1] planning and [BLANK_2] resource management to ensure long-term prosperity.', '12', 'careful', 'careful;rapid;minimal;random', 'efficient', 'efficient;wasteful;limited;expensive', '', '', 'Advanced', 'Economics']
          ]
        };
        
      case 'Reading-multiple-choice-multiple':
        return {
          sheetName: 'Multiple Choice Multiple Template',
          data: [
            ['id', 'passage', 'question', 'optionA', 'optionB', 'optionC', 'optionD', 'optionE', 'correctAnswers', 'timeLimit', 'difficulty', 'category', 'title'],
            ['1', 'The benefits of renewable energy include reduced carbon emissions, lower long-term costs, improved air quality, and enhanced energy security for nations.', 'According to the passage, what are the benefits of renewable energy?', 'Reduced carbon emissions', 'Lower energy costs', 'Increased job opportunities', 'Better air quality', 'Enhanced energy security', 'A;B;D;E', '15', 'Intermediate', 'Environment', 'Renewable Energy Benefits'],
            ['2', 'Artificial intelligence applications in healthcare include diagnostic imaging, drug discovery, personalized treatment plans, and robotic surgery assistance.', 'What AI applications in healthcare are mentioned?', 'Diagnostic imaging', 'Drug discovery', 'Patient monitoring', 'Robotic surgery', 'Treatment planning', 'A;B;D;E', '18', 'Advanced', 'Technology', 'AI in Healthcare'],
            ['3', 'Urban planning involves designing efficient transportation systems, creating green spaces, managing population density, and ensuring adequate housing.', 'What aspects of urban planning are discussed?', 'Transportation systems', 'Green spaces', 'Population density', 'Housing provision', 'Commercial development', 'A;B;C;D', '12', 'Beginner', 'Urban Planning', 'City Development']
          ]
        };
        
      case 'Reading-multiple-choice-single':
        return {
          sheetName: 'Multiple Choice Single Template',
          data: [
            ['id', 'passage', 'question', 'optionA', 'optionB', 'optionC', 'optionD', 'correctAnswer', 'timeLimit', 'difficulty', 'category', 'title'],
            ['1', 'Artificial intelligence is transforming healthcare by improving diagnosis accuracy, streamlining patient care, and enabling personalized treatment approaches.', 'What is the main topic of the passage?', 'Healthcare transformation through AI', 'Medical diagnosis improvement', 'Patient care systems', 'Treatment personalization', 'A', '12', 'Intermediate', 'Technology', 'AI in Healthcare'],
            ['2', 'Climate change poses significant challenges including rising sea levels, extreme weather events, biodiversity loss, and threats to food security.', 'What is the primary focus of this passage?', 'Environmental protection', 'Climate change challenges', 'Weather prediction', 'Food production', 'B', '10', 'Advanced', 'Environment', 'Climate Challenges'],
            ['3', 'Online education provides students with flexible learning schedules, access to global courses, and opportunities for self-paced study.', 'What is the main advantage of online education mentioned?', 'Cost effectiveness', 'Learning flexibility', 'Technology integration', 'Global accessibility', 'B', '8', 'Beginner', 'Education', 'Online Learning']
          ]
        };
        
      case 'Reading-reorder-paragraphs':
        return {
          sheetName: 'Reorder Paragraphs Template',
          data: [
            ['id', 'paragraph1', 'paragraph2', 'paragraph3', 'paragraph4', 'paragraph5', 'correctOrder', 'timeLimit', 'difficulty', 'category', 'title'],
            ['1', 'The study of climate change has become increasingly important in recent years.', 'Scientists have documented rising global temperatures and changing weather patterns.', 'These changes have significant implications for agriculture, wildlife, and human settlements.', 'Therefore, immediate action is needed to address these environmental challenges.', '', '1,2,3,4', '8', 'Intermediate', 'Environment', 'Climate Change Study'],
            ['2', 'Technology companies are investing heavily in artificial intelligence research.', 'This has led to breakthrough developments in machine learning and automation.', 'As a result, many industries are being transformed by AI applications.', 'However, concerns about job displacement and ethical implications persist.', 'Nevertheless, the potential benefits of AI continue to drive innovation forward.', '1,2,3,4,5', '10', 'Advanced', 'Technology', 'AI Development'],
            ['3', 'Many people enjoy reading books in their free time.', 'Reading helps improve vocabulary and comprehension skills.', 'It also provides entertainment and relaxation after a busy day.', 'Libraries and bookstores continue to be popular destinations for book lovers.', '', '1,2,3,4', '6', 'Beginner', 'Leisure', 'Reading Benefits']
          ]
        };
        
      // Listening Module Templates
      case 'Listening-summarize-spoken-text':
        return {
          sheetName: 'Summarize Spoken Text Template',
          data: [
            ['id', 'audioUrl', 'transcript', 'duration', 'wordLimit', 'timeLimit', 'keyPoints', 'sampleSummary', 'difficulty', 'category', 'title'],
            ['1', 'https://example.com/lecture1.mp3', 'Today I will discuss the importance of renewable energy and its benefits for the environment and economy including cost savings and sustainability.', '60', '70', '10', 'renewable energy;environmental benefits;cost savings;sustainability', 'The lecture discusses renewable energy benefits including environmental protection and cost efficiency for sustainable development.', 'Intermediate', 'Environment', 'Renewable Energy Lecture'],
            ['2', 'https://example.com/lecture2.mp3', 'Climate change research shows significant impacts on global weather patterns requiring immediate international cooperation and policy changes.', '90', '70', '10', 'climate change;research findings;weather patterns;international cooperation', 'Climate research reveals major weather pattern changes demanding urgent international cooperation and policy responses.', 'Advanced', 'Environment', 'Climate Research'],
            ['3', 'https://example.com/lecture3.mp3', 'Technology education helps students develop digital skills necessary for modern workplace success and career advancement.', '45', '70', '10', 'technology education;digital skills;workplace;career development', 'Technology education provides students with essential digital skills for workplace success and career growth.', 'Beginner', 'Education', 'Technology Education']
          ]
        };
        
      case 'Listening-multiple-choice-multiple':
        return {
          sheetName: 'Listening MC Multiple Template',
          data: [
            ['id', 'audioUrl', 'question', 'optionA', 'optionB', 'optionC', 'optionD', 'optionE', 'correctAnswers', 'transcript', 'difficulty', 'category', 'title'],
            ['1', 'https://example.com/audio1.mp3', 'What topics are discussed in the lecture?', 'Climate change', 'Renewable energy', 'Environmental protection', 'Economic benefits', 'Government policies', 'A;B;C', 'The lecture covers climate change, renewable energy, and environmental protection measures.', 'Intermediate', 'Environment', 'Environmental Topics'],
            ['2', 'https://example.com/audio2.mp3', 'Which benefits of technology are mentioned?', 'Improved communication', 'Enhanced productivity', 'Better education', 'Increased costs', 'Job automation', 'A;B;C;E', 'Technology improves communication, enhances productivity, provides better education, and enables job automation.', 'Advanced', 'Technology', 'Technology Benefits'],
            ['3', 'https://example.com/audio3.mp3', 'What aspects of healthy living are discussed?', 'Regular exercise', 'Balanced diet', 'Adequate sleep', 'Stress management', 'Expensive supplements', 'A;B;C;D', 'Healthy living includes regular exercise, balanced diet, adequate sleep, and stress management.', 'Beginner', 'Health', 'Healthy Living']
          ]
        };
        
      case 'Listening-multiple-choice-single':
        return {
          sheetName: 'Listening MC Single Template',
          data: [
            ['id', 'audioUrl', 'question', 'optionA', 'optionB', 'optionC', 'optionD', 'correctAnswer', 'transcript', 'difficulty', 'category', 'title'],
            ['1', 'https://example.com/audio1.mp3', 'What is the main topic of the discussion?', 'Technology advancement', 'Environmental issues', 'Economic development', 'Social changes', 'B', 'The discussion focuses on environmental issues and their global impact on climate and ecosystems.', 'Intermediate', 'Environment', 'Environmental Discussion'],
            ['2', 'https://example.com/audio2.mp3', 'What is the speaker\'s main point?', 'Education costs are rising', 'Online learning is effective', 'Students need more support', 'Technology is essential', 'B', 'The speaker emphasizes that online learning has proven to be highly effective for modern education.', 'Advanced', 'Education', 'Online Learning'],
            ['3', 'https://example.com/audio3.mp3', 'What does the speaker recommend?', 'More exercise', 'Better diet', 'Regular sleep', 'Less stress', 'A', 'The speaker recommends incorporating more physical exercise into daily routines for better health.', 'Beginner', 'Health', 'Health Advice']
          ]
        };
        
      case 'Listening-fill-blanks':
        return {
          sheetName: 'Listening Fill Blanks Template',
          data: [
            ['id', 'title', 'audioUrl', 'transcript', 'duration', 'blank1_answer', 'blank1_word', 'blank2_answer', 'blank2_word', 'blank3_answer', 'blank3_word', 'extraWords', 'difficulty', 'category'],
            ['1', 'Weather Report', 'https://example.com/audio1.mp3', 'Today will be [BLANK_1] with temperatures reaching [BLANK_2] degrees and [BLANK_3] skies throughout the day.', '30', 'sunny', 'sunny', '25', '25', 'clear', 'clear', 'cloudy;rainy;cold;hot;30;20', 'Beginner', 'Weather'],
            ['2', 'Technology News', 'https://example.com/audio2.mp3', 'The new [BLANK_1] technology promises to [BLANK_2] efficiency in the workplace by [BLANK_3] percent.', '45', 'artificial intelligence', 'artificial intelligence', 'improve', 'improve', 'fifty', 'fifty', 'machine learning;increase;reduce;thirty;forty', 'Intermediate', 'Technology'],
            ['3', 'Environmental Update', 'https://example.com/audio3.mp3', 'Scientists have [BLANK_1] that renewable energy [BLANK_2] will help [BLANK_3] carbon emissions significantly.', '60', 'discovered', 'discovered', 'sources', 'sources', 'reduce', 'reduce', 'found;concluded;systems;methods;increase;maintain', 'Advanced', 'Environment']
          ]
        };
        
      case 'Listening-highlight-correct-summary':
        return {
          sheetName: 'Highlight Correct Summary Template',
          data: [
            ['id', 'audioUrl', 'summaryA', 'summaryB', 'summaryC', 'correctSummary', 'transcript', 'difficulty', 'category', 'title'],
            ['1', 'https://example.com/audio1.mp3', 'The lecture discusses renewable energy benefits for environmental protection.', 'The lecture covers fossil fuel advantages for economic growth.', 'The lecture explains nuclear power safety measures and protocols.', 'A', 'Today we discuss the many benefits of renewable energy sources for environmental protection.', 'Intermediate', 'Environment', 'Energy Summary'],
            ['2', 'https://example.com/audio2.mp3', 'The speaker talks about traditional education methods and classroom learning.', 'The speaker explains online education advantages and digital learning platforms.', 'The speaker discusses university admission requirements and procedures.', 'B', 'Online education offers numerous advantages through digital platforms and flexible learning.', 'Advanced', 'Education', 'Education Methods'],
            ['3', 'https://example.com/audio3.mp3', 'The discussion focuses on unhealthy food choices and poor eating habits.', 'The discussion covers exercise equipment and gym memberships costs.', 'The discussion emphasizes healthy eating habits and balanced nutrition.', 'C', 'Maintaining healthy eating habits and balanced nutrition is essential for good health.', 'Beginner', 'Health', 'Healthy Eating']
          ]
        };
        
      case 'Listening-select-missing-word':
        return {
          sheetName: 'Select Missing Word Template',
          data: [
            ['id', 'audioUrl', 'transcript', 'missingWordPosition', 'optionA', 'optionB', 'optionC', 'optionD', 'correctAnswer', 'difficulty', 'category', 'title'],
            ['1', 'https://example.com/audio1.mp3', 'The research shows that climate change affects [BEEP] around the world significantly.', '8', 'weather', 'people', 'animals', 'plants', 'A', 'Intermediate', 'Environment', 'Climate Effects'],
            ['2', 'https://example.com/audio2.mp3', 'Modern technology has [BEEP] the way students learn and study effectively.', '4', 'complicated', 'transformed', 'limited', 'reduced', 'B', 'Advanced', 'Technology', 'Education Technology'],
            ['3', 'https://example.com/audio3.mp3', 'Regular exercise helps people maintain [BEEP] and stay physically fit.', '6', 'weight', 'health', 'energy', 'strength', 'B', 'Beginner', 'Health', 'Exercise Benefits']
          ]
        };
        
      case 'Listening-highlight-incorrect-words':
        return {
          sheetName: 'Highlight Incorrect Words Template',
          data: [
            ['id', 'audioUrl', 'transcript', 'incorrectWords', 'correctTranscript', 'difficulty', 'category', 'title'],
            ['1', 'https://example.com/audio1.mp3', 'The study shows that renewable energy is expensive and harmful to the environment.', '7,9', 'The study shows that renewable energy is affordable and beneficial to the environment.', 'Intermediate', 'Environment', 'Energy Facts'],
            ['2', 'https://example.com/audio2.mp3', 'Online education decreases student engagement and reduces learning opportunities significantly.', '3,6', 'Online education increases student engagement and expands learning opportunities significantly.', 'Advanced', 'Education', 'Online Learning'],
            ['3', 'https://example.com/audio3.mp3', 'Regular exercise weakens the immune system and causes health problems.', '3,7', 'Regular exercise strengthens the immune system and prevents health problems.', 'Beginner', 'Health', 'Exercise Effects']
          ]
        };
        
      case 'Listening-write-from-dictation':
        return {
          sheetName: 'Write From Dictation Template',
          data: [
            ['id', 'audioUrl', 'sentence', 'playCount', 'difficulty', 'category', 'keyWords', 'title'],
            ['1', 'https://example.com/audio1.mp3', 'The weather today is quite pleasant and sunny.', '3', 'Beginner', 'General', 'weather,today,pleasant,sunny', 'Weather Dictation'],
            ['2', 'https://example.com/audio2.mp3', 'Technology continues to advance rapidly in modern society.', '3', 'Intermediate', 'Technology', 'technology,advance,rapidly,society', 'Technology Progress'],
            ['3', 'https://example.com/audio3.mp3', 'Environmental conservation requires immediate global cooperation and action.', '3', 'Advanced', 'Environment', 'environmental,conservation,global,cooperation', 'Environmental Action']
          ]
        };
        
      default:
        return null;
    }
  }

  async exportQuestions(module: string, subModule: string): Promise<AdminApiResponse> {
    console.log(`📊 EXPORT Questions - Module: ${module}, SubModule: ${subModule}`);
    
    try {
      // Import XLSX library dynamically
      const XLSX = await import('xlsx');
      
      // Get existing questions from mock data
      const existingQuestions = this.getExistingQuestions(module, subModule);
      
      if (!existingQuestions || existingQuestions.length === 0) {
        return {
          success: false,
          error: `No questions found for ${module} - ${subModule}`
        };
      }
      
      // Convert questions to exportable format
      const exportData = this.convertQuestionsToExportFormat(module, subModule, existingQuestions);
      
      // Create workbook
      const workbook = XLSX.utils.book_new();
      
      // Create worksheet with exported data
      const worksheet = XLSX.utils.aoa_to_sheet(exportData.data);
         if (exportData.sheetName.length > 30) {
        const date = new Date();
        const randomNum = Math.floor(Math.random() * 10);
        exportData.sheetName = `${exportData.sheetName.substring(0, 20)}${randomNum}${date.getTime()}`;
        exportData.sheetName = exportData.sheetName.substring(0, 30);
      }

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, exportData.sheetName);
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
      // Create blob and download
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${module}_${subModule}_Questions_Export.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return {
        success: true,
        data: { exportedCount: existingQuestions.length },
        message: `Successfully exported ${existingQuestions.length} ${subModule} questions from ${module} module`
      };
    } catch (error) {
      console.error('Error exporting questions:', error);
      return {
        success: false,
        error: 'Failed to export questions'
      };
    }
  }

  // Get existing questions from mock data
  private getExistingQuestions(module: string, subModule: string): any[] {
    const key = `${module}-${subModule}`;
    
    try {
      switch (key) {
        // Speaking
        case 'Speaking-read-aloud':
          return require('../components/practice/speaking/read-a-loud/ReadALoudMockData').readAloudQuestions || [];
        case 'Speaking-repeat-sentence':
          return require('../components/practice/speaking/repeat-sectence/RepeatSentenceMockData').REPEAT_SENTENCE_QUESTIONS || [];
        case 'Speaking-answer-short-questions':
          return require('../components/practice/speaking/answer-short-questions/questionTopics').questionTopics || [];
        case 'Speaking-retell-lecture':
          return require('../components/practice/speaking/re-tell-leacture/audioTopic').audioTopics || [];
        
        // Writing
        case 'Writing-summarize-text':
          return require('../components/practice/Writing/summarize-text/textPassages').textPassages || [];
        case 'Writing-write-email':
          return require('../components/practice/Writing/emailWriting/emailMockData').emailScenarios || [];
        case 'Writing-writing-essay':
          return require('../components/practice/Writing/writing-essay/constants').ESSAY_QUESTIONS || [];
        
        // Reading
        case 'Reading-fill-blanks':
          return require('../components/practice/Reading/fillin-blanks/FillInBlanksMockData').questions || [];
        case 'Reading-reading-fill-blanks':
          return require('../components/practice/Reading/ReadingFillInTheBlanks/ReadingFillInTheBlanksMockData').mockReadingPassages || [];
        case 'Reading-multiple-choice-multiple':
          return require('../components/practice/Reading/multiple-choice/multipleChoiceQuestions').multipleChoiceQuestions || [];
        case 'Reading-multiple-choice-single':
          return require('../components/practice/Reading/multiple-choice-single/mutlipleChoiceSingleMockData').allMultipleChoiceQuestions?.slice(0, 20) || [];
        case 'Reading-reorder-paragraphs':
          return require('../components/practice/Reading/re-order-paragraphs/constants').QUESTIONS || [];
        
        // Listening
        case 'Listening-summarize-spoken-text':
          return require('../components/practice/Listening/SummarizeSpokenText/SummarizeSpokenTextMockData').allSummarizeSpokenTextTopics?.slice(0, 15) || [];
        case 'Listening-multiple-choice-multiple':
          return require('../components/practice/Listening/MultipleChoiceMultiple/MutlipleChoiceMultipleMockData').listeningMultipleChoiceQuestions || [];
        case 'Listening-fill-blanks':
          return require('../components/practice/Listening/FillinTheBlanks/FillinTheBlanksMockData').mockListeningPassages || [];
        case 'Listening-highlight-correct-summary':
          return require('../components/practice/Listening/HighlightCorrectSummary/HighlightCorrectSummaryMockData').mockHighlightSummaryQuestions || [];
        case 'Listening-select-missing-word':
          return require('../components/practice/Listening/SelectMissingWord/SelectMissingWordMockData').mockSelectMissingWordQuestions || [];
        case 'Listening-highlight-incorrect-words':
          return require('../components/practice/Listening/HighlightIncorrectWords/HighlightIncorrectWordsMockData').mockHighlightIncorrectWordsQuestions || [];
        case 'Listening-write-from-dictation':
          return require('../components/practice/Listening/WriteFromDictation/WriteFromDictationMockData').mockWriteFromDictationQuestions || [];
        
        default:
          return [];
      }
    } catch (error) {
      console.warn(`Could not load mock data for ${key}:`, error);
      return [];
    }
  }

  // Convert questions to export format
  private convertQuestionsToExportFormat(module: string, subModule: string, questions: any[]): { data: any[][], sheetName: string } {
    const key = `${module}-${subModule}`;
    
    switch (key) {
      // Speaking Module Exports
      case 'Speaking-read-aloud':
        return {
          sheetName: 'Read Aloud Questions',
          data: [
            ['id', 'text', 'preparationTime', 'recordingTime', 'difficulty', 'category', 'tags', 'expectedAnswer', 'title'],
            ...questions.map(q => [
              q.id,
              q.text || '',
              q.preparationTime || 40,
              q.recordingTime || 40,
              q.difficulty || 'Beginner',
              q.category || '',
              Array.isArray(q.tags) ? q.tags.join(',') : q.tags || '',
              q.expectedAnswer || '',
              q.title || ''
            ])
          ]
        };
        
      case 'Speaking-repeat-sentence':
        return {
          sheetName: 'Repeat Sentence Questions',
          data: [
            ['id', 'audioUrl', 'sentence', 'recordingTime', 'difficulty', 'category', 'tags', 'title'],
            ...questions.map(q => [
              q.id,
              q.audioUrl || '',
              q.sentence || q.text || '',
              q.recordingTime || 15,
              q.difficulty || 'Beginner',
              q.category || '',
              Array.isArray(q.tags) ? q.tags.join(',') : q.tags || '',
              q.title || ''
            ])
          ]
        };
        
      case 'Speaking-answer-short-questions':
        return {
          sheetName: 'Answer Short Questions',
          data: [
            ['id', 'audioUrl', 'question', 'correctAnswer', 'acceptableAnswers', 'difficulty', 'category', 'tags', 'title'],
            ...questions.map(q => [
              q.id,
              q.audioUrl || '',
              q.question || q.questionText || '',
              q.correctAnswer || q.answer || '',
              q.acceptableAnswers || '',
              q.difficulty || 'Beginner',
              q.category || '',
              Array.isArray(q.tags) ? q.tags.join(',') : q.tags || '',
              q.title || ''
            ])
          ]
        };
        
      case 'Speaking-retell-lecture':
        return {
          sheetName: 'Retell Lecture Questions',
          data: [
            ['id', 'audioUrl', 'transcript', 'duration', 'keyPoints', 'subject', 'preparationTime', 'speakingTime', 'difficulty', 'category', 'title'],
            ...questions.map(q => [
              q.id,
              q.audioUrl || '',
              q.transcript || q.audioText || '',
              q.duration || 60,
              Array.isArray(q.keyPoints) ? q.keyPoints.join(';') : q.keyPoints || '',
              q.subject || q.category || '',
              q.preparationTime || 10,
              q.speakingTime || 40,
              q.difficulty || 'Beginner',
              q.category || '',
              q.title || ''
            ])
          ]
        };
        
      // Writing Module Exports
      case 'Writing-summarize-text':
        return {
          sheetName: 'Summarize Text Questions',
          data: [
            ['id', 'passage', 'wordLimit', 'timeLimit', 'sampleSummary', 'keyIdeas', 'difficulty', 'category', 'title'],
            ...questions.map(q => [
              q.id,
              q.passage || q.text || '',
              q.wordLimit || 75,
              q.timeLimit || 10,
              q.sampleSummary || q.sampleAnswer || '',
              Array.isArray(q.keyIdeas) ? q.keyIdeas.join(';') : q.keyIdeas || '',
              q.difficulty || 'Beginner',
              q.category || '',
              q.title || ''
            ])
          ]
        };
        
      case 'Writing-write-email':
        return {
          sheetName: 'Write Email Questions',
          data: [
            ['id', 'scenario', 'recipient', 'purpose', 'keyPoints', 'wordLimit', 'timeLimit', 'tone', 'sampleEmail', 'difficulty', 'category', 'title'],
            ...questions.map(q => [
              q.id,
              q.scenario || q.situation || '',
              q.recipient || '',
              q.purpose || '',
              Array.isArray(q.keyPoints) ? q.keyPoints.join(';') : q.keyPoints || '',
              q.wordLimit || 120,
              q.timeLimit || 20,
              q.tone || 'formal',
              q.sampleEmail || '',
              q.difficulty || 'Beginner',
              q.category || '',
              q.title || ''
            ])
          ]
        };
        
      case 'Writing-writing-essay':
        return {
          sheetName: 'Writing Essay Questions',
          data: [
            ['id', 'prompt', 'essayType', 'wordLimit', 'timeLimit', 'rubricContent', 'rubricForm', 'rubricGrammar', 'rubricVocabulary', 'sampleEssay', 'difficulty', 'category', 'title'],
            ...questions.map(q => [
              q.id,
              q.prompt || q.questionText || '',
              q.essayType || 'agree-disagree',
              q.wordLimit || 300,
              q.timeLimit || 20,
              q.rubricContent || '',
              q.rubricForm || '',
              q.rubricGrammar || '',
              q.rubricVocabulary || '',
              q.sampleEssay || '',
              q.difficulty || 'Beginner',
              q.category || '',
              q.title || ''
            ])
          ]
        };
        
      // Reading Module Exports
      case 'Reading-fill-blanks':
        return {
          sheetName: 'Reading Fill Blanks Questions',
          data: [
            ['id', 'title', 'text', 'blank1_answer', 'blank1_options', 'blank2_answer', 'blank2_options', 'blank3_answer', 'blank3_options', 'blank4_answer', 'blank4_options', 'blank5_answer', 'blank5_options', 'difficulty', 'category'],
            ...questions.map(q => {
              const blanks = q.blanks || [];
              return [
                q.id,
                q.title || '',
                q.text || '',
                blanks[0]?.correctAnswer || '',
                blanks[0]?.options?.join(';') || '',
                blanks[1]?.correctAnswer || '',
                blanks[1]?.options?.join(';') || '',
                blanks[2]?.correctAnswer || '',
                blanks[2]?.options?.join(';') || '',
                blanks[3]?.correctAnswer || '',
                blanks[3]?.options?.join(';') || '',
                blanks[4]?.correctAnswer || '',
                blanks[4]?.options?.join(';') || '',
                q.difficulty || 'Beginner',
                q.category || ''
              ];
            })
          ]
        };
        
      case 'Reading-reading-fill-blanks':
        return {
          sheetName: 'Reading Fill Blanks RW Questions',
          data: [
            ['id', 'title', 'passage', 'timeLimit', 'blank1_answer', 'blank1_options', 'blank2_answer', 'blank2_options', 'blank3_answer', 'blank3_options', 'difficulty', 'category'],
            ...questions.map(q => {
              const blanks = q.blanks || [];
              return [
                q.id,
                q.title || '',
                q.passage || q.text || '',
                q.timeLimit || 10,
                blanks[0]?.correctAnswer || '',
                blanks[0]?.options?.join(';') || '',
                blanks[1]?.correctAnswer || '',
                blanks[1]?.options?.join(';') || '',
                blanks[2]?.correctAnswer || '',
                blanks[2]?.options?.join(';') || '',
                q.difficulty || 'Beginner',
                q.category || ''
              ];
            })
          ]
        };
        
      case 'Reading-multiple-choice-multiple':
        return {
          sheetName: 'Multiple Choice Multiple Questions',
          data: [
            ['id', 'passage', 'question', 'optionA', 'optionB', 'optionC', 'optionD', 'optionE', 'correctAnswers', 'timeLimit', 'difficulty', 'category', 'title'],
            ...questions.map(q => [
              q.id,
              q.passage || q.text || '',
              q.question || q.questionText || '',
              q.options?.[0] || q.optionA || '',
              q.options?.[1] || q.optionB || '',
              q.options?.[2] || q.optionC || '',
              q.options?.[3] || q.optionD || '',
              q.options?.[4] || q.optionE || '',
              Array.isArray(q.correctAnswers) ? q.correctAnswers.join(';') : q.correctAnswers || '',
              q.timeLimit || 15,
              q.difficulty || 'Beginner',
              q.category || '',
              q.title || ''
            ])
          ]
        };
        
      case 'Reading-multiple-choice-single':
        return {
          sheetName: 'Multiple Choice Single Questions',
          data: [
            ['id', 'passage', 'question', 'optionA', 'optionB', 'optionC', 'optionD', 'correctAnswer', 'timeLimit', 'difficulty', 'category', 'title'],
            ...questions.map(q => [
              q.id,
              q.passage || q.text || '',
              q.question || q.questionText || '',
              q.options?.[0] || q.optionA || '',
              q.options?.[1] || q.optionB || '',
              q.options?.[2] || q.optionC || '',
              q.options?.[3] || q.optionD || '',
              q.correctAnswer || '',
              q.timeLimit || 12,
              q.difficulty || 'Beginner',
              q.category || '',
              q.title || ''
            ])
          ]
        };
        
      case 'Reading-reorder-paragraphs':
        return {
          sheetName: 'Reorder Paragraphs Questions',
          data: [
            ['id', 'paragraph1', 'paragraph2', 'paragraph3', 'paragraph4', 'paragraph5', 'correctOrder', 'timeLimit', 'difficulty', 'category', 'title'],
            ...questions.map(q => [
              q.id,
              q.paragraphs?.[0] || q.paragraph1 || '',
              q.paragraphs?.[1] || q.paragraph2 || '',
              q.paragraphs?.[2] || q.paragraph3 || '',
              q.paragraphs?.[3] || q.paragraph4 || '',
              q.paragraphs?.[4] || q.paragraph5 || '',
              Array.isArray(q.correctOrder) ? q.correctOrder.join(',') : q.correctOrder || '',
              q.timeLimit || 8,
              q.difficulty || 'Beginner',
              q.category || '',
              q.title || ''
            ])
          ]
        };
        
      // Listening Module Exports - Enhanced with Audio Support
      case 'Listening-summarize-spoken-text':
        return {
          sheetName: 'Summarize Spoken Text Questions',
          data: [
            ['id', 'title', 'audioUrl', 'audioText', 'audioFormat', 'audioDuration', 'audioTitle', 'transcript', 'wordLimitMin', 'wordLimitMax', 'timeLimit', 'keyPoints', 'sampleSummary', 'difficulty', 'category', 'tags'],
            ...questions.map(q => [
              q.id,
              q.title || '',
              q.audio?.audioUrl || q.audioUrl || '',
              q.audio?.audioText || q.audioText || '',
              q.audio?.audioFormat || q.audioFormat || '',
              q.audio?.audioDuration || q.audioDuration || '',
              q.audio?.audioTitle || q.audioTitle || '',
              q.transcript || q.audioText || '',
              q.wordLimit?.min || 50,
              q.wordLimit?.max || 70,
              q.timeLimit || 10,
              Array.isArray(q.keyPoints) ? q.keyPoints.join(';') : q.keyPoints || '',
              q.sampleSummary || '',
              q.difficulty || 'Beginner',
              q.category || '',
              Array.isArray(q.tags) ? q.tags.join(',') : q.tags || ''
            ])
          ]
        };
        
      case 'Listening-multiple-choice-multiple':
        return {
          sheetName: 'Listening MC Multiple Questions',
          data: [
            ['id', 'title', 'audioUrl', 'audioText', 'audioFormat', 'audioDuration', 'audioTitle', 'question', 'optionA', 'optionB', 'optionC', 'optionD', 'optionE', 'correctAnswers', 'transcript', 'speaker', 'difficulty', 'category', 'tags'],
            ...questions.map(q => [
              q.id,
              q.title || '',
              q.audio?.audioUrl || q.audioUrl || '',
              q.audio?.audioText || q.audioText || '',
              q.audio?.audioFormat || q.audioFormat || '',
              q.audio?.audioDuration || q.audioDuration || '',
              q.audio?.audioTitle || q.audioTitle || '',
              q.question || q.questionText || '',
              q.options?.[0] || q.optionA || '',
              q.options?.[1] || q.optionB || '',
              q.options?.[2] || q.optionC || '',
              q.options?.[3] || q.optionD || '',
              q.options?.[4] || q.optionE || '',
              Array.isArray(q.correctAnswers) ? q.correctAnswers.join(';') : q.correctAnswers || '',
              q.transcript || '',
              q.speaker || '',
              q.difficulty || 'Beginner',
              q.category || '',
              Array.isArray(q.tags) ? q.tags.join(',') : q.tags || ''
            ])
          ]
        };
        
      case 'Listening-multiple-choice-single':
        return {
          sheetName: 'Listening MC Single Questions',
          data: [
            ['id', 'title', 'audioUrl', 'audioText', 'audioFormat', 'audioDuration', 'audioTitle', 'question', 'optionA', 'optionB', 'optionC', 'optionD', 'correctAnswer', 'transcript', 'speaker', 'difficulty', 'category', 'tags'],
            ...questions.map(q => [
              q.id,
              q.title || '',
              q.audio?.audioUrl || q.audioUrl || '',
              q.audio?.audioText || q.audioText || '',
              q.audio?.audioFormat || q.audioFormat || '',
              q.audio?.audioDuration || q.audioDuration || '',
              q.audio?.audioTitle || q.audioTitle || '',
              q.question || q.questionText || '',
              q.options?.[0] || q.optionA || '',
              q.options?.[1] || q.optionB || '',
              q.options?.[2] || q.optionC || '',
              q.options?.[3] || q.optionD || '',
              q.correctAnswer || '',
              q.transcript || '',
              q.speaker || '',
              q.difficulty || 'Beginner',
              q.category || '',
              Array.isArray(q.tags) ? q.tags.join(',') : q.tags || ''
            ])
          ]
        };
        
      case 'Listening-fill-blanks':
        return {
          sheetName: 'Listening Fill Blanks Questions',
          data: [
            ['id', 'title', 'audioUrl', 'audioText', 'audioFormat', 'audioDuration', 'audioTitle', 'text', 'wordBank', 'speaker', 'instructions', 'maxScore', 'timeLimit', 'difficulty', 'category', 'tags'],
            ...questions.map(q => [
              q.id,
              q.title || '',
              q.audio?.audioUrl || q.audioUrl || '',
              q.audio?.audioText || q.audioText || '',
              q.audio?.audioFormat || q.audioFormat || '',
              q.audio?.audioDuration || q.audioDuration || '',
              q.audio?.audioTitle || q.audioTitle || '',
              q.text || '',
              Array.isArray(q.wordBank) ? q.wordBank.join(';') : q.wordBank || '',
              q.speaker || '',
              q.instructions || '',
              q.maxScore || 100,
              q.timeLimit || 900,
              q.difficulty || 'Beginner',
              q.category || '',
              Array.isArray(q.tags) ? q.tags.join(',') : q.tags || ''
            ])
          ]
        };
        
      case 'Listening-highlight-correct-summary':
        return {
          sheetName: 'Highlight Correct Summary Questions',
          data: [
            ['id', 'title', 'audioUrl', 'audioText', 'audioFormat', 'audioDuration', 'audioTitle', 'summaryA', 'summaryB', 'summaryC', 'correctSummary', 'transcript', 'speaker', 'instructions', 'maxScore', 'timeLimit', 'difficulty', 'category', 'tags'],
            ...questions.map(q => [
              q.id,
              q.title || '',
              q.audio?.audioUrl || q.audioUrl || '',
              q.audio?.audioText || q.audioText || '',
              q.audio?.audioFormat || q.audioFormat || '',
              q.audio?.audioDuration || q.audioDuration || '',
              q.audio?.audioTitle || q.audioTitle || '',
              q.summaries?.[0] || q.summaryA || '',
              q.summaries?.[1] || q.summaryB || '',
              q.summaries?.[2] || q.summaryC || '',
              q.correctSummary || '',
              q.transcript || '',
              q.speaker || '',
              q.instructions || '',
              q.maxScore || 100,
              q.timeLimit || 900,
              q.difficulty || 'Beginner',
              q.category || '',
              Array.isArray(q.tags) ? q.tags.join(',') : q.tags || ''
            ])
          ]
        };
        
      case 'Listening-select-missing-word':
        return {
          sheetName: 'Select Missing Word Questions',
          data: [
            ['id', 'title', 'audioUrl', 'audioText', 'audioFormat', 'audioDuration', 'audioTitle', 'missingWordPosition', 'optionA', 'optionB', 'optionC', 'correctAnswer', 'speaker', 'instructions', 'difficulty', 'category', 'tags'],
            ...questions.map(q => [
              q.id,
              q.title || '',
              q.audio?.audioUrl || q.audioUrl || '',
              q.audio?.audioText || q.audioText || '',
              q.audio?.audioFormat || q.audioFormat || '',
              q.audio?.audioDuration || q.audioDuration || '',
              q.audio?.audioTitle || q.audioTitle || '',
              q.missingWordPosition || '',
              q.options?.[0] || q.optionA || '',
              q.options?.[1] || q.optionB || '',
              q.options?.[2] || q.optionC || '',
              q.correctAnswer || '',
              q.speaker || '',
              q.instructions || '',
              q.difficulty || 'Beginner',
              q.category || '',
              Array.isArray(q.tags) ? q.tags.join(',') : q.tags || ''
            ])
          ]
        };
        
      case 'Listening-highlight-incorrect-words':
        return {
          sheetName: 'Highlight Incorrect Words Questions',
          data: [
            ['id', 'title', 'audioUrl', 'audioText', 'audioFormat', 'audioDuration', 'audioTitle', 'displayText', 'incorrectWords', 'speaker', 'instructions', 'maxScore', 'timeLimit', 'difficulty', 'category', 'tags'],
            ...questions.map(q => [
              q.id,
              q.title || '',
              q.audio?.audioUrl || q.audioUrl || '',
              q.audio?.audioText || q.audioText || '',
              q.audio?.audioFormat || q.audioFormat || '',
              q.audio?.audioDuration || q.audioDuration || '',
              q.audio?.audioTitle || q.audioTitle || '',
              q.displayText || q.audioText || '',
              Array.isArray(q.incorrectWords) ? q.incorrectWords.join(';') : q.incorrectWords || '',
              q.speaker || '',
              q.instructions || '',
              q.maxScore || 100,
              q.timeLimit || 1200,
              q.difficulty || 'Beginner',
              q.category || '',
              Array.isArray(q.tags) ? q.tags.join(',') : q.tags || ''
            ])
          ]
        };
        
      case 'Listening-write-from-dictation':
        return {
          sheetName: 'Write From Dictation Questions',
          data: [
            ['id', 'title', 'audioUrl', 'audioText', 'audioFormat', 'audioDuration', 'audioTitle', 'keyWords', 'acceptableVariations', 'maxScore', 'timeLimit', 'instructions', 'difficulty', 'category', 'tags'],
            ...questions.map(q => [
              q.id,
              q.title || '',
              q.audio?.audioUrl || q.audioUrl || '',
              q.audio?.audioText || q.audioText || '',
              q.audio?.audioFormat || q.audioFormat || '',
              q.audio?.audioDuration || q.audioDuration || '',
              q.audio?.audioTitle || q.audioTitle || '',
              Array.isArray(q.keyWords) ? q.keyWords.join(';') : q.keyWords || '',
              typeof q.acceptableVariations === 'object' ? JSON.stringify(q.acceptableVariations) : q.acceptableVariations || '',
              q.maxScore || 100,
              q.timeLimit || 600,
              q.instructions || '',
              q.difficulty || 'Beginner',
              q.category || '',
              Array.isArray(q.tags) ? q.tags.join(',') : q.tags || ''
            ])
          ]
        };
        
      default:
        // If no specific format is defined, create a basic format
        return {
          sheetName: `${module} ${subModule} Questions`,
          data: [
            ['id', 'title', 'difficulty', 'category', 'content'],
            ...questions.map(q => [
              q.id,
              q.title || q.questionText || `Question ${q.id}`,
              q.difficulty || 'Beginner',
              q.category || 'General',
              q.text || q.passage || q.question || JSON.stringify(q)
            ])
          ]
        };
    }
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