import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MatchesPage from './pages/MatchesPage';
import OracleMatchPage from './pages/OracleMatchPage';
import OnboardingPage from './pages/OnboardingPage';
import RequestsPage from './pages/RequestsPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';

const ProtectedRoute = ({ children, requireOnboarding = true }) => {
  const { token, user } = useAuth();
  
  if (!token) return <Navigate to="/login" />;
  
  if (requireOnboarding && user && !user.onboardingComplete) {
    return <Navigate to="/onboarding" />;
  }
  
  return children;
};

function AppContent() {
  const { user, logout, token } = useAuth();

  return (
    <Router>
      <div className="min-h-screen pb-20 md:pb-0 text-slate-200 selection:bg-primary/30 font-body">
        {/* Animated Background */}
        <div className="bg-animated-mesh">
          <div className="mesh-blob mesh-blob-1"></div>
          <div className="mesh-blob mesh-blob-2"></div>
          <div className="mesh-blob mesh-blob-3"></div>
        </div>

        {token && user?.onboardingComplete && <Navbar user={user} logout={logout} />}
        <main className="container mx-auto px-4 py-4 md:py-8 lg:px-8 relative z-10">
          <Routes>
            <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/dashboard" />} />
            
            <Route path="/onboarding" element={
              <ProtectedRoute requireOnboarding={false}>
                <OnboardingPage />
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/matches" element={<ProtectedRoute><MatchesPage /></ProtectedRoute>} />
            <Route path="/oracle" element={<ProtectedRoute><OracleMatchPage /></ProtectedRoute>} />
            <Route path="/requests" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/chat/:id" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
