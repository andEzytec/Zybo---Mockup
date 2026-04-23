import { useState } from 'react';
import { AlignJustify } from 'lucide-react';

interface MenuOption {
  id: string;
  label: string;
  action: string;
  description?: string;
}

interface MenuListProps {
  title?: string;
  buttonLabel?: string;
  options: MenuOption[];
  onOptionClick: (action: string) => void;
  onOpenSheet: (config: {
    title: string;
    options: Array<{ id: string; label: string; description?: string; action: string }>;
    onSelect: (action: string) => void;
  }) => void;
}

export function MenuList({ title, buttonLabel, options, onOptionClick, onOpenSheet }: MenuListProps) {
  const [done, setDone] = useState(false);

  const sheetTitle = title || 'Menú principal';
  const btnText = buttonLabel || title || 'Ver opciones';

  function handleOpen() {
    onOpenSheet({
      title: sheetTitle,
      options,
      onSelect: (action) => {
        setDone(true);
        onOptionClick(action);
      },
    });
  }

  return (
    <div className="flex justify-start mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="max-w-[85%] w-full bg-white rounded-lg shadow-sm overflow-hidden">
        <button
          disabled={done}
          onClick={handleOpen}
          className={`w-full px-4 py-3 flex items-center justify-center gap-2 text-[#00a884] font-medium text-[15px] transition-colors ${
            done ? 'opacity-60 cursor-default' : 'hover:bg-gray-50'
          }`}
        >
          <AlignJustify className="w-4 h-4" />
          <span>{btnText}</span>
        </button>
      </div>
    </div>
  );
}
