import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* Protected Routes share the Navbar */}
        <Route path="/*" element={
          <ProtectedRoute>
            <Navbar />
            <div className="container mt-4">
              <Routes>
                <Route path="/search" element={<SearchPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;