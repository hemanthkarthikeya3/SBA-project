import React from 'react';
import { Search, Bell, HelpCircle, Building2, User, ChevronDown } from 'lucide-react';
import { ClientProfile } from '../types';

interface TopNavbarProps {
  clients: ClientProfile[];
  selectedClient: ClientProfile;
  onSelectClient: (client: ClientProfile) => void;
  onOpenHelp: () => void;
  onOpenNotifications: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  clients,
  selectedClient,
  onSelectClient,
  onOpenHelp,
  onOpenNotifications,
  searchQuery,
  onSearchChange,
}) => {
  const [showClientDropdown, setShowClientDropdown] = React.useState(false);

  return (
    <nav
      id="top-navbar"
      className="fixed top-0 right-0 w-full md:w-[calc(100%-280px)] h-16 bg-[#f7fafc] border-b border-[#c4c6cf]/60 flex justify-between items-center px-4 md:px-8 z-30 transition-all duration-200"
    >
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold text-[#002045] tracking-tight flex items-center gap-2">
          Advisory AI
        </span>

        {/* Global Search Bar */}
        <div className="relative hidden sm:block ml-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-4 h-4" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search clients, insights, policies..."
            className="pl-9 pr-4 py-1.5 bg-white border border-[#c4c6cf] rounded text-sm text-[#181c1e] placeholder-[#74777f] focus:outline-none focus:ring-2 focus:ring-[#1960a3] w-64 md:w-80 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Client Switcher in Top Bar */}
        <div className="relative">
          <button
            id="client-switcher-btn"
            onClick={() => setShowClientDropdown(!showClientDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#c4c6cf] hover:border-[#1960a3] rounded text-xs md:text-sm font-medium text-[#002045] transition-colors shadow-xs"
          >
            <Building2 className="w-3.5 h-3.5 text-[#1960a3]" />
            <span className="max-w-[130px] md:max-w-[180px] truncate">{selectedClient.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#74777f]" />
          </button>

          {showClientDropdown && (
            <div className="absolute right-0 mt-1 w-64 bg-white border border-[#c4c6cf] rounded-md shadow-lg py-1 z-50">
              <div className="px-3 py-1.5 text-xs font-semibold text-[#74777f] uppercase tracking-wider border-b border-gray-100">
                Switch Business Client
              </div>
              {clients.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectClient(c);
                    setShowClientDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs md:text-sm flex items-center justify-between hover:bg-[#ebeef0] transition-colors ${
                    c.id === selectedClient.id ? 'bg-[#7db6ff]/15 font-semibold text-[#1960a3]' : 'text-[#181c1e]'
                  }`}
                >
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-[11px] text-[#74777f]">{c.industry}</div>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      c.riskTier === 'Low'
                        ? 'bg-emerald-100 text-emerald-800'
                        : c.riskTier === 'Moderate'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {c.riskTier}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          id="btn-notifications"
          onClick={onOpenNotifications}
          className="p-2 text-[#43474e] hover:text-[#181c1e] hover:bg-[#ebeef0] rounded-full transition-colors relative"
          title="Notifications & Risk Alerts"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full"></span>
        </button>

        {/* Help / Guide */}
        <button
          id="btn-help"
          onClick={onOpenHelp}
          className="p-2 text-[#43474e] hover:text-[#181c1e] hover:bg-[#ebeef0] rounded-full transition-colors"
          title="Advisory Guide & Methodology"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Banker Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#c4c6cf]/60">
          <div className="w-8 h-8 rounded-full bg-[#1a365d] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            MV
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-[#002045]">Marcus Vance</div>
            <div className="text-[10px] text-[#74777f]">VP Commercial Banking</div>
          </div>
        </div>
      </div>
    </nav>
  );
};
