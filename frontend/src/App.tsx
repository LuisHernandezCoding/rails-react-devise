import { Routes, Route, Link } from 'react-router-dom'
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Button,
  Box,
} from '@mui/material'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { useAuth } from './contexts/AuthContext'

const theme = createTheme()

export default function App() {
  const { user, logout } = useAuth()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flex: 1 }}>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
          </Box>
          {user ? (
            <Button color="inherit" onClick={logout}>
              Sign out
            </Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Sign in
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </ThemeProvider>
  )
}
