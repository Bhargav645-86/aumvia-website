'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface ReportData {
  laborCost: number;
  revenue: number;
  inventoryValue: number;
  wasteCost: number;
  marketplaceSavings: number;
  splh: number;
  transactions: number;
  peakHours: { hour: string; sales: number }[];
  variance: number;
  complianceScore: number;
}

export default function ReportsAnalyticsHub() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'financial' | 'operational' | 'insights'>('financial');
  const [data, setData] = useState<ReportData | null>(null);
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // Mock data
    setData({
      laborCost: 2500,
      revenue: 15000,
      inventoryValue: 5000,
      wasteCost: 300,
      marketplaceSavings: 400,
      splh: 45,
      transactions: 1200,
      peakHours: [
        { hour: '9AM', sales: 500 },
        { hour: '12PM', sales: 800 },
        { hour: '6PM', sales: 700 },
      ],
      variance: 5,
      complianceScore: 85,
    });
    setAiSuggestions([
      'Adjust closing shift by 30 minutes to save 5 labor hours.',
      'Optimal staffing for next Tuesday: 4 people.',
      'Reduce inventory waste by 10% with better FIFO tracking.',
    ]);
  }, []);

  if (status === 'loading') return <div>Loading...</div>;
  if (!session || session.user?.role !== 'business') redirect('/login');

  const handleExport = () => {
    const csv = `Labor Cost,${data?.laborCost ?? 0}\nRevenue,${data?.revenue ?? 0}\nInventory Value,${data?.inventoryValue ?? 0}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reports.csv';
    a.click();
  };

  const lcp = data ? ((data.laborCost / data.revenue) * 100).toFixed(2) : '0';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6">📊 Reports & Analytics Hub</h1>

        {/* Filters */}
        <div className="flex justify-between mb-6">
          <select value={period} onChange={(e) => setPeriod(e.target.value as 'weekly' | 'monthly')} className="border p-2 rounded">
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button onClick={handleExport} className="bg-yellow-500 text-white px-4 py-2 rounded">
            Export CSV
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('financial')}
            className={`px-4 py-2 rounded ${activeTab === 'financial' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            Financial Control
          </button>
          <button
            onClick={() => setActiveTab('operational')}
            className={`px-4 py-2 rounded ${activeTab === 'operational' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            Operational Dashboard
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-2 rounded ${activeTab === 'insights' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            AI Insights
          </button>
        </div>

        {/* Financial Control */}
        {activeTab === 'financial' && data && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Financial Control & Costing Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded shadow">
                <h3 className="font-semibold mb-4">Labor Cost vs. Revenue</h3>
                <p>Labor Cost: £{data.laborCost}</p>
                <p>Revenue: £{data.revenue}</p>
                <p>Labor Cost Percentage: {lcp}%</p>
                <BarChart width={300} height={200} data={[{ name: 'Labor', value: data.laborCost }, { name: 'Revenue', value: data.revenue }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </div>
              <div className="bg-white p-6 rounded shadow">
                <h3 className="font-semibold mb-4">Inventory Valuation & Waste</h3>
                <p>Inventory Value: £{data.inventoryValue}</p>
                <p>Waste Cost: £{data.wasteCost}</p>
                <p>Marketplace Savings: £{data.marketplaceSavings}</p>
                <PieChart width={300} height={200}>
                  <Pie
                    dataKey="value"
                    data={[
                      { name: 'Inventory', value: data.inventoryValue },
                      { name: 'Waste', value: data.wasteCost },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#82ca9d"
                  />
                  <Tooltip />
                </PieChart>
              </div>
            </div>
          </div>
        )}

        {/* Operational Dashboard */}
        {activeTab === 'operational' && data && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Operational & Performance Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded shadow">
                <h3 className="font-semibold mb-4">Staff Productivity Metrics</h3>
                <p>Sales Per Labor Hour: £{data.splh}</p>
                <p>Transactions Per Shift: {data.transactions}</p>
                <LineChart width={300} height={200} data={data.peakHours}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                </LineChart>
              </div>
              <div className="bg-white p-6 rounded shadow">
                <h3 className="font-semibold mb-4">Compliance Health Indicator</h3>
                <p>Compliance Score: {data.complianceScore}%</p>
                <p>Shift Variance: {data.variance}%</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className={`h-4 rounded-full ${data.complianceScore > 80 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${data.complianceScore}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Insights */}
        {activeTab === 'insights' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">AI-Driven Insights & Forecasting</h2>
            <div className="bg-white p-6 rounded shadow">
              <h3 className="font-semibold mb-4">Cost-Saving Opportunities</h3>
              <ul>
                {aiSuggestions.map((suggestion, i) => (
                  <li key={i} className="mb-2 text-blue-600">{suggestion}</li>
                ))}
              </ul>
              <p className="mt-4">Predictive Labor Costing: Based on current rota, projected cost is £{(data?.laborCost ?? 0) * 1.1}.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
