
import React, { useState } from 'react';
import { Scenario } from '../types';

interface QuestionCardProps {
  scenario: Scenario;
  onAnswer: (isCorrect: boolean) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  scenario, 
  onAnswer, 
  questionNumber, 
  totalQuestions 
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelect = (id: number) => {
    if (isSubmitted) return;
    setSelectedId(id);
  };

  const handleSubmit = () => {
    if (selectedId === null) return;
    setIsSubmitted(true);
  };

  const handleNext = () => {
    onAnswer(selectedId === scenario.correctOptionId);
    setSelectedId(null);
    setIsSubmitted(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 max-w-2xl w-full mx-auto transition-all transform animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
          {scenario.category}
        </span>
        <span className="text-slate-400 font-medium text-sm">
          Aufgabe {questionNumber} / {totalQuestions}
        </span>
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 leading-relaxed">
        {scenario.description}
      </h2>

      <div className="space-y-4 mb-8">
        {scenario.options.map((option) => {
          const isCorrect = option.id === scenario.correctOptionId;
          const isSelected = option.id === selectedId;
          
          let cardStyle = "border-2 border-slate-100 hover:border-indigo-200 bg-slate-50";
          if (isSelected && !isSubmitted) cardStyle = "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200";
          if (isSubmitted) {
            if (isCorrect) cardStyle = "border-green-500 bg-green-50 ring-2 ring-green-100";
            else if (isSelected) cardStyle = "border-red-500 bg-red-50 ring-2 ring-red-100";
            else cardStyle = "border-slate-100 bg-slate-50 opacity-60";
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={isSubmitted}
              className={`w-full text-left p-4 md:p-5 rounded-2xl transition-all flex items-start gap-4 ${cardStyle}`}
            >
              <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-xs
                ${isSelected && !isSubmitted ? "border-indigo-500 text-indigo-500" : "border-slate-300 text-slate-400"}
                ${isSubmitted && isCorrect ? "border-green-500 bg-green-500 text-white" : ""}
                ${isSubmitted && isSelected && !isCorrect ? "border-red-500 bg-red-500 text-white" : ""}
              `}>
                {String.fromCharCode(64 + option.id)}
              </div>
              <span className="text-slate-700 font-medium md:text-lg">{option.text}</span>
            </button>
          );
        })}
      </div>

      {isSubmitted && (
        <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-800 animate-in fade-in zoom-in duration-300">
          <p className="font-bold mb-1 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Hintergrundwissen
          </p>
          <p className="text-sm leading-relaxed">{scenario.explanation}</p>
        </div>
      )}

      <button
        onClick={isSubmitted ? handleNext : handleSubmit}
        disabled={selectedId === null}
        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-[0.98]
          ${selectedId === null ? "bg-slate-200 text-slate-400 cursor-not-allowed" : 
            isSubmitted ? "bg-indigo-600 text-white hover:bg-indigo-700" : 
            "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200"}
        `}
      >
        {isSubmitted ? "Nächste Aufgabe" : "Bestätigen"}
      </button>
    </div>
  );
};

export default QuestionCard;
