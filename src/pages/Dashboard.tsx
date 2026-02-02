import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Navigate } from 'react-router-dom';
import { SourcesPanel } from '@/components/dashboard/SourcesPanel';
import { ChatPanel } from '@/components/dashboard/ChatPanel';
import { ResultPanel } from '@/components/dashboard/ResultPanel';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const { language } = useLanguage();

  // Redirect to home if not authenticated or no role selected
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!user?.role) {
    return <Navigate to="/" replace />;
  }

  const isCreator = user.role === 'creator';

  return (
    <div className="h-screen flex flex-col bg-background">
      <DashboardHeader />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Sources */}
        <div className="w-64 border-r border-border flex-shrink-0 overflow-y-auto hidden md:block">
          <SourcesPanel isCreator={isCreator} />
        </div>
        
        {/* Center Panel - Chat/Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatPanel isCreator={isCreator} />
        </div>
        
        {/* Right Panel - Results/Stats */}
        <div className="w-80 border-l border-border flex-shrink-0 overflow-y-auto hidden lg:block">
          <ResultPanel isCreator={isCreator} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
