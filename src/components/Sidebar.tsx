import React from 'react';
import { Users, BrainCircuit, Package, BarChart3, Settings, HelpCircle, Plus, Sparkles } from 'lucide-react';

export type NavView = 'clients' | 'insights' | 'products' | 'reports';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  onOpenNewAnalysis: () => void;
  onOpenSettings: () => void;
  onOpenSupport: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  onOpenNewAnalysis,
  onOpenSettings,
  onOpenSupport,
}) => {
  const navItems = [
    { id: 'clients' as NavView, label: 'Clients', icon: Users },
    { id: 'insights' as NavView, label: 'Insights', icon: BrainCircuit },
    { id: 'products' as NavView, label: 'Products', icon: Package },
    { id: 'reports' as NavView, label: 'Reports', icon: BarChart3 },
  ];

  return (
    <aside
      id="main-sidebar"
      className="fixed left-0 top-0 h-full w-[280px] bg-white border-r border-[#c4c6cf]/60 flex-col py-6 z-40 hidden md:flex"
    >
      {/* Brand Header */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-[#002045] text-white flex items-center justify-center font-bold text-lg shadow-sm">
          AA
        </div>
        <div>
          <div className="font-semibold text-base text-[#002045] tracking-tight">
            Advisory Platform
          </div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#74777f]">
            Relationship Manager
          </div>
        </div>
      </div>

      {/* New Analysis CTA */}
      <div className="px-4 mb-6">
        <button
          id="btn-new-analysis"
          onClick={onOpenNewAnalysis}
          className="w-full bg-[#1a365d] text-white rounded py-2.5 px-4 flex items-center justify-center gap-2 hover:bg-[#002045] transition-all shadow-xs text-sm font-medium cursor-pointer group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
          <span>New Analysis</span>
          <Sparkles className="w-3.5 h-3.5 text-[#adc7f7] ml-auto opacity-75" />
        </button>
      </div>

      {/* Main Navigation Links */}
      <ul className="flex-1 space-y-1 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <li key={item.id}>
              <button
                id={`nav-${item.id}`}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-r border-l-4 text-sm font-medium transition-all ${
                  isActive
                    ? 'border-[#1960a3] text-[#1960a3] bg-[#7db6ff]/15 font-semibold'
                    : 'border-transparent text-[#43474e] hover:text-[#002045] hover:bg-[#f1f4f6]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#1960a3]' : 'text-[#74777f]'}`} />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Bottom Utility Nav */}
      <div className="mt-auto px-2 space-y-1 border-t border-[#c4c6cf]/40 pt-4">
        <button
          id="nav-settings"
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#43474e] hover:text-[#002045] hover:bg-[#f1f4f6] rounded transition-colors"
        >
          <Settings className="w-4 h-4 text-[#74777f]" />
          <span>Settings</span>
        </button>
        <button
          id="nav-support"
          onClick={onOpenSupport}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#43474e] hover:text-[#002045] hover:bg-[#f1f4f6] rounded transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-[#74777f]" />
          <span>Support</span>
        </button>
      </div>
    </aside>
  );
};
