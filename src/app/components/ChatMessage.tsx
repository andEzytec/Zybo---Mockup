// ChatMessage.tsx
interface ChatMessageProps {
  type: 'bot' | 'user';
  content: string;
  timestamp: string;
}

export function ChatMessage({ type, content, timestamp }: ChatMessageProps) {
  const isBot = type === 'bot';
  
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-2`}>
      <div 
        className={`w-72 px-4 py-2 rounded-lg shadow-sm break-words ${
          isBot 
            ? 'bg-white rounded-tl-none' 
            : 'bg-[#dcf8c6] rounded-tr-none'
        }`}
      >
        {isBot ? (
          <div 
            className="text-[15px] text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: content
                .replace(/\n/g, '<br/>')
                .replace(/\*(.*?)\*/g, '<strong>$1</strong>') // Para el PIN en negrita
            }}
          />
        ) : (
          <div className="text-[15px] text-gray-800">{content}</div>
        )}
        <div className="text-[11px] text-gray-500 mt-1 text-right">
          {timestamp}
        </div>
      </div>
    </div>
  );
}