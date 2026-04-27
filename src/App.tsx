import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import OnboardingWizard from './pages/OnboardingWizard';
import DashboardLayout from './pages/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import TeamBlueprint from './pages/TeamBlueprint';
import ActiveRoles from './pages/ActiveRoles';
import CandidateList from './pages/CandidateList';
import CandidateReport from './pages/CandidateReport';
import CandidateApplyPage from './pages/CandidateApplyPage';
import InterviewRoom from './pages/InterviewRoom';
import DocumentUpload from './pages/DocumentUpload';
import Settings from './pages/Settings';
import { PlaceholderPage } from './pages/PlaceholderPage';
import SeekerDashboard from './pages/SeekerDashboard';
import SeekerProfile from './pages/SeekerProfile';
import InterviewsTracker from './pages/InterviewsTracker';

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/onboarding" element={<OnboardingWizard />} />
          <Route path="/apply/:jobId" element={<CandidateApplyPage />} />
          <Route path="/interview/:sessionId" element={<InterviewRoom />} />
          <Route path="/upload" element={<DocumentUpload />} />
          
          <Route path="/seeker/dashboard" element={<SeekerDashboard />} />
          <Route path="/seeker/profile" element={<SeekerProfile />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
             <Route index element={<DashboardHome />} />
             <Route path="blueprint" element={<TeamBlueprint />} />
             <Route path="roles" element={<ActiveRoles />} />
             <Route path="candidates" element={<CandidateList />} />
             <Route path="candidate/:id" element={<CandidateReport />} />
             <Route path="interviews" element={<InterviewsTracker />} />
             <Route path="documents" element={<PlaceholderPage title="Documents" />} />
             <Route path="reports" element={<PlaceholderPage title="Reports" />} />
             <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}
