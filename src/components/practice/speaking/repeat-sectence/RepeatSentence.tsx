import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Divider,
  LinearProgress,
  Chip,
  useTheme,
  useMediaQuery,
  Alert,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import {
  RECORDING_DURATION_MS,
  AUDIO_DURATION_MS,
} from './constants';
import TopicSelectionDrawer from '../../../common/TopicSelectionDrawer';
import ActionButtons from '../../common/ActionButtons';
import InstructionsCard from '../../common/InstructionsCard';
import NavigationSection from '../../common/NavigationSection';
import QuestionHeader from '../../common/QuestionHeader';
import RecordingSection from '../../common/RecordingSection';
import StageGoalBanner from '../../common/StageGoalBanner';
import { User } from '../../../../types/user';
import { REPEAT_SENTENCE_QUESTIONS, MOCK_FEEDBACK, instructionsSections } from './RepeatSentenceMockData';
import { RepeatSentenceQuestion } from './RepeatSentenceTypes';
import TextToSpeech from '../../common/TextToSpeech';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import TimerIcon from '@mui/icons-material/Timer';

interface PracticeTestsProps {
  user: User | null;
}

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: (theme.shape.borderRadius as number) * 2,
  boxShadow: theme.shadows[3],
}));

const useAudioRecording = (recordingTime = RECORDING_DURATION_MS) => {
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

export const RepeatSentence: React.FC<PracticeTestsProps> = ({ user }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [studentName] = useState('Jane Doe');
  const [testedCount] = useState(25);
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const audioRecording = useAudioRecording();
  const [audioError, setAudioError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (isStarted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isStarted]);

  const handleGetAIFeedback = () => {
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < REPEAT_SENTENCE_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      audioRecording.resetRecording();
      setShowFeedback(false);
      setTimeLeft(600);
      setIsStarted(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      audioRecording.resetRecording();
      setShowFeedback(false);
      setTimeLeft(600);
      setIsStarted(false);
    }
  };

  const handleTopicSelect = (topic: any) => {
    const index = REPEAT_SENTENCE_QUESTIONS.findIndex((q) => q.id === topic.id);
    if (index !== -1) {
      setCurrentQuestionIndex(index);
      audioRecording.resetRecording();
      setShowFeedback(false);
      setTimeLeft(600);
      setIsStarted(false);
      setShowTopicSelector(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const questionTopics = REPEAT_SENTENCE_QUESTIONS.map((q) => ({
    id: q.id,
    title: q.audio.substring(0, 50) + (q.audio.length > 50 ? '...' : ''),
    duration: '15s',
    speaker: 'Narrator',
    difficulty: q.difficulty,
    category: q.category,
    tags: q.tags,
    isNew: q.isNew,
    isMarked: q.isMarked,
    pracStatus: q.pracStatus,
    hasExplanation: q.hasExplanation,
  }));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Stage Goal Banner */}
      <StageGoalBanner />

      {/* Progress Display */}
      <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
        Progress: {currentQuestionIndex + 1}/{REPEAT_SENTENCE_QUESTIONS.length} questions attempted
      </Typography>

      {/* Header */}
      <Box mb={4}>
        <Stack
          direction={isMobile ? 'column' : 'row'}
          spacing={2}
          alignItems={isMobile ? 'flex-start' : 'center'}
          mb={2}
        >
          <Button
            component={RouterLink}
            to="/practice-tests"
            color="primary"
            startIcon={<span style={{ marginRight: '8px' }}>←</span>}
            size={isMobile ? 'small' : 'medium'}
          >
            Back to Practice
          </Button>
          <Divider orientation={isMobile ? 'horizontal' : 'vertical'} flexItem sx={{ my: { xs: 1, sm: 0 } }} />
          <Typography variant={isMobile ? 'h6' : 'h4'} fontWeight="bold">
            Speaking: Repeat Sentence
          </Typography>
          <Chip label="AI Score Available" color="success" size={isMobile ? 'small' : 'medium'} />
        </Stack>
        <Typography color="text.secondary" variant={isMobile ? 'caption' : 'body2'}>
          Listen to the sentence and repeat it as accurately as possible.
        </Typography>
      </Box>

      {/* Progress and Timer */}
      <Box mb={4}>
        <Stack
          direction={isMobile ? 'column' : 'row'}
          justifyContent="space-between"
          alignItems={isMobile ? 'flex-start' : 'center'}
          spacing={isMobile ? 1 : 2}
          mb={2}
        >
          <Typography variant="caption" color="text.secondary">
            Question {currentQuestionIndex + 1} of {REPEAT_SENTENCE_QUESTIONS.length}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Chip label="Speaking • Repeat Sentence" size={isMobile ? 'small' : 'medium'} />
            <Stack direction="row" alignItems="center" spacing={1}>
              <TimerIcon color={timeLeft < 120 ? 'error' : 'primary'} />
              <Typography color={timeLeft < 120 ? 'error.main' : 'primary.main'} variant={isMobile ? 'caption' : 'body2'}>
                {formatTime(timeLeft)}
              </Typography>
            </Stack>
            {!isStarted && (
              <Button
                variant="contained"
                size={isMobile ? 'small' : 'medium'}
                onClick={() => setIsStarted(true)}
                sx={{ width: isMobile ? '100%' : 'auto' }}
              >
                Start Timer
              </Button>
            )}
          </Stack>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={((currentQuestionIndex + 1) / REPEAT_SENTENCE_QUESTIONS.length) * 100}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: { xs: 4, sm: 4 } }}>
        {/* Question Panel */}
        <Box sx={{ width: { xs: '100%', lg: '63%' } }}>
          <StyledCard>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              {/* Question Header */}
              <QuestionHeader questionNumber={currentQuestionIndex + 1} studentName={studentName} testedCount={testedCount} />

              {/* Audio Error Alert */}
              {audioError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  <Typography>{audioError}</Typography>
                </Alert>
              )}

              {/* Scoring Notice */}
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography>AI scoring is available after recording submission.</Typography>
              </Alert>

              {/* Text-to-Speech and Question */}
              <Paper elevation={1} sx={{ p: isMobile ? 2 : 3, mb: 3, bgcolor: 'grey.50' }}>
                <Stack spacing={2}>
                  <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 'bold', color: '#333' }}>
                    Question
                  </Typography>
                  <TextToSpeech
                    text={REPEAT_SENTENCE_QUESTIONS[currentQuestionIndex].audio}
                    autoPlay={false}
                    onStart={() => console.log('Question audio started')}
                    onEnd={() => console.log('Question audio ended, ready to record')}
                    onError={(error) => {
                      setAudioError(error);
                      console.error('TextToSpeech error:', error);
                    }}
                  />
                  <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                    Transcript: {REPEAT_SENTENCE_QUESTIONS[currentQuestionIndex].audio}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip
                      label={REPEAT_SENTENCE_QUESTIONS[currentQuestionIndex].difficulty}
                      size="small"
                      color={
                        REPEAT_SENTENCE_QUESTIONS[currentQuestionIndex].difficulty === 'Beginner'
                          ? 'success'
                          : REPEAT_SENTENCE_QUESTIONS[currentQuestionIndex].difficulty === 'Intermediate'
                            ? 'warning'
                            : 'error'
                      }
                    />
                    <Chip
                      label={REPEAT_SENTENCE_QUESTIONS[currentQuestionIndex].category}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </Stack>
              </Paper>

              {/* Recording Section */}
              <RecordingSection
                isRecording={audioRecording.isRecording}
                recordedBlob={audioRecording.recordedBlob}
                recordedAudioUrl={audioRecording.recordedAudioUrl}
                micPermission={audioRecording.micPermission}
                showRecordingPrompt={false}
                preparationTime={null}
                recordingType="Repeat Sentence"
                recordingTime={15}
                onToggleRecording={audioRecording.toggleRecording}
              />

              {/* Feedback Section */}
              {audioRecording.recordedBlob && showFeedback && (
                <Stack spacing={4} mt={3}>
                  {/* Score */}
                  <Paper elevation={2} sx={{ p: 4, textAlign: 'center', bgcolor: 'primary.light' }}>
                    <Typography variant="h3" color="primary" fontWeight="bold">
                      {MOCK_FEEDBACK[REPEAT_SENTENCE_QUESTIONS[currentQuestionIndex].id].overallScore}
                    </Typography>
                    <Typography color="text.secondary">
                      Overall Score
                    </Typography>
                  </Paper>

                  {/* Feedback Details */}
                  <Box>
                    <Typography variant="h6" fontWeight="medium" mb={2}>
                      AI Feedback
                    </Typography>
                    <Stack spacing={2}>
                      <Paper sx={{ p: 2, bgcolor: 'success.light' }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          Pronunciation: {MOCK_FEEDBACK[REPEAT_SENTENCE_QUESTIONS[currentQuestionIndex].id].pronunciation}
                        </Typography>
                      </Paper>
                      <Paper sx={{ p: 2, bgcolor: 'warning.light' }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          Fluency: {MOCK_FEEDBACK[REPEAT_SENTENCE_QUESTIONS[currentQuestionIndex].id].fluency}
                        </Typography>
                      </Paper>
                      <Paper sx={{ p: 2, bgcolor: 'secondary.light' }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          Content: {MOCK_FEEDBACK[REPEAT_SENTENCE_QUESTIONS[currentQuestionIndex].id].content}
                        </Typography>
                      </Paper>
                      <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                          Word Accuracy
                        </Typography>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography variant="h5" color="success.main" fontWeight="bold">
                            {MOCK_FEEDBACK[REPEAT_SENTENCE_QUESTIONS[currentQuestionIndex].id].wordsRepeated}/
                            {MOCK_FEEDBACK[REPEAT_SENTENCE_QUESTIONS[currentQuestionIndex].id].totalWords}
                          </Typography>
                          <Box flex={1} bgcolor="grey.200" borderRadius="4px" height={8}>
                            <Box
                              bgcolor="success.main"
                              height={8}
                              borderRadius="4px"
                              width={`${(MOCK_FEEDBACK[REPEAT_SENTENCE_QUESTIONS[currentQuestionIndex].id].wordsRepeated /
                                MOCK_FEEDBACK[REPEAT_SENTENCE_QUESTIONS[currentQuestionIndex].id].totalWords) * 100}%`}
                            />
                          </Box>
                        </Box>
                      </Paper>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="medium" mb={1}>
                          ✅ Strengths:
                        </Typography>
                        {MOCK_FEEDBACK[REPEAT_SENTENCE_QUESTIONS[currentQuestionIndex].id].feedback.map((item, index) => (
                          <Box key={index} display="flex" alignItems="flex-start" gap={1}>
                            <Typography color="success.main">•</Typography>
                            <Typography variant="body2">{item}</Typography>
                          </Box>
                        ))}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="medium" mb={1}>
                          💡 Areas for Improvement:
                        </Typography>
                        {MOCK_FEEDBACK[REPEAT_SENTENCE_QUESTIONS[currentQuestionIndex].id].improvements.map((item, index) => (
                          <Box key={index} display="flex" alignItems="flex-start" gap={1}>
                            <Typography color="warning.main">•</Typography>
                            <Typography variant="body2">{item}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Stack>
                  </Box>

                  {/* Next Question */}
                  <Box textAlign="center">
                    {currentQuestionIndex < REPEAT_SENTENCE_QUESTIONS.length - 1 ? (
                      <Button
                        variant="contained"
                        size={isMobile ? 'medium' : 'large'}
                        onClick={handleNextQuestion}
                        endIcon={<span style={{ marginLeft: '8px' }}>→</span>}
                      >
                        Next Question
                      </Button>
                    ) : (
                      <Stack direction={isMobile ? 'column' : 'row'} spacing={2} justifyContent="center">
                        <Button
                          component={RouterLink}
                          to="/practice-tests"
                          variant="contained"
                          color="secondary"
                          size={isMobile ? 'medium' : 'large'}
                          fullWidth={isMobile}
                        >
                          Back to Practice
                        </Button>
                        <Button
                          component={RouterLink}
                          to="/progress"
                          variant="contained"
                          color="success"
                          size={isMobile ? 'medium' : 'large'}
                          fullWidth={isMobile}
                        >
                          View Progress
                        </Button>
                      </Stack>
                    )}
                  </Box>
                </Stack>
              )}

              {/* Action Buttons */}
              {!showFeedback && (
                <Box mt={2}>
                  <ActionButtons
                    hasResponse={audioRecording.recordedBlob !== null}
                    recordedBlob={audioRecording.recordedBlob}
                    onSubmit={handleGetAIFeedback}
                    onRedo={audioRecording.resetRecording}
                    onTranslate={() => console.log('Translate clicked')}
                    onShowAnswer={() => console.log('Show Answer clicked')}
                  />
                </Box>
              )}
            </CardContent>
          </StyledCard>

          {/* Navigation Card */}
          <StyledCard sx={{ mb: 4, mt: 2 }}>
            <CardContent>
              <NavigationSection
                onSearch={() => setShowTopicSelector(true)}
                onPrevious={handlePrevious}
                onNext={handleNextQuestion}
                questionNumber={currentQuestionIndex + 1}
              />
            </CardContent>
          </StyledCard>
        </Box>

        {/* Instructions Panel */}
        <Box sx={{ width: { xs: '100%', lg: '33.333%' }, pl: { lg: 2 } }}>
          <InstructionsCard title="Instructions" sections={instructionsSections} />
        </Box>
      </Box>

      {/* Topic Selection Drawer */}
      <TopicSelectionDrawer
        open={showTopicSelector}
        onClose={() => setShowTopicSelector(false)}
        onSelect={handleTopicSelect}
        topics={questionTopics}
        title="Select Repeat Sentence Question"
        type="question"
      />
    </Container>
  );
};

export default RepeatSentence;