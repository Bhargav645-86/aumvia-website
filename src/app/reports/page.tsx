'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Clock, Users, Package, 
  AlertCircle, Lightbulb, Download, RefreshCw, Calendar, Target,
  Activity, Zap, ChevronRight, Star, BarChart2, PieChart as PieChartIcon
} from 'lucide-react';

interface ReportData {
  kpis: {
    revenue: number;
    laborCost: number;
    laborCostPercentage: string;
    complianceScore: number;
    salesPerLaborHour: string;
    inventoryValue: number;
    wasteCost: number;
    wastePercentage: string;
  };
  labor: {
    totalHours: string;
    totalCost: string;
    approvedTimesheets: number;
    pendingTimesheets: number;
    activeEmployees: number;
  };
  inventory: {
    totalValue: number;
    wasteCost: number;
    wastePercentage: string;
    itemCount: number;
  };
  operational: {
    peakHours: { hour: string; shifts: number; estimatedSales: number }[];
    staffPerformance: {
      id: string;
      name: string;
      role: string;
      totalHours: number;
      averageVariance: number;
      timesheetCount: number;
      performanceRating: number | null;
      hourlyRate: number;
    }[];
    totalShifts: number;
    totalTimesheets: number;
  };
  aiSuggestions: {
    type: string;
    priority: 'high' | 'medium' | 'low';
    suggestion: string;
  }[];
  period: string;
  generatedAt: string;
}

const COLORS = ['#4A0E8B', '#D4AF37', '#0B6E4F', '#6B2DB8', '#E6C756'];

const businessId = 'default';

export default function ReportsAnalyticsHub() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'financial' | 'operational' | 'insights'>('overview');
  const [data, setData] = useState<ReportData | null>(null);
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, [period]);

  async function loadReports() {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports?businessId=${businessId}&period=${period}`);
      const reportData = await response.json();
      if (!reportData.error) {
        setData(reportData);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleExport(format: 'csv' | 'pdf') {
    if (!data) return;
    
    if (format === 'csv') {
      const csv = [
        'Metric,Value',
        `Revenue,£${data.kpis.revenue}`,
        `Labor Cost,£${data.kpis.laborCost}`,
        `Labor Cost %,${data.kpis.laborCostPercentage}%`,
        `Compliance Score,${data.kpis.complianceScore}%`,
        `SPLH,£${data.kpis.salesPerLaborHour}`,
        `Inventory Value,£${data.kpis.inventoryValue}`,
        `Waste Cost,£${data.kpis.wasteCost}`,
        `Total Hours,${data.labor.totalHours}`,
        `Active Staff,${data.labor.activeEmployees}`,
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aumvia-report-${period}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  }

  const laborVsRevenueData = data ? [
    { name: 'Revenue', value: data.kpis.revenue, fill: '#0B6E4F' },
    { name: 'Labor Cost', value: data.kpis.laborCost, fill: '#D4AF37' }
  ] : [];

  const inventoryData = data ? [
    { name: 'Active Stock', value: data.inventory.totalValue - data.inventory.wasteCost, fill: '#4A0E8B' },
    { name: 'Waste', value: data.inventory.wasteCost, fill: '#DC2626' }
  ] : [];

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#4A0E8B] border-t-transparent mx-auto mb-4"></div>
          <div className="text-[#4A0E8B] font-semibold">Generating Reports...</div>
        </div>
      </div>
    );
  }

  if (!session || !['business', 'manager', 'admin'].includes(session.user?.role || '')) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#4A0E8B] to-[#6B2DB8] bg-clip-text text-transparent mb-2">
              Reports & Analytics Hub
            </h1>
            <p className="text-gray-600">Business intelligence powered by unified data</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as 'weekly' | 'monthly')}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A0E8B] outline-none bg-white"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <button
              onClick={loadReports}
              className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#E6C756] text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>

        {data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#0B6E4F] hover:shadow-xl transition-all group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">£{data.kpis.revenue.toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>+12% vs last {period}</span>
                    </div>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0B6E4F]/10 to-[#0B6E4F]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <DollarSign className="w-7 h-7 text-[#0B6E4F]" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#D4AF37] hover:shadow-xl transition-all group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Labor Cost %</p>
                    <p className="text-3xl font-bold text-gray-900">{data.kpis.laborCostPercentage}%</p>
                    <div className={`flex items-center gap-1 text-sm mt-1 ${parseFloat(data.kpis.laborCostPercentage) < 30 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {parseFloat(data.kpis.laborCostPercentage) < 30 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                      <span>Target: 25-30%</span>
                    </div>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-7 h-7 text-[#D4AF37]" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#4A0E8B] hover:shadow-xl transition-all group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Compliance Score</p>
                    <p className="text-3xl font-bold text-gray-900">{data.kpis.complianceScore}%</p>
                    <div className={`flex items-center gap-1 text-sm mt-1 ${data.kpis.complianceScore >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                      <Target className="w-4 h-4" />
                      <span>{data.kpis.complianceScore >= 80 ? 'On Target' : 'Needs Attention'}</span>
                    </div>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#4A0E8B]/10 to-[#4A0E8B]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Activity className="w-7 h-7 text-[#4A0E8B]" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Sales/Labor Hour</p>
                    <p className="text-3xl font-bold text-gray-900">£{data.kpis.salesPerLaborHour}</p>
                    <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                      <Zap className="w-4 h-4" />
                      <span>Productivity Score</span>
                    </div>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BarChart2 className="w-7 h-7 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
              <div className="flex border-b">
                {[
                  { id: 'overview', label: 'Overview', icon: PieChartIcon },
                  { id: 'financial', label: 'Financial', icon: DollarSign },
                  { id: 'operational', label: 'Operational', icon: Activity },
                  { id: 'insights', label: 'AI Insights', icon: Lightbulb }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-[#4A0E8B] to-[#6B2DB8] text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-[#0B6E4F]" />
                        Revenue vs Labor Cost
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={laborVsRevenueData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip 
                            formatter={(value: number) => `£${value.toLocaleString()}`}
                            contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                          />
                          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                            {laborVsRevenueData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Package className="w-5 h-5 text-[#4A0E8B]" />
                        Inventory Breakdown
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={inventoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {inventoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => `£${value.toLocaleString()}`}
                            contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-white rounded-xl border border-gray-100">
                          <p className="text-sm text-gray-500">Total Value</p>
                          <p className="text-xl font-bold text-[#4A0E8B]">£{data.inventory.totalValue.toLocaleString()}</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-xl border border-gray-100">
                          <p className="text-sm text-gray-500">Waste %</p>
                          <p className="text-xl font-bold text-red-600">{data.inventory.wastePercentage}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2 bg-gradient-to-br from-[#4A0E8B]/5 to-[#D4AF37]/5 rounded-2xl p-6 border border-[#4A0E8B]/20">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#D4AF37]" />
                        Peak Hours Analysis
                      </h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={data.operational.peakHours}>
                          <defs>
                            <linearGradient id="colorShifts" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4A0E8B" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#4A0E8B" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="hour" />
                          <YAxis />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                          <Area type="monotone" dataKey="shifts" stroke="#4A0E8B" fillOpacity={1} fill="url(#colorShifts)" strokeWidth={2} />
                          <Line type="monotone" dataKey="estimatedSales" stroke="#D4AF37" strokeWidth={2} dot={{ fill: '#D4AF37' }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {activeTab === 'financial' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-[#0B6E4F]/10 to-[#0B6E4F]/5 rounded-2xl p-6">
                        <h4 className="font-semibold text-gray-700 mb-2">Total Revenue</h4>
                        <p className="text-4xl font-bold text-[#0B6E4F]">£{data.kpis.revenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 mt-2">This {period}</p>
                      </div>
                      <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5 rounded-2xl p-6">
                        <h4 className="font-semibold text-gray-700 mb-2">Labor Cost</h4>
                        <p className="text-4xl font-bold text-[#D4AF37]">£{data.labor.totalCost}</p>
                        <p className="text-sm text-gray-500 mt-2">{data.labor.totalHours} hours worked</p>
                      </div>
                      <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-2xl p-6">
                        <h4 className="font-semibold text-gray-700 mb-2">Inventory Waste</h4>
                        <p className="text-4xl font-bold text-red-600">£{data.inventory.wasteCost}</p>
                        <p className="text-sm text-gray-500 mt-2">{data.inventory.wastePercentage}% of inventory</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Financial Summary</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Metric</th>
                              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Value</th>
                              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">% of Revenue</th>
                              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-4 font-medium text-gray-900">Gross Revenue</td>
                              <td className="px-4 py-4 text-right text-green-600 font-semibold">£{data.kpis.revenue.toLocaleString()}</td>
                              <td className="px-4 py-4 text-right text-gray-600">100%</td>
                              <td className="px-4 py-4 text-center">
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">On Track</span>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-4 font-medium text-gray-900">Labor Costs</td>
                              <td className="px-4 py-4 text-right text-[#D4AF37] font-semibold">£{data.labor.totalCost}</td>
                              <td className="px-4 py-4 text-right text-gray-600">{data.kpis.laborCostPercentage}%</td>
                              <td className="px-4 py-4 text-center">
                                <span className={`px-2 py-1 text-xs rounded-full ${parseFloat(data.kpis.laborCostPercentage) <= 30 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                  {parseFloat(data.kpis.laborCostPercentage) <= 30 ? 'Optimal' : 'Review'}
                                </span>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-4 font-medium text-gray-900">Inventory Value</td>
                              <td className="px-4 py-4 text-right text-[#4A0E8B] font-semibold">£{data.inventory.totalValue.toLocaleString()}</td>
                              <td className="px-4 py-4 text-right text-gray-600">{((data.inventory.totalValue / data.kpis.revenue) * 100).toFixed(1)}%</td>
                              <td className="px-4 py-4 text-center">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Tracking</span>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-4 font-medium text-gray-900">Waste Cost</td>
                              <td className="px-4 py-4 text-right text-red-600 font-semibold">£{data.inventory.wasteCost.toLocaleString()}</td>
                              <td className="px-4 py-4 text-right text-gray-600">{data.inventory.wastePercentage}%</td>
                              <td className="px-4 py-4 text-center">
                                <span className={`px-2 py-1 text-xs rounded-full ${parseFloat(data.inventory.wastePercentage) <= 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {parseFloat(data.inventory.wastePercentage) <= 5 ? 'Good' : 'High'}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'operational' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100">
                        <Clock className="w-8 h-8 text-blue-600 mb-2" />
                        <p className="text-sm text-gray-500">Total Hours</p>
                        <p className="text-3xl font-bold text-gray-900">{data.labor.totalHours}h</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-100">
                        <Users className="w-8 h-8 text-green-600 mb-2" />
                        <p className="text-sm text-gray-500">Active Staff</p>
                        <p className="text-3xl font-bold text-gray-900">{data.labor.activeEmployees}</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border border-purple-100">
                        <Calendar className="w-8 h-8 text-purple-600 mb-2" />
                        <p className="text-sm text-gray-500">Total Shifts</p>
                        <p className="text-3xl font-bold text-gray-900">{data.operational.totalShifts}</p>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-50 to-white rounded-2xl p-6 border border-yellow-100">
                        <AlertCircle className="w-8 h-8 text-yellow-600 mb-2" />
                        <p className="text-sm text-gray-500">Pending Timesheets</p>
                        <p className="text-3xl font-bold text-gray-900">{data.labor.pendingTimesheets}</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                      <div className="p-6 border-b border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                          <Star className="w-5 h-5 text-[#D4AF37]" />
                          Staff Performance Overview
                        </h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Employee</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Hours</th>
                              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Avg Variance</th>
                              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Timesheets</th>
                              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Rating</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {data.operational.staffPerformance.map((staff) => (
                              <tr key={staff.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A0E8B] to-[#6B2DB8] flex items-center justify-center text-white font-bold">
                                      {staff.name?.charAt(0) || 'S'}
                                    </div>
                                    <span className="font-medium text-gray-900">{staff.name}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded capitalize">{staff.role}</span>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-gray-900">{staff.totalHours.toFixed(1)}h</td>
                                <td className="px-6 py-4 text-right">
                                  <span className={`${staff.averageVariance > 15 ? 'text-red-600' : staff.averageVariance > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                                    {staff.averageVariance > 0 ? '+' : ''}{staff.averageVariance.toFixed(0)} min
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right text-gray-600">{staff.timesheetCount}</td>
                                <td className="px-6 py-4">
                                  <div className="flex justify-center gap-0.5">
                                    {staff.performanceRating ? (
                                      [1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`w-4 h-4 ${star <= staff.performanceRating! ? 'text-[#D4AF37] fill-current' : 'text-gray-300'}`}
                                        />
                                      ))
                                    ) : (
                                      <span className="text-gray-400 text-sm">No rating</span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {data.operational.staffPerformance.length === 0 && (
                          <div className="text-center py-12 text-gray-500">
                            <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>No staff performance data available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'insights' && (
                  <div className="space-y-8">
                    <div className="bg-gradient-to-r from-[#4A0E8B]/10 to-[#D4AF37]/10 rounded-2xl p-8 border border-[#4A0E8B]/20">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A0E8B] to-[#6B2DB8] flex items-center justify-center">
                          <Lightbulb className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">AI-Powered Insights</h3>
                          <p className="text-gray-600">Data-driven recommendations to optimize your business</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {data.aiSuggestions.map((suggestion, index) => (
                          <div 
                            key={index}
                            className={`bg-white rounded-xl p-5 border-l-4 ${
                              suggestion.priority === 'high' ? 'border-red-500' :
                              suggestion.priority === 'medium' ? 'border-yellow-500' :
                              'border-green-500'
                            } shadow-sm hover:shadow-md transition-all`}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                suggestion.type === 'cost' ? 'bg-red-100' :
                                suggestion.type === 'efficiency' ? 'bg-blue-100' :
                                suggestion.type === 'inventory' ? 'bg-purple-100' :
                                suggestion.type === 'staffing' ? 'bg-green-100' :
                                'bg-yellow-100'
                              }`}>
                                {suggestion.type === 'cost' ? <DollarSign className="w-5 h-5 text-red-600" /> :
                                 suggestion.type === 'efficiency' ? <Clock className="w-5 h-5 text-blue-600" /> :
                                 suggestion.type === 'inventory' ? <Package className="w-5 h-5 text-purple-600" /> :
                                 suggestion.type === 'staffing' ? <Users className="w-5 h-5 text-green-600" /> :
                                 <AlertCircle className="w-5 h-5 text-yellow-600" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`px-2 py-0.5 text-xs font-semibold rounded uppercase ${
                                    suggestion.priority === 'high' ? 'bg-red-100 text-red-700' :
                                    suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                  }`}>
                                    {suggestion.priority} priority
                                  </span>
                                  <span className="text-xs text-gray-500 capitalize">{suggestion.type}</span>
                                </div>
                                <p className="text-gray-700">{suggestion.suggestion}</p>
                              </div>
                              <button className="p-2 text-gray-400 hover:text-[#4A0E8B] transition-colors">
                                <ChevronRight className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                        {data.aiSuggestions.length === 0 && (
                          <div className="text-center py-12 bg-white rounded-xl">
                            <Lightbulb className="w-16 h-16 text-green-400 mx-auto mb-4" />
                            <h4 className="text-xl font-semibold text-gray-900 mb-2">All Clear!</h4>
                            <p className="text-gray-600">No immediate optimizations needed. Your business is running smoothly.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          Predicted Labor Cost
                        </h4>
                        <p className="text-4xl font-bold text-gray-900 mb-2">
                          £{(parseFloat(data.labor.totalCost) * 1.05).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">Based on current rota patterns (+5% projected)</p>
                      </div>
                      <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Target className="w-5 h-5 text-[#4A0E8B]" />
                          Optimal Staffing
                        </h4>
                        <p className="text-4xl font-bold text-gray-900 mb-2">
                          {Math.max(2, Math.round(data.labor.activeEmployees * 0.9))} - {Math.round(data.labor.activeEmployees * 1.1)}
                        </p>
                        <p className="text-sm text-gray-500">Recommended staff for next {period}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center text-sm text-gray-400">
              Report generated at {new Date(data.generatedAt).toLocaleString('en-GB')} | Data sources: MongoDB + Supabase
            </div>
          </>
        )}

        {!data && !loading && (
          <div className="text-center py-20">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Report Data Available</h3>
            <p className="text-gray-500 mb-4">Start adding data to your modules to generate insights</p>
            <button
              onClick={loadReports}
              className="px-6 py-3 bg-gradient-to-r from-[#4A0E8B] to-[#6B2DB8] text-white rounded-xl font-semibold"
            >
              Retry Loading
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
