import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    Chip,
    LinearProgress
} from '@mui/material';
import { Close } from '@mui/icons-material';
import TopicSelectionDrawer from '../../../common/TopicSelectionDrawer';
import ActionButtons from '../../common/ActionButtons';
import NavigationSection from '../../common/NavigationSection';
import QuestionHeader from '../../common/QuestionHeader';
import StageGoalBanner from '../../common/StageGoalBanner';
import TextToSpeech from '../../common/TextToSpeech';
import { allSummarizeSpokenTextTopics } from './SummarizeSpokenTextMockData';
import { SummarizeSpokenTextTopic, SummaryResponse } from './SummarizeSpokenTextType';

const SummarizeSpokenText: React.FC = () => {
    // State management
    const [selectedTopic, setSelectedTopic] = useState<SummarizeSpokenTextTopic>(allSummarizeSpokenTextTopics[0]);
    const [showTopicSelector, setShowTopicSelector] = useState(false);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [summaryText, setSummaryText] = useState<string>('');
    const [wordCount, setWordCount] = useState<number>(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [showTranslate, setShowTranslate] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number>(0); // in seconds
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [audioError, setAudioError] = useState<string | null>(null);

    // Performance tracking
    const [responses, setResponses] = useState<SummaryResponse[]>([]);
    const [currentTaskStartTime, setCurrentTaskStartTime] = useState<number>(Date.now());

    // Student info
    const [studentName] = useState('Rachel Carson');
    const [testedCount] = useState(33);

    // Refs
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize timer and reset state when topic changes
    useEffect(() => {
        setTimeLeft(selectedTopic.timeLimit * 60); // Convert minutes to seconds
        setCurrentTaskStartTime(Date.now());
        setSummaryText('');
        setWordCount(0);
        setIsSubmitted(false);
        setShowAnswer(false);
        setAudioError(null);

        // Clear existing timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        // Start new timer
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    // Time's up - auto submit
                    if (!isSubmitted) {
                        handleSubmit();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [selectedTopic.id]);

    // Format time display
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle text change and word count
    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!isSubmitted) {
            const text = event.target.value;
            setSummaryText(text);

            // Count words (split by whitespace and filter empty strings)
            const words = text.trim().split(/\s+/).filter(word => word.length > 0);
            setWordCount(words.length);
        }
    };

    // Handle topic selection
    const handleTopicSelect = (topic: any) => {
        // Convert to SummarizeSpokenTextTopic if needed
        const sstTopic = topic as SummarizeSpokenTextTopic;
        setSelectedTopic(sstTopic);
        setQuestionNumber(allSummarizeSpokenTextTopics.findIndex(t => t.id === sstTopic.id) + 1);
    };

    // Handle submit
    const handleSubmit = () => {
        if (summaryText.trim().length === 0 && !isSubmitted) {
            //     alert('Please write a summary before submitting.');
            return;
        }

        if (wordCount < selectedTopic.wordLimit.min || wordCount > selectedTopic.wordLimit.max) {
            const message = `Please ensure your summary is between ${selectedTopic.wordLimit.min}-${selectedTopic.wordLimit.max} words. Current word count: ${wordCount}`;
            alert(message);
            return;
        }

        // Stop the timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        const timeSpent = Math.floor((Date.now() - currentTaskStartTime) / 1000);

        // Create response object
        const newResponse: SummaryResponse = {
            text: summaryText,
            wordCount,
            timeSpent,
            isSubmitted: true
        };

        // Update responses
        setResponses(prev => {
            const existingIndex = prev.findIndex(r => r.text === summaryText);
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = newResponse;
                return updated;
            }
            return [...prev, newResponse];
        });

        setIsSubmitted(true);

        // Show success message
        setTimeout(() => {
            alert(`Summary submitted successfully!\nWord count: ${wordCount}\nTime spent: ${formatTime(timeSpent)}`);
        }, 500);
    };

    // Handle re-do
    const handleRedo = () => {
        setSummaryText('');
        setWordCount(0);
        setIsSubmitted(false);
        setShowAnswer(false);
        setTimeLeft(selectedTopic.timeLimit * 60);
        setCurrentTaskStartTime(Date.now());

        // Restart timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    if (!isSubmitted) {
                        handleSubmit();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Navigation handlers
    const handlePrevious = () => {
        if (questionNumber > 1) {
            const prevTopic = allSummarizeSpokenTextTopics[questionNumber - 2];
            handleTopicSelect(prevTopic);
        }
    };

    const handleNext = () => {
        if (questionNumber < allSummarizeSpokenTextTopics.length) {
            const nextTopic = allSummarizeSpokenTextTopics[questionNumber];
            handleTopicSelect(nextTopic);
        } else {
            setShowTopicSelector(true);
        }
    };

    // Dialog handlers
    const handleShowAnswer = () => setShowAnswer(true);
    const handleTranslate = () => setShowTranslate(true);
    const handleSearch = () => setShowTopicSelector(true);

    // Filter topics for search
    const filteredTopics = allSummarizeSpokenTextTopics.filter(topic =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Get word count color based on limits
    const getWordCountColor = (): string => {
        if (wordCount < selectedTopic.wordLimit.min) return '#ff9800'; // Orange for too few
        if (wordCount > selectedTopic.wordLimit.max) return '#f44336'; // Red for too many
        return '#4caf50'; // Green for correct range
    };

    const correctAnswers = responses.filter(r => r.isSubmitted).length;

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
                            SST
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                                    Summarize Spoken Text (PTEA)
                                </Typography>
                                <Chip label="Study Guide" color="primary" size="small" onClick={() => {}} />
                            </Stack>
                            <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                                You will hear a short report. Write a summary for a fellow student who was not present. You should write 50-70 words.
                                You have 10 minutes to finish this task. Your response will be judged on the quality of your writing and on how well
                                your response presents the key points presented in the lecture.
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

                    {/* Timer Display */}
                    <Paper sx={{ p: 2, mb: 3, bgcolor: timeLeft < 120 ? '#ffebee' : '#f9f9f9' }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: timeLeft < 120 ? '#d32f2f' : '#ff5722',
                                    fontWeight: 'bold'
                                }}
                            >
                                Remain: {formatTime(timeLeft)}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                                Task Time: {selectedTopic.timeLimit} minutes
                            </Typography>
                        </Stack>
                        <LinearProgress
                            variant="determinate"
                            value={((selectedTopic.timeLimit * 60 - timeLeft) / (selectedTopic.timeLimit * 60)) * 100}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: '#e0e0e0',
                                '& .MuiLinearProgress-bar': {
                                    bgcolor: timeLeft < 120 ? '#d32f2f' : '#ff5722',
                                },
                            }}
                        />
                    </Paper>

                    {/* Text-to-Speech Player */}
                    <TextToSpeech
                        text={selectedTopic.audioText}
                        autoPlay={false}
                        onStart={() => console.log('Audio started')}
                        onEnd={() => console.log('Audio ended')}
                        onError={(error) => setAudioError(error)}
                    />

                    {audioError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {audioError}
                        </Alert>
                    )}

                    {/* Text Input Area */}
                    <Paper sx={{ p: 3, mb: 3, bgcolor: '#fafafa' }}>
                        <Stack spacing={2}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                                    Write your summary:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: getWordCountColor(),
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Word Count: {wordCount} ({selectedTopic.wordLimit.min}-{selectedTopic.wordLimit.max} words required)
                                </Typography>
                            </Stack>

                            <TextField
                                multiline
                                rows={8}
                                placeholder="Type your summary here..."
                                value={summaryText}
                                onChange={handleTextChange}
                                disabled={isSubmitted}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: isSubmitted ? '#f5f5f5' : 'white',
                                    }
                                }}
                                fullWidth
                            />

                            <Stack direction="row" spacing={1}>
                                <Chip
                                    label={selectedTopic.difficulty}
                                    size="small"
                                    color={
                                        selectedTopic.difficulty === 'Beginner' ? 'success' :
                                            selectedTopic.difficulty === 'Intermediate' ? 'warning' : 'error'
                                    }
                                    onClick={() => { }}
                                />
                                <Chip
                                    label={selectedTopic.category}
                                    size="small"
                                    variant="outlined"
                                    onClick={() => { }}
                                />
                            </Stack>
                        </Stack>
                    </Paper>

                    {/* Submission Result Card - Shows after submission */}
                    {isSubmitted && (
                        <Paper sx={{ p: 3, mb: 3, bgcolor: '#e8f5e9' }}>
                            <Stack spacing={2}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: '#2e7d32',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    ✅ Summary Submitted Successfully!
                                    <Chip
                                        label={`${wordCount} words`}
                                        size="small"
                                        color="success"
                                        onClick={() => {}}
                                    />
                                </Typography>

                                <Typography variant="body2" sx={{
                                    lineHeight: 1.6,
                                    bgcolor: 'rgba(255,255,255,0.7)',
                                    p: 2,
                                    borderRadius: 1,
                                    border: '1px solid rgba(0,0,0,0.1)'
                                }}>
                                    <strong>Your Summary:</strong> {summaryText}
                                </Typography>
                            </Stack>
                        </Paper>
                    )}

                    {/* Action Buttons */}
                    <ActionButtons
                        hasResponse={isSubmitted || (summaryText.trim().length > 0 ? true : false)}
                        onSubmit={handleSubmit}
                        onRedo={handleRedo}
                        onTranslate={handleTranslate}
                        onShowAnswer={handleShowAnswer}
                        recordedBlob={null}
                    />

                    {/* Navigation Section */}
                    <NavigationSection
                        onSearch={handleSearch}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                        questionNumber={questionNumber}
                    />
                </CardContent>
            </Card>

            {/* Topic Selection Drawer */}
            <TopicSelectionDrawer
                open={showTopicSelector}
                onClose={() => setShowTopicSelector(false)}
                onSelect={handleTopicSelect}
                topics={allSummarizeSpokenTextTopics as any}
                title="Select SST Topic"
                type="listening"
            />

            {/* Answer Dialog */}
            <Dialog open={showAnswer} onClose={() => setShowAnswer(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">Sample Summary & Key Points</Typography>
                        <IconButton onClick={() => setShowAnswer(false)}>
                            <Close />
                        </IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                <strong>Topic:</strong> {selectedTopic.title}
                            </Typography>
                            <Typography variant="body2" sx={{ lineHeight: 1.6, bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                                <strong>Sample Summary:</strong> {selectedTopic.sampleSummary}
                            </Typography>
                        </Box>

                        {selectedTopic.keyPoints && (
                            <Box>
                                <Typography variant="h6" sx={{ mb: 2 }}>Key Points to Include:</Typography>
                                <List>
                                    {selectedTopic.keyPoints.map((point, index) => (
                                        <ListItem key={index} disablePadding>
                                            <Typography variant="body2">• {point}</Typography>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}
                    </Stack>
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
                        Translation feature will help you understand the audio content in your preferred language.
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
                        <Typography variant="h6">Search Topics</Typography>
                        <IconButton onClick={() => setShowSearch(false)}>
                            <Close />
                        </IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        placeholder="Search by topic, category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <List>
                        {filteredTopics.slice(0, 10).map((topic) => (
                            <ListItem key={topic.id} disablePadding>
                                <ListItemButton
                                    onClick={() => {
                                        handleTopicSelect(topic);
                                        setShowSearch(false);
                                        setSearchQuery('');
                                    }}
                                >
                                    <ListItemText
                                        primary={topic.title}
                                        secondary={`${topic.category} • ${topic.difficulty}`}
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

export default SummarizeSpokenText;