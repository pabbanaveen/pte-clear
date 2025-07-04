import {AudioTopic } from '../../common/types';
import { LectureTopic } from './ReTellLeactureType';

export const audioTopics: LectureTopic[] = [
  {
    id: 1,
    title: 'Introduction to Biology',
    duration: '00:40',
    speaker: 'Dr. Smith',
    difficulty: 'Beginner',
    audioText: 'This lecture introduces the basic concepts of biology, including cell structure and function.',
    expectedAnswer: 'The lecture covered the basics of biology, focusing on cell structure and how cells function.',
    type: 'lecture',
    preparationTime: 10,
    recordingTime: 40,
    category: 'Science',
    tags: ['biology', 'introduction', 'basics'],
    isNew: true,
    isMarked: false,
    pracStatus: 'Undone',
    hasExplanation: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    questionType: 'ASQ'
  },
  {
    id: 2,
    title: 'World War II History',
    duration: '00:40',
    speaker: 'Prof. Johnson',
    difficulty: 'Intermediate',
    audioText: 'This lecture discusses the key events and impacts of World War II.',
    expectedAnswer: 'The lecture explained major events of World War II and their global impacts.',
    type: 'lecture',
    preparationTime: 10,
    recordingTime: 40,
    category: 'History',
    tags: ['history', 'war', 'world war'],
    isNew: false,
    isMarked: true,
    pracStatus: 'In Progress',
    hasExplanation: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-20',
    questionType: 'ASQ'
  },
  {
    id: 3,
    title: 'Climate Change Science',
    duration: '00:40',
    speaker: 'Dr. Wilson',
    difficulty: 'Advanced',
    audioText: 'This lecture explores the science behind climate change and its effects.',
    expectedAnswer: 'The lecture detailed the scientific basis of climate change and its environmental impacts.',
    type: 'lecture',
    preparationTime: 10,
    recordingTime: 40,
    category: 'Environmental Science',
    tags: ['climate', 'environment', 'science'],
    isNew: true,
    isMarked: false,
    pracStatus: 'Undone',
    hasExplanation: false,
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18',
    questionType: 'ASQ'
  },
  {
    id: 4,
    title: 'Shakespeare Literature',
    duration: '00:40',
    speaker: 'Prof. Brown',
    difficulty: 'Intermediate',
    audioText: 'This lecture analyzes key works of Shakespeare and their themes.',
    expectedAnswer: 'The lecture discussed Shakespeare’s major works and their central themes.',
    type: 'lecture',
    preparationTime: 10,
    recordingTime: 40,
    category: 'Literature',
    tags: ['shakespeare', 'literature', 'english'],
    isNew: false,
    isMarked: false,
    pracStatus: 'Done',
    hasExplanation: true,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-15',
    questionType: 'ASQ'
  },
  {
    id: 5,
    title: 'Quantum Physics Basics',
    duration: '00:40',
    speaker: 'Dr. Davis',
    difficulty: 'Advanced',
    audioText: 'This lecture introduces the fundamental concepts of quantum physics.',
    expectedAnswer: 'The lecture covered the core principles of quantum physics.',
    type: 'lecture',
    preparationTime: 10,
    recordingTime: 40,
    category: 'Physics',
    tags: ['physics', 'quantum', 'advanced'],
    isNew: false,
    isMarked: true,
    pracStatus: 'Undone',
    hasExplanation: true,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-12',
    questionType: 'ASQ'
  },
  {
    id: 6,
    title: 'Economic Principles',
    duration: '00:40',
    speaker: 'Prof. Miller',
    difficulty: 'Beginner',
    audioText: 'This lecture outlines the basic principles of economics.',
    expectedAnswer: 'The lecture explained the fundamental concepts of economics.',
    type: 'lecture',
    preparationTime: 10,
    recordingTime: 40,
    category: 'Economics',
    tags: ['economics', 'principles', 'basics'],
    isNew: true,
    isMarked: false,
    pracStatus: 'In Progress',
    hasExplanation: false,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-22',
    questionType: 'ASQ'
  },
  {
    id: 7,
    title: 'Art History Renaissance',
    duration: '00:40',
    speaker: 'Dr. Taylor',
    difficulty: 'Intermediate',
    audioText: 'This lecture covers the Renaissance period in art history.',
    expectedAnswer: 'The lecture discussed key artworks and themes from the Renaissance.',
    type: 'lecture',
    preparationTime: 10,
    recordingTime: 40,
    category: 'Art History',
    tags: ['art', 'renaissance', 'history'],
    isNew: false,
    isMarked: false,
    pracStatus: 'Done',
    hasExplanation: true,
    createdAt: '2024-01-03',
    updatedAt: '2024-01-10',
    questionType: 'ASQ'
  },
  {
    id: 8,
    title: 'Psychology Fundamentals',
    duration: '00:40',
    speaker: 'Prof. Anderson',
    difficulty: 'Beginner',
    audioText: 'This lecture introduces the basics of psychology and human behavior.',
    expectedAnswer: 'The lecture covered the fundamental principles of psychology.',
    type: 'lecture',
    preparationTime: 10,
    recordingTime: 40,
    category: 'Psychology',
    tags: ['psychology', 'fundamentals', 'behavior'],
    isNew: false,
    isMarked: true,
    pracStatus: 'Undone',
    hasExplanation: true,
    createdAt: '2024-01-12',
    updatedAt: '2024-01-18',
    questionType: 'ASQ'
  },
];