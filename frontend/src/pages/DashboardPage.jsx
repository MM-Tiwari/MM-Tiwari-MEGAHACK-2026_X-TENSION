import { useState, useEffect } from 'react';
import { Sparkles, Trophy, TrendingUp, Zap, ChevronRight, Target, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { apiCall } from '../utils/api';
import MatchCard from '../components/MatchCard';

const DashboardPage = () => {
  const { user, token } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await apiCall('/matches', 'GET', null, token);
        setMatches(data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [token]);

  const stats = [
    { label: 'Skill Level', value: user?.skillLevel || 'Beginner', icon: Target, color: 'purple' },
    { label: 'Sessions', value: user?.completedSessions || 0, icon: Flame, color: 'orange' },
    { label: 'Avg Rating', value: `★ ${user?.rating?.toFixed(1) || '5.0'}`, icon: Trophy, color: 'emerald' },
  ];

  const leaderboard = [
    { rank: 1, name: 'Alex Johnson', skills: 'React, Python', sessions: 142, rating: '5.0', color: 'bg-gradient-to-r from-yellow-300 to-amber-500', glow: 'shadow-[0_0_30px_rgba(252,211,77,0.4)]' },
    { rank: 2, name: 'Sarah Wu', skills: 'UX Design, Figma', sessions: 98, rating: '4.9', color: 'bg-slate-300', glow: 'shadow-[0_0_20px_rgba(203,213,225,0.3)]' },
    { rank: 3, name: 'Michael Chen', skills: 'Guitar, Vocals', sessions: 85, rating: '4.9', color: 'bg-amber-700', glow: 'shadow-[0_0_20px_rgba(180,83,9,0.3)]' },
    { rank: 4, name: 'Emma Davis', skills: 'Spanish, French', sessions: 76, rating: '4.8', color: 'bg-white/5', glow: '' },
    { rank: 5, name: 'You', skills: user?.skillsTeach?.[0] || 'Learning', sessions: user?.completedSessions || 0, rating: user?.rating?.toFixed(1) || 'N/A', color: 'bg-primary/20 border border-primary/50 text-primary-light', glow: 'shadow-inner' },
  ];

  return (
    <div className="space-y-12 pb-10">
      {/* Hero Welcome */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[3rem] bg-gradient-vibrant p-8 md:p-16 shadow-2xl shadow-primary/20"
      >
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>
        <div className="relative z-10 max-w-3xl">
          <motion.div 
             initial={{ scale: 0.8 }}
             animate={{ scale: 1 }}
             className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl px-5 py-2 rounded-full text-white text-xs font-black mb-8 border border-white/20 tracking-widest uppercase"
          >
             <Trophy size={14} className="text-yellow-300" /> Top Rated Community
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] font-heading">
            Welcome back,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-emeraldGreen decoration-8 underline decoration-white/20">
              {user?.username}!
            </span>
          </h1>
          
          <p className="text-white/80 mt-8 text-xl font-medium max-w-xl leading-relaxed">
            You've got <span className="text-white font-black bg-white/10 px-3 py-1 rounded-lg">{user?.credits} Credits</span> ready to ignite. 
            What are we mastering today?
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button className="btn-vibrant bg-white text-primary font-black px-8 py-4 rounded-2xl hover:bg-opacity-90 transition-all flex items-center gap-3">
               Start Swapping <Zap size={20} className="fill-current" />
            </button>
            <button className="btn-vibrant bg-white/10 text-white border border-white/20 backdrop-blur-md px-8 py-4 rounded-2xl hover:bg-white/20 transition-all">
               View My Progress
            </button>
          </div>
        </div>
        
        {/* Animated Orbs */}
        <div className="absolute right-[-10%] top-[-10%] w-80 h-80 bg-neonBlue/30 rounded-full blur-[100px] animate-blob" />
        <div className="absolute right-[10%] bottom-[-20%] w-96 h-96 bg-emeraldGreen/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />
      </motion.section>

      {/* Recommended Matches */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div className="space-y-2">
             <div className="flex items-center gap-2 text-primary uppercase font-black tracking-[0.3em] text-[10px]">
                <Sparkles size={12} /> Personalized for you
             </div>
             <h2 className="text-4xl font-black text-white font-heading">Recommended Partners</h2>
          </div>
          <button className="text-slate-400 hover:text-white transition-all text-sm font-black flex items-center gap-2 group mb-1">
             EXPLORE ALL <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1,2,3].map(n => (
               <div key={n} className="h-96 rounded-[2.5rem] bg-slate-800/50 backdrop-blur-3xl animate-pulse border border-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-vibrant opacity-5 blur-3xl animate-blob"></div>
                  <div className="absolute top-6 left-6 w-14 h-14 bg-white/5 rounded-2xl"></div>
                  <div className="absolute top-8 left-24 w-28 h-5 bg-white/5 rounded-full"></div>
                  <div className="absolute top-16 left-24 w-16 h-3 bg-white/5 rounded-full"></div>
                  <div className="absolute bottom-6 left-6 right-6 h-12 bg-white/5 rounded-xl"></div>
               </div>
             ))}
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matches.map((m, i) => (
              <motion.div
                key={m._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <MatchCard match={m} currentUser={user} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div 
               key={stat.label}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.4 + (i * 0.1) }}
               className="glass-card p-8 group relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br transition-opacity opacity-10 group-hover:opacity-20 ${
                stat.color === 'purple' ? 'from-primary-light to-transparent' :
                stat.color === 'orange' ? 'from-sunsetOrange to-transparent' :
                'from-emeraldGreen to-transparent'
              }`} />
              
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <p className="text-slate-400 uppercase font-black tracking-widest text-xs">{stat.label}</p>
                  <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                </div>
                <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500 ${
                  stat.color === 'purple' ? 'text-primary-light' :
                  stat.color === 'orange' ? 'text-sunsetOrange' :
                  'text-emeraldGreen'
                }`}>
                  <stat.icon size={28} />
                </div>
              </div>
              
              <div className="mt-6 w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '70%' }}
                    transition={{ duration: 1, delay: 0.8 + (i * 0.2) }}
                    className={`h-full bg-gradient-to-r rounded-full ${
                      stat.color === 'purple' ? 'from-primary to-neonBlue' :
                      stat.color === 'orange' ? 'from-sunsetOrange to-pinkAccent' :
                      'from-emeraldGreen to-neonBlue'
                    }`}
                 />
              </div>
            </motion.div>
          ))}
      </section>

      {/* Trending Section */}
      <section className="glass-panel rounded-[3rem] p-10 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-rose-400 bg-rose-400/10 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                 <TrendingUp size={14} /> Trending Skills
              </div>
              <h2 className="text-4xl font-black text-white font-heading">Global Hot Skills</h2>
              <p className="text-slate-400 max-w-md font-medium">Join thousands of others mastering these top-requested skills this week.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 max-w-xl">
               {['React JS', 'UX Design', 'Public Speaking', 'Machine Learning', 'Photography', 'Italian'].map((s, i) => (
                 <motion.div 
                    key={s}
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-white font-black text-sm hover:bg-white/10 transition-colors shadow-xl"
                 >
                   #{s}
                 </motion.div>
               ))}
            </div>
          </div>
          <div className="absolute left-[-5%] bottom-[-20%] w-64 h-64 bg-pinkAccent/10 rounded-full blur-[80px]" />
      </section>

      {/* Leaderboard Section */}
      <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 pb-10">
        <div className="flex items-center gap-3 mb-8">
           <div className="p-3 bg-indigo-600/20 rounded-2xl border border-indigo-500/20 shadow-[0_0_30px_rgba(79,70,229,0.3)]">
              <Trophy size={28} className="text-indigo-400" />
           </div>
           <div>
              <h2 className="text-4xl font-black text-white font-heading uppercase tracking-tighter">Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonBlue to-primary">Leaderboard</span></h2>
              <p className="text-slate-500 font-medium text-sm mt-1">Top skill swappers this month.</p>
           </div>
        </div>

        <div className="glass-panel rounded-[2rem] overflow-hidden border-white/5 bg-slate-900/50 backdrop-blur-2xl">
          {leaderboard.map((user, i) => (
             <motion.div 
                key={user.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center justify-between p-5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group ${user.rank === 5 ? 'bg-primary/5 relative overflow-hidden' : ''}`}
             >
                {user.rank === 5 && <div className="absolute inset-0 bg-gradient-vibrant opacity-5 blur-xl" />}
                
                <div className="flex items-center gap-5 relative z-10">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${user.glow} ${user.color.includes('bg-') ? user.color : 'text-slate-400 font-black'}`}>
                      {user.rank <= 3 ? <span className="drop-shadow-md text-white">#{user.rank}</span> : `#${user.rank}`}
                   </div>
                   <div>
                       <h4 className="font-black text-white tracking-tight uppercase group-hover:text-primary-light transition-colors flex items-center gap-2">
                           {user.name}
                           {user.rank === 1 && <Sparkles size={14} className="text-yellow-400/80 animate-pulse" />}
                       </h4>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                           Top Skills: <span className="text-emerald-400">{user.skills}</span>
                       </p>
                   </div>
                </div>

                <div className="flex gap-6 relative z-10 text-right">
                   <div className="hidden sm:block">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Sessions</p>
                      <p className="text-white font-black">{user.sessions}</p>
                   </div>
                   <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Rating</p>
                      <div className="flex items-center gap-1 font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md text-sm border border-amber-400/20">
                         ★ {user.rating}
                      </div>
                   </div>
                </div>
             </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
