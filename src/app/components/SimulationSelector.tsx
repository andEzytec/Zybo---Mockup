import { RefreshCw } from 'lucide-react';
import { SimulationType } from '../types';
import { simLabels } from './simLabels';

type Props = {
  simulation: SimulationType | null;
  onSelect: (sim: SimulationType) => void;
  onReset: () => void;
};

export function SimulationSelector({ simulation, onSelect, onReset }: Props) {
  return (
    <div className="w-full max-w-[300px] mb-4">
      <p className="text-gray-600 text-xs font-semibold mb-2 uppercase tracking-wide text-center">
        🔧 Escenario de simulación
      </p>

      <div className="flex gap-2 justify-center flex-wrap">
        {(Object.keys(simLabels) as SimulationType[]).map(sim => {
          const s = simLabels[sim];
          const isActive = simulation === sim;
          return (
            <button
              key={sim}
              onClick={() => onSelect(sim)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all shadow-sm ${isActive ? s.active : s.color
                }`}
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          );
        })}

        {simulation && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-700 text-white hover:bg-gray-800 transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>
        )}
      </div>
    </div>
  );
}
