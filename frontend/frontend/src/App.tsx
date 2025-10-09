import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Button, Box } from '@mui/material'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

const theme = createTheme()

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppBar position="static">
          <Toolbar>
            <Box sx={{ flex: 1 }}>
              <Button color="inherit" component={Link} to="/">Home</Button>
            </Box>
            <Button color="inherit" component={Link} to="/login">Sign in</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
