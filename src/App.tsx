import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import theme from './theme';
import { User } from './types/user';
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

// import * as Components from './components';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (credentials: { email: string; password: string }) => {
    setUser({
      name: credentials.email.split('@')[0],
      email: credentials.email,
      avatar: 'https://images.pexels.com/photos/5303547/pexels-photo-5303547.jpeg',
      progress: {
        totalTests: 15,
        completedTests: 8,
        averageScore: 78,
        strongAreas: ['Reading', 'Listening'],
        weakAreas: ['Speaking', 'Writing'],
      }
    });
    setIsLoggedIn(true);
    setLoginOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

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
            {/* <Route 
              path="/practice" 
              element={<PracticeTests user={user} />} 
            />
            <Route 
              path="/materials" 
              element={<StudyMaterials user={user} />} 
            />
            <Route 
              path="/progress" 
              element={<ProgressTracking user={user} />} 
            />
            <Route 
              path="/profile" 
              element={<Profile user={user} setUser={setUser} />} 
            /> */}
            <Route path="/" element={<HomePage onGetStarted={() => setLoginOpen(true)} />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/practice-tests" element={<PracticeTests user={user} />} />
            <Route path="/study-materials" element={<StudyMaterials user={user} />} />
            <Route path="/ai-practice" element={<AIPracticeSection />} />
            <Route path="/progress" element={<ProgressTracking user={user} />} />
            <Route path="/profile" element={<Profile user={user} setUser={function (user: User): void {
              throw new Error('Function not implemented.');
            }} />} />
            {/* Speaking Practice Routes */}
            <Route path="/practice/speaking/read-aloud" element={<ReadAloud user={user}/>} />
            <Route path="/practice/speaking/repeat-sentence" element={<RepeatSentence user={user}/>} />
            <Route path="/practice/speaking/describe-image" element={<DescribeImage />} />
            <Route path="/practice/speaking/answer-short-question" element={<AnswerShortQuestionsScreen user={user} />} />
            <Route path="/practice/speaking/respond-situation" element={<PracticeTests user={user} />} />
            <Route path="/practice/speaking/retell-lecture" element={<ReTellLeacture user={user} />} />

            {/* Writing Practice Routes */}
            <Route path="/practice/writing/summarize-text" element={<SummarizeText user={user} />} />
            <Route path="/practice/writing/write-email" element={<WriteEmail user={user} />} />
            <Route path="/practice/writing/summarize-text-pta" element={<PracticeTests user={user} />} />
            <Route path="/practice/writing/write-essay" element={<WritingEssay />} />

            {/* Reading Practice Routes */}
            <Route path="/practice/reading/fill-blanks-rw" element={<ReadingFillBlanks />} />
            <Route path="/practice/reading/multiple-choice-multiple" element={<MultipleChoice user={user} />} />
            <Route path="/practice/reading/reorder-paragraphs" element={<ReorderParagraphs />} />
            <Route path="/practice/reading/fill-blanks" element={<FillInBlanks />} />
            <Route path="/practice/reading/multiple-choice-single" element={<MultipleChoiceSingle />} />

            {/* Listening Practice Routes */}
            <Route path="/practice/listening/summarize-spoken-text" element={<SummarizeSpokenText />} />
            <Route path="/practice/listening/multiple-choice-multiple" element={<ListeningMultipleChoice user={user} />} />
            <Route path="/practice/listening/fill-blanks" element={<ListeningFillBlanks />} />
            <Route path="/practice/listening/multiple-choice-single" element={<MultipleChoiceSingleListening />} />
            <Route path="/practice/listening/select-missing-word" element={<SelectMissingWord />} />
            <Route path="/practice/listening/highlight-incorrect" element={<HighlightIncorrectWords />} />
            <Route path="/practice/listening/write-dictation" element={<WriteFromDictation />} />
            <Route path="/practice/listening/summarize-spoken-pta" element={<PracticeTests user={user} />} />
            <Route path="/practice/listening/highlight-summary" element={<HighlightCorrectSummary />} />

            {/* Additional Feature Routes */}
            <Route path="/vocab-books" element={<StudyMaterials user={user} />} />
            <Route path="/shadowing" element={<AIPracticeSection />} />
            <Route path="/ai-analysis" element={<ProgressTracking user={user} />} />
            <Route path="/ai-study-plan" element={<Dashboard user={user} />} />
            <Route path="/mock-tests" element={<PracticeTests user={user} />} />
            <Route path="/downloads" element={<StudyMaterials user={user} />} />
            {/* Admin Routes */}
            <Route path="/admin" element={
              // <ProtectedRoute adminOnly>
              <AdminLayout children={undefined} />
              // </ProtectedRoute>
            } />
            <Route path="/admin/questions" element={
              // <ProtectedRoute adminOnly>
              <AdminQuestions />
              // </ProtectedRoute>
            } />
            {/* Admin Routes */}
            {/* <Route path="/admin/*" element={
            <AdminLayout>
              <Routes> */}
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
                {/* <h2>Summarize Text Admin - Coming Soon</h2> */}
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
                {/* <h2>Reading Fill Blanks Admin - Coming Soon</h2> */}
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
          {/* </AdminLayout>
          } />
          </Routes> */}
          <LoginModal
            open={loginOpen}
            onClose={() => setLoginOpen(false)}
            onLogin={handleLogin}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
