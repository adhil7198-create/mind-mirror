import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, AlertTriangle, ArrowRight } from 'lucide-react';

const assessmentQuestions = [
    {
        id: 'start',
        text: "Welcome to your MindMirror session. I'm here to listen and help you map your recent experiences. In your own words, what has been weighing on your mind or body most heavily this week?",
        phase: 1
    },
    {
        id: 'color',
        text: "That sounds like a lot to carry. If your current stress had a color or a shape, what would it look like in your mind's eye?",
        phase: 1
    },
    {
        id: 'physical',
        text: "Thank you for sharing that. I'd like to understand how your body is responding. Are you experiencing physical sensations like a racing heart, tightness in the chest, or frequent headaches?",
        phase: 2
    },
    {
        id: 'sleep',
        text: "And how has your sleep changed recently? Are you sleeping too much, or finding it impossible to quiet your mind at night?",
        phase: 2
    },
    {
        id: 'cognitive',
        text: "On a scale of 1–10, how 'loud' are your thoughts right now? Do you find yourself worrying about things that haven't happened yet, or replaying the past?",
        phase: 3
    },
    {
        id: 'joy',
        text: "Are there activities you used to love that no longer bring you any joy or interest?",
        phase: 3
    },
    {
        id: 'social',
        text: "Finally, how is this feeling affecting your work, school, or relationships? Do you feel like you're withdrawing from others, or do you feel a strong need for company?",
        phase: 4
    }
];

const ChatInterface = ({ onComplete }) => {
    const [messages, setMessages] = useState([
        { role: 'bot', text: assessmentQuestions[0].text, phase: 1 }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [answers, setAnswers] = useState({});
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const detectRedFlags = (text) => {
        const redFlags = ['suicide', 'self-harm', 'hurt myself', 'end it all', 'kill myself', 'die', 'no point living'];
        return redFlags.some(flag => text.toLowerCase().includes(flag));
    };

    const handleSend = () => {
        if (!inputValue.trim() || isTyping) return;

        if (detectRedFlags(inputValue)) {
            setMessages(prev => [...prev,
            { role: 'user', text: inputValue },
            {
                role: 'bot',
                text: "I'm detecting some heavy thoughts. Your safety is my priority. Please consider reaching out to the National Suicide Prevention Lifeline at 988 or text HOME to 741741. You are not alone.",
                isEmergency: true
            }
            ]);
            setInputValue('');
            return;
        }

        const newUserMessage = { role: 'user', text: inputValue };
        const stepKey = assessmentQuestions[currentStep].id;
        setAnswers(prev => ({ ...prev, [stepKey]: inputValue }));

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');

        if (currentStep < assessmentQuestions.length - 1) {
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                setMessages(prev => [...prev, {
                    role: 'bot',
                    text: assessmentQuestions[currentStep + 1].text,
                    phase: assessmentQuestions[currentStep + 1].phase
                }]);
                setCurrentStep(prev => prev + 1);
            }, 1500);
        } else {
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                setMessages(prev => [...prev, {
                    role: 'bot',
                    text: "Thank you for your honesty. I've gathered enough to build your clinical pulse check. Let's see what your MindMirror reveals.",
                    isFinal: true
                }]);
            }, 1500);
        }
    };

    return (
        <div className="chat-container glass animate-fade-in shadow-2xl border-white/20">
            {/* Header */}
            <div className="p-6 bg-[var(--primary-teal)] text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Clinical Mirror</h3>
                        <p className="text-sm opacity-90">Phase {assessmentQuestions[currentStep].phase} of 4: Assessment</p>
                    </div>
                </div>
                <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                    AI ASSISTED
                </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                        <div className={`message-bubble ${m.role === 'user'
                                ? 'message-user'
                                : m.isEmergency
                                    ? 'message-emergency'
                                    : 'message-bot'
                            }`}>
                            {m.role === 'bot' && !m.isEmergency && (
                                <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[var(--primary-teal)]">
                                    <Bot size={12} /> MindMirror AI
                                </div>
                            )}
                            <p className="text-base leading-relaxed">{m.text}</p>
                            {m.isFinal && (
                                <button
                                    onClick={() => onComplete(answers)}
                                    className="mt-4 btn btn-primary w-full shadow-lg group"
                                >
                                    View Assessment <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start animate-pulse">
                        <div className="message-bot message-bubble flex gap-1">
                            <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                            <span className="w-2 h-2 bg-gray-300 rounded-full animation-delay-200"></span>
                            <span className="w-2 h-2 bg-gray-300 rounded-full animation-delay-400"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="input-field flex-1"
                        placeholder="Type your response..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isTyping || messages[messages.length - 1].isFinal}
                    />
                    <button
                        className="btn btn-primary p-4 rounded-2xl"
                        onClick={handleSend}
                        disabled={isTyping || messages[messages.length - 1].isFinal}
                    >
                        <Send size={20} />
                    </button>
                </div>
                <p className="mt-2 text-[10px] text-center text-gray-400">
                    Your responses are encrypted and private. Clinical guidance is educational only.
                </p>
            </div>
        </div>
    );
};

export default ChatInterface;
