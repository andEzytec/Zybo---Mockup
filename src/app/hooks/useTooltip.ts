import { useState } from 'react';

export function useTooltip() {
  const [tooltip, setTooltip] = useState<{ text: string; visible: boolean }>({ text: '', visible: false });

  function showTooltip(text: string, duration = 4000) {
    setTooltip({ text, visible: true });
    setTimeout(() => setTooltip({ text: '', visible: false }), duration);
  }

  return { tooltip, showTooltip };
}
