import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  Stack,
  Paper,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  LinearProgress
} from '@mui/material';
import { Close } from '@mui/icons-material';
import ActionButtons from '../../common/ActionButtons';
import NavigationSection from '../../common/NavigationSection';
import QuestionHeader from '../../common/QuestionHeader';
import StageGoalBanner from '../../common/StageGoalBanner';
import { emailScenarios } from './emailMockData';
import { EmailScenario } from './emailTypes';
import { User } from '../../../../types/user';
import TopicSelectionDrawer from '../../../common/TopicSelectionDrawer';


interface WriteEmailProps {
  user?: User | null;
}

const WriteEmail: React.FC<WriteEmailProps> = ({ user }) => {
  // State management
  const [selectedScenario, setSelectedScenario] = useState<EmailScenario>(emailScenarios[0]);
  const [userEmail, setUserEmail] = useState<string>('');
  const [wordCount, setWordCount] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(540); // 9 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [questionNumber, setQuestionNumber] = useState<number>(67);
  const [studentName] = useState<string>('Rachel Carson');
  const [testedCount] = useState<number>(33);
  const [score, setScore] = useState<number | null>(null);
  
  // Dialog states
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [showTranslate, setShowTranslate] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showScenarioSelector, setShowScenarioSelector] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Word counting function
  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // Handle email input change
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const text = event.target.value;
    setUserEmail(text);
    setWordCount(countWords(text));
  };

  // Timer functionality
  useEffect(() => {
    if (isTimerActive && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleAutoSubmit();
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isTimerActive, timeRemaining]);

  // Start timer when user starts typing
  useEffect(() => {
    if (userEmail.length > 0 && !isTimerActive) {
      setIsTimerActive(true);
    }
  }, [userEmail, isTimerActive]);

  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const getProgressPercentage = (): number => {
    return ((540 - timeRemaining) / 540) * 100;
  };

  // Email scoring algorithm
  const calculateEmailScore = (emailText: string, scenario: EmailScenario): number => {
    let score = 0;
    const words = emailText.toLowerCase().split(/\s+/);
    const wordCount = words.length;
    
    // Word count scoring (30 points)
    if (wordCount >= scenario.wordLimit.min) {
      score += 30;
    } else {
      score += Math.round((wordCount / scenario.wordLimit.min) * 30);
    }
    
    // Email structure scoring (25 points)
    const hasGreeting = /dear|hello|hi|greetings/i.test(emailText);
    const hasClosing = /sincerely|regards|best|thank you|yours/i.test(emailText);
    const hasParagraphs = emailText.split('\n\n').length >= 2;
    
    if (hasGreeting) score += 8;
    if (hasClosing) score += 8;
    if (hasParagraphs) score += 9;
    
    // Key points coverage (35 points)
    const keyPointsCovered = scenario.keyPoints.filter(point => {
      const keywords = point.toLowerCase().match(/\b\w+\b/g) || [];
      return keywords.some(keyword => 
        keyword.length > 3 && emailText.toLowerCase().includes(keyword)
      );
    }).length;
    
    score += Math.round((keyPointsCovered / scenario.keyPoints.length) * 35);
    
    // Professional tone (10 points)
    const professionalWords = ['please', 'thank', 'appreciate', 'would', 'could', 'kindly'];
    const professionalCount = professionalWords.filter(word => 
      emailText.toLowerCase().includes(word)
    ).length;
    score += Math.min(professionalCount * 2, 10);
    
    return Math.min(score, 100);
  };

  // Handle submission
  const handleSubmit = (): void => {
    if (wordCount < selectedScenario.wordLimit.min) {
      alert(`Please ensure your email is at least ${selectedScenario.wordLimit.min} words.`);
      return;
    }
    
    const calculatedScore = calculateEmailScore(userEmail, selectedScenario);
    setScore(calculatedScore);
    setIsTimerActive(false);
    
    alert(`Email submitted successfully! Score: ${calculatedScore}/100`);
    
    // Move to next question
    setTimeout(() => {
      handleNext();
    }, 2000);
  };

  // Handle auto submit when timer expires
  const handleAutoSubmit = (): void => {
    if (userEmail.trim()) {
      const calculatedScore = calculateEmailScore(userEmail, selectedScenario);
      setScore(calculatedScore);
      alert(`Time's up! Auto-submitted. Score: ${calculatedScore}/100`);
    } else {
      alert("Time's up! No email submitted.");
    }
    setIsTimerActive(false);
  };

  // Action handlers
  const handleRedo = (): void => {
    setUserEmail('');
    setWordCount(0);
    setTimeRemaining(540);
    setIsTimerActive(false);
    setScore(null);
  };

  const handleShowAnswer = (): void => {
    setShowAnswer(true);
  };

  const handleTranslate = (): void => {
    setShowTranslate(true);
  };

  const handleSearch = (): void => {
    setShowSearch(true);
  };

  const handlePrevious = (): void => {
    if (questionNumber > 1) {
      setQuestionNumber(prev => prev - 1);
      handleRedo();
    }
  };

  const handleNext = (): void => {
    setShowScenarioSelector(true);
  };

  // Handle scenario selection
  const handleScenarioSelect = (scenario: any) => {
    setSelectedScenario(scenario);
    setQuestionNumber(prev => prev + 1);
    setShowScenarioSelector(false);
    handleRedo();
  };

  // Filter scenarios for search
  const filteredScenarios = emailScenarios.filter(scenario =>
    scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scenario.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scenario.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get word count status color
  const getWordCountColor = (): string => {
    if (wordCount === 0) return '#666';
    if (wordCount < selectedScenario.wordLimit.min) return '#ff9800';
    return '#4caf50';
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', p: { xs: 1, sm: 2 } }}>
      {/* Stage Goal Banner */}
      <StageGoalBanner />

      {/* Main Content */}
      <Card sx={{ maxWidth: 1200, mx: 'auto', mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          {/* Header */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            alignItems={{ xs: 'flex-start', sm: 'center' }} 
            spacing={2} 
            sx={{ mb: 3 }}
          >
            <Box
              sx={{
                width: { xs: 50, sm: 55, md: 60 },
                height: { xs: 50, sm: 55, md: 60 },
                bgcolor: '#4caf50',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: { xs: '12px', sm: '14px', md: '16px' },
                fontWeight: 'bold',
                flexShrink: 0,
                lineHeight: 1.2
              }}
            >
              WE<br/>Core
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: '#333',
                    fontSize: { xs: '18px', sm: '20px', md: '24px' },
                    lineHeight: 1.3,
                    wordBreak: 'break-word'
                  }}
                >
                  Write Email
                </Typography>
                <Chip onClick={() => { }} label="Study Guide" color="primary" size="small" />
              </Stack>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#666', 
                  mt: 1,
                  fontSize: { xs: '12px', sm: '13px', md: '14px' },
                  lineHeight: 1.5,
                  wordBreak: 'break-word'
                }}
              >
                Read a description of a situation. Then write an email about the situation. You will have 9 minutes. 
                You should aim to write at least 100 words. Write using complete sentences.
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Question Header */}
          <QuestionHeader 
            questionNumber={questionNumber}
            studentName={studentName}
            testedCount={testedCount}
          />

          {/* Timer and Progress */}
          <Paper 
            sx={{ 
              p: { xs: 1.5, sm: 2 }, 
              mb: 3, 
              bgcolor: timeRemaining < 60 ? '#ffebee' : '#e8f5e8' 
            }}
          >
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              alignItems={{ xs: 'flex-start', sm: 'center' }} 
              spacing={2}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  color: timeRemaining < 60 ? '#f44336' : '#4caf50', 
                  fontWeight: 'bold',
                  fontSize: { xs: '16px', sm: '18px', md: '20px' },
                  flexShrink: 0
                }}
              >
                Time: {formatTime(timeRemaining)}
              </Typography>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <LinearProgress
                  variant="determinate"
                  value={getProgressPercentage()}
                  sx={{
                    height: { xs: 6, sm: 8 },
                    borderRadius: 4,
                    bgcolor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: timeRemaining < 60 ? '#f44336' : '#4caf50',
                    },
                  }}
                />
              </Box>
              {score && (
                <Chip 
                onClick={() => { }}
                  label={`Score: ${score}/100`} 
                  color={score >= 70 ? 'success' : score >= 50 ? 'warning' : 'error'} 
                  size="small"
                  sx={{ flexShrink: 0 }}
                />
              )}
            </Stack>
          </Paper>

          {/* Scenario Display */}
          <Paper 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              mb: 3, 
              bgcolor: '#fafafa' 
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#333', 
                mb: 2, 
                fontWeight: 'bold',
                fontSize: { xs: '16px', sm: '18px', md: '20px' },
                wordBreak: 'break-word'
              }}
            >
              #{questionNumber} {selectedScenario.title}
            </Typography>
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                mb: 2,
                flexWrap: 'wrap',
                gap: 1
              }}
            >
              <Chip onClick={() => { }} label={selectedScenario.category} size="small" color="primary" />
              <Chip 
              onClick={() => { }}
                label={selectedScenario.difficulty} 
                size="small" 
                color={
                  selectedScenario.difficulty === 'Beginner' ? 'success' : 
                  selectedScenario.difficulty === 'Intermediate' ? 'warning' : 'error'
                }
              />
            </Stack>
            
            <Typography 
              variant="body1" 
              sx={{ 
                lineHeight: 1.8, 
                color: '#333',
                fontSize: { xs: '14px', sm: '15px', md: '16px' },
                wordBreak: 'break-word',
                mb: 2
              }}
            >
              {selectedScenario.situation}
            </Typography>

            {/* Key Points */}
            <Box sx={{ mt: 2 }}>
              {selectedScenario.keyPoints.map((point, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{
                    color: '#d32f2f',
                    mb: 1,
                    fontSize: { xs: '13px', sm: '14px', md: '15px' },
                    fontWeight: 500,
                    pl: 1,
                    borderLeft: '3px solid #d32f2f'
                  }}
                >
                  - {point}
                </Typography>
              ))}
            </Box>
          </Paper>

          {/* Email Input */}
          <Paper 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              mb: 3 
            }}
          >
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              alignItems={{ xs: 'flex-start', sm: 'center' }} 
              justifyContent="space-between" 
              sx={{ mb: 2 }}
              spacing={{ xs: 1, sm: 0 }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#333',
                  fontSize: { xs: '16px', sm: '18px', md: '20px' }
                }}
              >
                Your Email:
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: getWordCountColor(),
                  fontWeight: 'bold',
                  fontSize: { xs: '14px', sm: '15px', md: '16px' }
                }}
              >
                Word Count: {wordCount}
              </Typography>
            </Stack>
            
            {wordCount > 0 && wordCount < selectedScenario.wordLimit.min && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: { xs: '13px', sm: '14px' } }}>
                  Your email should be at least {selectedScenario.wordLimit.min} words. Current count: {wordCount}
                </Typography>
              </Alert>
            )}
            
            <TextField
              fullWidth
              multiline
            //   rows={{ xs: 8, sm: 10, md: 12 }}
              value={userEmail}
              onChange={handleEmailChange}
              placeholder="Write your email here..."
              disabled={timeRemaining === 0}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: { xs: '14px', sm: '15px', md: '16px' },
                  lineHeight: 1.6,
                },
                '& .MuiInputBase-input': {
                  resize: 'vertical'
                }
              }}
            />
          </Paper>

          {/* Action Buttons */}
          <ActionButtons
                      hasResponse={userEmail.trim().length > 0}
                      onSubmit={handleSubmit}
                      onRedo={handleRedo}
                      onTranslate={handleTranslate}
                      onShowAnswer={handleShowAnswer}
                       recordedBlob={null}          />

          {/* Navigation Section */}
          <NavigationSection
            onSearch={handleSearch}
            onPrevious={handlePrevious}
            onNext={handleNext}
            questionNumber={questionNumber}
          />
        </CardContent>
      </Card>

      {/* Scenario Selection Dialog */}
      {/* <Dialog 
        open={showScenarioSelector} 
        onClose={() => setShowScenarioSelector(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Select Email Scenario</Typography>
            <IconButton onClick={() => setShowScenarioSelector(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <List>
            {emailScenarios.map((scenario) => (
              <ListItem key={scenario.id} disablePadding>
                <ListItemButton 
                  onClick={() => handleScenarioSelect(scenario)}
                  selected={selectedScenario.id === scenario.id}
                >
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {scenario.title}
                        </Typography>
                        <Chip 
                          label={scenario.difficulty} 
                          size="small" 
                          color={
                            scenario.difficulty === 'Beginner' ? 'success' : 
                            scenario.difficulty === 'Intermediate' ? 'warning' : 'error'
                          }
                        />
                      </Stack>
                    }
                    secondary={
                      <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                        <Typography variant="caption">
                          <strong>Category:</strong> {scenario.category}
                        </Typography>
                        <Typography variant="caption">
                          <strong>Min Words:</strong> {scenario.wordLimit.min}+
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog> */}

<TopicSelectionDrawer
        open={showScenarioSelector}
        onClose={() => setShowScenarioSelector(false)}
        onSelect={handleScenarioSelect}
        topics={emailScenarios}
        title="Select Email Scenario"
        type="lecture"
      />


      {/* Answer Dialog */}
      <Dialog open={showAnswer} onClose={() => setShowAnswer(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Sample Email</Typography>
            <IconButton onClick={() => setShowAnswer(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Scenario:</strong> {selectedScenario.title}
          </Typography>
          <Paper sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                lineHeight: 1.6, 
                whiteSpace: 'pre-line',
                fontFamily: 'monospace',
                fontSize: '14px'
              }}
            >
              {selectedScenario.sampleEmail}
            </Typography>
          </Paper>
          <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
            Word count: {countWords(selectedScenario.sampleEmail)} words
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAnswer(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Translation Dialog */}
      <Dialog open={showTranslate} onClose={() => setShowTranslate(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Translation Options</Typography>
            <IconButton onClick={() => setShowTranslate(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Language</InputLabel>
            <Select defaultValue="spanish" label="Select Language">
              <MenuItem value="spanish">Spanish</MenuItem>
              <MenuItem value="french">French</MenuItem>
              <MenuItem value="german">German</MenuItem>
              <MenuItem value="chinese">Chinese</MenuItem>
              <MenuItem value="japanese">Japanese</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Translation feature will help you understand the email scenario in your preferred language.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTranslate(false)}>Cancel</Button>
          <Button variant="contained">Translate</Button>
        </DialogActions>
      </Dialog>

      {/* Search Dialog */}
      <Dialog open={showSearch} onClose={() => setShowSearch(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Search Email Scenarios</Typography>
            <IconButton onClick={() => setShowSearch(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Search by title, category, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
          />
          <List>
            {filteredScenarios.map((scenario) => (
              <ListItem key={scenario.id} disablePadding>
                <ListItemButton 
                  onClick={() => {
                    handleScenarioSelect(scenario);
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                >
                  <ListItemText
                    primary={scenario.title}
                    secondary={`${scenario.category} • ${scenario.difficulty}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSearch(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WriteEmail;