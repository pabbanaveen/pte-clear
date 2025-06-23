// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import {
//   Box,
//   Paper,
//   Stack,
//   IconButton,
//   Typography,
//   Slider,
//   LinearProgress,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Chip,
//   SelectChangeEvent
// } from '@mui/material';
// import {
//   PlayArrow,
//   Pause,
//   Stop,
//   VolumeUp,
//   Speed,
//   RecordVoiceOver
// } from '@mui/icons-material';
// import { TextToSpeechProps, TextToSpeechState } from './types';

import { Refresh, Pause, PlayArrow, Stop, VolumeUp, Speed, RecordVoiceOver, VolumeOff, SkipNext, SkipPrevious } from "@mui/icons-material";
import { SelectChangeEvent, Paper, Alert, Button, Typography, IconButton, LinearProgress, duration, Slider, FormControl, InputLabel, Select, MenuItem, Chip, Tooltip } from "@mui/material";
import { Stack, Box } from "@mui/system";
import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { TextToSpeechStateEnum, SpeedOption } from "./types";

// const TextToSpeech: React.FC<TextToSpeechProps> = ({
//   text,
//   autoPlay = false,
//   selectedVoice = null,
//   rate = 1,
//   pitch = 1,  
//   volume = 1,
//   onStart,
//   onEnd,
//   onPause,
//   onResume,
//   onError,
// }) => {
//   const [state, setState] = useState<TextToSpeechState>({
//     isPlaying: false,
//     isPaused: false,
//     currentTime: 0,
//     duration: 0,
//     progress: 0,
//     error: null,
//     voices: []
//   });

//   const [currentRate, setCurrentRate] = useState(rate);
//   const [currentVolume, setCurrentVolume] = useState(volume * 100);
//   const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(selectedVoice);

//   const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
//   const startTimeRef = useRef<number>(0);
//   const pausedDurationRef = useRef<number>(0);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);
//   const isManuallyStoppedRef = useRef<boolean>(false);

//   // Load available voices
//   useEffect(() => {
//     const loadVoices = () => {
//       const voices = speechSynthesis.getVoices();
//       setState(prev => ({ ...prev, voices }));

//       // Set default voice if none selected
//       if (!currentVoice && voices.length > 0) {
//         // Prefer English voices
//         const englishVoice = voices.find(voice => 
//           voice.lang.startsWith('en-') && voice.name.includes('Google')
//         ) || voices.find(voice => voice.lang.startsWith('en-')) || voices[0];
//         setCurrentVoice(englishVoice);
//       }
//     };

//     loadVoices();
//     speechSynthesis.addEventListener('voiceschanged', loadVoices);

//     return () => {
//       speechSynthesis.removeEventListener('voiceschanged', loadVoices);
//       cleanup();
//     };
//   }, []);

//   // Cleanup function
//   const cleanup = useCallback(() => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//     speechSynthesis.cancel();
//     speechRef.current = null;
//   }, []);

//   // Estimate duration based on text length and speech rate
//   const estimateDuration = useCallback((text: string, rate: number): number => {
//     // Average speaking rate is about 150-160 words per minute
//     // Adjusted for speech synthesis which tends to be slightly faster
//     const wordsPerMinute = 180 * rate;
//     const wordCount = text.split(/\s+/).length;
//     return Math.ceil((wordCount / wordsPerMinute) * 60);
//   }, []);

//   // Reset state
//   const resetState = useCallback(() => {
//     setState(prev => ({
//       ...prev,
//       isPlaying: false,
//       isPaused: false,
//       currentTime: 0,
//       progress: 0,
//       error: null
//     }));
//     startTimeRef.current = 0;
//     pausedDurationRef.current = 0;
//     isManuallyStoppedRef.current = false;
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//   }, []);

//   // Update progress during speech
//   const updateProgress = useCallback(() => {
//     if (state.isPlaying && !state.isPaused && state.duration > 0 && startTimeRef.current > 0) {
//       const elapsed = (Date.now() - startTimeRef.current - pausedDurationRef.current) / 1000;
//       const progress = Math.min(elapsed / state.duration, 1) * 100;
//       setState(prev => ({
//         ...prev,
//         currentTime: elapsed,
//         progress
//       }));
//     }
//   }, [state.isPlaying, state.isPaused, state.duration]);

//   // Start progress tracking
//   useEffect(() => {
//     if (state.isPlaying && !state.isPaused) {
//       intervalRef.current = setInterval(updateProgress, 100);
//     } else {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//         intervalRef.current = null;
//       }
//     }

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, [state.isPlaying, state.isPaused, updateProgress]);

//   const handlePlay = useCallback(() => {
//     try {
//       // Stop any existing speech
//       speechSynthesis.cancel();

//       // Reset if this is a fresh start
//       if (!state.isPaused) {
//         resetState();
//       }

//       const utterance = new SpeechSynthesisUtterance(text);
//       speechRef.current = utterance;

//       // Set speech properties
//       utterance.voice = currentVoice;
//       utterance.rate = currentRate;
//       utterance.pitch = pitch;
//       utterance.volume = currentVolume / 100;

//       // Calculate estimated duration
//       const estimatedDuration = estimateDuration(text, currentRate);

//       // Set up event handlers
//       utterance.onstart = () => {
//         if (!state.isPaused) {
//           startTimeRef.current = Date.now();
//           pausedDurationRef.current = 0;
//         } else {
//           startTimeRef.current = Date.now();
//         }

//         setState(prev => ({
//           ...prev,
//           isPlaying: true,
//           isPaused: false,
//           duration: estimatedDuration,
//           error: null
//         }));
//         onStart?.();
//       };

//       utterance.onend = () => {
//         if (!isManuallyStoppedRef.current) {
//           setState(prev => ({
//             ...prev,
//             isPlaying: false,
//             isPaused: false,
//             currentTime: prev.duration,
//             progress: 100
//           }));
//           if (intervalRef.current) {
//             clearInterval(intervalRef.current);
//             intervalRef.current = null;
//           }
//           onEnd?.();
//         }
//       };

//       utterance.onerror = (event) => {
//         const errorMessage = `Speech synthesis error: ${event.error}`;
//         setState(prev => ({
//           ...prev,
//           isPlaying: false,
//           isPaused: false,
//           error: errorMessage
//         }));
//         onError?.(errorMessage);
//       };

//       speechSynthesis.speak(utterance);
//     } catch (error) {
//       const errorMessage = 'Failed to initialize speech synthesis';
//       setState(prev => ({ ...prev, error: errorMessage }));
//       onError?.(errorMessage);
//     }
//   }, [text, currentVoice, currentRate, pitch, currentVolume, estimateDuration, onStart, onEnd, onError, state.isPaused, resetState]);

//   const handlePause = useCallback(() => {
//     if (speechSynthesis.speaking && !speechSynthesis.paused) {
//       speechSynthesis.pause();
//       pausedDurationRef.current += Date.now() - startTimeRef.current;
//       setState(prev => ({ ...prev, isPaused: true }));
//       onPause?.();
//     }
//   }, [onPause]);

//   const handleResume = useCallback(() => {
//     if (speechSynthesis.paused) {
//       speechSynthesis.resume();
//       startTimeRef.current = Date.now();
//       setState(prev => ({ ...prev, isPaused: false }));
//       onResume?.();
//     }
//   }, [onResume]);

//   const handleStop = useCallback(() => {
//     isManuallyStoppedRef.current = true;
//     speechSynthesis.cancel();
//     resetState();
//   }, [resetState]);

//   const handleTogglePlayback = useCallback(() => {
//     if (state.isPlaying) {
//       if (state.isPaused) {
//         handleResume();
//       } else {
//         handlePause();
//       }
//     } else {
//       handlePlay();
//     }
//   }, [state.isPlaying, state.isPaused, handlePlay, handlePause, handleResume]);

//   const handleVolumeChange = useCallback((event: Event, newValue: number | number[]) => {
//     const volumeValue = Array.isArray(newValue) ? newValue[0] : newValue;
//     setCurrentVolume(volumeValue);

//     // Update volume in real-time if speaking
//     if (speechRef.current && speechSynthesis.speaking) {
//       speechRef.current.volume = volumeValue / 100;
//     }
//   }, []);

//   const handleRateChange = useCallback((event: Event, newValue: number | number[]) => {
//     const rateValue = Array.isArray(newValue) ? newValue[0] : newValue;
//     setCurrentRate(rateValue);

//     // If currently playing, restart with new rate
//     if (state.isPlaying) {
//       handleStop();
//       setTimeout(() => handlePlay(), 100);
//     }
//   }, [state.isPlaying, handleStop, handlePlay]);

//   const handleVoiceChange = useCallback((event: SelectChangeEvent<string>) => {
//     const voiceName = event.target.value;
//     const voice = state.voices.find(v => v.name === voiceName) || null;
//     setCurrentVoice(voice);

//     // If currently playing, restart with new voice
//     if (state.isPlaying) {
//       handleStop();
//       setTimeout(() => handlePlay(), 100);
//     }
//   }, [state.voices, state.isPlaying, handleStop, handlePlay]);

//   const formatTime = (seconds: number): string => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = Math.floor(seconds % 60);
//     return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
//   };

//   // Auto play functionality
//   useEffect(() => {
//     if (autoPlay && text && currentVoice) {
//       handlePlay();
//     }
//   }, [autoPlay, text, currentVoice, handlePlay]);

//   if (state.error) {
//     return (
//       <Paper sx={{ p: 2, bgcolor: '#ffebee' }}>
//         <Typography color="error">{state.error}</Typography>
//         <button onClick={() => setState(prev => ({ ...prev, error: null }))}>
//           Try Again
//         </button>
//       </Paper>
//     );
//   }

//   return (
//     <>
//       <Typography variant="body1" sx={{ color: '#ff5722', mb: 2, fontWeight: 'bold' }}>
//         Time: {formatTime(state.currentTime)}
//       </Typography>

//       <Paper sx={{ p: 3, mb: 3, bgcolor: '#fafafa' }}>
//         <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
//           <IconButton
//             onClick={handleTogglePlayback}
//             sx={{
//               bgcolor: state.isPlaying ? '#ff5722' : '#4caf50',
//               color: 'white',
//               '&:hover': { bgcolor: state.isPlaying ? '#e64a19' : '#388e3c' },
//             }}
//           >
//             {state.isPlaying && !state.isPaused ? <Pause /> : <PlayArrow />}
//           </IconButton>

//           <IconButton
//             onClick={handleStop}
//             disabled={!state.isPlaying && !state.isPaused}
//             sx={{ 
//               color: (!state.isPlaying && !state.isPaused) ? '#ccc' : '#666',
//               '&:hover': { 
//                 bgcolor: (!state.isPlaying && !state.isPaused) ? 'transparent' : '#f5f5f5' 
//               }
//             }}
//           >
//             <Stop />
//           </IconButton>

//           <Box sx={{ flexGrow: 1 }}>
//             <LinearProgress
//               variant="determinate"
//               value={state.progress}
//               sx={{
//                 height: 8,
//                 borderRadius: 4,
//                 bgcolor: '#e0e0e0',
//                 '& .MuiLinearProgress-bar': {
//                   bgcolor: '#4caf50',
//                 },
//               }}
//             />
//             <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
//               <Typography variant="caption" color="textSecondary">
//                 {formatTime(state.currentTime)}
//               </Typography>
//               <Typography variant="caption" color="textSecondary">
//                 {formatTime(state.duration)}
//               </Typography>
//             </Stack>
//           </Box>

//           <Stack direction="row" alignItems="center" spacing={1}>
//             <VolumeUp />
//             <Slider
//               value={currentVolume}
//               onChange={handleVolumeChange}
//               sx={{ width: 100 }}
//               size="small"
//               min={0}
//               max={100}
//               step={1}
//             />
//             <Typography variant="caption" sx={{ minWidth: 40 }}>
//               {currentVolume}%
//             </Typography>
//           </Stack>
//         </Stack>

//         {/* Speech Controls */}
//         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
//           <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 200 }}>
//             <Speed sx={{ color: '#666' }} />
//             <Typography variant="caption">Speed:</Typography>
//             <Slider
//               value={currentRate}
//               onChange={handleRateChange}
//               sx={{ width: 100 }}
//               size="small"
//               min={0.5}
//               max={2}
//               step={0.1}
//             />
//             <Typography variant="caption" sx={{ minWidth: 40 }}>
//               {currentRate.toFixed(1)}x
//             </Typography>
//           </Stack>

//           <FormControl size="small" sx={{ minWidth: 200 }}>
//             <InputLabel>Voice</InputLabel>
//             <Select
//               value={currentVoice?.name || ''}
//               onChange={handleVoiceChange}
//               label="Voice"
//               startAdornment={<RecordVoiceOver sx={{ mr: 1, color: '#666' }} />}
//             >
//               {state.voices.map((voice) => (
//                 <MenuItem key={voice.name} value={voice.name}>
//                   <Stack direction="row" spacing={1} alignItems="center">
//                     <Typography variant="body2">{voice.name}</Typography>
//                     <Chip 
//                       label={voice.lang} 
//                       size="small" 
//                       variant="outlined"
//                       sx={{ height: 20, fontSize: '0.7rem' }}
//                     />
//                   </Stack>
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Stack>

//         <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
//           <strong>Text-to-Speech:</strong> {currentVoice?.name || 'Loading voices...'} ({currentVoice?.lang || ''})
//         </Typography>
//       </Paper>
//     </>
//   );
// };

// export default TextToSpeech;




// Types and Constants
const DEFAULT_SETTINGS = {
  rate: 1,
  volume: 0.8,
  pitch: 1
};

const DEFAULT_WORDS_PER_MINUTE = 150;
const TIMER_UPDATE_INTERVAL = 250;

const SPEED_OPTIONS = [
  { value: 0.5, label: '0.5x' },
  { value: 0.75, label: '0.75x' },
  { value: 1, label: '1x' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
  { value: 2, label: '2x' }
];

enum TextToSpeechState {
  IDLE = 'idle',
  LOADING = 'loading',
  PLAYING = 'playing',
  PAUSED = 'paused',
  STOPPED = 'stopped',
  ERROR = 'error'
}

interface TextChunk {
  text: string;
  startIndex: number;
  endIndex: number;
  wordCount: number;
}

// Timer Component
const TimerDisplay = ({ currentTime, formatTime }: any) => (
  <Typography variant="body1" sx={{ color: '#ff5722', mb: 2, fontWeight: 'bold' }}>
    Time: {formatTime(currentTime)}
  </Typography>
);

// Error Display Component
const ErrorDisplay = ({ error, onRetry }: any) => (
  <Paper sx={{ p: 2, mb: 2 }}>
    <Alert
      severity="error"
      action={
        <Button
          color="inherit"
          size="small"
          onClick={onRetry}
          startIcon={<Refresh />}
        >
          Retry
        </Button>
      }
    >
      {error}
    </Alert>
  </Paper>
);

// Main Controls Component
const MainControls = ({
  state,
  onTogglePlayback,
  onStop,
  onPrevious,
  onNext,
  currentChunkIndex,
  totalChunks,
  text,
  currentVoice
}: any) => (
  <Stack direction="row" alignItems="center" spacing={2}>
    <Tooltip title="Play/Pause (Space)">
      <IconButton
        onClick={onTogglePlayback}
        disabled={!text || !currentVoice || state === TextToSpeechState.LOADING}
        sx={{
          bgcolor: state === TextToSpeechState.PLAYING ? '#ff5722' : '#4caf50',
          color: 'white',
          '&:hover': { opacity: 0.8 },
          '&:disabled': { bgcolor: '#ccc', color: '#999' }
        }}
      >
        {state === TextToSpeechState.PLAYING ? <Pause /> : <PlayArrow />}
      </IconButton>
    </Tooltip>

    <Tooltip title="Stop (Esc)">
      <IconButton
        onClick={onStop}
        disabled={state === TextToSpeechState.IDLE}
        sx={{ color: state === TextToSpeechState.IDLE ? '#ccc' : '#666' }}
      >
        <Stop />
      </IconButton>
    </Tooltip>

    <Tooltip title="Previous (Ctrl+←)">
      <IconButton
        onClick={onPrevious}
        disabled={currentChunkIndex === 0}
        sx={{ color: currentChunkIndex === 0 ? '#ccc' : '#666' }}
      >
        <SkipPrevious />
      </IconButton>
    </Tooltip>

    <Tooltip title="Next (Ctrl+→)">
      <IconButton
        onClick={onNext}
        disabled={currentChunkIndex >= totalChunks - 1}
        sx={{ color: currentChunkIndex >= totalChunks - 1 ? '#ccc' : '#666' }}
      >
        <SkipNext />
      </IconButton>
    </Tooltip>
  </Stack>
);

// Progress Bar Component
const ProgressBar = ({ progress, onSeek, currentTime, estimatedDuration, formatTime }: any) => (
  <Box sx={{ flexGrow: 1 }}>
    <Tooltip title="Click to seek to position">
      <Slider
        value={progress}
        onChange={onSeek}
        sx={{
          height: 8,
          '& .MuiSlider-thumb': {
            height: 20,
            width: 20,
            backgroundColor: '#4caf50',
          },
          '& .MuiSlider-track': {
            backgroundColor: '#4caf50',
          },
          '& .MuiSlider-rail': {
            backgroundColor: '#e0e0e0',
          },
        }}
        min={0}
        max={100}
        step={1}
      />
    </Tooltip>
    <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
      <Typography variant="caption" color="textSecondary">
        {formatTime(currentTime)}
      </Typography>
      <Typography variant="caption" color="textSecondary">
        {formatTime(estimatedDuration)}
      </Typography>
    </Stack>
  </Box>
);

// Volume Control Component
const VolumeControl = ({ volume, isMuted, onVolumeChange, onToggleMute }: any) => (
  <Stack direction="row" alignItems="center" spacing={1}>
    <Tooltip title="Mute (M)">
      <IconButton onClick={onToggleMute} size="small">
        {isMuted || volume === 0 ? <VolumeOff /> : <VolumeUp />}
      </IconButton>
    </Tooltip>
    <Slider
      value={isMuted ? 0 : volume}
      onChange={onVolumeChange}
      sx={{ width: 100 }}
      size="small"
      min={0}
      max={1}
      step={0.01}
    />
    <Typography variant="caption" sx={{ minWidth: 40 }}>
      {Math.round((isMuted ? 0 : volume) * 100)}%
    </Typography>
  </Stack>
);

// Speech Controls Component
const SpeechControls = ({ rate, onRateChange, voices, currentVoice, onVoiceChange }: any) => (
  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel>Speed</InputLabel>
      <Select
        value={rate}
        onChange={onRateChange}
        label="Speed"
        startAdornment={<Speed sx={{ mr: 1, color: '#666' }} />}
      >
        {SPEED_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel>Voice</InputLabel>
      <Select
        value={currentVoice?.name || ''}
        onChange={onVoiceChange}
        label="Voice"
        startAdornment={<RecordVoiceOver sx={{ mr: 1, color: '#666' }} />}
      >
        {voices.map((voice: any) => (
          <MenuItem key={voice.name} value={voice.name}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2">{voice.name}</Typography>
              <Chip
                label={voice.lang}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
            </Stack>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Stack>
);

// Status Display Component
const StatusDisplay = ({ currentVoice, state }: any) => (
  <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
    <strong>Text-to-Speech:</strong> {currentVoice?.name || 'Loading voices...'} ({currentVoice?.lang || ''})
    {state !== TextToSpeechState.IDLE && (
      <Chip
        label={state.charAt(0).toUpperCase() + state.slice(1)}
        size="small"
        sx={{ ml: 1 }}
        color={state === TextToSpeechState.PLAYING ? 'success' : 'default'}
      />
    )}
  </Typography>
);

// Main TextToSpeech Component
interface TextToSpeechProps {
  text: string;
  autoPlay?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({
  text,
  autoPlay = false,
  onStart = () => { },
  onEnd = () => { },
  onPause = () => { },
  onResume = () => { },
  onError = () => { },
  onProgress = () => { }
}) => {
  // Core state
  const [state, setState] = useState<TextToSpeechState>(TextToSpeechState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Audio properties
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState<number>(DEFAULT_SETTINGS.rate);
  const [volume, setVolume] = useState<number>(DEFAULT_SETTINGS.volume);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Progress and chunks
  const [currentChunkIndex, setCurrentChunkIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [estimatedDuration, setEstimatedDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  // Refs
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const chunkStartTimeRef = useRef<number>(0);
  const totalElapsedRef = useRef<number>(0);
  const previousVolumeRef = useRef<number>(volume);
  const isCleaningUpRef = useRef<boolean>(false);

  // Split text into manageable chunks
  const textChunks = useMemo((): TextChunk[] => {
    if (!text) return [];

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const chunks: TextChunk[] = [];
    let currentIndex = 0;

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (trimmed.length === 0) continue;

      const words = trimmed.split(/\s+/);
      const wordCount = words.length;

      if (wordCount > 50) {
        const subChunks = [];
        for (let i = 0; i < words.length; i += 40) {
          const chunkWords = words.slice(i, i + 45);
          subChunks.push(chunkWords.join(' '));
        }

        for (const subChunk of subChunks) {
          const startIndex = text.indexOf(subChunk, currentIndex);
          const endIndex = startIndex + subChunk.length;
          chunks.push({
            text: subChunk,
            startIndex,
            endIndex,
            wordCount: subChunk.split(/\s+/).length
          });
          currentIndex = endIndex;
        }
      } else {
        const startIndex = text.indexOf(trimmed, currentIndex);
        const endIndex = startIndex + trimmed.length;
        chunks.push({
          text: trimmed,
          startIndex,
          endIndex,
          wordCount
        });
        currentIndex = endIndex;
      }
    }

    return chunks;
  }, [text]);

  // Calculate total estimated duration
  const totalEstimatedDuration = useMemo(() => {
    if (!textChunks.length) return 0;
    const totalWords = textChunks.reduce((sum, chunk) => sum + chunk.wordCount, 0);
    const wordsPerMinute = DEFAULT_WORDS_PER_MINUTE * rate;
    return (totalWords / wordsPerMinute) * 60;
  }, [textChunks, rate]);

  // Load available voices
  const loadVoices = useCallback((): void => {
    const availableVoices = speechSynthesis.getVoices();

    if (availableVoices.length === 0) {
      setTimeout(loadVoices, 100);
      return;
    }

    setVoices(availableVoices);

    if (!currentVoice) {
      const preferredVoice =
        availableVoices.find(voice =>
          voice.lang.startsWith('en-US') && voice.name.toLowerCase().includes('neural')
        ) ||
        availableVoices.find(voice =>
          voice.lang.startsWith('en-US') && !voice.name.toLowerCase().includes('compact')
        ) ||
        availableVoices.find(voice =>
          voice.lang.startsWith('en-') && voice.name.toLowerCase().includes('google')
        ) ||
        availableVoices.find(voice => voice.lang.startsWith('en-')) ||
        availableVoices[0];

      setCurrentVoice(preferredVoice);
    }
  }, [currentVoice]);

  // Format time display
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Cleanup function
  const cleanup = useCallback((): void => {
    if (isCleaningUpRef.current) return;
    isCleaningUpRef.current = true;

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    try {
      speechSynthesis.cancel();
    } catch (e) {
      console.warn('Error canceling speech synthesis:', e);
    }

    utteranceRef.current = null;

    setTimeout(() => {
      isCleaningUpRef.current = false;
    }, 100);
  }, []);

  useEffect(() => {
    if (textChunks.length > 0 && rate) {
      const totalWords = textChunks.reduce((sum, chunk) => sum + chunk.wordCount, 0);
      const wordsPerMinute = DEFAULT_WORDS_PER_MINUTE * rate;
      const duration = (totalWords / wordsPerMinute) * 60;
      setEstimatedDuration(duration);
      setProgress(0);
      setCurrentTime(0);
    }
  }, [textChunks, rate]);

  // Progress tracking
  const updateProgress = useCallback((): void => {
    if (state === TextToSpeechState.PLAYING && textChunks.length > 0) {
      const chunkElapsed = (Date.now() - chunkStartTimeRef.current) / 1000;
      const currentChunk = textChunks[currentChunkIndex];

      if (currentChunk) {
        const chunkDuration = (currentChunk.wordCount / (DEFAULT_WORDS_PER_MINUTE * rate)) * 60;
        const chunkProgress = Math.min(chunkElapsed / chunkDuration, 1);

        const completedChunks = currentChunkIndex;
        const totalChunks = textChunks.length;
        const overallProgress = ((completedChunks + chunkProgress) / totalChunks) * 100;

        const newCurrentTime = totalElapsedRef.current + chunkElapsed;

        setProgress(Math.min(overallProgress, 100));
        setCurrentTime(newCurrentTime);
        onProgress(overallProgress);
      }
    }
  }, [state, textChunks, currentChunkIndex, rate, onProgress]);
  useEffect(() => {
    if (state === TextToSpeechState.PLAYING) {
      // Safety: ensure tracking is active
      startProgressTracking();
    } else {
      stopProgressTracking();
    }
  }, [state]);
  const startProgressTracking = useCallback((): void => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    progressIntervalRef.current = setInterval(updateProgress, TIMER_UPDATE_INTERVAL);
  }, [updateProgress]);

  const stopProgressTracking = useCallback((): void => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // Create utterance for current chunk
  const createUtterance = useCallback((chunkIndex: number): SpeechSynthesisUtterance | null => {
    if (!textChunks[chunkIndex] || !currentVoice) return null;

    const chunk = textChunks[chunkIndex];
    const utterance = new SpeechSynthesisUtterance(chunk.text);

    utterance.voice = currentVoice;
    utterance.rate = rate;
    utterance.pitch = DEFAULT_SETTINGS.pitch;
    utterance.volume = isMuted ? 0 : volume;

    utterance.onstart = () => {
      chunkStartTimeRef.current = Date.now();
      setState(TextToSpeechState.PLAYING);
      startProgressTracking();
      setError(null);

      if (chunkIndex === 0) {
        totalElapsedRef.current = 0;
        onStart();
      }
    };

    utterance.onend = () => {
      if (!isCleaningUpRef.current) {
        const chunkDuration = (Date.now() - chunkStartTimeRef.current) / 1000;
        totalElapsedRef.current += chunkDuration;

        if (chunkIndex < textChunks.length - 1) {
          setCurrentChunkIndex(chunkIndex + 1);
        } else {
          handleComplete();
        }
      }
    };

    utterance.onerror = (event) => {
      if (event.error === 'interrupted') return;

      console.error('Speech synthesis error:', event.error);

      if (event.error === 'network' || event.error === 'synthesis-failed') {
        handleRetry();
      } else {
        const errorMessage = `Speech error: ${event.error}`;
        setError(errorMessage);
        setState(TextToSpeechState.ERROR);
        stopProgressTracking();
        onError(errorMessage);
      }
    };

    return utterance;
  }, [textChunks, currentVoice, rate, volume, isMuted, onStart, onError, startProgressTracking, stopProgressTracking]);

  // Handle completion
  const handleComplete = useCallback((): void => {
    stopProgressTracking();
    setState(TextToSpeechState.IDLE);
    setProgress(100);
    setCurrentTime(totalEstimatedDuration);
    onEnd();
  }, [stopProgressTracking, totalEstimatedDuration, onEnd]);

  // Retry mechanism
  const handleRetry = useCallback((): void => {
    if (retryTimeoutRef.current) return;

    setState(TextToSpeechState.LOADING);
    retryTimeoutRef.current = setTimeout(() => {
      retryTimeoutRef.current = null;
      if (state !== TextToSpeechState.STOPPED) {
        const utterance = createUtterance(currentChunkIndex);
        if (utterance) {
          utteranceRef.current = utterance;
          try {
            speechSynthesis.speak(utterance);
          } catch (e) {
            setError('Failed to retry speech synthesis');
            setState(TextToSpeechState.ERROR);
          }
        }
      }
    }, 1000);
  }, [state, currentChunkIndex, createUtterance]);

  // Play current chunk
  const playCurrentChunk = useCallback((): void => {
    if (!textChunks.length || !currentVoice) return;

    cleanup();

    setTimeout(() => {
      const utterance = createUtterance(currentChunkIndex);
      if (utterance) {
        utteranceRef.current = utterance;
        try {
          speechSynthesis.speak(utterance);
        } catch (e) {
          setError('Failed to start speech synthesis');
          setState(TextToSpeechState.ERROR);
          onError('Failed to start speech synthesis');
        }
      }
    }, 50);
  }, [textChunks, currentVoice, currentChunkIndex, createUtterance, cleanup, onError]);

  // Main control functions
  const handlePlay = useCallback((): void => {
    if (!text || !currentVoice) {
      setError('No text or voice available');
      return;
    }

    if (state === TextToSpeechState.PAUSED) {
      try {
        speechSynthesis.resume();

        // 💡 Check after short delay if still paused or not speaking
        setTimeout(() => {
          if (!speechSynthesis.speaking || speechSynthesis.paused) {
            // ❗ Resuming failed — fallback to restarting the chunk
            playCurrentChunk();
          } else {
            setState(TextToSpeechState.PLAYING);
            startProgressTracking();
            onResume();
          }
        }, 200); // Adjust delay as needed
      } catch (e) {
        // Resume failed, fallback
        playCurrentChunk();
      }
      return;
    }

    // Starting from idle/stopped
    setEstimatedDuration(totalEstimatedDuration);
    playCurrentChunk();
  }, [text, currentVoice, state, totalEstimatedDuration, playCurrentChunk, onResume, startProgressTracking]);

  const handlePause = useCallback((): void => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      try {
        speechSynthesis.pause();
        setState(TextToSpeechState.PAUSED);
        stopProgressTracking();
        onPause();
      } catch (e) {
        handleStop();
      }
    }
  }, [stopProgressTracking, onPause]);

  const handleStop = useCallback((): void => {
    cleanup();
    setState(TextToSpeechState.IDLE);
    setCurrentChunkIndex(0);
    setProgress(0);
    setCurrentTime(0);
    totalElapsedRef.current = 0;
    setError(null);
  }, [cleanup]);

  const handleTogglePlayback = useCallback((): void => {
    switch (state) {
      case TextToSpeechState.IDLE:
      case TextToSpeechState.STOPPED:
        handlePlay();
        break;
      case TextToSpeechState.PLAYING:
        handlePause();
        break;
      case TextToSpeechState.PAUSED:
        handlePlay();
        break;
    }
  }, [state, handlePlay, handlePause]);

  const handleNextChunk = useCallback((): void => {
    if (currentChunkIndex < textChunks.length - 1) {
      const wasPlaying = state === TextToSpeechState.PLAYING;
      cleanup();

      if (wasPlaying) {
        const chunkDuration = (Date.now() - chunkStartTimeRef.current) / 1000;
        totalElapsedRef.current += chunkDuration;
      }

      setCurrentChunkIndex(prev => prev + 1);

      if (wasPlaying) {
        setState(TextToSpeechState.PLAYING);
      }
    }
  }, [currentChunkIndex, textChunks.length, state, cleanup]);

  const handlePreviousChunk = useCallback((): void => {
    if (currentChunkIndex > 0) {
      const wasPlaying = state === TextToSpeechState.PLAYING;
      cleanup();

      const previousChunks = textChunks.slice(0, currentChunkIndex - 1);
      totalElapsedRef.current = previousChunks.reduce((sum, chunk) => {
        return sum + (chunk.wordCount / (DEFAULT_WORDS_PER_MINUTE * rate)) * 60;
      }, 0);

      setCurrentChunkIndex(prev => prev - 1);

      if (wasPlaying) {
        setState(TextToSpeechState.PLAYING);
      }
    }
  }, [currentChunkIndex, textChunks, state, rate, cleanup]);

  const handleSeek = useCallback((event: Event, newValue: number | number[]): void => {
    const seekProgress = Array.isArray(newValue) ? newValue[0] : newValue;
    const targetChunkIndex = Math.floor((seekProgress / 100) * textChunks.length);
    const clampedIndex = Math.max(0, Math.min(targetChunkIndex, textChunks.length - 1));

    if (clampedIndex !== currentChunkIndex) {
      const wasPlaying = state === TextToSpeechState.PLAYING;
      cleanup();

      const previousChunks = textChunks.slice(0, clampedIndex);
      totalElapsedRef.current = previousChunks.reduce((sum, chunk) => {
        return sum + (chunk.wordCount / (DEFAULT_WORDS_PER_MINUTE * rate)) * 60;
      }, 0);

      setCurrentChunkIndex(clampedIndex);
      setProgress(seekProgress);

      if (wasPlaying) {
        setState(TextToSpeechState.PLAYING);
      }
    }
  }, [textChunks, currentChunkIndex, state, rate, cleanup]);

  const handleVolumeChange = useCallback((event: Event, newValue: number | number[]): void => {
    const volumeValue = Array.isArray(newValue) ? newValue[0] : newValue;
    setVolume(volumeValue);
    setIsMuted(false);

    if (utteranceRef.current && speechSynthesis.speaking) {
      utteranceRef.current.volume = volumeValue;
    }
  }, []);

  const toggleMute = useCallback((): void => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(previousVolumeRef.current);
    } else {
      previousVolumeRef.current = volume;
      setIsMuted(true);
      setVolume(0);
    }
  }, [isMuted, volume]);

  const handleRateChange = useCallback((event: any): void => {
    const rateValue = Number(event.target.value);
    setRate(rateValue);
    setEstimatedDuration(totalEstimatedDuration);

    if (state === TextToSpeechState.PLAYING) {
      playCurrentChunk();
    }
  }, [state, totalEstimatedDuration, playCurrentChunk]);

  const handleVoiceChange = useCallback((event: any): void => {
    const voiceName = event.target.value;
    const selectedVoice = voices.find(v => v.name === voiceName) || null;
    setCurrentVoice(selectedVoice);

    if (state === TextToSpeechState.PLAYING) {
      playCurrentChunk();
    }
  }, [voices, state, playCurrentChunk]);

  const handleRetryError = useCallback((): void => {
    setError(null);
    setState(TextToSpeechState.IDLE);
  }, []);

  // Auto play chunk effect
  useEffect(() => {
    if (state === TextToSpeechState.PLAYING && currentChunkIndex < textChunks.length) {
      playCurrentChunk();
    }
  }, [currentChunkIndex]);

  // Initialize voices and keyboard shortcuts
  useEffect(() => {
    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          handleTogglePlayback();
          break;
        case 'ArrowRight':
          if (e.ctrlKey) {
            e.preventDefault();
            handleNextChunk();
          }
          break;
        case 'ArrowLeft':
          if (e.ctrlKey) {
            e.preventDefault();
            handlePreviousChunk();
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(prev => Math.min(1, prev + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(prev => Math.max(0, prev - 0.1));
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'Escape':
          e.preventDefault();
          handleStop();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyboard);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      document.removeEventListener('keydown', handleKeyboard);
      cleanup();
    };
  }, []);

  // Auto play effect
  useEffect(() => {
    if (autoPlay && text && currentVoice && state === TextToSpeechState.IDLE) {
      handlePlay();
    }
  }, [autoPlay, text, currentVoice, state, handlePlay]);

  if (error) {
    return <ErrorDisplay error={error} onRetry={handleRetryError} />;
  }

  return (
    <>
      <TimerDisplay currentTime={currentTime} formatTime={formatTime} />

      <Paper sx={{ p: 3, mb: 3, bgcolor: '#fafafa' }}>
        <Stack spacing={2}>
          {/* Main Controls Row */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <MainControls
              state={state}
              onTogglePlayback={handleTogglePlayback}
              onStop={handleStop}
              onPrevious={handlePreviousChunk}
              onNext={handleNextChunk}
              currentChunkIndex={currentChunkIndex}
              totalChunks={textChunks.length}
              text={text}
              currentVoice={currentVoice}
            />
            <ProgressBar
              progress={progress}
              onSeek={handleSeek}
              currentTime={currentTime}
              estimatedDuration={estimatedDuration}
              formatTime={formatTime}
            />
          </Stack>

          {/* Volume and Speech Controls */}
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={handleVolumeChange}
              onToggleMute={toggleMute}
            />
            {/* enable this for voice changes  */}
            {/* <SpeechControls
              rate={rate}
              onRateChange={handleRateChange}
              voices={voices}
              currentVoice={currentVoice}
              onVoiceChange={handleVoiceChange}
            /> */}
          </Stack>

          {/* Status Display */}
          <StatusDisplay
            currentVoice={currentVoice}
            state={state}
          />
        </Stack>
      </Paper>
    </>
  );
};

export default TextToSpeech;