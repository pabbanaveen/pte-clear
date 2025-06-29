import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (credentials: { email: string; password: string }) => Promise<void>;
  loading?: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, onLogin, loading = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    setLocalLoading(true);
    try {
      await onLogin({ email, password });
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleClose = () => {
    if (localLoading || loading) return; // Prevent closing during login
    onClose();
  };

  const isLoading = localLoading || loading;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', pb: 2 }}>
        Login to PTE Practice
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            <strong>Demo Credentials:</strong><br />
            Admin: admin@pte.com / admin123<br />
            User: user@pte.com / user123
          </Alert>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            sx={{ mb: 2 }}
          />

          <DialogActions sx={{ px: 0, pt: 2 }}>
            <Button
              onClick={handleClose}
              disabled={isLoading}
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !email || !password}
              startIcon={isLoading ? <CircularProgress size={16} /> : null}
              sx={{ minWidth: 100 }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
