import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import {AnswerShortQuestionsScreen} from './components/practice/speaking/answer-short-questions/AnswerShortQuestionsScreen';
import SummarizeText from './components/practice/Writing/summarize-text/SummarizeText';
import WriteEmail from './components/practice/Writing/emailWriting/writeEmail';
import MultipleChoice from './components/practice/Reading/multiple-choice/MultipleChoice';
import ReadingFillBlanks from './components/practice/Reading/ReadingFillInTheBlanks/ReadingFillInTheBlanks';

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
            <Route path="/" element={<HomePage onGetStarted={() => setLoginOpen(true)}/>} />
            <Route path="/dashboard" element={<Dashboard user={user}/>} />
            <Route path="/practice-tests" element={<PracticeTests user={user}/>} />
            <Route path="/study-materials" element={<StudyMaterials user={user} />} />
            <Route path="/ai-practice" element={<AIPracticeSection  />} />
            <Route path="/progress" element={<ProgressTracking user={user}/>} />
            <Route path="/profile" element={<Profile user={user} setUser={function (user: User): void {
              throw new Error('Function not implemented.');
            } }/>} />
            
            {/* Speaking Practice Routes */}
            <Route path="/practice/speaking/read-aloud" element={<ReadAloud />} />
            <Route path="/practice/speaking/repeat-sentence" element={<RepeatSentence />} />
            <Route path="/practice/speaking/describe-image" element={<DescribeImage />} />
            <Route path="/practice/speaking/answer-short-question" element={<AnswerShortQuestionsScreen user={user} />} />
            <Route path="/practice/speaking/respond-situation" element={<PracticeTests user={user} />} />
            <Route path="/practice/speaking/retell-lecture" element={<ReTellLeacture user={user}/>} />
            
            {/* Writing Practice Routes */}
            <Route path="/practice/writing/summarize-text" element={<SummarizeText user={user}/>} />
            <Route path="/practice/writing/write-email" element={<WriteEmail user={user}/>} />
            <Route path="/practice/writing/summarize-text-pta" element={<PracticeTests user={user}/>} />
            <Route path="/practice/writing/write-essay" element={<WritingEssay />} />
            
            {/* Reading Practice Routes */}
            <Route path="/practice/reading/fill-blanks-rw" element={<ReadingFillBlanks />} />
            <Route path="/practice/reading/multiple-choice-multiple" element={<MultipleChoice user={user} />} />
            <Route path="/practice/reading/reorder-paragraphs" element={<ReorderParagraphs />} />
            <Route path="/practice/reading/fill-blanks" element={<FillInBlanks />} />
            <Route path="/practice/reading/multiple-choice-single" element={<PracticeTests user={user}/>} />
            
            {/* Listening Practice Routes */}
            <Route path="/practice/listening/summarize-spoken" element={<PracticeTests user={user} />} />
            <Route path="/practice/listening/multiple-choice-multiple" element={<PracticeTests user={user}/>} />
            <Route path="/practice/listening/fill-blanks" element={<PracticeTests user={user}/>} />
            <Route path="/practice/listening/multiple-choice-single" element={<PracticeTests user={user}/>} />
            <Route path="/practice/listening/select-missing-word" element={<PracticeTests user={user}/>} />
            <Route path="/practice/listening/highlight-incorrect" element={<PracticeTests user={user}/>} />
            <Route path="/practice/listening/write-dictation" element={<PracticeTests user={user}/>} />
            <Route path="/practice/listening/summarize-spoken-pta" element={<PracticeTests user={user}/>} />
            <Route path="/practice/listening/highlight-summary-pta" element={<PracticeTests user={user}/>} />
            
            {/* Additional Feature Routes */}
            <Route path="/vocab-books" element={<StudyMaterials user={user} />} />
            <Route path="/shadowing" element={<AIPracticeSection />} />
            <Route path="/ai-analysis" element={<ProgressTracking user={user}/>} />
            <Route path="/ai-study-plan" element={<Dashboard user={user}/>} />
            <Route path="/mock-tests" element={<PracticeTests user={user}/>} />
            <Route path="/downloads" element={<StudyMaterials user={user}/>} />
            {/* Admin Routes */}
                <Route path="/admin" element={
                  // <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  // </ProtectedRoute>
                } />
                <Route path="/admin/questions" element={
                  // <ProtectedRoute adminOnly>
                    <AdminQuestions />
                  // </ProtectedRoute>
                } />
          </Routes>
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
