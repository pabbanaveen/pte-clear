import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Collapse,
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material';
import {
  Settings,
  Logout,
  Dehaze,
  Dashboard,
  AdminPanelSettings,
  Home,
  School,
  MenuBook,
  TrendingUp,
  ExpandLess,
  ExpandMore,
  Mic,
  Edit,
  ChromeReaderMode,
  Headphones
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import PtePracticeMenu from './PtePracticeMenu';

interface HeaderProps {
  isLoggedIn: boolean;
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  hasAI?: boolean;
  isCore?: boolean;
}

interface MenuSection {
  category: string;
  icon: React.ReactNode;
  items: MenuItem[];
}

export const Header: React.FC<HeaderProps> = ({ isLoggedIn, user, onLoginClick, onLogout }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [pteMenuOpen, setPteMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handlePteMenuToggle = () => {
    setPteMenuOpen(!pteMenuOpen);
  };

  const handleLogout = () => {
    onLogout();
    handleCloseProfileMenu();
    setMobileDrawerOpen(false);
    navigate('/');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileDrawerOpen(false);
    setPteMenuOpen(false);
  };

  const pteMenuStructure: MenuSection[] = [
    {
      category: 'Speaking',
      icon: <Mic sx={{ fontSize: 18 }} />,
      items: [
        { label: 'Read Aloud', path: '/practice/speaking/read-aloud', icon: <Mic />, hasAI: true },
        { label: 'Repeat Sentence', path: '/practice/speaking/repeat-sentence', icon: <Mic />, hasAI: true },
        { label: 'Describe Image', path: '/practice/speaking/describe-image', icon: <Mic />, hasAI: true },
        { label: 'Re-tell Lecture', path: '/practice/speaking/retell-lecture', icon: <Mic />, hasAI: true },
        { label: 'Answer Short Question', path: '/practice/speaking/answer-short-question', icon: <Mic />, hasAI: true },
        { label: 'Respond to a Situation', path: '/practice/speaking/respond-situation', icon: <Mic />, isCore: true },
      ],
    },
    {
      category: 'Writing',
      icon: <Edit sx={{ fontSize: 18 }} />,
      items: [
        { label: 'Summarize Written Text', path: '/practice/writing/summarize-text', icon: <Edit />, hasAI: true },
        { label: 'Write Essay', path: '/practice/writing/write-essay', icon: <Edit />, hasAI: true },
        { label: 'Write Email', path: '/practice/writing/write-email', icon: <Edit />, isCore: true },
      ],
    },
    {
      category: 'Reading',
      icon: <ChromeReaderMode sx={{ fontSize: 18 }} />,
      items: [
        { label: 'Fill in the Blanks (R&W)', path: '/practice/reading/fill-blanks-rw', icon: <ChromeReaderMode /> },
        { label: 'Multiple Choice (Multiple)', path: '/practice/reading/multiple-choice-multiple', icon: <ChromeReaderMode /> },
        { label: 'Re-order Paragraphs', path: '/practice/reading/reorder-paragraphs', icon: <ChromeReaderMode /> },
        { label: 'Fill in the Blanks', path: '/practice/reading/fill-blanks', icon: <ChromeReaderMode /> },
        { label: 'Multiple Choice (Single)', path: '/practice/reading/multiple-choice-single', icon: <ChromeReaderMode /> },
      ],
    },
    {
      category: 'Listening',
      icon: <Headphones sx={{ fontSize: 18 }} />,
      items: [
        { label: 'Summarize Spoken Text', path: '/practice/listening/summarize-spoken-text', icon: <Headphones />, hasAI: true },
        { label: 'Multiple Choice (Multiple)', path: '/practice/listening/multiple-choice-multiple', icon: <Headphones /> },
        { label: 'Fill in the Blanks', path: '/practice/listening/fill-blanks', icon: <Headphones /> },
        { label: 'Highlight Correct Summary', path: '/practice/listening/highlight-summary', icon: <Headphones /> },
        { label: 'Multiple Choice (Single)', path: '/practice/listening/multiple-choice-single', icon: <Headphones /> },
        { label: 'Select Missing Word', path: '/practice/listening/select-missing-word', icon: <Headphones /> },
        { label: 'Highlight Incorrect Words', path: '/practice/listening/highlight-incorrect', icon: <Headphones /> },
        { label: 'Write From Dictation', path: '/practice/listening/write-dictation', icon: <Headphones /> },
      ],
    },
  ];

  const menuItems = [
    { label: 'Home', path: '/' },
    ...(isLoggedIn ? [
      { label: 'PTE Practice', path: '/practice', hasSubMenu: true },
      { label: 'Study Materials', path: '/study-materials' },
      { label: 'Progress', path: '/progress' },
    ] : []),
  ];

  // Mobile Drawer Content
  const drawerContent = (
    <Box sx={{ width: 280, bgcolor: '#fff', height: '100%' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#4DB6AC', mb: 1 }}>
          Navigation
        </Typography>
      </Box>
      
      <List sx={{ px: 1 }}>
        {/* Home */}
        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => handleNavigate('/')}
            sx={{ 
              borderRadius: 2, 
              mb: 1,
              '&:hover': { bgcolor: '#e3f2fd' }
            }}
          >
            <ListItemIcon>
              <Home sx={{ color: '#4DB6AC' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Home" 
              primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }}
            />
          </ListItemButton>
        </ListItem>

        {/* PTE Practice Menu */}
        {isLoggedIn && (
          <ListItem disablePadding>
            <ListItemButton 
              onClick={handlePteMenuToggle}
              sx={{ 
                borderRadius: 2, 
                mb: 1,
                '&:hover': { bgcolor: '#e3f2fd' }
              }}
            >
              <ListItemIcon>
                <School sx={{ color: '#4DB6AC' }} />
              </ListItemIcon>
              <ListItemText 
                primary="PTE Practice" 
                primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }}
              />
              {pteMenuOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
        )}

        {/* PTE Practice Submenu */}
        {isLoggedIn && (
          <Collapse in={pteMenuOpen} timeout="auto" unmountOnExit>
            <Paper 
              elevation={0} 
              sx={{ 
                maxHeight: '60vh', 
                overflowY: 'auto',
                bgcolor: '#f8f9fa',
                borderRadius: 2,
                mx: 1,
                mb: 1
              }}
            >
              {pteMenuStructure.map((section) => (
                <Box key={section.category} sx={{ mb: 2 }}>
                  <Box sx={{ 
                    px: 2, 
                    py: 1, 
                    bgcolor: '#fff', 
                    borderRadius: '8px 8px 0 0',
                    borderBottom: '1px solid #e0e0e0'
                  }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#1976d2',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      {section.icon}
                      {section.category}
                    </Typography>
                  </Box>
                  
                  <List dense sx={{ pt: 0 }}>
                    {section.items.map((item) => (
                      <ListItem key={item.path} disablePadding>
                        <ListItemButton
                          onClick={() => handleNavigate(item.path)}
                          sx={{
                            pl: 3,
                            py: 0.8,
                            '&:hover': { bgcolor: '#e3f2fd' },
                            borderRadius: 1,
                            mx: 1
                          }}
                        >
                          <ListItemText 
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography sx={{ fontSize: '0.8rem', color: '#333' }}>
                                  {item.label}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                  {item.hasAI && (
                                    <Box sx={{
                                      bgcolor: '#e8f5e9',
                                      color: '#2e7d32',
                                      px: 0.8,
                                      py: 0.2,
                                      borderRadius: 1,
                                      fontSize: '0.6rem',
                                      fontWeight: 500
                                    }}>
                                      AI
                                    </Box>
                                  )}
                                  {item.isCore && (
                                    <Box sx={{
                                      bgcolor: '#f3e5f5',
                                      color: '#6a1b9a',
                                      px: 0.8,
                                      py: 0.2,
                                      borderRadius: 1,
                                      fontSize: '0.6rem',
                                      fontWeight: 500
                                    }}>
                                      Core
                                    </Box>
                                  )}
                                </Box>
                              </Box>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
            </Paper>
          </Collapse>
        )}

        {/* Study Materials */}
        {isLoggedIn && (
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => handleNavigate('/study-materials')}
              sx={{ 
                borderRadius: 2, 
                mb: 1,
                '&:hover': { bgcolor: '#e3f2fd' }
              }}
            >
              <ListItemIcon>
                <MenuBook sx={{ color: '#4DB6AC' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Study Materials" 
                primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        )}

        {/* Progress */}
        {isLoggedIn && (
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => handleNavigate('/progress')}
              sx={{ 
                borderRadius: 2, 
                mb: 1,
                '&:hover': { bgcolor: '#e3f2fd' }
              }}
            >
              <ListItemIcon>
                <TrendingUp sx={{ color: '#4DB6AC' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Progress" 
                primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        )}

        {/* Login/Signup for non-logged in users */}
        {!isLoggedIn && (
          <>
            <Divider sx={{ my: 2 }} />
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => { onLoginClick(); setMobileDrawerOpen(false); }}
                sx={{ 
                  borderRadius: 2, 
                  mb: 1,
                  '&:hover': { bgcolor: '#e3f2fd' }
                }}
              >
                <ListItemText 
                  primary="Login" 
                  primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500, textAlign: 'center' }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => { onLoginClick(); setMobileDrawerOpen(false); }}
                sx={{ 
                  borderRadius: 2, 
                  bgcolor: '#4DB6AC',
                  color: 'white',
                  '&:hover': { bgcolor: '#3C9C92' }
                }}
              >
                <ListItemText 
                  primary="Sign Up" 
                  primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500, textAlign: 'center' }}
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <Toolbar>
          {/* Mobile Hamburger Menu */}
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <Dehaze sx={{ color: '#4DB6AC' }} />
            </IconButton>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box
              component="img"
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiM0REI2QUMiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjMyIiBmb250LXdlaWdodD0iYm9sZCI+QTwvdGV4dD4KPC9zdmc+"
              sx={{ width: 40, height: 40, mr: 2 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#4DB6AC', fontSize: '1.5rem' }}>
              APEUNI
            </Typography>

            {/* Desktop Navigation - Restore original functionality */}
            <Box sx={{ ml: 4, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              {menuItems.map((item) =>
                item.hasSubMenu ? (
                  <PtePracticeMenu key={item.path} />
                ) : (
                  <Button
                    key={item.path}
                    color="inherit"
                    component={Link}
                    to={item.path}
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: '#333',
                      '&:hover': {
                        color: '#4DB6AC',
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                )
              )}
            </Box>
          </Box>

          {/* Desktop Right Side */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {isLoggedIn ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={handleProfileMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: '#4DB6AC', width: 36, height: 36, fontSize: '1rem' }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  color="inherit"
                  onClick={onLoginClick}
                  sx={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#333',
                    '&:hover': {
                      color: '#4DB6AC',
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  onClick={onLoginClick}
                  sx={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    bgcolor: '#4DB6AC',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#3C9C92',
                    },
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>

          {/* Mobile Profile Icon */}
          {isMobile && isLoggedIn && (
            <IconButton onClick={handleProfileMenu} sx={{ p: 0, ml: 1 }}>
              <Avatar sx={{ bgcolor: '#4DB6AC', width: 32, height: 32, fontSize: '0.9rem' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Profile Menu */}
      {isLoggedIn && (
        <Menu 
          anchorEl={anchorEl} 
          open={Boolean(anchorEl)} 
          onClose={handleCloseProfileMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={() => { navigate('/profile'); handleCloseProfileMenu(); }}>
            <Settings sx={{ mr: 1, color: '#333' }} />
            <Typography sx={{ fontSize: '0.9rem', color: '#333' }}>Profile</Typography>
          </MenuItem>
          <MenuItem component={Link} to="/dashboard" onClick={handleCloseProfileMenu}>
            <ListItemIcon><Dashboard sx={{ color: '#333' }} /></ListItemIcon>
            <ListItemText><Typography sx={{ fontSize: '0.9rem', color: '#333' }}>Dashboard</Typography></ListItemText>
          </MenuItem>
          {/* <MenuItem component={Link} to="/admin" onClick={handleCloseProfileMenu}>
            <ListItemIcon><AdminPanelSettings sx={{ color: '#333' }} /></ListItemIcon>
            <ListItemText><Typography sx={{ fontSize: '0.9rem', color: '#333' }}>Admin Panel</Typography></ListItemText>
          </MenuItem> */}
          <MenuItem component={Link} to="/admin/new" onClick={handleCloseProfileMenu}>
            <ListItemIcon><AdminPanelSettings sx={{ color: '#4DB6AC' }} /></ListItemIcon>
            <ListItemText><Typography sx={{ fontSize: '0.9rem', color: '#4DB6AC', fontWeight: 500 }}>Admin-new</Typography></ListItemText>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Logout sx={{ mr: 1, color: '#333' }} />
            <Typography sx={{ fontSize: '0.9rem', color: '#333' }}>Logout</Typography>
          </MenuItem>
        </Menu>
      )}
    </>
  );
};