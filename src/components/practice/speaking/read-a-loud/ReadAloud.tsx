import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container, Box, Typography, Card, CardContent, Button, Chip, Paper, Stack, List, ListItem, ListItemText, LinearProgress
} from '@mui/material';
import { styled, Theme } from '@mui/material/styles';
import MicIcon from '@mui/icons-material/Mic';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TimerIcon from '@mui/icons-material/Timer';

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

const ReadAloud: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [hasRecorded, setHasRecorded] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [preparationTime, setPreparationTime] = useState<number>(40);
  const audioRef = useRef<HTMLAudioElement>(null);

  const questions: Question[] = [
    {
      id: 1,
      text: "Climate change is one of the most pressing issues of our time. Scientists worldwide are working tirelessly to understand its effects and develop solutions. The melting of polar ice caps, rising sea levels, and extreme weather patterns are clear indicators that immediate action is required. Governments, businesses, and individuals must collaborate to reduce carbon emissions and implement sustainable practices.",
      preparationTime: 40,
      recordingTime: 40,
    },
    {
      id: 2,
      text: "The advancement of artificial intelligence has revolutionized numerous industries. From healthcare to transportation, AI systems are enhancing efficiency and accuracy. Machine learning algorithms can now diagnose diseases, predict market trends, and even drive vehicles autonomously. However, this technological progress also raises important questions about job displacement and ethical considerations.",
      preparationTime: 40,
      recordingTime: 40,
    },
    {
      id: 3,
      text: "Education plays a crucial role in shaping society's future. Traditional classroom settings are being complemented by online learning platforms, making education more accessible to people worldwide. Interactive technologies, virtual reality, and personalized learning experiences are transforming how students acquire knowledge and develop critical thinking skills.",
      preparationTime: 40,
      recordingTime: 40,
    },
  ];

  const mockFeedback: Feedback = {
    overallScore: 75,
    pronunciation: 78,
    fluency: 72,
    content: 80,
    feedback: [
      "Good pronunciation of complex words",
      "Natural pace and rhythm maintained",
      "Minor hesitations noted in long sentences",
      "Excellent word stress patterns",
    ],
    improvements: [
      "Focus on smoother transitions between phrases",
      "Practice reading longer sentences without pauses",
      "Work on consistent volume throughout",
    ],
  };

  useEffect(() => {
    if (preparationTime > 0 && !isRecording && !hasRecorded) {
      const timer = setInterval(() => {
        setPreparationTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [preparationTime, isRecording, hasRecorded]);

  useEffect(() => {
    if (isRecording) {
      const timer = setTimeout(() => {
        setIsRecording(false);
        setHasRecorded(true);
      }, questions[currentQuestion].recordingTime * 1000);
      return () => clearTimeout(timer);
    }
  }, [isRecording, currentQuestion, questions]);

  const handleStartPreparation = () => {
    setPreparationTime(questions[currentQuestion].preparationTime);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleGetAIFeedback = () => {
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setHasRecorded(false);
      setShowFeedback(false);
      setPreparationTime(questions[currentQuestion + 1].preparationTime);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box mb={4}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} mb={2}>
          <Button
            component={RouterLink}
            to="/practice-tests"
            color="primary"
            startIcon="←"
            sx={{ textTransform: 'none' }}
          >
            Back to Practice
          </Button>
          <Box sx={{ display: { xs: 'none', sm: 'block' }, width: 1, height: 24, bgcolor: 'grey.300' }} />
          <Typography variant="h4" fontWeight="bold" flexGrow={1}>
            Read Aloud
          </Typography>
          <Chip
          onClick={() => { }}
            label="AI Score Available"
            color="success"
            size="small"
            sx={{ bgcolor: 'success.light', color: 'success.dark' }}
          />
        </Stack>
        <Typography color="text.secondary" variant="body2">
          Read the text aloud naturally and clearly. You have 40 seconds to prepare and 40 seconds to record.
        </Typography>
      </Box>

      {/* Progress */}
      <Box mb={4}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} mb={2} spacing={1}>
          <Typography variant="caption" color="text.secondary">
            Question {currentQuestion + 1} of {questions.length}
          </Typography>
          <Chip onClick={() => { }} label="Speaking • Read Aloud" size="small" />
        </Stack>
        <LinearProgress
          variant="determinate"
          value={((currentQuestion + 1) / questions.length) * 100}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Question Panel */}
        <Box sx={{ flex: { md: 2 }, width: { xs: '100%', md: '66%' } }}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" fontWeight="medium" mb={3}>
                Read the following text:
              </Typography>
              <Paper elevation={1} sx={{ p: 4, mb: 4, bgcolor: 'grey.50' }}>
                <Typography variant="body1" lineHeight={1.8} fontWeight="medium">
                  {questions[currentQuestion].text}
                </Typography>
              </Paper>
              <Box textAlign="center">
                {preparationTime > 0 && !isRecording && !hasRecorded && (
                  <Stack spacing={2} alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <TimerIcon color="warning" />
                      <Typography variant="h5" color="warning.main" fontWeight="bold">
                        {preparationTime}s
                      </Typography>
                    </Stack>
                    <Typography color="warning.main" variant="body2">
                      Preparation time remaining
                    </Typography>
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={handleStartPreparation}
                      sx={{ px: 4 }}
                    >
                      Start Preparation
                    </Button>
                  </Stack>
                )}
                {preparationTime === 0 && !isRecording && !hasRecorded && (
                  <Button
                    variant="contained"
                    color="error"
                    size="large"
                    startIcon={<MicIcon />}
                    onClick={handleStartRecording}
                    sx={{ px: 6, py: 2 }}
                  >
                    Start Recording ({questions[currentQuestion].recordingTime}s)
                  </Button>
                )}
                {isRecording && (
                  <Stack spacing={2} alignItems="center">
                    <RecordingIndicator>
                      <MicIcon sx={{ color: 'white', fontSize: 32 }} />
                    </RecordingIndicator>
                    <Typography color="error.main" fontWeight="medium">
                      Recording in progress...
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Speak clearly and naturally
                    </Typography>
                    <LinearProgress
                      variant="indeterminate"
                      sx={{ width: '100%', maxWidth: 256, borderRadius: 4 }}
                    />
                  </Stack>
                )}
                {hasRecorded && !showFeedback && (
                  <Stack spacing={2} alignItems="center">
                    <Typography color="success.main" fontWeight="primary">
                      ✅ Recording Complete!
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleGetAIFeedback}
                      sx={{ px: 4 }}
                    >
                      Get AI Feedback
                    </Button>
                  </Stack>
                )}
              </Box>
            </CardContent>
          </StyledCard>
          {showFeedback && (
            <StyledCard sx={{ mt: 4 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="medium" mb={3}>
                  🤖 AI Feedback
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                  {[
                    { label: 'Overall', score: mockFeedback.overallScore, color: 'primary' },
                    { label: 'Pronunciation', score: mockFeedback.pronunciation, color: 'success' },
                    { label: 'Fluency', score: mockFeedback.fluency, color: 'warning' },
                    { label: 'Content', score: mockFeedback.content, color: 'info' },
                  ].map((item) => (
                    <Box key={item.label} sx={{ flex: { xs: '1 1 45%', sm: '1 1 22%' } }}>
                      <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: `${item.color}.light` }}>
                        <Typography variant="h6" color={`${item.color}.main`} fontWeight="bold">
                          {item.score}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.label}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                </Box>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                      ✅ Strengths:
                    </Typography>
                    <List dense>
                      {mockFeedback.feedback.map((item, index) => (
                        <ListItem key={index} disablePadding>
                          <ListItemText
                            primaryTypographyProps={{ variant: 'body2' }}
                            primary={
                              <Stack direction="row" alignItems="flex-start" spacing={1}>
                                <Typography color="success.main">•</Typography>
                                <span>{item}</span>
                              </Stack>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                      💡 Areas for Improvement:
                    </Typography>
                    <List dense>
                      {mockFeedback.improvements.map((item, index) => (

                        <ListItem key={index} disablePadding>
                          <ListItemText
                            primaryTypographyProps={{ variant: 'body2' }}
                            primary={
                              <Stack direction="row" alignItems="flex-start" spacing={1}>
                                <Typography color="warning.main">•</Typography>
                                <span>{item}</span>
                              </Stack>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Stack>
                <Box mt={4} textAlign="center">
                  {currentQuestion < questions.length - 1 ? (
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleNextQuestion}
                      endIcon={<ArrowForwardIcon />}
                      sx={{ px: 4 }}
                    >
                      Next Question
                    </Button>
                  ) : (
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                      <Button
                        component={RouterLink}
                        to="/practice-tests"
                        variant="contained"
                        color="secondary"
                        sx={{ px: 4 }}
                      >
                        Back to Practice
                      </Button>
                      <Button
                        component={RouterLink}
                        to="/progress"
                        variant="contained"
                        color="success"
                        sx={{ px: 4 }}
                      >
                        View Progress
                      </Button>
                    </Stack>
                  )}
                </Box>
              </CardContent>
            </StyledCard>
          )}
        </Box>

        {/* Instructions Panel */}
        <Box sx={{ flex: { md: 1 }, width: { xs: '100%', md: '33%' } }}>
          <StyledCard sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>
            <CardContent>
              <Typography variant="h6" fontWeight="medium" mb={3}>
                📝 Instructions
              </Typography>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="medium" mb={1}>
                    Task Overview:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Read the text aloud as naturally as possible.
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="medium" mb={1}>
                    Time Allocation:
                  </Typography>
                  <List dense>
                    <ListItem disablePadding>
                      <ListItemText primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}>
                        • Preparation: 40 seconds
                      </ListItemText>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}>
                        • Recording: 40 seconds
                      </ListItemText>
                    </ListItem>
                  </List>
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="medium" mb={1}>
                    Tips:
                  </Typography>
                  <List dense>
                    {['Speak at a natural pace', 'Pronounce words clearly', 'Use appropriate intonation', "Don't rush or speak too slowly"].map((item) => (
                      <ListItem key={item} disablePadding>
                        <ListItemText primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}>
                          • {item}
                        </ListItemText>
                      </ListItem>
                    ))}
                  </List>
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="medium" mb={1}>
                    Scoring:
                  </Typography>
                  <List dense>
                    {['Content: Reading all words', 'Pronunciation: Accuracy', 'Fluency: Natural rhythm'].map((item) => (
                      <ListItem key={item} disablePadding>
                        <ListItemText primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}>
                          • {item}
                        </ListItemText>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Stack>
            </CardContent>
          </StyledCard>
        </Box>
      </Box>
    </Container>
  );
};

export default ReadAloud;