import React, { useState } from 'react';
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
  TextareaAutosize,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ESSAY_QUESTIONS,
  ESSAY_MOCK_FEEDBACK,
  ESSAY_TIME_LIMIT_SECONDS,
  ESSAY_MIN_WORDS,
  ESSAY_MAX_WORDS,
} from './constants';

const WritingEssay: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [essayText, setEssayText] = useState('');
  const [timeLeft, setTimeLeft] = useState(ESSAY_TIME_LIMIT_SECONDS);
  const [isStarted, setIsStarted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Handlers
  const handleStartTimer = () => {
    setIsStarted(true);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmitEssay = () => {
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < ESSAY_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setEssayText('');
      setTimeLeft(ESSAY_TIME_LIMIT_SECONDS);
      setIsStarted(false);
      setShowFeedback(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWordCount = () => {
    return essayText.trim().split(/\s+/).filter((word) => word.length > 0).length;
  };

  // Mock feedback with dynamic word count
  const feedback = {
    ...ESSAY_MOCK_FEEDBACK,
    wordCount: getWordCount(),
  };

  return (
    <Container
      maxWidth={isMobile ? 'sm' : 'lg'}
      sx={{ py: { xs: 2, sm: 4 } }}
    >
      {/* Header */}
      <Box mb={{ xs: 2, sm: 6 }}>
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'start', sm: 'center' }}
          gap={2}
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
            Write Essay
          </Typography>
          <Chip onClick={() => { }} label="PTA" color="secondary" size={isMobile ? 'small' : 'medium'} />
        </Box>
        <Typography
          variant={isMobile ? 'caption' : 'body2'}
          color="text.secondary"
          sx={{ lineHeight: 1.5 }}
        >
          Write an essay of 200-300 words in response to the prompt below. You have 20 minutes.
        </Typography>
      </Box>

      {/* Progress */}
      <Box mb={{ xs: 2, sm: 4 }}>
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'start', sm: 'center' }}
          gap={{ xs: 1, sm: 2 }}
          mb={2}
        >
          <Typography variant="caption" color="text.secondary">
            Question {currentQuestionIndex + 1} of {ESSAY_QUESTIONS.length}
          </Typography>
          <Chip
          onClick={() => { }}
            label="Writing • Essay"
            size={isMobile ? 'small' : 'medium'}
          />
        </Box>
        <LinearProgress
          variant="determinate"
          value={((currentQuestionIndex + 1) / ESSAY_QUESTIONS.length) * 100}
          sx={{ height: { xs: 6, sm: 8 } }}
        />
      </Box>

      {/* Main Content */}
      <Grid container spacing={{ xs: 2, sm: 4 }}>
        {/* Writing Area */}
        <Box sx={{ width: { xs: '100%', lg: '72%' }, pr: { lg: 2 } }}>
          {/* Question Panel */}
          <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 } }}>
            <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'start', sm: 'center' }}
              mb={2}
            >
              <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="medium">
                Essay Question
              </Typography>
              <Box
                display="flex"
                flexDirection={{ xs: 'column', sm: 'row' }}
                gap={2}
                alignItems={{ xs: 'start', sm: 'center' }}
              >
                <Chip onClick={() => { }} label={ESSAY_QUESTIONS[currentQuestionIndex].type} size="small" />
                <Typography variant="caption" color="text.secondary">
                  {ESSAY_QUESTIONS[currentQuestionIndex].wordLimit}
                </Typography>
              </Box>
            </Box>
            <Paper
              variant="outlined"
              sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'grey.50', mb: { xs: 2, sm: 3 } }}
            >
              <Typography variant={isMobile ? 'body2' : 'body1'} sx={{ lineHeight: 1.6 }}>
                {ESSAY_QUESTIONS[currentQuestionIndex].prompt}
              </Typography>
            </Paper>
            <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'start', sm: 'center' }}
              gap={2}
            >
              <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} alignItems="center">
                <Typography
                  color={timeLeft < 300 ? 'error.main' : 'primary.main'}
                  fontWeight="medium"
                  variant={isMobile ? 'caption' : 'body2'}
                >
                  Time: {formatTime(timeLeft)}
                </Typography>
                {!isStarted && (
                  <Button
                    variant="contained"
                    color="primary"
                    size={isMobile ? 'small' : 'medium'}
                    onClick={handleStartTimer}
                  >
                    Start Timer
                  </Button>
                )}
              </Box>
              <Typography
                color={
                  getWordCount() < ESSAY_MIN_WORDS
                    ? 'warning.main'
                    : getWordCount() > ESSAY_MAX_WORDS
                    ? 'error.main'
                    : 'success.main'
                }
                fontWeight="medium"
                variant={isMobile ? 'caption' : 'body2'}
              >
                Words: {getWordCount()}/{ESSAY_MAX_WORDS}
              </Typography>
            </Box>
          </Paper>

          {/* Writing Area */}
          <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
            <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="medium" mb={2}>
              Your Essay
            </Typography>
            <TextareaAutosize
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              placeholder="Start writing your essay here..."
              minRows={12}
              disabled={timeLeft === 0 || showFeedback}
              style={{
                width: '100%',
                padding: '16px',
                border: '1px solid rgba(0, 0, 0, 0.23)',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                resize: 'vertical',
              }}
              aria-label="Essay text area"
            />
            <Box textAlign="center" mt={2}>
              {timeLeft > 0 && !showFeedback && getWordCount() >= ESSAY_MIN_WORDS && (
                <Button
                  variant="contained"
                  color="success"
                  size={isMobile ? 'medium' : 'large'}
                  onClick={handleSubmitEssay}
                  fullWidth={isMobile}
                >
                  Submit Essay
                </Button>
              )}
              {timeLeft === 0 && !showFeedback && (
                <Button
                  variant="contained"
                  color="error"
                  size={isMobile ? 'medium' : 'large'}
                  onClick={handleSubmitEssay}
                  fullWidth={isMobile}
                >
                  Time's Up - Submit Essay
                </Button>
              )}
            </Box>
          </Paper>
        </Box>

        {/* Instructions/Feedback Panel */}
        <Box sx={{ width: { xs: '100%', lg: '25%' }, pl: { lg: 2 } }}>
          {!showFeedback ? (
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
                📝 Essay Guidelines
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="medium">
                    Structure:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
                    <li>
                      <Typography variant={isMobile ? 'caption' : 'body2'}>
                        Introduction with thesis
                      </Typography>
                    </li>
                    <li>
                      <Typography variant={isMobile ? 'caption' : 'body2'}>
                        2-3 body paragraphs
                      </Typography>
                    </li>
                    <li>
                      <Typography variant={isMobile ? 'caption' : 'body2'}>
                        Clear conclusion
                      </Typography>
                    </li>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="medium">
                    Content Tips:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
                    <li>
                      <Typography variant={isMobile ? 'caption' : 'body2'}>
                        Address the question directly
                      </Typography>
                    </li>
                    <li>
                      <Typography variant={isMobile ? 'caption' : 'body2'}>
                        Use specific examples
                      </Typography>
                    </li>
                    <li>
                      <Typography variant={isMobile ? 'caption' : 'body2'}>
                        Present clear arguments
                      </Typography>
                    </li>
                    <li>
                      <Typography variant={isMobile ? 'caption' : 'body2'}>
                        Show different perspectives
                      </Typography>
                    </li>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="medium">
                    Language:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
                    <li>
                      <Typography variant={isMobile ? 'caption' : 'body2'}>
                        Use varied sentence structures
                      </Typography>
                    </li>
                    <li>
                      <Typography variant={isMobile ? 'caption' : 'body2'}>
                        Include transitional phrases
                      </Typography>
                    </li>
                    <li>
                      <Typography variant={isMobile ? 'caption' : 'body2'}>
                        Use academic vocabulary
                      </Typography>
                    </li>
                    <li>
                      <Typography variant={isMobile ? 'caption' : 'body2'}>
                        Check grammar and spelling
                      </Typography>
                    </li>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="medium">
                    Scoring:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
                    <li>
                      <Typography variant={isMobile ? 'caption' : 'body2'}>
                        Content (40%)
                      </Typography>
                    </li>
                    <li>
                      <Typography variant={isMobile ? 'caption' : 'body2'}>
                        Form & Development (25%)
                      </Typography>
                    </li>
                    <li>
                      <Typography variant={isMobile ? 'caption' : 'body2'}>
                        Grammar (25%)
                      </Typography>
                    </li>
                    <li>
                      <Typography variant={isMobile ? 'caption' : 'body2'}>
                        Vocabulary (5%)
                      </Typography>
                    </li>
                    <li>
                      <Typography variant={isMobile ? 'caption' : 'body2'}>
                        Spelling (5%)
                      </Typography>
                    </li>
                  </Box>
                </Box>
              </Box>
            </Paper>
          ) : (
            <Box display="flex" flexDirection="column" gap={2}>
              {/* AI Feedback */}
              <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
                <Typography
                  variant={isMobile ? 'h6' : 'h5'}
                  fontWeight="medium"
                  mb={2}
                >
                  🤖 AI Feedback
                </Typography>
                <Box textAlign="center" mb={3}>
                  <Typography variant="h4" color="primary.main" fontWeight="bold">
                    {feedback.overallScore}
                  </Typography>
                  <Typography
                    variant={isMobile ? 'caption' : 'body2'}
                    color="text.secondary"
                  >
                    Overall Score
                  </Typography>
                </Box>
                <Grid container spacing={0.5}>
                  <Grid container sx={{ width: { xs: '100%', md: '48%' }}}>
                    <Paper
                      elevation={0}
                      sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', width: '100%' }}
                    >
                      <Typography variant="h6" color="primary.main" fontWeight="bold">
                        {feedback.contentScore}
                      </Typography>
                      <Typography
                        variant={isMobile ? 'caption' : 'body2'}
                        color="text.secondary"
                      >
                        Content
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid container sx={{ width: { xs: '100%', md: '48%' }}}>
                    <Paper
                      elevation={0}
                      sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', width: '100%' }}
                    >
                      <Typography variant="h6" color="success.main" fontWeight="bold">
                        {feedback.formScore}
                      </Typography>
                      <Typography
                        variant={isMobile ? 'caption' : 'body2'}
                        color="text.secondary"
                      >
                        Form
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid container sx={{ width: { xs: '100%', md: '48%' }}}>
                    <Paper
                      elevation={0}
                      sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', width: '100%' }}
                    >
                      <Typography variant="h6" color="warning.main" fontWeight="bold">
                        {feedback.grammarScore}
                      </Typography>
                      <Typography
                        variant={isMobile ? 'caption' : 'body2'}
                        color="text.secondary"
                      >
                        Grammar
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid container sx={{ width: { xs: '100%', md: '48%' }}}>
                    <Paper
                      elevation={0}
                      sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.light', width: '100%' }}
                    >
                      <Typography variant="h6" color="secondary.main" fontWeight="bold">
                        {feedback.vocabularyScore}
                      </Typography>
                      <Typography
                        variant={isMobile ? 'caption' : 'body2'}
                        color="text.secondary"
                      >
                        Vocabulary
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
                <Paper
                  variant="outlined"
                  sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'grey.50', mt: 2 }}
                >
                  <Typography variant="subtitle2" fontWeight="medium" mb={1}>
                    Word Count:
                  </Typography>
                  <Typography>
                    {feedback.wordCount} words
                  </Typography>
                  <Typography
                    color={
                      feedback.wordCount >= ESSAY_MIN_WORDS && feedback.wordCount <= ESSAY_MAX_WORDS
                        ? 'success.main'
                        : 'warning.main'
                    }
                    variant="caption"
                  >
                    {feedback.wordCount >= ESSAY_MIN_WORDS && feedback.wordCount <= ESSAY_MAX_WORDS
                      ? '✓ Within recommended range'
                      : '⚠ Outside recommended range (200-300)'}
                  </Typography>
                </Paper>
                <Box textAlign="center" mt={2}>
                  {currentQuestionIndex < ESSAY_QUESTIONS.length - 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      size={isMobile ? 'medium' : 'large'}
                      onClick={handleNextQuestion}
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
              </Paper>

              {/* Detailed Feedback */}
              <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, mt: 2 }}>
                <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                  Detailed Analysis
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight="medium"
                      color="success.main"
                      mb={1}
                    >
                      ✅ Strengths:
                    </Typography>
                    {feedback.feedback.strengths.map((item, index) => (
                      <Box key={index} display="flex" alignItems="flex-start" gap={1}>
                        <Typography color="success.main">•</Typography>
                        <Typography variant={isMobile ? 'caption' : 'body2'}>{item}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight="medium"
                      color="warning.main"
                      mb={1}
                    >
                      💡 Improvements:
                    </Typography>
                    {feedback.feedback.improvements.map((item, index) => (
                      <Box key={index} display="flex" alignItems="flex-start" gap={1}>
                        <Typography color="warning.main">•</Typography>
                        <Typography variant={isMobile ? 'caption' : 'body2'}>{item}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight="medium"
                      color="primary.main"
                      mb={1}
                    >
                      Grammar:
                    </Typography>
                    {feedback.feedback.grammar.map((item, index) => (
                      <Box key={index} display="flex" alignItems="flex-start" gap={1}>
                        <Typography color="primary.main">•</Typography>
                        <Typography variant={isMobile ? 'caption' : 'body2'}>{item}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight="medium"
                      color="secondary.main"
                      mb={1}
                    >
                      Vocabulary:
                    </Typography>
                    {feedback.feedback.vocabulary.map((item, index) => (
                      <Box key={index} display="flex" alignItems="flex-start" gap={1}>
                        <Typography color="secondary.main">•</Typography>
                        <Typography variant={isMobile ? 'caption' : 'body2'}>{item}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Paper>
            </Box>
          )}
        </Box>
      </Grid>
    </Container>
  );
};

export default WritingEssay;