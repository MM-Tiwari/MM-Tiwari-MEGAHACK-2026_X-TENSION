import { Zap, Star, Layout, Clock, Send, ShieldCheck, Sparkles, User, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MatchCard = ({ match, currentUser }) => {
  const handleRequest = async () => {
    if (currentUser.credits < 1) return alert("Not enough credits!");
    try {
      const res = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token') 
        },
        body: JSON.stringify({ 
            receiverId: match._id, 
            skillRequested: match.skillsTeach[0] 
        })
      });
      const data = await res.json();
      if(res.ok) alert("Request Sent Successfully! -1 Credit");
      else alert(data.error);
    } catch(e) { alert("Failed to send request"); }
  };

  const getSkillColor = (skill) => {
    const s = skill.toLowerCase();
    if (s.includes('python') || s.includes('code') || s.includes('react')) return 'from-blue-500 to-cyan-400';
    if (s.includes('guitar') || s.includes('music') || s.includes('art')) return 'from-orange-500 to-yellow-400';
    if (s.includes('design') || s.includes('ui') || s.includes('ux')) return 'from-pink-500 to-rose-400';
    if (s.includes('speaking') || s.includes('english') || s.includes('teach')) return 'from-emerald-500 to-teal-400';
    return 'from-primary-light to-primary-dark';
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="glass-card group overflow-hidden flex flex-col h-full bg-slate-900/40"
    >
      <div className="relative h-32 bg-gradient-vibrant group-hover:bg-gradient-sunset transition-all duration-700">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          <div className="absolute -bottom-12 left-6">
             <div className="w-24 h-24 rounded-3xl bg-slate-900 p-1.5 shadow-2xl overflow-hidden group-hover:rotate-3 transition-transform duration-500">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center text-white text-4xl font-black shadow-inner relative group-hover:scale-110 transition-transform duration-500">
                   {match.profileImage ? (
                     <img src={match.profileImage} alt={match.username} className="w-full h-full object-cover" />
                   ) : (
                     match.username.charAt(0).toUpperCase()
                   )}
                   <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
             </div>
          </div>

          <div className="absolute top-4 right-6 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 group-hover:scale-110 transition-transform">
             <Star size={16} className="text-amber-400 fill-amber-400 animate-pulse" />
             <span className="text-white font-black text-sm">{match.rating?.toFixed(1) || '5.0'}</span>
          </div>

          {match.matchScore && (
            <div className="absolute top-4 left-6 bg-emeraldGreen text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-emeraldGreen/30">
               <Heart size={12} className="fill-white" /> {match.matchScore}% Match
            </div>
          )}
      </div>

      <div className="pt-16 px-6 pb-6 flex-1 flex flex-col">
        <div className="mb-6">
          <h3 className="text-2xl font-black text-white group-hover:text-primary-light transition-colors font-heading uppercase tracking-tighter">{match.username}</h3>
          <div className="flex items-center gap-2 text-primary-light text-xs font-bold uppercase tracking-widest mt-1">
             <Sparkles size={14} className="animate-spin-slow" /> {match.skillLevel} Specialist
          </div>
        </div>

        <div className="space-y-6 mb-8">
           <div className="space-y-3">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-emeraldGreen shadow-[0_0_8px_rgba(16,185,129,0.8)]" /> Teaching
              </div>
              <div className="flex flex-wrap gap-2">
                {match.skillsTeach.map(s => (
                  <span key={s} className={`bg-gradient-to-r ${getSkillColor(s)} text-white px-4 py-1.5 rounded-xl text-[11px] font-bold shadow-lg shadow-black/10 hover:scale-105 transition-transform cursor-default`}>
                    {s}
                  </span>
                ))}
              </div>
           </div>

           <div className="space-y-3">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(139,92,246,0.8)]" /> Learning
              </div>
              <div className="flex flex-wrap gap-2">
                {match.skillsLearn.map(s => (
                  <span key={s} className="bg-white/5 text-slate-300 px-4 py-1.5 rounded-xl border border-white/10 text-[11px] font-bold hover:bg-white/10 transition-colors">
                    {s}
                  </span>
                ))}
              </div>
           </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5 flex gap-4">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleRequest}
            className="flex-1 btn-vibrant btn-vibrant-purple"
          >
            Send Request
          </motion.button>
          <Link 
            to={`/chat/${match._id}`}
            className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/10 active:scale-90 shadow-xl"
          >
            <Send size={20} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchCard;
