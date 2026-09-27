import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const CropCalendarWidget = () => {
  const [tasks, setTasks] = useState([
    { _id: '1', crop_name: 'Tomato', plot_name: 'North Sector A', task_title: 'Early Morning Drip Irrigation (30 mins)', category: 'Irrigation', status: 'TODAY', due_date: new Date() },
    { _id: '2', crop_name: 'Tomato', plot_name: 'North Sector A', task_title: 'Foliar Spray Neem Oil (Pest Scouting)', category: 'Scouting', status: 'UPCOMING', due_date: new Date(Date.now() + 86400000) },
    { _id: '3', crop_name: 'Cotton', plot_name: 'East Field B', task_title: 'Top Dressing Neem Coated Urea (55 kg/Acre)', category: 'Nutrient', status: 'UPCOMING', due_date: new Date(Date.now() + 172800000) }
  ]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/farmer-features/calendar');
      const data = await res.json();
      if (data.success && data.tasks.length > 0) {
        setTasks(data.tasks);
      }
    } catch (err) {
      console.error("Fetch calendar error:", err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setTasks(prev => prev.map(t => t._id === id ? { ...t, status: newStatus } : t));
    try {
      await fetch(`http://localhost:5000/api/farmer-features/calendar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error("Update task status error:", err);
    }
  };

  const filteredTasks = filter === 'ALL' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Crop Activity Calendar</h3>
            <p className="text-xs text-slate-500">Scheduled Farm Activities & Crop Stage Tasks</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {['ALL', 'TODAY', 'UPCOMING', 'COMPLETED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg transition ${filter === f ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filteredTasks.map(task => (
          <div 
            key={task._id} 
            className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-100 transition"
          >
            <div className="flex items-start gap-3">
              <button 
                onClick={() => handleStatusChange(task._id, task.status === 'COMPLETED' ? 'TODAY' : 'COMPLETED')}
                className={`mt-0.5 p-1 rounded-full border transition ${task.status === 'COMPLETED' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-emerald-500 text-transparent'}`}
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${task.status === 'COMPLETED' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {task.task_title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded">
                    {task.crop_name} ({task.plot_name})
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Category: {task.category} • Due: {new Date(task.due_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
              task.status === 'TODAY' ? 'bg-emerald-100 text-emerald-700' :
              task.status === 'COMPLETED' ? 'bg-slate-200 text-slate-600' :
              task.status === 'OVERDUE' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropCalendarWidget;
