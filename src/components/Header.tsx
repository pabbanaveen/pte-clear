import React, { useState } from 'react';
import { AppBar, Toolbar, Box, Typography, Button, IconButton, Avatar, Menu, MenuItem, Divider } from '@mui/material';
import { Settings, Logout, Menu as MenuIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types/user';

interface HeaderProps {
  isLoggedIn: boolean;
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isLoggedIn, user, onLoginClick, onLogout }) => {
//   return (
//     <AppBar position="static">
//       <Toolbar>
//         <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//           MyApp
//         </Typography>
//         {isLoggedIn ? (
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <IconButton
//               size="large"
//               aria-label="account settings"
//               aria-controls="menu-appbar"
//               aria-haspopup="true"
//               color="inherit"
//             >
//               <Avatar alt={user?.name} src={user?.avatar} />
//             </IconButton>
//             <Menu
//               id="menu-appbar"
//               anchorEl={null}
//               anchorOrigin={{
//                 vertical: 'bottom',
//                 horizontal: 'right',
//               }}
//               keepMounted
//               transformOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right',
//               }}
//               open={false}
//               onClose={() => {}}
//             >
//               <MenuItem component={Link} to="/settings">
//                 <Settings fontSize="small" />
//                 <Typography variant="inherit" noWrap sx={{ pl: 1 }}>
//                   Settings
//                 </Typography>
//               </MenuItem>
//               <Divider />
//               <MenuItem onClick={onLogout}>
//                 <Logout fontSize="small" />
//                 <Typography variant="inherit" noWrap sx={{ pl: 1 }}>
//                   Logout
//                 </Typography>
//               </MenuItem>
//             </Menu>
//           </Box>
//         ) : (
//           <Button color="inherit" onClick={onLoginClick}>
//             Login
//           </Button>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };
 const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const navigate = useNavigate();

  const handleMenu = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenu = (event:any) => {
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
      { label: 'PTE Practice', path: '/practice' },
      { label: 'Study Materials', path: '/materials' },
      { label: 'Progress', path: '/progress' }
    ] : [])
  ];

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box
            component="img"
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0REI2QUMiLz4KPHR2eHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iYm9sZCI+QTwvdGV4dD4KPC9zdmc+"
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
            APEUNI
          </Typography>
          
          {/* Desktop Navigation */}
          <Box sx={{ ml: 4, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {menuItems.map((item) => (
              <Button key={item.path} color="inherit" component={Link} to={item.path}>
                {item.label}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Desktop Right Side */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          {isLoggedIn ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                  <Settings sx={{ mr: 1 }} /> Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button color="inherit" onClick={onLoginClick}>Login</Button>
              <Button variant="contained" onClick={onLoginClick}>Sign Up</Button>
            </Box>
          )}
        </Box>

        {/* Mobile Menu Button */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          {isLoggedIn ? (
            <IconButton onClick={handleMenu} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          ) : (
            <IconButton onClick={handleMobileMenu} color="inherit">
              <MenuIcon />
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
          {menuItems.map((item) => (
            <MenuItem 
              key={item.path} 
              onClick={() => { 
                navigate(item.path); 
                handleMobileMenuClose(); 
              }}
            >
              {item.label}
            </MenuItem>
          ))}
          {!isLoggedIn && [
            <MenuItem key="login" onClick={() => { onLoginClick(); handleMobileMenuClose(); }}>
              Login
            </MenuItem>,
            <MenuItem key="signup" onClick={() => { onLoginClick(); handleMobileMenuClose(); }}>
              Sign Up
            </MenuItem>
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
            {menuItems.map((item) => (
              <MenuItem 
                key={item.path} 
                onClick={() => { 
                  navigate(item.path); 
                  handleClose(); 
                }}
              >
                {item.label}
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
              <Settings sx={{ mr: 1 }} /> Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        )}
      </Toolbar>
    </AppBar>
  );
};