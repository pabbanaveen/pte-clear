import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container, Box, Typography, Card, CardContent, Button, Select, MenuItem,
  FormControl, InputLabel, LinearProgress, Grid, Divider, Chip, Alert,
  List, ListItem, ListItemText, Paper, Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface BlankAnswer {
  id: number;
  userAnswer: string;
  correctAnswer: string;
  options: string[];
}

interface Question {
  id: number;
  title: string;
  text: string;
  blanks: BlankAnswer[];
}

// Define props for FeedbackCard to include isCorrect
interface FeedbackCardProps {
  isCorrect: boolean;
}

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

  const questions: Question[] = [
    {
      id: 1,
      title: "Renewable Energy Sources",
      text: "Solar energy has become increasingly _____(1)_____ as a renewable energy source in recent years. The technology has _____(2)_____ significantly, making it more _____(3)_____ for both residential and commercial applications. Many governments are now _____(4)_____ substantial investments in solar infrastructure to reduce their carbon _____(5)_____.",
      blanks: [
        {
            id: 1, correctAnswer: "popular", options: ["popular", "expensive", "dangerous", "complicated"],
            userAnswer: ''
        },
        {
            id: 2, correctAnswer: "improved", options: ["improved", "declined", "stagnated", "disappeared"],
            userAnswer: ''
        },
        {
            id: 3, correctAnswer: "affordable", options: ["affordable", "difficult", "unreliable", "temporary"],
            userAnswer: ''
        },
        {
            id: 4, correctAnswer: "making", options: ["making", "avoiding", "preventing", "reducing"],
            userAnswer: ''
        },
        {
            id: 5, correctAnswer: "footprint", options: ["footprint", "emissions", "pollution", "waste"],
            userAnswer: ''
        }
      ]
    },
    {
      id: 2,
      title: "Artificial Intelligence in Healthcare",
      text: "Artificial intelligence is _____(1)_____ the healthcare industry in unprecedented ways. Machine learning algorithms can now _____(2)_____ medical images with greater _____(3)_____ than human doctors in some cases. This technology has the _____(4)_____ to revolutionize medical diagnosis and _____(5)_____ patient outcomes significantly.",
      blanks: [
        {
            id: 1, correctAnswer: "transforming", options: ["transforming", "destroying", "limiting", "complicating"],
            userAnswer: ''
        },
        {
            id: 2, correctAnswer: "analyze", options: ["analyze", "ignore", "delete", "corrupt"],
            userAnswer: ''
        },
        {
            id: 3, correctAnswer: "accuracy", options: ["accuracy", "difficulty", "confusion", "delay"],
            userAnswer: ''
        },
        {
            id: 4, correctAnswer: "potential", options: ["potential", "inability", "restriction", "disadvantage"],
            userAnswer: ''
        },
        {
            id: 5, correctAnswer: "improve", options: ["improve", "worsen", "maintain", "ignore"],
            userAnswer: ''
        }
      ]
    }
  ];

  useEffect(() => {
    const currentQ = questions[currentQuestion];
    const initialAnswers = currentQ.blanks.map(blank => ({
      id: blank.id,
      userAnswer: '',
      correctAnswer: blank.correctAnswer,
      options: blank.options
    }));
    setAnswers(initialAnswers);
  }, [currentQuestion]);

  useEffect(() => {
    if (isStarted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isStarted]);

  const handleAnswerChange = (blankId: number, value: string) => {
    setAnswers(prev => prev.map(answer => 
      answer.id === blankId ? { ...answer, userAnswer: value } : answer
    ));
  };

  const handleSubmit = () => {
    setShowFeedback(true);
  };

  const calculateScore = (): number => {
    const correctAnswers = answers.filter(answer => 
      answer.userAnswer.toLowerCase() === answer.correctAnswer.toLowerCase()
    ).length;
    return Math.round((correctAnswers / answers.length) * 100);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowFeedback(false);
      setTimeLeft(600);
      setIsStarted(false);
    }
  };

  const renderTextWithBlanks = () => {
    const currentQ = questions[currentQuestion];
    const parts = currentQ.text.split(/_____\(\d+\)_____/);
    const blanks = currentQ.text.match(/_____\(\d+\)_____/g) || [];
    
    const result: React.ReactNode[] = [];
    for (let i = 0; i < parts.length; i++) {
      result.push(<span key={`text-${i}`}>{parts[i]}</span>);
      if (i < blanks.length) {
        const blankNum = parseInt(blanks[i].match(/\d+/)?.[0] || '0');
        const answer = answers.find(a => a.id === blankNum);
        
        result.push(
          <FormControl
            key={`blank-${blankNum}`}
            size="small"
            sx={{ mx: 1, minWidth: 120 }}
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
              {answer?.options.map(option => (
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
      {/* Header */}
      <Box mb={4}>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Button
            component={RouterLink}
            to="/practice-tests"
            color="primary"
            startIcon="←"
          >
            Back to Practice
          </Button>
          <Divider orientation="vertical" flexItem />
          <Typography variant="h4" fontWeight="bold">
            Reading: Fill in the Blanks
          </Typography>
        </Stack>
        <Typography color="text.secondary">
          Select the most appropriate word for each blank to complete the text.
        </Typography>
      </Box>

      {/* Progress and Timer */}
      <Box mb={4}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="caption" color="text.secondary">
            Question {currentQuestion + 1} of {questions.length}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip onClick={() => { }} label="Reading • Fill in the Blanks" size="small" />
            <Stack direction="row" alignItems="center" spacing={1}>
              <TimerIcon color={timeLeft < 120 ? 'error' : 'primary'} />
              <Typography color={timeLeft < 120 ? 'error.main' : 'primary.main'}>
                {formatTime(timeLeft)}
              </Typography>
            </Stack>
            {!isStarted && (
              <Button
                variant="contained"
                size="small"
                onClick={() => setIsStarted(true)}
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
      <Grid container spacing={4}>
        {/* Question Panel */}
        <Grid container>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" fontWeight="medium" mb={4}>
                {questions[currentQuestion].title}
              </Typography>

              {/* Text with Blanks */}
              <Paper elevation={1} sx={{ p: 4, mb: 4, bgcolor: 'grey.50' }}>
                <Typography variant="body1" lineHeight={1.8}>
                  {renderTextWithBlanks()}
                </Typography>
              </Paper>

              {/* Submit Button */}
              {!showFeedback && (
                <Box textAlign="center">
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={handleSubmit}
                    disabled={answers.some(answer => !answer.userAnswer)}
                  >
                    Submit Answers
                  </Button>
                  {answers.some(answer => !answer.userAnswer) && (
                    <Typography variant="caption" color="text.secondary" mt={2} display="block">
                            Please fill in all blanks before submitting
                    </Typography>
                  )}
                </Box>
              )}

              {/* Feedback */}
              {showFeedback && (
                <Stack spacing={4}>
                  {/* Score */}
                  <Paper elevation={2} sx={{ p: 4, textAlign: 'center', bgcolor: 'primary.light' }}>
                    <Typography variant="h3" color="primary" fontWeight="bold">
                      {calculateScore()}%
                    </Typography>
                    <Typography color="text.secondary">
                      {answers.filter(a => a.userAnswer.toLowerCase() === a.correctAnswer.toLowerCase()).length} out of {answers.length} correct
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

                  {/* Next Question Button */}
                  <Box textAlign="center">
                    {currentQuestion < questions.length - 1 ? (
                      <Button
                        variant="contained"
                        size="large"
                        onClick={handleNextQuestion}
                        endIcon="→"
                      >
                        Next Question
                      </Button>
                    ) : (
                      <Stack direction="row" spacing={2} justifyContent="center">
                        <Button
                          component={RouterLink}
                          to="/practice-tests"
                          variant="contained"
                          color="secondary"
                        >
                          Back to Practice
                        </Button>
                        <Button
                          component={RouterLink}
                          to="/progress"
                          variant="contained"
                          color="success"
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
        </Grid>

        {/* Instructions Panel */}
        <Grid>
          <StyledCard sx={{ position: 'sticky', top: 24 }}>
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
                    Choose the most appropriate word from the dropdown menu for each blank.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight="medium" mb={1}>
                    Strategy Tips:
                  </Typography>
                  <List dense>
                    {['Read the entire text first', 'Consider grammar and meaning', 'Look for contextual clues', 'Check subject-verb agreement', 'Consider collocations'].map((tip) => (
                      <ListItem key={tip} disablePadding>
                        <ListItemText primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}>
                          • {tip}
                        </ListItemText>
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight="medium" mb={1}>
                    What to Consider:
                  </Typography>
                  <List dense>
                    {['Parts of speech', 'Logical meaning', 'Grammatical correctness', 'Sentence flow', 'Overall coherence'].map((item) => (
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
                    {['1 point per correct answer', 'No negative marking', 'All blanks must be filled'].map((item) => (
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
        </Grid>
      </Grid>
    </Container>
  );
};

export default FillInBlanks;
