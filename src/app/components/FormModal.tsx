import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

export interface FormData {
  name: string;
  lastname: string;
  plate: string;
  documentType: string;
  document: string;
  email: string;
  phone?: string;
}

export function FormModal({ isOpen, onClose, onSubmit }: FormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    lastname: '',
    plate: '',
    documentType: 'Cédula',
    document: '',
    email: '',
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedDataPolicy, setAcceptedDataPolicy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid =
    formData.name?.trim().length > 0 &&
    formData.lastname?.trim().length > 0 &&
    formData.plate?.trim().length > 0 &&
    formData.document?.trim().length > 0 &&
    acceptedTerms &&
    acceptedDataPolicy;

  const isButtonDisabled = isSubmitting || !isFormValid;

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        lastname: '',
        plate: '',
        documentType: 'Cédula',
        document: '',
        email: '',
      });
      setAcceptedTerms(false);
      setAcceptedDataPolicy(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
      <div className="bg-white rounded-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-[#075e54] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-semibold leading-tight flex-1 pr-2">
            Formulario de registro Zybo
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-900 leading-snug">
            Con este registro puedes disfrutar de Zybo en los principales centros comerciales del país.
          </h2>

          {/* Sección: Tus datos */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Tus datos
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tu nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25d366] focus:border-transparent outline-none"
                  placeholder="Ej: Juan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tu apellido <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastname}
                  onChange={(e) => handleChange('lastname', e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25d366] focus:border-transparent outline-none"
                  placeholder="Ej: Rodríguez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Placa del vehículo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.plate}
                  onChange={(e) => handleChange('plate', e.target.value.toUpperCase())}
                  required
                  maxLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25d366] focus:border-transparent outline-none uppercase"
                  placeholder="Ej: ABC123"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4" />

          {/* Sección: Datos del propietario */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Datos del propietario
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de documento del propietario <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.documentType}
                  onChange={(e) => handleChange('documentType', e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25d366] focus:border-transparent outline-none"
                >
                  <option value="Cédula">Cédula de Ciudadanía</option>
                  <option value="NIT">NIT</option>
                  <option value="Pasaporte">Cédula de extranjería</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de documento del propietario <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.document}
                  onChange={(e) => handleChange('document', e.target.value.replace(/\D/g, ''))}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25d366] focus:border-transparent outline-none"
                  placeholder="Solo números"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25d366] focus:border-transparent outline-none"
                  placeholder="Para facturación electrónica"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4" />

          {/* Términos y condiciones */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-5 h-5 mt-0.5 text-[#25d366] bg-gray-100 border-gray-300 rounded focus:ring-[#25d366] focus:ring-2 flex-shrink-0"
              />
              <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer leading-snug">
                He leído y acepto los Términos y Condiciones de Zybo. Link:{' '}
                <a
                  href="https://zybo.co/tyc/zybo260223.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#075e54] underline break-all"
                >
                  https://zybo.co/tyc/zybo260223.pdf
                </a>
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="dataPolicy"
                checked={acceptedDataPolicy}
                onChange={(e) => setAcceptedDataPolicy(e.target.checked)}
                className="w-5 h-5 mt-0.5 text-[#25d366] bg-gray-100 border-gray-300 rounded focus:ring-[#25d366] focus:ring-2 flex-shrink-0"
              />
              <label htmlFor="dataPolicy" className="text-sm text-gray-700 cursor-pointer leading-snug">
                Autorizo a E-Global Technology S.A.S. el tratamiento de mis datos personales,
                conforme a la Política de Tratamiento de Datos Personales. Link:{' '}
                <a
                  href="https://zybo.co/wp-content/uploads/2025/07/Politica-Tratamiento-de-Datos-Personales-Egobaltechnologysas.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#075e54] underline break-all"
                >
                  https://zybo.co/wp-content/uploads/2025/07/Politica-Tratamiento-de-Datos-Personales-Egobaltechnologysas.pdf
                </a>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isButtonDisabled}
              className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${
                isButtonDisabled
                  ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                  : 'bg-[#075e54] text-white hover:bg-[#054c44]'
              }`}
            >
              {isSubmitting ? 'Enviando...' : 'Registrarme'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
