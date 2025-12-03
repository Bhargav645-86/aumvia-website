'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DocumentUploadModal, AIAssistantModal, TemplateLibraryModal } from './modals';

interface Requirement {
  _id: string;
  key: string;
  title: string;
  description: string;
  category: string;
  required: boolean;
  hasExpiry: boolean;
  priority: number;
  status?: string;
  daysUntilExpiry?: number;
  latestDocument?: any;
  documentCount?: number;
  templateAvailable: boolean;
}

interface ComplianceScore {
  score: number;
  totalRequirements: number;
  completedCount: number;
  validCount: number;
  expiringCount: number;
  expiredCount: number;
  missingCount: number;
  statusBreakdown: any;
  urgentItems: any[];
}

const COLORS = {
  valid: '#4CAF50',
  expiring: '#FFBF00',
  expired: '#D32F2F',
  missing: '#9E9E9E'
};

export default function ComplianceHub() {
  const { data: session, status } = useSession();
  const [businessType, setBusinessType] = useState<string>('takeaway');
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [complianceScore, setComplianceScore] = useState<ComplianceScore | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);
  const [aiQuestion, setAiQuestion] = useState('');

  const businessId = 'default';

  const businessTypes = [
    { value: 'takeaway', label: 'Takeaway' },
    { value: 'cafe', label: 'Café' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'bubble_tea', label: 'Bubble Tea Bar' },
    { value: 'offlicense', label: 'Off-License' },
  ];

  useEffect(() => {
    if (session) {
      loadData();
    }
  }, [session, businessType]);

  async function loadData() {
    setLoading(true);
    try {
      // Check if data exists, if not seed it
      const reqResponse = await fetch(`/api/compliance/requirements?businessId=${businessId}&businessType=${businessType}`);
      const reqData = await reqResponse.json();
      
      if (reqData.length === 0 || reqData.error) {
        await fetch('/api/compliance/seed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ businessId })
        });
        await loadAllData();
      } else {
        await loadAllData();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadAllData() {
    const [reqRes, scoreRes] = await Promise.all([
      fetch(`/api/compliance/requirements?businessId=${businessId}&businessType=${businessType}`),
      fetch(`/api/compliance/score?businessId=${businessId}&businessType=${businessType}`)
    ]);

    setRequirements(await reqRes.json());
    setComplianceScore(await scoreRes.json());
  }

  async function handleDocumentUpload(data: any) {
    try {
      const response = await fetch('/api/compliance/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          businessId,
          uploadedBy: session?.user?.name || 'Manager'
        })
      });

      if (response.ok) {
        await loadAllData();
        setShowUploadModal(false);
        setSelectedRequirement(null);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  }

  function handleExportReport() {
    // Generate compliance report
    const reportData = [
      ['Compliance Report', ''],
      ['Business Type', businessType],
      ['Overall Score', `${complianceScore?.score}%`],
      ['Date Generated', new Date().toLocaleDateString('en-GB')],
      [''],
      ['Requirement', 'Status', 'Days Until Expiry', 'Document Count'],
      ...requirements.map(req => [
        req.title,
        req.status || 'missing',
        req.daysUntilExpiry !== null ? req.daysUntilExpiry?.toString() : 'N/A',
        req.documentCount?.toString() || '0'
      ])
    ];

    const csv = reportData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-report-${businessType}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <div className="text-gray-600 font-semibold">Loading compliance hub...</div>
        </div>
      </div>
    );
  }

  if (!session || !['business', 'manager'].includes(session.user?.role || '')) {
    redirect('/login');
  }

  const categories = ['all', ...Array.from(new Set(requirements.map(req => req.category)))];
  const filteredRequirements = selectedCategory === 'all' 
    ? requirements 
    : requirements.filter(req => req.category === selectedCategory);

  const chartData = complianceScore ? [
    { name: 'Valid', value: complianceScore.validCount, color: COLORS.valid },
    { name: 'Expiring Soon', value: complianceScore.expiringCount, color: COLORS.expiring },
    { name: 'Expired', value: complianceScore.expiredCount, color: COLORS.expired },
    { name: 'Missing', value: complianceScore.missingCount, color: COLORS.missing },
  ].filter(item => item.value > 0) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-emerald-900 mb-2">✅ Compliance Hub</h1>
              <p className="text-gray-600">Stay compliant with personalized checklists and AI guidance</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowTemplateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
              >
                📄 Templates
              </button>
              <button
                onClick={() => {
                  setAiQuestion('');
                  setShowAIModal(true);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all"
              >
                🤖 Ask AI
              </button>
              <button
                onClick={handleExportReport}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
              >
                Export Report
              </button>
            </div>
          </div>

          {/* Business Type Selector */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Business Type</label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
            >
              {businessTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Compliance Score Card */}
            {complianceScore && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Score Display */}
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="w-48 h-48 rounded-full flex items-center justify-center"
                        style={{
                          background: `conic-gradient(
                            ${complianceScore.score >= 80 ? '#4CAF50' : complianceScore.score >= 50 ? '#FFBF00' : '#D32F2F'} ${complianceScore.score * 3.6}deg,
                            #E0E0E0 ${complianceScore.score * 3.6}deg
                          )`
                        }}
                      >
                        <div className="w-40 h-40 bg-white rounded-full flex flex-col items-center justify-center">
                          <div className="text-5xl font-bold text-emerald-900">{complianceScore.score}%</div>
                          <div className="text-sm text-gray-600 mt-1">Compliant</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Breakdown */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Compliance Breakdown</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: COLORS.valid }}></div>
                          <span className="text-sm text-gray-700">Valid</span>
                        </div>
                        <span className="font-bold text-gray-900">{complianceScore.validCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: COLORS.expiring }}></div>
                          <span className="text-sm text-gray-700">Expiring Soon</span>
                        </div>
                        <span className="font-bold text-gray-900">{complianceScore.expiringCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: COLORS.expired }}></div>
                          <span className="text-sm text-gray-700">Expired</span>
                        </div>
                        <span className="font-bold text-gray-900">{complianceScore.expiredCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: COLORS.missing }}></div>
                          <span className="text-sm text-gray-700">Missing</span>
                        </div>
                        <span className="font-bold text-gray-900">{complianceScore.missingCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>

            {/* Requirements Checklist */}
            <div className="space-y-4">
              {filteredRequirements.map(req => (
                <RequirementCard
                  key={req._id}
                  requirement={req}
                  onUpload={() => {
                    setSelectedRequirement(req);
                    setShowUploadModal(true);
                  }}
                  onAskAI={(question) => {
                    setAiQuestion(question);
                    setShowAIModal(true);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Urgent Alerts */}
            {complianceScore && complianceScore.urgentItems.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-red-600 mb-4">🚨 Urgent Actions</h3>
                <div className="space-y-3">
                  {complianceScore.urgentItems.map((item, idx) => (
                    <div key={idx} className={`p-3 rounded-lg ${
                      item.priority === 'critical' ? 'bg-red-50 border-l-4 border-red-600' :
                      'bg-amber-50 border-l-4 border-amber-500'
                    }`}>
                      <div className="font-semibold text-sm text-gray-900">{item.requirementTitle}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {item.status === 'expired' && `Expired ${item.daysOverdue} days ago`}
                        {item.status === 'expiring' && `Expires in ${item.daysRemaining} days`}
                        {item.status === 'missing' && 'Not submitted'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📈 Quick Stats</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Total Requirements</div>
                  <div className="text-2xl font-bold text-gray-900">{complianceScore?.totalRequirements}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Completed</div>
                  <div className="text-2xl font-bold text-green-600">{complianceScore?.completedCount}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Needs Attention</div>
                  <div className="text-2xl font-bold text-red-600">
                    {(complianceScore?.expiredCount || 0) + (complianceScore?.missingCount || 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showUploadModal && selectedRequirement && (
          <DocumentUploadModal
            requirement={selectedRequirement}
            onSave={handleDocumentUpload}
            onClose={() => {
              setShowUploadModal(false);
              setSelectedRequirement(null);
            }}
          />
        )}

        {showAIModal && (
          <AIAssistantModal
            businessType={businessType}
            initialQuestion={aiQuestion}
            onClose={() => {
              setShowAIModal(false);
              setAiQuestion('');
            }}
          />
        )}

        {showTemplateModal && (
          <TemplateLibraryModal
            requirements={requirements.filter(r => r.templateAvailable)}
            onClose={() => setShowTemplateModal(false)}
          />
        )}
      </div>
    </div>
  );
}

function RequirementCard({ requirement, onUpload, onAskAI }: any) {
  const statusConfig: any = {
    valid: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700', badge: 'bg-green-100 text-green-700', icon: '✓' },
    expiring: { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', icon: '⏰' },
    expired: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700', badge: 'bg-red-100 text-red-700', icon: '⚠️' },
    missing: { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700', badge: 'bg-gray-100 text-gray-700', icon: '❌' },
  };

  const status = requirement.status || 'missing';
  const config = statusConfig[status];

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border-l-4 ${config.border}`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900">{requirement.title}</h3>
              {requirement.required && (
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-bold">REQUIRED</span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{requirement.description}</p>
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
              {requirement.category}
            </span>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${config.badge}`}>
            {config.icon} {status.toUpperCase()}
          </span>
        </div>

        {requirement.daysUntilExpiry !== null && requirement.daysUntilExpiry !== undefined && (
          <div className={`mb-3 p-2 rounded ${config.bg}`}>
            <div className={`text-sm font-semibold ${config.text}`}>
              {requirement.daysUntilExpiry < 0 
                ? `Expired ${Math.abs(requirement.daysUntilExpiry)} days ago` 
                : `Expires in ${requirement.daysUntilExpiry} days`}
            </div>
          </div>
        )}

        {requirement.latestDocument && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-gray-900">📄 {requirement.latestDocument.filename}</div>
                <div className="text-xs text-gray-600 mt-1">
                  Uploaded: {new Date(requirement.latestDocument.uploadedAt).toLocaleDateString('en-GB')}
                </div>
              </div>
              {requirement.documentCount > 1 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                  +{requirement.documentCount - 1} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onUpload}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            style={{ backgroundColor: '#D4AF37' }}
          >
            {requirement.latestDocument ? 'Update Document' : 'Upload Document'}
          </button>
          <button
            onClick={() => onAskAI(`What do I need for ${requirement.title}?`)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all"
          >
            Ask AI
          </button>
        </div>
      </div>
    </div>
  );
}
