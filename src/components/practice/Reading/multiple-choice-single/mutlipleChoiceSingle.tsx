import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  LinearProgress
} from '@mui/material';
import { Close } from '@mui/icons-material';
import TopicSelectionDrawer from '../../../common/TopicSelectionDrawer';
import ActionButtons from '../../common/ActionButtons';
import NavigationSection from '../../common/NavigationSection';
import QuestionHeader from '../../common/QuestionHeader';
import StageGoalBanner from '../../common/StageGoalBanner';
import { allMultipleChoiceQuestions } from './mutlipleChoiceSingleMockData';
import { MultipleChoiceQuestion, QuestionProgress, PerformanceData } from './mutlipleChoiceSingleType';

const MultipleChoiceSingle: React.FC = () => {
  // State management
  const [selectedQuestion, setSelectedQuestion] = useState<MultipleChoiceQuestion>(allMultipleChoiceQuestions[0]);
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Performance tracking
  const [questionProgress, setQuestionProgress] = useState<QuestionProgress[]>([]);
  const [currentQuestionStartTime, setCurrentQuestionStartTime] = useState<number>(Date.now());

  // Student info
  const [studentName] = useState('Rachel Carson');
  const [testedCount] = useState(33);

  // Timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize timer when question changes
  useEffect(() => {
    setTimeLeft(selectedQuestion.timeLimit);
    setCurrentQuestionStartTime(Date.now());
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setShowAnswer(false);
    
    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Start new timer only if not submitted
    if (!isSubmitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up - auto submit
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [selectedQuestion.id]); // Only depend on question ID to avoid infinite loops

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle question selection
  const handleQuestionSelect = (question: any) => {
    setSelectedQuestion(question);
    setQuestionNumber(allMultipleChoiceQuestions.findIndex(q => q.id === question.id) + 1);
  };

  // Handle answer selection
  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSubmitted) {
      setSelectedAnswer(parseInt(event.target.value));
    }
  };

  // Handle submit
  const handleSubmit = () => {
    if (selectedAnswer === null && !isSubmitted) {
      // alert('Please select an answer before submitting.');
      return;
    }

    // Stop the timer immediately
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const timeSpent = Math.floor((Date.now() - currentQuestionStartTime) / 1000);
    const isCorrect = selectedAnswer === selectedQuestion.correctAnswer;
    
    // Update progress tracking
    const newProgress: QuestionProgress = {
      questionId: selectedQuestion.id,
      selectedAnswer,
      isCorrect,
      timeSpent,
      attempts: 1
    };
    
    setQuestionProgress(prev => {
      const existingIndex = prev.findIndex(p => p.questionId === selectedQuestion.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...newProgress, attempts: prev[existingIndex].attempts + 1 };
        return updated;
      }
      return [...prev, newProgress];
    });

    setIsSubmitted(true);
    
    // Show result immediately - no longer using popup
    console.log(isCorrect 
      ? `Correct! ✅ Score: ${Math.round((1 - timeSpent / selectedQuestion.timeLimit) * 100)}%`
      : `Incorrect ❌ The correct answer was: ${selectedQuestion.options[selectedQuestion.correctAnswer]}`);
  };

  // Handle re-do
  const handleRedo = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setShowAnswer(false);
    setTimeLeft(selectedQuestion.timeLimit);
    setCurrentQuestionStartTime(Date.now());
    
    // Restart timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Navigation handlers
  const handlePrevious = () => {
    if (questionNumber > 1) {
      const prevQuestion = allMultipleChoiceQuestions[questionNumber - 2];
      handleQuestionSelect(prevQuestion);
    }
  };

  const handleNext = () => {
    if (questionNumber < allMultipleChoiceQuestions.length) {
      const nextQuestion = allMultipleChoiceQuestions[questionNumber];
      handleQuestionSelect(nextQuestion);
    } else {
      setShowTopicSelector(true);
    }
    handleRedo(); // Reset state for next question
  };

  // Dialog handlers
  const handleShowAnswer = () => setShowAnswer(true);
  const handleTranslate = () => setShowTranslate(true);
  const handleSearch = () => setShowTopicSelector(true);
  const handleShowPerformance = () => setShowPerformance(true);

  // Calculate performance data
  const getPerformanceData = (): PerformanceData => {
    const answeredQuestions = questionProgress.filter(p => p.selectedAnswer !== null);
    const correctAnswers = answeredQuestions.filter(p => p.isCorrect).length;
    const totalTimeSpent = answeredQuestions.reduce((sum, p) => sum + p.timeSpent, 0);
    
    // Category performance
    const categoryPerformance: Record<string, { total: number; correct: number; percentage: number }> = {};
    answeredQuestions.forEach(progress => {
      const question = allMultipleChoiceQuestions.find(q => q.id === progress.questionId);
      if (question) {
        if (!categoryPerformance[question.category]) {
          categoryPerformance[question.category] = { total: 0, correct: 0, percentage: 0 };
        }
        categoryPerformance[question.category].total++;
        if (progress.isCorrect) {
          categoryPerformance[question.category].correct++;
        }
        categoryPerformance[question.category].percentage = 
          Math.round((categoryPerformance[question.category].correct / categoryPerformance[question.category].total) * 100);
      }
    });

    // Difficulty performance
    const difficultyPerformance: Record<string, { total: number; correct: number; percentage: number }> = {};
    answeredQuestions.forEach(progress => {
      const question = allMultipleChoiceQuestions.find(q => q.id === progress.questionId);
      if (question) {
        if (!difficultyPerformance[question.difficulty]) {
          difficultyPerformance[question.difficulty] = { total: 0, correct: 0, percentage: 0 };
        }
        difficultyPerformance[question.difficulty].total++;
        if (progress.isCorrect) {
          difficultyPerformance[question.difficulty].correct++;
        }
        difficultyPerformance[question.difficulty].percentage = 
          Math.round((difficultyPerformance[question.difficulty].correct / difficultyPerformance[question.difficulty].total) * 100);
      }
    });

    return {
      totalQuestions: answeredQuestions.length,
      correctAnswers,
      totalTimeSpent,
      averageTimePerQuestion: answeredQuestions.length > 0 ? Math.round(totalTimeSpent / answeredQuestions.length) : 0,
      categoryPerformance,
      difficultyPerformance
    };
  };

  // Filter questions for search
  const filteredQuestions = allMultipleChoiceQuestions.filter(question =>
    question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const performanceData = getPerformanceData();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', p: 2 }}>
      {/* Stage Goal Banner */}
      <StageGoalBanner />

      {/* Main Content */}
      <Card sx={{ maxWidth: 1200, mx: 'auto', mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                bgcolor: '#ffc107',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              MCS
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Multiple Choice (Single)
                </Typography>
                <Chip onClick={() => { }} label="Study Guide" color="primary" size="small" />
              </Stack>
              <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                Read the text and answer the multiple choice question by selecting the correct response. Only one response is correct.
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Question Header */}
          <QuestionHeader 
            questionNumber={questionNumber}
            studentName={studentName}
            testedCount={testedCount}
          />

          {/* Timer and Progress */}
          <Paper sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ color: '#ff5722', fontWeight: 'bold' }}>
                Time: {formatTime(timeLeft)}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={handleShowPerformance}
                sx={{ textTransform: 'none' }}
              >
                View Performance
              </Button>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={((selectedQuestion.timeLimit - timeLeft) / selectedQuestion.timeLimit) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  bgcolor: timeLeft > 10 ? '#4caf50' : '#ff5722',
                },
              }}
            />
          </Paper>

          {/* Question Display */}
          <Paper sx={{ p: 3, mb: 3, bgcolor: '#fafafa' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
              <strong>{selectedQuestion.questionText}</strong>
            </Typography>
            
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <RadioGroup
                value={selectedAnswer?.toString() || ''}
                onChange={handleAnswerChange}
                sx={{ mt: 2 }}
              >
                {selectedQuestion.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={index.toString()}
                    control={<Radio disabled={isSubmitted} />}
                    label={
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: isSubmitted 
                            ? (index === selectedQuestion.correctAnswer 
                              ? '#4caf50' 
                              : (index === selectedAnswer 
                                ? '#f44336' 
                                : '#666'))
                            : '#333',
                          fontWeight: isSubmitted && index === selectedQuestion.correctAnswer ? 'bold' : 'normal'
                        }}
                      >
                        {String.fromCharCode(65 + index)}) {option}
                        {isSubmitted && index === selectedQuestion.correctAnswer && ' ✅'}
                        {isSubmitted && index === selectedAnswer && index !== selectedQuestion.correctAnswer && ' ❌'}
                      </Typography>
                    }
                    sx={{ 
                      alignItems: 'flex-start',
                      mb: 1,
                      '& .MuiFormControlLabel-label': {
                        paddingLeft: 1
                      }
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            
            {/* Question Info */}
            <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
              <Chip
              onClick={() => { }}
                label={selectedQuestion.difficulty}
                size="small"
                color={
                  selectedQuestion.difficulty === 'Beginner' ? 'success' :
                  selectedQuestion.difficulty === 'Intermediate' ? 'warning' : 'error'
                }
              />
              <Chip
              onClick={() => { }}
                label={selectedQuestion.category}
                size="small"
                variant="outlined"
              />
              <Chip
              onClick={() => { }}
                label={`${selectedQuestion.timeLimit}s`}
                size="small"
                variant="outlined"
              />
            </Stack>
          </Paper>

          {/* Answer Explanation Card - Shows after submission */}
          {isSubmitted && (
            <Paper sx={{ p: 3, mb: 3, bgcolor: selectedAnswer === selectedQuestion.correctAnswer ? '#e8f5e9' : '#ffebee' }}>
              <Stack spacing={2}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: selectedAnswer === selectedQuestion.correctAnswer ? '#2e7d32' : '#c62828',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  {selectedAnswer === selectedQuestion.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}
                  {selectedAnswer === selectedQuestion.correctAnswer && (
                    <Chip 
                    onClick={() => { }}
                      label={`Score: ${Math.round((1 - (Math.floor((Date.now() - currentQuestionStartTime) / 1000)) / selectedQuestion.timeLimit) * 100)}%`}
                      size="small"
                      color="success"
                    />
                  )}
                </Typography>
                
                {selectedAnswer !== selectedQuestion.correctAnswer && (
                  <Typography variant="body1" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                    <strong>Correct Answer:</strong> {String.fromCharCode(65 + selectedQuestion.correctAnswer)}) {selectedQuestion.options[selectedQuestion.correctAnswer]}
                  </Typography>
                )}
                
                <Typography variant="body2" sx={{ 
                  lineHeight: 1.6, 
                  bgcolor: 'rgba(255,255,255,0.7)', 
                  p: 2, 
                  borderRadius: 1,
                  border: '1px solid rgba(0,0,0,0.1)'
                }}>
                  <strong>Explanation:</strong> {selectedQuestion.explanation}
                </Typography>
              </Stack>
            </Paper>
          )}

          {/* Action Buttons */}
          <ActionButtons
            // selectedAnswer={selectedAnswer}
            hasResponse={isSubmitted || (selectedAnswer && selectedAnswer > 0 ? true : false)}
            onSubmit={handleSubmit}
            onRedo={handleRedo}
            onTranslate={handleTranslate}
            onShowAnswer={handleShowAnswer}
             recordedBlob={null}            // disabled={timeLeft === 0}
          />

          {/* Navigation Section */}
          <NavigationSection
            onSearch={handleSearch}
            onPrevious={handlePrevious}
            onNext={handleNext}
            questionNumber={questionNumber}
            // totalQuestions={allMultipleChoiceQuestions.length}
            // correctAnswers={performanceData.correctAnswers}
          />
        </CardContent>
      </Card>

      {/* Topic Selection Drawer */}
      <TopicSelectionDrawer
        open={showTopicSelector}
        onClose={() => setShowTopicSelector(false)}
        onSelect={handleQuestionSelect}
        topics={allMultipleChoiceQuestions}
        title="Select Question"
        type="question"
      />

      {/* Answer Dialog */}
      <Dialog open={showAnswer} onClose={() => setShowAnswer(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Answer & Explanation</Typography>
            <IconButton onClick={() => setShowAnswer(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Question:</strong> {selectedQuestion.questionText}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: '#4caf50', fontWeight: 'bold' }}>
            <strong>Correct Answer:</strong> {String.fromCharCode(65 + selectedQuestion.correctAnswer)}) {selectedQuestion.options[selectedQuestion.correctAnswer]}
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.6, bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
            <strong>Explanation:</strong> {selectedQuestion.explanation}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAnswer(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Performance Dialog */}
      <Dialog open={showPerformance} onClose={() => setShowPerformance(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Performance Summary</Typography>
            <IconButton onClick={() => setShowPerformance(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            {/* Overall Performance */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Overall Performance</Typography>
              <Stack direction="row" spacing={4}>
                <Box>
                  <Typography variant="h4" color="primary">{performanceData.correctAnswers}</Typography>
                  <Typography variant="body2">Correct Answers</Typography>
                </Box>
                <Box>
                  <Typography variant="h4" color="text.secondary">{performanceData.totalQuestions}</Typography>
                  <Typography variant="body2">Total Questions</Typography>
                </Box>
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {performanceData.totalQuestions > 0 ? Math.round((performanceData.correctAnswers / performanceData.totalQuestions) * 100) : 0}%
                  </Typography>
                  <Typography variant="body2">Accuracy</Typography>
                </Box>
                <Box>
                  <Typography variant="h4" color="info.main">{performanceData.averageTimePerQuestion}s</Typography>
                  <Typography variant="body2">Avg Time/Question</Typography>
                </Box>
              </Stack>
            </Box>

            {/* Category Performance */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Performance by Category</Typography>
              {Object.entries(performanceData.categoryPerformance).map(([category, stats]) => (
                <Box key={category} sx={{ mb: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1">{category}</Typography>
                    <Typography variant="body2">
                      {stats.correct}/{stats.total} ({stats.percentage}%)
                    </Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.percentage} 
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              ))}
            </Box>

            {/* Difficulty Performance */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Performance by Difficulty</Typography>
              {Object.entries(performanceData.difficultyPerformance).map(([difficulty, stats]) => (
                <Box key={difficulty} sx={{ mb: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1">{difficulty}</Typography>
                    <Typography variant="body2">
                      {stats.correct}/{stats.total} ({stats.percentage}%)
                    </Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.percentage} 
                    sx={{ mt: 0.5 }}
                    color={
                      difficulty === 'Beginner' ? 'success' :
                      difficulty === 'Intermediate' ? 'warning' : 'error'
                    }
                  />
                </Box>
              ))}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPerformance(false)}>Close</Button>
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
            Translation feature will help you understand the question content in your preferred language.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTranslate(false)}>Cancel</Button>
          <Button variant="contained">Translate</Button>
        </DialogActions>
      </Dialog>

      {/* Search Dialog */}
      <Dialog open={showSearch} onClose={() => setShowSearch(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Search Questions</Typography>
            <IconButton onClick={() => setShowSearch(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Search by question text, category, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
          />
          <List>
            {filteredQuestions.slice(0, 10).map((question) => (
              <ListItem key={question.id} disablePadding>
                <ListItemButton 
                  onClick={() => {
                    handleQuestionSelect(question);
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                >
                  <ListItemText
                    primary={question.title}
                    secondary={`${question.category} • ${question.difficulty}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSearch(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MultipleChoiceSingle;