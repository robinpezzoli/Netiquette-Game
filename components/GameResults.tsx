
import React from 'react';
import { Scenario } from '../types';

interface GameResultsProps {
  score: number;
  total: number;
  scenarios: Scenario[];
  onRestart: () => void;
}

const GameResults: React.FC<GameResultsProps> = ({ score, total, scenarios, onRestart }) => {
  const percentage = Math.round((score / total) * 100);
  
  let rank = "Noob";
  let message = "Da geht noch was! Lern die Regeln, bevor du im Netz gecancelt wirst.";
  let color = "text-orange-500";

  if (percentage >= 90) {
    rank = "Netiquette Master GOAT";
    message = "Absolute Legende! Du weißt genau, wie man sich im Netz korrekt verhält.";
    color = "text-indigo-600";
  } else if (percentage >= 70) {
    rank = "Digital Pro";
    message = "Stark! Du bist sicher unterwegs und checkst die meisten Vibes.";
    color = "text-green-600";
  } else if (percentage >= 50) {
    rank = "Fortgeschritten";
    message = "Nicht schlecht, aber pass auf, dass du nicht aus Versehen zum Trolling beiträgst.";
    color = "text-blue-600";
  }

  const downloadCertificate = () => {
    const date = new Date().toLocaleDateString('de-DE');
    const content = `
====================================================
           DIGITALER EHRENRAT - ZERTIFIKAT
                 Netiquette Master 100
====================================================

Hiermit wird offiziell bestätigt: 
Du hast den Realness-Check bestanden!

Datum: ${date}
Score: ${score} / ${total} Points (${percentage}%)
Rank:  ${rank.toUpperCase()}

"${message}"

Mach das Internet zu einem besseren Ort! 
Kein Hate, nur Respekt.
====================================================
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Netiquette_Master_Zertifikat_${date.replace(/\./g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadAllTasks = () => {
    const date = new Date().toLocaleDateString('de-DE');
    let content = `
====================================================
           NETIQUETTE GUIDE: DIE 100 CHALLENGES
====================================================
Zusammenstellung der wichtigsten Regeln für den digitalen Alltag.
Datum: ${date}

`;

    scenarios.forEach((s, i) => {
      const correctOption = s.options.find(o => o.id === s.correctOptionId);
      content += `
Challenge #${i + 1} [${s.category}]
Szenario: ${s.description}

Korrekte Antwort:
-> ${correctOption?.text}

Hintergrundwissen:
${s.explanation}

----------------------------------------------------
`;
    });

    content += `
====================================================
Ende des Guides. Bleib respektvoll!
====================================================
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Netiquette_Lern_Guide_${date.replace(/\./g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full mx-auto text-center animate-in fade-in zoom-in duration-700">
      <div className="mb-8">
        <div className="w-20 h-20 bg-indigo-50 rounded-3xl rotate-12 flex items-center justify-center mx-auto mb-6 shadow-indigo-100 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600 -rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-2 italic">Finish!</h2>
        <p className="text-slate-400 uppercase tracking-[0.2em] text-[10px] font-black">Deine Stats</p>
      </div>

      <div className="mb-10">
        <div className="text-7xl font-black text-slate-900 mb-2 tabular-nums">
          {score}<span className="text-slate-200">/</span>{total}
        </div>
        <div className={`text-2xl font-black mb-4 ${color} italic uppercase tracking-tight`}>{rank}</div>
        <p className="text-slate-600 font-medium leading-relaxed px-6">{message}</p>
      </div>

      <div className="w-full bg-slate-100 h-3 rounded-full mb-10 overflow-hidden shadow-inner">
        <div 
          className="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={onRestart}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95"
        >
          Nochmal grinden
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={downloadCertificate}
            className="py-3 bg-white text-slate-700 border-2 border-slate-100 rounded-2xl font-bold text-sm hover:border-slate-300 transition-all flex flex-col items-center justify-center gap-1 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Zertifikat
          </button>
          <button
            onClick={downloadAllTasks}
            className="py-3 bg-white text-slate-700 border-2 border-slate-100 rounded-2xl font-bold text-sm hover:border-slate-300 transition-all flex flex-col items-center justify-center gap-1 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Lern-Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameResults;
