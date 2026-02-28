import React, { useMemo, useState } from 'react';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import { ShieldCheck, Calendar, Activity, Lock, ArrowRight, UserPlus, Save, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Dashboard = ({ answers, session, onLogin }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);

    // Simple Mock AI Scoring Logic
    const score = useMemo(() => {
        let physical = 40, cognitive = 50, emotional = 45, social = 30;
        const text = Object.values(answers).join(' ').toLowerCase();

        if (text.includes('racing') || text.includes('chest') || text.includes('tight')) physical += 40;
        if (text.includes('worry') || text.includes('future') || text.includes('past')) cognitive += 35;
        if (text.includes('joy') || text.includes('heavy') || text.includes('sad')) emotional += 40;
        if (text.includes('withdrawn') || text.includes('isolated') || text.includes('alone')) social += 30;

        return [
            { subject: 'Physical', A: Math.min(physical, 100) },
            { subject: 'Cognitive', A: Math.min(cognitive, 100) },
            { subject: 'Emotional', A: Math.min(emotional, 100) },
            { subject: 'Social', A: Math.min(social, 100) },
        ];
    }, [answers]);

    const profileName = useMemo(() => {
        const max = Math.max(...score.map(s => s.A));
        if (max > 80) return "Tidal Wave";
        if (max > 60) return "Storm Cloud";
        if (max > 40) return "Gentle Breeze";
        return "Morning Dew";
    }, [score]);

    const clinicalInsight = useMemo(() => {
        if (profileName === "Tidal Wave") {
            return "Your nervous system is currently in a high-alert state. These physical and cognitive signals suggest you've crossed a functional threshold of acute stress.";
        }
        if (profileName === "Storm Cloud") {
            return "You're experiencing significant emotional and cognitive pressure. While manageble, these markers point towards early signs of burnout.";
        }
        return "Your stress markers are within a managed range, though certain patterns suggest opportunity for rejuvenation and proactive self-care.";
    }, [profileName]);

    const handleSaveResult = async () => {
        if (!session) {
            onLogin();
            return;
        }

        setIsSaving(true);
        const { error } = await supabase.from('assessments').insert([{
            user_id: session.user.id,
            profile_name: profileName,
            physical_score: score[0].A,
            cognitive_score: score[1].A,
            emotional_score: score[2].A,
            social_score: score[3].A,
            insight: clinicalInsight,
            raw_answers: answers
        }]);

        if (error) {
            setSaveStatus('error');
            console.error(error);
        } else {
            setSaveStatus('success');
        }
        setIsSaving(false);
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fade-in flex flex-col gap-8">
            {/* Quick Summary Card */}
            <div className="glass p-10 relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1">
                    <div className="flex items-center gap-2 px-3 py-1 bg-[var(--warm-coral)] text-white font-bold text-xs rounded-full w-fit mb-4">
                        AI CLINICAL INSIGHT
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent">
                        Your Stress Profile: "{profileName}"
                    </h2>
                    <p className="text-xl text-[var(--text-muted)] leading-relaxed mt-4">
                        {clinicalInsight}
                    </p>
                    <div className="flex items-center gap-4 pt-4">
                        <div className="flex">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 -ml-2 first:ml-0" />
                            ))}
                        </div>
                        <p className="text-sm font-medium text-slate-500">
                            Verified by MindMirror 1.2 Logic
                        </p>
                    </div>
                </div>

                <div className="w-full md:w-[320px] h-[320px] bg-white/50 rounded-full p-4 shadow-inner border border-white/40">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={score}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar
                                name="Score"
                                dataKey="A"
                                stroke="var(--primary-teal)"
                                fill="var(--primary-teal)"
                                fillOpacity={0.4}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Grid of Results */}
            <div className="dashboard-grid">
                <div className="glass p-8 bg-white/90 flex flex-col gap-4">
                    <Activity className="text-[var(--primary-teal)]" size={32} />
                    <h3 className="text-2xl font-bold">Physical Arousal</h3>
                    <p className="text-slate-600">Your body is signaling patterns associated with {score[0].A > 50 ? 'High' : 'Moderate'} Physiological Arousal. This often manifests as sleep disruption and muscle tension.</p>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-4">
                        <div className="h-full bg-[var(--primary-teal)] transition-all duration-1000" style={{ width: `${score[0].A}%` }}></div>
                    </div>
                </div>

                <div className="glass p-8 bg-white/90 flex flex-col gap-4">
                    <ShieldCheck className="text-[var(--warm-coral)]" size={32} />
                    <h3 className="text-2xl font-bold">Next Recommended Steps</h3>
                    <p className="text-slate-600">Based on your "{profileName}" profile, we suggest a 4-7-8 breathing exercise and a brief Digital Sabbatical tonight.</p>
                    <button className="flex items-center gap-2 text-[var(--primary-teal)] font-bold hover:translate-x-1 transition-all mt-4">
                        Get My Wellness Plan <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            {/* Login Prompt (Locked Area) */}
            {!session ? (
                <div className="locked-card glass shadow-xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--primary-teal)] to-transparent"></div>
                    <div className="max-w-2xl mx-auto flex flex-col gap-6">
                        <div className="w-16 h-16 bg-[var(--primary-teal)]/10 text-[var(--primary-teal)] rounded-full flex items-center justify-center mx-auto">
                            <Lock size={32} />
                        </div>
                        <h2 className="text-3xl font-bold">Save Your Journey</h2>
                        <p className="text-lg text-[var(--text-muted)]">
                            Create an account to lock in this assessment, track your progress over 7 days, and unlock personalized therapy matches.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                            <button onClick={onLogin} className="btn btn-primary py-4 px-10 text-lg">
                                <UserPlus size={20} /> Create Free Account
                            </button>
                            <button className="btn btn-secondary py-4 px-10 text-lg">
                                Learn About Our Privacy
                            </button>
                        </div>
                        <p className="text-sm text-slate-400">
                            🔒 256-bit Encryption & Doctor-Patient Confidentiality Principles
                        </p>
                    </div>
                </div>
            ) : (
                <div className="glass p-10 text-center bg-[var(--primary-teal)]/5 border-2 border-[var(--primary-teal)]/20 shadow-xl">
                    <div className="max-w-xl mx-auto space-y-6">
                        {saveStatus === 'success' ? (
                            <div className="animate-fade-in">
                                <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                                <h2 className="text-3xl font-bold text-gray-800">Assessment Saved</h2>
                                <p className="text-lg text-slate-500">Your profile is safely stored in your clinical vault. You can view your full progress dashboard now.</p>
                                <button className="btn btn-primary mt-6 px-12">View Full History</button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold">Lock In Your Result</h2>
                                <p className="text-lg text-slate-500">Save this assessment to your profile to compare it with your future sessions.</p>
                                <button
                                    onClick={handleSaveResult}
                                    disabled={isSaving}
                                    className="btn btn-primary py-4 px-12 text-xl shadow-xl w-full sm:w-auto"
                                >
                                    {isSaving ? 'Saving...' : (
                                        <div className="flex items-center gap-2">
                                            <Save size={20} /> Save to My Profile
                                        </div>
                                    )}
                                </button>
                                {saveStatus === 'error' && <p className="text-red-500 font-medium">Failed to save. Please try again.</p>}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
