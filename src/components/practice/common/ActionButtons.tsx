import React, { useEffect, useState } from 'react';
import { Stack, Button, Box } from '@mui/material';
import { Refresh, Translate } from '@mui/icons-material';

interface ActionButtonsProps {
    hasResponse? : boolean
  recordedBlob: Blob | null;
  onSubmit: () => void;
  onRedo: () => void;
  onTranslate: () => void;
  onShowAnswer: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
    hasResponse,
  recordedBlob,
  onSubmit,
  onRedo,
  onTranslate,
  onShowAnswer,
}) => {
    const [dsableSave, setDisableSave] = useState<boolean>();
    useEffect(() => {
        console.log(recordedBlob, "asfafadfdf")
        if (recordedBlob == null && hasResponse) {
            setDisableSave(!hasResponse)
        } else if (recordedBlob) {
            console.log(!recordedBlob, "asfafadfdf")
            setDisableSave(!recordedBlob)
        }
    }, [recordedBlob, hasResponse]);
   
  return (
    <Box sx={{ mb: 3 }}>
      {/* Mobile: Stack vertically, Desktop: Stack horizontally */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={{ xs: 1, sm: 2 }}
        sx={{ 
          width: '100%',
          alignItems: 'stretch'
        }}
      >
        <Button
          variant="contained"
          onClick={onSubmit}
          sx={{ 
            bgcolor: '#4caf50', 
            '&:hover': { bgcolor: '#388e3c' },
            minHeight: '40px',
            fontSize: { xs: '14px', sm: '16px' }
          }}
          disabled={dsableSave}
          fullWidth
        >
          Submit
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<Refresh />} 
          onClick={onRedo}
          sx={{ 
            minHeight: '40px',
            fontSize: { xs: '14px', sm: '16px' }
          }}
          fullWidth
        >
          Re-do
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<Translate />} 
          onClick={onTranslate}
          sx={{ 
            minHeight: '40px',
            fontSize: { xs: '14px', sm: '16px' }
          }}
          fullWidth
        >
          Translation
        </Button>
        <Button 
          variant="outlined" 
          onClick={onShowAnswer}
          sx={{ 
            minHeight: '40px',
            fontSize: { xs: '14px', sm: '16px' }
          }}
          fullWidth
        >
          Answer
        </Button>
      </Stack>
    </Box>
  );
};

export default ActionButtons;