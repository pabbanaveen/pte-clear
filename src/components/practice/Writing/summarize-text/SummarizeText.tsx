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

// Import common components
import ActionButtons from '../../common/ActionButtons';
import NavigationSection from '../../common/NavigationSection';
import QuestionHeader from '../../common/QuestionHeader';
import StageGoalBanner from '../../common/StageGoalBanner';
import { textPassages } from './textPassages';
import { User } from '../../../../types/user';
import TopicSelectionDrawer from '../../../common/TopicSelectionDrawer';

// Import mock data
interface SummarizeTextProps {
  user: User | null;
}
const SummarizeText = ({ user }:SummarizeTextProps) => {
  // State management
  const [selectedPassage, setSelectedPassage] = useState(textPassages[0]);
  const [userResponse, setUserResponse] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(73);
  const [studentName] = useState('Rachel Carson');
  const [testedCount] = useState(33);
  const [score, setScore] = useState<number | null>(null);
  
  // Dialog states
  const [showAnswer, setShowAnswer] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showPassageSelector, setShowPassageSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Word counting function
  const countWords = (text:string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // Handle text input change
  const handleResponseChange = (event:any) => {
    const text = event.target.value;
    setUserResponse(text);
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
    if (userResponse.length > 0 && !isTimerActive) {
      setIsTimerActive(true);
    }
  }, [userResponse, isTimerActive]);

  // Format time for display
  const formatTime = (seconds:any) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const getProgressPercentage = () => {
    return ((600 - timeRemaining) / 600) * 100;
  };

  // Simple scoring algorithm
  const calculateScore = (userText:string, sampleAnswer:string) => {
    const userWords = userText.toLowerCase().split(/\s+/);
    const sampleWords = sampleAnswer.toLowerCase().split(/\s+/);
    
    // Check word count compliance
    const wordCountScore = (wordCount >= 25 && wordCount <= 50) ? 30 : 10;
    
    // Simple keyword matching
    const keywordMatches = userWords.filter(word => 
      sampleWords.some(sampleWord => 
        sampleWord.includes(word) || word.includes(sampleWord)
      )
    ).length;
    
    const keywordScore = Math.min((keywordMatches / sampleWords.length) * 50, 50);
    
    // Length appropriateness
    const lengthScore = userText.length > 100 ? 20 : 10;
    
    return Math.round(wordCountScore + keywordScore + lengthScore);
  };

  // Handle submission
  const handleSubmit = () => {
    if (wordCount < 25 || wordCount > 50) {
      alert('Please ensure your summary is between 25 and 50 words.');
      return;
    }
    
    const calculatedScore = calculateScore(userResponse, selectedPassage.sampleAnswer);
    setScore(calculatedScore);
    setIsTimerActive(false);
    
    alert(`Summary submitted successfully! Score: ${calculatedScore}/100`);
    
    // Move to next question
    setTimeout(() => {
      handleNext();
    }, 2000);
  };

  // Handle auto submit when timer expires
  const handleAutoSubmit = () => {
    if (userResponse.trim()) {
      const calculatedScore = calculateScore(userResponse, selectedPassage.sampleAnswer);
      setScore(calculatedScore);
      alert(`Time's up! Auto-submitted. Score: ${calculatedScore}/100`);
    } else {
      alert("Time's up! No response submitted.");
    }
    setIsTimerActive(false);
  };

  // Action handlers
  const handleRedo = () => {
    setUserResponse('');
    setWordCount(0);
    setTimeRemaining(600);
    setIsTimerActive(false);
    setScore(null);
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleTranslate = () => {
    setShowTranslate(true);
  };

  const handleSearch = () => {
    setShowSearch(true);
  };

  const handlePrevious = () => {
    if (questionNumber > 1) {
      setQuestionNumber(prev => prev - 1);
      handleRedo();
    }
  };

  const handleNext = () => {
    setShowPassageSelector(true);
  };

  // Handle passage selection
  const handlePassageSelect = (passage:any) => {
    setSelectedPassage(passage);
    setQuestionNumber(prev => prev + 1);
    setShowPassageSelector(false);
    handleRedo();
  };

  // Filter passages for search
  const filteredPassages = textPassages.filter(passage =>
    passage.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    passage.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    passage.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get word count status color
  const getWordCountColor = () => {
    if (wordCount === 0) return '#666';
    if (wordCount < 25) return '#ff9800';
    if (wordCount > 50) return '#f44336';
    return '#4caf50';
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', p: 2 }}>
      {/* Stage Goal Banner */}
      <StageGoalBanner />

      {/* Main Content */}
      <Card sx={{ maxWidth: 1200, mx: 'auto', mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                bgcolor: '#4caf50',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              SWT<br/>Core
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Summarize Written Text (Core)
                </Typography>
                <Chip label="Study Guide" color="primary" size="small" />
              </Stack>
              <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                Read the passage below. Summarize the passage using between 25 and 50 words. 
                Type your response in the box at the bottom of the screen. You have 10 minutes to finish this task. 
                Your response will be judged on the quality of your writing and on how well your response presents the key points in the passage.
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
          <Paper sx={{ p: 2, mb: 3, bgcolor: timeRemaining < 60 ? '#ffebee' : '#e8f5e8' }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h6" sx={{ color: timeRemaining < 60 ? '#f44336' : '#4caf50', fontWeight: 'bold' }}>
                Time: {formatTime(timeRemaining)}
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={getProgressPercentage()}
                  sx={{
                    height: 8,
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
                  label={`Score: ${score}/100`} 
                  color={score >= 70 ? 'success' : score >= 50 ? 'warning' : 'error'} 
                />
              )}
            </Stack>
          </Paper>

          {/* Passage Display */}
          <Paper sx={{ p: 3, mb: 3, bgcolor: '#fafafa' }}>
            <Typography variant="h6" sx={{ color: '#333', mb: 2, fontWeight: 'bold' }}>
              #{questionNumber} {selectedPassage.title}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip label={selectedPassage.category} size="small" color="primary" />
              <Chip 
                label={selectedPassage.difficulty} 
                size="small" 
                color={
                  selectedPassage.difficulty === 'Beginner' ? 'success' : 
                  selectedPassage.difficulty === 'Intermediate' ? 'warning' : 'error'
                }
              />
            </Stack>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>
              {selectedPassage.passage}
            </Typography>
          </Paper>

          {/* Response Input */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#333' }}>
                Your Response:
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: getWordCountColor(),
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                Word Count: {wordCount}
              </Typography>
            </Stack>
            
            {wordCount > 0 && (wordCount < 25 || wordCount > 50) && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Your summary must be between 25 and 50 words. Current count: {wordCount}
              </Alert>
            )}
            
            <TextField
              fullWidth
              multiline
              rows={6}
              value={userResponse}
              onChange={handleResponseChange}
              placeholder="Type your summary here..."
              disabled={timeRemaining === 0}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '16px',
                  lineHeight: 1.6,
                },
              }}
            />
          </Paper>

          {/* Action Buttons */}
          <ActionButtons
                      hasResponse={userResponse.trim().length > 0}
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

      {/* Passage Selection Dialog */}
      {/* <Dialog 
        open={showPassageSelector} 
        onClose={() => setShowPassageSelector(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Select Text Passage</Typography>
            <IconButton onClick={() => setShowPassageSelector(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <List>
            {textPassages.map((passage) => (
              <ListItem key={passage.id} disablePadding>
                <ListItemButton 
                  onClick={() => handlePassageSelect(passage)}
                  selected={selectedPassage.id === passage.id}
                >
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {passage.title}
                        </Typography>
                        <Chip 
                          label={passage.difficulty} 
                          size="small" 
                          color={
                            passage.difficulty === 'Beginner' ? 'success' : 
                            passage.difficulty === 'Intermediate' ? 'warning' : 'error'
                          }
                        />
                      </Stack>
                    }
                    secondary={
                      <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                        <Typography variant="caption">
                          <strong>Category:</strong> {passage.category}
                        </Typography>
                        <Typography variant="caption">
                          <strong>Words:</strong> {passage.wordLimit.min}-{passage.wordLimit.max}
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
        open={showPassageSelector}
        onClose={() => setShowPassageSelector(false)}
        onSelect={handlePassageSelect}
        topics={textPassages}
        title="Summarize Written Text (Core)"
        type="lecture"
      />

      {/* Answer Dialog */}
      <Dialog open={showAnswer} onClose={() => setShowAnswer(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Sample Answer</Typography>
            <IconButton onClick={() => setShowAnswer(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Topic:</strong> {selectedPassage.title}
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.6, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            {selectedPassage.sampleAnswer}
          </Typography>
          <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
            Word count: {countWords(selectedPassage.sampleAnswer)} words
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
            Translation feature will help you understand the passage content in your preferred language.
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
            <Typography variant="h6">Search Passages</Typography>
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
            {filteredPassages.map((passage) => (
              <ListItem key={passage.id} disablePadding>
                <ListItemButton 
                  onClick={() => {
                    handlePassageSelect(passage);
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                >
                  <ListItemText
                    primary={passage.title}
                    secondary={`${passage.category} • ${passage.difficulty}`}
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

export default SummarizeText;