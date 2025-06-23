import { Typography, CardContent, Button, Divider, Chip, LinearProgress, RadioGroup, FormControlLabel, Radio, Paper, Card } from "@mui/material";
import { useMediaQuery, Container, Box, Stack } from "@mui/system";
import { useState, useEffect } from "react";
import TopicSelectionDrawer from "../../../common/TopicSelectionDrawer";
import ActionButtons from "../../common/ActionButtons";
import InstructionsCard from "../../common/InstructionsCard";
import NavigationSection from "../../common/NavigationSection";
import QuestionHeader from "../../common/QuestionHeader";
import StageGoalBanner from "../../common/StageGoalBanner";
import TextToSpeech from "../../common/TextToSpeech";
import { MULTIPLE_CHOICE_QUESTIONS } from "./MultipleChoiceSingleMockData";
import { Link as RouterLink } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TimerIcon from '@mui/icons-material/Timer';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 8,
  boxShadow: theme.shadows[2], // Removed ?. and ensured direct access
  transition: 'box-shadow 0.2s',
  '&:hover': { boxShadow: theme.shadows[4] }, // Removed ?. and ensured direct access
}));

const FeedbackCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'isCorrect',
})<{ isCorrect?: boolean }>(({ theme, isCorrect }) => ({
  border: `2px solid ${isCorrect ? theme.palette.success.light : theme.palette.error.light}`,
  backgroundColor: isCorrect ? theme.palette.success.light : theme.palette.error.light,
  borderRadius: 8,
}));

const MultipleChoiceSingleListening: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  const currentQuestion = MULTIPLE_CHOICE_QUESTIONS[currentQuestionIndex];

  useEffect(() => {
    setSelectedOption(null);
    setShowFeedback(false);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (isTimerStarted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isTimerStarted]);

  const startTimer = () => setIsTimerStarted(true);

  const handleSubmit = () => {
    if (selectedOption !== null) {
      setShowFeedback(true);
    }
  };

  const isCorrect = () => {
    if (selectedOption === null) return false;
    const selectedIndex = currentQuestion.options.indexOf(selectedOption);
    return selectedIndex === currentQuestion.correctAnswer;
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < MULTIPLE_CHOICE_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
      setTimeRemaining(600);
      setIsTimerStarted(false);
    }
  };

  const handleTopicSelect = (topic: any) => {
    const index = MULTIPLE_CHOICE_QUESTIONS.findIndex(q => q.id === topic.id);
    if (index !== -1) {
      setCurrentQuestionIndex(index);
      setShowFeedback(false);
      setTimeRemaining(600);
      setIsTimerStarted(false);
      setShowTopicSelector(false);
    }
  };

//   const questionTopics = MULTIPLE_CHOICE_QUESTIONS.map(q => ({
//     id: q.id,
//     title: q.question.substring(0, 50) + (q.question.length > 50 ? '...' : ''),
//     duration: '10m',
//     speaker: 'Narrator',
//     difficulty: 'Medium',
//     category: 'Listening',
//     tags: ['Multiple Choice (Single)'],
//     isNew: false,
//     isMarked: false,
//     pracStatus: 'In Progress',
//     hasExplanation: true,
//   }));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Stage Goal Banner */}
      <StageGoalBanner />

      {/* Progress Display */}
      <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
        Progress: {currentQuestionIndex + 1}/{MULTIPLE_CHOICE_QUESTIONS.length} questions attempted
      </Typography>

      {/* Navigation Card (First Card) */}
      <StyledCard sx={{ mb: 4 }}>
        <CardContent>
          <NavigationSection
            onSearch={() => setShowTopicSelector(true)}
            onPrevious={() => {
              if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
                setShowFeedback(false);
                setTimeRemaining(600);
                setIsTimerStarted(false);
              }
            }}
            onNext={goToNextQuestion}
            questionNumber={currentQuestionIndex + 1}
          />
        </CardContent>
      </StyledCard>

      {/* Header */}
      <Box mb={4}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2 }} alignItems={{ xs: 'flex-start', sm: 'center' }} mb={2}>
          <Button
            component={RouterLink}
            to="/practice-tests"
            color="primary"
            startIcon={<span style={{ marginRight: '8px' }}>←</span>}
            size={isMobile ? 'small' : 'medium'}
          >
            Back to Practice
          </Button>
          {/* <Divider orientation={{ xs: 'horizontal', sm: 'vertical' }} flexItem sx={{ my: { xs: 1, sm: 0 } }} /> */}
          <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold">
            Listening: Multiple Choice (Single)
          </Typography>
        </Stack>
        <Typography color="text.secondary" variant={isMobile ? 'caption' : 'body2'}>
          Listen to the recording and select the correct response. Only one response is correct.
        </Typography>
      </Box>

      {/* Progress and Timer */}
      <Box mb={4}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={{ xs: 1, sm: 2 }}
          mb={2}
        >
          <Typography variant="caption" color="text.secondary">
            Question {currentQuestionIndex + 1} of {MULTIPLE_CHOICE_QUESTIONS.length}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={1}>
            <Chip
              label="Listening • Multiple Choice (Single)"
              size={isMobile ? 'small' : 'medium'}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            />
            <Stack direction="row" alignItems="center" spacing={1}>
              <TimerIcon color={timeRemaining < 120 ? 'error' : 'primary'} />
              <Typography color={timeRemaining < 120 ? 'error.main' : 'primary.main'} variant={isMobile ? 'caption' : 'body2'}>
                {formatTime(timeRemaining)}
              </Typography>
            </Stack>
            {!isTimerStarted && (
              <Button
                variant="contained"
                size={isMobile ? 'small' : 'medium'}
                onClick={startTimer}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                Start Timer
              </Button>
            )}
          </Stack>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={((currentQuestionIndex + 1) / MULTIPLE_CHOICE_QUESTIONS.length) * 100}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: { xs: 2, sm: 4 } }}>
        {/* Question Panel */}
        <Box sx={{ width: { xs: '100%', lg: '63%' } }}>
          <StyledCard>
            <CardContent>
              {/* Question Header */}
              <QuestionHeader questionNumber={currentQuestionIndex + 1} studentName="Student Name" testedCount={30} />

              <Box mb={2}>
                <Button
                  variant="outlined"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => {/* Trigger TextToSpeech */}}
                  sx={{ mb: 2 }}
                >
                  Play Recording
                </Button>
                <TextToSpeech text={currentQuestion.audioText} />
              </Box>

              {!showFeedback ? (
                <Box>
                  <Typography variant="body1" color="text.primary" mb={2}>
                    {currentQuestion.question}
                  </Typography>
                  <RadioGroup
                    value={selectedOption || ''}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  >
                    {currentQuestion.options.map((option, index) => (
                      <StyledCard key={index} sx={{ mb: 1 }}>
                        <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                          <FormControlLabel
                            value={option}
                            control={<Radio />}
                            label={option}
                            sx={{ flex: 1, m: 0 }}
                          />
                        </CardContent>
                      </StyledCard>
                    ))}
                  </RadioGroup>
                  <Box textAlign="center" mt={4}>
                    <ActionButtons
                      hasResponse={selectedOption !== null}
                      recordedBlob={null}
                      onSubmit={handleSubmit}
                      onRedo={() => {
                        setSelectedOption(null);
                        setShowFeedback(false);
                        setTimeRemaining(600);
                        setIsTimerStarted(false);
                      }}
                      onTranslate={() => console.log('Translate clicked')}
                      onShowAnswer={() => {
                        setSelectedOption(currentQuestion.options[currentQuestion.correctAnswer]);
                        setShowFeedback(true);
                      }}
                    />
                  </Box>
                </Box>
              ) : (
                <Stack spacing={4}>
                  {/* Feedback */}
                  <Paper elevation={2} sx={{ p: 4, textAlign: 'center', bgcolor: isCorrect() ? 'success.light' : 'error.light' }}>
                    <Typography variant="h3" color={isCorrect() ? 'success.main' : 'error.main'} fontWeight="bold">
                      {isCorrect() ? 'Correct!' : 'Incorrect'}
                    </Typography>
                    <Typography color="text.secondary">
                      {isCorrect() ? 'Well done!' : `The correct answer is: ${currentQuestion.options[currentQuestion.correctAnswer]}`}
                    </Typography>
                  </Paper>

                  {/* Options with Feedback */}
                  <Box>
                    <Typography variant="h6" fontWeight="medium" mb={2}>
                      Your Answer:
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                      {currentQuestion.options.map((option, index) => (
                        <FeedbackCard key={index} isCorrect={index === currentQuestion.correctAnswer && selectedOption === option}>
                          <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Radio checked={selectedOption === option} disabled />
                            <Typography variant="body1" sx={{ flex: 1 }}>
                              {option}
                            </Typography>
                            {index === currentQuestion.correctAnswer && <CheckCircleIcon color="success" />}
                            {selectedOption === option && index !== currentQuestion.correctAnswer && <CancelIcon color="error" />}
                          </CardContent>
                        </FeedbackCard>
                      ))}
                    </Box>
                  </Box>

                  {/* Next Question */}
                  <Box textAlign="center">
                    {currentQuestionIndex < MULTIPLE_CHOICE_QUESTIONS.length - 1 ? (
                      <Button
                        variant="contained"
                        size="large"
                        onClick={goToNextQuestion}
                        endIcon={<span style={{ marginLeft: '8px' }}>→</span>}
                      >
                        Next Question
                      </Button>
                    ) : (
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2 }} justifyContent="center">
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
            </CardContent>
          </StyledCard>
        </Box>

        {/* Instructions Panel */}
        <Box sx={{ width: { xs: '100%', lg: '33.333%' }, pl: { lg: 2 } }}>
          <InstructionsCard
            title="Instructions"
            sections={[
              {
                title: 'Task Overview',
                items: ['Listen to the recording and select the correct single response.'],
              },
              {
                title: 'How to Answer',
                items: ['Click the Play button to listen', 'Select one option using the radio button', 'Submit your answer'],
              },
              {
                title: 'Strategy Tips',
                items: ['Listen carefully to key details', 'Eliminate obviously wrong options', 'Focus on the main idea'],
              },
              {
                title: 'Scoring',
                items: ['1 point for correct answer', '0 points for incorrect or no answer'],
              },
            ]}
          />
        </Box>
      </Box>

      {/* Topic Selection Drawer */}
      <TopicSelectionDrawer
        open={showTopicSelector}
        onClose={() => setShowTopicSelector(false)}
        onSelect={handleTopicSelect}
        topics={MULTIPLE_CHOICE_QUESTIONS}
        title="Select Question Topic"
        type="question"
      />
    </Container>
  );
};

export default MultipleChoiceSingleListening;