import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Stack,
  Button,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Close } from '@mui/icons-material';

export interface DialogWrapperProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  showCloseButton?: boolean;
  actions?: React.ReactNode;
  defaultActions?: {
    cancelText?: string;
    confirmText?: string;
    onCancel?: () => void;
    onConfirm?: () => void;
    confirmColor?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
    variant?: 'text' | 'outlined' | 'contained';
  };
}

const DialogWrapper: React.FC<DialogWrapperProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'md',
  fullWidth = true,
  showCloseButton = true,
  actions,
  defaultActions
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth={maxWidth} 
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '18px', sm: '20px' }
            }}
          >
            {title}
          </Typography>
          {showCloseButton && (
            <IconButton 
              onClick={onClose}
              size={isMobile ? 'small' : 'medium'}
              sx={{ 
                color: 'grey.500',
                '&:hover': { bgcolor: 'grey.100' }
              }}
            >
              <Close />
            </IconButton>
          )}
        </Stack>
      </DialogTitle>
      
      <DialogContent sx={{ py: 2 }}>
        {children}
      </DialogContent>
      
      {(actions || defaultActions) && (
        <DialogActions sx={{ p: 3, pt: 1 }}>
          {actions ? (
            actions
          ) : defaultActions ? (
            <Stack direction="row" spacing={2}>
              {defaultActions.onCancel && (
                <Button 
                  onClick={defaultActions.onCancel}
                  variant={defaultActions.variant || 'outlined'}
                  size={isMobile ? 'small' : 'medium'}
                  sx={{ minWidth: { xs: 80, sm: 100 } }}
                >
                  {defaultActions.cancelText || 'Cancel'}
                </Button>
              )}
              {defaultActions.onConfirm && (
                <Button 
                  onClick={defaultActions.onConfirm}
                  variant={defaultActions.variant || 'contained'}
                  color={defaultActions.confirmColor || 'primary'}
                  size={isMobile ? 'small' : 'medium'}
                  sx={{ minWidth: { xs: 80, sm: 100 } }}
                >
                  {defaultActions.confirmText || 'Confirm'}
                </Button>
              )}
            </Stack>
          ) : null}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default DialogWrapper;