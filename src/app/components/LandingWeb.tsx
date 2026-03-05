
import { useMemo, useRef, useState } from "react";

type LandingFormData = {
  countryPrefix: string;
  phone: string;
  plate: string;
  firstName: string;
  lastName: string;
  docType: "Cédula" | "NIT" | "Pasaporte";
  docNumber: string;
  email: string;
  extraPhones?: string[];
};




type PrefixOption = {
  value: string;
  flagUrl: string;
};

//terms and coditions

function TermsModal({
  isOpen,
  onClose,
  onAccept,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50">
      {/* Backdrop con desenfoque */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Caja modal */}
      <div className="absolute inset-0 flex items-end justify-center p-3">
        <div className="w-full max-w-[360px] h-[92%] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <p className="text-sm font-bold text-gray-900">Términos y condiciones</p>
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold text-gray-600 hover:opacity-80"
            >
              ✕
            </button>
          </div>

          {/* Contenido scrolleable */}
          <div className="flex-1 overflow-y-auto px-4 py-3 text-sm text-gray-700 leading-relaxed">
            <p className="font-semibold mb-2">1. Aceptación</p>
            <p className="mb-4">
              Al registrarte en Zybo aceptas estos términos y autorizas el tratamiento de tus datos
              para gestionar el servicio de parqueo y comunicaciones relacionadas.
            </p>

            <p className="font-semibold mb-2">2. Uso del servicio</p>
            <p className="mb-4">
              El servicio permite registrar ingresos, gestionar pagos y recibir notificaciones.
              La disponibilidad puede variar según el parqueadero afiliado.
            </p>

            <p className="font-semibold mb-2">3. Privacidad</p>
            <p className="mb-4">
              Tus datos se procesan de acuerdo con la política de privacidad. Podrás solicitar
              actualización o eliminación cuando aplique.
            </p>

            <p className="font-semibold mb-2">4. Responsabilidad</p>
            <p className="mb-10">
              Zybo no se hace responsable por eventos ajenos a la plataforma (fallas del operador,
              conectividad, etc.). Para soporte, contacta los canales oficiales.
            </p>

            <p className="text-xs text-gray-500">
              *Este texto es placeholder. Reemplázalo por tus términos reales.*
            </p>
          </div>

          {/* Botón fijo abajo */}
          <div className="p-4 border-t bg-white">
            <button
              type="button"
              onClick={onAccept}
              className="w-full py-3 rounded-xl bg-[#8800ff] text-white font-semibold"
            >
              Aceptar términos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

///

///codeCountry
function CountryPrefixDropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: PrefixOption[];
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative w-28">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full rounded-xl border border-[#febd47] px-3 py-2 text-sm bg-white flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <img
            src={selected?.flagUrl}
            className="w-5 h-4 object-cover "
          />
          <span>{selected?.value}</span>
        </div>
        <span className="text-gray-400">▾</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={opt.flagUrl}
                className="w-5 h-4 object-cover "
              />
              <span>{opt.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
///
export function LandingWebScreen({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: (data: LandingFormData) => void;
}) {

  const [step, setStep] = useState<"hero" | "form" | "AddSecon_user" | "submitting">("hero");

  const [extraPhones, setExtraPhones] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);



  const [form, setForm] = useState<LandingFormData>({
    countryPrefix: "🇨🇴 +57",
    phone: "",
    plate: "",
    firstName: "",
    lastName: "",
    docType: "Cédula",
    docNumber: "",
    email: "",
  });



  const prefixes = [
    { value: "+57", label: "Colombia", flagUrl: "https://flagcdn.com/w20/co.png" },
    { value: "+593", label: "Ecuador", flagUrl: "https://flagcdn.com/w20/ec.png" },
    { value: "+52", label: "México", flagUrl: "https://flagcdn.com/w20/mx.png" }
  ];

  function validate() {
    const e: Record<string, string> = {};
    if (!form.phone.trim()) e.phone = "Ingresa tu número.";
    if (!/^\d{7,15}$/.test(form.phone.trim())) e.phone = "Número inválido.";

    if (!form.plate.trim()) e.plate = "Ingresa la placa.";
    if (form.plate.trim().length < 5) e.plate = "Placa inválida.";

    if (!form.firstName.trim()) e.firstName = "Ingresa tu nombre.";
    if (!form.lastName.trim()) e.lastName = "Ingresa tu apellido.";

    if (!form.docNumber.trim()) e.docNumber = "Ingresa el documento.";
    if (!/^[A-Za-z0-9]{4,20}$/.test(form.docNumber.trim()))
      e.docNumber = "Documento inválido.";

    if (!form.email.trim()) e.email = "Ingresa tu correo.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Correo inválido.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  function handleAddPhone() {
    if (!form.phone.trim()) return;

    const fullNumber = `${form.countryPrefix} ${form.phone}`;

    setExtraPhones((prev) => [...prev, fullNumber]);

    // Limpiar input después de agregar
    setForm((prev) => ({ ...prev, phone: "" }));
  };


  function handleSend() {
    if (!validate()) return;

    setStep("AddSecon_user");
    onSubmit({
      ...form,
      plate: form.plate.toUpperCase().replace(/\s+/g, ""),
    });
  }

  const inputRef = useRef<HTMLInputElement>(null);

  return (

    <div className="h-full relative bg-white">
      {/* Top bar */}
      <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-sm font-semibold text-gray-700 hover:opacity-80"
        >

          ← Volver
        </button>
        <span className="text-sm font-bold text-gray-900">Zybo</span>
        <div className="w-12" />
      </div>

      {/* HERO */}
      {/* {step === "hero" && (
        <div className="px-5 py-8">
          <img
            src="https://i.postimg.cc/NG2q2tCm/Zybo-logo-hor-morado-amarillo.png"
            className="h-10"
            alt="Zybo"
          />

          <h1 className="text-2xl font-extrabold text-gray-900 leading-tight mt-6">
            Paga tu parqueo sin filas.
          </h1>
          <p className="text-gray-600 mt-1 text-sm leading-relaxed">
            Regístrate y paga desde tu celular. Sin efectivo, sin tiquetes, sin demoras.
          </p>

          <button
            onClick={() => setStep("form")}
            className="mt-6 w-full py-3 rounded-xl bg-[#075e54] text-white font-semibold"
          >
            Comenzar
          </button>

          <div className="mt-10 space-y-4">
            <div className="rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="font-bold text-gray-900">✅ Registro en 1 minuto</h3>
              <p className="text-sm text-gray-600 mt-1">
                Crea tu cuenta y vincula tu método de pago de forma segura.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="font-bold text-gray-900">🚗 Entrada automática</h3>
              <p className="text-sm text-gray-600 mt-1">
                Olvida el tiquete. Todo queda registrado.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="font-bold text-gray-900">💳 Pago sin cajeros</h3>
              <p className="text-sm text-gray-600 mt-1">
                Paga desde tu celular y sal sin hacer fila.
              </p>
            </div>
          </div>
        </div>
      )} */}

      {/* FORM */}
      {step === "form" && (
        <div className="px-5 py-6">
          <h2 className="text-lg font-bold text-gray-900">Regístrate gratis a Zybo</h2>
          <p className="text-sm text-gray-600 mt-1">
            Te tomará menos de 1 minuto.
          </p>

          <div className="mt-6 space-y-4">
            {/* Teléfono */}
            <div>
              <label className="text-xs font-semibold text-gray-700  ">
                Código del pais
              </label>
              <div className="mt-1 flex gap-2 ">
                <CountryPrefixDropdown
                  value={form.countryPrefix}
                  options={prefixes}
                  onChange={(val) =>
                    setForm((p) => ({ ...p, countryPrefix: val }))
                  }
                />
                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      phone: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                  inputMode="numeric"
                  placeholder="Ej: 3001234567"
                  className="flex-1 rounded-xl border border-[#febd47] px-3 py-2 text-sm"
                />
              </div>
              <label className="text-xs font-semibold text-gray-700 flex justify-end px-26">
                Numero de celular
              </label>
              {errors.phone && (
                <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Placa */}
            <div>
              <label className="text-xs font-semibold text-gray-700">
                Placa del vehículo
              </label>
              <input
                value={form.plate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, plate: e.target.value.toUpperCase() }))
                }
                placeholder="ABC123"
                className="mt-1 w-full rounded-xl border border-[#febd47] px-3 py-2 text-sm"
              />
              {errors.plate && (
                <p className="text-xs text-red-600 mt-1">{errors.plate}</p>
              )}
            </div>

            {/* Nombre / Apellido */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700">Tu Nombre</label>
                <input
                  value={form.firstName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, firstName: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#febd47] px-3 py-2 text-sm"
                />
                {errors.firstName && (
                  <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Tu apellido</label>
                <input
                  value={form.lastName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, lastName: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#febd47] px-3 py-2 text-sm"
                />
                {errors.lastName && (
                  <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Tipo doc / Número doc */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Tipo de documento
                </label>
                <select
                  value={form.docType}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      docType: e.target.value as LandingFormData["docType"],
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#febd47] px-3 py-2 text-sm bg-white"
                >
                  <option value="Cédula">Cédula</option>
                  <option value="NIT">NIT</option>
                  <option value="Pasaporte">Cedula de extranjeria</option>
                </select>
              </div>

              <div>

                <label className=" text-xs font-semibold text-gray-700">
                  Número del documento
                </label>
                <input
                  placeholder=" propietario del vehículo"
                  value={form.docNumber}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      docNumber: e.target.value.replace(/\s+/g, ""),
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#febd47] px-1 py-2 text-sm"
                />
                {errors.docNumber && (
                  <p className="text-xs text-red-600 mt-1">{errors.docNumber}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-700">
                Correo electrónico
              </label>
              <input
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="Para facturación electronica (opcional)"
                className="mt-1 w-full rounded-xl border border-[#febd47] px-3 py-2 text-sm"
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mt-6 flex items-start gap-2">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#febd47]"
              />
              <p className="text-xs text-[#8800ff]">
                <button
                  type="button"
                  className="text-[#8800ff] font-semibold underline underline-offset-2"
                  onClick={() => setIsTermsOpen(true)}
                >
                  Conocer términos y condiciones
                </button>
              </p>
            </div>

            <div className="pt-2 flex gap-3">

              <button
                onClick={() => setStep("AddSecon_user")}
                className=" py-3 rounded-xl bg-[#8800ff] text-white font-semibold w-full"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
      {step === "AddSecon_user" && (
        <div className="sticky bottom-0 bg-white p-4 border-t">
          <h2 className="text-lg font-bold text-gray-900 py-3 ">
            Por seguridad y comodidad, agrega las personas que usan el vehículo.</h2>


          <div className="bg-gray-100 py-2 px-1  rounded-2xl">
            <label className=" text-xs font-semibold text-gray-700 flex justify-self-end px-28 ">
              Número de celular
            </label>
            <div className="mt-2 flex items-center gap-2 ">
              <CountryPrefixDropdown
                value={form.countryPrefix}
                options={prefixes}
                onChange={(val) =>
                  setForm((p) => ({ ...p, countryPrefix: val }))
                }
              />

              <input className=" flex-1 rounded-xl border border-[#febd47] px-3 py-2 text-sm bg-white"
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    phone: e.target.value.replace(/\D/g, ""),
                  }))
                }
                inputMode="numeric"
                placeholder="Ej: 3001234567"
              />

            </div>

            <button className=" mt-5 text-sm px-2 py-2 rounded-xl bg-[#8800ff] text-amber-50 flex justify-self-end"
              onClick={handleAddPhone}
            >
              Agregar usuario
            </button>

            {errors.phone && (
              <p className="text-xs text-red-600 mt-1 rounded-x1">{errors.phone}</p>
            )}
            <p className=" -mt-8 text-sm px-2 py-2 rounded-xl  text-black  italic">Opcional</p>
          </div>

          {extraPhones.length > 0 && (
            <div className="mt-4 space-y-2">
              {extraPhones.map((phone, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-xl text-sm shadow-sm"
                >
                  <span className="font-medium text-gray-800">
                    {phone}
                  </span>

                  <button
                    onClick={() =>
                      setExtraPhones((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className="text-red-500 hover:text-red-700 text-xs font-semibold"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}


          <button className="mt-50 flex-1  w-full py-3 rounded-xl bg-[#8800ff] text-white font-semibold cursor-pointer "
            onClick={() => {
              setStep("submitting");

              setTimeout(() => {
                onSubmit({
                  ...form,
                  extraPhones,
                  plate: form.plate.toUpperCase().replace(/\s+/g, ""),
                });
              }, 5000);
            }}

          >
            GUARDAR Y REGISTRARME
          </button>
        </div>
      )}

      {/* SUBMITTING */}
      {step === "submitting" && (
        <div className="h-full flex flex-col items-center justify-center px-6 text-center bg-white">
          <div className="w-10 h-10 rounded-full border-2 border-gray-300 border-t-gray-700 animate-spin" />
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mt-6">¡Felicitaciones!🎉</h1>
          <img
            src="https://i.postimg.cc/NG2q2tCm/Zybo-logo-hor-morado-amarillo.png"
            className="h-20"
            alt="Zybo"
          />
          <h2 className="text-sm text-gray-600 mt-3">
            Puedes disfrutar de pagos digitales y automáticos de estacionamiento, guías interactivas, ofertas, beneficios y mucho más, en los principales centros comerciales del país.
          </h2>
          <p>Enviamos un mensaje de confirmación a tu WhatsApp para que agregues el contacto de Zybo a tus favoritos.

          </p>
        </div>
      )}


      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        onAccept={() => {
          setAcceptedTerms(true);
          setIsTermsOpen(false);
        }}
      />
    </div>


  );
}