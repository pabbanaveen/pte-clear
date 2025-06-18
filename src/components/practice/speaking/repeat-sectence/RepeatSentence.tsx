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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  REPEAT_SENTENCE_QUESTIONS,
  MOCK_FEEDBACK,
  RECORDING_DURATION_MS,
  AUDIO_DURATION_MS,
} from './constants';

const RepeatSentence: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Handlers
  const handlePlayAudio = () => {
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
    }, AUDIO_DURATION_MS);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setHasRecorded(true);
    }, RECORDING_DURATION_MS);
  };

  const handleGetAIFeedback = () => {
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < REPEAT_SENTENCE_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setHasRecorded(false);
      setShowFeedback(false);
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
            Repeat Sentence
          </Typography>
          <Chip onClick={() => { }} label="AI Score Available" color="success" size={isMobile ? 'small' : 'medium'} />
        </Box>
        <Typography
          variant={isMobile ? 'caption' : 'body2'}
          color="text.secondary"
          sx={{ lineHeight: 1.5 }}
        >
          Listen to the sentence and repeat it exactly as you heard it.
        </Typography>
      </Box>

      {/* Progress */}
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
            Question {currentQuestionIndex + 1} of {REPEAT_SENTENCE_QUESTIONS.length}
          </Typography>
          <Chip
          onClick={() => { }}
            label="Speaking • Repeat Sentence"
            size={isMobile ? 'small' : 'medium'}
          />
        </Box>
        <LinearProgress
          variant="determinate"
          value={((currentQuestionIndex + 1) / REPEAT_SENTENCE_QUESTIONS.length) * 100}
          sx={{ height: { xs: 6, sm: 8 } }}
        />
      </Box>

      {/* Main Content */}
      <Grid container spacing={{ xs: 2, sm: 4 }}>
        {/* Question Panel */}
        <Box sx={{ width: { xs: '100%', lg: '60%' }, pr: { lg: 2 } }}>
          <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
            <Box textAlign="center" mb={{ xs: 4, sm: 6 }}>
              <Chip
              onClick={() => { }}
                label={`Difficulty: ${REPEAT_SENTENCE_QUESTIONS[currentQuestionIndex].difficulty}`}
                color={
                  REPEAT_SENTENCE_QUESTIONS[currentQuestionIndex].difficulty === 'Easy'
                    ? 'success'
                    : REPEAT_SENTENCE_QUESTIONS[currentQuestionIndex].difficulty === 'Medium'
                    ? 'warning'
                    : 'error'
                }
                sx={{ mb: 2 }}
              />
              <Typography
                variant={isMobile ? 'body1' : 'h6'}
                fontWeight="medium"
                mb={{ xs: 2, sm: 4 }}
              >
                Listen to the audio and repeat the sentence
              </Typography>

              {/* Audio Control */}
              <Box mb={{ xs: 4, sm: 6 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size={isMobile ? 'medium' : 'large'}
                  onClick={handlePlayAudio}
                  disabled={isPlaying}
                  startIcon={isPlaying ? <span className="animate-pulse">🔊</span> : '🔊'}
                  fullWidth={isMobile}
                >
                  {isPlaying ? 'Playing Audio...' : 'Play Audio'}
                </Button>
              </Box>

              {/* Recording Section */}
              {!isRecording && !hasRecorded && (
                <Button
                  variant="contained"
                  color="error"
                  size={isMobile ? 'medium' : 'large'}
                  onClick={handleStartRecording}
                  startIcon="🎤"
                  fullWidth={isMobile}
                >
                  Start Recording (15s)
                </Button>
              )}

              {isRecording && (
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: 'error.main',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: 'pulse 1.5s infinite',
                    }}
                  >
                    <Typography color="white" fontSize="24px">
                      🎤
                    </Typography>
                  </Box>
                  <Typography color="error.main" fontWeight="medium">
                    Recording... Repeat the sentence now
                  </Typography>
                  <Box width={isMobile ? '80%' : 256} bgcolor="grey.200" borderRadius="4px" height={8}>
                    <Box
                      bgcolor="error.main"
                      height={8}
                      borderRadius="4px"
                      width="60%"
                      sx={{ animation: 'pulse 1.5s infinite' }}
                    />
                  </Box>
                </Box>
              )}

              {hasRecorded && !showFeedback && (
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                  <Typography color="success.main" fontWeight="medium">
                    ✅ Recording Complete!
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size={isMobile ? 'medium' : 'large'}
                    onClick={handleGetAIFeedback}
                    fullWidth={isMobile}
                  >
                    Get AI Feedback
                  </Button>
                </Box>
              )}
            </Box>

            {/* AI Feedback */}
            {showFeedback && (
              <Box display="flex" flexDirection="column" gap={{ xs: 2, sm: 4 }}>
                <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="medium">
                  🤖 AI Feedback
                </Typography>

                {/* Original Sentence */}
                <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" fontWeight="medium" mb={1}>
                    Original Sentence:
                  </Typography>
                  <Typography fontStyle="italic">
                    "{REPEAT_SENTENCE_QUESTIONS[currentQuestionIndex].audio}"
                  </Typography>
                </Paper>

                {/* Scores */}
                <Grid container spacing={2}>
                  <Grid container sx={{ width: { xs: '100%', md: '25%' }}}>
                    <Paper
                      elevation={0}
                      sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', width: '100%' }}
                    >
                      <Typography variant="h5" color="primary.main" fontWeight="bold">
                        {MOCK_FEEDBACK.overallScore}
                      </Typography>
                      <Typography variant={isMobile ? 'caption' : 'body2'} color="text.secondary">
                        Overall
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid container sx={{ width: { xs: '100%', md: '25%' }}}>
                    <Paper
                      elevation={0}
                      sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', width: '100%' }}
                    >
                      <Typography variant="h5" color="success.main" fontWeight="bold">
                        {MOCK_FEEDBACK.pronunciation}
                      </Typography>
                      <Typography variant={isMobile ? 'caption' : 'body2'} color="text.secondary">
                        Pronunciation
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid container sx={{ width: { xs: '100%', md: '25%' }}}>
                    <Paper
                      elevation={0}
                      sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', width: '100%' }}
                    >
                      <Typography variant="h5" color="warning.main" fontWeight="bold">
                        {MOCK_FEEDBACK.fluency}
                      </Typography>
                      <Typography variant={isMobile ? 'caption' : 'body2'} color="text.secondary">
                        Fluency
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid container sx={{ width: { xs: '100%', md: '25%' }}}>
                    <Paper
                      elevation={0}
                      sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.light', width: '100%' }}
                    >
                      <Typography variant="h5" color="secondary.main" fontWeight="bold">
                        {MOCK_FEEDBACK.content}
                      </Typography>
                      <Typography variant={isMobile ? 'caption' : 'body2'} color="text.secondary">
                        Content
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Word Accuracy */}
                <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" fontWeight="medium" mb={2}>
                    Word Accuracy:
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                    <Typography variant="h5" color="success.main" fontWeight="bold">
                      {MOCK_FEEDBACK.wordsRepeated}/{MOCK_FEEDBACK.totalWords}
                    </Typography>
                    <Typography color="text.secondary">words repeated correctly</Typography>
                    <Box flex={1} minWidth={100} bgcolor="grey.200" borderRadius="4px" height={8}>
                      <Box
                        bgcolor="success.main"
                        height={8}
                        borderRadius="4px"
                        width={`${(MOCK_FEEDBACK.wordsRepeated / MOCK_FEEDBACK.totalWords) * 100}%`}
                      />
                    </Box>
                  </Box>
                </Paper>

                {/* Detailed Feedback */}
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="medium" mb={1}>
                      ✅ Strengths:
                    </Typography>
                    {MOCK_FEEDBACK.feedback.map((item, index) => (
                      <Box key={index} display="flex" alignItems="flex-start" gap={1}>
                        <Typography color="success.main">•</Typography>
                        <Typography variant={isMobile ? 'caption' : 'body2'}>{item}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="medium" mb={1}>
                      💡 Areas for Improvement:
                    </Typography>
                    {MOCK_FEEDBACK.improvements.map((item, index) => (
                      <Box key={index} display="flex" alignItems="flex-start" gap={1}>
                        <Typography color="warning.main">•</Typography>
                        <Typography variant={isMobile ? 'caption' : 'body2'}>{item}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Navigation Buttons */}
                <Box textAlign="center" mt={{ xs: 2, sm: 4 }}>
                  {currentQuestionIndex < REPEAT_SENTENCE_QUESTIONS.length - 1 ? (
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
                  Listen to the sentence and repeat it exactly as you heard it.
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="medium">
                  Time Allocation:
                </Typography>
                <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
                  <li>
                    <Typography variant={isMobile ? 'caption' : 'body2'}>
                      Audio plays automatically
                    </Typography>
                  </li>
                  <li>
                    <Typography variant={isMobile ? 'caption' : 'body2'}>
                      Recording: 15 seconds
                    </Typography>
                  </li>
                </Box>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="medium">
                  Tips:
                </Typography>
                <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
                  <li>
                    <Typography variant={isMobile ? 'caption' : 'body2'}>
                      Listen carefully to every word
                    </Typography>
                  </li>
                  <li>
                    <Typography variant={isMobile ? 'caption' : 'body2'}>
                      Repeat immediately after audio
                    </Typography>
                  </li>
                  <li>
                    <Typography variant={isMobile ? 'caption' : 'body2'}>
                      Maintain the same intonation
                    </Typography>
                  </li>
                  <li>
                    <Typography variant={isMobile ? 'caption' : 'body2'}>
                      Don't add or omit words
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
                      Content: All words repeated
                    </Typography>
                  </li>
                  <li>
                    <Typography variant={isMobile ? 'caption' : 'body2'}>
                      Pronunciation: Accuracy
                    </Typography>
                  </li>
                  <li>
                    <Typography variant={isMobile ? 'caption' : 'body2'}>
                      Fluency: Natural flow
                    </Typography>
                  </li>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Grid>
    </Container>
  );
};

export default RepeatSentence;