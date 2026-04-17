import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBasket, 
  RotateCcw, 
  Trophy, 
  Target, 
  Zap, 
  CheckCircle2, 
  XCircle,
  Hash,
  ChevronRight,
  Sparkles
} from 'lucide-react';

// --- Numbers Data ---
const NUMBERS_DATA = [
  { num: 15, word: "Quince" },
  { num: 21, word: "Veintiuno" },
  { num: 500, word: "Quinientos" },
  { num: 100, word: "Cien" },
  { num: 101, word: "Ciento uno" },
  { num: 16, word: "Dieciséis" },
  { num: 70, word: "Setenta" },
  { num: 90, word: "Noventa" },
  { num: 1000, word: "Mil" },
  { num: 33, word: "Treinta y tres" },
  { num: 22, word: "Veintidós" },
  { num: 11, word: "Once" },
  { num: 40, word: "Cuarenta" },
  { num: 60, word: "Sesenta" },
  { num: 80, word: "Ochenta" },
  { num: 700, word: "Setecientos" },
  { num: 900, word: "Novecientos" },
  { num: 14, word: "Catorce" },
  { num: 50, word: "Cincuenta" },
  { num: 25, word: "Veinticinco" }
];

export default function SpanishNumbersGame() {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'results'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Generate random options for each turn
  useEffect(() => {
    if (gameState === 'playing') {
      const correct = NUMBERS_DATA[currentIndex].word;
      const others = NUMBERS_DATA
        .filter(n => n.word !== correct)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2)
        .map(n => n.word);
      
      setOptions([correct, ...others].sort(() => 0.5 - Math.random()));
    }
  }, [currentIndex, gameState]);

  const handleBasketSelect = (selectedWord: string) => {
    if (isAnimating || feedback) return;

    const isCorrect = selectedWord === NUMBERS_DATA[currentIndex].word;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setIsAnimating(true);

    if (isCorrect) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      setFeedback(null);
      setIsAnimating(false);
      if (currentIndex < NUMBERS_DATA.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setGameState('results');
      }
    }, 2000);
  };

  const currentItem = NUMBERS_DATA[currentIndex];

  return (
    <div className="min-h-screen bg-[#001f3f] text-white font-sans overflow-hidden flex flex-col items-center justify-center p-4 selection:bg-orange-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-orange-600/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/30 blur-[150px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="z-10 bg-[#002b5c] border border-white/10 p-12 md:p-20 rounded-[4rem] shadow-2xl max-w-2xl w-full text-center space-y-12"
          >
            <div className="space-y-6">
              <div className="inline-block p-6 bg-orange-500 rounded-3xl shadow-xl shadow-orange-500/20 mb-4">
                <ShoppingBasket className="w-16 h-16 text-slate-900" />
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                Canasta de <br/> <span className="text-orange-400">Números</span>
              </h1>
              <p className="text-slate-300 font-bold text-xl leading-relaxed border-l-4 border-orange-500 pl-6 text-left mx-auto max-w-md">
                Տեղադրեք թվերը ճիշտ զամբյուղի մեջ: Յուրաքանչյուր թիվ ունի իր իսպաներեն անվանումը:
              </p>
            </div>

            <button
              onClick={() => setGameState('playing')}
              className="w-full py-8 bg-white text-black rounded-full font-black text-3xl uppercase tracking-widest hover:bg-orange-400 transition-all shadow-2xl flex items-center justify-center gap-6 group"
            >
              Play Game
              <ChevronRight className="w-10 h-10 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-6xl z-10 flex flex-col items-center gap-12"
          >
            {/* Header Stats */}
            <div className="w-full flex justify-between items-center mb-4 px-4">
                <div className="flex flex-col">
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Առաջընթաց</span>
                   <span className="text-3xl font-black italic">{currentIndex + 1} / 20</span>
                </div>
                <div className="bg-[#002b5c] px-8 py-4 rounded-3xl border border-white/10 flex items-center gap-4">
                   <Trophy className="w-8 h-8 text-orange-400" />
                   <div className="text-4xl font-black italic">{score}</div>
                </div>
            </div>

            {/* Main Stage: The Falling Number */}
            <div className="relative w-full h-[400px] flex items-center justify-center border-b-2 border-white/5 pb-12">
               <AnimatePresence mode="wait">
                 <motion.div
                   key={currentItem.num}
                   initial={{ y: -200, opacity: 0, scale: 0.5 }}
                   animate={{ 
                     y: feedback ? 300 : 0, 
                     opacity: 1, 
                     scale: feedback ? 0.3 : 1.5,
                     rotate: feedback === 'correct' ? 720 : 0
                   }}
                   exit={{ opacity: 0 }}
                   transition={{ type: "spring", damping: 15 }}
                   className={`text-[12rem] md:text-[18rem] font-black tracking-tighter leading-none select-none ${
                     feedback === 'correct' ? 'text-emerald-400' : 
                     feedback === 'wrong' ? 'text-rose-500' : 'text-white'
                   }`}
                 >
                   {currentItem.num}
                 </motion.div>
               </AnimatePresence>
               
               {/* Visual Hint */}
               <div className="absolute top-0 left-0 w-full text-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.6em] text-orange-400/50">Ընտրեք ճիշտ զամբյուղը</span>
               </div>
            </div>

            {/* Baskets Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-4">
              {options.map((opt, i) => (
                <motion.button
                  key={opt + i}
                  whileHover={{ scale: 1.05, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBasketSelect(opt)}
                  disabled={!!feedback}
                  className={`relative p-12 rounded-[3.5rem] border-2 flex flex-col items-center gap-6 transition-all h-[280px] justify-center group overflow-hidden ${
                    feedback === 'correct' && opt === currentItem.word
                      ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)]'
                      : feedback === 'wrong' && opt !== currentItem.word
                      ? 'bg-rose-500/10 border-rose-500/30'
                      : 'bg-[#002b5c] border-white/10 hover:border-orange-500'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity`} />
                  
                  <ShoppingBasket className={`w-16 h-16 mb-4 transition-transform group-hover:scale-110 ${
                    feedback === 'correct' && opt === currentItem.word ? 'text-emerald-400' : 'text-orange-400'
                  }`} />
                  
                  <span className={`text-3xl md:text-4xl font-black uppercase tracking-tight text-center relative z-10 ${
                    feedback === 'correct' && opt === currentItem.word ? 'text-emerald-300' : 'text-white'
                  }`}>
                    {opt}
                  </span>

                  {feedback === 'correct' && opt === currentItem.word && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-4 -right-4 bg-emerald-500 p-4 rounded-2xl shadow-xl"
                    >
                      <CheckCircle2 className="w-8 h-8 text-slate-900" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Explanation Overlay */}
            <AnimatePresence>
              {feedback === 'wrong' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-[#002b5c] border-4 border-rose-500 p-12 rounded-[3rem] shadow-[0_0_100px_rgba(244,63,94,0.3)] max-w-lg w-full text-center space-y-6"
                >
                  <div className="flex justify-center">
                    <XCircle className="w-20 h-20 text-rose-500" />
                  </div>
                  <h3 className="text-4xl font-black uppercase text-white tracking-widest">Ուշադիր եղեք!</h3>
                  <div className="py-6 border-y border-white/10 text-2xl font-bold">
                    <span className="text-white/40 uppercase text-sm block mb-2">Ճիշտ ձևը՝</span>
                    <span className="text-emerald-400 text-5xl whitespace-nowrap">{currentItem.word}</span>
                  </div>
                  <p className="text-slate-400 font-medium tracking-wide leading-relaxed italic px-4">
                    Յուրաքանչյուր սխալ նոր գիտելիք է: Փորձեք հիշել այս ձևը!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {gameState === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="z-10 bg-[#002b5c] border border-white/10 p-16 md:p-24 rounded-[5rem] shadow-2xl text-center space-y-12 max-w-3xl w-full relative overflow-hidden"
          >
            {/* Victory Decor */}
            <div className="absolute inset-0 pointer-events-none">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-blue-500 to-orange-500" />
               <Sparkles className="absolute top-10 right-10 w-24 h-24 text-orange-500/20 animate-pulse" />
               <Zap className="absolute bottom-10 left-10 w-24 h-24 text-blue-500/20" />
            </div>

            <div className="relative inline-block">
               <div className="w-48 h-48 bg-gradient-to-br from-orange-500 to-orange-700 rounded-[3rem] flex items-center justify-center shadow-2xl relative z-10">
                  <Trophy className="w-24 h-24 text-black" />
               </div>
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                 className="absolute inset-[-20px] border-2 border-dashed border-orange-500/30 rounded-[4rem]"
               />
            </div>

            <div className="space-y-6 relative z-10">
              <h2 className="text-7xl font-black italic uppercase tracking-tighter text-white">
                 ¡Número <span className="text-orange-400">Master!</span>
              </h2>
              <div className="text-3xl font-black text-white/40 tracking-[0.4em] uppercase">
                Final Score: <span className="text-white">{score}</span> / 20
              </div>
              <p className="text-white/60 font-medium text-xl leading-relaxed max-w-lg mx-auto border-t border-white/5 pt-10">
                Դուք հաջողությամբ յուրացրեցիք իսպաներենի թվերը 1-ից մինչև 1000: Այժմ ձեր գիտելիքները "զամբյուղում" են:
              </p>
            </div>

            <button
              onClick={() => {
                setCurrentIndex(0);
                setScore(0);
                setGameState('intro');
              }}
              className="w-full py-8 bg-white text-black rounded-full font-black text-3xl uppercase tracking-widest hover:bg-orange-400 transition-all shadow-2xl flex items-center justify-center gap-6 group"
            >
              <RotateCcw className="w-10 h-10 group-hover:rotate-[-180deg] transition-transform duration-500" />
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Elements Background */}
      {gameState === 'playing' && (
        <div className="fixed inset-0 pointer-events-none select-none">
           {[...Array(6)].map((_, i) => (
             <motion.div
               key={i}
               animate={{ 
                 y: [0, -20, 0],
                 x: [0, 10, 0],
                 rotate: [0, 5, 0]
               }}
               transition={{ duration: 5 + i, repeat: Infinity }}
               className="absolute text-orange-500/5 font-black text-9xl"
               style={{ 
                 top: `${Math.random() * 80}%`, 
                 left: `${Math.random() * 80}%` 
               }}
             >
               <Hash className="w-48 h-48" />
             </motion.div>
           ))}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        
        .font-sans {
          font-family: 'Inter', system-ui, sans-serif;
        }

        h1, h2, h3, button, span, p, div {
          font-family: 'Inter', sans-serif !important;
        }
      `}} />
    </div>
  );
}
