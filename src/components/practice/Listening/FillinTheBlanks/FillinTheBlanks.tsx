import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box } from '@mui/material';
import {
  PracticeCard,
  TimerDisplay,
  ProgressIndicator,
  ResultsDialog,
  AnswerDialog,
  TranslationDialog,
  ContentDisplay,
  GradientBackground,
  TopicSelectionDrawer
} from '../../../common';
import InputField from '../../../common/InputField';
import { mockListeningPassages, mockStudentProgress } from './FillinTheBlanksMockData';
import { ListeningPassage, BlankPosition, TimerState, QuestionResult } from './FillinTheBlanksTypes';
import QuestionHeader from '../../common/QuestionHeader';
import ActionButtons from '../../common/ActionButtons';
import NavigationSection from '../../common/NavigationSection';
import AudioPlayer from '../../common/AudioPlayer';
import StageGoalBanner from '../../common/StageGoalBanner';

interface ListeningFillBlanksProps {}

const ListeningFillBlanks: React.FC<ListeningFillBlanksProps> = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [passage, setPassage] = useState<ListeningPassage>(mockListeningPassages[currentQuestionIndex]);
  const [showFillinBlanksSelector, setShowFillinBlanksSelector] = useState(false);

  // State management
  const [blanks, setBlanks] = useState<BlankPosition[]>(passage.blanks.map(blank => ({ ...blank })));
  const [timer, setTimer] = useState<TimerState>({
    timeRemaining: passage.timeLimit,
    isRunning: false, // Start as false, will be started when user first types
    warningThreshold: 30,
    autoSubmit: true,
  });
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(100);
  const [audioError, setAudioError] = useState<string | null>(null);
  
  const [showAnswer, setShowAnswer] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentResult, setCurrentResult] = useState<QuestionResult | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date>(new Date());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio setup
  useEffect(() => {
    if (passage.audioUrl) {
      audioRef.current = new Audio(passage.audioUrl);
      
      const audio = audioRef.current;
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      
      const handleError = () => {
        setAudioError('Failed to load audio file');
      };
      
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
        audio.pause();
      };
    }
  }, [passage.audioUrl]);

  // Sync state when passage changes
  useEffect(() => {
    setBlanks(passage.blanks.map(blank => ({ ...blank })));
    setTimer({
      timeRemaining: passage.timeLimit,
      isRunning: false,
      warningThreshold: 30,
      autoSubmit: true,
    });
    setIsSubmitted(false);
    setShowResults(false);
    setCurrentResult(null);
    setCurrentTime(0);
    setIsPlaying(false);
    
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
    
    startTimeRef.current = new Date();
  }, [passage]);

  // Timer functionality
  useEffect(() => {
    if (timer.isRunning && timer.timeRemaining > 0 && !isSubmitted) {
      timerRef.current = setTimeout(() => {
        setTimer(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
      }, 1000);
    } else if (timer.timeRemaining === 0 && timer.autoSubmit && !isSubmitted) {
      handleSubmit();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timer.timeRemaining, timer.isRunning, isSubmitted]);

  // Start timer when user first types
  const startTimerIfNeeded = useCallback(() => {
    if (!timer.isRunning && !isSubmitted) {
      setTimer(prev => ({ ...prev, isRunning: true }));
      startTimeRef.current = new Date();
    }
  }, [timer.isRunning, isSubmitted]);

  const studentProgress = mockStudentProgress;

  const handleNext = () => {
    if (currentQuestionIndex < mockListeningPassages.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      setPassage(mockListeningPassages[newIndex]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);
      setPassage(mockListeningPassages[newIndex]);
    }
  };

  const handleSearch = () => {
    setShowFillinBlanksSelector(true);
  };

  const handleFillinBlankSelect = (option: any) => {
    const newIndex = mockListeningPassages.findIndex(p => p.id === option.id);
    if (newIndex !== -1) {
      setCurrentQuestionIndex(newIndex);
      setPassage(option);
    }
    setShowFillinBlanksSelector(false);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const areAllBlanksFilled = useCallback((): boolean => {
    return blanks.every(blank => blank.filledWord && blank.filledWord.trim() !== '');
  }, [blanks]);

  // Audio controls
  const handleTogglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const volumeValue = Array.isArray(newValue) ? newValue[0] : newValue;
    setVolume(volumeValue);
    if (audioRef.current) {
      audioRef.current.volume = volumeValue / 100;
    }
  };

  // Handle text input change for blanks
  const handleBlankInputChange = (blankId: string, value: string) => {
    // Start timer on first input
    startTimerIfNeeded();
    
    setBlanks(prev => prev.map(blank => 
      blank.id === blankId 
        ? { ...blank, filledWord: value }
        : blank
    ));
  };

  const handleSubmit = () => {
    if (isSubmitted) return;

    setIsSubmitted(true);
    setTimer(prev => ({ ...prev, isRunning: false }));

    // Pause audio if playing
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    const endTime = new Date();
    const timeSpent = Math.floor((endTime.getTime() - startTimeRef.current.getTime()) / 1000);

    let correctAnswers = 0;
    const evaluatedBlanks = blanks.map(blank => {
      const isCorrect = blank.filledWord?.toLowerCase().trim() === blank.correctAnswer.toLowerCase().trim();
      if (isCorrect) correctAnswers++;
      return { ...blank, isCorrect };
    });

    const score = Math.round((correctAnswers / blanks.length) * passage.maxScore);

    const result: QuestionResult = {
      questionId: String(passage?.id),
      score,
      maxScore: passage.maxScore,
      correctAnswers,
      totalBlanks: blanks.length,
      completedAt: endTime,
      timeSpent,
      answers: evaluatedBlanks,
    };

    setBlanks(evaluatedBlanks);
    setCurrentResult(result);
    setShowResults(true);
  };

  const handleRedo = () => {
    setBlanks(passage.blanks.map(blank => ({ ...blank })));
    setTimer({
      timeRemaining: passage.timeLimit,
      isRunning: false,
      warningThreshold: 30,
      autoSubmit: true,
    });
    setIsSubmitted(false);
    setShowResults(false);
    setCurrentResult(null);
    setCurrentTime(0);
    setIsPlaying(false);
    
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
    
    startTimeRef.current = new Date();
  };

  const questionNumber = studentProgress.questionNumber + currentQuestionIndex;

  // Render text with input fields for blanks
  const renderTextWithBlanks = () => {
    let textParts = passage.text.split(/(\[BLANK_\d+\])/);
    
    return textParts.map((part, index) => {
      const blankMatch = part.match(/\[BLANK_(\d+)\]/);
      if (blankMatch) {
        const blankIndex = parseInt(blankMatch[1]);
        const blank = blanks.find(b => b.position === blankIndex);
        if (blank) {
          return (
            <InputField
              key={blank.id}
              value={blank.filledWord || ''}
              onChange={(e) => handleBlankInputChange(blank.id, e.target.value)}
              disabled={isSubmitted}
              isCorrect={blank.isCorrect}
              showValidation={isSubmitted}
              placeholder={`Blank ${blank.position + 1}`}
              customWidth="120px"
              fontSize={{ xs: '12px', sm: '14px' }}
            />
          );
        }
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <GradientBackground>
            <StageGoalBanner />
      
      <PracticeCard
        icon="FIB"
        title="Listening: Fill in the Blanks"
        instructions={passage.instructions}
        difficulty={passage.difficulty}
      >
        {/* Question Header */}
        <QuestionHeader 
          questionNumber={questionNumber}
          studentName={studentProgress.studentName}
          testedCount={studentProgress.testedCount}
        />

        {/* Timer */}
        <TimerDisplay
          timeRemaining={timer.timeRemaining}
          isRunning={timer.isRunning}
          warningThreshold={timer.warningThreshold}
          showStartMessage={!timer.isRunning && !isSubmitted}
          startMessage="Timer will start when you begin typing"
          autoSubmit={timer.autoSubmit}
        />

        {/* Audio Player */}
        <AudioPlayer
          selectedTopic={passage}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          audioError={audioError}
          onTogglePlayback={handleTogglePlayback}
          onVolumeChange={handleVolumeChange}
          formatTime={formatTime}
        />

        {/* Passage with Input Fields */}
        <ContentDisplay
          title={passage.title}
          content={renderTextWithBlanks()}
          category={passage.category}
          difficulty={passage.difficulty}
          tags={passage.tags}
          speaker={passage.speaker}
          duration={passage.duration}
          lineHeight={2}
        />

        {/* Progress Indicator */}
        <ProgressIndicator
          current={blanks.filter(b => b.filledWord && b.filledWord.trim() !== '').length}
          total={blanks.length}
          label="blanks filled"
        />

        {/* Action Buttons */}
        <ActionButtons
          hasResponse={areAllBlanksFilled()}
          onSubmit={handleSubmit}
          onRedo={handleRedo}
          onTranslate={() => setShowTranslate(true)}
          onShowAnswer={() => setShowAnswer(true)}
          recordedBlob={null}
        />

        {/* Navigation */}
        <NavigationSection
          onSearch={handleSearch}
          onPrevious={handlePrevious}
          onNext={handleNext}
          questionNumber={questionNumber}
        />
      </PracticeCard>

      {/* Topic Selection Drawer */}
      <TopicSelectionDrawer
        open={showFillinBlanksSelector}
        onClose={() => setShowFillinBlanksSelector(false)}
        onSelect={handleFillinBlankSelect}
        topics={mockListeningPassages}
        title="Listening: Fill in the Blanks"
        type="question"
      />

      {/* Results Dialog */}
      <ResultsDialog
        open={showResults}
        onClose={() => setShowResults(false)}
        result={currentResult}
        onTryAgain={handleRedo}
      />

      {/* Answer Dialog */}
      <AnswerDialog
        open={showAnswer}
        onClose={() => setShowAnswer(false)}
        title={passage.title}
        audioTitle={passage.title}
        answers={blanks.map(blank => ({
          id: blank.id,
          position: blank.position,
          correctAnswer: blank.correctAnswer
        }))}
      />

      {/* Translation Dialog */}
      <TranslationDialog
        open={showTranslate}
        onClose={() => setShowTranslate(false)}
        description="Translation feature will help you understand the audio content in your preferred language."
      />
    </GradientBackground>
  );
};

export default ListeningFillBlanks;