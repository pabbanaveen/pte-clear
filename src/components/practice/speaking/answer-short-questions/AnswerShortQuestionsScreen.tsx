import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Alert,
  Card,
  CardContent,
  Chip,
  Stack,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  LinearProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Mic, Send, ArrowForward, Help, MicOff, Refresh, Translate, Close, Topic } from '@mui/icons-material';
import { User } from '../../../../types/user';
import ActionButtons from '../../common/ActionButtons';
import NavigationSection from '../../common/NavigationSection';
import QuestionHeader from '../../common/QuestionHeader';
import RecordingSection from '../../common/RecordingSection';
import StageGoalBanner from '../../common/StageGoalBanner';
import TextToSpeech from '../../common/TextToSpeech';
import { QuestionTopic, UserAttempt } from './AnswerShortQuestionsTypes';
import { questionTopics } from './questionTopics';
import TopicSelectionDrawer from '../../../common/TopicSelectionDrawer';


// // Hook for speech recognition
// const useSpeechRecognition = (recordedBlob: Blob | null) => {
//   const [transcription, setTranscription] = useState<string | null>(null);
//   const [recognitionError, setRecognitionError] = useState<string | null>(null);

//   useEffect(() => {
//     if (recordedBlob) {
//       const recognition = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)();
//       recognition.lang = 'en-US';
//       recognition.interimResults = false;
//       recognition.maxAlternatives = 1;

//       recognition.onresult = (event:any) => {
//         const transcript = event.results[0][0].transcript;
//         setTranscription(transcript);
//         console.log('Transcription:', transcript);
//       };

//       recognition.onerror = (event:any) => {
//         setRecognitionError('Speech recognition failed: ' + event.error);
//         console.error('Speech recognition error:', event.error);
//       };

//       recognition.start();
//       return () => recognition.stop();
//     }
//   }, [recordedBlob]);

//   return { transcription, recognitionError };
// };

// // Scoring function
// const calculateScore = (transcription: string | null, expectedAnswer: string): number => {
//   if (!transcription || !expectedAnswer) return 0;
//   const transcriptionWords = transcription.toLowerCase().split(/\s+/);
//   const expectedWords = expectedAnswer.toLowerCase().split(/\s+/);
//   const matchedWords = transcriptionWords.filter(word => expectedWords.includes(word));
//   const score = Math.round((matchedWords.length / expectedWords.length) * 100);
//   return Math.min(score, 100);
// };

interface PracticeTestsProps {
  user: User | null;
}

const useAudioRecording = (preparationTime: number | null, recordingTime = 10000) => {
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
        console.error('Initial microphone permission check failed:', error);
        setMicPermission(false);
      }
    };
    checkMicPermission();
  }, []);

  const toggleRecording = async () => {
    if (micPermission === false) {
      alert('Microphone permission is required to record. Please grant permission and try again.');
      return;
    }

    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicPermission(true);
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          setRecordedBlob(blob);
          const url = URL.createObjectURL(blob);
          setRecordedAudioUrl(url);
          stream.getTracks().forEach((track) => track.stop());
          console.log('Recording stopped, blob created:', blob);
        };

        mediaRecorder.start();
        setIsRecording(true);
        console.log('Recording started');

        timerRef.current = setTimeout(() => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            console.log(`Recording auto-stopped after ${recordingTime / 1000} seconds`);
          }
        }, recordingTime);
      } catch (error) {
        console.error('Microphone access denied:', error);
        setMicPermission(false);
        alert('Unable to access the microphone. Please ensure you have granted permission.');
      }
    } else if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      console.log('Recording manually stopped');
    }
  };

  const resetRecording = () => {
    setRecordedBlob(null);
    setRecordedAudioUrl(null);
    setIsRecording(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
    };
  }, [recordedAudioUrl]);

  return {
    isRecording,
    recordedBlob,
    recordedAudioUrl,
    micPermission,
    toggleRecording,
    resetRecording
  };
};

export const AnswerShortQuestionsScreen: React.FC<PracticeTestsProps> = ({ user }) => {
  const [selectedTopic, setSelectedTopic] = useState<QuestionTopic>(questionTopics[0]);
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(655);
  const [studentName] = useState('Rachel Carson');
  const [testedCount] = useState(33);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAttempts, setShowAttempts] = useState(false);
  const [preparationTime, setPreparationTime] = useState<number | null>(null);
  const [showRecordingPrompt, setShowRecordingPrompt] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [attempts, setAttempts] = useState<UserAttempt[]>([]);

  const audioRecording = useAudioRecording(preparationTime, selectedTopic.recordingTime * 1000);
  const prepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const completedQuestions = attempts.length;

  // Load attempts from localStorage on mount
  useEffect(() => {
    const savedAttempts = localStorage.getItem('userAttempts');
    if (savedAttempts) {
      try {
        setAttempts(JSON.parse(savedAttempts));
      } catch (error) {
        console.error('Failed to parse userAttempts from localStorage:', error);
        localStorage.removeItem('userAttempts');
      }
    }
  }, []);

  // Save attempt to localStorage when recording is available
  useEffect(() => {
    if (audioRecording.recordedBlob && audioRecording.recordedAudioUrl) {
      const attempt: UserAttempt = {
        questionId: selectedTopic.id,
        recordedAudioUrl: audioRecording.recordedAudioUrl,
        timestamp: new Date().toISOString(),
      };
      setAttempts((prev) => {
        const newAttempts = [...prev, attempt];
        try {
          localStorage.setItem('userAttempts', JSON.stringify(newAttempts));
        } catch (error) {
          console.error('Failed to save userAttempts to localStorage:', error);
        }
        return newAttempts;
      });
    }
  }, [audioRecording.recordedBlob, audioRecording.recordedAudioUrl, selectedTopic.id]);

  // Handle topic selection
  const handleTopicSelect = (topic: any) => {
    setSelectedTopic(topic);
    setPreparationTime(null);
    setShowRecordingPrompt(false);
    audioRecording.resetRecording();
    setAudioError(null);
    setQuestionNumber(questionTopics.findIndex(t => t.id === topic.id) + 655);
  };

  // Handle submit
  const handleSubmit = () => {
    console.log('handleSubmit called');
    if (audioRecording.recordedBlob) {
      alert('Recording submitted successfully! Score will be available after processing.');
      setQuestionNumber((prev) => prev + 1);
      audioRecording.resetRecording();
      setPreparationTime(null);
      setShowRecordingPrompt(false);
    } else {
      alert('Please record your answer before submitting.');
    }
  };

  // Action handlers
  const handleShowAnswer = () => {
    console.log('handleShowAnswer called');
    setShowAnswer(true);
  };
  const handleTranslate = () => {
    console.log('handleTranslate called');
    setShowTranslate(true);
  };
  const handleSearch = () => {
    console.log('handleSearch called');
    setShowTopicSelector(true)
  };
  const handleViewAttempts = () => {
    console.log('handleViewAttempts called');
    setShowAttempts(true);
  };

  const handlePrevious = () => {
    console.log('handlePrevious called');
    const currentIndex = questionTopics.findIndex(t => t.id === selectedTopic.id);
    if (currentIndex > 0) {
      handleTopicSelect(questionTopics[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    console.log('handleNext called');
    const currentIndex = questionTopics.findIndex(t => t.id === selectedTopic.id);
    if (currentIndex < questionTopics.length - 1) {
      handleTopicSelect(questionTopics[currentIndex + 1]);
    } else {
      setShowTopicSelector(true);
    }
  };

  const handleRedo = () => {
    console.log('handleRedo called');
    audioRecording.resetRecording();
    setPreparationTime(null);
    setShowRecordingPrompt(false);
    if (prepTimerRef.current) {
      clearTimeout(prepTimerRef.current);
    }
    console.log('Re-do triggered, state reset');
  };

  // Preparation timer
  useEffect(() => {
    if (preparationTime !== null && preparationTime > 0) {
      prepTimerRef.current = setTimeout(() => {
        setPreparationTime((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (preparationTime === 0) {
      setShowRecordingPrompt(true);
      setPreparationTime(null);
      console.log('Preparation time ended, showing recording prompt');
    }
    return () => {
      if (prepTimerRef.current) {
        clearTimeout(prepTimerRef.current);
      }
    };
  }, [preparationTime]);

  // Filter topics for search
  const filteredTopics = questionTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.speaker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', p: isMobile ? 1 : 2 }}>
      {/* Stage Goal Banner */}
      <StageGoalBanner />

      {/* Progress Display */}
      <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
        Progress: {completedQuestions}/{questionTopics.length} questions attempted
      </Typography>

      {/* Main Content */}
      <Card sx={{ maxWidth: isMobile ? '100%' : 1200, mx: 'auto', mb: 3 }}>
        <CardContent sx={{ p: isMobile ? 2 : 4 }}>
          {/* Header */}
          <Stack
            direction={isMobile ? 'column' : 'row'}
            alignItems={isMobile ? 'flex-start' : 'center'}
            spacing={2}
            sx={{ mb: 3 }}
          >
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
              ASQ
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 'bold', color: '#333' }}>
                  Answer Short Questions
                </Typography>
                <Chip onClick={() => {}} label="Study Guide" color="primary" size="small" />
              </Stack>
              <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                You will hear a short question. After listening to the question, in {selectedTopic.preparationTime} seconds, please speak into the microphone and provide a concise answer in your own words. You will have {selectedTopic.recordingTime} seconds to give your response.
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

          {/* Audio Error Alert */}
          {audioError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography>{audioError}</Typography>
            </Alert>
          )}

          {/* Scoring Unavailable Notice */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography>Scoring is currently unavailable and will be processed after submission.</Typography>
          </Alert>

          {/* Text-to-Speech Player */}
          <Paper sx={{ p: isMobile ? 2 : 3, mb: 3, bgcolor: '#fafafa' }}>
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                Question: {selectedTopic.title}
              </Typography>
              <TextToSpeech
                text={selectedTopic.audioText}
                autoPlay={false}
                onStart={() => console.log('Question audio started')}
                onEnd={() => {
                  setPreparationTime(selectedTopic.preparationTime);
                  console.log(`Question audio ended, starting ${selectedTopic.preparationTime}-second preparation timer`);
                }}
                onError={(error) => {
                  setAudioError(error);
                  console.error('TextToSpeech error:', error);
                }}
              />
              <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                Transcript: {selectedTopic.audioText}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  label={selectedTopic.difficulty}
                  size="small"
                  color={
                    selectedTopic.difficulty === 'Beginner' ? 'success' :
                    selectedTopic.difficulty === 'Intermediate' ? 'warning' : 'error'
                  }
                />
                <Chip
                  label={selectedTopic.category}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={`Speaker: ${selectedTopic.speaker}`}
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </Stack>
          </Paper>

          {/* Preparation Timer */}
          {preparationTime !== null && preparationTime > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography>Preparation Time: {preparationTime} seconds</Typography>
              <LinearProgress
                variant="determinate"
                value={(preparationTime / selectedTopic.preparationTime) * 100}
                sx={{ mt: 1 }}
              />
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
            recordingType="answer"
            recordingTime={selectedTopic.recordingTime}
            onToggleRecording={audioRecording.toggleRecording}
          />

          {/* Action Buttons */}
          <Stack
            direction={isMobile ? 'column' : 'row'}
            spacing={isMobile ? 1 : 2}
            sx={{ mt: 2, flexWrap: 'wrap' }}
          >
            <ActionButtons
              recordedBlob={audioRecording.recordedBlob}
              onSubmit={handleSubmit}
              onRedo={handleRedo}
              onTranslate={handleTranslate}
              onShowAnswer={handleShowAnswer}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={handleViewAttempts}
              aria-label="View past attempts"
              sx={{ minWidth: isMobile ? '100%' : 'auto', py: isMobile ? 1.5 : 1 }}
            >
              View Attempts
            </Button>
          </Stack>

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
        open={showTopicSelector}
        onClose={() => setShowTopicSelector(false)}
        onSelect={handleTopicSelect}
        topics={questionTopics}
        title="Select Question Topic"
        type="question"
      />

      {/* Answer Dialog */}
      <Dialog open={showAnswer} onClose={() => setShowAnswer(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Sample Answer</Typography>
            <IconButton onClick={() => setShowAnswer(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Question:</strong> {selectedTopic.title}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Expected Answer:</strong> {selectedTopic.expectedAnswer}
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
            This is a sample answer for the selected question topic. In a real implementation, 
            this would contain key points or additional guidance for a complete and accurate answer.
          </Typography>
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
      {/* <Dialog open={showSearch} onClose={() => setShowSearch(false)} maxWidth="sm" fullWidth>
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
            placeholder="Search by question or speaker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
          />
          <List>
            {filteredTopics.map((topic) => (
              <ListItem key={topic.id} disablePadding>
                <ListItemButton 
                  onClick={() => {
                    handleTopicSelect(topic);
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                >
                  <ListItemText
                    primary={topic.title}
                    secondary={`${topic.speaker} • ${topic.difficulty}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSearch(false)}>Close</Button>
        </DialogActions>
      </Dialog> */}

      {/* Past Attempts Dialog */}
      <Dialog open={showAttempts} onClose={() => setShowAttempts(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Past Attempts</Typography>
            <IconButton onClick={() => setShowAttempts(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {attempts.length === 0 ? (
            <Typography variant="body2">No attempts recorded yet.</Typography>
          ) : (
            <List>
              {attempts.map((attempt, index) => {
                const question = questionTopics.find(q => q.id === attempt.questionId);
                return (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Question: ${question?.title || 'Unknown'}`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            Time: {new Date(attempt.timestamp).toLocaleString()}
                          </Typography>
                          {attempt.recordedAudioUrl && (
                            <audio controls src={attempt.recordedAudioUrl} style={{ width: '100%', marginTop: '8px' }}>
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
          <Button
            color="error"
            onClick={() => {
              setAttempts([]);
              localStorage.removeItem('userAttempts');
            }}
          >
            Clear Attempts
          </Button>
          <Button onClick={() => setShowAttempts(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnswerShortQuestionsScreen;