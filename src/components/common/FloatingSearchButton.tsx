import React, { useState } from 'react';
import {
  Fab,
  Zoom,
  useTheme,
  useMediaQuery,
  Box,
  IconButton
} from '@mui/material';
import { Search, ChevronLeft, Menu } from '@mui/icons-material';
import TopicSelectionDrawer from './TopicSelectionDrawer';

interface FloatingSearchButtonProps {
  topics?: any[];
  title?: string;
  type?: string;
  onTopicSelect?: (topic: any) => void;
  disabled?: boolean;
}

const FloatingSearchButton: React.FC<FloatingSearchButtonProps> = ({
  topics = [],
  title = 'Search Topics',
  type = 'general',
  onTopicSelect,
  disabled = false
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearchOpen = () => {
    setSearchOpen(true);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
  };

  const handleTopicSelect = (topic: any) => {
    if (onTopicSelect) {
      onTopicSelect(topic);
    }
    setSearchOpen(false);
  };

  if (disabled || topics.length === 0) {
    return null;
  }

  return (
    <>
      {/* Floating Search Button - Fixed to viewport edge */}
      <Zoom in={true} timeout={300}>
        <Box
          sx={{
            position: 'fixed',
            right: searchOpen ? 0 : 0, // When open, align to edge; when closed, slight overlap
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1300, // Higher than drawer backdrop
            transition: 'right 0.3s ease-in-out',
          }}
        >
          {searchOpen ? (
            // Close Button (Left Arrow)
            <IconButton
              onClick={handleSearchClose}
              sx={{
                backgroundColor: 'rgb(255, 102, 102)',
                color: 'white',
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                borderRadius: '50% 0 0 50%', // Rounded on left, flat on right
                '&:hover': {
                  backgroundColor: 'rgb(255, 82, 82)',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 12px rgba(255, 102, 102, 0.4)',
                mr: 0,
              }}
            >
              <ChevronLeft sx={{ fontSize: { xs: '20px', sm: '24px' } }} />
            </IconButton>
          ) : (
            // Search Button (Menu Icon)
            <Fab
              onClick={handleSearchOpen}
              sx={{
                backgroundColor: 'rgb(255, 102, 102)',
                color: 'white',
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 },
                transform: 'translateX(50%)', // Half outside viewport
                '&:hover': {
                  backgroundColor: 'rgb(255, 82, 82)',
                  transform: 'translateX(50%) scale(1.05)',
                  boxShadow: '0 6px 16px rgba(255, 102, 102, 0.5)',
                },
                '&:active': {
                  transform: 'translateX(50%) scale(0.95)',
                },
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 12px rgba(255, 102, 102, 0.4)',
              }}
              size={isMobile ? 'small' : 'medium'}
            >
              <Menu sx={{ fontSize: { xs: '20px', sm: '24px' } }} />
            </Fab>
          )}
        </Box>
      </Zoom>

      {/* Search Drawer */}
      {searchOpen && (
        <TopicSelectionDrawer
          open={searchOpen}
          onClose={handleSearchClose}
          onSelect={handleTopicSelect}
          topics={topics}
          title={title}
          type={type}
        />
      )}
    </>
  );
};

export default FloatingSearchButton;