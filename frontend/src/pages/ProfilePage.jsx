import { useState, useEffect } from 'react';
import { Save, Sparkles, BookOpen, MapPin, User, ChevronRight, Target, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { apiCall } from '../utils/api';

const ProfilePage = () => {
  const { user, token, setUser } = useAuth();
  const [skillsTeach, setSkillsTeach] = useState(user?.skillsTeach?.join(', ') || '');
  const [skillsLearn, setSkillsLearn] = useState(user?.skillsLearn?.join(', ') || '');
  const [skillLevel, setSkillLevel] = useState(user?.skillLevel || 'Beginner');
  const [availability, setAvailability] = useState(user?.availability || 'Flexible');
  const [location, setLocation] = useState(user?.location || 'Remote');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiCall('/users/profile', 'PUT', {
        skillsTeach: skillsTeach.split(',').map(s => s.trim()), 
        skillsLearn: skillsLearn.split(',').map(s => s.trim()), 
        skillLevel, 
        availability,
        location
      }, token);
      
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      alert('Profile Updated Successfully!');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 pb-32">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-6 mb-16"
      >
        <div className="w-20 h-20 bg-gradient-vibrant rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-primary/30 group">
           <User size={40} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
        </div>
        <div>
           <h2 className="text-5xl font-black text-white tracking-tighter uppercase font-heading">Settings</h2>
           <p className="text-slate-400 font-medium text-lg">Master your identity and learning goals.</p>
        </div>
      </motion.div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-10 rounded-[3rem] border-white/10 space-y-10"
            >
               <h3 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-3 font-heading">
                  <BookOpen size={24} className="text-primary-light" /> Skill Inventory
               </h3>
               
               <div className="space-y-8">
                 <div className="group">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-4 px-2 group-focus-within:text-emeraldGreen transition-colors">Skills you can teach</label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white focus:outline-none focus:border-emeraldGreen/50 transition-all font-bold text-lg shadow-inner"
                      value={skillsTeach} onChange={e => setSkillsTeach(e.target.value)} 
                      placeholder="e.g. React, UI Design, Marketing"
                    />
                 </div>
                 
                 <div className="group">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-4 px-2 group-focus-within:text-primary-light transition-colors">Skills you want to learn</label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white focus:outline-none focus:border-primary/50 transition-all font-bold text-lg shadow-inner"
                      value={skillsLearn} onChange={e => setSkillsLearn(e.target.value)} 
                      placeholder="e.g. Piano, French, Cooking"
                    />
                 </div>
               </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-10 rounded-[3rem] border-white/10 space-y-10"
            >
               <h3 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-3 font-heading">
                  <Target size={24} className="text-sunsetOrange" /> Global Preferences
               </h3>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                   <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-4 px-2">Proficiency Level</label>
                   <div className="relative">
                      <select 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer font-black text-lg shadow-inner uppercase tracking-wider"
                        value={skillLevel} onChange={e => setSkillLevel(e.target.value)}>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Expert</option>
                      </select>
                      <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-slate-500 pointer-events-none" size={24} />
                   </div>
                 </div>
                 
                 <div>
                   <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-4 px-2">Current Base</label>
                   <div className="relative group">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={20} />
                      <input 
                        type="text" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-16 py-5 text-white focus:outline-none focus:border-primary/50 transition-all font-bold text-lg shadow-inner"
                        value={location} onChange={e => setLocation(e.target.value)} 
                        placeholder="e.g. New York, Remote"
                      />
                   </div>
                 </div>
               </div>

               <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-6 px-2 text-center">Availability Window</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Weekdays', 'Weekends', 'Evenings', 'Flexible'].map(opt => (
                       <button
                         key={opt}
                         type="button"
                         onClick={() => setAvailability(opt)}
                         className={`px-4 py-4 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${availability === opt ? 'bg-gradient-vibrant border-transparent text-white shadow-xl shadow-primary/20 scale-105' : 'bg-white/5 border-white/10 text-slate-500 hover:border-primary/30'}`}
                       >
                         {opt}
                       </button>
                    ))}
                  </div>
               </div>
            </motion.div>
        </div>

        <div className="space-y-8">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.2 }}
               className="glass-panel p-10 rounded-[3rem] border-white/10 text-center relative overflow-hidden group"
            >
               <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent"></div>
               <div className="relative z-10 w-24 h-24 bg-gradient-ocean rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-8 shadow-2xl group-hover:rotate-6 transition-transform">
                  <Award size={48} />
               </div>
               <h4 className="relative z-10 text-2xl font-black text-white uppercase tracking-tighter font-heading">Match Score</h4>
               <p className="relative z-10 text-slate-400 text-sm font-medium mt-3 leading-relaxed">High scores mean better visibility for the Oracle Match engine.</p>
               
               <div className="relative z-10 mt-10 space-y-4">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-primary-light px-1">
                     <span>Profile Sync</span>
                     <span className="text-emeraldGreen">85%</span>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-electricPurple via-neonBlue to-emeraldGreen rounded-full" 
                     />
                  </div>
               </div>
            </motion.div>

            <motion.button 
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading}
              className="w-full btn-vibrant btn-vibrant-purple py-6 rounded-[2.5rem] shadow-3xl shadow-primary/40 flex items-center justify-center gap-4 text-xl"
            >
              {loading ? 'MODERATING...' : <><Save size={28} className="stroke-[2.5]" /> UPDATE PROFILE</>}
            </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
