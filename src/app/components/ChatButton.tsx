interface ChatButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function ChatButton({ label, onClick, variant = 'primary' }: ChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-4 rounded-lg text-[15px] font-medium transition-colors ${
        variant === 'primary'
          ? 'bg-[#25d366] text-white hover:bg-[#20bd5a]'
          : 'bg-white text-[#25d366] border border-[#25d366] hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );
}
