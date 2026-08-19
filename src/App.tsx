import React, { useState, useMemo } from 'react';
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
import { ClientProfile, ChatMessage, Citation, AdvisoryRecommendation, RiskAlert, CashFlowPoint } from './types';
import { Users, BrainCircuit, Package, BarChart3, X } from 'lucide-react';

export default function App() {
  const [clients, setClients] = useState<ClientProfile[]>(MOCK_CLIENTS);
  const [selectedClient, setSelectedClient] = useState<ClientProfile>(MOCK_CLIENTS[0]);
  const [currentView, setCurrentView] = useState<NavView>('clients');
  const [searchQuery, setSearchQuery] = useState('');
  const [isStressApplied, setIsStressApplied] = useState(false);

  // Dynamic stores for generated alerts & recs
  const [dynamicAlerts, setDynamicAlerts] = useState<Record<string, RiskAlert[]>>(CLIENT_RISK_ALERTS);
  const [dynamicRecs, setDynamicRecs] = useState<Record<string, AdvisoryRecommendation[]>>(CLIENT_ADVISORY_RECOMMENDATIONS);

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

  // Initial Copilot Chat message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'copilot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Hello Marcus, I have loaded the commercial profile for **${selectedClient.name}** in Indian Rupees (₹).\n\nKey highlights: Quick Ratio is **${selectedClient.financialKPIs.quickRatio}x**, operating runway is **${selectedClient.financialKPIs.runwayMonths} months**, and total AR outstanding is **₹${selectedClient.arAging.totalOutstanding.toLocaleString('en-IN')}**.\n\nHow would you like to assist the client today?`,
      suggestedFollowUps: [
        'Analyze overdue AR aging schedule',
        'Check working capital CC/OD eligibility',
        'Simulate Q3 seasonal revenue dip',
      ],
    },
  ]);
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);

  // Filter clients dynamically based on top search bar
  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    const q = searchQuery.toLowerCase();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [clients, searchQuery]);

  // Current client specific alerts & recommendations
  const currentAlerts = dynamicAlerts[selectedClient.id] || CLIENT_RISK_ALERTS['client-gvo'];
  const currentRecommendations = dynamicRecs[selectedClient.id] || CLIENT_ADVISORY_RECOMMENDATIONS['client-gvo'];

  // Current client specific cashflow trajectory
  const currentCashFlow = selectedClient.cashFlowTrajectory || CASH_FLOW_DATA_GVO;

  // Handle client selection switch
  const handleSelectClient = (c: ClientProfile) => {
    setSelectedClient(c);
    setIsStressApplied(false);
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'copilot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Switched context to **${c.name}** (${c.industry}). Balance sheet Quick Ratio stands at **${c.financialKPIs.quickRatio}x** with **₹${c.arAging.totalOutstanding.toLocaleString('en-IN')}** in total outstanding receivables.`,
        suggestedFollowUps: [
          `Inspect ${c.name} vendor cost drivers`,
          'Check credit facility pre-qualifications',
          'Draft executive financial health memo',
        ],
      },
    ]);
  };

  // Handle Copilot Chat submission with real AI call
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
        text: data.text || 'I have completed the requested financial diagnostic.',
        citations: data.citations || [],
        suggestedFollowUps: data.suggestedFollowUps || [],
      };
      setMessages((prev) => [...prev, copilotMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'copilot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Financial analysis for ${selectedClient.name}: Quick Ratio is ${selectedClient.financialKPIs.quickRatio}x with ₹${selectedClient.arAging.totalOutstanding.toLocaleString('en-IN')} total AR outstanding.`,
        },
      ]);
    } finally {
      setIsCopilotLoading(false);
    }
  };

  const handleClientCreated = (
    newClient: ClientProfile,
    alerts?: RiskAlert[],
    recs?: AdvisoryRecommendation[]
  ) => {
    setClients((prev) => [newClient, ...prev]);
    if (alerts) {
      setDynamicAlerts((prev) => ({ ...prev, [newClient.id]: alerts }));
    }
    if (recs) {
      setDynamicRecs((prev) => ({ ...prev, [newClient.id]: recs }));
    }
    handleSelectClient(newClient);
    setCurrentView('clients');
  };

  return (
    <div className="min-h-screen bg-[#f7fafc] text-[#181c1e] font-sans antialiased">
      <TopNavbar
        clients={filteredClients}
        selectedClient={selectedClient}
        onSelectClient={handleSelectClient}
        onOpenHelp={() => setActiveModal('help')}
        onOpenNotifications={() => setActiveModal('notifications')}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Sidebar
        currentView={currentView}
        onSelectView={(v) => setCurrentView(v)}
        onOpenNewAnalysis={() => setActiveModal('new_analysis')}
        onOpenSettings={() => setActiveModal('help')}
        onOpenSupport={() => setActiveModal('help')}
      />

      <main
        id="main-canvas"
        className="md:ml-[280px] pt-16 md:pt-20 p-4 md:p-8 max-w-[1500px] mx-auto min-h-screen flex flex-col lg:flex-row gap-6 pb-24 md:pb-8"
      >
        {currentView === 'clients' && (
          <>
            <div className="flex-1 flex flex-col gap-6">
              <ClientHeader
                client={selectedClient}
                onBackToClients={() => setCurrentView('insights')}
                onExportReport={() => setActiveModal('export_report')}
                onScheduleReview={() => setActiveModal('schedule_review')}
              />

              <FinancialMetricsBento
                kpis={selectedClient.financialKPIs}
                onInspectMetric={(metric) =>
                  handleSendMessage(`Explain the historical trend, margin safety, and benchmark for ${metric}.`)
                }
              />

              <CashFlowVisualizer
                data={currentCashFlow}
                isStressApplied={isStressApplied}
                onToggleStress={() => setIsStressApplied(!isStressApplied)}
                onOpenStressModal={() => setActiveModal('stress_test')}
              />

              <RiskStressPanel
                alerts={currentAlerts}
                onOpenModal={(modalType) => setActiveModal(modalType)}
              />

              <AdvisoryNextBestAction
                recommendations={currentRecommendations}
                onDraftClientEmail={() => setActiveModal('export_report')}
                onAskCopilotAboutRec={(rec) =>
                  handleSendMessage(`Explain the credit policy suitability and client pitch for ${rec.title}.`)
                }
              />
            </div>

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
              clients={filteredClients}
              onSelectClient={(c) => {
                handleSelectClient(c);
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
                handleSendMessage(`Check if ${selectedClient.name} is eligible for the ${p.name}.`);
              }}
            />
          </div>
        )}

        {currentView === 'reports' && (
          <div className="flex-1">
            <ReportsView
              clients={filteredClients}
              onOpenReportModal={(c) => {
                handleSelectClient(c);
                setActiveModal('export_report');
              }}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <ARAgingModal
        client={selectedClient}
        isOpen={activeModal === 'ar_aging'}
        onClose={() => setActiveModal(null)}
        onSelectSolution={() => {
          setActiveModal(null);
          handleSendMessage(`How quickly can we deploy TReDS invoice discounting for ${selectedClient.name}?`);
        }}
      />

      <StressTestModal
        client={selectedClient}
        isOpen={activeModal === 'stress_test'}
        onClose={() => setActiveModal(null)}
        onApplyStress={() => setIsStressApplied(true)}
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
        onClientCreated={handleClientCreated}
      />

      <CitationViewerModal
        citation={selectedCitation}
        isOpen={Boolean(selectedCitation)}
        onClose={() => setSelectedCitation(null)}
      />
    </div>
  );
}
