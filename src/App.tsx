import React, { useState } from 'react';
import { TopNavbar } from './components/TopNavbar';
import { Sidebar, NavView } from './components/Sidebar';
import { ClientHeader } from './components/ClientHeader';
import { FinancialMetricsBento } from './components/FinancialMetricsBento';
import { CashFlowVisualizer } from './components/CashFlowVisualizer';
import { RiskStressPanel } from './components/RiskStressPanel';
import { AdvisoryNextBestAction } from './components/AdvisoryNextBestAction';
import { AdvisoryCopilot } from './components/AdvisoryCopilot';

// Modals
import { ARAgingModal } from './components/modals/ARAgingModal';
import { StressTestModal } from './components/modals/StressTestModal';
import { VendorLedgerModal } from './components/modals/VendorLedgerModal';
import { ExportReportModal } from './components/modals/ExportReportModal';
import { ScheduleReviewModal } from './components/modals/ScheduleReviewModal';
import { CitationViewerModal } from './components/modals/CitationViewerModal';
import { NewAnalysisModal } from './components/modals/NewAnalysisModal';

// Views
import { PortfolioInsightsView } from './components/views/PortfolioInsightsView';
import { ProductCatalogView } from './components/views/ProductCatalogView';
import { ReportsView } from './components/views/ReportsView';

// Data
import {
  MOCK_CLIENTS,
  CLIENT_RISK_ALERTS,
  CLIENT_ADVISORY_RECOMMENDATIONS,
  CASH_FLOW_DATA_GVO,
  BANK_PRODUCTS,
} from './data/mockClients';
import { ClientProfile, ChatMessage, Citation, AdvisoryRecommendation } from './types';
import { Users, BrainCircuit, Package, BarChart3, X } from 'lucide-react';

export default function App() {
  const [clients, setClients] = useState<ClientProfile[]>(MOCK_CLIENTS);
  const [selectedClient, setSelectedClient] = useState<ClientProfile>(MOCK_CLIENTS[0]);
  const [currentView, setCurrentView] = useState<NavView>('clients');
  const [searchQuery, setSearchQuery] = useState('');
  const [isStressApplied, setIsStressApplied] = useState(false);

  // Modals state
  const [activeModal, setActiveModal] = useState<
    | 'ar_aging'
    | 'stress_test'
    | 'vendor_ledger'
    | 'working_capital'
    | 'export_report'
    | 'schedule_review'
    | 'new_analysis'
    | 'help'
    | 'notifications'
    | null
  >(null);
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);

  // Copilot messages state in Rupees (₹)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'copilot',
      timestamp: '10:42 AM',
      text: "I've analyzed Green Valley Organics' recent transaction history in Indian Rupees (₹). Would you like a summary of the Q2 supply chain costs, or should we examine the delayed receivables (₹10.25 Lakhs) mentioned in the risk panel?",
    },
    {
      id: 'msg-2',
      sender: 'rm',
      timestamp: '10:45 AM',
      text: 'Summarize the Q2 supply chain costs compared to last year. Are there specific vendors driving the increase?',
    },
    {
      id: 'msg-3',
      sender: 'copilot',
      timestamp: '10:46 AM',
      text: 'Q2 supply chain costs increased by **8.4% YoY**.\n\nThe primary driver is a 12% increase in cold-chain logistics from *EcoTransit Solutions* (₹4,86,000 vs ₹4,34,000 prior year). Packaging costs from other vendors remained stable.',
      citations: [
        {
          id: 'cite-ecotransit-main',
          title: 'Open EcoTransit Cold-Chain Ledger.pdf',
          type: 'ledger',
          snippet:
            'EcoTransit Solutions Q2 Freight spend: ₹4,86,000 (+12.0% YoY vs ₹4,34,000). Expedited refrigerated transport routes to regional grocery fulfillment hubs with diesel fuel surcharges.',
        },
      ],
    },
  ]);
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);

  // Filter alerts & recommendations for current client
  const currentAlerts = CLIENT_RISK_ALERTS[selectedClient.id] || CLIENT_RISK_ALERTS['client-gvo'];
  const currentRecommendations =
    CLIENT_ADVISORY_RECOMMENDATIONS[selectedClient.id] || CLIENT_ADVISORY_RECOMMENDATIONS['client-gvo'];

  // Handle Copilot Chat submission
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'rm',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsCopilotLoading(true);

    try {
      const response = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          client: selectedClient,
          conversationHistory: [...messages, userMsg],
        }),
      });

      const data = await response.json();
      const copilotMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'copilot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: data.text || 'I have completed the requested financial analysis.',
        citations: data.citations || [],
        suggestedFollowUps: data.suggestedFollowUps,
      };
      setMessages((prev) => [...prev, copilotMsg]);
    } catch (err) {
      console.error(err);
      // Fallback
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'copilot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Analysis complete for ${selectedClient.name}: Quick Ratio is ${selectedClient.financialKPIs.quickRatio} and current runway is ${selectedClient.financialKPIs.runwayMonths} months. No covenant violations detected.`,
        },
      ]);
    } finally {
      setIsCopilotLoading(false);
    }
  };

  const handleDraftClientEmail = (_rec: AdvisoryRecommendation) => {
    setActiveModal('export_report');
  };

  const handleAskCopilotAboutRec = (rec: AdvisoryRecommendation) => {
    handleSendMessage(`Explain the credit policy and suitability matching for ${rec.title}.`);
  };

  const handleApplyStress = (_params: { revDrop: number; cogsSurge: number; arDelay: number }) => {
    setIsStressApplied(true);
  };

  return (
    <div className="min-h-screen bg-[#f7fafc] text-[#181c1e] font-sans antialiased">
      {/* Top Navigation Bar */}
      <TopNavbar
        clients={clients}
        selectedClient={selectedClient}
        onSelectClient={(c) => setSelectedClient(c)}
        onOpenHelp={() => setActiveModal('help')}
        onOpenNotifications={() => setActiveModal('notifications')}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Side Navigation Bar */}
      <Sidebar
        currentView={currentView}
        onSelectView={(v) => setCurrentView(v)}
        onOpenNewAnalysis={() => setActiveModal('new_analysis')}
        onOpenSettings={() => setActiveModal('help')}
        onOpenSupport={() => setActiveModal('help')}
      />

      {/* Main Content Layout */}
      <main
        id="main-canvas"
        className="md:ml-[280px] pt-16 md:pt-20 p-4 md:p-8 max-w-[1500px] mx-auto min-h-screen flex flex-col lg:flex-row gap-6 pb-24 md:pb-8"
      >
        {/* View Routing */}
        {currentView === 'clients' && (
          <>
            {/* Dashboard Content (Left Side) */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Header Section */}
              <ClientHeader
                client={selectedClient}
                onBackToClients={() => setCurrentView('insights')}
                onExportReport={() => setActiveModal('export_report')}
                onScheduleReview={() => setActiveModal('schedule_review')}
              />

              {/* Key Financial Ratios Bento Row in Rupees (₹) */}
              <FinancialMetricsBento
                kpis={selectedClient.financialKPIs}
                onInspectMetric={(metric) => handleSendMessage(`Break down the historical trend for ${metric}.`)}
              />

              {/* Cash Flow Visualizer Section */}
              <CashFlowVisualizer
                data={CASH_FLOW_DATA_GVO}
                isStressApplied={isStressApplied}
                onToggleStress={() => setIsStressApplied(!isStressApplied)}
                onOpenStressModal={() => setActiveModal('stress_test')}
              />

              {/* Proactive Risk & Stress Detection Panel */}
              <RiskStressPanel
                alerts={currentAlerts}
                onOpenModal={(modalType) => setActiveModal(modalType)}
              />

              {/* Responsible Advisory Next-Best-Actions */}
              <AdvisoryNextBestAction
                recommendations={currentRecommendations}
                onDraftClientEmail={handleDraftClientEmail}
                onAskCopilotAboutRec={handleAskCopilotAboutRec}
              />
            </div>

            {/* AI Advisory Copilot (Right Sticky Sidebar) */}
            <AdvisoryCopilot
              client={selectedClient}
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isCopilotLoading}
              onOpenCitation={(cite) => setSelectedCitation(cite)}
            />
          </>
        )}

        {currentView === 'insights' && (
          <div className="flex-1">
            <PortfolioInsightsView
              clients={clients}
              onSelectClient={(c) => {
                setSelectedClient(c);
                setCurrentView('clients');
              }}
            />
          </div>
        )}

        {currentView === 'products' && (
          <div className="flex-1">
            <ProductCatalogView
              products={BANK_PRODUCTS}
              onOpenProductInCopilot={(p) => {
                setCurrentView('clients');
                handleSendMessage(`Check if ${selectedClient.name} is eligible for ${p.name}.`);
              }}
            />
          </div>
        )}

        {currentView === 'reports' && (
          <div className="flex-1">
            <ReportsView
              clients={clients}
              onOpenReportModal={(c) => {
                setSelectedClient(c);
                setActiveModal('export_report');
              }}
            />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-[#c4c6cf]/60 flex justify-around items-center h-16 z-50 md:hidden pb-safe shadow-lg">
        <button
          onClick={() => setCurrentView('clients')}
          className={`flex flex-col items-center justify-center w-full h-full text-xs font-medium ${
            currentView === 'clients' ? 'text-[#1960a3] bg-[#7db6ff]/10 font-bold' : 'text-[#74777f]'
          }`}
        >
          <Users className="w-5 h-5 mb-1" />
          <span>Clients</span>
        </button>
        <button
          onClick={() => setCurrentView('insights')}
          className={`flex flex-col items-center justify-center w-full h-full text-xs font-medium ${
            currentView === 'insights' ? 'text-[#1960a3] bg-[#7db6ff]/10 font-bold' : 'text-[#74777f]'
          }`}
        >
          <BrainCircuit className="w-5 h-5 mb-1" />
          <span>Insights</span>
        </button>
        <button
          onClick={() => setCurrentView('products')}
          className={`flex flex-col items-center justify-center w-full h-full text-xs font-medium ${
            currentView === 'products' ? 'text-[#1960a3] bg-[#7db6ff]/10 font-bold' : 'text-[#74777f]'
          }`}
        >
          <Package className="w-5 h-5 mb-1" />
          <span>Products</span>
        </button>
        <button
          onClick={() => setCurrentView('reports')}
          className={`flex flex-col items-center justify-center w-full h-full text-xs font-medium ${
            currentView === 'reports' ? 'text-[#1960a3] bg-[#7db6ff]/10 font-bold' : 'text-[#74777f]'
          }`}
        >
          <BarChart3 className="w-5 h-5 mb-1" />
          <span>Reports</span>
        </button>
      </nav>

      {/* Modals */}
      <ARAgingModal
        client={selectedClient}
        isOpen={activeModal === 'ar_aging'}
        onClose={() => setActiveModal(null)}
        onSelectSolution={() => {
          setActiveModal(null);
          handleSendMessage('How quickly can we deploy the Whole Foods AR acceleration line in INR?');
        }}
      />

      <StressTestModal
        client={selectedClient}
        isOpen={activeModal === 'stress_test'}
        onClose={() => setActiveModal(null)}
        onApplyStress={handleApplyStress}
      />

      <VendorLedgerModal
        client={selectedClient}
        isOpen={activeModal === 'vendor_ledger'}
        onClose={() => setActiveModal(null)}
      />

      <ExportReportModal
        client={selectedClient}
        isOpen={activeModal === 'export_report'}
        onClose={() => setActiveModal(null)}
      />

      <ScheduleReviewModal
        client={selectedClient}
        isOpen={activeModal === 'schedule_review'}
        onClose={() => setActiveModal(null)}
      />

      <NewAnalysisModal
        isOpen={activeModal === 'new_analysis'}
        onClose={() => setActiveModal(null)}
        onClientCreated={(newClient) => {
          setClients((prev) => [newClient, ...prev]);
          setSelectedClient(newClient);
          setCurrentView('clients');
        }}
      />

      <CitationViewerModal
        citation={selectedCitation}
        isOpen={Boolean(selectedCitation)}
        onClose={() => setSelectedCitation(null)}
      />

      {/* Help / Methodology Modal */}
      {activeModal === 'help' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 border border-[#c4c6cf] shadow-xl text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <h3 className="text-base font-bold text-[#002045]">
                About Advisory AI & Small Business Methodology (₹ INR)
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 leading-relaxed">
              <strong>Advisory AI</strong> equips Commercial & MSME Relationship Managers with proactive, explainable, and responsible decision support in Indian Rupees (₹). Rather than pushing hard-coded credit sales, it identifies cash flow anomalies, vendor cost surges, and seasonal troughs early.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded text-emerald-900 font-mono">
              <div className="font-bold mb-1">Core Banking Guardrails:</div>
              • DSCR &gt; 1.25x minimum compliance check<br />
              • Non-predatory fee transparency<br />
              • Grounded ledger and policy citation verification
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 bg-[#002045] text-white rounded font-bold hover:bg-[#1a365d]"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Drawer */}
      {activeModal === 'notifications' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg max-w-md w-full p-6 border border-[#c4c6cf] shadow-xl text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <h3 className="text-base font-bold text-[#002045]">Active Risk & Advisory Alerts</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-900">
                <strong>Whole Foods AR Aging Lag:</strong> 2 invoices totaling ₹10.25 Lakhs are past 30 days overdue.
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900">
                <strong>Q3 Seasonal Dip Approaching:</strong> Expected -20% harvest revenue changeover in August.
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-900">
                <strong>EcoTransit Cold-Chain Surge:</strong> Logistics costs rose +12.0% YoY (₹4.86 Lakhs total spend).
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 bg-[#002045] text-white rounded font-bold"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
