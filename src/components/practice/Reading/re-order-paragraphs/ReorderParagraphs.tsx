import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Paragraph, Question, QUESTIONS } from './constants';

// Constants
const TOTAL_TIME_SECONDS = 600; // 10 minutes

const ReorderParagraphs: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [orderedParagraphs, setOrderedParagraphs] = useState<Paragraph[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME_SECONDS);
  const [isTimerStarted, setIsTimerStarted] = useState(false);

  // Shuffle paragraphs on question change
  useEffect(() => {
    const shuffledParagraphs = [...QUESTIONS[currentQuestionIndex].paragraphs].sort(
      () => Math.random() - 0.5,
    );
    setOrderedParagraphs(shuffledParagraphs);
  }, [currentQuestionIndex]);

  // Timer logic
  const startTimer = () => {
    setIsTimerStarted(true);
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Drag-and-drop handlers
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, paragraphId: string) => {
    event.dataTransfer.setData('text/plain', paragraphId);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    event.preventDefault();
    const draggedId = event.dataTransfer.getData('text/plain');
    const draggedIndex = orderedParagraphs.findIndex((p) => p.id === draggedId);

    if (draggedIndex !== -1) {
      const updatedParagraphs = [...orderedParagraphs];
      const [draggedItem] = updatedParagraphs.splice(draggedIndex, 1);
      updatedParagraphs.splice(targetIndex, 0, draggedItem);
      setOrderedParagraphs(updatedParagraphs);
    }
  };

  // Move paragraph handlers
  const moveParagraphUp = (index: number) => {
    if (index > 0) {
      const updatedParagraphs = [...orderedParagraphs];
      [updatedParagraphs[index - 1], updatedParagraphs[index]] = [
        updatedParagraphs[index],
        updatedParagraphs[index - 1],
      ];
      setOrderedParagraphs(updatedParagraphs);
    }
  };

  const moveParagraphDown = (index: number) => {
    if (index < orderedParagraphs.length - 1) {
      const updatedParagraphs = [...orderedParagraphs];
      [updatedParagraphs[index], updatedParagraphs[index + 1]] = [
        updatedParagraphs[index + 1],
        updatedParagraphs[index],
      ];
      setOrderedParagraphs(updatedParagraphs);
    }
  };

  // Submit answer
  const submitAnswer = () => {
    setShowFeedback(true);
  };

  // Calculate score
  const calculateScore = (): number => {
    let correctPairs = 0;
    for (let i = 0; i < orderedParagraphs.length - 1; i++) {
      const current = orderedParagraphs[i];
      const next = orderedParagraphs[i + 1];
      if (current.originalOrder === next.originalOrder - 1) {
        correctPairs++;
      }
    }
    return Math.round((correctPairs / (orderedParagraphs.length - 1)) * 100);
  };

  // Get correct order
  const getCorrectOrder = (): Paragraph[] => {
    return [...QUESTIONS[currentQuestionIndex].paragraphs].sort(
      (a, b) => a.originalOrder - b.originalOrder,
    );
  };

  // Format time
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Navigate to next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
      setTimeRemaining(TOTAL_TIME_SECONDS);
      setIsTimerStarted(false);
    }
  };

  return (
    <Container
      maxWidth={isMobile ? 'sm' : isTablet ? 'md' : 'lg'}
      sx={{ py: { xs: 2, sm: 4 } }}
    >
      {/* Header */}
      <Box mb={{ xs: 2, sm: 4 }}>
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          gap={{ xs: 1, sm: 2 }}
          mb={2}
        >
          <Link to="/practice-tests" style={{ textDecoration: 'none' }}>
            <Typography
              color="primary"
              variant={isMobile ? 'body2' : 'body1'}
              sx={{ '&:hover': { color: 'primary.dark' } }}
            >
              ← Back to Practice
            </Typography>
          </Link>
          <Divider
            orientation={isMobile ? 'horizontal' : 'vertical'}
            flexItem
            sx={{ my: isMobile ? 1 : 0 }}
          />
          <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold">
            Re-order Paragraphs
          </Typography>
        </Box>
        <Typography
          variant={isMobile ? 'caption' : 'body2'}
          color="text.secondary"
          sx={{ lineHeight: 1.5 }}
        >
          Drag and drop the paragraphs to arrange them in the correct logical order.
        </Typography>
      </Box>

      {/* Progress and Timer */}
      <Box mb={{ xs: 2, sm: 4 }}>
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          gap={{ xs: 1, sm: 2 }}
          mb={2}
        >
          <Typography variant="caption" color="text.secondary">
            Question {currentQuestionIndex + 1} of {QUESTIONS.length}
          </Typography>
          <Box
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            gap={2}
          >
            <Chip
              label="Reading • Re-order Paragraphs"
              onClick={() => { }}
              size={isMobile ? 'small' : 'medium'}
            />
            <Typography
              color={timeRemaining < 120 ? 'error.main' : 'primary.main'}
              fontWeight="medium"
              variant={isMobile ? 'caption' : 'body2'}
            >
              Time: {formatTime(timeRemaining)}
            </Typography>
            {!isTimerStarted && (
              <Button
                variant="contained"
                color="primary"
                size={isMobile ? 'small' : 'medium'}
                onClick={startTimer}
              >
                Start Timer
              </Button>
            )}
          </Box>
        </Box>
        <LinearProgress
          variant="determinate"
          value={((currentQuestionIndex + 1) / QUESTIONS.length) * 100}
          sx={{ height: { xs: 6, sm: 8 } }}
        />
      </Box>

      {/* Main Content */}
      <Grid container spacing={{ xs: 2, sm: 4 }}>
        {/* Question Panel */}
        <Box sx={{ width: { xs: '100%', lg: '60%' }, pr: { lg: 2 } }}>
          <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              fontWeight="medium"
              mb={{ xs: 2, sm: 4 }}
            >
              {QUESTIONS[currentQuestionIndex].title}
            </Typography>

            {!showFeedback ? (
              <Box>
                <Typography
                  variant={isMobile ? 'caption' : 'body2'}
                  color="text.secondary"
                  mb={{ xs: 2, sm: 4 }}
                >
                  Drag the paragraphs to reorder them, or use the arrow buttons to move them up
                  and down.
                </Typography>
                <Box display="flex" flexDirection="column" gap={{ xs: 1.5, sm: 2 }}>
                  {orderedParagraphs.map((paragraph, index) => (
                    <Card
                      key={paragraph.id}
                      variant="outlined"
                      draggable
                      onDragStart={(e) => handleDragStart(e, paragraph.id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      sx={{
                        '&:hover': { borderColor: 'primary.main' },
                        cursor: 'move',
                        touchAction: 'none',
                      }}
                    >
                      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                        <Box
                          display="flex"
                          alignItems="flex-start"
                          gap={{ xs: 1, sm: 2 }}
                          flexDirection={isMobile ? 'column' : 'row'}
                        >
                          <Box
                            display="flex"
                            flexDirection={isMobile ? 'row' : 'column'}
                            gap={1}
                            alignItems={isMobile ? 'center' : 'flex-start'}
                          >
                            <IconButton
                              onClick={() => moveParagraphUp(index)}
                              disabled={index === 0}
                              size={isMobile ? 'small' : 'medium'}
                            >
                              <ArrowUpwardIcon fontSize={isMobile ? 'small' : 'medium'} />
                            </IconButton>
                            <Chip
                              label={index + 1}
                              onClick={() => { }}
                              size={isMobile ? 'small' : 'medium'}
                            />
                            <IconButton
                              onClick={() => moveParagraphDown(index)}
                              disabled={index === orderedParagraphs.length - 1}
                              size={isMobile ? 'small' : 'medium'}
                            >
                              <ArrowDownwardIcon fontSize={isMobile ? 'small' : 'medium'} />
                            </IconButton>
                          </Box>
                          <Typography
                            variant={isMobile ? 'body2' : 'body1'}
                            sx={{ flex: 1 }}
                          >
                            {paragraph.text}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
                <Box textAlign="center" mt={{ xs: 2, sm: 4 }}>
                  <Button
                    variant="contained"
                    color="success"
                    size={isMobile ? 'medium' : 'large'}
                    onClick={submitAnswer}
                    fullWidth={isMobile}
                  >
                    Submit Answer
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box display="flex" flexDirection="column" gap={{ xs: 2, sm: 4 }}>
                {/* Score */}
                <Card sx={{ textAlign: 'center', bgcolor: 'primary.light', p: { xs: 2, sm: 3 } }}>
                  <CardContent>
                    <Typography
                      variant={isMobile ? 'h4' : 'h3'}
                      color="primary.main"
                      fontWeight="bold"
                    >
                      {calculateScore()}%
                    </Typography>
                    <Typography
                      variant={isMobile ? 'caption' : 'body2'}
                      color="text.secondary"
                    >
                      Score
                    </Typography>
                  </CardContent>
                </Card>

                {/* Correct Order */}
                <Box>
                  <Typography
                    variant={isMobile ? 'h6' : 'h5'}
                    fontWeight="medium"
                    mb={2}
                  >
                    Correct Order:
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={{ xs: 1.5, sm: 2 }}>
                    {getCorrectOrder().map((paragraph, index) => (
                      <Card
                        key={paragraph.id}
                        variant="outlined"
                        sx={{ bgcolor: 'success.light' }}
                      >
                        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                          <Box
                            display="flex"
                            alignItems="flex-start"
                            gap={{ xs: 1, sm: 2 }}
                          >
                            <Chip
                              label={index + 1}
                              color="success"
                              onClick={() => { }}
                              size={isMobile ? 'small' : 'medium'}
                            />
                            <Typography
                              variant={isMobile ? 'body2' : 'body1'}
                            >
                              {paragraph.text}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Box>

                {/* Your Order Comparison */}
                <Box>
                  <Typography
                    variant={isMobile ? 'h6' : 'h5'}
                    fontWeight="medium"
                    mb={2}
                  >
                    Your Order:
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={{ xs: 1.5, sm: 2 }}>
                    {orderedParagraphs.map((paragraph, index) => {
                      const isCorrect = paragraph.originalOrder === index + 1;
                      return (
                        <Card
                          key={paragraph.id}
                          variant="outlined"
                          sx={{ bgcolor: isCorrect ? 'success.light' : 'error.light' }}
                        >
                          <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                            <Box
                              display="flex"
                              alignItems="flex-start"
                              gap={{ xs: 1, sm: 2 }}
                            >
                              <Chip
                                label={index + 1}
                                onClick={() => { }}
                                color={isCorrect ? 'success' : 'error'}
                                size={isMobile ? 'small' : 'medium'}
                              />
                              <Box flex={1}>
                                <Typography
                                  variant={isMobile ? 'body2' : 'body1'}
                                >
                                  {paragraph.text}
                                </Typography>
                                {!isCorrect && (
                                  <Typography
                                    variant="caption"
                                    color="error.main"
                                    mt={1}
                                  >
                                    Should be in position {paragraph.originalOrder}
                                  </Typography>
                                )}
                              </Box>
                              <Typography variant={isMobile ? 'body1' : 'h6'}>
                                {isCorrect ? '✅' : '❌'}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Box>
                </Box>

                {/* Navigation Buttons */}
                <Box textAlign="center">
                  {currentQuestionIndex < QUESTIONS.length - 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      size={isMobile ? 'medium' : 'large'}
                      onClick={goToNextQuestion}
                      fullWidth={isMobile}
                    >
                      Next Question →
                    </Button>
                  ) : (
                    <Box
                      display="flex"
                      flexDirection={{ xs: 'column', sm: 'row' }}
                      justifyContent="center"
                      gap={{ xs: 1, sm: 2 }}
                    >
                      <Link to="/practice-tests" style={{ textDecoration: 'none' }}>
                        <Button
                          variant="contained"
                          color="secondary"
                          size={isMobile ? 'medium' : 'large'}
                          fullWidth={isMobile}
                        >
                          Back to Practice
                        </Button>
                      </Link>
                      <Link to="/progress" style={{ textDecoration: 'none' }}>
                        <Button
                          variant="contained"
                          color="success"
                          size={isMobile ? 'medium' : 'large'}
                          fullWidth={isMobile}
                        >
                          View Progress
                        </Button>
                      </Link>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Instructions Panel */}
        <Box sx={{ width: { xs: '100%', lg: '33.333%' }, pl: { lg: 2 } }}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 4 },
              position: { lg: 'sticky' },
              top: { lg: '1.5rem' },
            }}
          >
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              fontWeight="medium"
              mb={2}
            >
              📝 Instructions
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box>
                <Typography variant="subtitle2" fontWeight="medium">
                  Task Overview:
                </Typography>
                <Typography
                  variant={isMobile ? 'caption' : 'body2'}
                  color="text.secondary"
                >
                  Arrange the paragraphs in logical order to form a coherent text.
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="medium">
                  How to Reorder:
                </Typography>
                <List dense>
                  {[
                    'Drag and drop paragraphs',
                    'Use ↑↓ buttons to move',
                    'Look for logical connections',
                    'Consider chronological order',
                  ].map((text) => (
                    <ListItem key={text}>
                      <ListItemText
                        primary={`• ${text}`}
                        primaryTypographyProps={{
                          variant: isMobile ? 'caption' : 'body2',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="medium">
                  Strategy Tips:
                </Typography>
                <List dense>
                  {[
                    'Identify the introduction',
                    'Look for topic sentences',
                    'Find connecting words',
                    'Check pronoun references',
                    'Consider cause and effect',
                  ].map((text) => (
                    <ListItem key={text}>
                      <ListItemText
                        primary={`• ${text}`}
                        primaryTypographyProps={{
                          variant: isMobile ? 'caption' : 'body2',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="medium">
                  Scoring:
                </Typography>
                <List dense>
                  {[
                    'Points for correct adjacent pairs',
                    'Maximum points for perfect order',
                    'Partial credit available',
                  ].map((text) => (
                    <ListItem key={text}>
                      <ListItemText
                        primary={`• ${text}`}
                        primaryTypographyProps={{
                          variant: isMobile ? 'caption' : 'body2',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Grid>
    </Container>
  );
};

export default ReorderParagraphs;