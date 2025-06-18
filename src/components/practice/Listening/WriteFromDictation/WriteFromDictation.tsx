import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  TextField,
} from '@mui/material';
import { Close, Timer } from '@mui/icons-material';
import { mockWriteFromDictationQuestions, mockStudentProgress } from './WriteFromDictationMockData';
import { WriteFromDictationQuestion, TimerState, WriteFromDictationResult, WordAnalysis } from './WriteFromDictationTypes';
import TopicSelectionDrawer from '../../../common/TopicSelectionDrawer';
import ActionButtons from '../../common/ActionButtons';
import NavigationSection from '../../common/NavigationSection';
import QuestionHeader from '../../common/QuestionHeader';
import StageGoalBanner from '../../common/StageGoalBanner';
import TextToSpeech from '../../common/TextToSpeech';

interface WriteFromDictationProps {}

const WriteFromDictation: React.FC<WriteFromDictationProps> = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [question, setQuestion] = useState<WriteFromDictationQuestion>(mockWriteFromDictationQuestions[currentQuestionIndex]);
  const [showQuestionSelector, setShowQuestionSelector] = useState(false);

  // State management
  const [userInput, setUserInput] = useState<string>('');
  const [timer, setTimer] = useState<TimerState>({
    timeRemaining: question.timeLimit,
    isRunning: false,
    warningThreshold: 60,
    autoSubmit: true,
  });
  
  const [showAnswer, setShowAnswer] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentResult, setCurrentResult] = useState<WriteFromDictationResult | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date>(new Date());

  // Sync state when question changes
  useEffect(() => {
    setUserInput('');
    setWordCount(0);
    setTimer({
      timeRemaining: question.timeLimit,
      isRunning: false,
      warningThreshold: 60,
      autoSubmit: true,
    });
    setIsSubmitted(false);
    setShowResults(false);
    setCurrentResult(null);
    setHasPlayedAudio(false);
    startTimeRef.current = new Date();
  }, [question]);

  // Update word count when user input changes
  useEffect(() => {
    const words = userInput.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [userInput]);

  // Timer functionality
  useEffect(() => {
    if (timer.isRunning && timer.timeRemaining > 0 && !isSubmitted) {
      timerRef.current = setTimeout(() => {
        setTimer(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
      }, 1000);
    } else if (timer.timeRemaining === 0 && timer.autoSubmit && !isSubmitted) {
      handleSubmit();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timer.timeRemaining, timer.isRunning, isSubmitted]);

  // Start timer when user starts typing
  const startTimerIfNeeded = useCallback(() => {
    if (!timer.isRunning && !isSubmitted) {
      setTimer(prev => ({ ...prev, isRunning: true }));
      startTimeRef.current = new Date();
    }
  }, [timer.isRunning, isSubmitted]);

  const [results, setResults] = useState<WriteFromDictationResult[]>([]);
  const studentProgress = mockStudentProgress;

  const handleNext = () => {
    if (currentQuestionIndex < mockWriteFromDictationQuestions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      setQuestion(mockWriteFromDictationQuestions[newIndex]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);
      setQuestion(mockWriteFromDictationQuestions[newIndex]);
    }
  };

  const handleSearch = () => {
    console.log('Search functionality triggered');
    setShowQuestionSelector(true);
  };

  const handleQuestionSelect = (option: any) => {
    const newIndex = mockWriteFromDictationQuestions.findIndex(q => q.id === option.id);
    if (newIndex !== -1) {
      setCurrentQuestionIndex(newIndex);
      setQuestion(option);
    }
    setShowQuestionSelector(false);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const hasResponse = useCallback((): boolean => {
    return userInput.trim().length > 0;
  }, [userInput]);

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isSubmitted) return;
    
    startTimerIfNeeded();
    setUserInput(event.target.value);
  };

  // Function to normalize text for comparison
  const normalizeText = (text: string): string => {
    return text.toLowerCase()
      .replace(/[.,!?;:"'()-]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  };

  // Function to check if word is acceptable (including variations)
  const isWordAcceptable = (userWord: string, expectedWord: string): boolean => {
    const normalizedUser = normalizeText(userWord);
    const normalizedExpected = normalizeText(expectedWord);
    
    if (normalizedUser === normalizedExpected) return true;
    
    // Check acceptable variations
    if (question.acceptableVariations && question.acceptableVariations[expectedWord]) {
      return question.acceptableVariations[expectedWord].some(variation => 
        normalizeText(variation) === normalizedUser
      );
    }
    
    return false;
  };

  const handleSubmit = () => {
    if (isSubmitted) return;

    setIsSubmitted(true);
    setTimer(prev => ({ ...prev, isRunning: false }));

    const endTime = new Date();
    const timeSpent = Math.floor((endTime.getTime() - startTimeRef.current.getTime()) / 1000);

    // Analyze the response
    const userWords = userInput.trim().split(/\s+/).filter(word => word.length > 0);
    const expectedWords = question.audioText.split(/\s+/).filter(word => word.length > 0);
    
    let wordsCorrect = 0;
    let keyWordsCorrect = 0;
    const detailedAnalysis: WordAnalysis[] = [];
    
    const maxLength = Math.max(userWords.length, expectedWords.length);
    
    for (let i = 0; i < maxLength; i++) {
      const userWord = userWords[i] || '';
      const expectedWord = expectedWords[i] || '';
      const isKeyWord = question.keyWords.includes(normalizeText(expectedWord));
      const isCorrect = expectedWord.length>0 && isWordAcceptable(userWord, expectedWord);
      
      if (isCorrect) {
        wordsCorrect++;
        if (isKeyWord) keyWordsCorrect++;
      }
      
      if (expectedWord) {
        detailedAnalysis.push({
          expectedWord,
          userWord,
          isCorrect,
          isKeyWord,
          position: i
        });
      }
    }
    
    // Calculate score with key word weighting
    const keyWordWeight = 2.5;
    const regularWordWeight = 1.0;
    
    const totalKeyWords = question.keyWords.length;
    const totalRegularWords = expectedWords.length - totalKeyWords;
    
    const keyWordPoints = keyWordsCorrect * keyWordWeight;
    const regularWordPoints = (wordsCorrect - keyWordsCorrect) * regularWordWeight;
    const maxPossiblePoints = (totalKeyWords * keyWordWeight) + (totalRegularWords * regularWordWeight);
    
    const score = Math.round((keyWordPoints + regularWordPoints) / maxPossiblePoints * question.maxScore);
    const accuracy = Math.round((wordsCorrect / expectedWords.length) * 100);

    const result: WriteFromDictationResult = {
      questionId: String(question.id),
      userInput,
      correctText: question.audioText,
      score: Math.max(0, score),
      maxScore: question.maxScore,
      accuracy,
      wordsCorrect,
      totalWords: expectedWords.length,
      keyWordsCorrect,
      totalKeyWords,
      completedAt: endTime,
      timeSpent,
      detailedAnalysis
    };

    setCurrentResult(result);
    setShowResults(true);
    setResults(prev => [...prev, result]);
  };

  const handleRedo = () => {
    setUserInput('');
    setWordCount(0);
    setTimer({
      timeRemaining: question.timeLimit,
      isRunning: false,
      warningThreshold: 60,
      autoSubmit: true,
    });
    setIsSubmitted(false);
    setShowResults(false);
    setCurrentResult(null);
    setHasPlayedAudio(false);
    startTimeRef.current = new Date();
  };

  const questionNumber = studentProgress.questionNumber + currentQuestionIndex;

  const handleAudioStart = () => {
    setHasPlayedAudio(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', p: { xs: 1, sm: 2 } }}>
      <StageGoalBanner />

      <Card sx={{ maxWidth: 1200, mx: 'auto', mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
            <Box
              sx={{
                width: { xs: 50, sm: 55, md: 60 },
                height: { xs: 50, sm: 55, md: 60 },
                bgcolor: '#e91e63',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: { xs: '11px', sm: '13px', md: '14px' },
                fontWeight: 'bold',
                flexShrink: 0,
                lineHeight: 1.2
              }}
            >
              WFD
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: '#333',
                    fontSize: { xs: '18px', sm: '20px', md: '24px' },
                    lineHeight: 1.3,
                    wordBreak: 'break-word'
                  }}
                >
                  Write From Dictation
                </Typography>
                <Chip label="Study Guide" color="primary" size="small" />
              </Stack>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#666', 
                  mt: 1,
                  fontSize: { xs: '12px', sm: '13px', md: '14px' },
                  lineHeight: 1.5,
                  wordBreak: 'break-word'
                }}
              >
                {question.instructions}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <QuestionHeader 
            questionNumber={questionNumber}
            studentName={studentProgress.studentName}
            testedCount={studentProgress.testedCount}
          />

          {/* Timer Display */}
          <Paper sx={{ p: 2, mb: 3, bgcolor: timer.timeRemaining <= timer.warningThreshold ? '#ffebee' : '#e3f2fd' }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Timer sx={{ color: timer.timeRemaining <= timer.warningThreshold ? '#f44336' : '#2196f3' }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold',
                  color: timer.timeRemaining <= timer.warningThreshold ? '#f44336' : '#2196f3'
                }}
              >
                Time: {formatTime(timer.timeRemaining)}
              </Typography>
              {timer.timeRemaining <= timer.warningThreshold && (
                <Chip label="Hurry Up!" color="error" size="small" />
              )}
              {!timer.isRunning && !isSubmitted && (
                <Chip label="Timer will start when you begin typing" color="info" size="small" />
              )}
            </Stack>
          </Paper>

          {/* Text-to-Speech Player */}
          <TextToSpeech 
            text={question.audioText}
            autoPlay={false}
            onStart={handleAudioStart}
            onEnd={() => console.log('Audio ended')}
          />

          {/* Writing Area */}
          <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Type the sentence you heard:
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={6}
              value={userInput}
              onChange={handleInputChange}
              disabled={isSubmitted}
              placeholder="Type the sentence exactly as you heard it..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: isSubmitted ? '#f5f5f5' : '#fff',
                  fontSize: { xs: '14px', sm: '16px' },
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: isSubmitted ? '#e0e0e0' : '#1976d2',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                  },
                },
              }}
            />
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Word Count: {wordCount}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                You will hear the sentence only once
              </Typography>
            </Box>
          </Paper>

          {/* Progress Indicator */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Progress: {userInput.trim().length > 0 ? 'In progress' : 'Not started'}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={userInput.trim().length > 0 ? 50 : 0}
              sx={{
                height: 8,
                borderRadius: 1,
                bgcolor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#4caf50',
                },
              }}
            />
          </Box>

          <ActionButtons
            hasResponse={hasResponse()}
            onSubmit={handleSubmit}
            onRedo={handleRedo}
            onTranslate={() => setShowTranslate(true)}
            onShowAnswer={() => setShowAnswer(true)}
            recordedBlob={null}
          />

          <NavigationSection
            onSearch={handleSearch}
            onPrevious={handlePrevious}
            onNext={handleNext}
            questionNumber={questionNumber}
          />
        </CardContent>
      </Card>

      <TopicSelectionDrawer
        open={showQuestionSelector}
        onClose={() => setShowQuestionSelector(false)}
        onSelect={handleQuestionSelect}
        topics={mockWriteFromDictationQuestions}
        title="Write From Dictation"
        type="question"
      />

      {/* Results Dialog */}
      <Dialog open={showResults} onClose={() => setShowResults(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Dictation Results</Typography>
            <IconButton onClick={() => setShowResults(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {currentResult && (
            <Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <Chip 
                  label={`Score: ${currentResult.score}/${currentResult.maxScore}`} 
                  color={currentResult.score >= (currentResult.maxScore * 0.7) ? 'success' : 'error'}
                  size="medium"
                />
                <Chip 
                  label={`Accuracy: ${currentResult.accuracy}%`} 
                  color={currentResult.accuracy >= 70 ? 'success' : 'error'}
                  size="medium"
                />
                <Chip 
                  label={`${currentResult.wordsCorrect}/${currentResult.totalWords} words`} 
                  color="info"
                  size="medium"
                />
                <Chip 
                  label={`${currentResult.keyWordsCorrect}/${currentResult.totalKeyWords} key words`} 
                  color="warning"
                  size="medium"
                />
              </Stack>
              
              <Typography variant="h6" sx={{ mb: 2 }}>Text Comparison:</Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Your Answer:
                </Typography>
                <Paper sx={{ p: 2, bgcolor: '#fff3e0', border: '1px solid #ffb74d' }}>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    "{currentResult.userInput || 'No input provided'}"
                  </Typography>
                </Paper>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Correct Answer:
                </Typography>
                <Paper sx={{ p: 2, bgcolor: '#e8f5e9', border: '1px solid #4caf50' }}>
                  <Typography variant="body2">
                    "{currentResult.correctText}"
                  </Typography>
                </Paper>
              </Box>

              {question.explanation && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Explanation:
                  </Typography>
                  <Typography variant="body2">
                    {question.explanation}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResults(false)}>Close</Button>
          <Button variant="contained" onClick={handleRedo}>Try Again</Button>
        </DialogActions>
      </Dialog>

      {/* Answer Dialog */}
      <Dialog open={showAnswer} onClose={() => setShowAnswer(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Correct Answer</Typography>
            <IconButton onClick={() => setShowAnswer(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Question:</strong> {question.title}
          </Typography>
          
          <Box sx={{ mb: 3, p: 2, bgcolor: '#e8f5e9', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Correct sentence:
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '16px', lineHeight: 1.6 }}>
              "{question.audioText}"
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Key words to focus on:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
              {question.keyWords.map((word, index) => (
                <Chip 
                  key={index}
                  label={word} 
                  color="primary" 
                  size="small"
                  variant="outlined"
                />
              ))}
            </Stack>
          </Box>

          {question.explanation && (
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Explanation:
              </Typography>
              <Typography variant="body2">
                {question.explanation}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAnswer(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Translation Dialog */}
      <Dialog open={showTranslate} onClose={() => setShowTranslate(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Translation Options</Typography>
            <IconButton onClick={() => setShowTranslate(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Language</InputLabel>
            <Select defaultValue="spanish" label="Select Language">
              <MenuItem value="spanish">Spanish</MenuItem>
              <MenuItem value="french">French</MenuItem>
              <MenuItem value="german">German</MenuItem>
              <MenuItem value="chinese">Chinese</MenuItem>
              <MenuItem value="japanese">Japanese</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Translation feature will help you understand the audio content in your preferred language.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTranslate(false)}>Cancel</Button>
          <Button variant="contained">Translate</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WriteFromDictation;