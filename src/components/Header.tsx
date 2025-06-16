// import React, { useState } from 'react';
// import { AppBar, Toolbar, Box, Typography, Button, IconButton, Avatar, Menu, MenuItem, Divider, ListItemIcon, ListItemText } from '@mui/material';
// import { Settings, Logout, Menu as MenuIcon, Dashboard, AdminPanelSettings } from '@mui/icons-material';
// import { Link, useNavigate } from 'react-router-dom';
// import { User } from '../types/user';
// import PtePracticeMenu from './PtePracticeMenu';

// interface HeaderProps {
//   isLoggedIn: boolean;
//   user: User | null;
//   onLoginClick: () => void;
//   onLogout: () => void;
// }

// export const Header: React.FC<HeaderProps> = ({ isLoggedIn, user, onLoginClick, onLogout }) => {
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
//   const navigate = useNavigate();

//   const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
//     setMobileMenuAnchor(event.currentTarget);
//   };

//   const handleMobileMenuClose = () => {
//     setMobileMenuAnchor(null);
//   };

//   const handleLogout = () => {
//     onLogout();
//     handleClose();
//     navigate('/');
//   };

//   const menuItems = [
//     { label: 'Home', path: '/' },
//     ...(isLoggedIn ? [
//       { label: 'PTE Practice', path: '/practice', hasSubMenu: true },
//       { label: 'Study Materials', path: '/materials' },
//       { label: 'Progress', path: '/progress' },
//     ] : []),
//   ];

//   return (
//     <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
//       <Toolbar>
//         <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
//           <Box
//             component="img"
//             src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0REI2QUMiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iYm9sZCI+QTwvdGV4dD4KPC9zdmc+"
//             sx={{ width: 40, height: 40, mr: 2 }}
//           />
//           <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
//             APEUNI
//           </Typography>

//           {/* Desktop Navigation */}
//           <Box sx={{ ml: 4, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
//             {menuItems.map((item) =>
//               item.hasSubMenu ? (
//                 <PtePracticeMenu key={item.path} />
//               ) : (
//                 <Button key={item.path} color="inherit" component={Link} to={item.path}>
//                   {item.label}
//                 </Button>
//               )
//             )}
//           </Box>
//         </Box>

//         {/* Desktop Right Side */}
//         <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
//           {isLoggedIn ? (
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//               <IconButton onClick={handleMenu} sx={{ p: 0 }}>
//                 <Avatar sx={{ bgcolor: 'primary.main' }}>
//                   {user?.name?.charAt(0).toUpperCase()}
//                 </Avatar>
//               </IconButton>
//               <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
//                 <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
//                   <Settings sx={{ mr: 1 }} /> Profile
//                 </MenuItem>
//                 <MenuItem component={Link} to="/dashboard" onClick={handleClose}>
//                   <ListItemIcon><Dashboard /></ListItemIcon>
//                   <ListItemText>Dashboard</ListItemText>
//                 </MenuItem>
//                 {/* {user?.role === 'admin' && ( */}
//             <MenuItem component={Link} to="/admin" onClick={handleClose}>
//               <ListItemIcon><AdminPanelSettings /></ListItemIcon>
//               <ListItemText>Admin Panel</ListItemText>
//             </MenuItem>
//           {/* )} */}
//                 <MenuItem onClick={handleLogout}>
//                   <Logout sx={{ mr: 1 }} /> Logout
//                 </MenuItem>
//               </Menu>
//             </Box>
//           ) : (
//             <Box sx={{ display: 'flex', gap: 2 }}>
//               <Button color="inherit" onClick={onLoginClick}>Login</Button>
//               <Button variant="contained" onClick={onLoginClick}>Sign Up</Button>
//             </Box>
//           )}
//         </Box>

//         {/* Mobile Menu Button */}
//         <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
//           {isLoggedIn ? (
//             <IconButton onClick={handleMenu} sx={{ p: 0 }}>
//               <Avatar sx={{ bgcolor: 'primary.main' }}>
//                 {user?.name?.charAt(0).toUpperCase()}
//               </Avatar>
//             </IconButton>
//           ) : (
//             <IconButton onClick={handleMobileMenu} color="inherit">
//               <MenuIcon />
//             </IconButton>
//           )}
//         </Box>

//         {/* Mobile Menu */}
//         <Menu
//           anchorEl={mobileMenuAnchor}
//           open={Boolean(mobileMenuAnchor)}
//           onClose={handleMobileMenuClose}
//           sx={{ display: { xs: 'block', md: 'none' } }}
//         >
//           {menuItems.map((item) =>
//             item.hasSubMenu ? (
//               <PtePracticeMenu key={item.path} isMobile />
//             ) : (
//               <MenuItem
//                 key={item.path}
//                 onClick={() => {
//                   navigate(item.path);
//                   handleMobileMenuClose();
//                 }}
//               >
//                 {item.label}
//               </MenuItem>
//             )
//           )}
//           {!isLoggedIn && [
//             <MenuItem key="login" onClick={() => { onLoginClick(); handleMobileMenuClose(); }}>
//               Login
//             </MenuItem>,
//             <MenuItem key="signup" onClick={() => { onLoginClick(); handleMobileMenuClose(); }}>
//               Sign Up
//             </MenuItem>,
//           ]}
//         </Menu>

//         {/* Logged in user mobile menu */}
//         {isLoggedIn && (
//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleClose}
//             sx={{ display: { xs: 'block', md: 'none' } }}
//           >
//             {menuItems.map((item) =>
//               item.hasSubMenu ? (
//                 <PtePracticeMenu key={item.path} isMobile />
//               ) : (
//                 <MenuItem
//                   key={item.path}
//                   onClick={() => {
//                     navigate(item.path);
//                     handleClose();
//                   }}
//                 >
//                   {item.label}
//                 </MenuItem>
//               )
//             )}
//             <Divider />
//             <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
//               <Settings sx={{ mr: 1 }} /> Profile
//             </MenuItem>
//             <MenuItem onClick={handleLogout}>
//               <Logout sx={{ mr: 1 }} /> Logout
//             </MenuItem>
//           </Menu>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };

import React, { useState } from 'react';
import { AppBar, Toolbar, Box, Typography, Button, IconButton, Avatar, Menu, MenuItem, Divider, ListItemIcon, ListItemText } from '@mui/material';
import { Settings, Logout, Menu as MenuIcon, Dashboard, AdminPanelSettings } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types/user';
import PtePracticeMenu from './PtePracticeMenu';

interface HeaderProps {
  isLoggedIn: boolean;
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isLoggedIn, user, onLoginClick, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    onLogout();
    handleClose();
    navigate('/');
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    ...(isLoggedIn ? [
      { label: 'PTE Practice', path: '/practice', hasSubMenu: true },
      { label: 'Study Materials', path: '/materials' },
      { label: 'Progress', path: '/progress' },
    ] : []),
  ];

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box
            component="img"
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiM0REI2QUMiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjMyIiBmb250LXdlaWdodD0iYm9sZCI+QTwvdGV4dD4KPC9zdmc+"
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#4DB6AC', fontSize: '1.5rem' }}>
            APEUNI
          </Typography>

          {/* Desktop Navigation */}
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
              <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: '#4DB6AC', width: 36, height: 36, fontSize: '1rem' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                  <Settings sx={{ mr: 1, color: '#333' }} />
                  <Typography sx={{ fontSize: '0.9rem', color: '#333' }}>Profile</Typography>
                </MenuItem>
                <MenuItem component={Link} to="/dashboard" onClick={handleClose}>
                  <ListItemIcon><Dashboard sx={{ color: '#333' }} /></ListItemIcon>
                  <ListItemText><Typography sx={{ fontSize: '0.9rem', color: '#333' }}>Dashboard</Typography></ListItemText>
                </MenuItem>
                <MenuItem component={Link} to="/admin" onClick={handleClose}>
                  <ListItemIcon><AdminPanelSettings sx={{ color: '#333' }} /></ListItemIcon>
                  <ListItemText><Typography sx={{ fontSize: '0.9rem', color: '#333' }}>Admin Panel</Typography></ListItemText>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1, color: '#333' }} />
                  <Typography sx={{ fontSize: '0.9rem', color: '#333' }}>Logout</Typography>
                </MenuItem>
              </Menu>
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

        {/* Mobile Menu Button */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          {isLoggedIn ? (
            <IconButton onClick={handleMenu} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: '#4DB6AC', width: 36, height: 36, fontSize: '1rem' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          ) : (
            <IconButton onClick={handleMobileMenu} color="inherit">
              <MenuIcon sx={{ color: '#333' }} />
            </IconButton>
          )}
        </Box>

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          {menuItems.map((item) =>
            item.hasSubMenu ? (
              <PtePracticeMenu key={item.path} isMobile />
            ) : (
              <MenuItem
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  handleMobileMenuClose();
                }}
              >
                <Typography sx={{ fontSize: '0.9rem', color: '#333' }}>{item.label}</Typography>
              </MenuItem>
            )
          )}
          {!isLoggedIn && [
            <MenuItem key="login" onClick={() => { onLoginClick(); handleMobileMenuClose(); }}>
              <Typography sx={{ fontSize: '0.9rem', color: '#333' }}>Login</Typography>
            </MenuItem>,
            <MenuItem key="signup" onClick={() => { onLoginClick(); handleMobileMenuClose(); }}>
              <Typography sx={{ fontSize: '0.9rem', color: '#333' }}>Sign Up</Typography>
            </MenuItem>,
          ]}
        </Menu>

        {/* Logged in user mobile menu */}
        {isLoggedIn && (
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            {menuItems.map((item) =>
              item.hasSubMenu ? (
                <PtePracticeMenu key={item.path} isMobile />
              ) : (
                <MenuItem
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    handleClose();
                  }}
                >
                  <Typography sx={{ fontSize: '0.9rem', color: '#333' }}>{item.label}</Typography>
                </MenuItem>
              )
            )}
            <Divider />
            <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
              <Settings sx={{ mr: 1, color: '#333' }} />
              <Typography sx={{ fontSize: '0.9rem', color: '#333' }}>Profile</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1, color: '#333' }} />
              <Typography sx={{ fontSize: '0.9rem', color: '#333' }}>Logout</Typography>
            </MenuItem>
          </Menu>
        )}
      </Toolbar>
    </AppBar>
  );
};