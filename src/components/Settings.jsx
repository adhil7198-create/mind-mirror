import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
    User,
    Settings,
    MapPin,
    Phone,
    Mail,
    Save,
    ShieldAlert,
    Calendar,
    LogOut,
    ChevronRight,
    UserPlus
} from 'lucide-react';

const SettingsComp = ({ session, onLogout }) => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({
        full_name: '',
        phone: '',
        location: '',
    });
    const [saveStatus, setSaveStatus] = useState(null);

    useEffect(() => {
        getProfile();
    }, [session]);

    const getProfile = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select(`full_name`)
                .eq('id', session.user.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            setProfile({ ...profile, full_name: data?.full_name || '' });
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        setSaveStatus('saving');

        try {
            const { error } = await supabase.from('profiles').upsert({
                id: session.user.id,
                full_name: profile.full_name,
                updated_at: new Date(),
            });

            if (error) throw error;
            setSaveStatus('success');
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (err) {
            setSaveStatus('error');
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-[var(--primary-teal)]/20 border-t-[var(--primary-teal)] rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Securing your clinical vault...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-fade-in">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-slate-900">Patient Settings</h1>
                <p className="text-lg text-slate-500">Manage your clinical profile and secure data vault.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Sidebar */}
                <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 glass border-[var(--primary-teal)] text-[var(--primary-teal)] font-bold">
                        <div className="flex items-center gap-3">
                            <User size={20} />
                            Personal Profile
                        </div>
                        <ChevronRight size={18} />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 glass text-slate-400 hover:text-slate-600 transition-colors">
                        <div className="flex items-center gap-3 font-medium">
                            <Settings size={20} />
                            Security Settings
                        </div>
                        <ChevronRight size={18} />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 glass text-slate-400 hover:text-slate-600 transition-colors">
                        <div className="flex items-center gap-3 font-medium">
                            <ShieldAlert size={20} />
                            Privacy Control
                        </div>
                        <ChevronRight size={18} />
                    </button>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-between p-4 glass text-red-400 hover:bg-red-50 hover:border-red-100 transition-all font-bold"
                    >
                        <div className="flex items-center gap-3">
                            <LogOut size={20} />
                            Log Out Session
                        </div>
                        <ChevronRight size={18} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="col-span-2 space-y-6">
                    <form onSubmit={updateProfile} className="glass p-8 space-y-8 bg-white/95">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 py-4 border-b border-slate-100">
                                <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary-teal)] to-[var(--soft-lavender)] rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg">
                                    {profile.full_name?.charAt(0).toUpperCase() || (session.user.email ? session.user.email.charAt(0).toUpperCase() : 'P')}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{session.user.email || session.user.phone}</h3>
                                    <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                                        <Calendar size={14} />
                                        Verified Patient since {new Date(session.user.created_at).getFullYear()}
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Full Clinical Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <input
                                            type="text"
                                            className="input-field pl-12"
                                            placeholder="e.g. Adhil"
                                            value={profile.full_name}
                                            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Secure Phone</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input type="tel" className="input-field pl-12 bg-slate-50/50 cursor-not-allowed opacity-50" placeholder="+91 XXX-XXX-XXXX" disabled />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Primary Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input type="email" className="input-field pl-12 bg-slate-50/50 cursor-not-allowed opacity-50" value={session.user.email || 'N/A'} disabled />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                            <button
                                type="submit"
                                className="btn btn-primary px-10 py-4 font-bold flex items-center gap-2"
                                disabled={saveStatus === 'saving'}
                            >
                                {saveStatus === 'saving' ? 'Verifying...' : (
                                    <>
                                        <Save size={20} /> Update Secure Identity
                                    </>
                                )}
                            </button>
                            {saveStatus === 'success' && <div className="text-green-600 font-bold animate-fade-in flex items-center gap-2"><UserPlus size={18} /> Profile Saved!</div>}
                            {saveStatus === 'error' && <div className="text-red-500 font-bold animate-fade-in">Update Failed.</div>}
                        </div>
                    </form>

                    <div className="glass p-8 space-y-4 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--soft-lavender)]/20 blur-3xl -rotate-12 translate-x-10 -translate-y-10"></div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <ShieldAlert size={20} className="text-[var(--warm-coral)]" />
                            Critical Privacy Notice
                        </h3>
                        <p className="text-slate-500 leading-relaxed text-sm">
                            Your "MindMirror" assessment history is linked to your clinical identity. Deleting your account will permanently wipe all historical pulse checks, and these records cannot be recovered.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsComp;
