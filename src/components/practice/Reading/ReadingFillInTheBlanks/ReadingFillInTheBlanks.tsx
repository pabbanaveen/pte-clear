import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { Close, Timer, DragIndicator } from '@mui/icons-material';
import { DndContext, closestCenter, DragEndEvent, useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import ActionButtons from '../../common/ActionButtons';
import NavigationSection from '../../common/NavigationSection';
import QuestionHeader from '../../common/QuestionHeader';
import StageGoalBanner from '../../common/StageGoalBanner';
import { ReadingPassage, QuestionResult, BlankPosition, WordBankWord, TimerState } from './ReadingFillInTheBlanksTypes';
import { mockReadingPassages, mockStudentProgress } from './ReadingFillInTheBlanksMockData';
import TopicSelectionDrawer from '../../../common/TopicSelectionDrawer';

interface ReadingFillBlanksProps {}

const ReadingFillBlanks: React.FC<ReadingFillBlanksProps> = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [passage, setPassage] = useState<ReadingPassage>(mockReadingPassages[currentQuestionIndex]);
  const [showFillinBlanksSelector, setShowFillinBlanksSelector] = useState(false);

  // State management
  const [blanks, setBlanks] = useState<BlankPosition[]>(passage.blanks.map(blank => ({ ...blank })));
  const [wordBank, setWordBank] = useState<WordBankWord[]>(passage.wordBank.map(word => ({ ...word })));
  const [timer, setTimer] = useState<TimerState>({
    timeRemaining: passage.timeLimit,
    isRunning: true,
    warningThreshold: 30,
    autoSubmit: true,
  });
  const [showAnswer, setShowAnswer] = useState(false);
  const [showTranslate, setShowTranslate]= useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentResult, setCurrentResult] = useState<QuestionResult | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date>(new Date());

  // Validate mock data on mount
  useEffect(() => {
    mockReadingPassages.forEach((p, idx) => {
      const blankIds = new Set(p.blanks.map(b => b.id));
      const wordIds = new Set(p.wordBank.map(w => w.id));
      if (blankIds.size !== p.blanks.length) {
        console.warn(`Duplicate blank IDs in passage ${idx + 1}`);
      }
      if (wordIds.size !== p.wordBank.length) {
        console.warn(`Duplicate word IDs in passage ${idx + 1}`);
      }
      p.blanks.forEach(b => {
        if (!p.wordBank.some(w => w.word === b.correctAnswer)) {
          console.warn(`Correct answer "${b.correctAnswer}" for blank ${b.id} not found in word bank for passage ${idx + 1}`);
        }
      });
    });
  }, []);

  // Sync state when passage changes
  useEffect(() => {
    setBlanks(passage.blanks.map(blank => ({ ...blank })));
    setWordBank(passage.wordBank.map(word => ({ ...word })));
    setTimer({
      timeRemaining: passage.timeLimit,
      isRunning: true,
      warningThreshold: 30,
      autoSubmit: true,
    });
    setIsSubmitted(false);
    setShowResults(false);
    setCurrentResult(null);
    startTimeRef.current = new Date();
  }, [passage]);

  // Timer functionality
  useEffect(() => {
    if (timer.isRunning && timer.timeRemaining > 0 && !isSubmitted) {
      timerRef.current = setTimeout(() => {
        setTimer(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
      }, 1000);
    } else if (timer.timeRemaining === 0 && timer.autoSubmit && !isSubmitted) {
      handleSubmit();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timer.timeRemaining, timer.isRunning, isSubmitted]);

  const [results, setResults] = useState<QuestionResult[]>([]);
  const studentProgress = mockStudentProgress;

  const handleNext = () => {
    if (currentQuestionIndex < mockReadingPassages.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      setPassage(mockReadingPassages[newIndex]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);
      setPassage(mockReadingPassages[newIndex]);
    }
  };

  const handleSearch = () => {
    console.log('Search functionality triggered');
    setShowFillinBlanksSelector(true);
  };

  const handleFillinBlankSelect = (option: any) => {
    const newIndex = mockReadingPassages.findIndex(p => p.id === option.id);
    if (newIndex !== -1) {
      setCurrentQuestionIndex(newIndex);
      setPassage(option);
    }
    setShowFillinBlanksSelector(false);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const areAllBlanksFilled = useCallback((): boolean => {
    return blanks.every(blank => blank.filledWord && blank.filledWord.trim() !== '');
  }, [blanks]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const sourceId = active.id as string;
    const destinationId = over.id as string;

    console.log('Drag End:', { sourceId, destinationId });

    // From Word Bank to Blank
    if (sourceId.startsWith('word_') && destinationId.startsWith('blank_')) {
      const word = wordBank.find(w => w.id === sourceId);
      if (!word || word.isUsed) return;

      setBlanks(prev => {
        const newBlanks = [...prev];
        const blankIndex = newBlanks.findIndex(b => b.id === destinationId);
        if (blankIndex !== -1) {
          const blank = newBlanks[blankIndex];
          if (blank.filledWord) {
            setWordBank(prevWords => {
              const newWords = [...prevWords];
              const wordIdx = newWords.findIndex(w => w.word === blank.filledWord);
              if (wordIdx !== -1) {
                newWords[wordIdx] = { ...newWords[wordIdx], isUsed: false };
              }
              return newWords;
            });
          }
          newBlanks[blankIndex] = { ...blank, filledWord: word.word };
        }
        return newBlanks;
      });

      setWordBank(prev => {
        const newWords = [...prev];
        const wordIdx = newWords.findIndex(w => w.id === sourceId);
        if (wordIdx !== -1) {
          newWords[wordIdx] = { ...newWords[wordIdx], isUsed: true };
        }
        return newWords;
      });
    }

    // From Blank to Word Bank
    if (sourceId.startsWith('filled_') && destinationId === 'wordBank') {
      const blankId = sourceId.replace('filled_', '');
      const blankIndex = blanks.findIndex(b => b.id === blankId);

      if (blankIndex !== -1) {
        const blank = blanks[blankIndex];
        if (blank.filledWord) {
          setWordBank(prev => {
            const newWords = [...prev];
            const wordIdx = newWords.findIndex(w => w.word === blank.filledWord);
            if (wordIdx !== -1) {
              newWords[wordIdx] = { ...newWords[wordIdx], isUsed: false };
            }
            return newWords;
          });

          setBlanks(prev => {
            const newBlanks = [...prev];
            newBlanks[blankIndex] = { ...newBlanks[blankIndex], filledWord: undefined };
            return newBlanks;
          });
        }
      }
    }
  };

  const handleSubmit = () => {
    if (isSubmitted) return;

    setIsSubmitted(true);
    setTimer(prev => ({ ...prev, isRunning: false }));

    const endTime = new Date();
    const timeSpent = Math.floor((endTime.getTime() - startTimeRef.current.getTime()) / 1000);

    let correctAnswers = 0;
    const evaluatedBlanks = blanks.map(blank => {
      const isCorrect = blank.filledWord?.toLowerCase().trim() === blank.correctAnswer.toLowerCase().trim();
      if (isCorrect) correctAnswers++;
      return { ...blank, isCorrect };
    });

    const score = Math.round((correctAnswers / blanks.length) * passage.maxScore);

    const result: QuestionResult = {
      questionId: String(passage?.id),
      score,
      maxScore: passage.maxScore,
      correctAnswers,
      totalBlanks: blanks.length,
      completedAt: endTime,
      timeSpent,
      answers: evaluatedBlanks,
    };

    setBlanks(evaluatedBlanks);
    setCurrentResult(result);
    setShowResults(true);
    setResults(prev => [...prev, result]);
  };

  const handleRedo = () => {
    setBlanks(passage.blanks.map(blank => ({ ...blank })));
    setWordBank(passage.wordBank.map(word => ({ ...word })));
    setTimer({
      timeRemaining: passage.timeLimit,
      isRunning: true,
      warningThreshold: 30,
      autoSubmit: true,
    });
    setIsSubmitted(false);
    setShowResults(false);
    setCurrentResult(null);
    startTimeRef.current = new Date();
  };

  const questionNumber = studentProgress.questionNumber + currentQuestionIndex;

  // Custom Droppable component for blanks
  const DroppableBlank = ({ blank }: { blank: BlankPosition }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: blank.id,
    });

    return (
      <Box
        ref={setNodeRef}
        component="span"
        sx={{
          display: 'inline-flex',
          minWidth: '120px',
          minHeight: '32px',
          mx: 0.5,
          px: 1,
          py: 0.5,
          border: `2px ${isOver ? 'solid' : 'dashed'} ${
            blank.isCorrect === true ? '#4caf50' :
            blank.isCorrect === false ? '#f44336' :
            isOver ? '#2196f3' : '#ccc'
          }`,
          borderRadius: 1,
          backgroundColor: isOver ? '#e3f2fd' :
                         blank.isCorrect === true ? '#e8f5e9' :
                         blank.isCorrect === false ? '#ffebee' : '#fafafa',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          pointerEvents: 'auto',
        }}
      >
        {blank.filledWord ? (
          <DraggableWord word={blank.filledWord} id={`filled_${blank.id}`} isCorrect={blank.isCorrect} />
        ) : (
          <Typography variant="body2" color="textSecondary">
            Drop here
          </Typography>
        )}
      </Box>
    );
  };

  // Custom Draggable component for words
  const DraggableWord = ({ word, id, isCorrect }: { word: string; id: string; isCorrect?: boolean }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id,
    });

    const style = {
      transform: transform ? CSS.Transform.toString(transform) : undefined,
      backgroundColor: isCorrect === true ? '#4caf50' :
                       isCorrect === false ? '#f44336' :
                       isDragging ? '#1976d2' : '#2196f3',
    };

    return (
      <Box
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        sx={{
          px: 1,
          py: 0.5,
          color: 'white',
          borderRadius: 1,
          fontSize: '14px',
          fontWeight: 'medium',
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          cursor: 'grab',
          userSelect: 'none',
          pointerEvents: 'auto',
          ...style,
        }}
      >
        <DragIndicator sx={{ fontSize: '16px' }} />
        {word}
      </Box>
    );
  };

  // Custom Droppable component for word bank
  const DroppableWordBank = () => {
    const { setNodeRef, isOver } = useDroppable({
      id: 'wordBank',
    });

    return (
      <Box
        ref={setNodeRef}
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          minHeight: '60px',
          p: 2,
          border: `2px ${isOver ? 'solid' : 'dashed'} ${isOver ? '#2196f3' : '#ccc'}`,
          borderRadius: 1,
          backgroundColor: isOver ? '#e3f2fd' : '#fafafa',
          pointerEvents: 'auto',
        }}
      >
        {wordBank
          .filter(word => !word.isUsed)
          .map((word, index) => (
            <DraggableWord key={word.id} word={word.word} id={word.id} />
          ))}
        {wordBank.filter(word => !word.isUsed).length === 0 && (
          <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
            All words have been used
          </Typography>
        )}
      </Box>
    );
  };

  const renderTextWithBlanks = () => {
    let textParts = passage.text.split(/(\[BLANK_\d+\])/);
    
    return textParts.map((part, index) => {
      const blankMatch = part.match(/\[BLANK_(\d+)\]/);
      if (blankMatch) {
        const blankIndex = parseInt(blankMatch[1]);
        const blank = blanks.find(b => b.position === blankIndex);
        if (blank) {
          return <DroppableBlank key={blank.id} blank={blank} />;
        }
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', p: 2, pointerEvents: 'auto' }}>
      <StageGoalBanner />

      <Card sx={{ maxWidth: 1200, mx: 'auto', mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                bgcolor: '#2196f3',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              FIB
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Reading: Fill in the Blanks
                </Typography>
                <Chip label="Study Guide" color="primary" size="small" />
                <Chip 
                  label={passage.difficulty} 
                  color={
                    passage.difficulty === 'Beginner' ? 'success' :
                    passage.difficulty === 'Intermediate' ? 'warning' : 'error'
                  } 
                  size="small" 
                />
              </Stack>
              <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                {passage.instructions}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <QuestionHeader 
            questionNumber={questionNumber}
            studentName={studentProgress.studentName}
            testedCount={studentProgress.testedCount}
          />

          <Paper sx={{ p: 2, mb: 3, bgcolor: timer.timeRemaining <= timer.warningThreshold ? '#ffebee' : '#e3f2fd' }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Timer sx={{ color: timer.timeRemaining <= timer.warningThreshold ? '#f44336' : '#2196f3' }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold',
                  color: timer.timeRemaining <= timer.warningThreshold ? '#f44336' : '#2196f3'
                }}
              >
                Time: {formatTime(timer.timeRemaining)}
              </Typography>
              {timer.timeRemaining <= timer.warningThreshold && (
                <Chip label="Hurry Up!" color="error" size="small" />
              )}
            </Stack>
          </Paper>

          <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                {passage.title}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  lineHeight: 1.8,
                  fontSize: '16px',
                  textAlign: 'justify',
                }}
              >
                {renderTextWithBlanks()}
              </Typography>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Word Bank
              </Typography>
              <DroppableWordBank />
            </Paper>
          </DndContext>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Progress: {blanks.filter(b => b.filledWord).length} of {blanks.length} blanks filled
            </Typography>
            <Box sx={{ 
              width: '100%', 
              height: 8, 
              backgroundColor: '#e0e0e0', 
              borderRadius: 1,
              overflow: 'hidden',
            }}>
              <Box sx={{
                width: `${(blanks.filter(b => b.filledWord).length / blanks.length) * 100}%`,
                height: '100%',
                backgroundColor: '#4caf50',
                transition: 'width 0.3s ease',
              }} />
            </Box>
          </Box>

          <ActionButtons
            hasResponse={areAllBlanksFilled()}
            onSubmit={handleSubmit}
            onRedo={handleRedo}
            onTranslate={() => setShowTranslate(true)}
            onShowAnswer={() => setShowAnswer(true)}
            recordedBlob={null}
          />

          <NavigationSection
            onSearch={handleSearch}
            onPrevious={handlePrevious}
            onNext={handleNext}
            questionNumber={questionNumber}
          />
        </CardContent>
      </Card>

      <TopicSelectionDrawer
        open={showFillinBlanksSelector}
        onClose={() => setShowFillinBlanksSelector(false)}
        onSelect={handleFillinBlankSelect}
        topics={mockReadingPassages}
        title="Reading：Fill in the Blanks"
        type="lecture"
      />

      <Dialog open={showResults} onClose={() => setShowResults(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Quiz Results</Typography>
            <IconButton onClick={() => setShowResults(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {currentResult && (
            <Box>
              <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
                <Chip 
                  label={`Score: ${currentResult.score}/${currentResult.maxScore}`} 
                  color={currentResult.score >= (currentResult.maxScore * 0.7) ? 'success' : 'error'}
                  size="medium"
                />
                <Chip 
                  label={`${currentResult.correctAnswers}/${currentResult.totalBlanks} Correct`} 
                  color="info"
                  size="medium"
                />
                <Chip 
                  label={`Time: ${Math.floor(currentResult.timeSpent / 60)}:${(currentResult.timeSpent % 60).toString().padStart(2, '0')}`} 
                  color="default"
                  size="medium"
                />
              </Stack>
              <Typography variant="h6" sx={{ mb: 2 }}>Answer Review:</Typography>
              {currentResult.answers.map((answer, index) => (
                <Box key={answer.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Blank {answer.position + 1}:
                    </Typography>
                    <Chip 
                      label={answer.filledWord || 'Not filled'} 
                      color={answer.isCorrect ? 'success' : 'error'}
                      size="small"
                    />
                    <Typography variant="body2" color="textSecondary">
                      Correct answer: {answer.correctAnswer}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResults(false)}>Close</Button>
          <Button variant="contained" onClick={handleRedo}>Try Again</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showAnswer} onClose={() => setShowAnswer(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Correct Answers</Typography>
            <IconButton onClick={() => setShowAnswer(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Passage:</strong> {passage.title}
          </Typography>
          {blanks.map((blank, index) => (
            <Box key={blank.id} sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Blank {blank.position + 1}:</strong> {blank.correctAnswer}
              </Typography>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAnswer(false)}>Close</Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
};

export default ReadingFillBlanks;