import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Send, ChevronLeft, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { apiCall } from '../utils/api';

const ChatPage = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [isPartnerOnline, setIsPartnerOnline] = useState(false);
  const socketRef = useRef();
  const scrollRef = useRef();
  const typingTimeoutRef = useRef();

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('join', user._id || user.id);

    socketRef.current.on('receiveMessage', (msg) => {
      if (msg.sender === id || msg.receiver === id) setMessages(prev => [...prev, msg]);
    });
    socketRef.current.on('messageSent', (msg) => {
      if (msg.receiver === id) setMessages(prev => [...prev, msg]);
    });
    socketRef.current.on('displayTyping', (data) => {
      if (data.userId === id) setIsPartnerTyping(data.isTyping);
    });
    socketRef.current.on('userStatusChange', (data) => {
      if (data.userId === id) setIsPartnerOnline(data.status === 'online');
    });

    const fetchHistory = async () => {
      if (id === 'all') return;
      try {
        const data = await apiCall(`/chat/${id}`, 'GET', null, token);
        setMessages(data);
        const partners = await apiCall('/oracle-matches', 'GET', null, token);
        const current = partners.find(p => p._id === id);
        if (current) setIsPartnerOnline(current.onlineStatus);
      } catch (err) { console.error(err); }
    };
    fetchHistory();
    return () => socketRef.current.disconnect();
  }, [id, user._id, user.id, token]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPartnerTyping]);

  const handleInputChange = (e) => {
    setText(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      socketRef.current.emit('typing', { senderId: user._id || user.id, receiverId: id, isTyping: true });
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketRef.current.emit('typing', { senderId: user._id || user.id, receiverId: id, isTyping: false });
    }, 2000);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || id === 'all') return;
    socketRef.current.emit('sendMessage', { sender: user._id || user.id, receiver: id, message: text });
    setText('');
    setIsTyping(false);
    socketRef.current.emit('typing', { senderId: user._id || user.id, receiverId: id, isTyping: false });
  };

  // ── Empty State ──────────────────────────────────────────────────
  if (id === 'all') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-[70vh] glass-panel rounded-[3rem] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emeraldGreen/5" />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="relative z-10 w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl"
          style={{ background: 'linear-gradient(135deg,#9d50bb,#2196f3)' }}
        >
          <MessageSquare size={48} className="text-white" />
        </motion.div>
        <h2 className="relative z-10 text-3xl font-black text-white tracking-tighter uppercase font-heading">Messages</h2>
        <p className="relative z-10 text-slate-400 font-medium mt-3 max-w-xs text-center leading-relaxed">
          Select a partner from your{' '}
          <Link to="/matches" className="text-primary-light font-black hover:underline">
            Oracle Matches
          </Link>{' '}
          to start a skill session.
        </p>
      </motion.div>
    );
  }

  // ── Chat View ────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto h-[84vh] flex flex-col glass-panel rounded-[2.5rem] overflow-hidden border-white/10 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.7)]">

      {/* Header */}
      <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/requests" className="p-2 hover:bg-white/10 rounded-xl text-slate-400 transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-xl" style={{ background: 'linear-gradient(135deg,#9d50bb,#2196f3)' }}>
              {id.charAt(0).toUpperCase()}
            </div>
            <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${isPartnerOnline ? 'bg-emeraldGreen' : 'bg-slate-600'}`} />
          </div>
          <div>
            <h3 className="font-black text-white tracking-widest uppercase text-sm">Session Partner</h3>
            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isPartnerOnline ? 'text-emeraldGreen' : 'text-slate-500'}`}>
              {isPartnerOnline ? '● Online Now' : '○ Offline'}
            </span>
          </div>
        </div>

        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Sparkles size={18} className="text-amber-400" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => {
            const isMine = (m.sender?._id || m.sender) === (user._id || user.id);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[72%] px-5 py-3 shadow-xl rounded-2xl ${
                    isMine
                      ? 'rounded-tr-sm text-white'
                      : 'rounded-tl-sm bg-white/5 border border-white/10 text-slate-100'
                  }`}
                  style={isMine ? { background: 'linear-gradient(135deg,#9d50bb 0%,#2196f3 100%)' } : {}}
                >
                  <p className="text-sm font-medium leading-relaxed">{m.message}</p>
                  <div className={`text-[9px] mt-1.5 font-bold uppercase tracking-widest opacity-50 ${isMine ? 'text-right' : 'text-left'}`}>
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing indicator */}
        {isPartnerTyping && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-start">
            <div className="bg-white/5 border border-white/10 text-slate-400 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
              {[0, 150, 300].map(delay => (
                <div key={delay} className="w-1.5 h-1.5 bg-primary-light rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
              ))}
              <span className="text-[10px] font-black uppercase tracking-widest ml-2 text-slate-500">typing</span>
            </div>
          </motion.div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-6 border-t border-white/5 bg-white/5 backdrop-blur-xl flex gap-3 flex-shrink-0">
        <input
          type="text"
          value={text}
          onChange={handleInputChange}
          placeholder="Share an idea or ask a question..."
          className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all shadow-inner"
        />
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          type="submit"
          className="w-14 h-14 flex items-center justify-center rounded-2xl text-white shadow-xl flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#9d50bb,#2196f3)', boxShadow: '0 10px 25px -8px rgba(157,80,187,0.5)' }}
        >
          <Send size={20} className="translate-x-[1px]" />
        </motion.button>
      </form>
    </div>
  );
};

export default ChatPage;
