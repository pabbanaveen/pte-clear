import React, { useEffect, useRef, useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, Typography, IconButton, Stack, CardContent } from '@mui/material';
import { Close } from '@mui/icons-material';
import {
  PracticeCard,
  TimerDisplay,
  ContentDisplay,
  ProgressIndicator,
  AnswerDialog,
  TranslationDialog,
  GradientBackground,
  StyledCard
} from '../../../common';
import ActionButtons from '../../common/ActionButtons';
import NavigationSection from '../../common/NavigationSection';
import QuestionHeader from '../../common/QuestionHeader';
import RecordingSection from '../../common/RecordingSection';
import StageGoalBanner from '../../common/StageGoalBanner';
import TextToSpeech from '../../common/TextToSpeech';
import InstructionsCard from '../../common/InstructionsCard';
import TopicSelectionDrawer from '../../../common/TopicSelectionDrawer';
import { User } from '../../../../types/user';
import { REPEAT_SENTENCE_QUESTIONS, MOCK_FEEDBACK, instructionsSections } from './RepeatSentenceMockData';
import { RepeatSentenceQuestion } from './RepeatSentenceTypes';

const RECORDING_DURATION_MS = 15000;

interface PracticeTestsProps {
  user: User | null;
}

interface UserAttempt {
  questionId: number;
  recordedAudioUrl?: string;
  timestamp: string;
}

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
        };

        mediaRecorder.start();
        setIsRecording(true);

        timerRef.current = setTimeout(() => {
          if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
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
  const [showAnswer, setShowAnswer] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const [showAttempts, setShowAttempts] = useState(false);
  const [attempts, setAttempts] = useState<UserAttempt[]>([]);

  const audioRecording = useAudioRecording();
  const [audioError, setAudioError] = useState<string | null>(null);
  
  // Timer state for overall practice session
  const [timer, setTimer] = useState({
    timeRemaining: 600, // 10 minutes
    isRunning: false,
    warningThreshold: 120, // 2 minutes warning
    autoSubmit: false,
  });

  const currentQuestion = REPEAT_SENTENCE_QUESTIONS[currentQuestionIndex];

  // Load attempts from localStorage
  useEffect(() => {
    const savedAttempts = localStorage.getItem('repeatSentenceAttempts');
    if (savedAttempts) {
      try {
        setAttempts(JSON.parse(savedAttempts));
      } catch (error) {
        console.error('Failed to parse repeatSentenceAttempts:', error);
        localStorage.removeItem('repeatSentenceAttempts');
      }
    }
  }, []);

  // Save attempt to localStorage when recording is available
  useEffect(() => {
    if (audioRecording.recordedBlob && audioRecording.recordedAudioUrl) {
      const attempt: UserAttempt = {
        questionId: currentQuestion.id,
        recordedAudioUrl: audioRecording.recordedAudioUrl,
        timestamp: new Date().toISOString(),
      };
      setAttempts((prev) => {
        const newAttempts = [...prev, attempt];
        try {
          localStorage.setItem('repeatSentenceAttempts', JSON.stringify(newAttempts));
        } catch (error) {
          console.error('Failed to save repeatSentenceAttempts:', error);
        }
        return newAttempts;
      });
    }
  }, [audioRecording.recordedBlob, audioRecording.recordedAudioUrl, currentQuestion.id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer.isRunning && timer.timeRemaining > 0) {
      interval = setInterval(() => {
        setTimer(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
      }, 1000);
    } else if (timer.timeRemaining === 0) {
      setTimer(prev => ({ ...prev, isRunning: false }));
    }
    return () => clearInterval(interval);
  }, [timer.isRunning, timer.timeRemaining]);

  const handleGetAIFeedback = () => {
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < REPEAT_SENTENCE_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      audioRecording.resetRecording();
      setShowFeedback(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      audioRecording.resetRecording();
      setShowFeedback(false);
    }
  };

  const handleNext = () => {
    handleNextQuestion();
  };

  const handleSearch = () => {
    setShowTopicSelector(true);
  };

  const handleTopicSelect = (topic: any) => {
    const index = REPEAT_SENTENCE_QUESTIONS.findIndex((q) => q.id === topic.id);
    if (index !== -1) {
      setCurrentQuestionIndex(index);
      audioRecording.resetRecording();
      setShowFeedback(false);
      setShowTopicSelector(false);
    }
  };

  const handleStartTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: true }));
  };

  const handleViewAttempts = () => {
    setShowAttempts(true);
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
    createdAt: q.createdAt,
    updatedAt: q.updatedAt
  }));

  // Feedback display component
  const FeedbackDisplay = () => {
    if (!showFeedback || !audioRecording.recordedBlob) return null;

    const feedback = MOCK_FEEDBACK[currentQuestion.id];
    if (!feedback) return null;

    return (
      <ContentDisplay
        title="AI Feedback Results"
        content={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ textAlign: 'center', p: 4, bgcolor: 'primary.light', borderRadius: 2 }}>
              <Box sx={{ fontSize: '48px', fontWeight: 'bold', color: 'primary.main' }}>
                {feedback.overallScore}
              </Box>
              <Box sx={{ color: 'text.secondary' }}>Overall Score</Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
              <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1, textAlign: 'center' }}>
                <Box sx={{ fontWeight: 'medium' }}>Pronunciation</Box>
                <Box sx={{ fontSize: '24px', fontWeight: 'bold' }}>{feedback.pronunciation}</Box>
              </Box>
              <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1, textAlign: 'center' }}>
                <Box sx={{ fontWeight: 'medium' }}>Fluency</Box>
                <Box sx={{ fontSize: '24px', fontWeight: 'bold' }}>{feedback.fluency}</Box>
              </Box>
              <Box sx={{ p: 2, bgcolor: 'secondary.light', borderRadius: 1, textAlign: 'center' }}>
                <Box sx={{ fontWeight: 'medium' }}>Content</Box>
                <Box sx={{ fontSize: '24px', fontWeight: 'bold' }}>{feedback.content}</Box>
              </Box>
            </Box>

            <Box>
              <Box sx={{ fontWeight: 'medium', mb: 1, color: 'success.main' }}>✅ Strengths:</Box>
              {feedback.feedback.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
                  <Box sx={{ color: 'success.main' }}>•</Box>
                  <Box sx={{ fontSize: '14px' }}>{item}</Box>
                </Box>
              ))}
            </Box>

            <Box>
              <Box sx={{ fontWeight: 'medium', mb: 1, color: 'warning.main' }}>💡 Areas for Improvement:</Box>
              {feedback.improvements.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
                  <Box sx={{ color: 'warning.main' }}>•</Box>
                  <Box sx={{ fontSize: '14px' }}>{item}</Box>
                </Box>
              ))}
            </Box>

            {currentQuestionIndex < REPEAT_SENTENCE_QUESTIONS.length - 1 && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <button
                  onClick={handleNextQuestion}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  Next Question →
                </button>
              </Box>
            )}
          </Box>
        }
        showMetadata={false}
      />
    );
  };

  return (
    <GradientBackground>
      <StageGoalBanner />
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
        {/* Main Content */}
        <Box sx={{ width: { xs: '100%', lg: '70%' } }}>
          <PracticeCard
            icon="RS"
            title="Speaking: Repeat Sentence"
            subtitle={`Progress: ${currentQuestionIndex + 1}/${REPEAT_SENTENCE_QUESTIONS.length} questions attempted`}
            instructions="Listen to the sentence and repeat it as accurately as possible."
            difficulty={currentQuestion.difficulty}
          >
            <QuestionHeader
              questionNumber={currentQuestionIndex + 1}
              studentName={studentName}
              testedCount={testedCount}
            />

            <TimerDisplay
              timeRemaining={timer.timeRemaining}
              isRunning={timer.isRunning}
              warningThreshold={timer.warningThreshold}
              autoSubmit={timer.autoSubmit}
              showStartMessage={!timer.isRunning}
              startMessage="Click Start Timer to begin practice session"
            />

            {!timer.isRunning && (
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <button
                  onClick={handleStartTimer}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  Start Practice Timer
                </button>
              </Box>
            )}

            <ContentDisplay
              title="Audio Sentence"
              content={
                <Box>
                  <TextToSpeech
                    text={currentQuestion.audio}
                    autoPlay={false}
                    onStart={() => console.log('Question audio started')}
                    onEnd={() => console.log('Question audio ended, ready to record')}
                    onError={(error) => {
                      setAudioError(error);
                      console.error('TextToSpeech error:', error);
                    }}
                  />
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Box sx={{ fontSize: '14px', color: 'text.secondary', mb: 1 }}>Transcript:</Box>
                    <Box sx={{ fontSize: '16px', fontWeight: 'medium' }}>{currentQuestion.audio}</Box>
                  </Box>
                </Box>
              }
              category={currentQuestion.category}
              difficulty={currentQuestion.difficulty}
              tags={currentQuestion.tags}
            />

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

            <ProgressIndicator
              current={audioRecording.recordedBlob ? 1 : 0}
              total={1}
              label="recording completed"
            />

            {!showFeedback && (
              <ActionButtons
                hasResponse={audioRecording.recordedBlob !== null}
                recordedBlob={audioRecording.recordedBlob}
                onSubmit={handleGetAIFeedback}
                onRedo={audioRecording.resetRecording}
                onTranslate={() => setShowTranslate(true)}
                onShowAnswer={() => setShowAnswer(true)}
                handleViewAttempts={handleViewAttempts}
              />
            )}

            

            <FeedbackDisplay />

            {/* <NavigationSection
              onSearch={handleSearch}
              onPrevious={handlePrevious}
              onNext={handleNext}
              questionNumber={currentQuestionIndex + 1}
            /> */}
          </PracticeCard>

          {/* Navigation Card */}
          <StyledCard sx={{ mb: 4, mt: 2 }}>
            <CardContent>
              <NavigationSection
                 onSearch={handleSearch}
              onPrevious={handlePrevious}
              onNext={handleNext}
              questionNumber={currentQuestionIndex + 1}
              />
            </CardContent>
          </StyledCard>
        </Box>

        {/* Instructions Panel */}
        <Box sx={{ width: { xs: '100%', lg: '30%' } }}>
          <InstructionsCard title="Instructions" sections={instructionsSections} />
        </Box>
      </Box>

      <TopicSelectionDrawer
        open={showTopicSelector}
        onClose={() => setShowTopicSelector(false)}
        onSelect={handleTopicSelect}
        topics={questionTopics}
        title="Select Repeat Sentence Question"
        type="question"
      />

      <AnswerDialog
        open={showAnswer}
        onClose={() => setShowAnswer(false)}
        title="Expected Response"
        text={currentQuestion.audio}
        answers={[{
          id: '1',
          position: 1,
          correctAnswer: currentQuestion.expectedAnswer
        }]}
      />

      <TranslationDialog
        open={showTranslate}
        onClose={() => setShowTranslate(false)}
        description="Translation feature will help you understand the sentence content in your preferred language."
      />

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
                const question = REPEAT_SENTENCE_QUESTIONS.find(q => q.id === attempt.questionId);
                return (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Sentence: ${question?.audio.substring(0, 50) || 'Unknown'}...`}
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
              localStorage.removeItem('repeatSentenceAttempts');
            }}
          >
            Clear Attempts
          </Button>
          <Button onClick={() => setShowAttempts(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </GradientBackground>
  );
};

export default RepeatSentence;