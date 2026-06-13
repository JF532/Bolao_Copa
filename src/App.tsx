import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './contexts/ToastContext'
import { BrazilThemeProvider } from './contexts/BrazilThemeContext'
import { AppRoutes } from './routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <BrazilThemeProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </BrazilThemeProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
