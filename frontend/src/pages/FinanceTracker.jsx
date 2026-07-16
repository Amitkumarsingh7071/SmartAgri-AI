import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Coins, Plus, Trash2, HelpCircle, AlertCircle, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title,
  PointElement, LineElement
);

const FinanceTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [showAddForm, setShowAddForm] = useState(false);
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Seeds');
  const [amount, setAmount] = useState('');
  const [farmId, setFarmId] = useState('');
  const [crop, setCrop] = useState('');
  const [description, setDescription] = useState('');

  // Mandi Profit Estimator
  const [estCrop, setEstCrop] = useState('Wheat');
  const [estQty, setEstQty] = useState('');
  const [estExp, setEstExp] = useState('');
  const [estResult, setEstResult] = useState(null);
  const [estError, setEstError] = useState('');
  const [estLoading, setEstLoading] = useState(false);

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const [transRes, analyticsRes, farmsRes] = await Promise.all([
        API.get('/finance'),
        API.get('/finance/analytics'),
        API.get('/farms')
      ]);

      if (transRes.data.success) setTransactions(transRes.data.data);
      if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);
      if (farmsRes.data.success) setFarms(farmsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!amount) {
      alert('Please fill in transaction amount.');
      return;
    }

    try {
      const payload = {
        type,
        category,
        amount: Number(amount),
        farmId: farmId || undefined,
        crop,
        description
      };

      const res = await API.post('/finance', payload);
      if (res.data.success) {
        fetchFinanceData();
        setShowAddForm(false);
        setAmount('');
        setDescription('');
        setCrop('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      const res = await API.delete(`/finance/${id}`);
      if (res.data.success) {
        fetchFinanceData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEstimateProfit = async (e) => {
    e.preventDefault();
    setEstError('');
    setEstResult(null);

    if (!estQty || !estExp) {
      setEstError('Provide crop quantity and production costs.');
      return;
    }

    try {
      setEstLoading(true);
      const res = await API.post('/prices/estimate-profit', {
        crop: estCrop,
        quantityQuintals: Number(estQty),
        expenseAmt: Number(estExp)
      });
      if (res.data.success) {
        setEstResult(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setEstError(err.response?.data?.message || 'Calculation error.');
    } finally {
      setEstLoading(false);
    }
  };

  // Setup Chart Telemetry
  const categoryLabels = analytics?.categories.map(c => c.category) || [];
  const categoryValues = analytics?.categories.map(c => c.value) || [];

  const pieData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: [
          '#10b981', '#ef4444', '#3b82f6', '#f59e0b',
          '#8b5cf6', '#ec4899', '#14b8a6', '#64748b'
        ],
        borderWidth: 0,
      },
    ],
  };

  const trendMonths = analytics?.trend.map(t => t.label) || [];
  const trendIncome = analytics?.trend.map(t => t.income) || [];
  const trendExpense = analytics?.trend.map(t => t.expense) || [];

  const barData = {
    labels: trendMonths,
    datasets: [
      {
        label: 'Income',
        data: trendIncome,
        backgroundColor: '#10b981',
        borderRadius: 6,
      },
      {
        label: 'Expense',
        data: trendExpense,
        backgroundColor: '#ef4444',
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-left">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold flex items-center gap-2">
            <Coins className="h-5.5 w-5.5 text-green-500" />
            Financial Logs & Ledger
          </h2>
          <p className="text-xs text-gray-500">Track crop input costs, seeds, fertilizers, and estimate market profit projections.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Log Transaction</span>
        </button>
      </div>

      {/* KPI Cards & Charts */}
      {analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/30 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Gross Income</span>
                <span className="text-2xl font-extrabold text-emerald-500 block mt-1">₹{analytics.totalIncome}</span>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-500/20" />
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/30 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Expenses</span>
                <span className="text-2xl font-extrabold text-red-500 block mt-1">₹{analytics.totalExpense}</span>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500/20" />
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/30 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Net Profits</span>
                <span className={`text-2xl font-extrabold block mt-1 ${analytics.netProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  ₹{analytics.netProfit}
                </span>
              </div>
              <Coins className="h-8 w-8 text-green-500/20" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly trends chart */}
            <div className="glass-panel p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/30">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-4">Cashflow Growth Trend</h4>
              <div className="h-56">
                {trendMonths.length > 0 ? (
                  <Bar
                    data={barData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } },
                    }}
                  />
                ) : (
                  <div className="h-full flex justify-center items-center text-xs text-gray-400">No trend data available.</div>
                )}
              </div>
            </div>

            {/* Category breakdown chart */}
            <div className="glass-panel p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/30">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-4">Expense Category Breakdown</h4>
              <div className="h-56 flex justify-center">
                {categoryLabels.length > 0 ? (
                  <Pie
                    data={pieData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { position: 'right', labels: { boxWidth: 12, font: { size: 10 } } } },
                    }}
                  />
                ) : (
                  <div className="h-full flex justify-center items-center text-xs text-gray-400">No category data.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid: Log forms, ledger details, and profit calculators */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Ledger & transaction forms (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {showAddForm && (
            <div className="glass-panel p-6 rounded-3xl border border-green-200 dark:border-green-900/50 glow-green animate-in slide-in-from-top-4 duration-300">
              <h3 className="font-extrabold text-sm mb-4 text-green-700 dark:text-green-400">Log Cashflow Item</h3>
              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Type *</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl glass-input outline-none"
                    >
                      <option value="expense">Expense (-)</option>
                      <option value="income">Income (+)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Category *</label>
                    {type === 'expense' ? (
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2.5 text-xs rounded-xl glass-input outline-none"
                      >
                        <option value="Seeds">Seeds</option>
                        <option value="Fertilizers">Fertilizers</option>
                        <option value="Labour">Labour</option>
                        <option value="Water">Water</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Transport">Transport</option>
                        <option value="Equipment">Equipment</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2.5 text-xs rounded-xl glass-input outline-none"
                      >
                        <option value="Market Sale">Market Sale</option>
                        <option value="Subsidy">Subsidy</option>
                        <option value="Other">Other</option>
                      </select>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Amount (INR) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 5000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl glass-input outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Associated Farm Plot</label>
                    <select
                      value={farmId}
                      onChange={(e) => setFarmId(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl glass-input outline-none"
                    >
                      <option value="">-- Choose Farm (Optional) --</option>
                      {farms.map(f => (
                        <option key={f._id} value={f._id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Crop Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Wheat"
                      value={crop}
                      onChange={(e) => setCrop(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl glass-input outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Log Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Bought 2 bags of Urea fertilizer"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl glass-input outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md"
                  >
                    Save Entry
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs py-2.5 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Ledger Table */}
          <div className="glass-panel rounded-2xl border border-gray-200/50 dark:border-gray-800/30 overflow-hidden">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-450 p-4 border-b border-gray-100 dark:border-gray-800/30 text-left">Transaction Ledger</h4>
            {transactions.length === 0 ? (
              <div className="p-12 text-center text-xs text-gray-500">No financial records logged yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-gray-800/10 text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2">
                      <th className="p-4 font-bold">Details</th>
                      <th className="p-4 font-bold">Category</th>
                      <th className="p-4 font-bold text-right">Amount</th>
                      <th className="p-4 font-bold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/50 dark:divide-gray-800/20">
                    {transactions.map(t => (
                      <tr key={t._id} className="hover:bg-gray-50/30 dark:hover:bg-gray-800/10">
                        <td className="p-4">
                          <span className="font-bold text-gray-900 dark:text-gray-100 block">{t.description || 'Logged telemetry'}</span>
                          <span className="text-[9px] text-gray-400 mt-0.5 block">{new Date(t.date).toLocaleDateString()} | Farm: {t.farmId?.name || 'Global'}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 text-[9px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded font-semibold">
                            {t.category}
                          </span>
                        </td>
                        <td className="p-4 text-right font-extrabold">
                          <span className={t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}>
                            {t.type === 'income' ? '+' : '-'} ₹{t.amount}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDeleteTransaction(t._id)}
                            className="text-gray-450 hover:text-red-500 transition-colors p-1"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Mandi Profit Estimator (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30">
          <h3 className="font-extrabold text-sm mb-1 flex items-center gap-2">
            <BarChart3 className="h-4.5 w-4.5 text-green-500" />
            Mandi Profit Calculator
          </h3>
          <p className="text-[11px] text-gray-500 mb-6">Enter expected crop volume and production costs to compute net revenue margins at best regional mandi rates.</p>

          <form onSubmit={handleEstimateProfit} className="space-y-4">
            <div>
              <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Select Crop</label>
              <select
                value={estCrop}
                onChange={(e) => setEstCrop(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Wheat">Wheat</option>
                <option value="Rice">Rice</option>
                <option value="Cotton">Cotton</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Tomato">Tomato</option>
                <option value="Potato">Potato</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Est. Quantity (in Quintals)</label>
              <input
                type="number"
                required
                placeholder="e.g. 50 (1 Quintal = 100 kg)"
                value={estQty}
                onChange={(e) => setEstQty(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Total Inputs Production Costs (₹)</label>
              <input
                type="number"
                required
                placeholder="e.g. 35000 (seeds, labor, fertilizer)"
                value={estExp}
                onChange={(e) => setEstExp(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {estError && (
              <div className="flex items-center gap-2 text-xs bg-red-50 dark:bg-red-950/20 text-red-500 p-3 rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <span>{estError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={estLoading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all duration-200"
            >
              <span>{estLoading ? 'Querying market indexes...' : 'Calculate Net Profits'}</span>
            </button>
          </form>

          {/* Calculator Results */}
          {estResult && (
            <div className="mt-6 p-4 rounded-2xl bg-green-50/50 dark:bg-green-950/10 border border-green-100/50 dark:border-green-900/30 text-[11px] space-y-3 animate-in zoom-in-95 duration-200">
              <h4 className="font-bold text-xs text-green-700 dark:text-green-400 flex items-center justify-between border-b border-green-100 dark:border-green-900 pb-2">
                <span>Margin Projections</span>
                <span className={estResult.isProfit ? 'text-emerald-500' : 'text-red-500'}>
                  {estResult.isProfit ? 'PROFITABLE' : 'LOSS REPORTED'}
                </span>
              </h4>

              <div className="flex justify-between">
                <span className="text-gray-400 uppercase font-bold">Highest Mandi Value</span>
                <span className="font-extrabold text-gray-800 dark:text-gray-200">₹{estResult.currentMandiPrice}/Quintal</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400 uppercase font-bold">Recommended Mandi</span>
                <span className="font-extrabold text-gray-800 dark:text-gray-200">{estResult.recommendedMarket} ({estResult.recommendedState})</span>
              </div>

              <div className="flex justify-between border-t border-gray-100 dark:border-gray-800 pt-2">
                <span className="text-gray-400 uppercase font-bold">Gross Yield Revenue</span>
                <span className="font-extrabold text-gray-850 dark:text-gray-200">₹{estResult.estimatedRevenue}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400 uppercase font-bold">Production Cost</span>
                <span className="font-extrabold text-gray-850 dark:text-gray-200">₹{estResult.productionExpenses}</span>
              </div>

              <div className="flex justify-between border-t border-gray-100 dark:border-gray-800 pt-2 font-extrabold text-xs">
                <span className="text-gray-400 uppercase font-bold">Net Profit Margin</span>
                <span className={estResult.isProfit ? 'text-emerald-500' : 'text-red-500'}>
                  ₹{estResult.estimatedNetProfit} ({estResult.profitPercentage}%)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinanceTracker;
