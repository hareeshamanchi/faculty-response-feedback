
import React, { useState, useCallback, useEffect } from 'react';
import { parseExcelFile } from './utils/excelParser';
import { analyzeFeedback } from './services/geminiService';
import { AnalysisResult, ProcessingState } from './types';
import AnalysisDashboard from './components/AnalysisDashboard';

const App: React.FC = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [state, setState] = useState<ProcessingState>({
    loading: false,
    error: null,
    progress: 0
  });
  const [loadingMessage, setLoadingMessage] = useState('Initializing NLP Engine...');

  useEffect(() => {
    if (state.loading) {
      const messages = [
        'Parsing Excel records...',
        'Filtering student comments...',
        'Gemini is performing sentiment analysis...',
        'Categorizing faculty performance...',
        'Generating pedagogical recommendations...',
        'Finalizing data visualizations...'
      ];
      let i = 0;
      const interval = setInterval(() => {
        setLoadingMessage(messages[i % messages.length]);
        i++;
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [state.loading]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setState({ loading: true, error: null, progress: 10 });

    try {
      const rawData = await parseExcelFile(file);
      if (rawData.length === 0) {
        throw new Error("The Excel file seems to be empty or in an unrecognized format.");
      }
      setState(prev => ({ ...prev, progress: 40 }));

      const analysis = await analyzeFeedback(rawData);
      setResult(analysis);
      setState({ loading: false, error: null, progress: 100 });
    } catch (err: any) {
      console.error(err);
      setState({ 
        loading: false, 
        error: err.message || "An unexpected error occurred during processing.", 
        progress: 0 
      });
    }
  };

  const handleReset = useCallback(() => {
    setResult(null);
    setState({ loading: false, error: null, progress: 0 });
  }, []);

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-700">
      {/* Premium Header */}
      <header className="glass sticky top-0 z-50 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={handleReset}>
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl text-slate-900 tracking-tighter">Insight<span className="text-indigo-600">Pro</span></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Feedback Intelligence</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="https://mistfeedback.com" target="_blank" rel="noopener noreferrer" className="hidden sm:flex px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Mist Portal</a>
            <div className="h-4 w-[1px] bg-slate-200 mx-2"></div>
             <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="avatar" />
                 </div>
               ))}
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
        {!result && !state.loading && (
          <div className="max-w-4xl mx-auto mt-12 flex flex-col items-center text-center">
            <div className="animate-float">
               <div className="mb-8 w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 shadow-inner">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
            </div>
            <h2 className="text-5xl md:text-6xl font-[900] text-slate-900 mb-6 tracking-tight">
              Transform <span className="text-indigo-600">Feedback</span> into <br className="hidden md:block"/> Academic Success.
            </h2>
            <p className="text-lg text-slate-500 mb-12 max-w-2xl font-medium leading-relaxed">
              Upload your faculty feedback Excel sheets from <b>mistfeedback.com</b>. Our NLP engine automatically analyzes student sentiment, ranks performers, and suggests pedagogical improvements.
            </p>
            
            <div className="w-full max-w-xl relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <label className="relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-white hover:bg-slate-50 hover:border-indigo-400 transition-all cursor-pointer shadow-xl overflow-hidden group/label">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
                <div className="relative flex flex-col items-center justify-center pt-5 pb-6 px-10">
                  <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 group-hover/label:scale-110 group-hover/label:rotate-3 transition-all duration-500 shadow-lg shadow-indigo-100">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <p className="mb-2 text-xl font-extrabold text-slate-900 tracking-tight tracking-tight">Drop Excel file here</p>
                  <p className="text-sm text-slate-500 font-medium">Supporting .xlsx and .xls from Mist Feedback</p>
                </div>
                <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
                
                <div className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-50">
                  <div className="h-full bg-indigo-600 w-0 group-hover/label:w-full transition-all duration-700"></div>
                </div>
              </label>
            </div>

            {state.error && (
              <div className="mt-8 p-5 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm font-semibold flex items-center gap-3 shadow-sm animate-in shake duration-500">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                </div>
                {state.error}
              </div>
            )}

            {/* Features Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full">
              {[
                { title: 'Sentiment NLP', desc: 'Automatic tone detection from thousands of student reviews.', icon: '🧠' },
                { title: 'Smart Banding', desc: 'Categorize faculty from Outstanding to Critical instantly.', icon: '📈' },
                { title: 'Pedagogical AI', desc: 'Get specific teaching modifications for every section.', icon: '🎓' }
              ].map((f, i) => (
                <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 text-left hover:border-indigo-100 transition-colors shadow-sm">
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h4 className="font-bold text-slate-900 mb-2">{f.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {state.loading && (
          <div className="max-w-md mx-auto mt-40 text-center animate-in zoom-in duration-500">
            <div className="relative w-32 h-32 mx-auto mb-10">
              <svg className="w-full h-full rotate-[-90deg]">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="8"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="8"
                  strokeDasharray="364"
                  strokeDashoffset={364 - (364 * state.progress) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900">{state.progress}%</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Status</span>
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">AI at Work</h3>
            <p className="text-indigo-600 font-bold text-sm tracking-wide h-6">
              {loadingMessage}
            </p>
          </div>
        )}

        {result && (
          <AnalysisDashboard result={result} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="font-black text-xl text-slate-900 tracking-tighter mb-2">InsightPro</div>
            <p className="text-slate-400 text-xs font-medium">Enterprise Grade Faculty Assessment Platform</p>
          </div>
          <div className="flex gap-8 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
          </div>
          <div className="text-slate-400 text-xs font-medium">
            © 2025 Faculty Insights Pro • Gemini 3.0 Pro Image Preview
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
