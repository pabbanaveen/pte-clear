import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Stack
} from '@mui/material';
import {
  People,
  Quiz,
  TrendingUp,
  CloudUpload,
  Assessment,
  Settings
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import CustomCard from '../../common/CustomCard';
import CustomButton from '../../common/CustomButton';

const AdminDashboard: React.FC = () => {
  const [stats] = useState({
    totalUsers: 1247,
    totalQuestions: 892,
    testsCompleted: 5634,
    averageScore: 78.5
  });

  const [recentActivity] = useState([
    { id: 1, action: 'New user registered', user: 'John Doe', time: '2 minutes ago' },
    { id: 2, action: 'Question uploaded', user: 'Admin', time: '15 minutes ago' },
    { id: 3, action: 'Test completed', user: 'Sarah Wilson', time: '1 hour ago' },
    { id: 4, action: 'Bulk upload completed', user: 'Admin', time: '2 hours ago' }
  ]);

  const adminActions = [
    {
      title: 'Manage Questions',
      description: 'Add, edit, or delete practice questions',
      icon: <Quiz />,
      link: '/admin/questions',
      color: 'primary'
    },
    {
      title: 'Upload Questions',
      description: 'Bulk upload questions from Excel',
      icon: <CloudUpload />,
      link: '/admin/questions',
      color: 'secondary'
    },
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: <People />,
      link: '/admin/users',
      color: 'success'
    },
    {
      title: 'Analytics',
      description: 'View platform analytics and reports',
      icon: <Assessment />,
      link: '/admin/analytics',
      color: 'warning'
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage your PTE Clear platform
        </Typography>
      </Box>

      {/* Stats Overview */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <CustomCard>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              <People />
            </Avatar>
            <Box>
              <Typography variant="h4" component="div" fontWeight="bold">
                {stats.totalUsers.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Users
              </Typography>
            </Box>
          </Box>
        </CustomCard>

        <CustomCard>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
              <Quiz />
            </Avatar>
            <Box>
              <Typography variant="h4" component="div" fontWeight="bold">
                {stats.totalQuestions.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Questions
              </Typography>
            </Box>
          </Box>
        </CustomCard>

        <CustomCard>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
              <TrendingUp />
            </Avatar>
            <Box>
              <Typography variant="h4" component="div" fontWeight="bold">
                {stats.testsCompleted.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tests Completed
              </Typography>
            </Box>
          </Box>
        </CustomCard>

        <CustomCard>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
              <Assessment />
            </Avatar>
            <Box>
              <Typography variant="h4" component="div" fontWeight="bold">
                {stats.averageScore}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Score
              </Typography>
            </Box>
          </Box>
        </CustomCard>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4 }}>
        {/* Quick Actions */}
        <Box>
          <CustomCard title="Quick Actions" sx={{ mb: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              {adminActions.map((action) => (
                <Card 
                  key={action.title}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 4 }
                  }}
                  component={Link}
                  to={action.link}
                  style={{ textDecoration: 'none' }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: `${action.color}.main` }}>
                        {action.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" component="h3">
                          {action.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {action.description}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </CustomCard>

          {/* Quick Upload */}
          <CustomCard title="Quick Upload" icon={<CloudUpload />}>
            <Typography variant="body1" paragraph>
              Upload questions in bulk using Excel files. Supported formats: .xlsx, .xls
            </Typography>
            <CustomButton
              variant="contained"
              component={Link}
              to="/admin/questions"
              startIcon={<CloudUpload />}
            >
              Upload Questions
            </CustomButton>
          </CustomCard>
        </Box>

        {/* Recent Activity */}
        <CustomCard title="Recent Activity" icon={<TrendingUp />}>
          <List>
            {recentActivity.map((activity, index) => (
              <React.Fragment key={activity.id}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'grey.100', width: 32, height: 32 }}>
                      {activity.user.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={activity.action}
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          by {activity.user}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {activity.time}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < recentActivity.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CustomCard>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
