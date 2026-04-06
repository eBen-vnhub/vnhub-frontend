import { Outlet } from 'react-router-dom';
import Header from '../components/portal/Header';
import Sidebar from '../components/portal/Sidebar';
import Footer from '../components/portal/Footer';

export default function PortalLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-hover">
      <Header />
      
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 w-full py-8 flex gap-8">
        <Sidebar />
        
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
