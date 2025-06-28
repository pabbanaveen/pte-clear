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

// import * as Components from './components';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenExpiryWarning, setTokenExpiryWarning] = useState(false);

  // Initialize authentication state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const { isAuthenticated, user: storedUser } = authService.initializeAuth();

        if (isAuthenticated && storedUser) {
          setIsLoggedIn(true);
          setUser(storedUser);

          // Setup token expiry monitoring
          const cleanup = authService.setupTokenExpiryCheck(() => {
            handleTokenExpiry();
          });

          // Check if token expires soon (within 1 minute)
          const { remainingTime } = authService.getTokenExpiryInfo();
          if (remainingTime > 0 && remainingTime < 60000) { // Less than 1 minute
            setTokenExpiryWarning(true);
          }

          return cleanup;
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

    const cleanup = initAuth();

    // Cleanup function
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const handleTokenExpiry = () => {
    setError('Your session has expired. Please login again.');
    handleLogout();
  };

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login(credentials);

      if (response.success && response.data) {
        setUser(response.data.user);
        setIsLoggedIn(true);
        setLoginOpen(false);

        // Setup token expiry monitoring
        authService.setupTokenExpiryCheck(() => {
          handleTokenExpiry();
        });

        // Show success message
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
    setTokenExpiryWarning(false);
    setError(null);
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleCloseTokenWarning = () => {
    setTokenExpiryWarning(false);
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

            {/* Admin Routes */}
            <Route path="/admin" element={
              isLoggedIn && authService.isAdmin() ? <AdminLayout children={undefined} /> : <Navigate to="/" replace />
            } />
            <Route path="/admin/questions" element={
              isLoggedIn && authService.isAdmin() ? <AdminQuestions /> : <Navigate to="/" replace />
            } />

            <Route path="dashboard" element={<AdminDashboard />} />

            {/* Speaking Module Routes */}
            <Route path="/admin/speaking/read-aloud" element={<></>} />
            <Route path="/admin/speaking/repeat-sentence" element={<></>} />
            <Route path="/admin/speaking/describe-image" element={
              <Box sx={{ p: 3 }}>
                <h2>Describe Image Admin - Coming Soon</h2>
              </Box>
            } />
            <Route path="/admin/speaking/answer-short-question" element={
              <Box sx={{ p: 3 }}>
                <h2>Answer Short Question Admin - Coming Soon</h2>
              </Box>
            } />
            <Route path="/admin/speaking/retell-lecture" element={
              <Box sx={{ p: 3 }}>
                <h2>Retell Lecture Admin - Coming Soon</h2>
              </Box>
            } />

            {/* Writing Module Routes */}
            <Route path="/admin/writing/summarize-text" element={
              <Box sx={{ p: 3 }}>
                <SummarizeTextAdmin />
              </Box>
            } />
            <Route path="/admin/writing/write-email" element={
              <Box sx={{ p: 3 }}>
                <h2>Write Email Admin - Coming Soon</h2>
              </Box>
            } />
            <Route path="/admin/writing/writing-essay" element={
              <Box sx={{ p: 3 }}>
                <h2>Writing Essay Admin - Coming Soon</h2>
              </Box>
            } />

            {/* Reading Module Routes */}
            <Route path="/admin/reading/fill-blanks" element={
              <Box sx={{ p: 3 }}>
                <FillBlanksAdmin />
              </Box>
            } />
            <Route path="/admin/reading/multiple-choice" element={
              <Box sx={{ p: 3 }}>
                <h2>Reading Multiple Choice Admin - Coming Soon</h2>
              </Box>
            } />
            <Route path="/admin/reading/reorder-paragraphs" element={
              <Box sx={{ p: 3 }}>
                <h2>Reorder Paragraphs Admin - Coming Soon</h2>
              </Box>
            } />

            {/* Listening Module Routes */}
            <Route path="/admin/listening/summarize-spoken-text" element={
              <Box sx={{ p: 3 }}>
                <h2>Listening Summarize Spoken Text Admin - Coming Soon</h2>
              </Box>
            } />
            <Route path="/admin/listening/multiple-choice" element={
              <Box sx={{ p: 3 }}>
                <h2>Listening Multiple Choice Admin - Coming Soon</h2>
              </Box>
            } />
            <Route path="/admin/listening/fill-blanks" element={
              <Box sx={{ p: 3 }}>
                <h2>Listening Fill Blanks Admin - Coming Soon</h2>
              </Box>
            } />
            <Route path="/admin/listening/highlight-correct-summary" element={
              <Box sx={{ p: 3 }}>
                <h2>Highlight Correct Summary Admin - Coming Soon</h2>
              </Box>
            } />
            <Route path="/admin/listening/select-missing-word" element={
              <Box sx={{ p: 3 }}>
                <h2>Select Missing Word Admin - Coming Soon</h2>
              </Box>
            } />
            <Route path="/admin/listening/highlight-incorrect-words" element={
              <Box sx={{ p: 3 }}>
                <h2>Highlight Incorrect Words Admin - Coming Soon</h2>
              </Box>
            } />
            <Route path="/admin/listening/write-from-dictation" element={
              <Box sx={{ p: 3 }}>
                <h2>Write From Dictation Admin - Coming Soon</h2>
              </Box>
            } />

            {/* Other Admin Routes */}
            <Route path="/admin/upload-history" element={
              <Box sx={{ p: 3 }}>
                <h2>Upload History - Coming Soon</h2>
              </Box>
            } />
            <Route path="/admin/settings" element={
              <Box sx={{ p: 3 }}>
                <h2>Settings - Coming Soon</h2>
              </Box>
            } />

            {/* Default admin route */}
            <Route path="/admin/dashboard" element={<Navigate to="dashboard" replace />} />
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

          {/* Token Expiry Warning */}
          <Snackbar
            open={tokenExpiryWarning}
            autoHideDuration={10000}
            onClose={handleCloseTokenWarning}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseTokenWarning} severity="warning" sx={{ width: '100%' }}>
              Your session will expire soon. Please save your work.
            </Alert>
          </Snackbar>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
