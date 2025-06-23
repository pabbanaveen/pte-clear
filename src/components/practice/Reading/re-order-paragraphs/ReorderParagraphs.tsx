import React, { useState, useEffect, useRef } from 'react';
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
  IconButton,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Chip,
  useTheme,
  useMediaQuery,
  Stack,
  styled,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Paragraph, Question, QUESTIONS } from './constants';
import TopicSelectionDrawer from '../../../common/TopicSelectionDrawer';
import ActionButtons from '../../common/ActionButtons';
import InstructionsCard from '../../common/InstructionsCard';
import NavigationSection from '../../common/NavigationSection';
import QuestionHeader from '../../common/QuestionHeader';
import StageGoalBanner from '../../common/StageGoalBanner';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 8,
  boxShadow: theme.shadows[2],
  transition: 'transform 0.3s ease, box-shadow 0.2s',
  '&:hover': { boxShadow: theme.shadows[4] },
}));

const FeedbackCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'isCorrect',
})<{ isCorrect?: boolean }>(({ theme, isCorrect }) => ({
  border: `2px solid ${isCorrect ? theme.palette.success.light : theme.palette.error.light}`,
  backgroundColor: isCorrect ? theme.palette.success.light : theme.palette.error.light,
  borderRadius: 8,
}));

const DropZone = styled(Box)(({ theme }) => ({
  height: 10,
  backgroundColor: theme.palette.primary.light,
  opacity: 0.5,
  margin: '0 -16px', // Span card width
  transition: 'height 0.3s ease',
  '&.active': { height: 20, opacity: 0.7 },
}));

const ReorderParagraphs: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [orderedParagraphs, setOrderedParagraphs] = useState<Paragraph[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const shuffledParagraphs = [...QUESTIONS[currentQuestionIndex].paragraphs].sort(() => Math.random() - 0.5);
    setOrderedParagraphs(shuffledParagraphs);
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

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, paragraphId: string) => {
    const paragraph = orderedParagraphs.find(p => p.id === paragraphId);
    if (paragraph && dragRef.current) {
      const dragImg = dragRef.current.cloneNode(true) as HTMLDivElement;
      dragImg.style.position = 'absolute';
      dragImg.style.pointerEvents = 'none';
      dragImg.style.opacity = '0.7';
      dragImg.style.boxShadow = theme.shadows[4];
      dragImg.style.borderRadius = '8px';
      dragImg.style.transform = 'scale(1.02)';
      dragImg.style.zIndex = '1000';
      document.body.appendChild(dragImg);
      event.dataTransfer.setDragImage(dragImg, 10, 10);
      event.dataTransfer.setData('text/plain', paragraphId);

      // Clean up the drag image after drag ends
      const cleanup = () => {
        document.body.removeChild(dragImg);
        document.removeEventListener('dragend', cleanup);
      };
      document.addEventListener('dragend', cleanup);
    }
  };

  const handleDragEnter = (index: number) => setDragOverIndex(index);
  const handleDragLeave = () => setDragOverIndex(null);
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => event.preventDefault();

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    event.preventDefault();
    const draggedId = event.dataTransfer.getData('text/plain');
    const draggedIndex = orderedParagraphs.findIndex((p) => p.id === draggedId);

    if (draggedIndex !== -1 && draggedIndex !== targetIndex) {
      const updatedParagraphs = [...orderedParagraphs];
      const [draggedItem] = updatedParagraphs.splice(draggedIndex, 1);
      updatedParagraphs.splice(targetIndex, 0, draggedItem);
      setOrderedParagraphs(updatedParagraphs);
    }
    setDragOverIndex(null);
  };

  const moveParagraphUp = (index: number) => {
    if (index > 0) {
      const updatedParagraphs = [...orderedParagraphs];
      [updatedParagraphs[index - 1], updatedParagraphs[index]] = [updatedParagraphs[index], updatedParagraphs[index - 1]];
      setOrderedParagraphs(updatedParagraphs);
    }
  };

  const moveParagraphDown = (index: number) => {
    if (index < orderedParagraphs.length - 1) {
      const updatedParagraphs = [...orderedParagraphs];
      [updatedParagraphs[index], updatedParagraphs[index + 1]] = [updatedParagraphs[index + 1], updatedParagraphs[index]];
      setOrderedParagraphs(updatedParagraphs);
    }
  };

  const submitAnswer = () => setShowFeedback(true);

  const calculateScore = (): number => {
    let correctPairs = 0;
    for (let i = 0; i < orderedParagraphs.length - 1; i++) {
      const current = orderedParagraphs[i];
      const next = orderedParagraphs[i + 1];
      if (current.originalOrder === next.originalOrder - 1) correctPairs++;
    }
    return Math.round((correctPairs / (orderedParagraphs.length - 1)) * 100);
  };

  const getCorrectOrder = (): Paragraph[] => [...QUESTIONS[currentQuestionIndex].paragraphs].sort((a, b) => a.originalOrder - b.originalOrder);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
      setTimeRemaining(600);
      setIsTimerStarted(false);
    }
  };

  const handleTopicSelect = (topic: any) => {
    const index = QUESTIONS.findIndex(q => q.id === topic.id);
    if (index !== -1) {
      setCurrentQuestionIndex(index);
      setShowFeedback(false);
      setTimeRemaining(600);
      setIsTimerStarted(false);
      setShowTopicSelector(false);
    }
  };

  const questionTopics = QUESTIONS.map(q => ({
    id: q.id,
    title: q.title.substring(0, 50) + (q.title.length > 50 ? '...' : ''),
    duration: '10m',
    speaker: 'Narrator',
    difficulty: 'Medium',
    category: 'Reading & Writing',
    tags: ['Reorder Paragraphs'],
    isNew: false,
    isMarked: false,
    pracStatus: 'In Progress',
    hasExplanation: true,
  }));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Stage Goal Banner */}
      <StageGoalBanner />

      {/* Progress Display */}
      <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
        Progress: {currentQuestionIndex + 1}/{QUESTIONS.length} questions attempted
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
            Reading & Writing: Re-order Paragraphs
          </Typography>
        </Stack>
        <Typography color="text.secondary" variant={isMobile ? 'caption' : 'body2'}>
          Drag and drop the paragraphs to arrange them in the correct logical order.
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
            Question {currentQuestionIndex + 1} of {QUESTIONS.length}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={1}>
            <Chip
              label="Reading & Writing • Re-order Paragraphs"
              size={isMobile ? 'small' : 'medium'}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            />
            <Stack direction="row" alignItems="center" spacing={1}>
              {/* <TimerIcon color={timeRemaining < 120 ? 'error' : 'primary'} /> */}
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
          value={((currentQuestionIndex + 1) / QUESTIONS.length) * 100}
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

              {!showFeedback ? (
                <Box>
                  <Typography variant="body2" color="text.secondary" mb={4}>
                    Drag and drop the paragraphs to reorder them, or use the arrow buttons to move them up and down.
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    {orderedParagraphs.map((paragraph, index) => (
                      <Box key={paragraph.id} ref={index === 0 ? dragRef : null}>
                        {dragOverIndex === index && (
                          <DropZone className="active" sx={{ mb: 1 }} />
                        )}
                        {index > 0 && dragOverIndex === index - 1 && (
                          <DropZone className="active" sx={{ mt: 1, mb: -1 }} />
                        )}
                        <Card
                          variant="outlined"
                          draggable
                          onDragStart={(e) => handleDragStart(e, paragraph.id)}
                          onDragOver={handleDragOver}
                          onDragEnter={() => handleDragEnter(index)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, index)}
                          sx={{
                            cursor: 'move',
                            transition: 'transform 0.3s ease, box-shadow 0.2s',
                            '&:active': { transform: 'translateY(-2px)', boxShadow: theme.shadows[6] },
                            padding: { xs: 1, sm: 2 },
                            minHeight: { xs: 80, sm: 100 },
                          }}
                        >
                          <CardContent sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box display="flex" flexDirection="column" gap={0.5} alignItems="center">
                              <IconButton
                                onClick={() => moveParagraphUp(index)}
                                disabled={index === 0}
                                size="small"
                                sx={{ padding: { xs: 0.5, sm: 1 } }}
                              >
                                <ArrowUpwardIcon fontSize={isMobile ? 'small' : 'medium'} />
                              </IconButton>
                              <Chip label={index + 1} size="small" />
                              <IconButton
                                onClick={() => moveParagraphDown(index)}
                                disabled={index === orderedParagraphs.length - 1}
                                size="small"
                                sx={{ padding: { xs: 0.5, sm: 1 } }}
                              >
                                <ArrowDownwardIcon fontSize={isMobile ? 'small' : 'medium'} />
                              </IconButton>
                            </Box>
                            <Typography
                              variant={isMobile ? 'body2' : 'body1'}
                              sx={{ flex: 1, wordBreak: 'break-word' }}
                            >
                              {paragraph.text}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Box>
                    ))}
                    {dragOverIndex === orderedParagraphs.length && (
                      <DropZone className="active" sx={{ mt: 1 }} />
                    )}
                  </Box>
                  <Box textAlign="center" mt={4}>
                    <ActionButtons
                      hasResponse={true}
                      recordedBlob={null}
                      onSubmit={submitAnswer}
                      onRedo={() => {
                        setOrderedParagraphs([...QUESTIONS[currentQuestionIndex].paragraphs].sort(() => Math.random() - 0.5));
                        setShowFeedback(false);
                        setTimeRemaining(600);
                        setIsTimerStarted(false);
                      }}
                      onTranslate={() => console.log('Translate clicked')}
                      onShowAnswer={() => {
                        setOrderedParagraphs(getCorrectOrder());
                        setShowFeedback(true);
                      }}
                    />
                  </Box>
                </Box>
              ) : (
                <Stack spacing={4}>
                  {/* Score */}
                  <Paper elevation={2} sx={{ p: 4, textAlign: 'center', bgcolor: 'primary.light' }}>
                    <Typography variant="h3" color="primary" fontWeight="bold">
                      {calculateScore()}%
                    </Typography>
                    <Typography color="text.secondary">
                      Score
                    </Typography>
                  </Paper>

                  {/* Correct Order */}
                  <Box>
                    <Typography variant="h6" fontWeight="medium" mb={2}>
                      Correct Order:
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                      {getCorrectOrder().map((paragraph, index) => (
                        <FeedbackCard key={paragraph.id} isCorrect={true}>
                          <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Chip label={index + 1} color="success" size="small" />
                            <Typography variant="body1">
                              {paragraph.text}
                            </Typography>
                          </CardContent>
                        </FeedbackCard>
                      ))}
                    </Box>
                  </Box>

                  {/* Your Order Comparison */}
                  <Box>
                    <Typography variant="h6" fontWeight="medium" mb={2}>
                      Your Order:
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                      {orderedParagraphs.map((paragraph, index) => {
                        const isCorrect = paragraph.originalOrder === index + 1;
                        return (
                          <FeedbackCard key={paragraph.id} isCorrect={isCorrect}>
                            <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Chip label={index + 1} color={isCorrect ? 'success' : 'error'} size="small" />
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body1">
                                  {paragraph.text}
                                </Typography>
                                {!isCorrect && (
                                  <Typography variant="caption" color="error.main" mt={1}>
                                    Should be in position {paragraph.originalOrder}
                                  </Typography>
                                )}
                              </Box>
                              <Typography variant="h6">{isCorrect ? '✅' : '❌'}</Typography>
                            </CardContent>
                          </FeedbackCard>
                        );
                      })}
                    </Box>
                  </Box>

                  {/* Next Question */}
                  <Box textAlign="center">
                    {currentQuestionIndex < QUESTIONS.length - 1 ? (
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
                items: ['Arrange the paragraphs in logical order to form a coherent text.'],
              },
              {
                title: 'How to Reorder',
                items: ['Drag and drop paragraphs', 'Use ↑↓ buttons to move', 'Look for logical connections', 'Consider chronological order'],
              },
              {
                title: 'Strategy Tips',
                items: ['Identify the introduction', 'Look for topic sentences', 'Find connecting words', 'Check pronoun references', 'Consider cause and effect'],
              },
              {
                title: 'Scoring',
                items: ['Points for correct adjacent pairs', 'Maximum points for perfect order', 'Partial credit available'],
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
        topics={questionTopics}
        title="Select Question Topic"
        type="question"
      />
    </Container>
  );
};

export default ReorderParagraphs;