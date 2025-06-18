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
  TextField,
  LinearProgress,
} from '@mui/material';
import { Close, Timer } from '@mui/icons-material';
import ActionButtons from '../../common/ActionButtons';
import NavigationSection from '../../common/NavigationSection';
import QuestionHeader from '../../common/QuestionHeader';
import StageGoalBanner from '../../common/StageGoalBanner';
import AudioPlayer from '../../common/AudioPlayer';
import TopicSelectionDrawer from '../../../common/TopicSelectionDrawer';
import { mockListeningPassages, mockStudentProgress } from './FillinTheBlanksMockData';
import { ListeningPassage, BlankPosition, TimerState, QuestionResult } from './FillinTheBlanksTypes';

interface ListeningFillBlanksProps {}

const ListeningFillBlanks: React.FC<ListeningFillBlanksProps> = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [passage, setPassage] = useState<ListeningPassage>(mockListeningPassages[currentQuestionIndex]);
  const [showFillinBlanksSelector, setShowFillinBlanksSelector] = useState(false);

  // State management
  const [blanks, setBlanks] = useState<BlankPosition[]>(passage.blanks.map(blank => ({ ...blank })));
  const [timer, setTimer] = useState<TimerState>({
    timeRemaining: passage.timeLimit,
    isRunning: false, // Start as false, will be started when user first types
    warningThreshold: 30,
    autoSubmit: true,
  });
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(100);
  const [audioError, setAudioError] = useState<string | null>(null);
  
  const [showAnswer, setShowAnswer] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentResult, setCurrentResult] = useState<QuestionResult | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date>(new Date());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio setup
  useEffect(() => {
    if (passage.audioUrl) {
      audioRef.current = new Audio(passage.audioUrl);
      
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
  }, [passage.audioUrl]);

  // Sync state when passage changes
  useEffect(() => {
    setBlanks(passage.blanks.map(blank => ({ ...blank })));
    setTimer({
      timeRemaining: passage.timeLimit,
      isRunning: false,
      warningThreshold: 30,
      autoSubmit: true,
    });
    setIsSubmitted(false);
    setShowResults(false);
    setCurrentResult(null);
    setCurrentTime(0);
    setIsPlaying(false);
    
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
    
    startTimeRef.current = new Date();
  }, [passage]);

  // Timer functionality - FIXED: Now properly running
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

  // Start timer when user first types
  const startTimerIfNeeded = useCallback(() => {
    if (!timer.isRunning && !isSubmitted) {
      setTimer(prev => ({ ...prev, isRunning: true }));
      startTimeRef.current = new Date();
    }
  }, [timer.isRunning, isSubmitted]);

  const [results, setResults] = useState<QuestionResult[]>([]);
  const studentProgress = mockStudentProgress;

  const handleNext = () => {
    if (currentQuestionIndex < mockListeningPassages.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      setPassage(mockListeningPassages[newIndex]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);
      setPassage(mockListeningPassages[newIndex]);
    }
  };

  const handleSearch = () => {
    console.log('Search functionality triggered');
    setShowFillinBlanksSelector(true);
  };

  const handleFillinBlankSelect = (option: any) => {
    const newIndex = mockListeningPassages.findIndex(p => p.id === option.id);
    if (newIndex !== -1) {
      setCurrentQuestionIndex(newIndex);
      setPassage(option);
    }
    setShowFillinBlanksSelector(false);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const areAllBlanksFilled = useCallback((): boolean => {
    return blanks.every(blank => blank.filledWord && blank.filledWord.trim() !== '');
  }, [blanks]);

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

  // Handle text input change for blanks
  const handleBlankInputChange = (blankId: string, value: string) => {
    // Start timer on first input
    startTimerIfNeeded();
    
    setBlanks(prev => prev.map(blank => 
      blank.id === blankId 
        ? { ...blank, filledWord: value }
        : blank
    ));
  };

  const handleSubmit = () => {
    if (isSubmitted) return;

    setIsSubmitted(true);
    setTimer(prev => ({ ...prev, isRunning: false }));

    // Pause audio if playing
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    const endTime = new Date();
    const timeSpent = Math.floor((endTime.getTime() - startTimeRef.current.getTime()) / 1000);

    let correctAnswers = 0;
    const evaluatedBlanks = blanks.map(blank => {
      const isCorrect = blank.filledWord?.toLowerCase().trim() === blank.correctAnswer.toLowerCase().trim();
      if (isCorrect) correctAnswers++;
      return { ...blank, isCorrect };
    });

    const score = Math.round((correctAnswers / blanks.length) * passage.maxScore);

    const result: QuestionResult = {
      questionId: String(passage?.id),
      score,
      maxScore: passage.maxScore,
      correctAnswers,
      totalBlanks: blanks.length,
      completedAt: endTime,
      timeSpent,
      answers: evaluatedBlanks,
    };

    setBlanks(evaluatedBlanks);
    setCurrentResult(result);
    setShowResults(true);
    setResults(prev => [...prev, result]);
  };

  const handleRedo = () => {
    setBlanks(passage.blanks.map(blank => ({ ...blank })));
    setTimer({
      timeRemaining: passage.timeLimit,
      isRunning: false,
      warningThreshold: 30,
      autoSubmit: true,
    });
    setIsSubmitted(false);
    setShowResults(false);
    setCurrentResult(null);
    setCurrentTime(0);
    setIsPlaying(false);
    
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
    
    startTimeRef.current = new Date();
  };

  const questionNumber = studentProgress.questionNumber + currentQuestionIndex;

  // Render text with input fields for blanks
  const renderTextWithBlanks = () => {
    let textParts = passage.text.split(/(\[BLANK_\d+\])/);
    
    return textParts.map((part, index) => {
      const blankMatch = part.match(/\[BLANK_(\d+)\]/);
      if (blankMatch) {
        const blankIndex = parseInt(blankMatch[1]);
        const blank = blanks.find(b => b.position === blankIndex);
        if (blank) {
          return (
            <TextField
              key={blank.id}
              size="small"
              variant="outlined"
              value={blank.filledWord || ''}
              onChange={(e) => handleBlankInputChange(blank.id, e.target.value)}
              disabled={isSubmitted}
              sx={{
                mx: 0.5,
                width: '120px',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: blank.isCorrect === true ? '#e8f5e9' :
                                   blank.isCorrect === false ? '#ffebee' : '#fff',
                  '& fieldset': {
                    borderColor: blank.isCorrect === true ? '#4caf50' :
                                 blank.isCorrect === false ? '#f44336' : '#ccc',
                    borderWidth: blank.isCorrect !== undefined ? '2px' : '1px',
                  },
                },
                '& .MuiInputBase-input': {
                  textAlign: 'center',
                  padding: '8px 12px',
                  fontSize: '14px',
                },
              }}
              placeholder={`Blank ${blank.position + 1}`}
            />
          );
        }
      }
      return <span key={index}>{part}</span>;
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
                bgcolor: '#2196f3',
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
              FIB
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
                  Fill in the Blanks
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
                {passage.instructions}
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

          {/* Audio Player */}
          <AudioPlayer
            selectedTopic={passage}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            audioError={audioError}
            onTogglePlayback={handleTogglePlayback}
            onVolumeChange={handleVolumeChange}
            formatTime={formatTime}
          />

          {/* Passage with Input Fields */}
          <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              {passage.title}
            </Typography>
            <Typography 
              variant="body1" 
              component="div"
              sx={{ 
                lineHeight: 2,
                fontSize: { xs: '14px', sm: '15px', md: '16px' },
                textAlign: 'justify',
                '& .MuiTextField-root': {
                  verticalAlign: 'baseline'
                }
              }}
            >
              {renderTextWithBlanks()}
            </Typography>
          </Paper>

          {/* Progress Indicator */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Progress: {blanks.filter(b => b.filledWord && b.filledWord.trim() !== '').length} of {blanks.length} blanks filled
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(blanks.filter(b => b.filledWord && b.filledWord.trim() !== '').length / blanks.length) * 100}
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
            hasResponse={areAllBlanksFilled()}
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
        open={showFillinBlanksSelector}
        onClose={() => setShowFillinBlanksSelector(false)}
        onSelect={handleFillinBlankSelect}
        topics={mockListeningPassages}
        title="Listening: Fill in the Blanks"
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
                  color={currentResult.score >= (currentResult.maxScore * 0.7) ? 'success' : 'error'}
                  size="medium"
                />
                <Chip 
                  label={`${currentResult.correctAnswers}/${currentResult.totalBlanks} Correct`} 
                  color="info"
                  size="medium"
                />
                <Chip 
                  label={`Time: ${Math.floor(currentResult.timeSpent / 60)}:${(currentResult.timeSpent % 60).toString().padStart(2, '0')}`} 
                  color="default"
                  size="medium"
                />
              </Stack>
              <Typography variant="h6" sx={{ mb: 2 }}>Answer Review:</Typography>
              {currentResult.answers.map((answer, index) => (
                <Box key={answer.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Blank {answer.position + 1}:
                    </Typography>
                    <Chip 
                      label={answer.filledWord || 'Not filled'} 
                      color={answer.isCorrect ? 'success' : 'error'}
                      size="small"
                    />
                    <Typography variant="body2" color="textSecondary">
                      Correct answer: {answer.correctAnswer}
                    </Typography>
                  </Stack>
                </Box>
              ))}
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
            <strong>Audio:</strong> {passage.title}
          </Typography>
          {blanks.map((blank, index) => (
            <Box key={blank.id} sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Blank {blank.position + 1}:</strong> {blank.correctAnswer}
              </Typography>
            </Box>
          ))}
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

export default ListeningFillBlanks;