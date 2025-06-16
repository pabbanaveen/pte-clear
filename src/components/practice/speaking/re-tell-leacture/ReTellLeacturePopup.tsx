import React from 'react';
import { Modal, Box, Typography, List, ListItem, ListItemText } from '@mui/material';

interface RetellLectureModalProps {
  open: boolean;
  onClose: () => void;
  onSelectLecture: (lecture: string) => void;
}

const lectureOptions = [
  'Lecture 1: The Impact of Climate Change',
  'Lecture 2: Advances in Artificial Intelligence',
  'Lecture 3: The History of Space Exploration',
  'Lecture 4: Sustainable Energy Solutions',
  'Lecture 5: The Evolution of Language',
];

const RetellLectureModal: React.FC<RetellLectureModalProps> = ({ open, onClose, onSelectLecture }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="retell-lecture-modal-title"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          width: { xs: '90vw', sm: '500px' },
          maxHeight: '80vh',
          overflowY: 'auto',
          p: 3,
        }}
      >
        <Typography
          id="retell-lecture-modal-title"
          variant="h6"
          fontWeight="bold"
          color="#1976D2"
          gutterBottom
          sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
        >
          Select a Lecture to Re-tell
        </Typography>
        <List>
          {lectureOptions.map((lecture, index) => (
            <ListItem
              key={index}
              onClick={() => onSelectLecture(lecture)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                color: '#333',
                '&:hover': {
                  background: '#e3f2fd',
                  cursor: 'pointer',
                },
              }}
            >
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: { xs: '1rem', sm: '0.9rem' } }}>
                    {lecture}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Modal>
  );
};

export default RetellLectureModal;