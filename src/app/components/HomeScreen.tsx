import { SimulationType } from '../types';
import { simLabels } from './simLabels';

type Props = {
  onSelect: (sim: SimulationType) => void;
};

export function HomeScreen({ onSelect }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-50 h-20 rounded-full overflow-hidden">
        <img
          src="https://i.postimg.cc/NG2q2tCm/Zybo-logo-hor-morado-amarillo.png"
          alt="Zybo"
          className="w-full h-full object-contain"
        />
      </div>

      <h2 className="text-base font-bold text-[#075e54] mb-1">Zybo — Simulador</h2>
      <p className="text-gray-500 text-xs">Selecciona un escenario para comenzar.</p>

      <div className="mt-5 flex flex-col gap-2 w-full">
        {(Object.keys(simLabels) as SimulationType[]).map(sim => {
          const s = simLabels[sim];
          return (
            <button
              key={sim}
              onClick={() => onSelect(sim)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow text-[#075e54] font-semibold text-sm hover:bg-[#075e54] hover:text-white transition-all border border-gray-200"
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
