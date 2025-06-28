import React, { useEffect, useState } from 'react';
import { Stack, Button, Box, useMediaQuery, useTheme } from '@mui/material';
import { Help, Refresh, Send, Translate } from '@mui/icons-material';

interface ActionButtonsProps {
  hasResponse?: boolean
  recordedBlob: Blob | null;
  onSubmit: () => void;
  onRedo: () => void;
  onTranslate: () => void;
  onShowAnswer: () => void;
  handleViewAttempts?: () => void;
  additionalActions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'contained' | 'outlined' | 'text';
    color?: 'primary' | 'secondary' | 'info' | 'warning' | 'error';
  }>;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  hasResponse,
  recordedBlob,
  onSubmit,
  onRedo,
  onTranslate,
  onShowAnswer,
  handleViewAttempts,
  additionalActions = [],
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


  const [disableSave, setDisableSave] = useState<boolean>();
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
    <Stack
      direction={isMobile ? 'column' : 'row'}
      spacing={isMobile ? 1 : 2}
      sx={{ flexWrap: 'wrap' }}
    >
      <Button
        variant="contained"
        color="primary"
        startIcon={<Send />}
        onClick={() => {
          console.log('Submit button clicked');
          onSubmit();
        }}
        disabled={disableSave}
        aria-label="Submit recording"
        sx={{ minWidth: isMobile ? '100%' : 'auto', py: isMobile ? 1.5 : 1 }}
      >
        Submit
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        startIcon={<Refresh />}
        onClick={() => {
          console.log('Redo button clicked');
          onRedo();
        }}
        aria-label="Redo recording"
        sx={{ minWidth: isMobile ? '100%' : 'auto', py: isMobile ? 1.5 : 1 }}
      >
        Re-do
      </Button>
      <Button
        variant="outlined"
        color="info"
        startIcon={<Translate />}
        onClick={() => {
          console.log('Translate button clicked');
          onTranslate();
        }}
        aria-label="Translate question"
        sx={{ minWidth: isMobile ? '100%' : 'auto', py: isMobile ? 1.5 : 1 }}
      >
        Translate
      </Button>
      <Button
        variant="outlined"
        color="info"
        startIcon={<Help />}
        onClick={() => {
          console.log('Show Answer button clicked');
          onShowAnswer();
        }}
        aria-label="Show sample answer"
        sx={{ minWidth: isMobile ? '100%' : 'auto', py: isMobile ? 1.5 : 1 }}
      >
        Show Answer
      </Button>
      {/* View Attempts Button */}
      {handleViewAttempts && (
        <Button
          variant="outlined"
          color="primary"
          onClick={handleViewAttempts}
          sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
        >
          View Attempts
        </Button>
      )}
      {/* Additional Actions */}
      {additionalActions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || 'outlined'}
          color={action.color || 'info'}
          onClick={action.onClick}
          sx={{ minWidth: isMobile ? '100%' : 'auto', py: isMobile ? 1.5 : 1 }}
        >
          {action.label}
        </Button>
      ))}
    </Stack>
  );
};

export default ActionButtons;