import React, { useState, useEffect } from 'react';
import { ShieldAlert, Info, ExternalLink, X } from 'lucide-react';

const SafetyPopup = ({ onAccept }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="popup-overlay transition-all duration-500">
      <div className="glass popup-content animate-fade-in border-4 border-[var(--primary-teal)] bg-white/95 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--primary-teal)]/10 rounded-xl text-[var(--primary-teal)]">
              <ShieldAlert size={28} />
            </div>
            <h2 className="text-2xl text-[var(--primary-teal)]">🌱 Just a Quick Note</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          <p className="text-[#555] leading-relaxed text-lg">
            MindMirror uses clinical psychology logic to help you map your stress, but it <strong>does not replace a licensed therapist or doctor.</strong>
          </p>

          <div className="bg-red-50 p-6 rounded-2xl border border-[var(--warm-coral)] shadow-sm">
            <p className="text-[#d9534f] font-bold text-xl flex items-center gap-2 mb-2">
              🚨 In an Emergency?
            </p>
            <p className="text-[#d9534f] opacity-90 leading-relaxed">
              If you are in immediate danger or thinking of hurting yourself, please contact a local crisis hotline or emergency services immediately.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <a href="tel:988" className="inline-flex items-center gap-2 text-[#d9534f] font-semibold hover:underline">
                Call 988 (Crisis Support) <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <button
            onClick={() => {
              setIsOpen(false);
              onAccept && onAccept();
            }}
            className="btn btn-primary w-full py-4 text-lg shadow-xl"
          >
            I Understand, Let's Begin
          </button>
        </div>
      </div>
    </div>
  );
};

export default SafetyPopup;
