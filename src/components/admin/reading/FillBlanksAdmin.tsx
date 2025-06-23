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
import { ReadingFillBlanksQuestion } from '../../../types';

const FillBlanksAdmin: React.FC = () => {
  const [questions, setQuestions] = useState<ReadingFillBlanksQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [selectedQuestion, setSelectedQuestion] = useState<ReadingFillBlanksQuestion | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const templateFields = [
    'question_id',
    'passage',
    'blanks_json',
    'time_limit',
    'difficulty',
  ];

  const sampleData = [
    {
      question_id: 'RFB001',
      passage: 'The rapid advancement of technology has _____ the way we communicate. Social media platforms have become _____ tools for connecting people across the globe.',
      blanks_json: JSON.stringify([
        {
          id: 'blank1',
          position: 1,
          options: ['transformed', 'destroyed', 'simplified', 'complicated'],
          correct_answer: 'transformed'
        },
        {
          id: 'blank2', 
          position: 2,
          options: ['essential', 'harmful', 'useless', 'outdated'],
          correct_answer: 'essential'
        }
      ]),
      time_limit: 600,
      difficulty: 'medium',
    },
  ];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const mockQuestions: ReadingFillBlanksQuestion[] = [
        {
            id: '1',
            question_id: 'RFB001',
            type: 'reading-fill-blanks',
            passage: 'The rapid advancement of technology has _____ the way we communicate...',
            blanks: [
                {
                    id: 'blank1',
                    position: 1,
                    options: ['transformed', 'destroyed', 'simplified'],
                    correctAnswer: 'transformed'
                }
            ],
            time_limit: 600,
            difficulty: 'intermediate',
            createdAt: '2024-01-15T10:30:00Z',
            skill: 'reading',
            title: '',
            instructions: '',
            updatedAt: ''
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
      // Process blanks_json field
      const processedData = data.map(item => ({
        ...item,
        blanks: typeof item.blanks_json === 'string' 
          ? JSON.parse(item.blanks_json)
          : item.blanks_json || []
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
        message: 'Upload failed. Please check the blanks_json format.',
        severity: 'error',
      });
    }
  };

  const handleEdit = (question: ReadingFillBlanksQuestion) => {
    setSelectedQuestion(question);
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleView = (question: ReadingFillBlanksQuestion) => {
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
          Reading Fill in Blanks Questions
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
                type: 'reading-fill-blanks',
                passage: '',
                blanks: [],
                time_limit: 600,
                difficulty: 'intermediate',
                skill: 'reading',
                title: '',
                instructions: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                // is_active: true,
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
                      <TableCell>Blanks Count</TableCell>
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
                          {question.passage.substring(0, 50)}
                          {question.passage.length > 50 ? '...' : ''}
                        </TableCell>
                        <TableCell>{question.blanks.length} blanks</TableCell>
                        <TableCell>{Math.floor(question.time_limit / 60)} min</TableCell>
                        <TableCell>
                          <Chip
                            label={question.difficulty}
                            color={
                              question.difficulty === 'beginner' ? 'success' :
                              question.difficulty === 'advanced' ? 'warning' : 'error'
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
            moduleType="reading"
            componentType="fill-blanks"
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
                          difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced'
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
                    rows={4}
                    label="Passage"
                    value={selectedQuestion.passage}
                    onChange={(e) => setSelectedQuestion({
                      ...selectedQuestion,
                      passage: e.target.value
                    })}
                    disabled={!editMode}
                    helperText="Use _____ to indicate blank spaces"
                  />
                </Box>
                <Box>
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
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Blanks Configuration (JSON)"
                    value={JSON.stringify(selectedQuestion.blanks, null, 2)}
                    onChange={(e) => {
                      try {
                        const blanks = JSON.parse(e.target.value);
                        setSelectedQuestion({
                          ...selectedQuestion,
                          blanks
                        });
                      } catch (error) {
                        // Invalid JSON, don't update
                      }
                    }}
                    disabled={!editMode}
                    helperText="JSON array with blank configurations: [{id, position, options[], correct_answer}]"
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

export default FillBlanksAdmin;