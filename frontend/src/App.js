import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from './context/AuthContext';
import { NotesProvider } from './context/NotesContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import NotesPage from './pages/NotesPage';
import SharedNotesPage from './pages/SharedNotesPage';
import ArchivedNotesPage from './pages/ArchivedNotesPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import theme from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import ErrorBoundary from './ErrorBoundary';

const TestConnection = () => {
  const testBackend = async () => {
    try {
      const response = await axios.get('http://localhost:3003/api/test'); // Replace with your backend URL
      console.log("Backend response:", response.data);
      alert(`Success! Backend says: ${response.data.message}`);
    } catch (error) {
      console.error("Connection failed:", error);
      alert("Failed to connect to backend!");
    }
  };

  return <button onClick={testBackend}>Test Backend Connection</button>;
};
function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <ErrorBoundary fallback={<div>Authentication system failed</div>}>
        <AuthProvider>
          <NotesProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/notes" element={<NotesPage />} />
                  <Route path="/shared" element={<SharedNotesPage />} />
                  <Route path="/archived" element={<ArchivedNotesPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </Layout>
            </Router>
          </NotesProvider>
        </AuthProvider>
      </ErrorBoundary>

    </ThemeProvider>
  );
}

export default App;