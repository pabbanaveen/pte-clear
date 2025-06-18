import React from 'react';
import { 
  Paper, 
  Stack, 
  IconButton, 
  Typography, 
  Chip, 
  Button,
  Alert 
} from '@mui/material';
import { Mic, MicOff, Help } from '@mui/icons-material';

interface RecordingSectionProps {
  isRecording: boolean;
  recordedBlob: Blob | null;
  micPermission: boolean | null;
  showRecordingPrompt: boolean;
  preparationTime: number | null;
  recordingType: 'retelling' | 'answer';
  onToggleRecording: () => void;
}

const RecordingSection: React.FC<RecordingSectionProps> = ({
  isRecording,
  recordedBlob,
  micPermission,
  showRecordingPrompt,
  preparationTime,
  recordingType,
  onToggleRecording,
}) => {
  const getRecordingMessage = () => {
    if (micPermission === null) return 'Checking microphone permission...';
    if (micPermission === false) return 'Microphone permission is not granted. Please grant permission to record.';
    if (isRecording) return `Recording your ${recordingType}...`;
    if (recordedBlob) return `${recordingType === 'retelling' ? 'Recording' : 'Answer'} ${recordedBlob ? 'completed' : 'recorded'}. You can re-record if needed.`;
    if (showRecordingPrompt) return `Ready to record! Click the microphone to start.`;
    return `Click to start recording your ${recordingType}`;
  };

  const getChipLabel = () => {
    return recordingType === 'retelling' ? 'Recording Ready' : 'Answer Ready';
  };

  return (
    <>
      {preparationTime !== null && preparationTime > 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography>
            Prepare to {recordingType === 'retelling' ? 'retell the lecture' : 'answer the question'}. 
            Recording will start in {preparationTime} seconds...
          </Typography>
        </Alert>
      )}

      {showRecordingPrompt && !isRecording && !recordedBlob && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography>
            Time to record! Click the microphone button below to start recording your {recordingType}.
          </Typography>
        </Alert>
      )}

      <Paper 
        sx={{ 
          p: 3, 
          mb: 3, 
          bgcolor: isRecording 
            ? '#ffebee' 
            : showRecordingPrompt && !recordedBlob 
              ? '#e8f5e8' 
              : '#fafafa' 
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton
            onClick={onToggleRecording}
            sx={{
              bgcolor: isRecording 
                ? '#f44336' 
                : showRecordingPrompt && !recordedBlob 
                  ? '#4caf50' 
                  : micPermission === false 
                    ? '#d3d3d3' 
                    : '#666',
              color: 'white',
              '&:hover': { 
                bgcolor: isRecording 
                  ? '#d32f2f' 
                  : showRecordingPrompt && !recordedBlob 
                    ? '#388e3c' 
                    : micPermission === false 
                      ? '#b0b0b0' 
                      : '#555' 
              },
              transition: 'background-color 0.3s',
              cursor: micPermission === false ? 'not-allowed' : 'pointer',
            }}
            disabled={micPermission === false}
          >
            {isRecording ? <MicOff /> : <Mic />}
          </IconButton>
          
          <Typography variant="body1" sx={{ flexGrow: 1 }}>
            {getRecordingMessage()}
          </Typography>
          
          {recordedBlob && (
            <Chip onClick={() => { }} label={getChipLabel()} color="success" variant="outlined" />
          )}
          
          {micPermission === false && (
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<Help />} 
              onClick={() => alert('Please go to your browser settings and allow microphone access.')}
            >
              Help
            </Button>
          )}
        </Stack>
      </Paper>
    </>
  );
};

export default RecordingSection;