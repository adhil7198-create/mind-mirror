import React, { useState, useEffect } from 'react';
import SafetyPopup from './components/SafetyPopup';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import History from './components/History';
import SettingsComp from './components/Settings';
import { Sparkles, Brain, Heart, ArrowRight, ShieldCheck, Github, Activity, LogOut, User, X, Clock, Settings } from 'lucide-react';
import { supabase } from './lib/supabase';

const App = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [assessmentAnswers, setAssessmentAnswers] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [message, setMessage] = useState('');
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  const [showOtpInput, setShowOtpInput] = useState(false);

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

    if (loginMethod === 'email') {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Check your email for the login link!');
      }
    } else {
      // Phone Login
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone.startsWith('+') ? phone : `+91${phone}` // Default to +91 if not provided
      });
      if (error) {
        setMessage(error.message);
      } else {
        setShowOtpInput(true);
        setMessage('OTP sent to your phone!');
      }
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.verifyOtp({
      phone: phone.startsWith('+') ? phone : `+91${phone}`,
      token: otpCode,
      type: 'sms'
    });
    if (error) {
      setMessage(error.message);
    } else {
      setIsAuthModalOpen(false);
      setShowOtpInput(false);
      setMessage('');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentView('landing');
  };

  const startAssessment = () => setCurrentView('assessment');

  const handleAssessmentComplete = (answers) => {
    setAssessmentAnswers(answers);
    setCurrentView('results');
  };

  const handleAuthModal = () => {
    setIsAuthModalOpen(true);
    setMessage('');
    setShowOtpInput(false);
    setOtpCode('');
  };

  return (
    <div className="min-h-screen transition-all duration-700">
      <SafetyPopup onAccept={() => console.log('Safety accepted')} />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-40 bg-white/70 backdrop-blur-xl border-b border-white/20">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => { setCurrentView('landing'); setIsMobileMenuOpen(false); }}>
            <div className="w-10 h-10 rounded-2xl bg-[var(--primary-teal)] flex items-center justify-center text-white shadow-lg shadow-[var(--primary-teal)]/40 hover:scale-105 transition-transform">
              <Brain size={24} />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent">
              MindMirror
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-600 hover:text-[var(--primary-teal)] font-medium transition-colors">How it Works</a>

            {session ? (
              <>
                <button
                  onClick={() => setCurrentView('history')}
                  className={`flex items-center gap-2 font-medium transition-colors ${currentView === 'history' ? 'text-[var(--primary-teal)] font-bold' : 'text-slate-600 hover:text-[var(--primary-teal)]'}`}
                >
                  <Clock size={16} /> History
                </button>
                <div className="h-6 w-px bg-slate-200"></div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCurrentView('settings')}
                    className={`flex items-center gap-2 font-medium transition-colors ${currentView === 'settings' ? 'text-[var(--primary-teal)] font-bold' : 'text-slate-600 hover:text-[var(--primary-teal)]'}`}
                  >
                    <Settings size={18} />
                    <span className="text-sm font-semibold">{session.user.email.split('@')[0]}</span>
                  </button>
                  <button className="btn btn-secondary border-none" onClick={handleLogout}>
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <a href="#" className="text-gray-600 hover:text-[var(--primary-teal)] font-medium transition-colors">For Professionals</a>
                <button className="btn btn-primary" onClick={handleAuthModal}>Login</button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <div className="space-y-1.5 w-6">
              <div className="h-0.5 w-full bg-slate-600"></div>
              <div className="h-0.5 w-3/4 bg-slate-600"></div>
              <div className="h-0.5 w-full bg-slate-600"></div>
            </div>}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass rounded-none border-t border-white/20 bg-white/95 animate-fade-in p-6 space-y-6">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => { setCurrentView('landing'); setIsMobileMenuOpen(false); }}
                className="text-lg font-medium text-slate-700 p-2 text-left"
              >Home</button>
              <a href="#" className="text-lg font-medium text-slate-700 p-2">How it Works</a>

              {session ? (
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-4">
                  <button
                    onClick={() => { setCurrentView('history'); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-3 text-lg font-medium text-slate-700 p-2"
                  >
                    <Clock size={20} /> History
                  </button>
                  <button
                    onClick={() => { setCurrentView('settings'); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-3 text-lg font-medium text-slate-700 p-2"
                  >
                    <Settings size={20} /> Settings
                  </button>
                  <button className="btn btn-secondary w-full justify-start mt-4" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                    <LogOut size={18} className="mr-2" /> Logout
                  </button>
                </div>
              ) : (
                <button className="btn btn-primary w-full py-4" onClick={() => { handleAuthModal(); setIsMobileMenuOpen(false); }}>Login</button>
              )}
            </div>
          </div>
        )}
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
                <h1 className="text-4xl md:text-8xl font-bold tracking-tight leading-tight">
                  Your <span className="text-[var(--primary-teal)]">Interior World,</span> <br />
                  Reflected.
                </h1>
                <p className="text-lg md:text-2xl text-[var(--text-muted)] max-w-lg leading-relaxed">
                  The clinical-grade mirror for your mental health. Share your symptoms and feelings, and receive an AI-powered diagnostic pulse check.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                  <button onClick={startAssessment} className="btn btn-primary py-4 md:py-5 px-8 md:px-12 text-lg md:text-xl shadow-2xl">
                    Start Your Assessment <ArrowRight className="ml-2" />
                  </button>
                  <div className="flex items-center gap-3 md:gap-4 text-slate-500 font-medium px-2">
                    <ShieldCheck size={20} className="text-green-500" />
                    <span className="text-sm md:text-base">Free & Private & Encrypted</span>
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

        {currentView === 'history' && session && (
          <div className="container py-10 px-6">
            <History session={session} />
          </div>
        )}

        {currentView === 'settings' && session && (
          <div className="container py-10 px-6">
            <SettingsComp session={session} onLogout={handleLogout} />
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
          <div className="glass max-w-md w-full p-8 flex flex-col gap-6 bg-white/95">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">{showOtpInput ? 'Verify OTP' : 'Welcome Back'}</h2>
              <button
                onClick={() => { setIsAuthModalOpen(false); setShowOtpInput(false); }}
                className="text-gray-400 hover:text-gray-600 p-2"
              >✕</button>
            </div>

            {message && !showOtpInput && (
              <div className="p-4 bg-slate-50 border border-slate-100 text-slate-600 rounded-xl text-center text-sm font-medium">
                {message}
              </div>
            )}

            {showOtpInput ? (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                <p className="text-slate-500 text-sm text-center">Enter the 6-digit code sent to <br /><span className="font-bold text-slate-900">{phone}</span></p>
                <input
                  type="text"
                  placeholder="000000"
                  className="input-field text-center text-2xl tracking-[1em] font-black"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  maxLength={6}
                  required
                />
                <button className="btn btn-primary w-full py-4 text-xl" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowOtpInput(false)}
                  className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Edit phone number
                </button>
              </form>
            ) : (
              <>
                <div className="flex p-1 bg-slate-100 rounded-2xl">
                  <button
                    onClick={() => setLoginMethod('email')}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${loginMethod === 'email' ? 'bg-white shadow-sm text-[var(--primary-teal)]' : 'text-slate-400 hover:text-slate-600'}`}
                  >Email</button>
                  <button
                    onClick={() => setLoginMethod('phone')}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${loginMethod === 'phone' ? 'bg-white shadow-sm text-[var(--primary-teal)]' : 'text-slate-400 hover:text-slate-600'}`}
                  >Phone</button>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  {loginMethod === 'email' ? (
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="input-field pl-12"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input
                        type="tel"
                        placeholder="+91 XXX-XXX-XXXX"
                        className="input-field pl-12"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  <button className="btn btn-primary w-full py-4 text-xl" disabled={loading}>
                    {loading ? 'Processing...' : (loginMethod === 'email' ? 'Send Magic Link' : 'Send OTP')}
                  </button>
                </form>

                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-[1px] bg-slate-100"></div>
                  <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Secured by MindMirror</span>
                  <div className="flex-1 h-[1px] bg-slate-100"></div>
                </div>

                <div className="flex flex-col gap-3">
                  <button className="flex items-center justify-center gap-3 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all font-bold text-slate-600">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                    Continue with Google
                  </button>
                </div>
              </>
            )}

            <p className="text-center text-[11px] text-slate-400 leading-relaxed">
              By continuing, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <br /> <span className="underline cursor-pointer">Clinical Privacy Guidelines</span>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
