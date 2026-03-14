import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Clock, MessageSquare, UserCircle, LogOut, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ user, logout }) => {
  const location = useLocation();

  if (!user) return null;

  const NavItem = ({ to, icon: Icon, label, color = 'primary' }) => {
    const isActive = location.pathname === to;
    
    return (
      <Link to={to} className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative group`}>
        <motion.div
           whileHover={{ y: -4 }}
           whileTap={{ scale: 0.9 }}
           className={`relative z-10 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}
        >
          <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
        </motion.div>
        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-white' : 'text-slate-500'}`}>{label}</span>
        
        {isActive && (
          <motion.div 
            layoutId="nav-pill"
            className={`absolute -inset-x-4 -inset-y-2 bg-gradient-to-r ${
              color === 'emerald' ? 'from-emeraldGreen/20 to-neonBlue/20' : 
              color === 'sunset' ? 'from-sunsetOrange/20 to-pinkAccent/20' :
              'from-electricPurple/20 to-neonBlue/20'
            } rounded-2xl blur-sm -z-0`}
          />
        )}
        {isActive && (
          <motion.div 
            layoutId="nav-line"
            className={`absolute -bottom-2 w-6 h-1 rounded-full bg-gradient-to-r ${
              color === 'emerald' ? 'from-emeraldGreen to-neonBlue' : 
              color === 'sunset' ? 'from-sunsetOrange to-pinkAccent' :
              'from-electricPurple to-neonBlue'
            } shadow-[0_0_15px_rgba(139,92,246,0.5)]`}
          />
        )}
      </Link>
    );
  };

  return (
    <>
      <nav className="sticky top-6 mx-auto z-50 px-8 py-3 flex justify-between items-center md:mb-10 max-w-5xl rounded-3xl glass-panel animate-in fade-in slide-in-from-top-4 duration-700">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-vibrant rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:rotate-12 transition-transform duration-500">
            <Sparkles className="text-white" size={22} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white uppercase italic font-heading">
            Skill<span className="text-electricPurple">Swap</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Home" />
          <NavItem to="/oracle" icon={Zap} label="Oracle" color="emerald" />
          <NavItem to="/matches" icon={Users} label="Partners" />
          <NavItem to="/requests" icon={Clock} label="Inbox" />
          <NavItem to="/chat/all" icon={MessageSquare} label="Chat" />
          <NavItem to="/profile" icon={UserCircle} label="Me" />
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-2xl flex items-center gap-3 group hover:border-emeraldGreen/40 transition-all duration-500">
            <span className="text-slate-400 font-black text-[10px] tracking-widest uppercase">Credits</span>
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="bg-gradient-lush text-white font-black text-xs px-3 py-1 rounded-xl shadow-lg shadow-emeraldGreen/20"
            >
               {user.credits}
            </motion.div>
          </div>
          <button onClick={logout} className="p-2.5 text-slate-400 hover:text-pinkAccent hover:bg-pinkAccent/10 rounded-xl transition-all duration-300">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <div className="md:hidden fixed bottom-6 left-6 right-6 glass-panel px-6 py-4 flex justify-between items-center z-50 rounded-[2rem] shadow-2xl">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Home" />
          <NavItem to="/oracle" icon={Zap} label="Match" color="emerald" />
          <NavItem to="/requests" icon={Clock} label="Inbox" />
          <NavItem to="/chat/all" icon={MessageSquare} label="Chat" />
          <NavItem to="/profile" icon={UserCircle} label="Profile" />
      </div>
    </>
  );
};

export default Navbar;
