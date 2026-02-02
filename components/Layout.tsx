
import React from 'react';
import { TabType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  title: string;
  hideNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, title, hideNav }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Simulated Status Bar */}
      <div className="h-12 w-full bg-bgLight/80 backdrop-blur-md fixed top-0 z-50"></div>

      {/* Top App Bar */}
      {!hideNav && (
        <header className="fixed top-0 w-full z-40 bg-bgLight/90 backdrop-blur-md pt-12 pb-2 px-4 border-b border-black/5 max-w-md mx-auto left-0 right-0">
          <div className="flex items-center justify-between h-12">
            <button className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 active:scale-95 transition-transform text-primary">
              <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
            </button>
            <h1 className="text-primary text-lg font-bold tracking-tight">{title}</h1>
            <div className="size-10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[24px]">notifications</span>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-1 w-full max-w-md mx-auto ${hideNav ? '' : 'pt-28 pb-32'}`}>
        {children}
      </main>

      {/* Bottom Navigation Bar */}
      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-100 pb-safe pt-2 px-6 shadow-[0_-4px_20px_-4px,rgba(0,0,0,0.05)] z-50 rounded-t-3xl max-w-md mx-auto">
          <div className="flex justify-between items-end h-16 pb-2">
            <NavBtn label="Trang chủ" icon="home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavBtn label="Sản phẩm" icon="grid_view" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
            
            {/* Prominent Center Action */}
            <button 
              onClick={() => setActiveTab('support')}
              className="flex flex-col items-center gap-1 w-16 text-primary relative"
            >
              <div className={`absolute -top-10 rounded-full p-3 shadow-lg border-4 border-bgLight transition-all ${activeTab === 'support' ? 'bg-primary text-white scale-110' : 'bg-white text-primary'}`}>
                <span className={`material-symbols-outlined text-2xl ${activeTab === 'support' ? 'filled-icon' : ''}`}>build</span>
              </div>
              <span className={`text-[10px] mt-6 font-bold transition-opacity ${activeTab === 'support' ? 'opacity-100' : 'opacity-60'}`}>Hỗ trợ</span>
            </button>

            <NavBtn label="Thông báo" icon="notifications" active={false} onClick={() => {}} />
            <NavBtn label="Tài khoản" icon="person" active={activeTab === 'account'} onClick={() => setActiveTab('account')} />
          </div>
          <div className="h-5 w-full"></div>
        </nav>
      )}
    </div>
  );
};

const NavBtn = ({ label, icon, active, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 w-16 transition-colors ${active ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}>
    <span className={`material-symbols-outlined text-2xl ${active ? 'filled-icon' : ''}`}>{icon}</span>
    <span className={`text-[10px] font-medium tracking-tight ${active ? 'font-bold' : ''}`}>{label}</span>
  </button>
);

export default Layout;
