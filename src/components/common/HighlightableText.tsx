import React from 'react';
import {
  Box,
  Typography,
  useTheme
} from '@mui/material';

export interface HighlightableWord {
  id: string;
  text: string;
  isIncorrect?: boolean;
  isHighlighted?: boolean;
  isCorrectlyHighlighted?: boolean;
  position: number;
}

export interface HighlightableTextProps {
  text: string;
  incorrectWords?: string[];
  highlightedWords?: Set<string>;
  showCorrectAnswers?: boolean;
  onWordClick?: (wordId: string, word: string) => void;
  disabled?: boolean;
  fontSize?: string | object;
  lineHeight?: number;
  wordSpacing?: number;
}

const HighlightableText: React.FC<HighlightableTextProps> = ({
  text,
  incorrectWords = [],
  highlightedWords = new Set(),
  showCorrectAnswers = false,
  onWordClick,
  disabled = false,
  fontSize = { xs: '16px', sm: '18px', md: '20px' },
  lineHeight = 1.8,
  wordSpacing = 4
}) => {
  const theme = useTheme();

  // Split text into words and create word objects
  const words = text.split(/(\s+)/).map((part, index) => {
    const cleanWord = part.trim().toLowerCase();
    const wordId = `word-${index}-${cleanWord}`;
    
    // Skip whitespace
    if (!part.trim()) {
      return {
        id: `space-${index}`,
        text: part,
        isSpace: true,
        position: index
      };
    }

    const isIncorrect = incorrectWords.some(incorrect => 
      incorrect.toLowerCase() === cleanWord
    );
    const isHighlighted = highlightedWords.has(wordId);

    return {
      id: wordId,
      text: part,
      isIncorrect,
      isHighlighted,
      isCorrectlyHighlighted: showCorrectAnswers ? (isIncorrect && isHighlighted) : undefined,
      position: index,
      isSpace: false
    };
  });

  const getWordStyles = (word: any) => {
    if (word.isSpace) return {};

    const baseStyles = {
      display: 'inline-block',
      margin: `0 ${wordSpacing}px`,
      padding: '2px 4px',
      borderRadius: '4px',
      cursor: disabled ? 'default' : 'pointer',
      userSelect: 'none',
      transition: 'all 0.2s ease',
      fontSize: fontSize,
      lineHeight: lineHeight,
      fontWeight: 'normal',
      '&:hover': disabled ? {} : {
        backgroundColor: theme.palette.primary.light + '20',
        transform: 'scale(1.02)',
      }
    };

    if (showCorrectAnswers) {
      // Show results state
      if (word.isIncorrect && word.isHighlighted) {
        // Correctly identified incorrect word
        return {
          ...baseStyles,
          backgroundColor: theme.palette.success.light,
          color: theme.palette.success.contrastText,
          border: `2px solid ${theme.palette.success.main}`,
          fontWeight: 'bold',
        };
      } else if (word.isIncorrect && !word.isHighlighted) {
        // Missed incorrect word
        return {
          ...baseStyles,
          backgroundColor: theme.palette.error.light,
          color: theme.palette.error.contrastText,
          border: `2px solid ${theme.palette.error.main}`,
          fontWeight: 'bold',
          textDecoration: 'underline',
        };
      } else if (!word.isIncorrect && word.isHighlighted) {
        // Incorrectly highlighted correct word
        return {
          ...baseStyles,
          backgroundColor: theme.palette.warning.light,
          color: theme.palette.warning.contrastText,
          border: `2px solid ${theme.palette.warning.main}`,
          fontWeight: 'bold',
        };
      } else {
        // Correct word, correctly not highlighted
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: theme.palette.text.primary,
        };
      }
    } else {
      // Interactive state
      if (word.isHighlighted) {
        return {
          ...baseStyles,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          fontWeight: 'bold',
          transform: 'scale(1.02)',
        };
      } else {
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: theme.palette.text.primary,
        };
      }
    }
  };

  const handleWordClick = (word: any) => {
    if (disabled || word.isSpace || !onWordClick) return;
    onWordClick(word.id, word.text);
  };

  return (
    <Box sx={{ 
      p: 3, 
      lineHeight: lineHeight,
      wordBreak: 'break-word',
      userSelect: 'none'
    }}>
      {words.map((word) => (
        <Typography
          key={word.id}
          component="span"
          onClick={() => handleWordClick(word)}
          sx={getWordStyles(word)}
        >
          {word.text}
        </Typography>
      ))}
    </Box>
  );
};

export default HighlightableText;