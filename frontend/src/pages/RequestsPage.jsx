import { useState, useEffect } from 'react';
import { Clock, CheckCircle, Calendar, Inbox, Send, Zap, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { apiCall } from '../utils/api';

const statusConfig = {
  pending:   { label: 'Pending',   bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/20'  },
  accepted:  { label: 'Accepted',  bg: 'bg-primary/10',    text: 'text-primary-light', border: 'border-primary/20' },
  scheduled: { label: 'Scheduled', bg: 'bg-neonBlue/10',   text: 'text-neonBlue',   border: 'border-neonBlue/20'  },
  completed: { label: 'Done',      bg: 'bg-emeraldGreen/10', text: 'text-emeraldGreen', border: 'border-emeraldGreen/20' },
};

const AvatarBubble = ({ name, gradient }) => (
  <div className="relative flex-shrink-0">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-xl`} style={{ background: gradient }}>
      {name?.charAt(0).toUpperCase()}
    </div>
  </div>
);

const gradients = [
  'linear-gradient(135deg,#9d50bb,#6e48aa)',
  'linear-gradient(135deg,#10b981,#059669)',
  'linear-gradient(135deg,#2196f3,#1565c0)',
  'linear-gradient(135deg,#f59e0b,#d97706)',
  'linear-gradient(135deg,#dd2476,#9d50bb)',
];

const RequestsPage = () => {
  const { user, token, updateCredits } = useAuth();
  const [received, setReceived] = useState([]);
  const [sent, setSent]         = useState([]);
  const [loading, setLoading]   = useState(true);

  const fetchRequests = async () => {
    try {
      const data = await apiCall('/requests', 'GET', null, token);
      setReceived(data.received || []);
      setSent(data.sent || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, [token]);

  const updateStatus = async (id, status, scheduledDate = null) => {
    try {
      await apiCall(`/requests/${id}/status`, 'POST', { status, scheduledDate }, token);
      if (status === 'completed') updateCredits(user.credits + 2);
      fetchRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
        <Zap size={40} className="text-primary-light" />
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-16 max-w-5xl mx-auto py-6">

      {/* ── Incoming ── */}
      <section>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-5 mb-10">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl" style={{ background: 'linear-gradient(135deg,#9d50bb,#dd2476)' }}>
            <Inbox size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase font-heading">Incoming</h2>
            <p className="text-slate-400 font-medium">Approve sessions &amp; earn credits</p>
          </div>
          {received.length > 0 && (
            <span className="ml-auto text-xs font-black px-4 py-2 rounded-full bg-primary/10 text-primary-light border border-primary/20 uppercase tracking-widest">
              {received.length} pending
            </span>
          )}
        </motion.div>

        {received.length === 0 ? (
          <div className="glass-panel p-20 rounded-[3rem] text-center border-dashed border-2 border-white/5 bg-transparent flex flex-col items-center gap-4">
            <Clock size={48} className="text-slate-700" />
            <p className="text-slate-600 font-black uppercase tracking-widest">No pending requests yet</p>
            <p className="text-slate-700 text-sm">When someone requests your skills, it'll appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {received.map((req, i) => {
                const cfg = statusConfig[req.status] || statusConfig.pending;
                return (
                  <motion.div
                    key={req._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-panel p-6 rounded-[2rem] border-white/10 flex items-center gap-5 hover:border-white/20 transition-all group"
                  >
                    <AvatarBubble name={req.sender?.username} gradient={gradients[i % gradients.length]} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h4 className="font-black text-white uppercase tracking-tight group-hover:text-primary-light transition-colors">{req.sender?.username}</h4>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>{cfg.label}</span>
                      </div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                        Skill requested: <span className="text-emeraldGreen">{req.skillRequested}</span>
                      </p>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      {req.status === 'pending' && (
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => updateStatus(req._id, 'accepted')}
                          className="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest text-white shadow-lg transition-all"
                          style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 8px 20px -6px rgba(16,185,129,0.4)' }}>
                          Accept
                        </motion.button>
                      )}
                      {req.status === 'accepted' && (
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => updateStatus(req._id, 'scheduled', new Date())}
                          className="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest text-white shadow-lg transition-all"
                          style={{ background: 'linear-gradient(135deg,#2196f3,#1565c0)', boxShadow: '0 8px 20px -6px rgba(33,150,243,0.4)' }}>
                          Schedule
                        </motion.button>
                      )}
                      {req.status === 'scheduled' && (
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => updateStatus(req._id, 'completed')}
                          className="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest text-white shadow-lg transition-all"
                          style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', boxShadow: '0 8px 20px -6px rgba(245,158,11,0.4)' }}>
                          Mark Done
                        </motion.button>
                      )}
                      {req.status === 'completed' && (
                        <div className="w-10 h-10 rounded-xl bg-emeraldGreen/10 flex items-center justify-center border border-emeraldGreen/20">
                          <CheckCircle className="text-emeraldGreen" size={20} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* ── Sent ── */}
      <section>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-5 mb-10">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10">
            <Send size={24} className="text-slate-400" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase font-heading opacity-70">Sent Requests</h2>
            <p className="text-slate-500 font-medium text-sm">Track your outgoing skill asks</p>
          </div>
        </motion.div>

        {sent.length === 0 ? (
          <div className="glass-panel p-12 rounded-[3rem] text-center border-dashed border-2 border-white/5 bg-transparent text-slate-600 font-black uppercase tracking-widest text-sm">
            No sent requests yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {sent.map((req, i) => {
              const cfg = statusConfig[req.status] || statusConfig.pending;
              return (
                <motion.div
                  key={req._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-panel p-6 rounded-[2rem] border-white/10 flex flex-col gap-4 hover:border-white/20 hover:-translate-y-1 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl font-black text-white text-base flex items-center justify-center shadow-lg" style={{ background: gradients[i % gradients.length] }}>
                        {req.receiver?.username?.charAt(0).toUpperCase()}
                      </div>
                      <h4 className="font-black text-white text-sm uppercase tracking-tight group-hover:text-primary-light transition-colors">{req.receiver?.username}</h4>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>{cfg.label}</span>
                  </div>

                  <div className="text-[11px] text-slate-500 font-bold uppercase tracking-widest bg-white/5 rounded-xl px-4 py-2.5">
                    SKILL: <span className="text-white">{req.skillRequested}</span>
                  </div>

                  {req.status === 'scheduled' && (
                    <div className="flex items-center gap-2 text-primary-light text-xs font-black uppercase tracking-widest">
                      <Calendar size={14} />
                      Awaiting Session
                      <ArrowRight size={14} className="ml-auto opacity-40" />
                    </div>
                  )}
                  {req.status === 'completed' && (
                    <div className="flex items-center gap-2 text-emeraldGreen text-xs font-black uppercase tracking-widest">
                      <CheckCircle size={14} />
                      Session Complete · +2 credits
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default RequestsPage;
