import { useState, useEffect } from 'react';
import { Search, Filter, Sparkles, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { apiCall } from '../utils/api';
import MatchCard from '../components/MatchCard';

const MatchesPage = () => {
  const { user, token } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await apiCall('/matches', 'GET', null, token);
        setMatches(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [token]);

  const filteredMatches = matches.filter(m => 
    m.username.toLowerCase().includes(query.toLowerCase()) ||
    m.skillsTeach.some(s => s.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary font-black tracking-widest text-xs uppercase">
             <div className="w-8 h-[2px] bg-primary"></div> Community
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white font-heading tracking-tight">Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-electricPurple via-neonBlue to-emeraldGreen">Partner</span></h1>
          <p className="text-slate-400 font-medium text-lg">Browse through hundreds of experts ready to swap skills.</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
           <div className="relative group flex-1 md:flex-none">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors duration-300" size={20} />
              <input 
                type="text" 
                placeholder="Search skills, users..."
                className="bg-white/5 border border-white/10 rounded-[1.5rem] pl-14 pr-6 py-4 text-white focus:outline-none focus:border-primary/50 w-full md:w-96 transition-all font-bold backdrop-blur-xl shadow-2xl"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
           </div>
           <button className="bg-white/5 border border-white/10 p-4 rounded-[1.5rem] text-slate-400 hover:text-white transition-all hover:bg-white/10 shadow-xl">
              <SlidersHorizontal size={24} />
           </button>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
           {[1,2,3,4,5,6].map(n => (
             <div key={n} className="h-[450px] bg-slate-800/50 backdrop-blur-3xl rounded-[3rem] animate-pulse border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-vibrant opacity-5 blur-3xl animate-blob"></div>
                <div className="absolute top-8 left-8 w-16 h-16 bg-white/5 rounded-2xl"></div>
                <div className="absolute top-10 left-32 w-32 h-6 bg-white/5 rounded-full"></div>
                <div className="absolute top-18 left-32 w-20 h-4 bg-white/5 rounded-full"></div>
                <div className="absolute bottom-10 left-8 right-8 h-14 bg-white/5 rounded-2xl"></div>
             </div>
           ))}
        </div>
      ) : (
        <div className="space-y-10">
          {filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredMatches.map((m, i) => (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <MatchCard match={m} currentUser={user} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-40 glass-panel rounded-[4rem] border-white/5"
            >
               <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Sparkles size={48} className="text-slate-700" />
               </div>
               <h3 className="text-3xl font-black text-white font-heading uppercase tracking-widest">No partners found</h3>
               <p className="text-slate-500 font-medium mt-4 text-lg">Try searching for a broader skill or interest!</p>
               <button 
                 onClick={() => setQuery('')}
                 className="mt-10 btn-vibrant btn-vibrant-purple w-48 mx-auto"
               >
                 Clear Search
               </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchesPage;
