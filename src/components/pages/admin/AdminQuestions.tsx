import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Tab,
  Tabs,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip
} from '@mui/material';
import {
  CloudUpload,
  Add,
  Edit,
  Delete,
  Download,
  FilterList
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { BaseQuestion } from '../../../types';
import CustomButton from '../../common/CustomButton';
import CustomCard from '../../common/CustomCard';
import { PTE_SKILLS } from '../../constants';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminQuestions: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);

  // Mock questions data
  const [questions] = useState<BaseQuestion[]>([
    {
      id: 'q1',
      type: 'read-aloud',
      skill: 'speaking',
      title: 'Climate Change Text',
      instructions: 'Read the text aloud naturally and clearly',
      difficulty: 'intermediate',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'q2',
      type: 'write-essay',
      skill: 'writing',
      title: 'Technology and Society',
      instructions: 'Write an essay on the given topic',
      difficulty: 'advanced',
      createdAt: '2024-01-14T10:00:00Z',
      updatedAt: '2024-01-14T10:00:00Z'
    }
  ]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles:any) => {
      if (acceptedFiles.length > 0) {
        setUploadFile(acceptedFiles[0]);
      }
    }
  });

  const handleUpload = async () => {
    if (!uploadFile) return;

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setUploadResult(`Successfully uploaded ${Math.floor(Math.random() * 20) + 5} questions from ${uploadFile.name}`);
      setUploadFile(null);
    }, 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'advanced': return 'error';
      case 'intermediate': return 'warning';
      case 'beginner': return 'success';
      default: return 'default';
    }
  };

  const getSkillColor = (skill: string) => {
    const skillObj = PTE_SKILLS.find((s:any)=> s?.skill === skill);
    return skillObj?.color || '#gray';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Question Management
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage practice questions and upload content
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Upload Questions" />
          <Tab label="Manage Questions" />
          <Tab label="Question Analytics" />
        </Tabs>
      </Paper>

      {/* Upload Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={4}>
          <Grid>
            <CustomCard title="Upload from Excel" icon={<CloudUpload />}>
              <Box
                {...getRootProps()}
                sx={{
                  border: '2px dashed',
                  borderColor: isDragActive ? 'primary.main' : 'grey.300',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  mb: 3,
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'grey.50'
                  }
                }}
              >
                <input {...getInputProps()} />
                <CloudUpload sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {isDragActive ? 'Drop the file here' : 'Drag & drop Excel file here'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  or click to select file (.xlsx, .xls)
                </Typography>
              </Box>

              {uploadFile && (
                <Box sx={{ mb: 3 }}>
                  <Alert severity="info">
                    Selected file: <strong>{uploadFile.name}</strong>
                  </Alert>
                </Box>
              )}

              {uploadResult && (
                <Box sx={{ mb: 3 }}>
                  <Alert severity="success">
                    {uploadResult}
                  </Alert>
                </Box>
              )}

              <Box display="flex" gap={2}>
                <CustomButton
                  variant="contained"
                  onClick={handleUpload}
                  disabled={!uploadFile || isUploading}
                  loading={isUploading}
                  loadingText="Uploading..."
                  startIcon={<CloudUpload />}
                >
                  Upload Questions
                </CustomButton>
                <CustomButton
                  variant="outlined"
                  startIcon={<Download />}
                >
                  Download Template
                </CustomButton>
              </Box>
            </CustomCard>
          </Grid>

          <Grid>
            <CustomCard title="Upload Instructions">
              <Typography variant="h6" gutterBottom>
                Excel File Format Requirements:
              </Typography>
              <Typography component="div" variant="body2" sx={{ mb: 2 }}>
                <ul>
                  <li>Column A: Question Type (read-aloud, write-essay, etc.)</li>
                  <li>Column B: Skill (speaking, writing, reading, listening)</li>
                  <li>Column C: Title</li>
                  <li>Column D: Instructions</li>
                  <li>Column E: Difficulty (beginner, intermediate, advanced)</li>
                  <li>Column F: Content (text, prompt, passage, etc.)</li>
                </ul>
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Supported Question Types:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['read-aloud', 'repeat-sentence', 'describe-image', 'write-essay', 'summarize-text', 'fill-blanks', 'multiple-choice'].map((type) => (
                  <Chip key={type} label={type} size="small" variant="outlined" />
                ))}
              </Box>
            </CustomCard>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Manage Questions Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box display="flex" gap={2}>
            <TextField
              size="small"
              placeholder="Search questions..."
              sx={{ minWidth: 200 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Skill</InputLabel>
              <Select label="Skill">
                <MenuItem value="">All</MenuItem>
                {PTE_SKILLS.map((skill:any) => (
                  <MenuItem key={skill.skill} value={skill.skill}>
                    {skill.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Difficulty</InputLabel>
              <Select label="Difficulty">
                <MenuItem value="">All</MenuItem>
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <CustomButton
            variant="contained"
            startIcon={<Add />}
          >
            Add Question
          </CustomButton>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Skill</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell>{question.title}</TableCell>
                  <TableCell>
                    <Chip label={question.type} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={question.skill} 
                      size="small" 
                      sx={{ bgcolor: getSkillColor(question.skill), color: 'white' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={question.difficulty} 
                      size="small" 
                      color={getDifficultyColor(question.difficulty) as any}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(question.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Analytics Tab */}
      <TabPanel value={tabValue} index={2}>
        <CustomCard>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Typography variant="h6">Question Analytics</Typography>
          </Box>
          <Alert severity="info">
            Analytics dashboard is under development. It will show:
            <ul>
              <li>Question performance metrics</li>
              <li>User completion rates</li>
              <li>Difficulty distribution</li>
              <li>Popular question types</li>
            </ul>
          </Alert>
        </CustomCard>
      </TabPanel>
    </Container>
  );
};

export default AdminQuestions;
