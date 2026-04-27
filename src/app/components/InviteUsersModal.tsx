import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface InviteUsersModalProps {
  isOpen: boolean;
  ownerName: string;
  plate: string;
  onClose: () => void;
  onSubmit: (phones: string[]) => void;
}

const SLOTS = 5;

export function InviteUsersModal({ isOpen, ownerName, plate, onClose, onSubmit }: InviteUsersModalProps) {
  const [phones, setPhones] = useState<string[]>(Array(SLOTS).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPhones(Array(SLOTS).fill(''));
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const validPhones = phones.map((p) => p.trim()).filter((p) => /^\d{7,}$/.test(p));
  const hasAtLeastOne = validPhones.length > 0;

  function updatePhone(i: number, value: string) {
    const cleaned = value.replace(/\D/g, '');
    setPhones((prev) => prev.map((p, idx) => (idx === i ? cleaned : p)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasAtLeastOne) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(validPhones);
      setIsSubmitting(false);
    }, 800);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
      <div className="bg-white rounded-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-[#075e54] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex-1 pr-2">
            <h2 className="text-lg font-semibold leading-tight">Invitar usuarios</h2>
            <p className="text-xs text-green-200 mt-0.5">
              Agrega hasta {SLOTS} celulares de personas que también manejan el vehículo {plate}.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          <p className="text-xs text-gray-600">
            Cada persona recibirá un mensaje de Zybo indicando que {ownerName || 'el usuario principal'} la invitó a manejar el vehículo {plate}.
          </p>

          {phones.map((phone, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Celular {i + 1} {i === 0 && <span className="text-red-500">*</span>}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => updatePhone(i, e.target.value)}
                inputMode="numeric"
                maxLength={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25d366] focus:border-transparent outline-none"
                placeholder="3001234567"
              />
            </div>
          ))}

          <div className="pt-2">
            <button
              type="submit"
              disabled={!hasAtLeastOne || isSubmitting}
              className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${
                !hasAtLeastOne || isSubmitting
                  ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                  : 'bg-[#075e54] text-white hover:bg-[#054c44]'
              }`}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar invitaciones'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
