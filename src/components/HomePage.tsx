import React from 'react';
import HeroSection from './HeroSection';
import AIPracticeSection from './AIPracticeSection';
import StudyToolsSection from './StudyToolsSection';
import StudyMaterialsSection from './StudyMaterialsSection';
import KnowledgeSections from './KnowledgeSections';
import { Box } from '@mui/material';

interface HomePageProps {
  onGetStarted: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => (
  <Box>
    <HeroSection onGetStarted={onGetStarted} />
    <AIPracticeSection />
    <StudyToolsSection />
    <StudyMaterialsSection />
    <KnowledgeSections />
  </Box>
);
export default HomePage;

