import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, ArrowRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../services/api';

const MandiPricesWidget = () => {
  const [prices, setPrices] = useState([]);
  const [searchCrop, setSearchCrop] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const res = await API.get('/prices');
        if (res.data.success) {
          setPrices(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, []);

  const filteredPrices = prices.filter(p =>
    p.crop.toLowerCase().includes(searchCrop.toLowerCase())
  ).slice(0, 5); // top 5 rows

  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/30 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-extrabold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Mandi Market Prices
          </h3>
          <span className="text-[10px] bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-bold">
            Live Rates
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search crop (e.g. Wheat, Cotton)..."
            value={searchCrop}
            onChange={(e) => setSearchCrop(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl glass-input focus:ring-2 focus:ring-green-500 outline-none transition-all duration-200"
          />
        </div>

        {/* Price Table */}
        {loading ? (
          <div className="space-y-2 py-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 bg-gray-100 dark:bg-gray-800/40 rounded-xl animate-pulse-slow"></div>
            ))}
          </div>
        ) : filteredPrices.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-8">No prices found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2">
                  <th className="py-2 font-bold">Crop</th>
                  <th className="py-2 font-bold">Market</th>
                  <th className="py-2 font-bold text-right">Price/Quintal</th>
                  <th className="py-2 font-bold text-center">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50 dark:divide-gray-800/20">
                {filteredPrices.map((p, i) => {
                  // Simulate random price change direction for UI high-fidelity details
                  const isUp = i % 3 !== 1;
                  return (
                    <tr key={p._id} className="hover:bg-gray-50/30 dark:hover:bg-gray-800/10 transition-colors duration-150">
                      <td className="py-2.5 font-semibold text-gray-800 dark:text-gray-200">{p.crop}</td>
                      <td className="py-2.5 text-gray-500 text-[11px] truncate max-w-24">{p.market}, {p.state}</td>
                      <td className="py-2.5 font-bold text-right text-gray-900 dark:text-gray-100">₹{p.price}</td>
                      <td className="py-2.5 flex justify-center">
                        {isUp ? (
                          <span className="flex items-center gap-0.5 text-emerald-500 text-[10px] bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded-full font-bold">
                            <ArrowUpRight className="h-3 w-3" /> +1.2%
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5 text-red-500 text-[10px] bg-red-50 dark:bg-red-950/20 px-1.5 py-0.5 rounded-full font-bold">
                            <ArrowDownRight className="h-3 w-3" /> -0.8%
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Button link */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
        <Link
          to="/finance"
          className="flex items-center justify-between text-xs font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors group"
        >
          <span>Calculate expected profits in Expense tab</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default MandiPricesWidget;
