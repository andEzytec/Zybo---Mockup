import { useState } from 'react';

interface MenuOption {
  id: string;
  label: string;
  action: string;
  description?: string;
}

interface MenuListProps {
  title?: string;
  options: MenuOption[];
  onOptionClick: (action: string) => void;
}

export function MenuList({ title, options, onOptionClick }: MenuListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isDone = selectedId !== null;

  return (
    <div className="flex justify-start mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="max-w-[85%] bg-white rounded-lg shadow-sm overflow-hidden">
        {title && (
          <div className="bg-[#075e54] text-white px-4 py-2 font-medium text-sm">
            {title}
          </div>
        )}
        <div className="divide-y divide-gray-100">
          {options.map((option) => (
            <button
              key={option.id}
              disabled={isDone}
              onClick={() => {
                setSelectedId(option.id);
                onOptionClick(option.action);
              }}
              className={`w-full px-4 py-3 text-left transition-colors flex items-start gap-3 ${
                isDone ? 'cursor-default opacity-60' : 'hover:bg-gray-50'
              }`}
            >
              {<span className="text-lg"></span>}
              <div className="flex-1">
                <div className="text-[15px] text-gray-800 font-medium">
                  {option.label}
                </div>
                {option.description && (
                  <div className="text-xs text-gray-500 mt-0.5">
                    {option.description}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}