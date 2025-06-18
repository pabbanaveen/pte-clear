import { ListeningMultipleChoiceQuestion } from './MultipleChoiceMultipleType';

// Using placeholder audio URLs - these are 10-second sample audio files
export const listeningMultipleChoiceQuestions: ListeningMultipleChoiceQuestion[] = [
  {
    id: 1,
    title: 'Weight Gain After Marriage',
    category: 'Health & Psychology',
    difficulty: 'Intermediate',
    timeLimit: 5,
    testSensitivity: 'Audio',
    type: 'question',
    speaker: 'Dr. Sarah Johnson',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: "10",
    question: 'Why are married people more likely to gain weight?',
    options: [
      {
        id: 'A',
        text: 'Because they have regular dining partners and probably have more meals.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Because people\'s life is less stressful after marriage.',
        isCorrect: true
      },
      {
        id: 'C',
        text: 'Because they don\'t need to find a mate anymore and care less about their weight.',
        isCorrect: true
      },
      {
        id: 'D',
        text: 'Because they are happier after marriage and eat more.',
        isCorrect: true
      },
      {
        id: 'E',
        text: 'Because their partners require them to eat more.',
        isCorrect: false
      }
    ],
    explanation: 'According to the audio, married people gain weight due to having regular dining partners (A), less stressful life (B), not needing to attract mates (C), and being happier (D). Option E is not mentioned in the recording.',
    tags: ['marriage', 'health', 'psychology', 'weight gain'],
    isNew: true,
    isMarked: false,
    pracStatus: 'Undone',
    hasExplanation: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 2,
    title: 'Climate Change Impacts on Arctic Wildlife',
    category: 'Environment & Science',
    difficulty: 'Advanced',
    timeLimit: 5,
    testSensitivity: 'Audio',
    type: 'question',
    speaker: 'Prof. Michael Chen',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: "12",
    question: 'According to the lecture, which statements about Arctic wildlife and climate change are correct?',
    options: [
      {
        id: 'A',
        text: 'Polar bears are struggling to find food due to melting sea ice.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Arctic foxes are benefiting from warmer temperatures.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Seal populations are declining due to habitat loss.',
        isCorrect: true
      },
      {
        id: 'D',
        text: 'Migration patterns of Arctic birds have remained unchanged.',
        isCorrect: false
      },
      {
        id: 'E',
        text: 'Walrus populations are forced to gather in larger groups on land.',
        isCorrect: true
      },
      {
        id: 'F',
        text: 'The Arctic ecosystem is adapting quickly to temperature changes.',
        isCorrect: false
      }
    ],
    explanation: 'The correct answers are A, C, and E. The lecture discusses how polar bears struggle with hunting due to melting ice, seal habitat loss, and walruses being forced to congregate on land in larger numbers.',
    tags: ['climate change', 'arctic', 'wildlife', 'ecology'],
    isNew: false,
    isMarked: true,
    pracStatus: 'In Progress',
    hasExplanation: true,
    createdAt: '2024-01-12',
    updatedAt: '2024-01-20'
  },
  {
    id: 3,
    title: 'Online Learning Effectiveness',
    category: 'Education & Technology',
    difficulty: 'Beginner',
    timeLimit: 5,
    testSensitivity: 'Audio',
    type: 'question',
    speaker: 'Dr. Lisa Rodriguez',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: "9",
    question: 'What does the speaker say about online learning?',
    options: [
      {
        id: 'A',
        text: 'Online learning is always less effective than classroom learning.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'Students can learn at their own pace with online courses.',
        isCorrect: true
      },
      {
        id: 'C',
        text: 'Technology barriers can affect learning outcomes.',
        isCorrect: true
      },
      {
        id: 'D',
        text: 'Online learning requires more self-discipline from students.',
        isCorrect: true
      },
      {
        id: 'E',
        text: 'All students prefer online learning to traditional methods.',
        isCorrect: false
      },
      {
        id: 'F',
        text: 'Interaction with instructors is limited in online formats.',
        isCorrect: true
      }
    ],
    explanation: 'The correct answers are B, C, D, and F. The speaker mentions self-paced learning, technology barriers, need for self-discipline, and limited instructor interaction as key aspects of online learning.',
    tags: ['online learning', 'education', 'technology', 'self-discipline'],
    isNew: true,
    isMarked: false,
    pracStatus: 'Undone',
    hasExplanation: false,
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18'
  },
  {
    id: 4,
    title: 'Urban Pollution Solutions',
    category: 'Urban Development',
    difficulty: 'Advanced',
    timeLimit: 5,
    testSensitivity: 'Audio',
    type: 'question',
    speaker: 'Dr. Ahmed Hassan',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: "11",
    question: 'According to the discussion, which approaches to reducing urban pollution are mentioned?',
    options: [
      {
        id: 'A',
        text: 'Expanding public transportation systems.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Increasing the number of private parking spaces.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Implementing stricter vehicle emission standards.',
        isCorrect: true
      },
      {
        id: 'D',
        text: 'Creating more green spaces and urban forests.',
        isCorrect: true
      },
      {
        id: 'E',
        text: 'Encouraging remote work to reduce commuting.',
        isCorrect: true
      },
      {
        id: 'F',
        text: 'Building more highways to reduce traffic congestion.',
        isCorrect: false
      }
    ],
    explanation: 'The correct answers are A, C, D, and E. The speaker discusses public transportation expansion, stricter emission standards, urban green spaces, and remote work as effective pollution reduction strategies.',
    tags: ['urban planning', 'pollution', 'environment', 'transportation'],
    isNew: false,
    isMarked: false,
    pracStatus: 'Done',
    hasExplanation: true,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-15'
  },
  {
    id: 5,
    title: 'Artificial Intelligence in Medical Diagnosis',
    category: 'Technology & Medicine',
    difficulty: 'Intermediate',
    timeLimit: 5,
    testSensitivity: 'Audio',
    type: 'question',
    speaker: 'Dr. Jennifer Park',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: "10",
    question: 'What does the speaker say about AI in medical diagnosis?',
    options: [
      {
        id: 'A',
        text: 'AI will completely replace human doctors in the future.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'AI can analyze medical images faster than human radiologists.',
        isCorrect: true
      },
      {
        id: 'C',
        text: 'Machine learning algorithms require large amounts of medical data.',
        isCorrect: true
      },
      {
        id: 'D',
        text: 'AI diagnosis is always 100% accurate.',
        isCorrect: false
      },
      {
        id: 'E',
        text: 'Human oversight is still necessary for AI medical systems.',
        isCorrect: true
      },
      {
        id: 'F',
        text: 'AI can help identify patterns humans might miss.',
        isCorrect: true
      }
    ],
    explanation: 'The correct answers are B, C, E, and F. The speaker discusses AI\'s speed in image analysis, need for large datasets, importance of human oversight, and ability to identify missed patterns.',
    tags: ['artificial intelligence', 'medical diagnosis', 'radiology', 'machine learning'],
    isNew: false,
    isMarked: true,
    pracStatus: 'Undone',
    hasExplanation: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-12'
  },
  {
    id: 6,
    title: 'Renewable Energy Investment Trends',
    category: 'Economics & Environment',
    difficulty: 'Beginner',
    timeLimit: 5,
    testSensitivity: 'Audio',
    type: 'question',
    speaker: 'Prof. Robert Kim',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: "8",
    question: 'What trends in renewable energy investment does the speaker mention?',
    options: [
      {
        id: 'A',
        text: 'Investment in renewable energy has been declining globally.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'Solar energy projects receive the most funding.',
        isCorrect: true
      },
      {
        id: 'C',
        text: 'Government subsidies have no impact on investment decisions.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Private investors are increasingly interested in clean energy.',
        isCorrect: true
      },
      {
        id: 'E',
        text: 'Wind energy projects are becoming more cost-effective.',
        isCorrect: true
      },
      {
        id: 'F',
        text: 'Battery storage technology is attracting significant investment.',
        isCorrect: true
      }
    ],
    explanation: 'The correct answers are B, D, E, and F. The speaker discusses high solar funding, growing private investor interest, cost-effective wind projects, and significant battery storage investments.',
    tags: ['renewable energy', 'investment', 'economics', 'clean energy'],
    isNew: true,
    isMarked: false,
    pracStatus: 'In Progress',
    hasExplanation: false,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-22'
  }
];