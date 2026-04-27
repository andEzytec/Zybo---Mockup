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

  const [step, setStep] = useState<1 | 2>(1);
  const [acceptedDataPolicy, setAcceptedDataPolicy] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isStep1Valid =
    formData.name?.trim().length > 0 &&
    formData.lastname?.trim().length > 0 &&
    formData.plate?.trim().length > 0 &&
    formData.document?.trim().length > 0;

  const isStep2Valid = acceptedTerms && acceptedDataPolicy;

  const isButtonDisabled =
    isSubmitting || (step === 1 ? !isStep1Valid : !isStep2Valid);

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
      setStep(1);
      setAcceptedDataPolicy(false);
      setAcceptedTerms(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        onSubmit(formData);
        setIsSubmitting(false);
      }, 1000);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBack = () => setStep(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
      <div className="bg-white rounded-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-[#075e54] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex-1 pr-2">
            <h2 className="text-lg font-semibold leading-tight">
              {step === 1 ? 'Formulario de registro Zybo' : 'Términos y Condiciones'}
            </h2>
            <p className="text-xs text-green-200 mt-0.5">
              {step === 1
                ? 'Con este registro puedes disfrutar de Zybo en los principales centros comerciales del país.'
                : 'Acepta para finalizar tu registro.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {step === 1 ? (
            <>
              {/* Sección: Tus datos */}
              <div>
                <h3 className="text-sm font-semibold text-[#075e54] uppercase tracking-wide mb-3">
                  Tus datos
                </h3>
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
                <h3 className="text-sm font-semibold text-[#075e54] uppercase tracking-wide mb-3">
                  Datos del propietario
                </h3>
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
            </>
          ) : (
            <>
              {/* Terms and Conditions Content */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-[300px] overflow-y-auto">
                <img
                  className="rounded-lg mb-3"
                  src="https://i.postimg.cc/wjQcWtMT/logo-Zybo-Whatsapp-jpg.jpg"
                  alt="Zybo"
                />

                <h3 className="font-semibold text-gray-900 mb-3">Política de Tratamiento de Datos</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Al aceptar esta política, autorizas a Zybo para recolectar, almacenar y procesar tus datos
                  personales con el propósito de brindarte servicios de gestión y pago de parqueo en centros
                  comerciales. Tus datos serán protegidos conforme a la Ley 1581 de 2012 y solo serán
                  utilizados para mejorar tu experiencia de usuario.
                </p>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="dataPolicy"
                    checked={acceptedDataPolicy}
                    onChange={(e) => setAcceptedDataPolicy(e.target.checked)}
                    className="w-5 h-5 mt-0.5 text-[#25d366] bg-gray-100 border-gray-300 rounded focus:ring-[#25d366] focus:ring-2"
                  />
                  <label htmlFor="dataPolicy" className="text-sm text-gray-700 cursor-pointer">
                    Acepto la <span className="font-semibold text-[#075e54]">Política de Tratamiento de Datos</span>
                    {' '}y autorizo el uso de mi información personal según lo descrito en este{' '}
                    <a href="#" className="font-semibold text-[#075e54] underline">link</a>.
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-5 h-5 mt-0.5 text-[#25d366] bg-gray-100 border-gray-300 rounded focus:ring-[#25d366] focus:ring-2"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                    Acepto los <span className="font-semibold text-[#075e54]">Términos y Condiciones</span>
                    {' '}de uso del servicio Zybo.
                  </label>
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="pt-4 space-y-2">
            <button
              type="submit"
              disabled={isButtonDisabled}
              className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${
                isButtonDisabled
                  ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                  : 'bg-[#075e54] text-white hover:bg-[#054c44]'
              }`}
            >
              {isSubmitting
                ? 'Enviando...'
                : step === 1
                  ? 'Continuar'
                  : 'Registrarme'}
            </button>

            {step === 2 && (
              <button
                type="button"
                onClick={handleBack}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Volver
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
