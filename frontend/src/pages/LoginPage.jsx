import { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { apiCall } from '../utils/api';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isLogin ? '/auth/login' : '/auth/signup';
    
    try {
      const data = await apiCall(endpoint, 'POST', { username, email, password });
      login(data, data.token);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] relative py-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute -z-10 w-[500px] h-[500px] bg-gradient-vibrant rounded-full blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-12 flex flex-col items-center"
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="w-20 h-20 bg-gradient-vibrant rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/40 mb-6 p-0.5"
        >
            <div className="w-full h-full bg-slate-950 rounded-[1.4rem] flex items-center justify-center">
              <Sparkles className="text-white" size={36} strokeWidth={2.5} />
            </div>
        </motion.div>
        <h1 className="text-5xl font-black tracking-tighter text-white font-heading uppercase italic">
          Skill<span className="text-electricPurple">Swap</span>
        </h1>
        <p className="text-slate-400 mt-3 font-medium text-lg uppercase tracking-widest text-center px-6">Empower your journey<br/>through collaborative learning</p>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel w-full max-w-md p-10 rounded-[3rem] border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]"
      >
        <h2 className="text-3xl font-black text-white mb-10 font-heading">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-14 py-4 text-white focus:outline-none focus:border-primary/50 transition-all font-bold placeholder:text-slate-600 shadow-inner"
                placeholder="Username"
                value={username} onChange={e => setUsername(e.target.value)} 
              />
            </div>

            {!isLogin && (
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emeraldGreen transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-14 py-4 text-white focus:outline-none focus:border-emeraldGreen/50 transition-all font-bold placeholder:text-slate-600 shadow-inner"
                  placeholder="Email Address"
                  value={email} onChange={e => setEmail(e.target.value)} 
                />
              </div>
            )}

            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-14 py-4 text-white focus:outline-none focus:border-primary/50 transition-all font-bold placeholder:text-slate-600 shadow-inner"
                placeholder="Password"
                value={password} onChange={e => setPassword(e.target.value)} 
              />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="w-full btn-vibrant btn-vibrant-purple py-5 rounded-2xl text-lg"
          >
            {loading ? 'Processing...' : (isLogin ? <><LogIn size={22} className="stroke-[3]" /> Login</> : <><UserPlus size={22} className="stroke-[3]" /> Sign Up</>)}
          </motion.button>
        </form>

        <div className="mt-10 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-slate-500 font-black uppercase tracking-widest text-xs hover:text-white transition-colors"
          >
            {isLogin ? "New to the platform? Join now" : 'Already a member? Sign in'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
