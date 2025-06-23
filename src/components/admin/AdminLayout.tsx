import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  QuestionAnswer as QuestionAnswerIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  Edit as EditIcon,
  MenuBook as MenuBookIcon,
  Headphones as HeadphonesIcon,
  ExpandLess,
  ExpandMore,
  Upload as UploadIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 280;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [speakingOpen, setSpeakingOpen] = useState(false);
  const [writingOpen, setWritingOpen] = useState(false);
  const [readingOpen, setReadingOpen] = useState(false);
  const [listeningOpen, setListeningOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin/dashboard',
    },
    {
      text: 'Speaking',
      icon: <RecordVoiceOverIcon />,
      submenu: [
        { text: 'Read Aloud', path: '/admin/speaking/read-aloud' },
        { text: 'Repeat Sentence', path: '/admin/speaking/repeat-sentence' },
        { text: 'Describe Image', path: '/admin/speaking/describe-image' },
        { text: 'Answer Short Question', path: '/admin/speaking/answer-short-question' },
        { text: 'Retell Lecture', path: '/admin/speaking/retell-lecture' },
      ],
    },
    {
      text: 'Writing',
      icon: <EditIcon />,
      submenu: [
        { text: 'Summarize Text', path: '/admin/writing/summarize-text' },
        { text: 'Write Email', path: '/admin/writing/write-email' },
        { text: 'Writing Essay', path: '/admin/writing/writing-essay' },
      ],
    },
    {
      text: 'Reading',
      icon: <MenuBookIcon />,
      submenu: [
        { text: 'Fill in Blanks', path: '/admin/reading/fill-blanks' },
        { text: 'Multiple Choice', path: '/admin/reading/multiple-choice' },
        { text: 'Reorder Paragraphs', path: '/admin/reading/reorder-paragraphs' },
      ],
    },
    {
      text: 'Listening',
      icon: <HeadphonesIcon />,
      submenu: [
        { text: 'Summarize Spoken Text', path: '/admin/listening/summarize-spoken-text' },
        { text: 'Multiple Choice', path: '/admin/listening/multiple-choice' },
        { text: 'Fill in Blanks', path: '/admin/listening/fill-blanks' },
        { text: 'Highlight Correct Summary', path: '/admin/listening/highlight-correct-summary' },
        { text: 'Select Missing Word', path: '/admin/listening/select-missing-word' },
        { text: 'Highlight Incorrect Words', path: '/admin/listening/highlight-incorrect-words' },
        { text: 'Write From Dictation', path: '/admin/listening/write-from-dictation' },
      ],
    },
    {
      text: 'Upload History',
      icon: <HistoryIcon />,
      path: '/admin/upload-history',
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/admin/settings',
    },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          PTE Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <div key={item.text}>
            {item.submenu ? (
              <>
                <ListItemButton
                  onClick={() => {
                    if (item.text === 'Speaking') setSpeakingOpen(!speakingOpen);
                    if (item.text === 'Writing') setWritingOpen(!writingOpen);
                    if (item.text === 'Reading') setReadingOpen(!readingOpen);
                    if (item.text === 'Listening') setListeningOpen(!listeningOpen);
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                  {item.text === 'Speaking' && (speakingOpen ? <ExpandLess /> : <ExpandMore />)}
                  {item.text === 'Writing' && (writingOpen ? <ExpandLess /> : <ExpandMore />)}
                  {item.text === 'Reading' && (readingOpen ? <ExpandLess /> : <ExpandMore />)}
                  {item.text === 'Listening' && (listeningOpen ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
                <Collapse 
                  in={
                    (item.text === 'Speaking' && speakingOpen) ||
                    (item.text === 'Writing' && writingOpen) ||
                    (item.text === 'Reading' && readingOpen) ||
                    (item.text === 'Listening' && listeningOpen)
                  } 
                  timeout="auto" 
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.submenu.map((subItem) => (
                      <ListItemButton
                        key={subItem.text}
                        sx={{ pl: 4 }}
                        selected={isActive(subItem.path)}
                        onClick={() => handleNavigation(subItem.path)}
                      >
                        <ListItemIcon>
                          <UploadIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={subItem.text} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItemButton
                selected={isActive(item.path!)}
                onClick={() => handleNavigation(item.path!)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            )}
          </div>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            PTE Question Management System
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;