import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container, Box, Typography, Card, CardContent, Button, Select, MenuItem,
  FormControl, InputLabel, LinearProgress, Grid, Divider, Chip, Alert,
  List, ListItem, ListItemText, Paper, Stack,
  useMediaQuery
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { BlankAnswer, FeedbackCardProps, instructionsSections, Question, questions } from './FillInBlanksMockData';
import InstructionsCard from '../../common/InstructionsCard';
import TopicSelectionDrawer from '../../../common/TopicSelectionDrawer';
import ActionButtons from '../../common/ActionButtons';
import NavigationSection from '../../common/NavigationSection';
import QuestionHeader from '../../common/QuestionHeader';
import StageGoalBanner from '../../common/StageGoalBanner';


const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: (theme.shape.borderRadius as number) * 2,
  boxShadow: theme.shadows[3],
}));

const FeedbackCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'isCorrect',
})<FeedbackCardProps>(({ theme, isCorrect }) => ({
  border: `2px solid ${isCorrect ? theme.palette.success.light : theme.palette.error.light}`,
  backgroundColor: isCorrect ? theme.palette.success.light : theme.palette.error.light,
  borderRadius: theme.shape.borderRadius,
}));

const FillInBlanks: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<BlankAnswer[]>([]);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [showTopicSelector, setShowTopicSelector] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    const currentQ = questions[currentQuestion];
    const initialAnswers = currentQ.blanks.map((blank) => ({
      id: blank.id,
      userAnswer: '',
      correctAnswer: blank.correctAnswer,
      options: blank.options,
    }));
    setAnswers(initialAnswers);
  }, [currentQuestion]);

  useEffect(() => {
    if (isStarted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isStarted]);

  const handleAnswerChange = (blankId: number, value: string) => {
    setAnswers((prev) =>
      prev.map((answer) =>
        answer.id === blankId ? { ...answer, userAnswer: value } : answer
      )
    );
  };

  const handleSubmit = () => {
    setShowFeedback(true);
  };

  const calculateScore = (): number => {
    const correctAnswers = answers.filter(
      (answer) =>
        answer.userAnswer.toLowerCase() === answer.correctAnswer.toLowerCase()
    ).length;
    return Math.round((correctAnswers / answers.length) * 100);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowFeedback(false);
      setTimeLeft(600);
      setIsStarted(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowFeedback(false);
      setTimeLeft(600);
      setIsStarted(false);
    }
  };

  const handleTopicSelect = (topic: any) => {
    const index = questions.findIndex((q) => q.id === topic.id);
    if (index !== -1) {
      setCurrentQuestion(index);
      setShowFeedback(false);
      setTimeLeft(600);
      setIsStarted(false);
      setShowTopicSelector(false);
    }
  };

  const questionTopics = questions.map((q) => ({
    id: q.id,
    title: q.title.substring(0, 50) + (q.title.length > 50 ? '...' : ''),
    duration: '10m',
    speaker: 'Narrator',
    difficulty: 'Medium',
    category: 'Reading & Writing',
    tags: ['Fill in Blanks'],
    isNew: false,
    isMarked: false,
    pracStatus: 'In Progress',
    hasExplanation: true,
  }));

  const renderTextWithBlanks = () => {
    const currentQ = questions[currentQuestion];
    const parts = currentQ.text.split(/_____\(\d+\)_____/);
    const blanks = currentQ.text.match(/_____\(\d+\)_____/g) || [];

    const result: React.ReactNode[] = [];
    for (let i = 0; i < parts.length; i++) {
      result.push(<span key={`text-${i}`} style={{ margin: '0 4px' }}>{parts[i]}</span>);
      if (i < blanks.length) {
        const blankNum = parseInt(blanks[i].match(/\d+/)?.[0] || '0');
        const answer = answers.find((a) => a.id === blankNum);
        result.push(
          <FormControl
            key={`blank-${blankNum}`}
            size="small"
            sx={{ mx: 1, minWidth: isMobile ? 100 : 120 }}
            disabled={showFeedback}
          >
            <InputLabel>{`Blank ${blankNum}`}</InputLabel>
            <Select
              value={answer?.userAnswer || ''}
              onChange={(e) => handleAnswerChange(blankNum, e.target.value as string)}
              sx={{
                bgcolor: showFeedback
                  ? answer?.userAnswer.toLowerCase() === answer?.correctAnswer.toLowerCase()
                    ? 'success.light'
                    : 'error.light'
                  : 'background.paper',
              }}
            >
              <MenuItem value="">Select...</MenuItem>
              {answer?.options.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      }
    }
    return result;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Stage Goal Banner */}
      <StageGoalBanner />

      {/* Progress Display */}
      <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
        Progress: {currentQuestion + 1}/{questions.length} questions attempted
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
            Reading & Writing: Fill in the Blanks
          </Typography>
        </Stack>
        <Typography color="text.secondary" variant={isMobile ? 'caption' : 'body2'}>
          There are some words missing in the following text. Please select the correct word in the drop-down box.
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
            Question {currentQuestion + 1} of {questions.length}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Chip label="Reading & Writing • Fill in the Blanks" size={isMobile ? 'small' : 'medium'} />
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
          value={((currentQuestion + 1) / questions.length) * 100}
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
              <QuestionHeader questionNumber={currentQuestion + 1} studentName="Student Name" testedCount={30} />

              {/* Text with Blanks */}
              <Paper elevation={1} sx={{ p: isMobile ? 2 : 3, mb: 3, bgcolor: 'grey.50' }}>
                <Typography variant="body1" lineHeight={1.8}>
                  {renderTextWithBlanks()}
                </Typography>
              </Paper>

              {/* Action Buttons */}
              {!showFeedback && (
                <Box mt={2}>
                  <ActionButtons
                    hasResponse={answers.some((answer) => answer.userAnswer)}
                    recordedBlob={null}
                    onSubmit={handleSubmit}
                    onRedo={() => {
                      setAnswers((prev) => prev.map((a) => ({ ...a, userAnswer: '' })));
                      setShowFeedback(false);
                      setTimeLeft(600);
                      setIsStarted(false);
                    }}
                    onTranslate={() => console.log('Translate clicked')}
                    onShowAnswer={() => {
                      setAnswers((prev) =>
                        prev.map((a) => ({ ...a, userAnswer: a.correctAnswer }))
                      );
                      setShowFeedback(true);
                    }}
                  />
                </Box>
              )}

              {/* Feedback */}
              {showFeedback && (
                <Stack spacing={4} mt={3}>
                  {/* Score */}
                  <Paper elevation={2} sx={{ p: 4, textAlign: 'center', bgcolor: 'primary.light' }}>
                    <Typography variant="h3" color="primary" fontWeight="bold">
                      {calculateScore()}%
                    </Typography>
                    <Typography color="text.secondary">
                      {answers.filter((a) => a.userAnswer.toLowerCase() === a.correctAnswer.toLowerCase()).length} out of{' '}
                      {answers.length} correct
                    </Typography>
                  </Paper>

                  {/* Answer Review */}
                  <Box>
                    <Typography variant="h6" fontWeight="medium" mb={2}>
                      Answer Review:
                    </Typography>
                    <Stack spacing={2}>
                      {answers.map((answer) => {
                        const isCorrect = answer.userAnswer.toLowerCase() === answer.correctAnswer.toLowerCase();
                        return (
                          <FeedbackCard key={answer.id} isCorrect={isCorrect}>
                            <CardContent>
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography fontWeight="medium">Blank {answer.id}:</Typography>
                                {isCorrect ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                              </Stack>
                              <Typography variant="body2" color={isCorrect ? 'success.main' : 'error.main'} mt={1}>
                                Your answer: <strong>{answer.userAnswer || 'Not answered'}</strong>
                              </Typography>
                              {!isCorrect && (
                                <Typography variant="body2" color="success.main">
                                  Correct answer: <strong>{answer.correctAnswer}</strong>
                                </Typography>
                              )}
                            </CardContent>
                          </FeedbackCard>
                        );
                      })}
                    </Stack>
                  </Box>

                  {/* Next Question */}
                  <Box textAlign="center">
                    {currentQuestion < questions.length - 1 ? (
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
            </CardContent>
          </StyledCard>

          {/* Navigation Card */}
          <StyledCard sx={{ mb: 4, mt: 2 }}>
            <CardContent>
              <NavigationSection
                onSearch={() => setShowTopicSelector(true)}
                onPrevious={handlePrevious}
                onNext={handleNextQuestion}
                questionNumber={currentQuestion + 1}
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
        title="Select Question Topic"
        type="question"
      />
    </Container>
  );
};

export default FillInBlanks;