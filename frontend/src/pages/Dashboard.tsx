import { Box, Typography, Container } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" data-testid="welcome-message">
          Welcome{user ? `, ${user.email}` : ''}
        </Typography>
        <Typography sx={{ mt: 2 }}>This is a protected dashboard.</Typography>
      </Box>
    </Container>
  );
}
