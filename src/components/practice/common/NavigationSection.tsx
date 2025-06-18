import React from 'react';
import { Stack, Button, Chip, Typography, Box } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

interface NavigationSectionProps {
  onSearch: () => void;
  onPrevious: () => void;
  onNext: () => void;
  questionNumber: number;
}

const NavigationSection: React.FC<NavigationSectionProps> = ({
  onSearch,
  onPrevious,
  onNext,
  questionNumber,
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      {/* Mobile: Stack vertically, Desktop: Stack horizontally */}
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        alignItems={{ xs: 'stretch', md: 'center' }} 
        justifyContent={{ xs: 'center', md: 'space-between' }}
        spacing={{ xs: 2, md: 0 }}
      >
        {/* Question Counter - Always visible */}
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Chip onClick={() => { }} label="× 5" color="error" variant="outlined" size="small" />
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666', 
              display: 'flex', 
              alignItems: 'center',
              fontSize: { xs: '12px', sm: '14px' },
              textAlign: 'center'
            }}
          >
            Question Counter
          </Typography>
        </Stack>

        {/* Navigation Buttons */}
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={{ xs: 1, sm: 1 }}
          sx={{ 
            width: { xs: '100%', md: 'auto' },
            alignItems: 'stretch'
          }}
        >
          <Button 
            variant="contained" 
            color="primary" 
            onClick={onSearch}
            sx={{ 
              minHeight: '36px',
              fontSize: { xs: '12px', sm: '14px' },
              px: { xs: 2, sm: 3 }
            }}
            size="small"
          >
            Search
          </Button>
          <Button 
            variant="contained" 
            color="success" 
            onClick={onPrevious}
            disabled={questionNumber <= 1}
            sx={{ 
              minHeight: '36px',
              fontSize: { xs: '12px', sm: '14px' },
              px: { xs: 2, sm: 3 }
            }}
            size="small"
          >
            Previous
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={onNext}
            endIcon={<ArrowForward sx={{ fontSize: { xs: '16px', sm: '20px' } }} />}
            sx={{ 
              minHeight: '36px',
              fontSize: { xs: '12px', sm: '14px' },
              px: { xs: 2, sm: 3 }
            }}
            size="small"
          >
            Next
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default NavigationSection;