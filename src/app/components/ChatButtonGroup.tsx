import { useState } from 'react';

interface ChatButtonGroupProps {
  buttons: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }>;
}

export function ChatButtonGroup({ buttons }: ChatButtonGroupProps) {
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const isDone = clickedIndex !== null;

  return (
    <div className="flex justify-start mb-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="max-w-[75%] ">
        {buttons.map((button, index) => (
          <button
            key={index}
            disabled={isDone}
            onClick={() => {
              setClickedIndex(index);
              button.onClick();
            }}
            className={`w-72 px-4 py-2  rounded-br-lg rounded-bl-lg text-[15px] font-medium transition-colors  text-center border ${
              button.variant === 'secondary'
                ? 'bg-white text-[#075E54] border-[#ece5dd]'
                : 'bg-white text-[#075E54] border-[#ece5dd]'
            } ${isDone ? 'cursor-default opacity-60' : 'hover:bg-[#f3faf6]'}`}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
}