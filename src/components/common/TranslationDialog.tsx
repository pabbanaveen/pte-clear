import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Alert
} from '@mui/material';
import DialogWrapper from './DialogWrapper';

export interface TranslationDialogProps {
  open: boolean;
  onClose: () => void;
  onTranslate?: (language: string) => void;
  title?: string;
  description?: string;
  defaultLanguage?: string;
  languages?: Array<{
    value: string;
    label: string;
  }>;
  isLoading?: boolean;
  translatedText?: string;
}

const defaultLanguages = [
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'korean', label: 'Korean' },
  { value: 'portuguese', label: 'Portuguese' },
  { value: 'italian', label: 'Italian' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'arabic', label: 'Arabic' }
];

const TranslationDialog: React.FC<TranslationDialogProps> = ({
  open,
  onClose,
  onTranslate,
  title = "Translation Options",
  description = "Translation feature will help you understand the content in your preferred language.",
  defaultLanguage = 'spanish',
  languages = defaultLanguages,
  isLoading = false,
  translatedText
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);

  const handleTranslate = () => {
    if (onTranslate) {
      onTranslate(selectedLanguage);
    }
  };

  return (
    <DialogWrapper
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="sm"
      defaultActions={{
        cancelText: "Cancel",
        onCancel: onClose,
        confirmText: isLoading ? "Translating..." : "Translate",
        onConfirm: onTranslate ? handleTranslate : undefined,
        confirmColor: "primary"
      }}
    >
      <Box>
        {/* Language Selection */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Language</InputLabel>
          <Select 
            value={selectedLanguage} 
            label="Select Language"
            onChange={(e) => setSelectedLanguage(e.target.value)}
            disabled={isLoading}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.value} value={lang.value}>
                {lang.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Description */}
        <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
          {description}
        </Typography>

        {/* Loading State */}
        {isLoading && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Translating content, please wait...
          </Alert>
        )}

        {/* Translated Content */}
        {translatedText && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Translated Text:
            </Typography>
            <Box sx={{ 
              p: 2, 
              bgcolor: '#f5f5f5', 
              borderRadius: 2,
              border: '1px solid #e0e0e0'
            }}>
              <Typography variant="body2">
                {translatedText}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Feature Notice */}
        {!onTranslate && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Translation feature is coming soon! This will help you understand content in multiple languages.
          </Alert>
        )}
      </Box>
    </DialogWrapper>
  );
};

export default TranslationDialog;