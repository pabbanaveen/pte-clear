import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container, Box, Typography, Card, CardContent, Button, Chip, Paper, Stack, List, ListItem, ListItemText, LinearProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  useMediaQuery
} from '@mui/material';
import { styled, Theme, useTheme } from '@mui/material/styles';
import MicIcon from '@mui/icons-material/Mic';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TimerIcon from '@mui/icons-material/Timer';
import { Close } from '@mui/icons-material';
import ActionButtons from '../../common/ActionButtons';
import NavigationSection from '../../common/NavigationSection';
import QuestionHeader from '../../common/QuestionHeader';
import RecordingSection from '../../common/RecordingSection';
import StageGoalBanner from '../../common/StageGoalBanner';
import { readAloudQuestions } from './ReadALoudMockData';
import { ReadAloudQuestion, UserAttempt } from './ReadAloudTypes';
import { User } from '../../../../types/user';
import TopicSelectionDrawer from '../../../common/TopicSelectionDrawer';

interface Question {
  id: number;
  text: string;
  preparationTime: number;
  recordingTime: number;
}

interface Feedback {
  overallScore: number;
  pronunciation: number;
  fluency: number;
  content: number;
  feedback: string[];
  improvements: string[];
}

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: Number(theme.shape.borderRadius) * 2,
  boxShadow: theme.shadows[3],
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const RecordingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 64,
  height: 64,
  borderRadius: '50%',
  backgroundColor: theme.palette.error.main,
  animation: 'pulse 1.5s ease-in-out infinite',
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)', opacity: 1 },
    '50%': { transform: 'scale(1.2)', opacity: 0.7 },
    '100%': { transform: 'scale(1)', opacity: 1 },
  },
  [theme.breakpoints.down('sm')]: {
    width: 48,
    height: 48,
  },
}));

interface PracticeTestsProps {
  user: User | null;
}

const useAudioRecording = (preparationTime: number | null, recordingTime = 40000) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkMicPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicPermission(true);
        stream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        console.error('Microphone permission check failed:', error);
        setMicPermission(false);
      }
    };
    checkMicPermission();
  }, []);

  const toggleRecording = async () => {
    if (micPermission === false) {
      alert('Microphone permission is required. Please grant permission and try again.');
      return;
    }

    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (event) => chunks.push(event.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          setRecordedBlob(blob);
          const url = URL.createObjectURL(blob);
          setRecordedAudioUrl(url);
          stream.getTracks().forEach((track) => track.stop());
          console.log('Recording stopped, blob created');
        };

        mediaRecorder.start();
        setIsRecording(true);
        console.log('Recording started');

        timerRef.current = setTimeout(() => {
          if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            console.log(`Recording auto-stopped after ${recordingTime / 1000}s`);
          }
        }, recordingTime);
      } catch (error) {
        console.error('Microphone access denied:', error);
        setMicPermission(false);
        alert('Unable to access microphone. Please check permissions.');
      }
    } else if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      console.log('Recording manually stopped');
    }
  };

  const resetRecording = () => {
    setRecordedBlob(null);
    setRecordedAudioUrl(null);
    setIsRecording(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    return () => {
      if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
    };
  }, [recordedAudioUrl]);

  return { isRecording, recordedBlob, recordedAudioUrl, micPermission, toggleRecording, resetRecording };
};

export const ReadAloud: React.FC<PracticeTestsProps> = ({ user }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<ReadAloudQuestion>(readAloudQuestions[0]);
  const [questionNumber, setQuestionNumber] = useState(65535);
  const [studentName] = useState('John Doe');
  const [testedCount] = useState(30);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const [showAttempts, setShowAttempts] = useState(false);
  const [preparationTime, setPreparationTime] = useState<number | null>(null);
  const [showRecordingPrompt, setShowRecordingPrompt] = useState(false);
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  const [attempts, setAttempts] = useState<UserAttempt[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const completedQuestions = attempts.length;

  const audioRecording = useAudioRecording(preparationTime, selectedQuestion.recordingTime * 1000);
  const prepTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load attempts from localStorage
  useEffect(() => {
    const savedAttempts = localStorage.getItem('readAloudAttempts');
    if (savedAttempts) {
      try {
        setAttempts(JSON.parse(savedAttempts));
      } catch (error) {
        console.error('Failed to parse readAloudAttempts:', error);
        localStorage.removeItem('readAloudAttempts');
      }
    }
  }, []);

  // Save attempt to localStorage
  useEffect(() => {
    if (audioRecording.recordedBlob && audioRecording.recordedAudioUrl) {
      const attempt: UserAttempt = {
        questionId: selectedQuestion.id,
        recordedAudioUrl: audioRecording.recordedAudioUrl,
        timestamp: new Date().toISOString(),
      };
      setAttempts((prev) => {
        const newAttempts = [...prev, attempt];
        try {
          localStorage.setItem('readAloudAttempts', JSON.stringify(newAttempts));
        } catch (error) {
          console.error('Failed to save readAloudAttempts:', error);
        }
        return newAttempts;
      });
    }
  }, [audioRecording.recordedBlob, audioRecording.recordedAudioUrl, selectedQuestion.id]);

  // Preparation timer
  useEffect(() => {
    if (preparationTime !== null && preparationTime > 0) {
      prepTimerRef.current = setTimeout(() => {
        setPreparationTime((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (preparationTime === 0) {
      setShowRecordingPrompt(true);
      setPreparationTime(null);
      console.log('Preparation time ended');
    }
    return () => {
      if (prepTimerRef.current) clearTimeout(prepTimerRef.current);
    };
  }, [preparationTime]);

  // Handlers
  const handleSubmit = () => {
    console.log('Submit clicked');
    if (audioRecording.recordedBlob) {
      alert('Recording submitted! Score will be available after processing.');
      setQuestionNumber((prev) => prev + 1);
      audioRecording.resetRecording();
      setPreparationTime(null);
      setShowRecordingPrompt(false);
    } else {
      alert('Please record your reading before submitting.');
    }
  };

  const handleRedo = () => {
    console.log('Redo clicked');
    audioRecording.resetRecording();
    setPreparationTime(null);
    setShowRecordingPrompt(false);
  };

  const handleTranslate = () => {
    console.log('Translate clicked');
    setShowTranslate(true);
  };

  const handleShowAnswer = () => {
    console.log('Show Answer clicked');
    setShowAnswer(true);
  };

  const handleViewAttempts = () => {
    console.log('View Attempts clicked');
    setShowAttempts(true);
  };

  const handlePrevious = () => {
    console.log('Previous clicked');
    const currentIndex = readAloudQuestions.findIndex(q => q.id === selectedQuestion.id);
    if (currentIndex > 0) {
      setSelectedQuestion(readAloudQuestions[currentIndex - 1]);
      setQuestionNumber(questionNumber - 1);
      audioRecording.resetRecording();
      setPreparationTime(null);
      setShowRecordingPrompt(false);
    }
  };

  const handleNext = () => {
    console.log('Next clicked');
    const currentIndex = readAloudQuestions.findIndex(q => q.id === selectedQuestion.id);
    if (currentIndex < readAloudQuestions.length - 1) {
      setSelectedQuestion(readAloudQuestions[currentIndex + 1]);
      setQuestionNumber(questionNumber + 1);
      audioRecording.resetRecording();
      setPreparationTime(null);
      setShowRecordingPrompt(false);
    }
  };

  const handleStartPreparation = () => {
    setPreparationTime(selectedQuestion.preparationTime);
  };

  const handleTopicSelect = (topic: any) => {
    console.log('Topic selected:', topic);
    setSelectedQuestion(topic);
    setQuestionNumber(readAloudQuestions.findIndex(q => q.id === topic.id) + 65535);
    audioRecording.resetRecording();
    setPreparationTime(null);
    setShowRecordingPrompt(false);
    setShowTopicSelector(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', p: isMobile ? 1 : 2 }}>
      {/* Stage Goal Banner */}
      <StageGoalBanner />

      {/* Progress Display */}
      <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
        Progress: {completedQuestions}/{readAloudQuestions.length} questions attempted
      </Typography>

      {/* Main Content */}
      <Card sx={{ maxWidth: isMobile ? '100%' : 1200, mx: 'auto', mb: 3 }}>
        <CardContent sx={{ p: isMobile ? 2 : 3 }}>
          {/* Header */}
          <Stack
            direction={isMobile ? 'column' : 'row'}
            alignItems={isMobile ? 'flex-start' : 'center'}
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                bgcolor: '#2196f3',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
              }}
            >
              RA
            </Box>
            <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 'bold', color: '#333' }}>
              Read Aloud
            </Typography>
          </Stack>

          {/* Question Header */}
          <QuestionHeader
            questionNumber={questionNumber}
            studentName={studentName}
            testedCount={testedCount}
          />

          {/* Scoring Unavailable Notice */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography>Scoring is currently unavailable and will be processed after submission.</Typography>
          </Alert>

          {/* Text Display */}
          <Paper sx={{ p: isMobile ? 2 : 3, mb: 3, bgcolor: 'grey.50' }}>
            <Typography variant="body1" lineHeight={1.8} fontWeight="medium">
              {selectedQuestion.text}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" mt={2}>
              <Chip
                label={selectedQuestion.difficulty}
                size="small"
                color={
                  selectedQuestion.difficulty === 'Beginner' ? 'success' :
                  selectedQuestion.difficulty === 'Intermediate' ? 'warning' : 'error'
                }
              />
              <Chip
                label={selectedQuestion.category}
                size="small"
                variant="outlined"
              />
            </Stack>
          </Paper>

          {/* Preparation Timer */}
          {preparationTime !== null && preparationTime > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ mb: 1, color: '#ff9800' }}>
                Preparation Time: {preparationTime} seconds
              </Typography>
              <LinearProgress variant="determinate" value={(preparationTime / selectedQuestion.preparationTime) * 100} />
            </Box>
          )}

          {/* Recording Section */}
          <RecordingSection
            isRecording={audioRecording.isRecording}
            recordedBlob={audioRecording.recordedBlob}
            recordedAudioUrl={audioRecording.recordedAudioUrl}
            micPermission={audioRecording.micPermission}
            showRecordingPrompt={showRecordingPrompt}
            preparationTime={preparationTime}
            recordingType="Read Aloud"
            recordingTime={selectedQuestion.recordingTime}
            onToggleRecording={audioRecording.toggleRecording}
          />

          {/* Action Buttons */}
          <ActionButtons
            hasResponse={false} // Placeholder; adjust based on requirements
            recordedBlob={audioRecording.recordedBlob}
            onSubmit={handleSubmit}
            onRedo={handleRedo}
            onTranslate={handleTranslate}
            onShowAnswer={handleShowAnswer}
          />

          {/* Navigation Section */}
          <NavigationSection
            onSearch={() => setShowTopicSelector(true)}
            onPrevious={handlePrevious}
            onNext={handleNext}
            questionNumber={questionNumber}
          />

          {/* View Attempts Button */}
          <Button
            variant="outlined"
            color="primary"
            onClick={handleViewAttempts}
            aria-label="View past attempts"
            sx={{ mt: 2, minWidth: isMobile ? '100%' : 'auto', py: isMobile ? 1.5 : 1 }}
          >
            View Attempts
          </Button>
        </CardContent>
      </Card>

      {/* Topic Selection Drawer */}
      <TopicSelectionDrawer
        open={showTopicSelector}
        onClose={() => setShowTopicSelector(false)}
        onSelect={handleTopicSelect}
        topics={readAloudQuestions.map(q => ({
          ...q,
          title: q.text.substring(0, 50) + '...',
          duration: `${q.preparationTime + q.recordingTime}s`,
          speaker: 'Narrator',
        }))}
        title="Select Read Aloud Question"
        type="question"
      />

      {/* Answer Dialog */}
      <Dialog open={showAnswer} onClose={() => setShowAnswer(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Sample Answer</Typography>
            <IconButton onClick={() => setShowAnswer(false)}><Close /></IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Text:</strong> {selectedQuestion.text}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Guidance:</strong> {selectedQuestion.expectedAnswer}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAnswer(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Translate Dialog */}
      <Dialog open={showTranslate} onClose={() => setShowTranslate(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Translation Options</Typography>
            <IconButton onClick={() => setShowTranslate(false)}><Close /></IconButton>
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
            Translate the text into your preferred language.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTranslate(false)}>Cancel</Button>
          <Button variant="contained">Translate</Button>
        </DialogActions>
      </Dialog>

      {/* Past Attempts Dialog */}
      <Dialog open={showAttempts} onClose={() => setShowAttempts(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Past Attempts</Typography>
            <IconButton onClick={() => setShowAttempts(false)}><Close /></IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {attempts.length === 0 ? (
            <Typography variant="body2">No attempts recorded yet.</Typography>
          ) : (
            <List>
              {attempts.map((attempt, index) => {
                const question = readAloudQuestions.find(q => q.id === attempt.questionId);
                return (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Text: ${question?.text.substring(0, 50) || 'Unknown'}...`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            Time: {new Date(attempt.timestamp).toLocaleString()}
                          </Typography>
                          {attempt.recordedAudioUrl && (
                            <audio controls src={attempt.recordedAudioUrl} style={{ width: '100%' }}>
                              Your browser does not support the audio element.
                            </audio>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => { setAttempts([]); localStorage.removeItem('readAloudAttempts'); }}>
            Clear Attempts
          </Button>
          <Button onClick={() => setShowAttempts(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};


export default ReadAloud;