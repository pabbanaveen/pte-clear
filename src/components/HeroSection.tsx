import React from 'react';
import { Box, Container, Typography, Button, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }:HeroSectionProps) => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #E0F2F1 0%, #B2DFDB 100%)',
        py: 8,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid>
            <Typography variant="h1" sx={{ mb: 2, fontWeight: 700 }}>
              Practice PTE Academic & PTE Core with{' '}
              <Box component="span" sx={{ color: 'primary.main' }}>
                AI Scorings
              </Box>{' '}
              for{' '}
              <Box component="span" sx={{ color: 'secondary.main' }}>
                FREE
              </Box>
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
              Join 100,000 PTE test takers to practice
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={onGetStarted}
              sx={{ py: 2, px: 4, fontSize: '1.1rem' }}
            >
              Practice Now
            </Button>
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip onClick={() => { }} label="NEW" color="secondary" size="small" />
              <Typography variant="body2" color="text.secondary">
                AI-powered instant scoring
              </Typography>
            </Box>
          </Grid>
          <Grid >
            <Box
              component="img"
              src="https://images.pexels.com/photos/18069239/pexels-photo-18069239.png"
              alt="PTE Practice Platform"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
export default HeroSection;
