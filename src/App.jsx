import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { LangProvider, useLang } from './context/LangContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Sections from './pages/Sections';
import Schedule from './pages/Schedule';
import MyBookings from './pages/MyBookings';
import Dashboard from './pages/Dashboard';
import AttendancePage from './pages/AttendancePage';
import MyAttendance from './pages/MyAttendance';

const ProtectedRoute = ({ children, role }) => {
  const { userInfo } = useContext(AuthContext);
  if (!userInfo) return <Navigate to="/login" />;
  if (role && userInfo.role !== role) return <Navigate to="/" />;
  return children;
};

const App = () => {
  return (
    <LangProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <main style={{ padding: '2rem 0', minHeight: 'calc(100vh - 4.5rem)' }}>
            <div className="container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/sections" element={<Sections />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/my-bookings" element={
                  <ProtectedRoute role="student"><MyBookings /></ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute role="trainer"><Dashboard /></ProtectedRoute>
                } />
                <Route path="/attendance/:trainingId" element={
                  <ProtectedRoute role="trainer"><AttendancePage /></ProtectedRoute>
                } />
                <Route path="/my-attendance" element={
                  <ProtectedRoute role="student"><MyAttendance /></ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </main>
        </Router>
      </AuthProvider>
    </LangProvider>
  );
};

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '8rem 1rem' }}>
      <div style={{ fontSize: '6rem', fontWeight: 900, background: 'linear-gradient(135deg,var(--primary-light),var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>The page you're looking for doesn't exist.</p>
      <a href="/" className="btn btn-primary">Go Home</a>
    </div>
  );
};

export default App;
