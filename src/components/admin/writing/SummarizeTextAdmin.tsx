import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import ExcelUpload from '../ExcelUpload';
import { SummarizeTextQuestion } from '../types';

const SummarizeTextAdmin: React.FC = () => {
  const [questions, setQuestions] = useState<SummarizeTextQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [selectedQuestion, setSelectedQuestion] = useState<SummarizeTextQuestion | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const templateFields = [
    'question_id',
    'passage',
    'word_limit',
    'time_limit',
    'sample_summary',
    'key_ideas',
    'difficulty',
  ];

  const sampleData = [
    {
      question_id: 'ST001',
      passage: 'Climate change is one of the most pressing challenges of our time. Rising global temperatures are causing ice caps to melt, sea levels to rise, and weather patterns to become increasingly unpredictable. Scientists worldwide agree that immediate action is necessary to mitigate these effects.',
      word_limit: 70,
      time_limit: 600,
      sample_summary: 'Climate change causes melting ice caps, rising sea levels, and unpredictable weather patterns, requiring immediate global action.',
      key_ideas: 'climate change, global warming, environmental impact, urgent action',
      difficulty: 'medium',
    },
    {
      question_id: 'ST002',
      passage: 'Artificial intelligence has revolutionized the way we interact with technology. From voice assistants to recommendation algorithms, AI systems are becoming increasingly sophisticated.',
      word_limit: 50,
      time_limit: 600,
      sample_summary: 'AI has transformed technology interaction through voice assistants and sophisticated recommendation systems.',
      key_ideas: 'artificial intelligence, technology, innovation, automation',
      difficulty: 'easy',
    },
  ];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const mockQuestions: SummarizeTextQuestion[] = [
        {
          id: '1',
          question_id: 'ST001',
          type: 'summarize-text',
          passage: 'Climate change is one of the most pressing challenges of our time...',
          word_limit: 70,
          time_limit: 600,
          sample_summary: 'Climate change causes melting ice caps...',
          key_ideas: ['climate change', 'global warming', 'environmental impact'],
          difficulty: 'medium',
          created_at: '2024-01-15T10:30:00Z',
          is_active: true,
        },
      ];
      
      setTimeout(() => {
        setQuestions(mockQuestions);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setLoading(false);
    }
  };

  const handleUpload = async (data: any[], fileName: string) => {
    try {
      // Process key_ideas field (convert comma-separated string to array)
      const processedData = data.map(item => ({
        ...item,
        key_ideas: typeof item.key_ideas === 'string' 
          ? item.key_ideas.split(',').map((idea: string) => idea.trim())
          : item.key_ideas || []
      }));

      console.log('Uploading data:', processedData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSnackbar({
        open: true,
        message: `Successfully uploaded ${data.length} questions from ${fileName}`,
        severity: 'success',
      });
      
      fetchQuestions();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Upload failed. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleEdit = (question: SummarizeTextQuestion) => {
    setSelectedQuestion(question);
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleView = (question: SummarizeTextQuestion) => {
    setSelectedQuestion(question);
    setEditMode(false);
    setDialogOpen(true);
  };

  const handleDelete = async (questionId: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        console.log('Deleting question:', questionId);
        setQuestions(questions.filter(q => q.id !== questionId));
        setSnackbar({
          open: true,
          message: 'Question deleted successfully',
          severity: 'success',
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to delete question',
          severity: 'error',
        });
      }
    }
  };

  const handleSave = async () => {
    if (!selectedQuestion) return;

    try {
      console.log('Saving question:', selectedQuestion);
      setDialogOpen(false);
      setSelectedQuestion(null);
      setSnackbar({
        open: true,
        message: 'Question saved successfully',
        severity: 'success',
      });
      fetchQuestions();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to save question',
        severity: 'error',
      });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Summarize Text Questions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedQuestion({
                id: '',
                question_id: '',
                type: 'summarize-text',
                passage: '',
                word_limit: 70,
                time_limit: 600,
                sample_summary: '',
                key_ideas: [],
                difficulty: 'medium',
              });
              setEditMode(true);
              setDialogOpen(true);
            }}
          >
            Add Question
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Questions List
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Question ID</TableCell>
                      <TableCell>Passage (Preview)</TableCell>
                      <TableCell>Word Limit</TableCell>
                      <TableCell>Time Limit</TableCell>
                      <TableCell>Difficulty</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {questions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell>{question.question_id}</TableCell>
                        <TableCell>
                          {question.passage.substring(0, 60)}
                          {question.passage.length > 60 ? '...' : ''}
                        </TableCell>
                        <TableCell>{question.word_limit} words</TableCell>
                        <TableCell>{Math.floor(question.time_limit / 60)} min</TableCell>
                        <TableCell>
                          <Chip
                            label={question.difficulty}
                            color={
                              question.difficulty === 'easy' ? 'success' :
                              question.difficulty === 'medium' ? 'warning' : 'error'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleView(question)} size="small">
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(question)} size="small">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(question.id)} size="small">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ width: { xs: '100%', lg: '400px' } }}>
          <ExcelUpload
            moduleType="writing"
            componentType="summarize-text"
            onUpload={handleUpload}
            templateFields={templateFields}
            sampleData={sampleData}
          />
        </Box>
      </Box>

      {/* Question Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editMode ? (selectedQuestion?.id ? 'Edit Question' : 'Add Question') : 'View Question'}
        </DialogTitle>
        <DialogContent>
          {selectedQuestion && (
            <Box sx={{ pt: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: 1, minWidth: '250px' }}>
                    <TextField
                      fullWidth
                      label="Question ID"
                      value={selectedQuestion.question_id}
                      onChange={(e) => setSelectedQuestion({
                        ...selectedQuestion,
                        question_id: e.target.value
                      })}
                      disabled={!editMode}
                    />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: '250px' }}>
                    <FormControl fullWidth disabled={!editMode}>
                      <InputLabel>Difficulty</InputLabel>
                      <Select
                        value={selectedQuestion.difficulty}
                        onChange={(e) => setSelectedQuestion({
                          ...selectedQuestion,
                          difficulty: e.target.value as 'easy' | 'medium' | 'hard'
                        })}
                      >
                        <MenuItem value="easy">Easy</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="hard">Hard</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Passage"
                    value={selectedQuestion.passage}
                    onChange={(e) => setSelectedQuestion({
                      ...selectedQuestion,
                      passage: e.target.value
                    })}
                    disabled={!editMode}
                    helperText="The text that students need to summarize"
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: 1, minWidth: '200px' }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Word Limit"
                      value={selectedQuestion.word_limit}
                      onChange={(e) => setSelectedQuestion({
                        ...selectedQuestion,
                        word_limit: parseInt(e.target.value)
                      })}
                      disabled={!editMode}
                      helperText="Maximum words allowed"
                    />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: '200px' }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Time Limit (seconds)"
                      value={selectedQuestion.time_limit}
                      onChange={(e) => setSelectedQuestion({
                        ...selectedQuestion,
                        time_limit: parseInt(e.target.value)
                      })}
                      disabled={!editMode}
                      helperText="Time allowed for completion"
                    />
                  </Box>
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Sample Summary"
                    value={selectedQuestion.sample_summary}
                    onChange={(e) => setSelectedQuestion({
                      ...selectedQuestion,
                      sample_summary: e.target.value
                    })}
                    disabled={!editMode}
                    helperText="Example of a good summary"
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="Key Ideas"
                    value={Array.isArray(selectedQuestion.key_ideas) 
                      ? selectedQuestion.key_ideas.join(', ')
                      : selectedQuestion.key_ideas
                    }
                    onChange={(e) => setSelectedQuestion({
                      ...selectedQuestion,
                      key_ideas: e.target.value.split(',').map(idea => idea.trim())
                    })}
                    disabled={!editMode}
                    helperText="Key concepts separated by commas"
                  />
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            {editMode ? 'Cancel' : 'Close'}
          </Button>
          {editMode && (
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SummarizeTextAdmin;