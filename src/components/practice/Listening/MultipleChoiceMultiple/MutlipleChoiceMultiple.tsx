import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  Stack,
  Paper,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  LinearProgress,
  TextField
} from '@mui/material';
import { Close } from '@mui/icons-material';
import ActionButtons from '../../common/ActionButtons';
import NavigationSection from '../../common/NavigationSection';
import QuestionHeader from '../../common/QuestionHeader';
import StageGoalBanner from '../../common/StageGoalBanner';
import AudioPlayer from '../../common/AudioPlayer';
import TopicSelectionDrawer from '../../../common/TopicSelectionDrawer';
import { ListeningMultipleChoiceQuestion, SubmissionResult } from './MultipleChoiceMultipleType';
import { listeningMultipleChoiceQuestions } from './MutlipleChoiceMultipleMockData';
import { User } from '../../../../types/user';

interface ListeningMultipleChoiceProps {
  user?: User | null;
}

const ListeningMultipleChoice: React.FC<ListeningMultipleChoiceProps> = ({ user }) => {
  // State management
  const [selectedQuestion, setSelectedQuestion] = useState<ListeningMultipleChoiceQuestion>(listeningMultipleChoiceQuestions[0]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(300); // 5 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [questionNumber, setQuestionNumber] = useState<number>(119);
  const [studentName] = useState<string>('Weight Gain');
  const [testedCount] = useState<number>(51);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(100);
  const [audioError, setAudioError] = useState<string | null>(null);
  
  // Dialog states
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [showTranslate, setShowTranslate] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showQuestionSelector, setShowQuestionSelector] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio setup
  useEffect(() => {
    if (selectedQuestion.audioUrl) {
      audioRef.current = new Audio(selectedQuestion.audioUrl);
      
      const audio = audioRef.current;
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      
      const handleError = () => {
        setAudioError('Failed to load audio file');
      };
      
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
        audio.pause();
      };
    }
  }, [selectedQuestion.audioUrl]);

  // Timer functionality
  useEffect(() => {
    if (isTimerActive && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleAutoSubmit();
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isTimerActive, timeRemaining]);

  // Start timer when user starts selecting options
  useEffect(() => {
    if (selectedOptions.length > 0 && !isTimerActive && !isSubmitted) {
      setIsTimerActive(true);
    }
  }, [selectedOptions, isTimerActive, isSubmitted]);

  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const getProgressPercentage = (): number => {
    return ((300 - timeRemaining) / 300) * 100;
  };

  // Audio controls
  const handleTogglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const volumeValue = Array.isArray(newValue) ? newValue[0] : newValue;
    setVolume(volumeValue);
    if (audioRef.current) {
      audioRef.current.volume = volumeValue / 100;
    }
  };

  // Handle option selection
  const handleOptionChange = (optionId: string) => {
    if (isSubmitted) return;
    
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  // Calculate score and create submission result
  const calculateScore = (selected: string[], question: ListeningMultipleChoiceQuestion): SubmissionResult => {
    const correctAnswers = question.options.filter(opt => opt.isCorrect).map(opt => opt.id);
    const correctSelections = selected.filter(id => correctAnswers.includes(id));
    const incorrectSelections = selected.filter(id => !correctAnswers.includes(id));
    const missedAnswers = correctAnswers.filter(id => !selected.includes(id));
    
    // Scoring algorithm
    let score = 0;
    const totalCorrect = correctAnswers.length;
    const totalSelected = selected.length;
    
    if (totalSelected === 0) {
      score = 0;
    } else {
      // Points for correct selections
      const correctPoints = (correctSelections.length / totalCorrect) * 70;
      
      // Penalty for incorrect selections
      const incorrectPenalty = (incorrectSelections.length / question.options.length) * 30;
      
      // Bonus for perfect answer
      const perfectBonus = (correctSelections.length === totalCorrect && incorrectSelections.length === 0) ? 30 : 0;
      
      score = Math.max(0, Math.min(100, correctPoints - incorrectPenalty + perfectBonus));
    }
    
    return {
      score: Math.round(score),
      correctAnswers,
      selectedAnswers: selected,
      feedback: {
        correct: correctSelections,
        incorrect: incorrectSelections,
        missed: missedAnswers
      }
    };
  };

  // Handle submission
  const handleSubmit = (): void => {
    if (selectedOptions.length === 0) {
      alert('Please select at least one option before submitting.');
      return;
    }
    
    const result = calculateScore(selectedOptions, selectedQuestion);
    setSubmissionResult(result);
    setIsSubmitted(true);
    setIsTimerActive(false);
    
    // Pause audio if playing
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    
    alert(`Question submitted! Score: ${result.score}/100`);
  };

  // Handle auto submit when timer expires
  const handleAutoSubmit = (): void => {
    if (selectedOptions.length > 0) {
      const result = calculateScore(selectedOptions, selectedQuestion);
      setSubmissionResult(result);
      setIsSubmitted(true);
      alert(`Time's up! Auto-submitted. Score: ${result.score}/100`);
    } else {
      alert("Time's up! No answer submitted.");
      setIsSubmitted(true);
    }
    setIsTimerActive(false);
    
    // Pause audio if playing
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Action handlers
  const handleRedo = (): void => {
    setSelectedOptions([]);
    setTimeRemaining(300);
    setIsTimerActive(false);
    setSubmissionResult(null);
    setIsSubmitted(false);
    setCurrentTime(0);
    setIsPlaying(false);
    
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
  };

  const handleShowAnswer = (): void => {
    setShowAnswer(true);
  };

  const handleTranslate = (): void => {
    setShowTranslate(true);
  };

  const handleSearch = (): void => {
    setShowSearch(true);
  };

  const handlePrevious = (): void => {
    if (questionNumber > 1) {
      setQuestionNumber(prev => prev - 1);
      handleRedo();
    }
  };

  const handleNext = (): void => {
    setShowQuestionSelector(true);
  };

  // Handle question selection
  const handleQuestionSelect = (question: any) => {
    setSelectedQuestion(question);
    setQuestionNumber(prev => prev + 1);
    setShowQuestionSelector(false);
    handleRedo();
  };

  // Filter questions for search
  const filteredQuestions = listeningMultipleChoiceQuestions.filter(question =>
    question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get option color based on submission result
  const getOptionColor = (optionId: string): { bgcolor: string; color: string; border?: string } => {
    if (!isSubmitted || !submissionResult) {
      return { bgcolor: 'transparent', color: '#333' };
    }
    
    const isCorrectAnswer = selectedQuestion.options.find(opt => opt.id === optionId)?.isCorrect;
    const isSelected = selectedOptions.includes(optionId);
    
    if (isSelected && isCorrectAnswer) {
      return { bgcolor: '#4caf50', color: 'white' }; // Green for correct selection
    } else if (isSelected && !isCorrectAnswer) {
      return { bgcolor: '#f44336', color: 'white' }; // Red for incorrect selection
    } else if (!isSelected && isCorrectAnswer) {
      return { bgcolor: '#fff3e0', color: '#333', border: '2px solid #4caf50' }; // Should have been selected
    } else {
      return { bgcolor: 'transparent', color: '#333' };
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', p: { xs: 1, sm: 2 } }}>
      {/* Stage Goal Banner */}
      <StageGoalBanner />

      {/* Main Content */}
      <Card sx={{ maxWidth: 1200, mx: 'auto', mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          {/* Header */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            alignItems={{ xs: 'flex-start', sm: 'center' }} 
            spacing={2} 
            sx={{ mb: 3 }}
          >
            <Box
              sx={{
                width: { xs: 50, sm: 55, md: 60 },
                height: { xs: 50, sm: 55, md: 60 },
                bgcolor: '#00bcd4',
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
              LCM
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
                  Listening Multiple Choice (Multiple)
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
                Listen to the recording and answer the question by selecting all the correct responses. You will need to select more than one response.
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

          {/* Test Sensitivity & Timer */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            alignItems={{ xs: 'flex-start', sm: 'center' }} 
            justifyContent="space-between"
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#f44336',
                  fontWeight: 'bold',
                  fontSize: { xs: '13px', sm: '14px' }
                }}
              >
                #{questionNumber} {selectedQuestion.testSensitivity || 'Audio'}
              </Typography>
              <Chip label="Audio" color="error" variant="outlined" size="small" sx={{ mt: 1 }} />
            </Box>
            
            <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: timeRemaining < 60 ? '#f44336' : '#4caf50', 
                  fontWeight: 'bold',
                  fontSize: { xs: '16px', sm: '18px', md: '20px' }
                }}
              >
                Time: {formatTime(timeRemaining)}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={getProgressPercentage()}
                sx={{
                  width: { xs: '100%', sm: '200px' },
                  height: { xs: 6, sm: 8 },
                  borderRadius: 4,
                  bgcolor: '#e0e0e0',
                  mt: 1,
                  '& .MuiLinearProgress-bar': {
                    bgcolor: timeRemaining < 60 ? '#f44336' : '#4caf50',
                  },
                }}
              />
            </Box>
          </Stack>

          {/* Audio Player */}
          <AudioPlayer
            selectedTopic={selectedQuestion}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            audioError={audioError}
            onTogglePlayback={handleTogglePlayback}
            onVolumeChange={handleVolumeChange}
            formatTime={formatTime}
          />

          {/* Question */}
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#333', 
              mb: 3, 
              fontWeight: 'bold',
              fontSize: { xs: '16px', sm: '18px', md: '20px' },
              wordBreak: 'break-word'
            }}
          >
            {selectedQuestion.question}
          </Typography>

          {/* Options */}
          <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
            <FormGroup>
              {selectedQuestion.options.map((option) => {
                const optionStyle = getOptionColor(option.id);
                return (
                  <Box
                    key={option.id}
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 1,
                      ...optionStyle,
                      border: optionStyle.border || '1px solid #e0e0e0',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedOptions.includes(option.id)}
                          onChange={() => handleOptionChange(option.id)}
                          disabled={isSubmitted}
                          sx={{
                            color: optionStyle.color,
                            '&.Mui-checked': {
                              color: optionStyle.color
                            }
                          }}
                        />
                      }
                      label={
                        <Typography 
                          sx={{ 
                            color: optionStyle.color,
                            fontSize: { xs: '14px', sm: '15px', md: '16px' },
                            fontWeight: isSubmitted && selectedQuestion.options.find(opt => opt.id === option.id)?.isCorrect ? 'bold' : 'normal'
                          }}
                        >
                          <strong>{option.id})</strong> {option.text}
                        </Typography>
                      }
                    />
                  </Box>
                );
              })}
            </FormGroup>
          </Paper>

          {/* Submission Result */}
          {isSubmitted && submissionResult && (
            <Alert 
              severity={submissionResult.score >= 70 ? 'success' : submissionResult.score >= 50 ? 'warning' : 'error'} 
              sx={{ mb: 3 }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                Score: {submissionResult.score}/100
              </Typography>
              <Typography variant="body2">
                Correct: {submissionResult.feedback.correct.join(', ') || 'None'} | 
                Incorrect: {submissionResult.feedback.incorrect.join(', ') || 'None'} | 
                Missed: {submissionResult.feedback.missed.join(', ') || 'None'}
              </Typography>
            </Alert>
          )}

          {/* Action Buttons */}
          <ActionButtons
            hasResponse={selectedOptions.length > 0}
            onSubmit={handleSubmit}
            onRedo={handleRedo}
            onTranslate={handleTranslate}
            onShowAnswer={handleShowAnswer}
            recordedBlob={null}
          />

          {/* Navigation Section */}
          <NavigationSection
            onSearch={handleSearch}
            onPrevious={handlePrevious}
            onNext={handleNext}
            questionNumber={questionNumber}
          />
        </CardContent>
      </Card>

      {/* Topic Selection Drawer */}
      <TopicSelectionDrawer
        open={showQuestionSelector}
        onClose={() => setShowQuestionSelector(false)}
        onSelect={handleQuestionSelect}
        topics={listeningMultipleChoiceQuestions}
        title="Select Question"
        type="question"
      />

      {/* Answer Dialog */}
      <Dialog open={showAnswer} onClose={() => setShowAnswer(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Correct Answers & Explanation</Typography>
            <IconButton onClick={() => setShowAnswer(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Question:</strong> {selectedQuestion.title}
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 2, color: '#4caf50' }}>
            Correct Answers:
          </Typography>
          {selectedQuestion.options.filter(opt => opt.isCorrect).map(option => (
            <Typography key={option.id} variant="body2" sx={{ mb: 1, p: 1, bgcolor: '#e8f5e8', borderRadius: 1 }}>
              <strong>{option.id})</strong> {option.text}
            </Typography>
          ))}
          
          {selectedQuestion.explanation && (
            <>
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Explanation:
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                {selectedQuestion.explanation}
              </Typography>
            </>
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
            placeholder="Search by title, category, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
          />
          <List>
            {filteredQuestions.map((question) => (
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

export default ListeningMultipleChoice;