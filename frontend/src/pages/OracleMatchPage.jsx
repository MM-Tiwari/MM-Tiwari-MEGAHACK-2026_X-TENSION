import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Sparkles, Zap, Star, ShieldCheck, Heart, X, Info, MapPin, Clock, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiCall } from '../utils/api';

const OracleCard = ({ match, onSwipe, onLike, onSkip }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const skipOpacity = useTransform(x, [-50, -150], [0, 1]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
        onLike();
    } else if (info.offset.x < -100) {
        onSkip();
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
    >
      <div className="glass-panel h-full rounded-[4rem] border-white/5 overflow-hidden flex flex-col bg-slate-950/40 shadow-2xl relative">
        <motion.div style={{ opacity: likeOpacity }} className="absolute top-12 left-12 z-50 border-8 border-emeraldGreen text-emeraldGreen px-8 py-3 rounded-2xl font-black text-6xl uppercase -rotate-12 pointer-events-none shadow-[0_0_30px_rgba(16,185,129,0.5)]">
            LIKE
        </motion.div>
        <motion.div style={{ opacity: skipOpacity }} className="absolute top-12 right-12 z-50 border-8 border-rose-500 text-rose-500 px-8 py-3 rounded-2xl font-black text-6xl uppercase rotate-12 pointer-events-none shadow-[0_0_30px_rgba(244,63,94,0.5)]">
            SKIP
        </motion.div>

        <div className="relative h-[55%] bg-gradient-vibrant">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="absolute top-10 right-10 flex flex-col items-center">
             <div className="relative group">
                <div className="absolute inset-0 bg-emeraldGreen blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative bg-slate-950/60 backdrop-blur-2xl px-6 py-4 rounded-3xl border border-white/20 flex flex-col items-center gap-1">
                   <div className="text-[10px] font-black text-emeraldGreen uppercase tracking-widest">Compatibility</div>
                   <div className="text-4xl font-black text-white flex items-baseline gap-1">
                      {match.compatibilityScore}<span className="text-sm font-bold opacity-60">%</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="absolute bottom-10 left-10 right-10">
             <div className="flex items-end gap-6">
                <div className="relative group">
                   <div className="absolute inset-0 bg-primary blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                   <div className="relative w-32 h-32 rounded-[2.5rem] bg-slate-950 p-1.5 shadow-3xl">
                      <div className="w-full h-full rounded-[2rem] bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center text-white text-5xl font-black shadow-inner overflow-hidden">
                         {match.profileImage ? (
                           <img src={match.profileImage} alt={match.username} className="w-full h-full object-cover" />
                         ) : (
                           match.username.charAt(0).toUpperCase()
                         )}
                      </div>
                   </div>
                </div>
                <div className="space-y-1 mb-2">
                   <div className="inline-flex items-center gap-2 bg-emeraldGreen/20 text-emeraldGreen px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 border border-emeraldGreen/20">
                      <Award size={12} /> Expert verified
                   </div>
                   <h3 className="text-5xl font-black text-white tracking-tighter uppercase font-heading">{match.username}, {match.age || '25'}</h3>
                   <div className="flex items-center gap-2 text-primary-light text-sm font-bold uppercase tracking-widest">
                      <MapPin size={16} /> {match.location}
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="p-12 flex-1 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
             <div className="space-y-4">
                <div className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emeraldGreen" /> Wants to Teach
                </div>
                <div className="flex flex-wrap gap-2">
                   {match.skillsTeach.map(s => (
                     <span key={s} className="bg-gradient-lush text-white px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-emeraldGreen/20">
                        {s}
                     </span>
                   ))}
                </div>
             </div>
             <div className="space-y-4">
                <div className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-primary" /> Ready to Learn
                </div>
                <div className="flex flex-wrap gap-2">
                   {match.skillsLearn.map(s => (
                     <span key={s} className="bg-white/5 text-slate-300 px-5 py-2 rounded-2xl border border-white/10 text-xs font-black uppercase tracking-wider">
                        {s}
                     </span>
                   ))}
                </div>
             </div>
          </div>

          <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/10 space-y-4 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
             <div className="relative z-10 text-[11px] font-black text-primary-light uppercase tracking-[0.2em]">Oracle Insights</div>
             <div className="relative z-10 flex flex-wrap gap-x-8 gap-y-3">
                {match.matchExplanations.map((exp, i) => (
                   <div key={i} className="flex items-center gap-3 text-slate-200 text-sm font-medium">
                      <Heart size={14} className="text-rose-400 fill-rose-400/20" /> {exp}
                   </div>
                ))}
             </div>
          </div>
          
          <div className="mt-auto flex items-center justify-between text-slate-400 text-xs font-black uppercase tracking-widest pt-8">
             <div className="flex items-center gap-2">
                <Clock size={16} className="text-primary-light" /> {match.availability}
             </div>
             <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                <Star size={16} className="text-amber-400 fill-amber-400" /> {match.rating} COMMUNITY RATING
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const OracleMatchPage = () => {
  const [matches, setMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    fetchOracleMatches();
  }, [token]);

  const fetchOracleMatches = async () => {
    try {
      const data = await apiCall('/oracle-matches', 'GET', null, token);
      setMatches(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (match) => {
    try {
      await apiCall('/requests', 'POST', { 
        receiverId: match._id, 
        skillRequested: match.skillsTeach[0] 
      }, token);
      
      // Trigger Celebration
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        setCurrentIndex(prev => prev + 1);
      }, 1500);

    } catch (err) {
      alert(err.message);
    }
  };

  const currentMatch = matches[currentIndex];

  if (loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center">
       <motion.div 
         animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
         transition={{ repeat: Infinity, duration: 4 }}
         className="w-32 h-32 bg-gradient-vibrant rounded-[2.5rem] blur-xl absolute opacity-40"
       />
       <Sparkles className="text-white animate-pulse mb-8 relative z-10" size={64} />
       <p className="text-white font-black uppercase tracking-[0.4em] animate-pulse">Consulting Oracle...</p>
    </div>
  );

  if (currentIndex >= matches.length) return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-[80vh] flex flex-col items-center justify-center text-center"
    >
       <div className="w-32 h-32 bg-gradient-lush rounded-[3rem] flex items-center justify-center mb-10 shadow-[0_20px_40px_rgba(16,185,129,0.3)]">
          <ShieldCheck size={64} className="text-white" strokeWidth={2.5} />
       </div>
       <h2 className="text-5xl font-black text-white font-heading tracking-tight">You've reached the end!</h2>
       <p className="text-slate-400 font-medium mt-4 max-w-md text-lg leading-relaxed">The Oracle is resting. Come back later for more AI-powered skill partners tailored to your growth.</p>
       <button onClick={() => setCurrentIndex(0)} className="mt-12 btn-vibrant btn-vibrant-purple px-12">Re-discover</button>
    </motion.div>
  );

  return (
    <div className="h-[90vh] flex flex-col items-center justify-center pt-10">
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <div className="bg-gradient-vibrant p-2 rounded-[4rem]">
               <div className="bg-slate-950 px-12 py-10 rounded-[3.8rem] flex flex-col items-center gap-6 shadow-2xl border border-white/10">
                  <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  >
                     <Heart size={80} className="text-rose-500 fill-rose-500" />
                  </motion.div>
                  <h2 className="text-5xl font-black text-white font-heading tracking-widest uppercase italic">Match!</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Request sent to {currentMatch.username}</p>
               </div>
            </div>
            {/* Particle simulation with Framer Motion */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{ 
                  x: (Math.random() - 0.5) * 800, 
                  y: (Math.random() - 0.5) * 800,
                  opacity: 0,
                  rotate: Math.random() * 360
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`absolute w-4 h-4 rounded-sm ${['bg-primary', 'bg-emeraldGreen', 'bg-pinkAccent', 'bg-neonBlue'][i % 4]}`}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-2xl h-[85%] pb-20">
        <AnimatePresence mode="popLayout">
          {!showCelebration && (
            <OracleCard 
              key={currentMatch._id}
              match={currentMatch}
              onLike={() => handleLike(currentMatch)}
              onSkip={() => setCurrentIndex(prev => prev + 1)}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-12 mt-8 pb-10">
         <motion.button 
           whileHover={{ scale: 1.1, rotate: -10 }}
           whileTap={{ scale: 0.9 }}
           onClick={() => setCurrentIndex(prev => prev + 1)}
           disabled={showCelebration}
           className="w-24 h-24 rounded-[2rem] bg-white/5 border-4 border-white/10 flex items-center justify-center text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/40 transition-all shadow-3xl group disabled:opacity-50"
         >
            <X size={44} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
         </motion.button>
         
         <motion.button 
           whileHover={{ scale: 1.1 }}
           whileTap={{ scale: 0.9 }}
           disabled={showCelebration}
           className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-primary-light hover:bg-primary/10 transition-all shadow-2xl disabled:opacity-50"
         >
            <Info size={28} strokeWidth={2.5} />
         </motion.button>
         
         <motion.button 
           whileHover={{ scale: 1.1, rotate: 10 }}
           whileTap={{ scale: 0.9 }}
           onClick={() => handleLike(currentMatch)}
           disabled={showCelebration}
           className="w-24 h-24 rounded-[2rem] bg-gradient-lush flex items-center justify-center text-white shadow-[0_20px_40px_rgba(16,185,129,0.4)] group disabled:opacity-50"
         >
            <Heart size={44} strokeWidth={3} className="fill-white group-hover:scale-110 transition-transform" />
         </motion.button>
      </div>
    </div>
  );
};

export default OracleMatchPage;
