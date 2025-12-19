
import React, { useState, useMemo } from 'react';
import { AnalysisResult, FacultyInsight } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const BAND_COLORS: Record<string, string> = {
  'Outstanding': '#10b981',
  'Exceeds Expectations': '#3b82f6',
  'Meets Expectations': '#94a3b8',
  'Needs Improvement': '#f59e0b',
  'Critical': '#ef4444',
};

const BandingBadge: React.FC<{ band: FacultyInsight['banding'] }> = ({ band }) => {
  const styles = {
    'Outstanding': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Exceeds Expectations': 'bg-blue-50 text-blue-700 border-blue-100',
    'Meets Expectations': 'bg-slate-50 text-slate-500 border-slate-100',
    'Needs Improvement': 'bg-amber-50 text-amber-700 border-amber-100',
    'Critical': 'bg-red-50 text-red-700 border-red-100',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[band] || styles['Meets Expectations']}`}>
      {band}
    </span>
  );
};

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, onReset }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInsights = useMemo(() => {
    return result.insights.filter(i => 
      i.facultyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.section.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [result.insights, searchTerm]);

  const ratingDistribution = useMemo(() => {
    const sorted = [...result.insights].sort((a, b) => b.overallRating - a.overallRating);
    return sorted.map(i => ({
      name: i.facultyName,
      rating: i.overallRating,
      band: i.banding
    }));
  }, [result.insights]);

  const bandingData = useMemo(() => {
    const counts: Record<string, number> = {};
    result.insights.forEach(i => {
      counts[i.banding] = (counts[i.banding] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [result.insights]);

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Hero Stats */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold border border-indigo-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Analysis Complete
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Faculty Intelligence <span className="text-indigo-600">Report</span></h1>
          <p className="text-slate-500 max-w-2xl">Visualizing pedagogical efficiency and student satisfaction trends across all departments.</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
            onClick={() => window.print()}
            className="p-2.5 text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
            title="Export to PDF"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </button>
          <button 
            onClick={onReset}
            className="px-6 py-2.5 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Restart
          </button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Rating Rankings */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
             <div>
              <h3 className="text-xl font-bold text-slate-900">Faculty Rating Rankings</h3>
              <p className="text-sm text-slate-400">Comparing overall performance scores.</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 px-2 py-1 bg-emerald-50 rounded-lg">High: 5.0</span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 px-2 py-1 bg-amber-50 rounded-lg">Low: 0.0</span>
            </div>
          </div>
          <div className="flex-grow h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingDistribution} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} tick={{ fill: '#94a3b8' }} hide={ratingDistribution.length > 10} />
                <YAxis domain={[0, 5]} axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#94a3b8' }} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Bar dataKey="rating" radius={[6, 6, 6, 6]} barSize={40}>
                   {ratingDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAND_COLORS[entry.band] || '#6366f1'} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Banding Distribution */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Banding Spread</h3>
          <p className="text-sm text-slate-400 mb-6">Distribution of performance categories.</p>
          <div className="flex-grow h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bandingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bandingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAND_COLORS[entry.name] || '#94a3b8'} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none mb-10">
              <div className="text-center">
                <span className="block text-3xl font-black text-slate-800">{result.insights.length}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-indigo-200 group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32 group-hover:opacity-30 transition-opacity"></div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-3">
            <h3 className="text-indigo-300 uppercase tracking-widest font-black text-xs mb-4">Strategic Overview</h3>
            <p className="text-2xl font-medium leading-relaxed">
              {result.overallSummary}
            </p>
          </div>
          <div className="flex flex-col justify-center items-center md:items-end border-l border-indigo-800 md:pl-8">
            <div className="text-center md:text-right">
              <span className="text-indigo-400 text-xs font-bold uppercase mb-1 block">Top Performers</span>
              <div className="flex flex-col gap-2 mt-3">
                {result.topPerformers.slice(0, 3).map((name, i) => (
                  <div key={i} className="bg-indigo-800/50 px-3 py-2 rounded-lg text-sm font-semibold border border-indigo-700/50">
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Faculty Drill-down */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-extrabold text-slate-900">Faculty Portfolios</h2>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search faculty or section..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full md:w-80 text-sm transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {filteredInsights.length > 0 ? filteredInsights.map((insight, idx) => (
            <div key={idx} className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl font-black text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    {insight.facultyName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">{insight.facultyName}</h4>
                    <p className="text-sm font-semibold text-indigo-500 flex items-center gap-1.5 uppercase tracking-wider">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      {insight.section}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <BandingBadge band={insight.banding} />
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">{insight.overallRating.toFixed(1)}</span>
                    <span className="text-slate-400 font-bold text-xs uppercase">Avg Score</span>
                  </div>
                </div>
              </div>

              <div className="mb-8 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 italic text-slate-600 leading-relaxed relative">
                <svg className="absolute -top-3 -left-1 w-8 h-8 text-indigo-100" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V3H21.017V21H14.017ZM3.01704 21L3.01704 18C3.01704 16.8954 3.91247 16 5.01704 16H8.01704C8.56932 16 9.01704 15.5523 9.01704 15V9C9.01704 8.44772 8.56932 8 8.01704 8H5.01704C3.91247 8 3.01704 7.10457 3.01704 6V3H10.017V21H3.01704Z" /></svg>
                &ldquo;{insight.summary}&rdquo;
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <h5 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                    <span className="w-4 h-[1px] bg-emerald-200"></span> 
                    Key Assets
                  </h5>
                  <ul className="space-y-2.5">
                    {insight.strengths.map((s, i) => (
                      <li key={i} className="text-sm font-medium text-slate-700 flex items-start gap-3">
                        <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h5 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">
                    <span className="w-4 h-[1px] bg-amber-200"></span> 
                    Critical Growth
                  </h5>
                  <ul className="space-y-2.5">
                    {insight.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm font-medium text-slate-700 flex items-start gap-3">
                        <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Strategic Modifications</h5>
                <div className="grid grid-cols-1 gap-3">
                  {insight.suggestedModifications.map((mod, i) => (
                    <div key={i} className="group/mod bg-white hover:bg-indigo-600 p-4 rounded-xl border border-slate-100 hover:border-indigo-600 transition-all cursor-default">
                      <p className="text-sm font-medium text-slate-800 group-hover/mod:text-white transition-colors">{mod}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">No faculty members match your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
