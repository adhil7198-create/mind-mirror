import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
    Calendar,
    ChevronRight,
    Clock,
    Activity,
    Trash2,
    AlertCircle,
    BarChart3
} from 'lucide-react';

const History = ({ session }) => {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, [session]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('assessments')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAssessments(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteAssessment = async (id) => {
        if (!window.confirm('Are you sure you want to delete this assessment record?')) return;

        try {
            const { error } = await supabase
                .from('assessments')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setAssessments(assessments.filter(a => a.id !== id));
        } catch (err) {
            alert('Error deleting: ' + err.message);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-[var(--primary-teal)]/20 border-t-[var(--primary-teal)] rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Retrieving your clinical history...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Assessment History</h1>
                    <p className="text-lg text-slate-500">Track your psychological evolution over time.</p>
                </div>
                <div className="glass px-4 py-2 flex items-center gap-2 text-sm font-bold text-[var(--primary-teal)]">
                    <BarChart3 size={18} />
                    {assessments.length} RECORDS FOUND
                </div>
            </div>

            {assessments.length === 0 ? (
                <div className="glass p-12 text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                        <Clock size={40} />
                    </div>
                    <h2 className="text-2xl font-bold">No Records Yet</h2>
                    <p className="text-slate-500 max-w-sm mx-auto">Complete your first pulse check to start building your mental health longitudinal data.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {assessments.map((item) => (
                        <div key={item.id} className="glass p-6 hover:border-[var(--primary-teal)]/30 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[var(--primary-teal)] opacity-40"></div>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-start gap-5">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[var(--primary-teal)] group-hover:scale-110 transition-transform">
                                        <Activity size={28} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-bold text-slate-900">"{item.profile_name}"</h3>
                                            <span className="badge badge-teal hidden sm:inline-block">Verified</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-slate-400 font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} />
                                                {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} />
                                                {new Date(item.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-4 md:pt-0">
                                    <div className="grid grid-cols-4 gap-3 md:gap-4">
                                        <div className="text-center">
                                            <div className="text-xs font-bold text-slate-400 mb-1">PHY</div>
                                            <div className="text-sm font-black text-slate-700">{Math.round(item.physical_score)}%</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs font-bold text-slate-400 mb-1">COG</div>
                                            <div className="text-sm font-black text-slate-700">{Math.round(item.cognitive_score)}%</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs font-bold text-slate-400 mb-1">EMO</div>
                                            <div className="text-sm font-black text-slate-700">{Math.round(item.emotional_score)}%</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs font-bold text-slate-400 mb-1">SOC</div>
                                            <div className="text-sm font-black text-slate-700">{Math.round(item.social_score)}%</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => deleteAssessment(item.id)}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Record"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                        <button className="p-2 text-slate-300 hover:text-[var(--primary-teal)] transition-colors">
                                            <ChevronRight size={24} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="glass p-6 bg-blue-50/50 border-blue-100 flex items-start gap-4">
                <AlertCircle className="text-blue-500 mt-1" size={20} />
                <div className="text-sm text-blue-800 leading-relaxed">
                    <span className="font-bold">Clinical Privacy Notice:</span> Your assessment data is encrypted at rest. We do not share individual scores with insurance companies or employers without explicit patient consent.
                </div>
            </div>
        </div>
    );
};

export default History;
