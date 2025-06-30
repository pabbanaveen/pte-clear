// Export all common components from a single entry point

// Layout and Structure
export { default as PracticeCard } from './PracticeCard';
export type { PracticeCardProps } from './PracticeCard';

// User Interface
export { default as TimerDisplay } from './TimerDisplay';
export type { TimerDisplayProps } from './TimerDisplay';

export { default as ProgressIndicator } from './ProgressIndicator';
export type { ProgressIndicatorProps } from './ProgressIndicator';

export { default as ContentDisplay } from './ContentDisplay';
export type { ContentDisplayProps } from './ContentDisplay';

export { default as InputField } from './InputField';
export type { InputFieldProps } from './InputField';

export { default as HighlightableText } from './HighlightableText';
export type { HighlightableTextProps, HighlightableWord } from './HighlightableText';

// Dialogs
export { default as DialogWrapper } from './DialogWrapper';
export type { DialogWrapperProps } from './DialogWrapper';

export { default as ResultsDialog } from './ResultsDialog';
export type { ResultsDialogProps, QuestionResult } from './ResultsDialog';

export { default as AnswerDialog } from './AnswerDialog';
export type { AnswerDialogProps } from './AnswerDialog';

export { default as TranslationDialog } from './TranslationDialog';
export type { TranslationDialogProps } from './TranslationDialog';

// Drag and Drop
export { 
  DroppableBlank, 
  DraggableWord, 
  DroppableWordBank 
} from './DragDropBlank';
export type { 
  BlankPosition, 
  WordBankWord 
} from './DragDropBlank';

// Styles and Animations
export {
  StyledCard,
  GradientBackground,
  AnimatedButton,
  PulseAnimation,
  GlowEffect,
  FadeIn,
  SlideIn,
  responsiveTypography,
  spacing,
  breakpoints,
  colors
} from './CommonStyles';

// Existing components (re-exported for consistency)
// export { default as ActionButtons } from './ActionButtons';
// export { default as NavigationSection } from './NavigationSection';
// export { default as QuestionHeader } from './QuestionHeader';
// export { default as RecordingSection } from './RecordingSection';
// export { default as StageGoalBanner } from './StageGoalBanner';
// export { default as AudioPlayer } from './AudioPlayer';
// export { default as TextToSpeech } from './TextToSpeech';
// export { default as InstructionsCard } from './InstructionsCard';
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as TopicSelectionDrawer } from './TopicSelectionDrawer';
export { default as CustomButton } from './CustomButton';
export { default as CustomCard } from './CustomCard';
export { default as FloatingSearchButton } from './FloatingSearchButton';