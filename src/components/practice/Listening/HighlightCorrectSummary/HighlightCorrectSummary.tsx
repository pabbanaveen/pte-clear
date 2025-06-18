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
  Radio,
  RadioGroup,
  FormControlLabel
} from '@mui/material';
import { Close, Timer } from '@mui/icons-material';
import ActionButtons from '../../common/ActionButtons';
import NavigationSection from '../../common/NavigationSection';
import QuestionHeader from '../../common/QuestionHeader';
import StageGoalBanner from '../../common/StageGoalBanner';
import TopicSelectionDrawer from '../../../common/TopicSelectionDrawer';
import TextToSpeech from '../../common/TextToSpeech';
import { mockHighlightSummaryQuestions, mockStudentProgress } from './HighlightCorrectSummaryMockData';
import { HighlightSummaryQuestion, TimerState, SummaryResult, SummaryOption } from './HighlightCorrectSummaryType';

interface HighlightCorrectSummaryProps {}

const HighlightCorrectSummary: React.FC<HighlightCorrectSummaryProps> = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [question, setQuestion] = useState<HighlightSummaryQuestion>(mockHighlightSummaryQuestions[currentQuestionIndex]);
  const [showSummarySelector, setShowSummarySelector] = useState(false);

  // State management
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [timer, setTimer] = useState<TimerState>({
    timeRemaining: question.timeLimit,
    isRunning: false,
    warningThreshold: 30,
    autoSubmit: true,
  });
  
  const [showAnswer, setShowAnswer] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentResult, setCurrentResult] = useState<SummaryResult | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date>(new Date());

  // Sync state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setTimer({
      timeRemaining: question.timeLimit,
      isRunning: false,
      warningThreshold: 30,
      autoSubmit: true,
    });
    setIsSubmitted(false);
    setShowResults(false);
    setCurrentResult(null);
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

  // Start timer when user makes first selection
  const startTimerIfNeeded = useCallback(() => {
    if (!timer.isRunning && !isSubmitted) {
      setTimer(prev => ({ ...prev, isRunning: true }));
      startTimeRef.current = new Date();
    }
  }, [timer.isRunning, isSubmitted]);

  const [results, setResults] = useState<SummaryResult[]>([]);
  const studentProgress = mockStudentProgress;

  const handleNext = () => {
    if (currentQuestionIndex < mockHighlightSummaryQuestions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      setQuestion(mockHighlightSummaryQuestions[newIndex]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);
      setQuestion(mockHighlightSummaryQuestions[newIndex]);
    }
  };

  const handleSearch = () => {
    console.log('Search functionality triggered');
    setShowSummarySelector(true);
  };

  const handleSummarySelect = (option: any) => {
    const newIndex = mockHighlightSummaryQuestions.findIndex(q => q.id === option.id);
    if (newIndex !== -1) {
      setCurrentQuestionIndex(newIndex);
      setQuestion(option);
    }
    setShowSummarySelector(false);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const hasResponse = useCallback((): boolean => {
    return selectedOption !== null;
  }, [selectedOption]);

  // Handle option selection
  const handleOptionSelect = (option: 'A' | 'B' | 'C' | 'D') => {
    startTimerIfNeeded();
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (isSubmitted) return;

    setIsSubmitted(true);
    setTimer(prev => ({ ...prev, isRunning: false }));

    const endTime = new Date();
    const timeSpent = Math.floor((endTime.getTime() - startTimeRef.current.getTime()) / 1000);

    const isCorrect = selectedOption === question.correctAnswer;
    const score = isCorrect ? question.maxScore : 0;

    const result: SummaryResult = {
      questionId: String(question.id),
      selectedOption,
      correctAnswer: question.correctAnswer,
      isCorrect,
      score,
      maxScore: question.maxScore,
      completedAt: endTime,
      timeSpent,
    };

    setCurrentResult(result);
    setShowResults(true);
    setResults(prev => [...prev, result]);
  };

  const handleRedo = () => {
    setSelectedOption(null);
    setTimer({
      timeRemaining: question.timeLimit,
      isRunning: false,
      warningThreshold: 30,
      autoSubmit: true,
    });
    setIsSubmitted(false);
    setShowResults(false);
    setCurrentResult(null);
    startTimeRef.current = new Date();
  };

  const questionNumber = studentProgress.questionNumber + currentQuestionIndex;

  const getOptionStyle = (option: SummaryOption) => {
    if (!isSubmitted) {
      return {
        cursor: 'pointer',
        border: selectedOption === option.label ? '2px solid #1976d2' : '1px solid #e0e0e0',
        bgcolor: selectedOption === option.label ? '#e3f2fd' : '#fff',
        '&:hover': { bgcolor: '#f5f5f5', borderColor: '#1976d2' }
      };
    }

    // Show results after submission
    const isSelected = selectedOption === option.label;
    const isCorrect = option.isCorrect;
    const isUserSelectedCorrect = selectedOption === question.correctAnswer;

    if (isSelected && isCorrect) {
      return { border: '2px solid #4caf50', bgcolor: '#e8f5e9' }; // Selected and correct
    } else if (isSelected && !isCorrect) {
      return { border: '2px solid #f44336', bgcolor: '#ffebee' }; // Selected but wrong
    } else if (!isSelected && isCorrect) {
      return { border: '2px solid #4caf50', bgcolor: '#e8f5e9' }; // Correct answer (not selected)
    } else {
      return { border: '1px solid #e0e0e0', bgcolor: '#f9f9f9' }; // Not selected, not correct
    }
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
                bgcolor: '#9c27b0',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: { xs: '12px', sm: '14px', md: '16px' },
                fontWeight: 'bold',
                flexShrink: 0,
                lineHeight: 1.2
              }}
            >
              HCS
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
                  Highlight Correct Summary
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
                <Chip label="Timer will start when you select an option" color="info" size="small" />
              )}
            </Stack>
          </Paper>

          {/* Text-to-Speech Player */}
          <TextToSpeech 
            text={question.audioText}
            autoPlay={false}
            onStart={() => console.log('Audio started')}
            onEnd={() => console.log('Audio ended')}
          />

          {/* Summary Options */}
          <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
              Click on the paragraph that best relates to the recording
            </Typography>
            
            <RadioGroup 
              value={selectedOption || ''} 
              onChange={(e) => handleOptionSelect(e.target.value as 'A' | 'B' | 'C' | 'D')}
            >
              <Stack spacing={2}>
                {question.summaryOptions.map((option) => (
                  <Paper 
                    key={option.id}
                    sx={{
                      p: 2,
                      ...getOptionStyle(option),
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onClick={() => !isSubmitted && handleOptionSelect(option.label)}
                  >
                    <FormControlLabel
                      value={option.label}
                      control={<Radio sx={{ mt: -1 }} />}
                      disabled={isSubmitted}
                      label={
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontSize: { xs: '14px', sm: '15px', md: '16px' },
                            lineHeight: 1.6,
                            pl: 1
                          }}
                        >
                          <strong>{option.label})</strong> {option.text}
                        </Typography>
                      }
                      sx={{ 
                        width: '100%', 
                        margin: 0,
                        alignItems: 'flex-start',
                        cursor: isSubmitted ? 'default' : 'pointer'
                      }}
                    />
                  </Paper>
                ))}
              </Stack>
            </RadioGroup>
          </Paper>

          {/* Progress Indicator */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Progress: {selectedOption ? '1' : '0'} of 1 option selected
            </Typography>
            <LinearProgress
              variant="determinate"
              value={selectedOption ? 100 : 0}
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
        open={showSummarySelector}
        onClose={() => setShowSummarySelector(false)}
        onSelect={handleSummarySelect}
        topics={mockHighlightSummaryQuestions}
        title="Highlight Correct Summary"
        type="question"
      />

      {/* Results Dialog */}
      <Dialog open={showResults} onClose={() => setShowResults(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Quiz Results</Typography>
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
                  color={currentResult.isCorrect ? 'success' : 'error'}
                  size="medium"
                />
                <Chip 
                  label={currentResult.isCorrect ? 'Correct' : 'Incorrect'} 
                  color={currentResult.isCorrect ? 'success' : 'error'}
                  size="medium"
                />
                <Chip 
                  label={`Time: ${Math.floor(currentResult.timeSpent / 60)}:${(currentResult.timeSpent % 60).toString().padStart(2, '0')}`} 
                  color="default"
                  size="medium"
                />
              </Stack>
              
              <Typography variant="h6" sx={{ mb: 2 }}>Answer Review:</Typography>
              <Box sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Your Selection: {currentResult.selectedOption || 'No selection'}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Correct Answer: {currentResult.correctAnswer}
                </Typography>
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
          <Box sx={{ mb: 2, p: 2, bgcolor: '#e8f5e9', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Correct Answer: {question.correctAnswer}
            </Typography>
            <Typography variant="body2">
              {question.summaryOptions.find(opt => opt.isCorrect)?.text}
            </Typography>
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

export default HighlightCorrectSummary;