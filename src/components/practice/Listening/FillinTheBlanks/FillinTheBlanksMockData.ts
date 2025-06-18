import { ListeningPassage, StudentProgress } from "./FillinTheBlanksTypes";

export const mockListeningPassages: ListeningPassage[] = [
  // Beginner Level
  {
    id: 1,
    title: 'Javelin Competition',
    difficulty: 'Beginner',
    timeLimit: 900, // 15 minutes
    category: 'Sports',
    tags: ['javelin', 'competition', 'athletics'],
    maxScore: 100,
    type: 'question',
    speaker: 'Sports Commentator',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: "24",
    instructions: 'You will hear a recording. Type the missing words in each blank.',
    text: `The [BLANK_0] event at the sports festival was the javelin competition. Athletes from all over the country came to participate. Many [BLANK_1] were excited to show their skills in [BLANK_2] the javelin as far as possible. They were organized into different [BLANK_3] to compete against each other. The biggest team, which had the most experienced members, took the lead. They [BLANK_4] the competition with an impressive throw.`,
    blanks: [
      {
        id: 'blank_0',
        position: 0,
        correctAnswer: 'main'
      },
      {
        id: 'blank_1',
        position: 1,
        correctAnswer: 'athletes'
      },
      {
        id: 'blank_2',
        position: 2,
        correctAnswer: 'throwing'
      },
      {
        id: 'blank_3',
        position: 3,
        correctAnswer: 'groups'
      },
      {
        id: 'blank_4',
        position: 4,
        correctAnswer: 'won'
      }
    ],
    wordBank: [
      { id: 'word_1', word: 'main', isUsed: false, correctPosition: 0 },
      { id: 'word_2', word: 'athletes', isUsed: false, correctPosition: 1 },
      { id: 'word_3', word: 'throwing', isUsed: false, correctPosition: 2 },
      { id: 'word_4', word: 'groups', isUsed: false, correctPosition: 3 },
      { id: 'word_5', word: 'won', isUsed: false, correctPosition: 4 },
      { id: 'word_6', word: 'secondary', isUsed: false },
      { id: 'word_7', word: 'spectators', isUsed: false },
      { id: 'word_8', word: 'catching', isUsed: false }
    ],
    isNew: false,
    isMarked: false,
    pracStatus: "Undone",
    hasExplanation: false,
    createdAt: "",
    updatedAt: ""
  },
  
  // Intermediate Level
  {
    id: 2,
    title: 'Urban Development and Transportation',
    difficulty: 'Intermediate',
    timeLimit: 1200, // 20 minutes
    category: 'Urban Planning',
    tags: ['transportation', 'urban', 'development'],
    maxScore: 150,
    type: 'question',
    speaker: 'Dr. Elizabeth Green',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: "18",
    instructions: 'Listen to the recording about urban transportation and fill in the blanks.',
    text: `Modern cities face significant challenges in managing transportation systems as populations continue to grow. Urban planners must [BLANK_0] innovative solutions that balance efficiency with environmental sustainability. Public transportation networks require substantial [BLANK_1] to maintain and upgrade aging infrastructure. Many cities are now [BLANK_2] electric buses and trains to reduce carbon emissions. The [BLANK_3] between different modes of transport is crucial for creating a seamless urban mobility experience.`,
    blanks: [
      {
        id: 'blank_0',
        position: 0,
        correctAnswer: 'develop'
      },
      {
        id: 'blank_1',
        position: 1,
        correctAnswer: 'investment'
      },
      {
        id: 'blank_2',
        position: 2,
        correctAnswer: 'implementing'
      },
      {
        id: 'blank_3',
        position: 3,
        correctAnswer: 'integration'
      }
    ],
    wordBank: [
      { id: 'word_1', word: 'develop', isUsed: false, correctPosition: 0 },
      { id: 'word_2', word: 'investment', isUsed: false, correctPosition: 1 },
      { id: 'word_3', word: 'implementing', isUsed: false, correctPosition: 2 },
      { id: 'word_4', word: 'integration', isUsed: false, correctPosition: 3 },
      { id: 'word_5', word: 'create', isUsed: false },
      { id: 'word_6', word: 'funding', isUsed: false },
      { id: 'word_7', word: 'removing', isUsed: false },
      { id: 'word_8', word: 'separation', isUsed: false }
    ],
    isNew: false,
    isMarked: false,
    pracStatus: "Undone",
    hasExplanation: false,
    createdAt: "",
    updatedAt: ""
  },

  // Advanced Level
  {
    id: 3,
    title: 'Climate Science and Ocean Acidification',
    difficulty: 'Advanced',
    timeLimit: 1800, // 30 minutes
    category: 'Environmental Science',
    tags: ['climate', 'ocean', 'acidification'],
    maxScore: 200,
    type: 'question',
    speaker: 'Prof. David Martinez',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: "22",
    instructions: 'Complete this advanced passage about ocean acidification by listening carefully.',
    text: `Ocean acidification represents one of the most [BLANK_0] consequences of anthropogenic carbon dioxide emissions. As atmospheric CO2 concentrations increase, the ocean [BLANK_1] approximately 25% of these emissions, leading to chemical changes that lower seawater pH. This process [BLANK_2] marine ecosystems, particularly affecting calcifying organisms such as corals and mollusks. The [BLANK_3] implications include the potential collapse of marine food webs and significant economic impacts on fisheries and coastal communities that depend on ocean resources.`,
    blanks: [
      {
        id: 'blank_0',
        position: 0,
        correctAnswer: 'significant'
      },
      {
        id: 'blank_1',
        position: 1,
        correctAnswer: 'absorbs'
      },
      {
        id: 'blank_2',
        position: 2,
        correctAnswer: 'threatens'
      },
      {
        id: 'blank_3',
        position: 3,
        correctAnswer: 'ecological'
      }
    ],
    wordBank: [
      { id: 'word_1', word: 'significant', isUsed: false, correctPosition: 0 },
      { id: 'word_2', word: 'absorbs', isUsed: false, correctPosition: 1 },
      { id: 'word_3', word: 'threatens', isUsed: false, correctPosition: 2 },
      { id: 'word_4', word: 'ecological', isUsed: false, correctPosition: 3 },
      { id: 'word_5', word: 'minor', isUsed: false },
      { id: 'word_6', word: 'releases', isUsed: false },
      { id: 'word_7', word: 'protects', isUsed: false },
      { id: 'word_8', word: 'economic', isUsed: false }
    ],
    isNew: false,
    isMarked: false,
    pracStatus: "Undone",
    hasExplanation: false,
    createdAt: "",
    updatedAt: ""
  },

  // Additional Beginner Level
  {
    id: 4,
    title: 'Daily Weather Report',
    difficulty: 'Beginner',
    timeLimit: 900, // 15 minutes
    category: 'Weather',
    tags: ['weather', 'daily', 'forecast'],
    maxScore: 100,
    type: 'question',
    speaker: 'Weather Reporter',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: "15",
    instructions: 'Listen to the weather report and complete the blanks.',
    text: `Today's weather forecast shows a [BLANK_0] day with temperatures reaching 25 degrees Celsius. There will be [BLANK_1] clouds in the morning, but the afternoon should be mostly [BLANK_2]. Tomorrow, we expect some [BLANK_3] in the evening, so don't forget to bring an umbrella.`,
    blanks: [
      {
        id: 'blank_0',
        position: 0,
        correctAnswer: 'sunny'
      },
      {
        id: 'blank_1',
        position: 1,
        correctAnswer: 'some'
      },
      {
        id: 'blank_2',
        position: 2,
        correctAnswer: 'clear'
      },
      {
        id: 'blank_3',
        position: 3,
        correctAnswer: 'rain'
      }
    ],
    wordBank: [
      { id: 'word_1', word: 'sunny', isUsed: false, correctPosition: 0 },
      { id: 'word_2', word: 'some', isUsed: false, correctPosition: 1 },
      { id: 'word_3', word: 'clear', isUsed: false, correctPosition: 2 },
      { id: 'word_4', word: 'rain', isUsed: false, correctPosition: 3 },
      { id: 'word_5', word: 'cloudy', isUsed: false },
      { id: 'word_6', word: 'all', isUsed: false },
      { id: 'word_7', word: 'foggy', isUsed: false },
      { id: 'word_8', word: 'snow', isUsed: false }
    ],
    isNew: false,
    isMarked: false,
    pracStatus: "Undone",
    hasExplanation: false,
    createdAt: "",
    updatedAt: ""
  }
];

export const mockStudentProgress: StudentProgress = {
  studentName: 'Javelin Competition',
  questionNumber: 300,
  testedCount: 5,
  totalQuestions: 1200,
  currentStreak: 3,
  averageScore: 85.7
};

export const difficultySettings = {
  Beginner: {
    timeLimit: 900, // 15 minutes
    maxBlanks: 4,
    wordBankSize: 8,
    passingScore: 70
  },
  Intermediate: {
    timeLimit: 1200, // 20 minutes
    maxBlanks: 5,
    wordBankSize: 8,
    passingScore: 75
  },
  Advanced: {
    timeLimit: 1800, // 30 minutes
    maxBlanks: 6,
    wordBankSize: 8,
    passingScore: 80
  }
};