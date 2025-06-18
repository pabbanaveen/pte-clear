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








import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Stack,
  IconButton,
  Typography,
  Slider,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  VolumeUp,
  Speed,
  RecordVoiceOver
} from '@mui/icons-material';
import { DEFAULT_SETTINGS, DEFAULT_WORDS_PER_MINUTE, SPEED_OPTIONS, SpeedOption, TextToSpeechProps, TextToSpeechStateEnum, TIMER_UPDATE_INTERVAL } from './types';


const TextToSpeech: React.FC<TextToSpeechProps> = ({
  text,
  autoPlay = false,
  onStart = () => {},
  onEnd = () => {},
  onPause = () => {},
  onResume = () => {},
  onError = () => {}
}) => {
  // Core state
  const [state, setState] = useState<string>(TextToSpeechStateEnum.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  // Audio properties
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState<number>(DEFAULT_SETTINGS.rate);
  const [volume, setVolume] = useState<number>(DEFAULT_SETTINGS.volume);
  
  // Timer and progress
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  
  // Refs for managing speech and timers
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedDurationRef = useRef<number>(0);
  const isCleaningUpRef = useRef<boolean>(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastVolumeRef = useRef<number>(volume);
  const lastRateRef = useRef<number>(rate);
  const userStoppedRef = useRef<boolean>(false);

  // Load available voices
  const loadVoices = useCallback((): void => {
    const availableVoices = speechSynthesis.getVoices();
    setVoices(availableVoices);
    
    if (!currentVoice && availableVoices.length > 0) {
      // Prefer English voices, specifically Google voices if available
      const preferredVoice = 
        availableVoices.find((voice: SpeechSynthesisVoice) => 
          voice.lang.startsWith('en-') && voice.name.includes('Google')
        ) ||
        availableVoices.find((voice: SpeechSynthesisVoice) => voice.lang.startsWith('en-')) ||
        availableVoices[0];
      
      setCurrentVoice(preferredVoice);
    }
  }, [currentVoice]);

  // Initialize voices
  useEffect(() => {
    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [loadVoices]);

  // Estimate duration based on text and rate
  const estimateDuration = useCallback((text: string, speechRate: number): number => {
    if (!text) return 0;
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    const wordsPerMinute = DEFAULT_WORDS_PER_MINUTE * speechRate;
    return Math.ceil((wordCount / wordsPerMinute) * 60);
  }, []);

  // Clean up function
  const cleanup = useCallback((): void => {
    if (isCleaningUpRef.current) return;
    isCleaningUpRef.current = true;
    
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
    
    try {
      speechSynthesis.cancel();
    } catch (e) {
      // Ignore cancel errors
    }
    
    utteranceRef.current = null;
    
    setTimeout(() => {
      isCleaningUpRef.current = false;
    }, 150);
  }, []);

  // Update progress during playback
  const updateProgress = useCallback((): void => {
    if (state === TextToSpeechStateEnum.PLAYING && duration > 0) {
      const elapsed = (Date.now() - startTimeRef.current - pausedDurationRef.current) / 1000;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      setCurrentTime(elapsed);
      setProgress(newProgress);
      
      // Auto-complete if we've reached the estimated duration
      if (newProgress >= 100) {
        handleEnd();
      }
    }
  }, [state, duration]);

  // Start progress tracking
  const startProgressTracking = useCallback((): void => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    progressIntervalRef.current = setInterval(updateProgress, TIMER_UPDATE_INTERVAL);
  }, [updateProgress]);

  // Stop progress tracking
  const stopProgressTracking = useCallback((): void => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // Handle speech end
  const handleEnd = useCallback((): void => {
    if (userStoppedRef.current) {
      userStoppedRef.current = false;
      return;
    }
    
    stopProgressTracking();
    setState(TextToSpeechStateEnum.IDLE);
    setCurrentTime(duration);
    setProgress(100);
    onEnd();
  }, [duration, onEnd, stopProgressTracking]);

  // Create and configure utterance
  const createUtterance = useCallback((): SpeechSynthesisUtterance | null => {
    if (!text) return null;
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set properties
    utterance.voice = currentVoice;
    utterance.rate = rate;
    utterance.pitch = DEFAULT_SETTINGS.pitch;
    utterance.volume = volume;
    
    // Event handlers
    utterance.onstart = () => {
      if (state !== TextToSpeechStateEnum.PAUSED) {
        startTimeRef.current = Date.now();
        pausedDurationRef.current = 0;
        const estimatedDuration = estimateDuration(text, rate);
        setDuration(estimatedDuration);
        setCurrentTime(0);
        setProgress(0);
      } else {
        startTimeRef.current = Date.now();
      }
      
      setState(TextToSpeechStateEnum.PLAYING);
      startProgressTracking();
      setError(null);
      onStart();
    };
    
    utterance.onend = () => {
      if (!isCleaningUpRef.current && !userStoppedRef.current) {
        handleEnd();
      }
    };
    
    utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
      // Only show error if it's not an "interrupted" error from user actions
      if (event.error !== 'interrupted' && !userStoppedRef.current && !isCleaningUpRef.current) {
        const errorMessage = `Speech synthesis error: ${event.error}`;
        setError(errorMessage);
        setState(TextToSpeechStateEnum.ERROR);
        stopProgressTracking();
        onError(errorMessage);
      }
    };
    
    return utterance;
  }, [text, currentVoice, rate, volume, state, estimateDuration, onStart, onError, startProgressTracking, handleEnd, stopProgressTracking]);

  // Safe speech synthesis operations
  const safeCancel = useCallback((): void => {
    try {
      speechSynthesis.cancel();
    } catch (e) {
      // Ignore cancel errors
    }
  }, []);

  const safeSpeak = useCallback((utterance: SpeechSynthesisUtterance): void => {
    try {
      speechSynthesis.speak(utterance);
    } catch (e) {
      const errorMessage = 'Failed to start speech synthesis';
      setError(errorMessage);
      setState(TextToSpeechStateEnum.ERROR);
      onError(errorMessage);
    }
  }, [onError]);

  // Play function
  const handlePlay = useCallback((): void => {
    try {
      if (!text) {
        setError('No text to speak');
        return;
      }
      
      userStoppedRef.current = false;
      
      // If resuming from pause
      if (state === TextToSpeechStateEnum.PAUSED && speechSynthesis.paused) {
        speechSynthesis.resume();
        setState(TextToSpeechStateEnum.PLAYING);
        startProgressTracking();
        setError(null);
        onResume();
        return;
      }
      
      // Clean up any existing speech
      cleanup();
      
      // Wait a bit before creating new utterance to avoid conflicts
      setTimeout(() => {
        if (!userStoppedRef.current) {
          const utterance = createUtterance();
          if (utterance) {
            utteranceRef.current = utterance;
            safeSpeak(utterance);
          }
        }
      }, 100);
      
    } catch (err) {
      const errorMessage = 'Failed to start speech synthesis';
      setError(errorMessage);
      setState(TextToSpeechStateEnum.ERROR);
      onError(errorMessage);
    }
  }, [text, state, cleanup, createUtterance, onResume, onError, startProgressTracking, safeSpeak]);

  // Pause function
  const handlePause = useCallback((): void => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      pausedDurationRef.current += Date.now() - startTimeRef.current;
      try {
        speechSynthesis.pause();
        setState(TextToSpeechStateEnum.PAUSED);
        stopProgressTracking();
        onPause();
      } catch (e) {
        // If pause fails, treat it as a stop
        handleStop();
      }
    }
  }, [onPause, stopProgressTracking]);

  // Stop function
  const handleStop = useCallback((): void => {
    userStoppedRef.current = true;
    cleanup();
    setState(TextToSpeechStateEnum.IDLE);
    setCurrentTime(0);
    setProgress(0);
    setError(null);
  }, [cleanup]);

  // Toggle play/pause
  const handleTogglePlayback = useCallback((): void => {
    switch (state) {
      case TextToSpeechStateEnum.IDLE:
      case TextToSpeechStateEnum.STOPPED:
        handlePlay();
        break;
      case TextToSpeechStateEnum.PLAYING:
        handlePause();
        break;
      case TextToSpeechStateEnum.PAUSED:
        handlePlay();
        break;
      default:
        break;
    }
  }, [state, handlePlay, handlePause]);

  // Debounced restart for real-time changes
  const debouncedRestart = useCallback((): void => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      if ((state === TextToSpeechStateEnum.PLAYING || state === TextToSpeechStateEnum.PAUSED) && 
          (volume !== lastVolumeRef.current || rate !== lastRateRef.current)) {
        
        const wasPlaying = state === TextToSpeechStateEnum.PLAYING;
        const currentProgress = progress;
        const currentDuration = duration;
        
        lastVolumeRef.current = volume;
        lastRateRef.current = rate;
        
        cleanup();
        
        setTimeout(() => {
          if (!userStoppedRef.current) {
            const utterance = createUtterance();
            if (utterance) {
              utteranceRef.current = utterance;
              
              // Try to maintain position
              if (currentProgress > 0 && currentDuration > 0) {
                const resumeTime = (currentProgress / 100) * currentDuration;
                pausedDurationRef.current = 0;
                startTimeRef.current = Date.now() - (resumeTime * 1000);
              }
              
              if (wasPlaying) {
                safeSpeak(utterance);
              } else {
                setState(TextToSpeechStateEnum.PAUSED);
              }
            }
          }
        }, 150);
      }
    }, 500); // 500ms debounce
  }, [state, progress, duration, volume, rate, cleanup, createUtterance, safeSpeak]);

  // Handle volume change
  const handleVolumeChange = useCallback((event: Event, newValue: number | number[]): void => {
    const volumeValue = Array.isArray(newValue) ? newValue[0] : newValue;
    setVolume(volumeValue);
    
    // Update the current utterance volume immediately for smooth feedback
    if (utteranceRef.current && speechSynthesis.speaking) {
      utteranceRef.current.volume = volumeValue;
    }
    
    // Debounce the restart for consistency
    if (state === TextToSpeechStateEnum.PLAYING || state === TextToSpeechStateEnum.PAUSED) {
      debouncedRestart();
    }
  }, [state, debouncedRestart]);

  // Handle rate change from dropdown
  const handleRateChange = useCallback((event: SelectChangeEvent<number>): void => {
    const rateValue = Number(event.target.value);
    setRate(rateValue);
    
    // Debounce the restart for smooth operation
    if (state === TextToSpeechStateEnum.PLAYING || state === TextToSpeechStateEnum.PAUSED) {
      debouncedRestart();
    }
  }, [state, debouncedRestart]);

  // Handle voice change
  const handleVoiceChange = useCallback((event: SelectChangeEvent<string>): void => {
    const voiceName = event.target.value;
    const selectedVoice = voices.find((v: SpeechSynthesisVoice) => v.name === voiceName) || null;
    setCurrentVoice(selectedVoice);
    
    // For voice changes, restart immediately but safely
    if (state === TextToSpeechStateEnum.PLAYING || state === TextToSpeechStateEnum.PAUSED) {
      const wasPlaying = state === TextToSpeechStateEnum.PLAYING;
      
      cleanup();
      
      setTimeout(() => {
        if (!userStoppedRef.current) {
          const utterance = createUtterance();
          if (utterance) {
            utteranceRef.current = utterance;
            if (wasPlaying) {
              safeSpeak(utterance);
            } else {
              setState(TextToSpeechStateEnum.PAUSED);
            }
          }
        }
      }, 200);
    }
  }, [voices, state, cleanup, createUtterance, safeSpeak]);

  // Auto play effect
  useEffect(() => {
    if (autoPlay && text && currentVoice && state === TextToSpeechStateEnum.IDLE) {
      handlePlay();
    }
  }, [autoPlay, text, currentVoice, state, handlePlay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      userStoppedRef.current = true;
      cleanup();
    };
  }, [cleanup]);

  // Format time display
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get play button color
  const getPlayButtonColor = (): string => {
    switch (state) {
      case TextToSpeechStateEnum.PLAYING:
        return '#ff5722'; // Orange for pause
      case TextToSpeechStateEnum.PAUSED:
        return '#4caf50'; // Green for resume
      default:
        return '#4caf50'; // Green for play
    }
  };

  if (error) {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Paper>
    );
  }

  return (
    <>
      {/* Timer Display */}
      <Typography variant="body1" sx={{ color: '#ff5722', mb: 2, fontWeight: 'bold' }}>
        Time: {formatTime(currentTime)}
      </Typography>

      <Paper sx={{ p: 3, mb: 3, bgcolor: '#fafafa' }}>
        {/* Main Controls */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <IconButton
            onClick={handleTogglePlayback}
            disabled={!text || !currentVoice}
            sx={{
              bgcolor: getPlayButtonColor(),
              color: 'white',
              '&:hover': { 
                bgcolor: getPlayButtonColor(),
                opacity: 0.8
              },
              '&:disabled': {
                bgcolor: '#ccc',
                color: '#999'
              }
            }}
          >
            {state === TextToSpeechStateEnum.PLAYING ? <Pause /> : <PlayArrow />}
          </IconButton>

          <IconButton
            onClick={handleStop}
            disabled={state === TextToSpeechStateEnum.IDLE}
            sx={{ 
              color: state === TextToSpeechStateEnum.IDLE ? '#ccc' : '#666',
              '&:hover': { 
                bgcolor: state === TextToSpeechStateEnum.IDLE ? 'transparent' : '#f5f5f5' 
              }
            }}
          >
            <Stop />
          </IconButton>

          {/* Progress Bar */}
          <Box sx={{ flexGrow: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#4caf50',
                },
              }}
            />
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
              <Typography variant="caption" color="textSecondary">
                {formatTime(currentTime)}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {formatTime(duration)}
              </Typography>
            </Stack>
          </Box>

          {/* Volume Control */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <VolumeUp />
            <Slider
              value={volume}
              onChange={handleVolumeChange}
              sx={{ width: 100 }}
              size="small"
              min={0}
              max={1}
              step={0.01}
            />
            <Typography variant="caption" sx={{ minWidth: 40 }}>
              {Math.round(volume * 100)}%
            </Typography>
          </Stack>
        </Stack>

        {/* Speech Controls */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
          {/* Speed Control - Now as Dropdown */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Speed</InputLabel>
            <Select
              value={rate}
              onChange={handleRateChange}
              label="Speed"
              startAdornment={<Speed sx={{ mr: 1, color: '#666' }} />}
            >
              {SPEED_OPTIONS.map((option: SpeedOption) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Voice Selection */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Voice</InputLabel>
            <Select
              value={currentVoice?.name || ''}
              onChange={handleVoiceChange}
              label="Voice"
              startAdornment={<RecordVoiceOver sx={{ mr: 1, color: '#666' }} />}
            >
              {voices.map((voice: SpeechSynthesisVoice) => (
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

        {/* Status Display */}
        <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
          <strong>Text-to-Speech:</strong> {currentVoice?.name || 'Loading voices...'} ({currentVoice?.lang || ''})
          {state !== TextToSpeechStateEnum.IDLE && (
            <Chip 
              label={state.charAt(0).toUpperCase() + state.slice(1)} 
              size="small" 
              sx={{ ml: 1 }}
              color={state === TextToSpeechStateEnum.PLAYING ? 'success' : 'default'}
            />
          )}
        </Typography>
      </Paper>
    </>
  );
};

export default TextToSpeech;