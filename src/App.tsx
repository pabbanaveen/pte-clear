import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';
import theme from './theme';
import { User } from './types/index';
import { Header } from './components/Header';
import HomePage from './components/HomePage';
import LoginModal from './components/LoginModal';
import PracticeTests from './components/PracticeTests';
import Profile from './components/Profile';
import ProgressTracking from './components/ProgressTracking';
import StudyMaterials from './components/StudyMaterials';
import Dashboard from './components/Dashboard';
import AIPracticeSection from './components/AIPracticeSection';
import ReadAloud from './components/practice/speaking/read-a-loud/ReadAloud';
import DescribeImage from './components/practice/speaking/describeImage/DescribeImage';
import FillInBlanks from './components/practice/Reading/fillin-blanks/FillInBlanks';
import ReorderParagraphs from './components/practice/Reading/re-order-paragraphs/ReorderParagraphs';
import RepeatSentence from './components/practice/speaking/repeat-sectence/RepeatSentence';
import WritingEssay from './components/practice/Writing/writing-essay/WritingEssay';
import AdminDashboard from './components/pages/admin/AdminDashboard';
import AdminQuestions from './components/pages/admin/AdminQuestions';
import { ReTellLeacture } from './components/practice/speaking/re-tell-leacture/ReTellLeacture';
import { AnswerShortQuestionsScreen } from './components/practice/speaking/answer-short-questions/AnswerShortQuestionsScreen';
import SummarizeText from './components/practice/Writing/summarize-text/SummarizeText';
import WriteEmail from './components/practice/Writing/emailWriting/writeEmail';
import MultipleChoice from './components/practice/Reading/multiple-choice/MultipleChoice';
import ReadingFillBlanks from './components/practice/Reading/ReadingFillInTheBlanks/ReadingFillInTheBlanks';
import MultipleChoiceSingle from './components/practice/Reading/multiple-choice-single/mutlipleChoiceSingle';
import SummarizeSpokenText from './components/practice/Listening/SummarizeSpokenText/SummarizeSpokenText';
import ListeningMultipleChoice from './components/practice/Listening/MultipleChoiceMultiple/MutlipleChoiceMultiple';
import ListeningFillBlanks from './components/practice/Listening/FillinTheBlanks/FillinTheBlanks';
import HighlightCorrectSummary from './components/practice/Listening/HighlightCorrectSummary/HighlightCorrectSummary';
import SelectMissingWord from './components/practice/Listening/SelectMissingWord/SelectMissingWord';
import HighlightIncorrectWords from './components/practice/Listening/HighlightIncorrectWords/HighlightIncorrectWords';
import WriteFromDictation from './components/practice/Listening/WriteFromDictation/WriteFromDictation';
import { Box } from '@mui/system';
import AdminLayout from './components/admin/AdminLayout';
import SummarizeTextAdmin from './components/admin/writing/SummarizeTextAdmin';
import FillBlanksAdmin from './components/admin/reading/FillBlanksAdmin';
import MultipleChoiceSingleListening from './components/practice/Listening/MultipleChoiceSingle/MultipleChoiceSingle';
import { authService } from './services/authService';
import { SearchProvider } from './components/contexts/SearchContext';
import GlobalSearchButton from './components/GlobalSearchButton';
import FloatingSearchDemo from './components/common/FloatingSearchButton';
import AdminDashboardNew from './components/admin/AdminDashboardNew';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize authentication state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const { isAuthenticated, user: storedUser } = authService.initializeAuth();

        if (isAuthenticated && storedUser) {
          setIsLoggedIn(true);
          setUser(storedUser);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setError('Failed to restore session');
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login(credentials);

      if (response.success && response.data) {
        setUser(response.data.user);
        setIsLoggedIn(true);
        setLoginOpen(false);
        setError(null);
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsLoggedIn(false);
    setError(null);
  };

  const handleCloseError = () => {
    setError(null);
  };

  // Show loading spinner while initializing
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          sx={{ backgroundColor: '#f5f5f5' }}
        >
          <Box textAlign="center">
            <div>Loading...</div>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <SearchProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <Header
              isLoggedIn={isLoggedIn}
              user={user}
              onLoginClick={() => setLoginOpen(true)}
              onLogout={handleLogout}
            />

            {/* Global Floating Search Button */}
            <GlobalSearchButton />

            <Routes>
              <Route
                path="/"
                element={
                  isLoggedIn ? (
                    <Dashboard user={user} />
                  ) : (
                    <HomePage onGetStarted={() => setLoginOpen(true)} />
                  )
                }
              />
              {/* Public routes */}
              <Route path="/dashboard" element={isLoggedIn ? <Dashboard user={user} /> : <Navigate to="/" replace />} />
              <Route path="/practice-tests" element={isLoggedIn ? <PracticeTests user={user} /> : <Navigate to="/" replace />} />
              <Route path="/study-materials" element={isLoggedIn ? <StudyMaterials user={user} /> : <Navigate to="/" replace />} />
              <Route path="/ai-practice" element={isLoggedIn ? <AIPracticeSection /> : <Navigate to="/" replace />} />
              <Route path="/progress" element={isLoggedIn ? <ProgressTracking user={user} /> : <Navigate to="/" replace />} />
              <Route path="/profile" element={isLoggedIn ? <Profile user={user} setUser={setUser} /> : <Navigate to="/" replace />} />

              {/* Speaking Practice Routes */}
              <Route path="/practice/speaking/read-aloud" element={isLoggedIn ? <ReadAloud user={user} /> : <Navigate to="/" replace />} />
              <Route path="/practice/speaking/repeat-sentence" element={isLoggedIn ? <RepeatSentence user={user} /> : <Navigate to="/" replace />} />
              <Route path="/practice/speaking/describe-image" element={isLoggedIn ? <DescribeImage /> : <Navigate to="/" replace />} />
              <Route path="/practice/speaking/answer-short-question" element={isLoggedIn ? <AnswerShortQuestionsScreen user={user} /> : <Navigate to="/" replace />} />
              <Route path="/practice/speaking/respond-situation" element={isLoggedIn ? <PracticeTests user={user} /> : <Navigate to="/" replace />} />
              <Route path="/practice/speaking/retell-lecture" element={isLoggedIn ? <ReTellLeacture user={user} /> : <Navigate to="/" replace />} />

              {/* Writing Practice Routes */}
              <Route path="/practice/writing/summarize-text" element={isLoggedIn ? <SummarizeText user={user} /> : <Navigate to="/" replace />} />
              <Route path="/practice/writing/write-email" element={isLoggedIn ? <WriteEmail user={user} /> : <Navigate to="/" replace />} />
              <Route path="/practice/writing/summarize-text-core" element={isLoggedIn ? <PracticeTests user={user} /> : <Navigate to="/" replace />} />
              <Route path="/practice/writing/write-essay" element={isLoggedIn ? <WritingEssay /> : <Navigate to="/" replace />} />

              {/* Reading Practice Routes */}
              <Route path="/practice/reading/fill-blanks-rw" element={isLoggedIn ? <ReadingFillBlanks /> : <Navigate to="/" replace />} />
              <Route path="/practice/reading/multiple-choice-multiple" element={isLoggedIn ? <MultipleChoice user={user} /> : <Navigate to="/" replace />} />
              <Route path="/practice/reading/reorder-paragraphs" element={isLoggedIn ? <ReorderParagraphs /> : <Navigate to="/" replace />} />
              <Route path="/practice/reading/fill-blanks" element={isLoggedIn ? <FillInBlanks /> : <Navigate to="/" replace />} />
              <Route path="/practice/reading/multiple-choice-single" element={isLoggedIn ? <MultipleChoiceSingle /> : <Navigate to="/" replace />} />

              {/* Listening Practice Routes */}
              <Route path="/practice/listening/summarize-spoken-text" element={isLoggedIn ? <SummarizeSpokenText /> : <Navigate to="/" replace />} />
              <Route path="/practice/listening/multiple-choice-multiple" element={isLoggedIn ? <ListeningMultipleChoice user={user} /> : <Navigate to="/" replace />} />
              <Route path="/practice/listening/fill-blanks" element={isLoggedIn ? <ListeningFillBlanks /> : <Navigate to="/" replace />} />
              <Route path="/practice/listening/multiple-choice-single" element={isLoggedIn ? <MultipleChoiceSingleListening /> : <Navigate to="/" replace />} />
              <Route path="/practice/listening/select-missing-word" element={isLoggedIn ? <SelectMissingWord /> : <Navigate to="/" replace />} />
              <Route path="/practice/listening/highlight-incorrect" element={isLoggedIn ? <HighlightIncorrectWords /> : <Navigate to="/" replace />} />
              <Route path="/practice/listening/write-dictation" element={isLoggedIn ? <WriteFromDictation /> : <Navigate to="/" replace />} />
              <Route path="/practice/listening/summarize-spoken-text-core" element={isLoggedIn ? <PracticeTests user={user} /> : <Navigate to="/" replace />} />
              <Route path="/practice/listening/highlight-summary" element={isLoggedIn ? <HighlightCorrectSummary /> : <Navigate to="/" replace />} />

              {/* Additional Feature Routes */}
              <Route path="/vocab-books" element={isLoggedIn ? <StudyMaterials user={user} /> : <Navigate to="/" replace />} />
              <Route path="/shadowing" element={isLoggedIn ? <AIPracticeSection /> : <Navigate to="/" replace />} />
              <Route path="/ai-analysis" element={isLoggedIn ? <ProgressTracking user={user} /> : <Navigate to="/" replace />} />
              <Route path="/ai-study-plan" element={isLoggedIn ? <Dashboard user={user} /> : <Navigate to="/" replace />} />
              <Route path="/mock-tests" element={isLoggedIn ? <PracticeTests user={user} /> : <Navigate to="/" replace />} />
              <Route path="/downloads" element={isLoggedIn ? <StudyMaterials user={user} /> : <Navigate to="/" replace />} />

              {/* Demo Route */}
              <Route path="/demo/floating-search" element={<FloatingSearchDemo />} />

              {/* Admin Routes */}
              <Route path="/admin" element={
                isLoggedIn && authService.isAdmin() ? <AdminLayout children={undefined} /> : <Navigate to="/" replace />
              } />
              {/* New Admin Dashboard */}
            <Route path="/admin/new" element={
              isLoggedIn && authService.isAdmin() ? <AdminDashboardNew /> : <Navigate to="/" replace />
            } />
              <Route path="/admin/questions" element={
                isLoggedIn && authService.isAdmin() ? <AdminQuestions /> : <Navigate to="/" replace />
              } />

              <Route path="/admin/dashboard" element={
                isLoggedIn && authService.isAdmin() ? <AdminDashboard /> : <Navigate to="/" replace />
              } />

              {/* Speaking Module Routes */}
              <Route path="/admin/speaking/read-aloud" element={
                isLoggedIn && authService.isAdmin() ? <Box sx={{ p: 3 }}><h2>Read Aloud Admin - Coming Soon</h2></Box> : <Navigate to="/" replace />
              } />
              <Route path="/admin/speaking/repeat-sentence" element={
                isLoggedIn && authService.isAdmin() ? <Box sx={{ p: 3 }}><h2>Repeat Sentence Admin - Coming Soon</h2></Box> : <Navigate to="/" replace />
              } />
              <Route path="/admin/speaking/describe-image" element={
                isLoggedIn && authService.isAdmin() ? <Box sx={{ p: 3 }}><h2>Describe Image Admin - Coming Soon</h2></Box> : <Navigate to="/" replace />
              } />
              <Route path="/admin/speaking/answer-short-question" element={
                isLoggedIn && authService.isAdmin() ? <Box sx={{ p: 3 }}><h2>Answer Short Question Admin - Coming Soon</h2></Box> : <Navigate to="/" replace />
              } />
              <Route path="/admin/speaking/retell-lecture" element={
                isLoggedIn && authService.isAdmin() ? <Box sx={{ p: 3 }}><h2>Retell Lecture Admin - Coming Soon</h2></Box> : <Navigate to="/" replace />
              } />

              {/* Writing Module Routes */}
              <Route path="/admin/writing/summarize-text" element={
                isLoggedIn && authService.isAdmin() ? <Box sx={{ p: 3 }}><SummarizeTextAdmin /></Box> : <Navigate to="/" replace />
              } />
              <Route path="/admin/writing/write-email" element={
                isLoggedIn && authService.isAdmin() ? <Box sx={{ p: 3 }}><h2>Write Email Admin - Coming Soon</h2></Box> : <Navigate to="/" replace />
              } />
              <Route path="/admin/writing/writing-essay" element={
                isLoggedIn && authService.isAdmin() ? <Box sx={{ p: 3 }}><h2>Writing Essay Admin - Coming Soon</h2></Box> : <Navigate to="/" replace />
              } />

              {/* Reading Module Routes */}
              <Route path="/admin/reading/fill-blanks" element={
                isLoggedIn && authService.isAdmin() ? <Box sx={{ p: 3 }}><FillBlanksAdmin /></Box> : <Navigate to="/" replace />
              } />
              <Route path="/admin/reading/multiple-choice" element={
                isLoggedIn && authService.isAdmin() ? <Box sx={{ p: 3 }}><h2>Reading Multiple Choice Admin - Coming Soon</h2></Box> : <Navigate to="/" replace />
              } />
              <Route path="/admin/reading/reorder-paragraphs" element={
                isLoggedIn && authService.isAdmin() ? <Box sx={{ p: 3 }}><h2>Reorder Paragraphs Admin - Coming Soon</h2></Box> : <Navigate to="/" replace />
              } />

              {/* Listening Module Routes */}
              <Route path="/admin/listening/summarize-spoken-text" element={
                isLoggedIn && authService.isAdmin() ? <Box sx={{ p: 3 }}><h2>Listening Summarize Spoken Text Admin - Coming Soon</h2></Box> : <Navigate to="/" replace />
              } />
              <Route path="/admin/listening/multiple-choice" element={
                isLoggedIn && authService.isAdmin() ? <Box sx={{ p: 3 }}><h2>Listening Multiple Choice Admin - Coming Soon</h2></Box> : <Navigate to="/" replace />
              } />
              <Route path="/admin/listening/fill-blanks" element={
                isLoggedIn && authService.isAdmin() ? <Box sx={{ p: 3 }}><h2>Listening Fill Blanks Admin - Coming Soon</h2></Box> : <Navigate to="/" replace />
              } />
              <Route path="/admin/listening/highlight-correct-summary" element={
                isLoggedIn && authService.isAdmin() ? <Box sx={{ p: 3 }}><h2>Highlight Correct Summary Admin - Coming Soon</h2></Box> : <Navigate to="/" replace />
              } />
              <Route path="/admin/listening/select-missing-word" element={
                isLoggedIn && authService.isAdmin() ? <Box sx={{ p: 3 }}><h2>Select Missing Word Admin - Coming Soon</h2></Box> : <Navigate to="/" replace />
              } />
              <Route path="/admin/listening/highlight-incorrect-words" element={
                isLoggedIn && authService.isAdmin() ? <Box sx={{ p: 3 }}><h2>Highlight Incorrect Words Admin - Coming Soon</h2></Box> : <Navigate to="/" replace />
              } />
              <Route path="/admin/listening/write-from-dictation" element={
                isLoggedIn && authService.isAdmin() ? <Box sx={{ p: 3 }}><h2>Write From Dictation Admin - Coming Soon</h2></Box> : <Navigate to="/" replace />
              } />

              {/* Other Admin Routes */}
              <Route path="/admin/upload-history" element={
                isLoggedIn && authService.isAdmin() ? <Box sx={{ p: 3 }}><h2>Upload History - Coming Soon</h2></Box> : <Navigate to="/" replace />
              } />
              <Route path="/admin/settings" element={
                isLoggedIn && authService.isAdmin() ? <Box sx={{ p: 3 }}><h2>Settings - Coming Soon</h2></Box> : <Navigate to="/" replace />
              } />

              {/* Default admin route */}
              <Route path="/admin/dashboard" element={
                isLoggedIn && authService.isAdmin() ? <AdminDashboard /> : <Navigate to="/" replace />
              } />
            </Routes>

            <LoginModal
              open={loginOpen}
              onClose={() => setLoginOpen(false)}
              onLogin={handleLogin}
              loading={loading}
            />

            {/* Error Snackbar */}
            <Snackbar
              open={!!error}
              autoHideDuration={6000}
              onClose={handleCloseError}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            </Snackbar>
          </div>
        </Router>
      </ThemeProvider>
    </SearchProvider>
  );
};

export default App;