
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Scenario } from './types';
import { fetchNetiquetteScenarios } from './geminiService';
import QuestionCard from './components/QuestionCard';
import GameResults from './components/GameResults';
import { generateOfflineHtml } from './utils/offlineTemplate';

const TOTAL_GOAL = 100;
const STORAGE_KEY = 'netiquette_master_scenarios_v1';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    score: 0,
    scenarios: [],
    isGameOver: false,
    status: 'idle',
    totalQuestions: TOTAL_GOAL
  });

  const [isExporting, setIsExporting] = useState(false);
  const [setupProgress, setSetupProgress] = useState(0);

  // Load scenarios from LocalStorage or API
  const initializeGame = useCallback(async () => {
    const cached = localStorage.getItem(STORAGE_KEY);
    
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length >= TOTAL_GOAL) {
          setGameState(prev => ({
            ...prev,
            scenarios: parsed,
            status: 'playing',
            currentQuestionIndex: 0,
            score: 0,
            isGameOver: false
          }));
          return;
        }
      } catch (e) {
        console.error("Cache corrupted, re-initializing...");
      }
    }

    // If no cache, we need to generate all 100 questions once
    setGameState(prev => ({ ...prev, status: 'loading' }));
    setSetupProgress(0);
    
    let allScenarios: Scenario[] = [];
    try {
      while (allScenarios.length < TOTAL_GOAL) {
        const batchSize = 10;
        const batch = await fetchNetiquetteScenarios(batchSize, allScenarios.length);
        allScenarios = [...allScenarios, ...batch];
        setSetupProgress(allScenarios.length);
      }
      
      // Save permanently
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allScenarios));
      
      setGameState(prev => ({
        ...prev,
        scenarios: allScenarios,
        status: 'playing'
      }));
    } catch (error) {
      setGameState(prev => ({ ...prev, status: 'error' }));
    }
  }, []);

  const downloadFullOfflineGame = () => {
    if (gameState.scenarios.length < TOTAL_GOAL) {
      alert("Warte bis alle Aufgaben geladen sind.");
      return;
    }
    const htmlContent = generateOfflineHtml(gameState.scenarios);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Netiquette_Master_100_OFFLINE.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetGameData = () => {
    if (window.confirm("Möchtest du alle 100 Aufgaben löschen und neue generieren lassen?")) {
      localStorage.removeItem(STORAGE_KEY);
      initializeGame();
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    setGameState(prev => {
      const nextIndex = prev.currentQuestionIndex + 1;
      const newScore = isCorrect ? prev.score + 1 : prev.score;
      
      if (nextIndex >= TOTAL_GOAL) {
        return { ...prev, score: newScore, isGameOver: true };
      }

      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        score: newScore
      };
    });
  };

  const restartCurrentSet = () => {
    setGameState(prev => ({
      ...prev,
      currentQuestionIndex: 0,
      score: 0,
      isGameOver: false
    }));
  };

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  if (gameState.status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md animate-in zoom-in">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Initialisierungsfehler</h2>
          <p className="text-slate-600 mb-6">Wir konnten die 100 Aufgaben nicht vorbereiten.</p>
          <button onClick={initializeGame} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold">Nochmal versuchen</button>
        </div>
      </div>
    );
  }

  if (gameState.status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 gradient-bg text-white">
        <div className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin mb-8"></div>
        <h2 className="text-3xl font-black mb-2 tracking-tight">Erstes Setup (100 Aufgaben)</h2>
        <p className="text-indigo-100 opacity-70 mb-8 max-w-xs text-center">
          Die KI generiert jetzt DEINE feste Sammlung an Challenges. Das passiert nur einmal!
        </p>
        <div className="w-64 bg-white/10 rounded-full h-3 overflow-hidden shadow-inner relative">
          <div 
            className="bg-white h-full transition-all duration-500 shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
            style={{ width: `${setupProgress}%` }}
          ></div>
        </div>
        <div className="mt-4 font-bold text-sm tracking-widest">{setupProgress} / 100 geladen</div>
      </div>
    );
  }

  const currentScenario = gameState.scenarios[gameState.currentQuestionIndex];

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 bg-slate-50">
      {/* Header */}
      <header className="max-w-4xl w-full mx-auto flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            Netiquette <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-lg text-xl italic leading-none">100</span>
          </h1>
          <p className="text-slate-500 font-semibold text-sm">Deine persönliche Challenges-Sammlung</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={downloadFullOfflineGame}
            className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 border border-indigo-100 rounded-xl font-bold text-xs hover:bg-indigo-50 transition-all shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>HTML Download</span>
          </button>
          
          <div className="flex items-center gap-4 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Points</span>
              <span className="text-xl font-black text-indigo-600 leading-none tabular-nums">{gameState.score}</span>
            </div>
            <div className="w-px h-6 bg-slate-100"></div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Aufgabe</span>
              <span className="text-xl font-black text-slate-700 leading-none tabular-nums">{gameState.currentQuestionIndex + 1}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-2">
        {gameState.isGameOver ? (
          <GameResults 
            score={gameState.score} 
            total={TOTAL_GOAL} 
            scenarios={gameState.scenarios}
            onRestart={restartCurrentSet} 
          />
        ) : currentScenario ? (
          <QuestionCard
            scenario={currentScenario}
            onAnswer={handleAnswer}
            questionNumber={gameState.currentQuestionIndex + 1}
            totalQuestions={TOTAL_GOAL}
          />
        ) : null}
      </main>

      {/* Footer Progress & Reset */}
      <footer className="max-w-2xl w-full mx-auto mt-8 px-2 flex flex-col gap-6">
        {!gameState.isGameOver && (
          <div className="w-full">
            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">
              <span>Fortschritt</span>
              <span>{Math.round((gameState.currentQuestionIndex / TOTAL_GOAL) * 100)}%</span>
            </div>
            <div className="bg-slate-200 h-2.5 w-full rounded-full overflow-hidden shadow-inner">
              <div 
                className="bg-indigo-600 h-full transition-all duration-700 ease-out"
                style={{ width: `${(gameState.currentQuestionIndex / TOTAL_GOAL) * 100}%` }}
              />
            </div>
          </div>
        )}
        
        <div className="flex justify-center">
          <button 
            onClick={resetGameData}
            className="text-[10px] font-bold text-slate-300 hover:text-red-400 transition-colors flex items-center gap-1 uppercase tracking-widest"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Aufgaben-Set zurücksetzen & neu generieren
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
