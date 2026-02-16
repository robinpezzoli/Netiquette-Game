
import { Scenario } from '../types';

export function generateOfflineHtml(scenarios: Scenario[]): string {
  const scenariosJson = JSON.stringify(scenarios);
  
  return `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Netiquette Master 100 - Offline</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f8fafc; }
        .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    </style>
</head>
<body>
    <div id="app" class="min-h-screen flex flex-col p-4 md:p-8">
        <!-- JS will render here -->
    </div>

    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

    <script>
        const { useState, useEffect } = React;
        const scenarios = ${scenariosJson};

        function App() {
            const [index, setIndex] = useState(0);
            const [score, setScore] = useState(0);
            const [gameOver, setGameOver] = useState(false);
            const [selected, setSelected] = useState(null);
            const [submitted, setSubmitted] = useState(false);

            const scenario = scenarios[index];
            const total = scenarios.length;

            const handleNext = () => {
                if (selected === scenario.correctOptionId) setScore(score + 1);
                if (index + 1 >= total) setGameOver(true);
                else {
                    setIndex(index + 1);
                    setSelected(null);
                    setSubmitted(false);
                }
            };

            if (gameOver) {
                const percentage = Math.round((score / total) * 100);
                return React.createElement('div', { className: 'max-w-lg w-full mx-auto bg-white rounded-3xl shadow-2xl p-8 text-center mt-10' }, [
                    React.createElement('h2', { className: 'text-3xl font-black mb-4' }, 'Spiel beendet!'),
                    React.createElement('div', { className: 'text-6xl font-black mb-4' }, score + ' / ' + total),
                    React.createElement('div', { className: 'text-2xl font-bold mb-6 text-indigo-600' }, percentage + '% Erfolgsrate'),
                    React.createElement('button', { 
                        className: 'w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold',
                        onClick: () => window.location.reload() 
                    }, 'Neustart')
                ]);
            }

            return React.createElement('div', { className: 'max-w-2xl w-full mx-auto' }, [
                React.createElement('header', { className: 'flex justify-between items-center mb-8' }, [
                    React.createElement('h1', { className: 'text-2xl font-black' }, 'Netiquette 100 (Offline)'),
                    React.createElement('div', { className: 'bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 font-bold' }, 'Lvl: ' + (index + 1) + ' | Pts: ' + score)
                ]),
                React.createElement('div', { className: 'bg-white rounded-3xl shadow-xl p-6 md:p-8' }, [
                    React.createElement('div', { className: 'flex justify-between mb-4' }, [
                        React.createElement('span', { className: 'bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold' }, scenario.category),
                        React.createElement('span', { className: 'text-slate-400 text-sm' }, (index + 1) + ' / ' + total)
                    ]),
                    React.createElement('h2', { className: 'text-xl font-bold mb-6 text-slate-800' }, scenario.description),
                    React.createElement('div', { className: 'space-y-4 mb-8' }, scenario.options.map(opt => {
                        let style = "w-full text-left p-4 rounded-2xl border-2 transition-all ";
                        if (selected === opt.id && !submitted) style += "border-indigo-500 bg-indigo-50";
                        else if (submitted) {
                            if (opt.id === scenario.correctOptionId) style += "border-green-500 bg-green-50";
                            else if (selected === opt.id) style += "border-red-500 bg-red-50";
                            else style += "border-slate-100 opacity-60";
                        } else style += "border-slate-100 bg-slate-50";

                        return React.createElement('button', {
                            key: opt.id,
                            disabled: submitted,
                            onClick: () => setSelected(opt.id),
                            className: style
                        }, opt.text);
                    })),
                    submitted && React.createElement('div', { className: 'mb-6 p-4 rounded-xl bg-blue-50 text-blue-800 text-sm italic' }, scenario.explanation),
                    React.createElement('button', {
                        disabled: selected === null,
                        className: 'w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold ' + (selected === null ? 'opacity-50' : ''),
                        onClick: submitted ? handleNext : () => setSubmitted(true)
                    }, submitted ? 'Nächste Challenge' : 'Checken')
                ]),
                React.createElement('div', { className: 'mt-10 bg-slate-200 h-2 rounded-full overflow-hidden' }, [
                    React.createElement('div', { className: 'bg-indigo-600 h-full', style: { width: ((index / total) * 100) + '%' } })
                ])
            ]);
        }

        const root = ReactDOM.createRoot(document.getElementById('app'));
        root.render(React.createElement(App));
    </script>
</body>
</html>`;
}
