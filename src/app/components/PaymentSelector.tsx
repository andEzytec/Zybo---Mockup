// PaymentSelector.tsx
import { useState } from 'react';

interface PaymentOption {
  id: string;
  name: string;
  description: string;
  fee?: number;
}

interface PaymentSelectorProps {
  onSelect: (paymentId: string) => void;
  showAutomatic?: boolean;
  variant?: 'pay' | 'link' | 'autodebit';
}

export function PaymentSelector({ onSelect, showAutomatic = false, variant = 'pay' }: PaymentSelectorProps) {
  const [clicked, setClicked] = useState(false);

  if (clicked) return null;
  // Opciones para pagar (desde el flujo de entrada/pago)
  const paymentOptions: PaymentOption[] = [
    { 
      id: 'nequi', 
      name: 'Nequi', 
      description: 'Paga directamente desde tu cuenta Nequi' 
    },
    { 
      id: 'daviplata', 
      name: 'Daviplata', 
      description: 'Paga directamente desde tu cuenta Daviplata' 
    },
    { 
      id: 'credit_card', 
      name: 'Tarjetas', 
      description: 'Visa, MasterCard o American Express' 
    },
    { 
      id: 'puntos_colombia', 
      name: 'Puntos Colombia', 
      description: 'Paga con Puntos Colombia aquí' 
    },
  ];

  // Opciones para vincular (débito automático) - sin Puntos Colombia
  const linkOptions: PaymentOption[] = [
    { 
      id: 'nequi', 
      name: 'Nequi', 
      description: 'Vincula tu cuenta Nequi para pagos automáticos',
      fee: 500 
    },
    { 
      id: 'daviplata', 
      name: 'Daviplata', 
      description: 'Vincula tu cuenta Daviplata para pagos automáticos',
      fee: 500 
    },
    { 
      id: 'credit_card', 
      name: 'Tarjetas de crédito', 
      description: 'Vincula tu tarjeta para pagos automáticos',
      fee: 800 
    },
    { 
      id: 'mercado_pago', 
      name: 'Mercado Pago', 
      description: 'Vincula tu cuenta de Mercado Pago',
      fee: 500 
    },
  ];

  const options = variant === 'link' || variant === 'autodebit' ? linkOptions : paymentOptions;

  return (
    <div className="flex justify-start mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="max-w-[85%] bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-[#075e54] text-white px-4 py-2 font-medium text-sm">
          {showAutomatic ? 'Elige el medio de pago a vincular' : 'Elige'}
        </div>
        <div className="divide-y divide-gray-100">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setClicked(true);
                onSelect(option.id);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <div className="flex-1">
                <div className="text-[15px] text-gray-800 font-medium">
                  {option.name}
                </div>
                <div className="text-xs text-gray-500">
                  {option.description}
                  {option.fee && (
                    <span className="block mt-0.5">
                      Tarifa: ${option.fee.toLocaleString('es-CO')} + IVA
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
          {showAutomatic && (
            <button
              onClick={() => {
                setClicked(true);
                onSelect('back_to_menu');
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-600 text-sm"
            >
              ← Regresar al menú
            </button>
          )}
        </div>
      </div>
    </div>
  );
}