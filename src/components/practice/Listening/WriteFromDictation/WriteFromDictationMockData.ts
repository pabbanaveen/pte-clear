import { WriteFromDictationQuestion, StudentProgress } from "./WriteFromDictationTypes";

export const mockWriteFromDictationQuestions: WriteFromDictationQuestion[] = [
  // Beginner Level
  {
    id: 1,
    title: 'Simple Daily Activities',
    difficulty: 'Beginner',
    timeLimit: 600, // 10 minutes
    category: 'Daily Life',
    tags: ['daily', 'routine', 'simple'],
    maxScore: 100,
    type: 'question',
    speaker: 'Native Speaker',
    audioText: `I usually wake up at seven o'clock in the morning and have breakfast with my family.`,
    keyWords: ['wake', 'seven', 'morning', 'breakfast', 'family'],
    acceptableVariations: {
      'seven': ['7', 'seven'],
      "o'clock": ['oclock', 'o clock'],
      'breakfast': ['break fast']
    },
    instructions: 'You will hear a sentence. Type the sentence in the box below exactly as you hear it. Write as much of the sentence as you can. You will hear the sentence only once.',
    explanation: 'This sentence tests basic daily routine vocabulary and simple present tense structure.',
    isNew: false,
    isMarked: false,
    pracStatus: 'Undone',
    hasExplanation: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },

  // Beginner Level
  {
    id: 2,
    title: 'Weather Description',
    difficulty: 'Beginner',
    timeLimit: 600,
    category: 'Weather',
    tags: ['weather', 'description', 'simple'],
    maxScore: 100,
    type: 'question',
    speaker: 'Native Speaker',
    audioText: `Today is sunny and warm, perfect weather for a picnic in the park.`,
    keyWords: ['sunny', 'warm', 'perfect', 'picnic', 'park'],
    acceptableVariations: {
      'picnic': ['pic nic'],
      'weather': ['wheather']
    },
    instructions: 'You will hear a sentence. Type the sentence in the box below exactly as you hear it. Write as much of the sentence as you can. You will hear the sentence only once.',
    explanation: 'This sentence focuses on weather adjectives and common outdoor activity vocabulary.',
    isNew: true,
    isMarked: false,
    pracStatus: 'Undone',
    hasExplanation: true,
    createdAt: '2024-01-14T14:30:00Z',
    updatedAt: '2024-01-14T14:30:00Z'
  },

  // Intermediate Level
  {
    id: 3,
    title: 'Academic Discussion',
    difficulty: 'Intermediate',
    timeLimit: 900, // 15 minutes
    category: 'Education',
    tags: ['academic', 'education', 'complex'],
    maxScore: 150,
    type: 'question',
    speaker: 'Professor',
    audioText: `The research methodology employed in this study demonstrates a comprehensive approach to analyzing contemporary socioeconomic patterns.`,
    keyWords: ['research', 'methodology', 'comprehensive', 'analyzing', 'socioeconomic', 'patterns'],
    acceptableVariations: {
      'methodology': ['methodolgy'],
      'comprehensive': ['comprehnsive'],
      'socioeconomic': ['socio-economic', 'socio economic'],
      'analyzing': ['analysing']
    },
    instructions: 'You will hear a sentence. Type the sentence in the box below exactly as you hear it. Write as much of the sentence as you can. You will hear the sentence only once.',
    explanation: 'This sentence tests academic vocabulary and complex sentence structure with formal register.',
    isNew: false,
    isMarked: true,
    pracStatus: 'In Progress',
    hasExplanation: true,
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  },

  // Intermediate Level
  {
    id: 4,
    title: 'Technology and Society',
    difficulty: 'Intermediate',
    timeLimit: 900,
    category: 'Technology',
    tags: ['technology', 'society', 'modern'],
    maxScore: 150,
    type: 'question',
    speaker: 'Technology Expert',
    audioText: `Digital transformation has revolutionized business operations, enabling companies to streamline processes and enhance customer experiences significantly.`,
    keyWords: ['digital', 'transformation', 'revolutionized', 'operations', 'streamline', 'enhance', 'experiences'],
    acceptableVariations: {
      'revolutionized': ['revolutionised'],
      'streamline': ['stream line'],
      'significantly': ['significently']
    },
    instructions: 'You will hear a sentence. Type the sentence in the box below exactly as you hear it. Write as much of the sentence as you can. You will hear the sentence only once.',
    explanation: 'This sentence focuses on business and technology vocabulary with complex grammatical structures.',
    isNew: true,
    isMarked: false,
    pracStatus: 'Undone',
    hasExplanation: true,
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-12T16:45:00Z'
  },

  // Advanced Level
  {
    id: 5,
    title: 'Environmental Policy',
    difficulty: 'Advanced',
    timeLimit: 1200, // 20 minutes
    category: 'Environment',
    tags: ['environment', 'policy', 'complex'],
    maxScore: 200,
    type: 'question',
    speaker: 'Policy Analyst',
    audioText: `The implementation of stringent environmental regulations necessitates unprecedented collaboration between governmental agencies, multinational corporations, and grassroots environmental organizations.`,
    keyWords: ['implementation', 'stringent', 'regulations', 'necessitates', 'unprecedented', 'collaboration', 'governmental', 'multinational', 'grassroots'],
    acceptableVariations: {
      'stringent': ['stringant'],
      'necessitates': ['necesitates'],
      'unprecedented': ['unprecidented'],
      'governmental': ['govermental'],
      'multinational': ['multi-national', 'multi national'],
      'grassroots': ['grass-roots', 'grass roots']
    },
    instructions: 'You will hear a sentence. Type the sentence in the box below exactly as you hear it. Write as much of the sentence as you can. You will hear the sentence only once.',
    explanation: 'This advanced sentence tests complex vocabulary, formal register, and sophisticated grammatical structures.',
    isNew: false,
    isMarked: false,
    pracStatus: 'Done',
    hasExplanation: true,
    createdAt: '2024-01-11T11:20:00Z',
    updatedAt: '2024-01-11T11:20:00Z'
  },

  // Advanced Level
  {
    id: 6,
    title: 'Scientific Research',
    difficulty: 'Advanced',
    timeLimit: 1200,
    category: 'Science',
    tags: ['science', 'research', 'academic'],
    maxScore: 200,
    type: 'question',
    speaker: 'Research Scientist',
    audioText: `The paradigmatic shift in quantum mechanics fundamentally challenged conventional understanding of physical reality, prompting extensive philosophical debates about the nature of observation and measurement.`,
    keyWords: ['paradigmatic', 'quantum', 'mechanics', 'fundamentally', 'challenged', 'conventional', 'philosophical', 'observation', 'measurement'],
    acceptableVariations: {
      'paradigmatic': ['paradigmattic'],
      'quantum': ['quantam'],
      'fundamentally': ['fundementally'],
      'conventional': ['convential'],
      'philosophical': ['philosofical'],
      'observation': ['observasion']
    },
    instructions: 'You will hear a sentence. Type the sentence in the box below exactly as you hear it. Write as much of the sentence as you can. You will hear the sentence only once.',
    explanation: 'This sentence tests advanced scientific vocabulary and complex abstract concepts.',
    isNew: true,
    isMarked: true,
    pracStatus: 'Undone',
    hasExplanation: true,
    createdAt: '2024-01-10T08:30:00Z',
    updatedAt: '2024-01-10T08:30:00Z'
  },

  // Beginner Level
  {
    id: 7,
    title: 'Shopping Experience',
    difficulty: 'Beginner',
    timeLimit: 600,
    category: 'Shopping',
    tags: ['shopping', 'daily', 'routine'],
    maxScore: 100,
    type: 'question',
    speaker: 'Native Speaker',
    audioText: `She bought three apples, two bananas, and a bottle of orange juice at the supermarket.`,
    keyWords: ['bought', 'three', 'apples', 'bananas', 'bottle', 'orange', 'juice', 'supermarket'],
    acceptableVariations: {
      'three': ['3'],
      'two': ['2'],
      'orange': ['ornge'],
      'supermarket': ['super market']
    },
    instructions: 'You will hear a sentence. Type the sentence in the box below exactly as you hear it. Write as much of the sentence as you can. You will hear the sentence only once.',
    explanation: 'This sentence tests numbers, food vocabulary, and past tense verbs.',
    isNew: false,
    isMarked: false,
    pracStatus: 'Undone',
    hasExplanation: true,
    createdAt: '2024-01-09T15:45:00Z',
    updatedAt: '2024-01-09T15:45:00Z'
  },

  // Intermediate Level
  {
    id: 8,
    title: 'Cultural Heritage',
    difficulty: 'Intermediate',
    timeLimit: 900,
    category: 'Culture',
    tags: ['culture', 'heritage', 'history'],
    maxScore: 150,
    type: 'question',
    speaker: 'Cultural Historian',
    audioText: `The preservation of cultural heritage sites requires delicate balance between accessibility for tourists and protection of irreplaceable historical artifacts.`,
    keyWords: ['preservation', 'heritage', 'requires', 'delicate', 'balance', 'accessibility', 'tourists', 'protection', 'irreplaceable', 'artifacts'],
    acceptableVariations: {
      'preservation': ['preservasion'],
      'heritage': ['herritage'],
      'delicate': ['delecate'],
      'accessibility': ['accesibility'],
      'irreplaceable': ['ireplaceable'],
      'artifacts': ['artefacts']
    },
    instructions: 'You will hear a sentence. Type the sentence in the box below exactly as you hear it. Write as much of the sentence as you can. You will hear the sentence only once.',
    explanation: 'This sentence focuses on cultural and historical vocabulary with complex ideas.',
    isNew: false,
    isMarked: true,
    pracStatus: 'Undone',
    hasExplanation: true,
    createdAt: '2024-01-08T12:15:00Z',
    updatedAt: '2024-01-08T12:15:00Z'
  }
];

export const mockStudentProgress: StudentProgress = {
  studentName: 'Simple Daily Activities',
  questionNumber: 448,
  testedCount: 23,
  totalQuestions: 800,
  currentStreak: 4,
  averageScore: 84.7
};

export const difficultySettings = {
  Beginner: {
    timeLimit: 600, // 10 minutes
    maxScore: 100,
    passingScore: 70,
    keyWordWeight: 2.0,
    regularWordWeight: 1.0
  },
  Intermediate: {
    timeLimit: 900, // 15 minutes
    maxScore: 150,
    passingScore: 75,
    keyWordWeight: 2.5,
    regularWordWeight: 1.0
  },
  Advanced: {
    timeLimit: 1200, // 20 minutes
    maxScore: 200,
    passingScore: 80,
    keyWordWeight: 3.0,
    regularWordWeight: 1.0
  }
};