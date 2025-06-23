// import React, { useState, useEffect, useRef } from 'react';
// import { Box, Typography, Button, Paper, Divider, LinearProgress, Alert, Card, CardContent, Chip, Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemText, Slider, Stack } from '@mui/material';
// import { Mic, Stop, PlayArrow, Send, ArrowForward, Close, Help, MicOff, Pause, Refresh, Translate, VolumeUp } from '@mui/icons-material';


import { Close } from "@mui/icons-material";
import { Card, CardContent, Typography, Chip, Divider, Alert, Dialog, DialogTitle, IconButton, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, TextField, List, ListItem, ListItemButton, ListItemText, LinearProgress, Paper } from "@mui/material";
import { Box, Stack, useMediaQuery, useTheme } from "@mui/system";
import { useState, useRef, useEffect } from "react";
import { User } from "../../../../types/user";
import TopicSelectionDrawer from "../../../common/TopicSelectionDrawer";
import { audioTopics } from "./audioTopic";
import ActionButtons from "../../common/ActionButtons";
import AudioPlayer from "../../common/AudioPlayer";
import NavigationSection from "../../common/NavigationSection";
import QuestionHeader from "../../common/QuestionHeader";
import RecordingSection from "../../common/RecordingSection";
import StageGoalBanner from "../../common/StageGoalBanner";
import TextToSpeech from "../../common/TextToSpeech";
import { LectureTopic, UserAttempt } from "./ReTellLeactureType";
// import RetellLectureModal from "./ReTellLeacturePopup";

// interface PracticeTestsProps {
//     user: User | null;
//       lectureTitle?: string;
//   lectureAudioUrl?: string; // Placeholder for the audio URL
// }


// // Mock audio topics data
// const audioTopics = [
//   { id: 1, title: 'Introduction to Biology', duration: '01:29', speaker: 'Dr. Smith', difficulty: 'Beginner' },
//   { id: 2, title: 'World War II History', duration: '02:15', speaker: 'Prof. Johnson', difficulty: 'Intermediate' },
//   { id: 3, title: 'Climate Change Science', duration: '01:45', speaker: 'Dr. Wilson', difficulty: 'Advanced' },
//   { id: 4, title: 'Shakespeare Literature', duration: '03:20', speaker: 'Prof. Brown', difficulty: 'Intermediate' },
//   { id: 5, title: 'Quantum Physics Basics', duration: '02:50', speaker: 'Dr. Davis', difficulty: 'Advanced' },
//   { id: 6, title: 'Economic Principles', duration: '01:55', speaker: 'Prof. Miller', difficulty: 'Beginner' },
//   { id: 7, title: 'Art History Renaissance', duration: '02:30', speaker: 'Dr. Taylor', difficulty: 'Intermediate' },
//   { id: 8, title: 'Psychology Fundamentals', duration: '01:40', speaker: 'Prof. Anderson', difficulty: 'Beginner' }
// ];


// export const ReTellLeacture = ({ user, lectureTitle, lectureAudioUrl }: PracticeTestsProps) => {
//       const [isRecording, setIsRecording] = useState(false);
//   const [recordingTime, setRecordingTime] = useState(40); // 40 seconds for PTE Re-tell Lecture
//   const [recordingProgress, setRecordingProgress] = useState(0);
//   const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
//   const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const timerRef = useRef<NodeJS.Timeout | null>(null);
//   const audioRef = useRef<HTMLAudioElement | null>(null);
//     const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//     const [selectedLecture, setSelectedLecture] = useState<string | null>(null);

//     const [modalOpen, setModalOpen] = useState(true);
//     const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//         setAnchorEl(event.currentTarget);
//     };

//     const handleClose = () => {
//         setAnchorEl(null);
//     };
//     const handleOpenModal = () => {
//         setModalOpen(true);
//         handleClose(); // Close the menu when the modal opens
//     };

//     const handleCloseModal = () => {
//         setModalOpen(false);
//     };

//     const handleSelectLecture = (lecture: string) => {
//         setSelectedLecture(lecture);
//         setModalOpen(false);
//         // Placeholder for the next step (audio explanation)
//         console.log(`Selected lecture: ${lecture}`);
//         // We’ll expand this once you provide the second screenshot
//     };

//     // Timer for recording
//   useEffect(() => {
//     if (isRecording) {
//       timerRef.current = setInterval(() => {
//         setRecordingTime((prev) => {
//           if (prev <= 1) {
//             stopRecording();
//             return 0;
//           }
//           return prev - 1;
//         });
//         setRecordingProgress((prev) => prev + (100 / 40)); // Progress over 40 seconds
//       }, 1000);
//     } else if (timerRef.current) {
//       clearInterval(timerRef.current);
//     }
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, [isRecording]);

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;

//       const chunks: Blob[] = [];
//       mediaRecorder.ondataavailable = (event) => {
//         chunks.push(event.data);
//       };

//       mediaRecorder.onstop = () => {
//         const blob = new Blob(chunks, { type: 'audio/webm' });
//         setRecordedBlob(blob);
//         const url = URL.createObjectURL(blob);
//         setRecordedAudioUrl(url);
//       };

//       mediaRecorder.start();
//       setIsRecording(true);
//       setRecordingTime(40);
//       setRecordingProgress(0);
//     } catch (error) {
//       console.error('Error accessing microphone:', error);
//       alert('Unable to access the microphone. Please ensure you have granted permission.');
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//       mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
//       setIsRecording(false);
//     }
//   };

//   const playRecording = () => {
//     if (recordedAudioUrl && audioRef.current) {
//       audioRef.current.src = recordedAudioUrl;
//       audioRef.current.play();
//     }
//   };

//   const handleSubmit = () => {
//     if (recordedBlob) {
//       console.log('Submitting recording:', recordedBlob);
//       alert('Recording submitted successfully!'); // Placeholder for submission logic
//     } else {
//       alert('Please record your retelling before submitting.');
//     }
//   };

//     return (
//         <div>
//             <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: '800px', mx: 'auto', mt: 4 }}>
//       {/* Lecture Title */}
//       <Typography
//         variant="h5"
//         fontWeight="bold"
//         color="#1976D2"
//         gutterBottom
//         sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
//       >
//         Re-tell Lecture: {lectureTitle}
//       </Typography>

//       {/* Lecture Audio Player */}
//       <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: '#fafbfc' }}>
//         <Typography variant="subtitle1" fontWeight="medium" color="#333" gutterBottom>
//           Listen to the Lecture
//         </Typography>
//         <audio
//           controls
//           style={{ width: '100%' }}
//           src={lectureAudioUrl}
//         >
//           Your browser does not support the audio element.
//         </audio>
//       </Paper>

//       {/* Transcript/Notes Section (Placeholder) */}
//       <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: '#fafbfc' }}>
//         <Typography variant="subtitle1" fontWeight="medium" color="#333" gutterBottom>
//           Lecture Notes
//         </Typography>
//         <Typography variant="body2" color="#333">
//           This is a placeholder for the lecture transcript or notes. You can take notes here while listening to the lecture.
//         </Typography>
//       </Paper>

//       {/* Recording Section */}
//       <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
//         <Typography variant="subtitle1" fontWeight="medium" color="#333" gutterBottom>
//           Record Your Retelling
//         </Typography>
//         <Typography variant="body2" color="#333" mb={2}>
//           You have 40 seconds to retell the lecture in your own words.
//         </Typography>

//         {/* Timer and Progress Bar */}
//         {isRecording && (
//           <Box sx={{ mb: 2 }}>
//             <Typography variant="body2" color="#333">
//               Time remaining: {recordingTime}s
//             </Typography>
//             <LinearProgress
//               variant="determinate"
//               value={recordingProgress}
//               sx={{ mt: 1, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: '#1976D2' } }}
//             />
//           </Box>
//         )}

//         {/* Recording Controls */}
//         <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//           <Button
//             variant="contained"
//             startIcon={isRecording ? <Stop /> : <Mic />}
//             onClick={isRecording ? stopRecording : startRecording}
//             sx={{
//               bgcolor: isRecording ? '#d32f2f' : '#1976D2',
//               color: 'white',
//               '&:hover': {
//                 bgcolor: isRecording ? '#b71c1c' : '#1565C0',
//               },
//             }}
//           >
//             {isRecording ? 'Stop Recording' : 'Start Recording'}
//           </Button>

//           {recordedAudioUrl && (
//             <>
//               <Button
//                 variant="outlined"
//                 startIcon={<PlayArrow />}
//                 onClick={playRecording}
//                 sx={{
//                   color: '#333',
//                   borderColor: '#333',
//                   '&:hover': {
//                     borderColor: '#1976D2',
//                     color: '#1976D2',
//                   },
//                 }}
//               >
//                 Play Recording
//               </Button>
//               <Button
//                 variant="contained"
//                 startIcon={<Send />}
//                 onClick={handleSubmit}
//                 sx={{
//                   bgcolor: '#4DB6AC',
//                   color: 'white',
//                   '&:hover': {
//                     bgcolor: '#3C9C92',
//                   },
//                 }}
//               >
//                 Submit
//               </Button>
//             </>
//           )}
//         </Box>

//         {/* Hidden Audio Element for Playing Recording */}
//         <audio ref={audioRef} style={{ display: 'none' }} />
//       </Paper>
//     </Box>
//             <RetellLectureModal
//                 open={modalOpen}
//                 onClose={handleCloseModal}
//                 onSelectLecture={handleSelectLecture}
//             />
//         </div>
//     );
// }

//  const [selectedTopic, setSelectedTopic] = useState(audioTopics[0]);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(2); // Starting at 2 seconds as shown in image
//   const [duration, setDuration] = useState(89); // 1:29 in seconds
//   const [volume, setVolume] = useState(100);
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordedBlob, setRecordedBlob] = useState(null);
//   const [showTopicSelector, setShowTopicSelector] = useState(false);
//   const [micPermission, setMicPermission] = useState(false);
//   const [questionNumber, setQuestionNumber] = useState(653);
//   const [studentName] = useState('Rachel Carson');
//   const [testedCount] = useState(33);
//   const [showAnswer, setShowAnswer] = useState(false);
//   const [showTranslate, setShowTranslate] = useState(false);
//   const [showSearch, setShowSearch] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   const audioRef = useRef(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);

//   // Format time helper
//   const formatTime = (seconds:any) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   // Handle audio playback
//   const togglePlayback = () => {
//     setIsPlaying(!isPlaying);
//   };

//   // Handle volume change
//   const handleVolumeChange = (event:any, newValue:any) => {
//     setVolume(newValue);
//   };

//   // Handle topic selection
//   const handleTopicSelect = (topic:any) => {
//     setSelectedTopic(topic);
//     setCurrentTime(0);
//     setDuration(parseInt(topic.duration.split(':')[0]) * 60 + parseInt(topic.duration.split(':')[1]));
//     setShowTopicSelector(false);
//     setIsPlaying(false);
//   };

//   // Handle recording
//   const toggleRecording = async () => {
//     if (!micPermission) {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         setMicPermission(true);
//         setIsRecording(!isRecording);
        
//         if (!isRecording) {
//           // Start recording simulation
//           const mediaRecorder = new MediaRecorder(stream);
//           mediaRecorderRef.current = mediaRecorder;
          
//           mediaRecorder.start();
//           setTimeout(() => {
//             if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
//               mediaRecorderRef.current.stop();
//               setIsRecording(false);
//               setRecordedBlob(new Blob(['simulated audio data'], { type: 'audio/wav' }) as any);
//             }
//           }, 40000); // 40 seconds as mentioned in the instructions
//         }
//       } catch (error) {
//         console.error('Microphone access denied:', error);
//         setMicPermission(false);
//       }
//     } else {
//       setIsRecording(!isRecording);
//     }
//   };

//   // Handle submit as provided by user
//   const handleSubmit = () => {
//     if (recordedBlob) {
//       console.log('Submitting recording:', recordedBlob);
//       alert('Recording submitted successfully! Score: 87/100'); // Placeholder for submission logic
//       // Move to next question
//       setQuestionNumber(prev => prev + 1);
//       setRecordedBlob(null);
//       setCurrentTime(0);
//     } else {
//       alert('Please record your retelling before submitting.');
//     }
//   };

//   // Handle answer button
//   const handleShowAnswer = () => {
//     setShowAnswer(true);
//   };

//   // Handle translate button
//   const handleTranslate = () => {
//     setShowTranslate(true);
//   };

//   // Handle search button
//   const handleSearch = () => {
//     setShowSearch(true);
//   };

//   // Handle previous button
//   const handlePrevious = () => {
//     if (questionNumber > 1) {
//       setQuestionNumber(prev => prev - 1);
//       setCurrentTime(0);
//       setRecordedBlob(null);
//       setIsPlaying(false);
//     }
//   };

//   // Handle re-do button
//   const handleRedo = () => {
//     setCurrentTime(0);
//     setIsPlaying(false);
//     setRecordedBlob(null);
//     setIsRecording(false);
//   };

//   // Handle search in topics
//   const filteredTopics = audioTopics.filter(topic =>
//     topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     topic.speaker.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Simulate audio progress
//   useEffect(() => {
//     if (isPlaying) {
//       const interval = setInterval(() => {
//         setCurrentTime((prev) => {
//           if (prev >= duration) {
//             setIsPlaying(false);
//             return duration;
//           }
//           return prev + 1;
//         });
//       }, 1000);
//       return () => clearInterval(interval);
//     }
//   }, [isPlaying, duration]);

//   return (
//     <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', p: 2 }}>
//       {/* Stage Goal Banner */}
//       <Paper sx={{ mb: 3, p: 2, bgcolor: '#fff3e0', borderLeft: '4px solid #ff9800' }}>
//         <Stack direction="row" alignItems="center" justifyContent="space-between">
//           <Stack direction="row" alignItems="center" spacing={2}>
//             <Box sx={{ 
//               width: 40, 
//               height: 40, 
//               bgcolor: '#ff9800', 
//               borderRadius: '50%', 
//               display: 'flex', 
//               alignItems: 'center', 
//               justifyContent: 'center',
//               color: 'white',
//               fontWeight: 'bold'
//             }}>
//               🎯
//             </Box>
//             <Box>
//               <Typography variant="h6" sx={{ color: '#e65100', fontWeight: 'bold' }}>
//                 Stage Goal
//               </Typography>
//               <Typography variant="body2" sx={{ color: '#bf360c' }}>
//                 Ask the teacher for your current stage goal to clarify your current learning priorities and methods.
//               </Typography>
//             </Box>
//           </Stack>
//           <Stack direction="row" spacing={1}>
//             <Button variant="contained" sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#f57c00' } }}>
//               Ask Now
//             </Button>
//             <IconButton size="small">
//               <Close />
//             </IconButton>
//           </Stack>
//         </Stack>
//       </Paper>

//       {/* Main Content */}
//       <Card sx={{ maxWidth: 1200, mx: 'auto', mb: 3 }}>
//         <CardContent sx={{ p: 4 }}>
//           {/* Header */}
//           <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
//             <Box sx={{ 
//               width: 60, 
//               height: 60, 
//               bgcolor: '#ff9800', 
//               borderRadius: 2, 
//               display: 'flex', 
//               alignItems: 'center', 
//               justifyContent: 'center',
//               color: 'white',
//               fontSize: '24px',
//               fontWeight: 'bold'
//             }}>
//               RL
//             </Box>
//             <Box sx={{ flexGrow: 1 }}>
//               <Stack direction="row" alignItems="center" spacing={2}>
//                 <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
//                   Re-tell Lecture
//                 </Typography>
//                 <Chip label="Study Guide" color="primary" size="small" />
//               </Stack>
//               <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
//                 You will hear a lecture. After listening to the lecture, in 10 seconds, please speak into the microphone and retell what you have just heard from the lecture in your own words. You will have 40 seconds to give your response.
//               </Typography>
//             </Box>
//           </Stack>

//           <Divider sx={{ my: 3 }} />

//           {/* Student Info */}
//           <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
//             <Typography variant="h6" sx={{ color: '#333' }}>
//               #{questionNumber} {studentName}
//             </Typography>
//             <Chip label={`Tested (${testedCount})`} color="success" />
//           </Stack>

//           {/* Timer */}
//           <Typography variant="body1" sx={{ color: '#ff5722', mb: 2, fontWeight: 'bold' }}>
//             Time: {formatTime(currentTime)}
//           </Typography>

//           {/* Audio Player */}
//           <Paper sx={{ p: 3, mb: 3, bgcolor: '#fafafa' }}>
//             <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
//               <IconButton 
//                 onClick={togglePlayback}
//                 sx={{ 
//                   bgcolor: isPlaying ? '#ff5722' : '#4caf50', 
//                   color: 'white',
//                   '&:hover': { bgcolor: isPlaying ? '#e64a19' : '#388e3c' }
//                 }}
//               >
//                 {isPlaying ? <Pause /> : <PlayArrow />}
//               </IconButton>
              
//               <Box sx={{ flexGrow: 1 }}>
//                 <LinearProgress 
//                   variant="determinate" 
//                   value={(currentTime / duration) * 100} 
//                   sx={{ 
//                     height: 8, 
//                     borderRadius: 4,
//                     bgcolor: '#e0e0e0',
//                     '& .MuiLinearProgress-bar': {
//                       bgcolor: '#4caf50'
//                     }
//                   }}
//                 />
//                 <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
//                   <Typography variant="caption" color="textSecondary">
//                     {formatTime(currentTime)}
//                   </Typography>
//                   <Typography variant="caption" color="textSecondary">
//                     {formatTime(duration)}
//                   </Typography>
//                 </Stack>
//               </Box>

//               <Stack direction="row" alignItems="center" spacing={1}>
//                 <VolumeUp />
//                 <Slider
//                   value={volume}
//                   onChange={handleVolumeChange}
//                   sx={{ width: 100 }}
//                   size="small"
//                 />
//                 <Typography variant="caption" sx={{ minWidth: 40 }}>
//                   X{(volume / 100).toFixed(1)}
//                 </Typography>
//                 <Typography variant="caption" sx={{ color: '#666' }}>
//                   Blake (US)
//                 </Typography>
//               </Stack>
//             </Stack>
            
//             <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
//               <strong>Current Topic:</strong> {selectedTopic.title} by {selectedTopic.speaker}
//             </Typography>
//           </Paper>

//           {/* Microphone Section */}
//           {!micPermission ? (
//             <Alert severity="error" sx={{ mb: 3 }}>
//               <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
//                 <Typography>Microphone permission is not granted.</Typography>
//                 <Button variant="outlined" size="small" startIcon={<Help />}>
//                   Help
//                 </Button>
//               </Stack>
//             </Alert>
//           ) : (
//             <Paper sx={{ p: 3, mb: 3, bgcolor: isRecording ? '#ffebee' : '#e8f5e8' }}>
//               <Stack direction="row" alignItems="center" spacing={2}>
//                 <IconButton 
//                   onClick={toggleRecording}
//                   sx={{ 
//                     bgcolor: isRecording ? '#f44336' : '#4caf50', 
//                     color: 'white',
//                     '&:hover': { bgcolor: isRecording ? '#d32f2f' : '#388e3c' }
//                   }}
//                 >
//                   {isRecording ? <MicOff /> : <Mic />}
//                 </IconButton>
//                 <Typography variant="body1" sx={{ flexGrow: 1 }}>
//                   {isRecording ? 'Recording your response...' : 'Click to start recording your retelling'}
//                 </Typography>
//                 {recordedBlob && (
//                   <Chip label="Recording Ready" color="success" variant="outlined" />
//                 )}
//               </Stack>
//             </Paper>
//           )}

//           {/* Control Buttons */}
//           <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
//             <Button 
//               variant="contained" 
//               onClick={handleSubmit}
//               sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
//             >
//               Submit
//             </Button>
//             <Button variant="outlined" startIcon={<Refresh />} onClick={handleRedo}>
//               Re-do
//             </Button>
//             <Button variant="outlined" startIcon={<Translate />} onClick={handleTranslate}>
//               Translation
//             </Button>
//             <Button variant="outlined" onClick={handleShowAnswer}>
//               Answer
//             </Button>
//           </Stack>

//           {/* Bottom Navigation */}
//           <Stack direction="row" alignItems="center" justifyContent="space-between">
//             <Stack direction="row" spacing={1}>
//               <Chip label="× 5" color="error" variant="outlined" />
//               <Typography variant="body2" sx={{ color: '#666', display: 'flex', alignItems: 'center' }}>
//                 Question Counter
//               </Typography>
//             </Stack>
            
//             <Stack direction="row" spacing={1}>
//               <Button variant="contained" color="primary">
//                 Search
//               </Button>
//               <Button variant="contained" color="success">
//                 Previous
//               </Button>
//               <Button 
//                 variant="contained" 
//                 color="success"
//                 onClick={() => setShowTopicSelector(true)}
//                 endIcon={<ArrowForward />}
//               >
//                 Next
//               </Button>
//             </Stack>
//           </Stack>
//         </CardContent>
//       </Card>

//       {/* Topic Selection Dialog */}
//       <Dialog 
//         open={showTopicSelector} 
//         onClose={() => setShowTopicSelector(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle>
//           <Stack direction="row" alignItems="center" justifyContent="space-between">
//             <Typography variant="h6">Select Audio Topic</Typography>
//             <IconButton onClick={() => setShowTopicSelector(false)}>
//               <Close />
//             </IconButton>
//           </Stack>
//         </DialogTitle>
//         <DialogContent>
//           <List>
//             {audioTopics.map((topic) => (
//               <ListItem key={topic.id} disablePadding>
//                 <ListItemButton 
//                   onClick={() => handleTopicSelect(topic)}
//                   selected={selectedTopic.id === topic.id}
//                 >
//                   <ListItemText
//                     primary={
//                       <Stack direction="row" alignItems="center" spacing={2}>
//                         <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
//                           {topic.title}
//                         </Typography>
//                         <Chip 
//                           label={topic.difficulty} 
//                           size="small" 
//                           color={
//                             topic.difficulty === 'Beginner' ? 'success' : 
//                             topic.difficulty === 'Intermediate' ? 'warning' : 'error'
//                           }
//                         />
//                       </Stack>
//                     }
//                     secondary={
//                       <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
//                         <Typography variant="caption">
//                           <strong>Speaker:</strong> {topic.speaker}
//                         </Typography>
//                         <Typography variant="caption">
//                           <strong>Duration:</strong> {topic.duration}
//                         </Typography>
//                       </Stack>
//                     }
//                   />
//                 </ListItemButton>
//               </ListItem>
//             ))}
//           </List>
//         </DialogContent>
//       </Dialog>
//     </Box>
//   );
// }



//////////////// 3d updated

// import React, { useState, useEffect, useRef } from 'react';
// import { Box, Typography, Button, Paper, Divider, LinearProgress, Alert, Card, CardContent, Chip, Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemText, Slider, Stack } from '@mui/material';
// import { Mic, Stop, PlayArrow, Send, ArrowForward, Close, Help, MicOff, Pause, Refresh, Translate, VolumeUp } from '@mui/icons-material';
// import { User } from '../../../types/user';
// import TopicSelectionDrawer from '../../common/TopicSelectionDrawer';
// // import RetellLectureModal from './RetellLectureModal';

// interface PracticeTestsProps {
//   user: User | null;
// }

// // Define the type for audio topics
// interface AudioTopic {
//   id: number;
//   title: string;
//   duration: string;
//   speaker: string;
//   difficulty: string;
//   link: string; // Added link field
// }

// // Mock audio topics data with links
// const audioTopics: AudioTopic[] = [
//   { 
//     id: 1, 
//     title: 'Introduction to Biology', 
//     duration: '00:40', 
//     speaker: 'Dr. Smith', 
//     difficulty: 'Beginner', 
//     link: '/audio/intro-to-biology.mp3' 
//   },
//   { 
//     id: 2, 
//     title: 'World War II History', 
//     duration: '00:40', 
//     speaker: 'Prof. Johnson', 
//     difficulty: 'Intermediate', 
//     link: '/audio/wwii-history.mp3' 
//   },
//   { 
//     id: 3, 
//     title: 'Climate Change Science', 
//     duration: '00:40', 
//     speaker: 'Dr. Wilson', 
//     difficulty: 'Advanced', 
//     link: '/audio/climate-change.mp3' 
//   },
//   { 
//     id: 4, 
//     title: 'Shakespeare Literature', 
//     duration: '00:40', 
//     speaker: 'Prof. Brown', 
//     difficulty: 'Intermediate', 
//     link: '/audio/shakespeare.mp3' 
//   },
//   { 
//     id: 5, 
//     title: 'Quantum Physics Basics', 
//     duration: '00:40', 
//     speaker: 'Dr. Davis', 
//     difficulty: 'Advanced', 
//     link: '/audio/quantum-physics.mp3' 
//   },
//   { 
//     id: 6, 
//     title: 'Economic Principles', 
//     duration: '00:40', 
//     speaker: 'Prof. Miller', 
//     difficulty: 'Beginner', 
//     link: '/audio/economic-principles.mp3' 
//   },
//   { 
//     id: 7, 
//     title: 'Art History Renaissance', 
//     duration: '00:40', 
//     speaker: 'Dr. Taylor', 
//     difficulty: 'Intermediate', 
//     link: '/audio/art-history.mp3' 
//   },
//   { 
//     id: 8, 
//     title: 'Psychology Fundamentals', 
//     duration: '00:40', 
//     speaker: 'Prof. Anderson', 
//     difficulty: 'Beginner', 
//     link: '/audio/psychology.mp3' 
//   },
// ];

// export const ReTellLeacture: React.FC<PracticeTestsProps> = ({ user }) => {
//   const [selectedTopic, setSelectedTopic] = useState<AudioTopic>(audioTopics[0]);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(40);
//   const [volume, setVolume] = useState(100);
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
//   const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
//   const [showTopicSelector, setShowTopicSelector] = useState(false);
//   const [micPermission, setMicPermission] = useState<boolean | null>(null);
//   const [questionNumber, setQuestionNumber] = useState(655);
//   const [studentName] = useState('Rachel Carson');
//   const [testedCount] = useState(33);
//   const [showAnswer, setShowAnswer] = useState(false);
//   const [showTranslate, setShowTranslate] = useState(false);
//   const [showSearch, setShowSearch] = useState(false);
//   const [preparationTime, setPreparationTime] = useState<number | null>(null);
//   const [showRecordingPrompt, setShowRecordingPrompt] = useState(false);
//   const [audioError, setAudioError] = useState<string | null>(null);

//   const audioRef = useRef<HTMLAudioElement>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const timerRef = useRef<NodeJS.Timeout | null>(null);
//   const prepTimerRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     const checkMicPermission = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         setMicPermission(true);
//         stream.getTracks().forEach((track) => track.stop());
//       } catch (error) {
//         console.error('Initial microphone permission check failed:', error);
//         setMicPermission(false);
//       }
//     };
//     checkMicPermission();
//   }, []);

//   const formatTime = (seconds: number): string => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const togglePlayback = () => {
//     if (audioRef.current) {
//       if (isPlaying) {
//         audioRef.current.pause();
//         setIsPlaying(false);
//       } else {
//         audioRef.current
//           .play()
//           .then(() => {
//             setIsPlaying(true);
//             setAudioError(null);
//           })
//           .catch((error) => {
//             console.error('Audio playback failed:', error);
//             setAudioError('Failed to play the lecture audio. Please ensure the audio file is accessible and try again.');
//           });
//       }
//     }
//   };

//   const handleVolumeChange = (event: Event, newValue: number | number[]) => {
//     const newVolume = Array.isArray(newValue) ? newValue[0] : newValue;
//     setVolume(newVolume);
//     if (audioRef.current) {
//       audioRef.current.volume = newVolume / 100;
//     }
//   };

//   const handleTopicSelect = (topic: AudioTopic) => {
//     setSelectedTopic(topic);
//     setCurrentTime(0);
//     setDuration(parseInt(topic.duration.split(':')[0]) * 60 + parseInt(topic.duration.split(':')[1]));
//     setIsPlaying(false);
//     setPreparationTime(null);
//     setShowRecordingPrompt(false);
//     setRecordedBlob(null);
//     setRecordedAudioUrl(null);
//     setAudioError(null);
//     if (audioRef.current) {
//       audioRef.current.src = topic.link;
//       audioRef.current.currentTime = 0;
//     }
//   };

//   const toggleRecording = async () => {
//     if (micPermission === false) {
//       alert('Microphone permission is required to record. Please grant permission and try again.');
//       return;
//     }

//     if (!isRecording) {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         setMicPermission(true);
//         const mediaRecorder = new MediaRecorder(stream);
//         mediaRecorderRef.current = mediaRecorder;

//         const chunks: Blob[] = [];
//         mediaRecorder.ondataavailable = (event) => {
//           if (event.data.size > 0) {
//             chunks.push(event.data);
//           }
//         };

//         mediaRecorder.onstop = () => {
//           const blob = new Blob(chunks, { type: 'audio/webm' });
//           setRecordedBlob(blob);
//           const url = URL.createObjectURL(blob);
//           setRecordedAudioUrl(url);
//           stream.getTracks().forEach((track) => track.stop());
//           console.log('Recording stopped, blob created:', blob);
//         };

//         mediaRecorder.start();
//         setIsRecording(true);
//         setShowRecordingPrompt(false);
//         console.log('Recording started');

//         timerRef.current = setTimeout(() => {
//           if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
//             mediaRecorderRef.current.stop();
//             setIsRecording(false);
//             console.log('Recording auto-stopped after 40 seconds');
//           }
//         }, 40000);
//       } catch (error) {
//         console.error('Microphone access denied:', error);
//         setMicPermission(false);
//         alert('Unable to access the microphone. Please ensure you have granted permission.');
//       }
//     } else if (isRecording && mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//       setShowRecordingPrompt(false);
//       if (timerRef.current) {
//         clearTimeout(timerRef.current);
//       }
//       console.log('Recording manually stopped');
//     }
//   };

//   const handleSubmit = () => {
//     if (recordedBlob) {
//       console.log('Submitting recording:', recordedBlob);
//       alert('Recording submitted successfully! Score: 87/100');
//       setQuestionNumber((prev) => prev + 1);
//       setRecordedBlob(null);
//       setRecordedAudioUrl(null);
//       setCurrentTime(0);
//       setIsPlaying(false);
//       setPreparationTime(null);
//       setShowRecordingPrompt(false);
//     } else {
//       alert('Please record your retelling before submitting.');
//     }
//   };

//   const handleShowAnswer = () => {
//     setShowAnswer(true);
//   };

//   const handleTranslate = () => {
//     setShowTranslate(true);
//   };

//   const handleSearch = () => {
//     setShowSearch(true);
//   };

//   const handlePrevious = () => {
//     if (questionNumber > 1) {
//       setQuestionNumber((prev) => prev - 1);
//       setCurrentTime(0);
//       setRecordedBlob(null);
//       setRecordedAudioUrl(null);
//       setIsPlaying(false);
//       setPreparationTime(null);
//       setShowRecordingPrompt(false);
//     }
//   };

//   const handleRedo = () => {
//     setCurrentTime(0);
//     setIsPlaying(false);
//     setRecordedBlob(null);
//     setRecordedAudioUrl(null);
//     setIsRecording(false);
//     setPreparationTime(null);
//     setShowRecordingPrompt(false);
//     setAudioError(null);
//     if (timerRef.current) {
//       clearTimeout(timerRef.current);
//     }
//     if (prepTimerRef.current) {
//       clearTimeout(prepTimerRef.current);
//     }
//     console.log('Re-do triggered, state reset');
//   };

//   useEffect(() => {
//     if (isPlaying && audioRef.current) {
//       const interval = setInterval(() => {
//         setCurrentTime(audioRef.current?.currentTime || 0);
//         if (audioRef.current?.ended) {
//           setIsPlaying(false);
//           setCurrentTime(audioRef.current?.duration || 0);
//           setPreparationTime(10);
//           console.log('Lecture audio ended, starting 10-second preparation timer');
//         }
//       }, 1000);
//       return () => clearInterval(interval);
//     }
//   }, [isPlaying]);

//   useEffect(() => {
//     if (preparationTime !== null && preparationTime > 0) {
//       prepTimerRef.current = setTimeout(() => {
//         setPreparationTime((prev) => (prev !== null ? prev - 1 : null));
//       }, 1000);
//     } else if (preparationTime === 0) {
//       setShowRecordingPrompt(true);
//       setPreparationTime(null);
//       console.log('Preparation time ended, showing recording prompt');
//     }
//     return () => {
//       if (prepTimerRef.current) {
//         clearTimeout(prepTimerRef.current);
//       }
//     };
//   }, [preparationTime]);

//   const handleLoadedMetadata = () => {
//     if (audioRef.current) {
//       setDuration(audioRef.current.duration);
//       console.log('Audio metadata loaded, duration set to:', audioRef.current.duration);
//     }
//   };

//   const handleAudioError = (event: React.SyntheticEvent<HTMLAudioElement, Event>) => {
//     console.error('Audio error:', event.nativeEvent);
//     setAudioError('Failed to load the lecture audio. Please ensure the audio file is accessible and try again.');
//   };

//   useEffect(() => {
//     return () => {
//       if (recordedAudioUrl) {
//         URL.revokeObjectURL(recordedAudioUrl);
//       }
//     };
//   }, [recordedAudioUrl]);

//   return (
//     <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', p: 2 }}>
//       <Paper sx={{ mb: 3, p: 2, bgcolor: '#fff3e0', borderLeft: '4px solid #ff9800' }}>
//         <Stack direction="row" alignItems="center" justifyContent="space-between">
//           <Stack direction="row" alignItems="center" spacing={2}>
//             <Box
//               sx={{
//                 width: 40,
//                 height: 40,
//                 bgcolor: '#ff9800',
//                 borderRadius: '50%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 color: 'white',
//                 fontWeight: 'bold',
//               }}
//             >
//               🎯
//             </Box>
//             <Box>
//               <Typography variant="h6" sx={{ color: '#e65100', fontWeight: 'bold' }}>
//                 Stage Goal
//               </Typography>
//               <Typography variant="body2" sx={{ color: '#bf360c' }}>
//                 Ask the teacher for your current stage goal to clarify your current learning priorities and methods.
//               </Typography>
//             </Box>
//           </Stack>
//           <Stack direction="row" spacing={1}>
//             <Button variant="contained" sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#f57c00' } }}>
//               Ask Now
//             </Button>
//             <IconButton size="small">
//               <Close />
//             </IconButton>
//           </Stack>
//         </Stack>
//       </Paper>

//       <Card sx={{ maxWidth: 1200, mx: 'auto', mb: 3 }}>
//         <CardContent sx={{ p: 4 }}>
//           <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
//             <Box
//               sx={{
//                 width: 60,
//                 height: 60,
//                 bgcolor: '#ff9800',
//                 borderRadius: 2,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 color: 'white',
//                 fontSize: '24px',
//                 fontWeight: 'bold',
//               }}
//             >
//               RL
//             </Box>
//             <Box sx={{ flexGrow: 1 }}>
//               <Stack direction="row" alignItems="center" spacing={2}>
//                 <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
//                   Re-tell Lecture
//                 </Typography>
//                 <Chip label="Study Guide" color="primary" size="small" />
//               </Stack>
//               <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
//                 You will hear a lecture. After listening to the lecture, in 10 seconds, please speak into the microphone and retell what you have just heard from the lecture in your own words. You will have 40 seconds to give your response.
//               </Typography>
//             </Box>
//           </Stack>

//           <Divider sx={{ my: 3 }} />

//           <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
//             <Typography variant="h6" sx={{ color: '#333' }}>
//               #{questionNumber} {studentName}
//             </Typography>
//             <Chip label={`Tested (${testedCount})`} color="success" />
//           </Stack>

//           {audioError && (
//             <Alert severity="error" sx={{ mb: 3 }}>
//               <Typography>{audioError}</Typography>
//             </Alert>
//           )}

//           <Typography variant="body1" sx={{ color: '#ff5722', mb: 2, fontWeight: 'bold' }}>
//             Time: {formatTime(currentTime)}
//           </Typography>

//           <Paper sx={{ p: 3, mb: 3, bgcolor: '#fafafa' }}>
//             <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
//               <IconButton
//                 onClick={togglePlayback}
//                 sx={{
//                   bgcolor: isPlaying ? '#ff5722' : '#4caf50',
//                   color: 'white',
//                   '&:hover': { bgcolor: isPlaying ? '#e64a19' : '#388e3c' },
//                 }}
//               >
//                 {isPlaying ? <Pause /> : <PlayArrow />}
//               </IconButton>

//               <Box sx={{ flexGrow: 1 }}>
//                 <LinearProgress
//                   variant="determinate"
//                   value={(currentTime / duration) * 100}
//                   sx={{
//                     height: 8,
//                     borderRadius: 4,
//                     bgcolor: '#e0e0e0',
//                     '& .MuiLinearProgress-bar': {
//                       bgcolor: '#4caf50',
//                     },
//                   }}
//                 />
//                 <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
//                   <Typography variant="caption" color="textSecondary">
//                     {formatTime(currentTime)}
//                   </Typography>
//                   <Typography variant="caption" color="textSecondary">
//                     {formatTime(duration)}
//                   </Typography>
//                 </Stack>
//               </Box>

//               <Stack direction="row" alignItems="center" spacing={1}>
//                 <VolumeUp />
//                 <Slider
//                   value={volume}
//                   onChange={handleVolumeChange}
//                   sx={{ width: 100 }}
//                   size="small"
//                   min={0}
//                   max={100}
//                   step={1}
//                 />
//                 <Typography variant="caption" sx={{ minWidth: 40 }}>
//                   X{(volume / 100).toFixed(1)}
//                 </Typography>
//                 <Typography variant="caption" sx={{ color: '#666' }}>
//                   Blake (US)
//                 </Typography>
//               </Stack>
//             </Stack>

//             <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
//               <strong>Current Topic:</strong> {selectedTopic.title} by {selectedTopic.speaker} (Difficulty: {selectedTopic.difficulty})
//             </Typography>
//           </Paper>

//           {preparationTime !== null && preparationTime > 0 && (
//             <Alert severity="info" sx={{ mb: 3 }}>
//               <Typography>
//                 Prepare to retell the lecture. Recording will start in {preparationTime} seconds...
//               </Typography>
//             </Alert>
//           )}

//           {showRecordingPrompt && !isRecording && !recordedBlob && (
//             <Alert severity="success" sx={{ mb: 3 }}>
//               <Typography>
//                 Time to record! Click the microphone button below to start recording your retelling.
//               </Typography>
//             </Alert>
//           )}

//           <Paper sx={{ p: 3, mb: 3, bgcolor: isRecording ? '#ffebee' : showRecordingPrompt && !recordedBlob ? '#e8f5e8' : '#fafafa' }}>
//             <Stack direction="row" alignItems="center" spacing={2}>
//               <IconButton
//                 onClick={toggleRecording}
//                 sx={{
//                   bgcolor: isRecording ? '#f44336' : showRecordingPrompt && !recordedBlob ? '#4caf50' : micPermission === false ? '#d3d3d3' : '#666',
//                   color: 'white',
//                   '&:hover': { bgcolor: isRecording ? '#d32f2f' : showRecordingPrompt && !recordedBlob ? '#388e3c' : micPermission === false ? '#b0b0b0' : '#555' },
//                   transition: 'background-color 0.3s',
//                   cursor: micPermission === false ? 'not-allowed' : 'pointer',
//                 }}
//                 disabled={micPermission === false}
//               >
//                 {isRecording ? <MicOff /> : <Mic />}
//               </IconButton>
//               <Typography variant="body1" sx={{ flexGrow: 1 }}>
//                 {micPermission === null
//                   ? 'Checking microphone permission...'
//                   : micPermission === false
//                   ? 'Microphone permission is not granted. Please grant permission to record.'
//                   : isRecording
//                   ? 'Recording your response...'
//                   : recordedBlob
//                   ? 'Recording completed. You can re-record if needed.'
//                   : showRecordingPrompt
//                   ? 'Ready to record! Click the microphone to start.'
//                   : 'Click to start recording your retelling'}
//               </Typography>
//               {recordedBlob && (
//                 <Chip label="Recording Ready" color="success" variant="outlined" />
//               )}
//               {micPermission === false && (
//                 <Button variant="outlined" size="small" startIcon={<Help />} onClick={() => alert('Please go to your browser settings and allow microphone access.')}>
//                   Help
//                 </Button>
//               )}
//             </Stack>
//           </Paper>

//           <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
//             <Button
//               variant="contained"
//               onClick={handleSubmit}
//               sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
//               disabled={!recordedBlob}
//             >
//               Submit
//             </Button>
//             <Button variant="outlined" startIcon={<Refresh />} onClick={handleRedo}>
//               Re-do
//             </Button>
//             <Button variant="outlined" startIcon={<Translate />} onClick={handleTranslate}>
//               Translation
//             </Button>
//             <Button variant="outlined" onClick={handleShowAnswer}>
//               Answer
//             </Button>
//           </Stack>

//           <Stack direction="row" alignItems="center" justifyContent="space-between">
//             <Stack direction="row" spacing={1}>
//               <Chip label="× 5" color="error" variant="outlined" />
//               <Typography variant="body2" sx={{ color: '#666', display: 'flex', alignItems: 'center' }}>
//                 Question Counter
//               </Typography>
//             </Stack>

//             <Stack direction="row" spacing={1}>
//               <Button variant="contained" color="primary" onClick={handleSearch}>
//                 Search
//               </Button>
//               <Button variant="contained" color="success" onClick={handlePrevious}>
//                 Previous
//               </Button>
//               <Button
//                 variant="contained"
//                 color="success"
//                 onClick={() => setShowTopicSelector(true)}
//                 endIcon={<ArrowForward />}
//               >
//                 Next
//               </Button>
//             </Stack>
//           </Stack>
//         </CardContent>
//       </Card>

//       <TopicSelectionDrawer
//         open={showTopicSelector}
//         onClose={() => setShowTopicSelector(false)}
//         onSelect={handleTopicSelect}
//         topics={audioTopics}
//         title="Select Audio Topic"
//       />

//       <audio
//         ref={audioRef}
//         onLoadedMetadata={handleLoadedMetadata}
//         onError={handleAudioError}
//       >
//         <source src={selectedTopic.link} type="audio/mpeg" />
//         <source src={selectedTopic.link.replace('.mp3', '.ogg')} type="audio/ogg" />
//         <p>Your browser does not support the audio element.</p>
//       </audio>
//     </Box>
//   );
// };

// export default ReTellLeacture;

interface PracticeTestsProps {
  user: User | null;
}

const useAudioRecording = (preparationTime: number | null, recordingTime = 40000) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
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

        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
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

export const ReTellLeacture: React.FC<PracticeTestsProps> = ({ user }) => {
  const [selectedTopic, setSelectedTopic] = useState<LectureTopic>(audioTopics[0]);
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(655);
  const [studentName] = useState('Rachel Carson');
  const [testedCount] = useState(33);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAttempts, setShowAttempts] = useState(false);
  const [preparationTime, setPreparationTime] = useState<number | null>(null);
  const [showRecordingPrompt, setShowRecordingPrompt] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [attempts, setAttempts] = useState<UserAttempt[]>([]);

  const audioRecording = useAudioRecording(preparationTime, selectedTopic.recordingTime * 1000);
  const prepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const completedQuestions = attempts.length;

  // Load attempts from localStorage on mount
  useEffect(() => {
    const savedAttempts = localStorage.getItem('retellLectureAttempts');
    if (savedAttempts) {
      try {
        setAttempts(JSON.parse(savedAttempts));
      } catch (error) {
        console.error('Failed to parse retellLectureAttempts from localStorage:', error);
        localStorage.removeItem('retellLectureAttempts');
      }
    }
  }, []);

  // Save attempt to localStorage when recording is available
  useEffect(() => {
    if (audioRecording.recordedBlob && audioRecording.recordedAudioUrl) {
      const attempt: UserAttempt = {
        questionId: selectedTopic.id,
        recordedAudioUrl: audioRecording.recordedAudioUrl,
        timestamp: new Date().toISOString(),
      };
      setAttempts((prev) => {
        const newAttempts = [...prev, attempt];
        try {
          localStorage.setItem('retellLectureAttempts', JSON.stringify(newAttempts));
        } catch (error) {
          console.error('Failed to save retellLectureAttempts to localStorage:', error);
        }
        return newAttempts;
      });
    }
  }, [audioRecording.recordedBlob, audioRecording.recordedAudioUrl, selectedTopic.id]);

  // Handle topic selection
  const handleTopicSelect = (topic: any) => {
    setSelectedTopic(topic);
    setPreparationTime(null);
    setShowRecordingPrompt(false);
    audioRecording.resetRecording();
    setAudioError(null);
    setQuestionNumber(audioTopics.findIndex(t => t.id === topic.id) + 655);
  };

  // Handle submit
  const handleSubmit = () => {
    console.log('handleSubmit called');
    if (audioRecording.recordedBlob) {
      alert('Recording submitted successfully! Score will be available after processing.');
      setQuestionNumber((prev) => prev + 1);
      audioRecording.resetRecording();
      setPreparationTime(null);
      setShowRecordingPrompt(false);
    } else {
      alert('Please record your retelling before submitting.');
    }
  };

  // Action handlers
  const handleShowAnswer = () => {
    console.log('handleShowAnswer called');
    setShowAnswer(true);
  };
  const handleTranslate = () => {
    console.log('handleTranslate called');
    setShowTranslate(true);
  };
  const handleSearch = () => {
    console.log('handleSearch called');
    setShowTopicSelector(true);
  };
  const handleViewAttempts = () => {
    console.log('handleViewAttempts called');
    setShowAttempts(true);
  };

  const handlePrevious = () => {
    console.log('handlePrevious called');
    const currentIndex = audioTopics.findIndex(t => t.id === selectedTopic.id);
    if (currentIndex > 0) {
      handleTopicSelect(audioTopics[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    console.log('handleNext called');
    const currentIndex = audioTopics.findIndex(t => t.id === selectedTopic.id);
    if (currentIndex < audioTopics.length - 1) {
      handleTopicSelect(audioTopics[currentIndex + 1]);
    } else {
      setShowTopicSelector(true);
    }
  };

  const handleRedo = () => {
    console.log('handleRedo called');
    audioRecording.resetRecording();
    setPreparationTime(null);
    setShowRecordingPrompt(false);
    if (prepTimerRef.current) {
      clearTimeout(prepTimerRef.current);
    }
    console.log('Re-do triggered, state reset');
  };

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
  const filteredTopics = audioTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.speaker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', p: isMobile ? 1 : 2 }}>
      {/* Stage Goal Banner */}
      <StageGoalBanner />

      {/* Progress Display */}
      <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
        Progress: {completedQuestions}/{audioTopics.length} lectures attempted
      </Typography>

      {/* Main Content */}
      <Card sx={{ maxWidth: isMobile ? '100%' : 1200, mx: 'auto', mb: 3 }}>
        <CardContent sx={{ p: isMobile ? 2 : 4 }}>
          {/* Header */}
          <Stack
            direction={isMobile ? 'column' : 'row'}
            alignItems={isMobile ? 'flex-start' : 'center'}
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                bgcolor: '#ff9800',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              RL
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 'bold', color: '#333' }}>
                  Re-tell Lecture
                </Typography>
                <Chip onClick={() => {}} label="Study Guide" color="primary" size="small" />
              </Stack>
              <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                You will hear a lecture. After listening to the lecture, in {selectedTopic.preparationTime} seconds, please speak into the microphone and retell what you have just heard in your own words. You will have {selectedTopic.recordingTime} seconds to give your response.
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
          {audioError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography>{audioError}</Typography>
            </Alert>
          )}

          {/* Scoring Unavailable Notice */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography>Scoring is currently unavailable and will be processed after submission.</Typography>
          </Alert>

          {/* Text-to-Speech Player */}
          <Paper sx={{ p: isMobile ? 2 : 3, mb: 3, bgcolor: '#fafafa' }}>
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                Lecture: {selectedTopic.title}
              </Typography>
              <TextToSpeech
                text={selectedTopic.audioText}
                autoPlay={false}
                onStart={() => console.log('Lecture audio started')}
                onEnd={() => {
                  setPreparationTime(selectedTopic.preparationTime);
                  console.log(`Lecture audio ended, starting ${selectedTopic.preparationTime}-second preparation timer`);
                }}
                onError={(error) => {
                  setAudioError(error);
                  console.error('TextToSpeech error:', error);
                }}
              />
              <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                Transcript: {selectedTopic.audioText}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  label={selectedTopic.difficulty}
                  size="small"
                  color={
                    selectedTopic.difficulty === 'Beginner' ? 'success' :
                    selectedTopic.difficulty === 'Intermediate' ? 'warning' : 'error'
                  }
                />
                <Chip
                  label={selectedTopic.category}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={`Speaker: ${selectedTopic.speaker}`}
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </Stack>
          </Paper>

          {/* Preparation Timer */}
          {preparationTime !== null && preparationTime > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography>Preparation Time: {preparationTime} seconds</Typography>
              <LinearProgress
                variant="determinate"
                value={(preparationTime / selectedTopic.preparationTime) * 100}
                sx={{ mt: 1 }}
              />
            </Box>
          )}

          {/* Recording Section */}
          <RecordingSection
            isRecording={audioRecording.isRecording}
            recordedBlob={audioRecording.recordedBlob}
            recordedAudioUrl={audioRecording.recordedAudioUrl}
            micPermission={audioRecording.micPermission}
            showRecordingPrompt={showRecordingPrompt}
            preparationTime={preparationTime}
            recordingType="retelling"
            recordingTime={selectedTopic.recordingTime}
            onToggleRecording={audioRecording.toggleRecording}
          />

          {/* Action Buttons */}
          <Stack
            direction={isMobile ? 'column' : 'row'}
            spacing={isMobile ? 1 : 2}
            sx={{ mt: 2, flexWrap: 'wrap' }}
          >
            <ActionButtons
              recordedBlob={audioRecording.recordedBlob}
              onSubmit={handleSubmit}
              onRedo={handleRedo}
              onTranslate={handleTranslate}
              onShowAnswer={handleShowAnswer}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={handleViewAttempts}
              aria-label="View past attempts"
              sx={{ minWidth: isMobile ? '100%' : 'auto', py: isMobile ? 1.5 : 1 }}
            >
              View Attempts
            </Button>
          </Stack>

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
        topics={audioTopics}
        title="Select Lecture Topic"
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
            <strong>Lecture:</strong> {selectedTopic.title}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Expected Answer:</strong> {selectedTopic.expectedAnswer}
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
            This is a sample answer for the selected lecture topic. In a real implementation, 
            this would contain key points or guidance for a complete retelling.
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
            Translation feature will help you understand the lecture content in your preferred language.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTranslate(false)}>Cancel</Button>
          <Button variant="contained">Translate</Button>
        </DialogActions>
      </Dialog>

      {/* Search Dialog */}
      {/* <Dialog open={showSearch} onClose={() => setShowSearch(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Search Lectures</Typography>
            <IconButton onClick={() => setShowSearch(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Search by lecture or speaker..."
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
      </Dialog> */}

      {/* Past Attempts Dialog */}
      <Dialog open={showAttempts} onClose={() => setShowAttempts(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Past Attempts</Typography>
            <IconButton onClick={() => setShowAttempts(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {attempts.length === 0 ? (
            <Typography variant="body2">No attempts recorded yet.</Typography>
          ) : (
            <List>
              {attempts.map((attempt, index) => {
                const lecture = audioTopics.find(q => q.id === attempt.questionId);
                return (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Lecture: ${lecture?.title || 'Unknown'}`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            Time: {new Date(attempt.timestamp).toLocaleString()}
                          </Typography>
                          {attempt.recordedAudioUrl && (
                            <audio controls src={attempt.recordedAudioUrl} style={{ width: '100%', marginTop: '8px' }}>
                              Your browser does not support the audio element.
                            </audio>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            onClick={() => {
              setAttempts([]);
              localStorage.removeItem('retellLectureAttempts');
            }}
          >
            Clear Attempts
          </Button>
          <Button onClick={() => setShowAttempts(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};