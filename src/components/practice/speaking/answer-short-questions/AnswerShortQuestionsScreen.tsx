import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Paper, Divider, LinearProgress, Alert, Card, CardContent, Chip, Stack, IconButton, Slider, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, List, ListItem, ListItemButton, ListItemText, MenuItem, Select, TextField } from '@mui/material';
import { Mic, PlayArrow, Send, ArrowForward, Help, MicOff, Pause, Refresh, Translate, VolumeUp, Close } from '@mui/icons-material';
import { User } from '../../../../types/user';
import TopicSelectionDrawer from '../../../common/TopicSelectionDrawer';
import ActionButtons from '../../common/ActionButtons';
import AudioPlayer from '../../common/AudioPlayer';
import NavigationSection from '../../common/NavigationSection';
import QuestionHeader from '../../common/QuestionHeader';
import RecordingSection from '../../common/RecordingSection';
import StageGoalBanner from '../../common/StageGoalBanner';
import { QuestionTopic } from '../../common/types';
import { questionTopics } from './questionTopics';

interface PracticeTestsProps {
  user: User | null;
}
const useAudioRecording = (preparationTime:any, recordingTime = 10000) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
    const [micPermission, setMicPermission] = useState<boolean | null>(null);
    
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
  
    useEffect(() => {
      const checkMicPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setMicPermission(true);
          stream.getTracks().forEach((track) => track.stop());
        } catch (error) {
          console.error('Initial microphone permission check failed:', error);
          setMicPermission(false);
        }
      };
      checkMicPermission();
    }, []);
  
    const toggleRecording = async () => {
      if (micPermission === false) {
        alert('Microphone permission is required to record. Please grant permission and try again.');
        return;
      }
  
      if (!isRecording) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setMicPermission(true);
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
  
          const chunks:any = [];
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              chunks.push(event.data);
            }
          };
  
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/webm' }) as any;
            setRecordedBlob(blob);
            const url = URL.createObjectURL(blob);
            setRecordedAudioUrl(url);
            stream.getTracks().forEach((track) => track.stop());
            console.log('Recording stopped, blob created:', blob);
          };
  
          mediaRecorder.start();
          setIsRecording(true);
          console.log('Recording started');
  
          timerRef.current = setTimeout(() => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
              mediaRecorderRef.current.stop();
              setIsRecording(false);
              console.log(`Recording auto-stopped after ${recordingTime / 1000} seconds`);
            }
          }, recordingTime);
        } catch (error) {
          console.error('Microphone access denied:', error);
          setMicPermission(false);
          alert('Unable to access the microphone. Please ensure you have granted permission.');
        }
      } else if (isRecording && mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        console.log('Recording manually stopped');
      }
    };
  
    const resetRecording = () => {
      setRecordedBlob(null);
      setRecordedAudioUrl(null);
      setIsRecording(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  
    useEffect(() => {
      return () => {
        if (recordedAudioUrl) {
          URL.revokeObjectURL(recordedAudioUrl);
        }
      };
    }, [recordedAudioUrl]);
  
    return {
      isRecording,
      recordedBlob,
      recordedAudioUrl,
      micPermission,
      toggleRecording,
      resetRecording
    };
  };
  
  const useAudioPlayback = (selectedTopic:any) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(5);
    const [volume, setVolume] = useState(100);
    const [audioError, setAudioError] = useState<string | null>(null);
    
    const audioRef = useRef<HTMLAudioElement>(null);
  
    const formatTime = (seconds:any) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
  
    const togglePlayback = () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current
            .play()
            .then(() => {
              setIsPlaying(true);
              setAudioError(null);
            })
            .catch((error) => {
              console.error('Audio playback failed:', error);
              setAudioError('Failed to play the question audio. Please ensure the audio file is accessible and try again.');
            });
        }
      }
    };
  
    const handleVolumeChange = (event:any, newValue:any) => {
      const newVolume = Array.isArray(newValue) ? newValue[0] : newValue;
      setVolume(newVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume / 100;
      }
    };
  
    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
        console.log('Audio metadata loaded, duration set to:', audioRef.current.duration);
      }
    };
  
    const handleAudioError = (event:any) => {
      console.error('Audio error:', event.nativeEvent);
      setAudioError('Failed to load the question audio. Please ensure the audio file is accessible and try again.');
    };
  
    const resetAudio = () => {
      setCurrentTime(0);
      setIsPlaying(false);
      setAudioError(null);
      if (audioRef.current) {
        audioRef.current.src = selectedTopic.link;
        audioRef.current.currentTime = 0;
      }
    };
  
    return {
      isPlaying,
      currentTime,
      duration,
      volume,
      audioError,
      audioRef,
      formatTime,
      togglePlayback,
      handleVolumeChange,
      handleLoadedMetadata,
      handleAudioError,
      resetAudio,
      setCurrentTime,
      setIsPlaying,
      setDuration
    };
  };

export const AnswerShortQuestionsScreen: React.FC<PracticeTestsProps> = ({ user }) => {
  const [selectedTopic, setSelectedTopic] = useState<QuestionTopic>(questionTopics[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(5);
  const [volume, setVolume] = useState(100);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  const [questionNumber, setQuestionNumber] = useState(655);
  const [studentName] = useState('Rachel Carson');
  const [testedCount] = useState(33);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [preparationTime, setPreparationTime] = useState<number | null>(null);
  const [showRecordingPrompt, setShowRecordingPrompt] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prepTimerRef = useRef<NodeJS.Timeout | null>(null);

  const audioPlayback = useAudioPlayback(selectedTopic);
  const audioRecording = useAudioRecording(preparationTime, selectedTopic.recordingTime * 1000);

  // Handle topic selection
  const handleTopicSelect = (topic:any) => {
    setSelectedTopic(topic);
    const [minutes, seconds] = topic.duration.split(':').map(Number);
    audioPlayback.setDuration(minutes * 60 + seconds);
    audioPlayback.resetAudio();
    setPreparationTime(null);
    setShowRecordingPrompt(false);
    audioRecording.resetRecording();
  };

  // Handle submit
  const handleSubmit = () => {
    if (audioRecording.recordedBlob) {
      console.log('Submitting recording:', audioRecording.recordedBlob);
      alert('Recording submitted successfully! Score: 92/100');
      setQuestionNumber((prev) => prev + 1);
      audioRecording.resetRecording();
      audioPlayback.resetAudio();
      setPreparationTime(null);
      setShowRecordingPrompt(false);
    } else {
      alert('Please record your answer before submitting.');
    }
  };

  // Action handlers
  const handleShowAnswer = () => setShowAnswer(true);
  const handleTranslate = () => setShowTranslate(true);
  const handleSearch = () => setShowSearch(true);
  
  const handlePrevious = () => {
    if (questionNumber > 1) {
      setQuestionNumber((prev) => prev - 1);
      audioPlayback.resetAudio();
      audioRecording.resetRecording();
      setPreparationTime(null);
      setShowRecordingPrompt(false);
    }
  };

  const handleRedo = () => {
    audioPlayback.resetAudio();
    audioRecording.resetRecording();
    setPreparationTime(null);
    setShowRecordingPrompt(false);
    if (prepTimerRef.current) {
      clearTimeout(prepTimerRef.current);
    }
    console.log('Re-do triggered, state reset');
  };

  // Audio progress tracking
  useEffect(() => {
    if (audioPlayback.isPlaying && audioPlayback.audioRef.current) {
      const interval = setInterval(() => {
        audioPlayback.setCurrentTime(audioPlayback.audioRef.current?.currentTime || 0);
        if (audioPlayback.audioRef.current?.ended) {
          audioPlayback.setIsPlaying(false);
          audioPlayback.setCurrentTime(audioPlayback.audioRef.current?.duration || 0);
          setPreparationTime(selectedTopic.preparationTime);
          console.log(`Question audio ended, starting ${selectedTopic.preparationTime}-second preparation timer`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [audioPlayback.isPlaying, selectedTopic.preparationTime]);

  // Preparation timer
  useEffect(() => {
    if (preparationTime !== null && preparationTime > 0) {
      prepTimerRef.current = setTimeout(() => {
        setPreparationTime((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (preparationTime === 0) {
      setShowRecordingPrompt(true);
      setPreparationTime(null);
      console.log('Preparation time ended, showing recording prompt');
    }
    return () => {
      if (prepTimerRef.current) {
        clearTimeout(prepTimerRef.current);
      }
    };
  }, [preparationTime]);

  // Filter topics for search
  const filteredTopics = questionTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic?.speaker?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                bgcolor: '#ffc107',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              ASQ
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Answer Short Questions
                </Typography>
                <Chip onClick={() => { }} label="Study Guide" color="primary" size="small" />
              </Stack>
              <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                You will hear a short question. After listening to the question, in 3 seconds, please speak into the microphone and provide a concise answer in your own words. You will have 10 seconds to give your response.
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

          {/* Audio Error Alert */}
          {audioPlayback.audioError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography>{audioPlayback.audioError}</Typography>
            </Alert>
          )}

          {/* Audio Player */}
          <AudioPlayer
            selectedTopic={selectedTopic}
            isPlaying={audioPlayback.isPlaying}
            currentTime={audioPlayback.currentTime}
            duration={audioPlayback.duration}
            volume={audioPlayback.volume}
            audioError={audioPlayback.audioError}
            onTogglePlayback={audioPlayback.togglePlayback}
            onVolumeChange={audioPlayback.handleVolumeChange}
            formatTime={audioPlayback.formatTime}
          />

          {/* Recording Section */}
          <RecordingSection
            isRecording={audioRecording.isRecording}
            recordedBlob={audioRecording.recordedBlob}
            micPermission={audioRecording.micPermission}
            showRecordingPrompt={showRecordingPrompt}
            preparationTime={preparationTime}
            recordingType="answer"
            onToggleRecording={audioRecording.toggleRecording}
          />

          {/* Action Buttons */}
          <ActionButtons
            recordedBlob={audioRecording.recordedBlob}
            onSubmit={handleSubmit}
            onRedo={handleRedo}
            onTranslate={handleTranslate}
            onShowAnswer={handleShowAnswer}
          />

          {/* Navigation Section */}
          <NavigationSection
            onSearch={handleSearch}
            onPrevious={handlePrevious}
            onNext={() => setShowTopicSelector(true)}
            questionNumber={questionNumber}
          />
        </CardContent>
      </Card>

      {/* Topic Selection Drawer */}
      <TopicSelectionDrawer
        open={showTopicSelector}
        onClose={() => setShowTopicSelector(false)}
        onSelect={handleTopicSelect}
        topics={questionTopics}
        title="Select Question Topic"
        type="question"
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
            <strong>Question:</strong> {selectedTopic.title}
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
            This is a sample answer for the selected question topic. In a real implementation, 
            this would contain the reference answer or key points that students should cover 
            in their response. The answer would be specific to each question topic and provide 
            guidance on what constitutes a complete and accurate answer.
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
            Translation feature will help you understand the question content in your preferred language.
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
            <Typography variant="h6">Search Questions</Typography>
            <IconButton onClick={() => setShowSearch(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Search by question or speaker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
          />
          <List>
            {filteredTopics.map((topic) => (
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
                    secondary={`${topic.speaker} • ${topic.difficulty}`}
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

      {/* Audio Element */}
      <audio
        ref={audioPlayback.audioRef}
        onLoadedMetadata={audioPlayback.handleLoadedMetadata}
        onError={audioPlayback.handleAudioError}
      >
        <source src={selectedTopic.link} type="audio/mpeg" />
        <source src={selectedTopic?.link?.replace('.mp3', '.ogg')} type="audio/ogg" />
        <p>Your browser does not support the audio element.</p>
      </audio>
    </Box>
  );
};