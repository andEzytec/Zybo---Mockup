import { useState } from 'react';
import { X } from 'lucide-react';

export interface SheetOption {
  id: string;
  label: string;
  description?: string;
  action: string;
}

interface BottomSheetProps {
  title: string;
  options: SheetOption[];
  onSelect: (action: string) => void;
  onClose: () => void;
}

export function BottomSheet({ title, options, onSelect, onClose }: BottomSheetProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function handleSelect(opt: SheetOption) {
    setSelectedId(opt.id);
    setTimeout(() => onSelect(opt.action), 180);
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 animate-in fade-in duration-200"
      />
      <div className="relative bg-[#111b21] text-white rounded-t-2xl animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[75%] shadow-2xl">
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-gray-500 rounded-full" />
        </div>
        <div className="flex items-center px-4 py-3 gap-3">
          <button onClick={onClose} className="text-white hover:opacity-70 transition-opacity">
            <X className="w-5 h-5" />
          </button>
          <div className="flex-1 text-center font-medium text-[15px] -ml-5">{title}</div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {options.map((opt) => {
            const selected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                disabled={selectedId !== null}
                onClick={() => handleSelect(opt)}
                className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-start gap-3 border-t border-gray-800 disabled:cursor-default"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-medium text-white">{opt.label}</div>
                  {opt.description && (
                    <div className="text-xs text-gray-400 mt-0.5">{opt.description}</div>
                  )}
                </div>
                <div
                  className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    selected ? 'border-[#00a884]' : 'border-gray-500'
                  }`}
                >
                  {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#00a884]" />}
                </div>
              </button>
            );
          })}
        </div>
        <div className="text-center text-xs text-gray-500 py-4 flex-shrink-0 border-t border-gray-800">
          Toca para seleccionar un elemento
        </div>
      </div>
    </div>
  );
}
