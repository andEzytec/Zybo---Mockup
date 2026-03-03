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
    email: ''
  });





  const [step, setStep] = useState<1 | 2>(1);
  const [acceptedDataPolicy, setAcceptedDataPolicy] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const isStep1Valid =
    formData.name?.trim().length > 0 &&
    formData.document?.trim().length > 0 &&
    formData.plate?.trim().length > 0;

  const isStep2Valid = acceptedTerms && acceptedDataPolicy

  const isButtonDisabled =
    isSubmitting ||
    (step === 1 ? !isStep1Valid : !isStep2Valid);




  useEffect(() => {
    if (isOpen) {
      // Reset form when opened
      setFormData({
        name: '',
        lastname: '',
        plate: '',
        documentType: 'Cédula',
        document: '',
        email: ''
      });
      setStep(1);
      setAcceptedDataPolicy(false);
      setAcceptedTerms(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Dentro del formulario del FormModal
  <div>
    <label className="...">Celular</label>
    <input
      name="phone"
      type="tel"
      required
      value={formData.phone || ''}
      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      className="..."
      placeholder="3001234567"
    />
  </div>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      // Go to terms and conditions step
      setStep(2);
    } else {
      // Submit the form
      setIsSubmitting(true);

      // Simulate form processing
      setTimeout(() => {
        onSubmit(formData);
        setIsSubmitting(false);
      }, 1000);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBack = () => {
    setStep(1);
  };

  const canSubmit = acceptedDataPolicy && acceptedTerms;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
      <div className="bg-white rounded-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-[#075e54] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-lg font-semibold">
              {step === 1 ? 'Formulario de Registro' : 'Términos y Condiciones'}
            </h2>
            <p className="text-xs text-green-200">
              {step === 1 ? 'Paso 1 de 2 - Datos personales' : 'Paso 2 de 2 - Aceptación'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {step === 1 ? (
            <>
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span className="text-red-500">*</span>
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

              {/* Lastname */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido <span className="text-red-500">*</span>
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

              {/* Plate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Placa del Vehículo <span className="text-red-500">*</span>
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

              {/* Document Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Documento <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.documentType}
                  onChange={(e) => handleChange('documentType', e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25d366] focus:border-transparent outline-none"
                >
                  <option value="Cédula">Cédula de Ciudadanía</option>
                  <option value="NIT">NIT</option>
                  <option value="Pasaporte">Cedula extranjeria</option>
                </select>
              </div>

              {/* Document Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Documento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.document}
                  onChange={(e) => handleChange('document', e.target.value.replace(/\D/g, ''))}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25d366] focus:border-transparent outline-none"
                  placeholder=" Solo numeros. Del propietario"
                />
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico <span className="text-gray-400">(Opcional)</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25d366] focus:border-transparent outline-none"
                  placeholder="Para facturación electronica"
                />
              </div>
            </>
          ) : (
            <>
              {/* Terms and Conditions Content */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-[300px] overflow-y-auto">

                <img  className ="rounded-lg "src="https://i.postimg.cc/wjQcWtMT/logo-Zybo-Whatsapp-jpg.jpg" alt="" />

                <h3 className="font-semibold text-gray-900 mb-3">Política de Tratamiento de Datos</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Al aceptar esta política, autorizas a Zybo para recolectar, almacenar y procesar tus datos personales
                  con el propósito de brindarte servicios de gestión y pago de parqueo en centros comerciales.
                  Tus datos serán protegidos conforme a la Ley 1581 de 2012 y solo serán utilizados para mejorar
                  tu experiencia de usuario.
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
                    ☑️ Acepto la <span className="font-semibold text-[#075e54]">Política de Tratamiento de Datos</span>
                    {' '}y autorizo el uso de mi información personal según lo descrito.
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
                    ☑️ Acepto los <span className="font-semibold text-[#075e54]">Términos y Condiciones</span>
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
              className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${isButtonDisabled
                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                : "bg-[#075e54] text-white hover:bg-[#075e54]"
                }`}
            >
              {isSubmitting
                ? "Enviando..."
                : step === 1
                  ? "Continuar"
                  : "Registrarme =>"}
            </button>

            {step === 2 && (
              <button
                type="button"
                onClick={handleBack}
                className="w-full bg-gray-500 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
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