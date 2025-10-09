import { Box, Button, Typography, Container } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4">Welcome{user ? `, ${user.email}` : ''}</Typography>
        <Typography sx={{ mt: 2 }}>This is a protected dashboard.</Typography>
        <Button sx={{ mt: 4 }} variant="outlined" onClick={() => logout()}>
          Sign out
        </Button>
      </Box>
    </Container>
  )
}
