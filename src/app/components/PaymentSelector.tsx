import { useState } from 'react';
import { AlignJustify } from 'lucide-react';

interface PaymentOption {
  id: string;
  label: string;
  description: string;
}

interface PaymentSelectorProps {
  onSelect: (paymentId: string) => void;
  showAutomatic?: boolean;
  variant?: 'pay' | 'link' | 'autodebit';
  onOpenSheet: (config: {
    title: string;
    options: Array<{ id: string; label: string; description?: string; action: string }>;
    onSelect: (action: string) => void;
  }) => void;
}

const paymentOptions: PaymentOption[] = [
  { id: 'nequi', label: 'Nequi', description: 'Paga directamente desde tu cuenta Nequi' },
  { id: 'daviplata', label: 'Daviplata', description: 'Paga directamente desde tu cuenta Daviplata' },
  { id: 'credit_card', label: 'Tarjetas', description: 'Visa, MasterCard o American Express' },
  { id: 'puntos_colombia', label: 'Puntos Colombia', description: 'Paga con tus Puntos Colombia' },
];

const linkOptions: PaymentOption[] = [
  { id: 'nequi', label: 'Nequi', description: 'Vincula tu cuenta Nequi. Tarifa: $500 + IVA' },
  { id: 'daviplata', label: 'Daviplata', description: 'Vincula tu cuenta Daviplata. Tarifa: $500 + IVA' },
  { id: 'credit_card', label: 'Tarjetas de crédito', description: 'Vincula tu tarjeta. Tarifa: $800 + IVA' },
  { id: 'mercado_pago', label: 'Mercado Pago', description: 'Vincula tu cuenta Mercado Pago. Tarifa: $500 + IVA' },
];

export function PaymentSelector({ onSelect, showAutomatic = false, variant = 'pay', onOpenSheet }: PaymentSelectorProps) {
  const [done, setDone] = useState(false);

  const baseOptions = variant === 'link' || variant === 'autodebit' ? linkOptions : paymentOptions;
  const sheetTitle = showAutomatic ? 'Elige el medio de pago a vincular' : 'Medios de pago';
  const btnText = 'Medios de pago';

  const sheetOptions = [
    ...baseOptions.map((o) => ({ id: o.id, label: o.label, description: o.description, action: o.id })),
    ...(showAutomatic
      ? [{ id: 'back_to_menu', label: 'Regresar al menú', action: 'back_to_menu' }]
      : []),
  ];

  function handleOpen() {
    onOpenSheet({
      title: sheetTitle,
      options: sheetOptions,
      onSelect: (action) => {
        setDone(true);
        onSelect(action);
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
