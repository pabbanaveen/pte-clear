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
} from '@mui/material';
import { Close, Timer } from '@mui/icons-material';

import { mockHighlightIncorrectWordsQuestions, mockStudentProgress } from './HighlightIncorrectWordsMockData';
import { HighlightIncorrectWordsQuestion, TimerState, HighlightIncorrectWordsResult, IncorrectWord } from './HighlightIncorrectWordsTypes';
import TopicSelectionDrawer from '../../../common/TopicSelectionDrawer';
import ActionButtons from '../../common/ActionButtons';
import NavigationSection from '../../common/NavigationSection';
import QuestionHeader from '../../common/QuestionHeader';
import StageGoalBanner from '../../common/StageGoalBanner';
import TextToSpeech from '../../common/TextToSpeech';

interface HighlightIncorrectWordsProps {}

const HighlightIncorrectWords: React.FC<HighlightIncorrectWordsProps> = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [question, setQuestion] = useState<HighlightIncorrectWordsQuestion>(mockHighlightIncorrectWordsQuestions[currentQuestionIndex]);
  const [showQuestionSelector, setShowQuestionSelector] = useState(false);

  // State management
  const [clickedWords, setClickedWords] = useState<Set<string>>(new Set());
  const [timer, setTimer] = useState<TimerState>({
    timeRemaining: question.timeLimit,
    isRunning: false,
    warningThreshold: 60,
    autoSubmit: true,
  });
  
  const [showAnswer, setShowAnswer] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentResult, setCurrentResult] = useState<HighlightIncorrectWordsResult | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date>(new Date());

  // Sync state when question changes
  useEffect(() => {
    setClickedWords(new Set());
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

  // Start timer when user makes first click
  const startTimerIfNeeded = useCallback(() => {
    if (!timer.isRunning && !isSubmitted) {
      setTimer(prev => ({ ...prev, isRunning: true }));
      startTimeRef.current = new Date();
    }
  }, [timer.isRunning, isSubmitted]);

  const [results, setResults] = useState<HighlightIncorrectWordsResult[]>([]);
  const studentProgress = mockStudentProgress;

  const handleNext = () => {
    if (currentQuestionIndex < mockHighlightIncorrectWordsQuestions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      setQuestion(mockHighlightIncorrectWordsQuestions[newIndex]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);
      setQuestion(mockHighlightIncorrectWordsQuestions[newIndex]);
    }
  };

  const handleSearch = () => {
    console.log('Search functionality triggered');
    setShowQuestionSelector(true);
  };

  const handleQuestionSelect = (option: any) => {
    const newIndex = mockHighlightIncorrectWordsQuestions.findIndex(q => q.id === option.id);
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
    return clickedWords.size > 0;
  }, [clickedWords]);

  // Handle word click
  const handleWordClick = (wordId: string) => {
    if (isSubmitted) return;
    
    startTimerIfNeeded();
    
    const newClickedWords = new Set(clickedWords);
    if (newClickedWords.has(wordId)) {
      newClickedWords.delete(wordId);
    } else {
      newClickedWords.add(wordId);
    }
    setClickedWords(newClickedWords);
  };

  const handleSubmit = () => {
    if (isSubmitted) return;

    setIsSubmitted(true);
    setTimer(prev => ({ ...prev, isRunning: false }));

    const endTime = new Date();
    const timeSpent = Math.floor((endTime.getTime() - startTimeRef.current.getTime()) / 1000);

    // Calculate results
    const correctWordIds = question.incorrectWords.map(word => word.id);
    const clickedWordIds = Array.from(clickedWords);
    
    const correctClicks = clickedWordIds.filter(id => correctWordIds.includes(id)).length;
    const incorrectClicks = clickedWordIds.filter(id => !correctWordIds.includes(id)).length;
    const missedWords = correctWordIds.filter(id => !clickedWordIds.includes(id)).length;
    
    const totalPossiblePoints = question.maxScore;
    const pointsPerCorrectWord = totalPossiblePoints / correctWordIds.length;
    const penaltyPerIncorrectClick = pointsPerCorrectWord * 0.5; // 50% penalty for wrong clicks
    
    const score = Math.max(0, Math.round(
      (correctClicks * pointsPerCorrectWord) - (incorrectClicks * penaltyPerIncorrectClick)
    ));
    
    const accuracy = correctWordIds.length > 0 ? 
      Math.round((correctClicks / correctWordIds.length) * 100) : 100;

    const result: HighlightIncorrectWordsResult = {
      questionId: String(question.id),
      clickedWords: clickedWordIds,
      correctWords: correctWordIds,
      correctClicks,
      incorrectClicks,
      missedWords,
      score,
      maxScore: question.maxScore,
      accuracy,
      completedAt: endTime,
      timeSpent,
    };

    setCurrentResult(result);
    setShowResults(true);
    setResults(prev => [...prev, result]);
  };

  const handleRedo = () => {
    setClickedWords(new Set());
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

  // Render transcription with clickable words
  const renderTranscription = () => {
    const words = question.displayText.split(/(\s+)/);
    const incorrectWordTexts = question.incorrectWords.map(word => word.word);
    
    return words.map((word, index) => {
      const cleanWord = word.trim();
      const incorrectWord = question.incorrectWords.find(iw => iw.word === cleanWord);
      
      if (incorrectWord) {
        const isClicked = clickedWords.has(incorrectWord.id);
        const isCorrectAfterSubmission = isSubmitted && question.incorrectWords.some(iw => iw.id === incorrectWord.id);
        const isMissedAfterSubmission = isSubmitted && !isClicked && isCorrectAfterSubmission;
        
        return (
          <span
            key={index}
            onClick={() => handleWordClick(incorrectWord.id)}
            style={{
              cursor: isSubmitted ? 'default' : 'pointer',
              backgroundColor: isSubmitted 
                ? (isCorrectAfterSubmission && isClicked) 
                  ? '#e8f5e9' // Correct click (green)
                  : isMissedAfterSubmission 
                    ? '#ffebee' // Missed word (red)
                    : 'transparent'
                : isClicked 
                  ? '#e3f2fd' // Selected (blue)
                  : 'transparent',
              padding: '2px 4px',
              borderRadius: '4px',
              border: isSubmitted
                ? (isCorrectAfterSubmission && isClicked)
                  ? '2px solid #4caf50'
                  : isMissedAfterSubmission
                    ? '2px solid #f44336'
                    : 'none'
                : isClicked
                  ? '2px solid #1976d2'
                  : '2px solid transparent',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {word}
          </span>
        );
      } else if (cleanWord && !cleanWord.match(/^\s*$/)) {
        // Regular words that might be incorrectly clicked
        const isIncorrectlyClicked = isSubmitted && Array.from(clickedWords).some(id => {
          // Check if this word was clicked but is not in the correct words list
          return !question.incorrectWords.some(iw => iw.id === id) && clickedWords.has(id);
        });
        
        return (
          <span
            key={index}
            style={{
              backgroundColor: isSubmitted && isIncorrectlyClicked ? '#ffebee' : 'transparent',
              border: isSubmitted && isIncorrectlyClicked ? '2px solid #f44336' : 'none',
              padding: '2px 4px',
              borderRadius: '4px'
            }}
          >
            {word}
          </span>
        );
      }
      
      return <span key={index}>{word}</span>;
    });
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
              HIW
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
                  Highlight Incorrect Words
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
                <Chip label="Timer will start when you click a word" color="info" size="small" />
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

          {/* Transcription with Clickable Words */}
          <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Transcription - Click on words that are different from what you heard:
            </Typography>
            
            <Typography 
              variant="body1" 
              component="div"
              sx={{ 
                lineHeight: 2,
                fontSize: { xs: '14px', sm: '15px', md: '16px' },
                textAlign: 'justify',
                userSelect: 'none'
              }}
            >
              {renderTranscription()}
            </Typography>
          </Paper>

          {/* Progress Indicator */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Progress: {clickedWords.size} word(s) selected
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min((clickedWords.size / Math.max(question.incorrectWords.length, 1)) * 100, 100)}
              sx={{
                height: 8,
                borderRadius: 1,
                bgcolor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  bgcolor: clickedWords.size > question.incorrectWords.length ? '#ff9800' : '#4caf50',
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
        topics={mockHighlightIncorrectWordsQuestions}
        title="Highlight Incorrect Words"
        type="question"
      />

      {/* Results Dialog */}
      <Dialog open={showResults} onClose={() => setShowResults(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Results</Typography>
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
                  label={`Time: ${Math.floor(currentResult.timeSpent / 60)}:${(currentResult.timeSpent % 60).toString().padStart(2, '0')}`} 
                  color="default"
                  size="medium"
                />
              </Stack>
              
              <Typography variant="h6" sx={{ mb: 2 }}>Detailed Results:</Typography>
              
              <Stack spacing={1} sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Correct clicks:</strong> {currentResult.correctClicks}
                </Typography>
                <Typography variant="body2">
                  <strong>Incorrect clicks:</strong> {currentResult.incorrectClicks}
                </Typography>
                <Typography variant="body2">
                  <strong>Missed words:</strong> {currentResult.missedWords}
                </Typography>
              </Stack>

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
            <Typography variant="h6">Correct Answers</Typography>
            <IconButton onClick={() => setShowAnswer(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Question:</strong> {question.title}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            The following words in the transcription were different from what the speaker said:
          </Typography>
          
          {question.incorrectWords.map((word, index) => (
            <Box key={word.id} sx={{ mb: 2, p: 2, bgcolor: '#ffebee', borderRadius: 1, border: '1px solid #f44336' }}>
              <Typography variant="body2">
                <strong>Incorrect word:</strong> "{word.word}" → <strong>Correct word:</strong> "{word.correctWord}"
              </Typography>
            </Box>
          ))}

          {question.explanation && (
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
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

export default HighlightIncorrectWords;