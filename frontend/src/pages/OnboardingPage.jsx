import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, BookOpen, Star, Calendar, ChevronRight, ChevronLeft, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { apiCall } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const STEP_COLORS = [
  { from: '#9d50bb', to: '#6e48aa', text: '#a855f7' },
  { from: '#10b981', to: '#059669', text: '#34d399' },
  { from: '#2196f3', to: '#1565c0', text: '#60a5fa' },
  { from: '#f59e0b', to: '#d97706', text: '#fbbf24' },
  { from: '#10b981', to: '#9d50bb', text: '#a7f3d0' },
];

const steps = [
  { title: "The Basics", icon: User, description: "Let's get to know you" },
  { title: "You Teach", icon: BookOpen, description: "Your superpowers" },
  { title: "You Learn", icon: Star, description: "Your curiosity" },
  { title: "Proficiency", icon: Sparkles, description: "Skill mastery level" },
  { title: "Schedule", icon: Calendar, description: "When you're free" },
];

const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const { user, token, setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.username || '',
    age: '',
    location: user?.location || 'Remote',
    bio: user?.bio || '',
    skillsTeach: user?.skillsTeach?.join(', ') || '',
    skillsLearn: user?.skillsLearn?.join(', ') || '',
    skillLevel: user?.skillLevel || 'Beginner',
    availability: user?.availability || 'Flexible',
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFinish = async () => {
    try {
      const data = await apiCall('/users/profile', 'PUT', {
        ...formData,
        skillsTeach: formData.skillsTeach.split(',').map(s => s.trim()),
        skillsLearn: formData.skillsLearn.split(',').map(s => s.trim()),
        onboardingComplete: true,
      }, token);
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  const color = STEP_COLORS[step - 1];
  const inputClass = "w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none transition-all font-bold placeholder:text-slate-600 shadow-inner text-lg";

  return (
    <div className="max-w-2xl mx-auto min-h-[88vh] flex flex-col justify-center py-10">
      {/* Step Tracker */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/5 -z-10" />
        <div
          className="absolute top-5 left-0 h-0.5 -z-10 transition-all duration-700"
          style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%`, background: `linear-gradient(90deg, ${color.from}, ${color.to})` }}
        />
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <motion.div
              animate={{ scale: step === i + 1 ? 1.15 : 1 }}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all border-2"
              style={{
                background: step > i ? `linear-gradient(135deg, ${color.from}, ${color.to})` : 'rgba(255,255,255,0.05)',
                borderColor: step > i ? color.from : 'rgba(255,255,255,0.1)',
                boxShadow: step === i + 1 ? `0 0 20px ${color.from}80` : 'none',
              }}
            >
              {step > i + 1 ? '✓' : <s.icon size={16} className="text-white" />}
            </motion.div>
            <span className="text-[9px] font-black uppercase tracking-widest transition-colors hidden md:block" style={{ color: step === i + 1 ? color.text : 'rgba(100,116,139,1)' }}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="glass-panel p-10 rounded-[3rem] border-white/10 relative overflow-hidden shadow-[0_32px_80px_-16px_rgba(0,0,0,0.7)]">
        {/* Glow behind card */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-[100px] opacity-20 transition-all duration-700" style={{ background: color.from }} />

        <AnimatePresence mode="wait">
          {/* Step 1: The Basics */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-8 relative z-10">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.3em] mb-3" style={{ color: color.text }}>Step 1 of 5 · The Basics</div>
                <h2 className="text-4xl font-black text-white tracking-tighter font-heading">Tell us about <span style={{ color: color.text }}>yourself.</span></h2>
                <p className="text-slate-400 mt-2">This helps us personalise your matching experience.</p>
              </div>
              <div className="space-y-4">
                <input className={inputClass} style={{ '--tw-ring-color': color.from }} placeholder="Your display name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                  <input className={inputClass} placeholder="Age" type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                    <input className={`${inputClass} pl-12`} placeholder="Location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                  </div>
                </div>
                <textarea className={`${inputClass} h-28 resize-none`} placeholder="Write a short bio about yourself..." value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
              </div>
            </motion.div>
          )}

          {/* Step 2: Teach */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-8 relative z-10">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.3em] mb-3" style={{ color: color.text }}>Step 2 of 5 · Your Superpowers</div>
                <h2 className="text-4xl font-black text-white tracking-tighter font-heading">What can you <span style={{ color: color.text }}>teach?</span></h2>
                <p className="text-slate-400 mt-2">Add skills separated by commas. Be specific!</p>
              </div>
              <input autoFocus className={inputClass} placeholder="e.g. React, Guitar, French cooking..." value={formData.skillsTeach} onChange={e => setFormData({ ...formData, skillsTeach: e.target.value })} />
              {formData.skillsTeach && (
                <div className="flex flex-wrap gap-2">
                  {formData.skillsTeach.split(',').filter(s => s.trim()).map((sk, i) => (
                    <span key={i} className="px-4 py-1.5 rounded-2xl text-xs font-black uppercase tracking-wider text-white" style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})` }}>
                      {sk.trim()}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Step 3: Learn */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-8 relative z-10">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.3em] mb-3" style={{ color: color.text }}>Step 3 of 5 · Your Curiosity</div>
                <h2 className="text-4xl font-black text-white tracking-tighter font-heading">What do you want to <span style={{ color: color.text }}>learn?</span></h2>
                <p className="text-slate-400 mt-2">Tell us your learning goals. You can add many!</p>
              </div>
              <input autoFocus className={inputClass} placeholder="e.g. Piano, Python, Chess..." value={formData.skillsLearn} onChange={e => setFormData({ ...formData, skillsLearn: e.target.value })} />
              {formData.skillsLearn && (
                <div className="flex flex-wrap gap-2">
                  {formData.skillsLearn.split(',').filter(s => s.trim()).map((sk, i) => (
                    <span key={i} className="px-4 py-1.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-white/5 border border-white/10 text-slate-300">
                      {sk.trim()}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Step 4: Proficiency */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-8 relative z-10">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.3em] mb-3" style={{ color: color.text }}>Step 4 of 5 · Skill Level</div>
                <h2 className="text-4xl font-black text-white tracking-tighter font-heading">Your current <span style={{ color: color.text }}>level?</span></h2>
                <p className="text-slate-400 mt-2">Be honest — it helps you find the right partners.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(lvl => (
                  <motion.button
                    key={lvl}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setFormData({ ...formData, skillLevel: lvl })}
                    className="py-5 rounded-2xl border-2 font-black uppercase tracking-widest transition-all text-sm"
                    style={formData.skillLevel === lvl ? {
                      background: `linear-gradient(135deg, ${color.from}, ${color.to})`,
                      borderColor: 'transparent',
                      color: '#fff',
                      boxShadow: `0 10px 30px -10px ${color.from}80`,
                    } : {
                      background: 'rgba(255,255,255,0.03)',
                      borderColor: 'rgba(255,255,255,0.08)',
                      color: '#64748b',
                    }}
                  >
                    {lvl}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 5: Schedule */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-8 relative z-10">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.3em] mb-3" style={{ color: color.text }}>Step 5 of 5 · Availability</div>
                <h2 className="text-4xl font-black text-white tracking-tighter font-heading">When are you <span style={{ color: color.text }}>free?</span></h2>
                <p className="text-slate-400 mt-2">We'll prioritise matches with similar schedules.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['Weekdays', 'Weekends', 'Evenings', 'Flexible'].map(opt => (
                  <motion.button
                    key={opt}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setFormData({ ...formData, availability: opt })}
                    className="py-5 rounded-2xl border-2 font-black uppercase tracking-widest transition-all text-sm"
                    style={formData.availability === opt ? {
                      background: `linear-gradient(135deg, ${color.from}, ${color.to})`,
                      borderColor: 'transparent',
                      color: '#fff',
                      boxShadow: `0 10px 30px -10px ${color.from}80`,
                    } : {
                      background: 'rgba(255,255,255,0.03)',
                      borderColor: 'rgba(255,255,255,0.08)',
                      color: '#64748b',
                    }}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-start gap-4">
                <Zap size={20} className="mt-0.5 flex-shrink-0" style={{ color: color.text }} />
                <div>
                  <p className="text-white font-black text-sm uppercase tracking-widest">You're almost done!</p>
                  <p className="text-slate-400 text-sm mt-1">Hit the button below to finish onboarding and start exploring your matches on the Oracle.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-10 flex justify-between gap-4 relative z-10">
          {step > 1 ? (
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={prevStep} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
              <ChevronLeft size={24} />
            </motion.button>
          ) : <div />}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={step === 5 ? handleFinish : nextStep}
            className="flex-1 text-white font-black py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-3 tracking-widest uppercase text-sm transition-all"
            style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})`, boxShadow: `0 15px 30px -10px ${color.from}60` }}
          >
            {step === 5 ? <><Sparkles size={20} /> Launch SkillSwap</> : <>Continue <ArrowRight size={20} /></>}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
