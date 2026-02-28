import React, { useState, useEffect } from 'react';
import SafetyPopup from './components/SafetyPopup';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import { Sparkles, Brain, Heart, ArrowRight, ShieldCheck, Github, Activity, LogOut, User } from 'lucide-react';
import { supabase } from './lib/supabase';

const App = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [assessmentAnswers, setAssessmentAnswers] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the login link!');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const startAssessment = () => setCurrentView('assessment');

  const handleAssessmentComplete = (answers) => {
    setAssessmentAnswers(answers);
    setCurrentView('results');
  };

  const handleAuthModal = () => setIsAuthModalOpen(true);

  return (
    <div className="min-h-screen transition-all duration-700">
      <SafetyPopup onAccept={() => console.log('Safety accepted')} />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-40 bg-white/40 backdrop-blur-xl border-b border-white/20">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setCurrentView('landing')}>
            <div className="w-10 h-10 rounded-2xl bg-[var(--primary-teal)] flex items-center justify-center text-white shadow-lg shadow-[var(--primary-teal)]/40 hover:scale-110 transition-transform">
              <Brain size={24} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent">
              MindMirror
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-600 hover:text-[var(--primary-teal)] font-medium transition-colors">How it Works</a>
            <a href="#" className="text-gray-600 hover:text-[var(--primary-teal)] font-medium transition-colors">For Professionals</a>
            {session ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <User size={18} />
                  <span className="text-sm font-semibold">{session.user.email.split('@')[0]}</span>
                </div>
                <button className="btn btn-secondary border-none" onClick={handleLogout}>
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button className="btn btn-primary" onClick={handleAuthModal}>Login</button>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-24 min-h-screen">
        {currentView === 'landing' && (
          <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in relative">
            <div className="md:flex items-center justify-between gap-12 py-10 md:py-20">
              <div className="flex-1 space-y-10">
                <div className="badge badge-teal animate-pulse-slow">
                  <Sparkles size={14} className="inline mr-2" />
                  Your Psychology Pulse Check
                </div>
                <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-tight">
                  Your <span className="text-[var(--primary-teal)]">Interior World,</span> <br />
                  Reflected.
                </h1>
                <p className="text-xl md:text-2xl text-[var(--text-muted)] max-w-lg leading-relaxed">
                  The clinical-grade mirror for your mental health. Share your symptoms and feelings, and receive an AI-powered diagnostic pulse check.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button onClick={startAssessment} className="btn btn-primary py-5 px-12 text-xl shadow-2xl">
                    Start Your Assessment <ArrowRight className="ml-2" />
                  </button>
                  <div className="flex items-center gap-4 text-slate-500 font-medium">
                    <ShieldCheck size={24} className="text-green-500" />
                    <span>Free & Private & Encrypted</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 mt-12 md:mt-0 relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-[var(--primary-teal)] to-[var(--soft-lavender)] opacity-10 blur-3xl group-hover:opacity-20 transition-opacity"></div>
                <div className="glass p-4 rotate-3 group-hover:rotate-0 transition-transform duration-700 relative z-10">
                  <img
                    src="./src/assets/hero.png"
                    alt="Brain Garden"
                    className="w-full rounded-2xl shadow-2xl"
                  />
                  <div className="absolute -bottom-10 -right-10 glass p-8 animate-bounce-slow">
                    <Heart size={48} className="text-[var(--warm-coral)] fill-[var(--warm-coral)]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Features Preview */}
            <div className="grid md:grid-cols-3 gap-12 pt-20">
              <div className="glass p-10 space-y-4 hover:translate-y-[-10px] transition-transform shadow-xl">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-500">
                  <Brain size={32} />
                </div>
                <h3 className="text-2xl font-bold">Conversational Intake</h3>
                <p className="text-slate-500">A soothing, dialogue-driven assessment that listens beyond keywords to understand core stressors.</p>
              </div>
              <div className="glass p-10 space-y-4 hover:translate-y-[-10px] transition-transform shadow-xl">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-500">
                  <Activity size={32} />
                </div>
                <h3 className="text-2xl font-bold">Clinical Precision</h3>
                <p className="text-slate-500">Built on established psychological frameworks to provide high-fidelity diagnostic maps.</p>
              </div>
              <div className="glass p-10 space-y-4 hover:translate-y-[-10px] transition-transform shadow-xl">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-red-500">
                  <Heart size={32} />
                </div>
                <h3 className="text-2xl font-bold">Direct Support</h3>
                <p className="text-slate-500">Instant connection to human help and crisis resources when your pulse check detects high risk.</p>
              </div>
            </div>
          </div>
        )}

        {currentView === 'assessment' && (
          <div className="container py-20">
            <ChatInterface onComplete={handleAssessmentComplete} />
          </div>
        )}

        {currentView === 'results' && assessmentAnswers && (
          <div className="container py-10 px-6">
            <Dashboard answers={assessmentAnswers} session={session} onLogin={handleAuthModal} />
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <Brain size={24} className="text-[var(--primary-teal)]" />
            <span className="text-xl font-bold">MindMirror</span>
          </div>
          <p className="text-slate-400 text-sm">
            © 2026 MindMirror. For educational purposes only. Not a medical substitute.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-gray-900 transition-colors"><Github size={20} /></a>
          </div>
        </div>
      </footer>

      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass max-w-md w-full p-8 flex flex-col gap-8 bg-white/95">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Welcome Back</h2>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >✕</button>
            </div>

            {message ? (
              <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-center">
                {message}
              </div>
            ) : (
              <>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="input-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button className="btn btn-primary w-full py-4 text-xl" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Magic Link'}
                  </button>
                </form>
                <div className="flex items-center gap-4 py-4">
                  <div className="flex-1 h-[1px] bg-gray-200"></div>
                  <span className="text-xs text-gray-400 font-bold">OR LOGIN WITH</span>
                  <div className="flex-1 h-[1px] bg-gray-200"></div>
                </div>
                <div className="flex gap-4">
                  <button className="btn btn-secondary flex-1 py-4">Google</button>
                  <button className="btn btn-secondary flex-1 py-4">Phone</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
