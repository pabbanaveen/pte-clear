import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container, Box, Typography, Card, CardContent, Button,
  Chip, Paper, Stack, List, ListItem, ListItemText, LinearProgress
} from '@mui/material';
import { styled, Theme } from '@mui/material/styles';
import TimerIcon from '@mui/icons-material/Timer';
import MicIcon from '@mui/icons-material/Mic';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { questions, mockFeedback } from './constants';


const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: Number(theme.shape.borderRadius) * 2, // Type-safe conversion
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

const DescribeImage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [hasRecorded, setHasRecorded] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [preparationTime, setPreparationTime] = useState<number>(25);

  

  useEffect(() => {
    if (preparationTime > 0) {
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
  }, [preparationTime]);

  const handleStartPreparation = () => {
    setPreparationTime(25);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setHasRecorded(true);
    }, 40000);
  };

  const handleGetAIFeedback = () => {
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setHasRecorded(false);
      setShowFeedback(false);
      setPreparationTime(25);
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
            Describe Image
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
          Describe the image in detail. You have 25 seconds to prepare and 40 seconds to speak.
        </Typography>
      </Box>

      {/* Progress */}
      <Box mb={4}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} mb={2} spacing={1}>
          <Typography variant="caption" color="text.secondary">
            Question {currentQuestion + 1} of {questions.length}
          </Typography>
          <Chip onClick={() => { }} label="Speaking • Describe Image" size="small" />
        </Stack>
        <LinearProgress
          variant="determinate"
          value={((currentQuestion + 1) / questions.length) * 100}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Image Panel */}
        <Box sx={{ flex: { md: 1 }, width: { xs: '100%', md: '50%' } }}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" fontWeight="medium" mb={3}>
                {questions[currentQuestion].title}
              </Typography>
              <Box mb={4}>
                <img
                  src={questions[currentQuestion].image}
                  alt={questions[currentQuestion].title}
                  style={{ width: '100%', height: 'auto', borderRadius: 8, border: '1px solid', borderColor: 'grey.200' }}
                />
              </Box>
              <Box textAlign="center">
                {preparationTime > 0 && (
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
                    Start Recording (40s)
                  </Button>
                )}
                {isRecording && (
                  <Stack spacing={2} alignItems="center">
                    <RecordingIndicator>
                      <MicIcon sx={{ color: 'white', fontSize: 32 }} />
                    </RecordingIndicator>
                    <Typography color="error.main" fontWeight="medium">
                      Recording... Describe the image
                    </Typography>
                    <LinearProgress
                      variant="indeterminate"
                      sx={{ width: '100%', maxWidth: 256, borderRadius: 4 }}
                    />
                  </Stack>
                )}
                {hasRecorded && !showFeedback && (
                  <Stack spacing={2} alignItems="center">
                    <Typography color="success.main" fontWeight="medium">
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
        </Box>

        {/* Instructions and Feedback Panel */}
        <Box sx={{ flex: { md: 1 }, width: { xs: '100%', md: '50%' } }}>
          {!showFeedback ? (
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
                      Describe the image including all relevant details, trends, and key information.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="medium" mb={1}>
                      What to Include:
                    </Typography>
                    <List dense>
                      {['Type of chart/diagram', 'Main trends or patterns', 'Key data points', 'Comparisons between elements', 'Overall conclusion'].map((item) => (
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
                      Useful Phrases:
                    </Typography>
                    <List dense>
                      {['"This chart shows..."', '"The highest/lowest point is..."', '"There is an increase/decrease in..."', '"In comparison to..."', '"Overall, the data indicates..."'].map((item) => (
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
                      Scoring Criteria:
                    </Typography>
                    <List dense>
                      {['Content: Completeness and accuracy', 'Pronunciation: Clear articulation', 'Fluency: Natural speech flow', 'Vocabulary: Appropriate word choice'].map((item) => (
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
          ) : (
            <StyledCard>
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
                <Paper elevation={1} sx={{ p: 3, mb: 4, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" fontWeight="medium" mb={2}>
                    Content Elements Covered:
                  </Typography>
                  <List dense>
                    {mockFeedback.contentElements.map((item, index) => (
                      <ListItem key={index} disablePadding>
                        <ListItemText
                          primaryTypographyProps={{ variant: 'body2' }}
                          primary={
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <CheckCircleIcon color="success" fontSize="small" />
                              <span>{item}</span>
                            </Stack>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
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
      </Box>
    </Container>
  );
};

export default DescribeImage;