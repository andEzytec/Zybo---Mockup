import { useState, useEffect, useRef } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { ChatButtonGroup } from './components/ChatButtonGroup';
import { MenuList } from './components/MenuList';
import { PaymentSelector } from './components/PaymentSelector';
import { FormModal, FormData } from './components/FormModal';
import { BottomSheet } from './components/BottomSheet';
import { InviteUsersModal } from './components/InviteUsersModal';
import { Phone, Video, MoreVertical, RefreshCw } from 'lucide-react';
import { LandingWebScreen } from './components/LandingWeb';

type SheetOption = { id: string; label: string; description?: string; action: string };
type ActiveSheet = {
  title: string;
  options: SheetOption[];
  onSelect: (action: string) => void;
} | null;




type SimulationType = 'registro' | 'entrada_parqueo' | 'registro_externo' | 'landing_web' | 'usuario_referido';

type MessageType = {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: string;
  imageUrl?: string;
};

type ButtonGroupType = {
  id: string;
  buttons: Array<{
    label: string;
    action: string;
    variant?: 'primary' | 'secondary';
  }>;
};

type MenuListType = {
  id: string;
  title?: string;
  options: Array<{
    id: string;
    label: string;
    icon?: string;
    action: string;
    description?: string;
  }>;
};

type PaymentSelectorType = {
  id: string;
  showAutomatic: boolean;
  variant?: 'pay' | 'link' | 'autodebit';
};

type LandingFormData = {
  countryPrefix: string;
  phone: string;
  plate: string;
  firstName: string;
  lastName: string;
  docType: "Cédula" | "NIT" | "Pasaporte";
  docNumber: string;
  email: string;
};

type FlowStep =
  | 'welcome'
  | 'show_form_cta'
  | 'form_submitted'
  | 'reg_rut_not_found'
  | 'reg_owner_otp_wait'

  | 'registration_success'
  | 'reg_invite_step'
  | 'reg_invite_modal_open'
  | 'reg_link_pay_step'
  | 're_menu_externo' // NUEVO
  | 'vp_start'
  | 'vp_otp_wait'
  | 'vp_success'
  | 'pol_start'
  | 'pol_confirm'
  | 'pol_otp_wait'
  | 'pol_success'
  | 'pol_otp_wait_nequi'
  | 'pol_success_nequi'
  | 'pol_otp_wait_tarjeta'
  | 'pol_success_tarjeta'
  | 'pc_validando'
  | 'pc_otp_wait'
  | 'pc_success'
  | 'ep_welcome'
  | 'ep_menu'
  | 'ep_mas_opciones'
  | 'mc_menu'
  | 'mc_veh_list'
  | 'mc_veh_detail'
  | 'mc_veh_add_wait'
  | 'mc_veh_remove_confirm'
  | 'mc_usr_list'
  | 'mc_usr_detail'
  | 'mc_usr_invite_phone_wait'
  | 'mc_usr_invite_name_wait'
  | 'idle';

type VehicleRole = 'principal' | 'secundario';
type Vehicle = { plate: string; role: VehicleRole; status: string; active: boolean };
type UserType = 'principal' | 'secundario';
type UserEntry = { id: string; name: string; phone: string; type: UserType; active: boolean; vehiclePlate: string };

const ROLE_LABEL: Record<VehicleRole, string> = {
  principal: 'Principal',
  secundario: 'Secundario',
};



export default function App() {
  const [simulation, setSimulation] = useState<SimulationType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [buttonGroups, setButtonGroups] = useState<ButtonGroupType[]>([]);
  const [menuLists, setMenuLists] = useState<MenuListType[]>([]);
  const [paymentSelectors, setPaymentSelectors] = useState<PaymentSelectorType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState<FlowStep>('idle');
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(false);
  const [landingSubmitted, setLandingSubmitted] = useState(false);

  const [userData] = useState({
    name: 'Carlos',
    plate: 'ABC123',
    document: '1023456789',
    parkingTime: '02:34:15',
    parkingLevel: 'P2',
    parkingZone: 'A',
    parkingPosition: '45',
    parkingName: 'Centro Comercial Andino',
    entryTime: '14:30',
    parkingAmount: 8000,
    paymentFee: 500,
  });

  // === Gestión de cuenta (vehículos y usuarios) ===
  const [miCuentaOrigin, setMiCuentaOrigin] = useState<'ep' | 're' | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { plate: 'ABC123', role: 'principal', status: 'Débito automático activo', active: true },
    { plate: 'MNP234', role: 'principal', status: 'Sin débito automático', active: true },
    { plate: 'XYZ789', role: 'secundario', status: 'Principal: María López', active: true },
    { plate: 'QRS567', role: 'secundario', status: 'Principal: Juan Vélez', active: true },
  ]);
  const [users, setUsers] = useState<UserEntry[]>([
    { id: 'u2', name: 'Ana Gómez', phone: '301 234 5678', type: 'secundario', active: true, vehiclePlate: 'ABC123' },
    { id: 'u3', name: 'Luis Ruiz', phone: '302 345 6789', type: 'secundario', active: false, vehiclePlate: 'ABC123' },
    { id: 'u4', name: 'Sofía Díaz', phone: '305 678 9012', type: 'secundario', active: true, vehiclePlate: 'ABC123' },
    { id: 'u5', name: 'Jorge Martínez', phone: '306 789 0123', type: 'secundario', active: true, vehiclePlate: 'MNP234' },
  ]);
  const [invitePhone, setInvitePhone] = useState<string>('');
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);
  const [registeredName, setRegisteredName] = useState<string>('');
  const [registeredPlate, setRegisteredPlate] = useState<string>('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  function openSheet(config: NonNullable<ActiveSheet>) {
    setActiveSheet({
      title: config.title,
      options: config.options,
      onSelect: (action) => {
        setActiveSheet(null);
        config.onSelect(action);
      },
    });
  }

  const messagesEndRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, buttonGroups, menuLists, paymentSelectors, isTyping]);

  function getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }

  function addMessage(type: 'bot' | 'user', content: string, imageUrl?: string) {
    setMessages(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      type, content, imageUrl,
      timestamp: getCurrentTime()
    }]);
  }

  function addImageMessage(imageUrl: string) {
    setMessages(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      type: 'bot',
      content: '',
      imageUrl,
      timestamp: getCurrentTime()
    }]);
  }

  function addButtonGroup(buttons: Array<{ label: any; action: string; variant?: 'primary' | 'secondary' }>) {
    setButtonGroups(prev => [...prev, { id: Date.now().toString() + Math.random(), buttons }]);
  }

  function addMenuList(title: string | undefined, options: Array<{ id: string; label: string; action: string; description?: string }>) {
    setMenuLists(prev => [...prev, { id: Date.now().toString() + Math.random(), title, options }]);
  }

  function addPaymentSelector(showAutomatic: boolean, variant?: 'pay' | 'link' | 'autodebit') {
    setPaymentSelectors(prev => [...prev, { id: Date.now().toString() + Math.random(), showAutomatic, variant }]);
  }

  function clearInteractiveElements() {
    setButtonGroups([]);
    setMenuLists([]);
    setPaymentSelectors([]);
  }

  async function typeMessage(type: 'bot' | 'user', content: string, delay = 800) {
    if (type === 'bot') {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, delay));
      setIsTyping(false);
    }
    addMessage(type, content);
  }

  function resetChat() {
    setMessages([]);
    setButtonGroups([]);
    setMenuLists([]);
    setPaymentSelectors([]);
    setInputValue('');
    setCurrentStep('idle');
    setIsWaitingForInput(false);
    setIsTyping(false);
    setIsFormOpen(false);
  }

  function selectSimulation(sim: SimulationType) {
    resetChat();
    setSimulation(sim);
    setTimeout(() => {
      if (sim === 'registro') startRegistro();
      else if (sim === 'entrada_parqueo') startEntradaParqueadero();
      else if (sim === 'registro_externo') startRegistroExterno();
      else if (sim === 'usuario_referido') startUsuarioReferido();
    }, 300);
  }

  async function startRegistro() {
    setCurrentStep('welcome');
    await typeMessage('user', 'Quiero registrarme', 600);
    await typeMessage('bot',
      `Hola 👋\nSoy Zybo 🚗, tu asistente de movilidad y pago de parqueadero.\n\nRegístrate para hacer más fácil tu experiencia de parqueo, ganar tiempo y acceder a beneficios exclusivos en los principales centros comerciales del país.`,
      1200
    );
    setTimeout(() => {
      setCurrentStep('show_form_cta');
      addButtonGroup([
        { label: 'Conoce Zybo', action: 'open_slider_welcome', variant: 'secondary' },
        { label: 'Registrarme', action: 'open_form' },
      ]);
    }, 1200);
  }

  function handleLandingSubmit(data: LandingFormData) {
    // Se queda 2s en la landing mostrando "enviando..."
    setTimeout(async () => {
      // Vuelve a "WhatsApp"
      resetChat();
      setSimulation("registro_externo"); // para que se vea el header/chat

      // Mensaje de confirmación<FormModal

      await typeMessage(
        "bot",
        `🎉 ¡Listo ${data.firstName}! Tu registro fue exitoso.\n\n✅ Ya puedes gestionar tu cuenta y usar nuestros servicios cuando estés en un centro comercial.`,
        900
      );

      // Menú principal (tu menú ya existente)
      setTimeout(() => {
        addButtonGroup([

          { label: '💳 Vincular Medio De Pago', action: 'vincular_desde_registro' },
          { label: 'Lo haré después', action: 'done', variant: 'secondary' }

        ]);
      }, 400);
    }, 2000);
  }

  async function startRegistroExterno() {
    setCurrentStep('welcome');
    // Mensaje de campaña/QR externo
    await typeMessage('user', 'Quiero registrarme', 600);
    await typeMessage('bot',
      `Hola 👋\nSoy Zybo 🚗, tu asistente de movilidad y pago de parqueadero.\n\nRegístrate para hacer más fácil tu experiencia de parqueo, ganar tiempo y acceder a beneficios exclusivos en los principales centros comerciales del país.`,
      1200
    );
    setTimeout(() => {
      setCurrentStep('show_form_cta');
      addButtonGroup([
        { label: 'Conoce Zybo', action: 'open_slider_welcome', variant: 'secondary' },
        { label: 'Registrarme', action: 'open_form' },
      ]);
    }, 1200);
  }

  async function startUsuarioReferido() {
    setCurrentStep('welcome');

    // Datos ejemplo (luego si quieres los hacemos dinámicos)
    const refName = 'María Pérez';
    const refPhone = ' 300 987 6543';

    await typeMessage(
      'bot',
      `👋 ¡Hola!\n\n📩 ${refName} (${refPhone}) te invitó a unirte a Zybo 🚗.\n\n🎁 Si completas tu registro ahora, recibirás *1 hora de parqueadero gratis* en parqueaderos aliados.\n\nPara continuar, completa el formulario 👇`,
      1100
    );

    // Botón que abre tu FormModal (ya existente)
    setTimeout(() => {
      addButtonGroup([
        { label: '📝 Registrarme ahora', action: 'open_form' }
      ]);
      setCurrentStep('show_form_cta');
    }, 600);
  }


  async function handleFormSubmit(formData: FormData) {
    setIsFormOpen(false);
    setCurrentStep('form_submitted');
    addMessage('user', 'Formulario completado ✅');

    setTimeout(async () => {
      const plate = (formData.plate || '').toUpperCase().replace(/\s+/g, '');

      // ESCENARIO: Placa no está en RUT -> volver al formulario
      if (plate === 'ABC456') {
        setCurrentStep('reg_rut_not_found');
        await typeMessage(
          'bot',
          `⚠️ No encontramos la placa *${plate}* en el RUT.\n\nPor favor verifica la placa e intenta de nuevo.`,
          1000
        );
        setTimeout(() => {
          setCurrentStep('show_form_cta');
          addButtonGroup([{ label: 'Corregir mis datos', action: 'open_form' }]);
        }, 600);
        return;
      }

      // ESCENARIO: Ya tiene usuario principal -> OTP al propietario
      if (plate === 'ABC789') {
        setCurrentStep('reg_owner_otp_wait');
        await typeMessage(
          'bot',
          `🔐 Este vehículo ya tiene un usuario principal.\n\nPor favor, ingresa el código de verificación enviado al usuario principal al celular ${formData.phone ?? ''} del vehículo de placa ${formData.plate}.`,
          1200
        );
        setIsWaitingForInput(true);
        return;
      }

      // ÉXITO (ABC123 o cualquier otra placa)
      setRegisteredName(formData.name);
      setRegisteredPlate(plate);
      setCurrentStep('registration_success');
      await typeMessage(
        'bot',
        `🎉 ¡Felicitaciones ${formData.name}! Ahora eres parte de Zybo.\n\nAhora podrás pagar sin filas tu parqueadero y disfrutar de otros beneficios exclusivos de Zybo.`,
        1200
      );
      setTimeout(() => showInviteUsersStep(), 700);
    }, 1800);
  }

  async function showInviteUsersStep() {
    clearInteractiveElements();
    setCurrentStep('reg_invite_step');
    await typeMessage(
      'bot',
      'Si tienes otras personas que manejan este vehículo, puedes invitarlas ahora.',
      900
    );
    setTimeout(() => {
      addButtonGroup([
        { label: 'Conoce Zybo', action: 'open_slider_invite', variant: 'secondary' },
        { label: 'Invitar usuarios', action: 'invite_users_open' },
        { label: 'Lo haré después', action: 'skip_invite_users', variant: 'secondary' },
      ]);
    }, 400);
  }

  async function handleInviteUsersSubmit(phones: string[]) {
    setIsInviteModalOpen(false);
    addMessage('user', `${phones.length} ${phones.length === 1 ? 'invitación enviada' : 'invitaciones enviadas'}`);
    setTimeout(async () => {
      await typeMessage(
        'bot',
        `✅ Listo. Enviamos un mensaje de Zybo a ${phones.length === 1 ? 'esa persona' : `esas ${phones.length} personas`} indicando que ${registeredName || 'tú'} ${phones.length === 1 ? 'la' : 'las'} invitó a manejar el vehículo ${registeredPlate}.\n\nQuedarán activas cuando acepten la invitación.`,
        1100
      );
      setTimeout(() => showVincularPagoStep(), 600);
    }, 400);
  }

  async function showVincularPagoStep() {
    clearInteractiveElements();
    setCurrentStep('reg_link_pay_step');
    await typeMessage(
      'bot',
      'Para hacerte las cosas aún más fáciles, registra un medio de pago para que nunca tengas que hacer fila para pagar el estacionamiento.',
      900
    );
    setTimeout(() => {
      const linkAction = simulation === 'registro_externo' ? 'vincular_desde_pago' : 'vincular_desde_registro';
      const skipAction = simulation === 'registro_externo' ? 'volver_inicio' : 'done';
      addButtonGroup([
        { label: 'Conoce Zybo', action: 'open_slider_payment', variant: 'secondary' },
        { label: 'Vincular medio de pago', action: linkAction },
        { label: 'Lo haré después', action: skipAction, variant: 'secondary' },
      ]);
    }, 400);
  }


  async function runVincularPagoDaviplata() {
    clearInteractiveElements();
    addMessage('user', 'Vincular medio de pago');
    await typeMessage('bot', 'Elige el medio de pago que deseas vincular:', 800);
    addPaymentSelector(true, 'link');
  }

  async function handleDaviplataSelected() {
    clearInteractiveElements();
    addMessage('user', 'Daviplata');
    await typeMessage('bot',
      `Al activar pagos por Daviplata, se realizarán de forma automática por el valor del parqueo más $799 + IVA por la transacción.`,
      900
    );
    setTimeout(async () => {
      await typeMessage('bot',
        `Digita el código de confirmación que recibiste por mensaje de texto. Recuerda que tiene vigencia de 3 minutos.`,
        800
      );
      setCurrentStep('vp_otp_wait');
      setIsWaitingForInput(true);
    }, 1000);
  }

  async function handleVpOtp(value: string) {
    setIsWaitingForInput(false);
    if (value.length === 4 && /^\d+$/.test(value)) {
      setCurrentStep('vp_success');
      await typeMessage('bot',
        `👌 ¡Todo listo! Ahora podrás usar Daviplata para pagar los servicios de nuestros parqueaderos afiliados en todo el país, sin filas, sin cajeros, sin tiquetes y sin demoras.\n\nDebitaremos de tu medio de pago el valor del servicio cuando salgas del parqueadero.`,
        1200
      );
      setTimeout(() => {
        resetChat();
        setSimulation(null);
      }, 3000);
    } else {
      await typeMessage('bot',
        'El código digitado no es válido. Por favor ingresa el código de 4 dígitos que recibiste por mensaje de texto.',
        800
      );
      setIsWaitingForInput(true);
    }
  }

  async function startPagoEnLinea() {
    setCurrentStep('pol_start');
    await typeMessage('bot', '¿Cómo puedo ayudarte ahora?', 600);
    setTimeout(() => {
      addMenuList('Menú principal', [
        { id: 'pol', label: 'Pagar', action: 'pol_select', description: `Tu vehículo ${userData.plate} lleva ${userData.parkingTime} en el parqueo` },
        { id: 'other', label: 'Otras opciones', action: 'done' }
      ]);
    }, 800);
  }

  async function runPagoEnLinea() {
    clearInteractiveElements();
    addMessage('user', 'Pagar');
    await typeMessage('bot', `Elige un medio de pago👇🏼`, 900);
    setCurrentStep('pol_confirm');
    addPaymentSelector(false, 'pay');
  }

  async function handlePolDaviplataSelected() {
    clearInteractiveElements();
    const total = userData.parkingAmount + userData.paymentFee + Math.floor(userData.paymentFee * 0.19);
    const lastFour = userData.document.slice(-4);
    await typeMessage('bot',
      `Tu vehículo ${userData.plate} lleva ${userData.parkingTime} de parqueo.\n\nTarifa Daviplata: $${userData.paymentFee.toLocaleString('es-CO')} + IVA\n\nEl total a pagar es $${total.toLocaleString('es-CO')}\n\nLa cuenta de Daviplata de este celular debe estar asociada al documento *****${lastFour}`,
      1000
    );
    setTimeout(() => {
      addButtonGroup([
        { label: 'Pagar', action: 'pol_pay' },
        { label: 'Cambiar la cédula', action: 'done', variant: 'secondary' }
      ]);
    }, 100);
  }

  async function handlePolNequiSelected() {
    clearInteractiveElements();
    const total = userData.parkingAmount + userData.paymentFee + Math.floor(userData.paymentFee * 0.19);
    const lastFour = userData.document.slice(-4);
    await typeMessage('bot',
      `Tu vehículo ${userData.plate} lleva ${userData.parkingTime} de parqueo.\n\nTarifa Nequi: $${userData.paymentFee.toLocaleString('es-CO')} + IVA\n\nEl total a pagar es $${total.toLocaleString('es-CO')}\n\nLa cuenta de Nequi de este celular debe estar asociada al documento *****${lastFour}`,
      1000
    );
    setTimeout(() => {
      addButtonGroup([
        { label: 'Pagar', action: 'pol_pay_nequi' },
        { label: 'Cambiar la cédula', action: 'done', variant: 'secondary' }
      ]);
    }, 100);
  }

  async function handlePolTarjetaSelected() {
    clearInteractiveElements();
    const fee = 800;
    const total = userData.parkingAmount + fee + Math.floor(fee * 0.19);
    await typeMessage('bot',
      `Tu vehículo ${userData.plate} lleva ${userData.parkingTime} de parqueo.\n\nTarifa Tarjeta: $${fee.toLocaleString('es-CO')} + IVA\n\nEl total a pagar es $${total.toLocaleString('es-CO')}\n\nIngresa los datos de tu tarjeta de crédito de forma segura.`,
      1000
    );
    setTimeout(() => {
      addButtonGroup([
        { label: 'Continuar al pago seguro', action: 'pol_pay_tarjeta' },
        { label: 'Cancelar', action: 'done', variant: 'secondary' }
      ]);
    }, 100);
  }

  async function runPolOtp() {
    clearInteractiveElements();
    addMessage('user', 'Pagar');
    await typeMessage('bot',
      'Digita el código de confirmación que recibiste por mensaje de texto. Recuerda que tiene vigencia de 3 minutos.',
      800
    );
    setCurrentStep('pol_otp_wait');
    setIsWaitingForInput(true);
  }

  async function runPolOtpNequi() {
    clearInteractiveElements();
    addMessage('user', 'Pagar');
    await typeMessage('bot',
      'Digita el código de confirmación que recibiste por mensaje de texto en tu celular Nequi. Recuerda que tiene vigencia de 3 minutos.',
      800
    );
    setCurrentStep('pol_otp_wait_nequi');
    setIsWaitingForInput(true);
  }

  async function runPolOtpTarjeta() {
    clearInteractiveElements();
    addMessage('user', 'Continuar al pago seguro');
    await typeMessage('bot',
      'Ingresa el código OTP enviado a tu correo electrónico registrado con tu tarjeta. Tiene vigencia de 5 minutos.',
      800
    );
    setCurrentStep('pol_otp_wait_tarjeta');
    setIsWaitingForInput(true);
  }

  async function handlePolOtp(value: string) {
    setIsWaitingForInput(false);
    const total = userData.parkingAmount + userData.paymentFee + Math.floor(userData.paymentFee * 0.19);
    if (value.length >= 4 && /^\d+$/.test(value)) {
      setCurrentStep('pol_success');
      await typeMessage('bot',
        `Gracias Carlos, hemos recibido tu pago por valor de $${total.toLocaleString('es-CO')}. En unos minutos te enviaremos tu factura electrónica.\n\n¡Gracias por visitarnos! Tienes 15 minutos para salir del parqueadero.\n\nPara evitar filas y demoras en tus próximas visitas a ${userData.parkingName}, te recomiendo vincular un medio de pago.`,
        1200
      );
      addButtonGroup([
        { label: '💳 Vincular medio de pago', action: 'vincular_desde_pago' },
        { label: 'Lo haré después', action: 'volver_inicio', variant: 'secondary' }
      ]);
    } else {
      await typeMessage('bot',
        'El código digitado no es válido. Por favor ingresa el código que recibiste por mensaje de texto.',
        800
      );
      setIsWaitingForInput(true);
    }
  }

  async function handlePolOtpNequiHandler(value: string) {
    setIsWaitingForInput(false);
    const total = userData.parkingAmount + userData.paymentFee + Math.floor(userData.paymentFee * 0.19);
    if (value.length >= 4 && /^\d+$/.test(value)) {
      setCurrentStep('pol_success_nequi');
      await typeMessage('bot',
        `Gracias Carlos, hemos recibido tu pago por valor de $${total.toLocaleString('es-CO')} mediante Nequi. En unos minutos te enviaremos tu factura electrónica.\n\n¡Gracias por visitarnos! Tienes 15 minutos para salir del parqueadero.\n\nPara pagar automaticamente sin pasar por cajeros evitando uso de efectivo, vincula tus datos de pago`,
        1200
      );
      addButtonGroup([
        { label: '💳 Vincular medio de pago', action: 'vincular_desde_pago' },
        { label: 'Lo haré después', action: 'volver_inicio', variant: 'secondary' }
      ]);
    } else {
      await typeMessage('bot',
        'El código digitado no es válido. Por favor ingresa el código que recibiste por mensaje de texto.',
        800
      );
      setIsWaitingForInput(true);
    }
  }

  async function handlePolOtpTarjetaHandler(value: string) {
    setIsWaitingForInput(false);
    const fee = 800;
    const total = userData.parkingAmount + fee + Math.floor(fee * 0.19);
    if (value.length >= 4 && /^\d+$/.test(value)) {
      setCurrentStep('pol_success_tarjeta');
      await typeMessage('bot',
        `Gracias Carlos, hemos recibido tu pago por valor de $${total.toLocaleString('es-CO')} mediante Tarjeta de Crédito. En unos minutos te enviaremos tu factura electrónica.\n\n¡Gracias por visitarnos! Tienes 15 minutos para salir del parqueadero.\n\n Para pagar automaticamente sin pasar por cajeros evitando uso de efectivo, vincula tus datos de pago.`,
        1200
      );
      addButtonGroup([
        { label: '💳 Vincular medio de pago', action: 'vincular_desde_pago' },
        { label: 'Lo haré después', action: 'volver_inicio', variant: 'secondary' }
      ]);
    } else {
      await typeMessage('bot',
        'El código OTP no es válido. Por favor ingresa el código que recibiste por correo electrónico.',
        800
      );
      setIsWaitingForInput(true);
    }
  }

  const [tooltip, setTooltip] = useState<{ text: string; visible: boolean }>({ text: '', visible: false });

  function showTooltip(text: string, duration = 4000) {
    setTooltip({ text, visible: true });
    setTimeout(() => setTooltip({ text: '', visible: false }), duration);
  }

  async function handlePuntosColombiaSelected() {
    clearInteractiveElements();
    addMessage('user', 'Puntos Colombia');
    setCurrentStep('pc_validando');
    showTooltip('ℹ️ Si el usuario NO estuviera registrado en Puntos Colombia, aquí se mostraría el selector sin esta opción y un mensaje indicando cómo registrarse.', 6000);
    const valorParqueo = userData.parkingAmount;
    const valorConRecargo = Math.ceil(valorParqueo * 1.10);
    const puntosADebitar = Math.ceil(valorConRecargo / 6);
    const lastFour = userData.document.slice(-4);
    setTimeout(async () => {
      await typeMessage('bot',
        `✅ ¡Tienes Puntos Colombia disponibles!\n\nValor del parqueo: $${valorParqueo.toLocaleString('es-CO')}\nPuntos a debitar: *${puntosADebitar.toLocaleString('es-CO')} pts* (equivale a $${valorConRecargo.toLocaleString('es-CO')})\n\nLa cuenta de Puntos Colombia debe estar asociada al documento *****${lastFour}`,
        1100,
      );
      setTimeout(async () => {
        showTooltip('ℹ️ Si el usuario NO tuviera cupo suficiente, el bot le informaría y le ofrecería elegir otro método de pago.', 6000);
        await typeMessage('bot',
          '📲 Te hemos enviado un OTP por mensaje de texto para confirmar el pago. Recuerda que tiene vigencia de 3 minutos.\n\nDigita el código para continuar:',
          1000
        );
        setCurrentStep('pc_otp_wait');
        setIsWaitingForInput(true);
      }, 1200);
    }, 1500);
  }

async function handleOwnerOtp(value: string) {
  setIsWaitingForInput(false);

  // Código demo válido
  if (value.trim() === '1234') {
    setCurrentStep('registration_success');

    await typeMessage(
      'bot',
      `✅ Código validado correctamente.\n\n🎉 Tu registro fue autorizado por el propietario principal.`,
      1200
    );

    setTimeout(async () => {
      const nombre = registeredName || '';
      await typeMessage(
        'bot',
        `🎉 ¡Felicitaciones${nombre ? ' ' + nombre : ''}! Ahora eres parte de Zybo.\n\nAhora podrás pagar sin filas tu parqueadero y disfrutar de otros beneficios exclusivos de Zybo.`,
        1000
      );
      setTimeout(() => showInviteUsersStep(), 600);
    }, 600);

  } else {
    await typeMessage(
      'bot',
      '❌ El código no es válido. Por favor intenta nuevamente.',
      800
    );
    setIsWaitingForInput(true);
  }
}

  async function handlePcOtp(value: string) {
    setIsWaitingForInput(false);
    const valorParqueo = userData.parkingAmount;
    const valorConRecargo = Math.ceil(valorParqueo * 1.10);
    const puntosADebitar = Math.ceil(valorConRecargo / 6);
    if (value.length >= 4 && /^\d+$/.test(value)) {
      setCurrentStep('pc_success');
      await typeMessage('bot',
        `🎉 ¡Pago exitoso con Puntos Colombia!\n\nHemos debitado *${puntosADebitar.toLocaleString('es-CO')} puntos* de tu cuenta.\n\nAdemás, te obsequiamos *5 puntos Colombia* por pagar tu parqueo con nosotros. 🎁\n\nTienes 15 minutos para salir del parqueadero. En unos minutos recibirás tu factura electrónica.\n\n¡Gracias por visitarnos en ${userData.parkingName}!`,
        1300
      );
    } else {
      showTooltip('ℹ️ Si el código fuera incorrecto, el bot permite reintentarlo hasta 3 veces antes de cancelar.', 5000);
      await typeMessage('bot',
        '❌ El código ingresado no es válido. Por favor digita nuevamente el OTP que recibiste por mensaje de texto.',
        800
      );
      setIsWaitingForInput(true);
    }
  }

  async function startEntradaParqueadero() {
    setCurrentStep('ep_welcome');
    await new Promise(resolve => setTimeout(resolve, 600));
    addImageMessage('https://i.postimg.cc/FRP58ZWW/atlantis.jpg');
    await typeMessage('bot',
      `👋 ¡Hola Andres! Bienvenido a ${userData.parkingName}.\n\nRegistramos tu ingreso al parqueadero a las ${userData.entryTime}.\n\nElige una opción para continuar 👇`,
      1200
    );
    setTimeout(() => {
      setCurrentStep('ep_menu');
      addButtonGroup([
        { label: 'Pagar', action: 'ep_pagar' },
        { label: 'Tiquete de parqueadero', action: 'ep_tiquete' },
        { label: 'Más opciones', action: 'ep_mas_opciones' },
      ]);
    }, 600);
  }
  function showMenuRegistroExterno() {
    setCurrentStep('re_menu_externo');
    addMenuList('Ver opciones', [
      {
        id: 'debito',
        label: 'Débito automático',
        action: 're_debito',
        description: 'Paga sin filas, con cargo automático al salir.'
      },
      {
        id: 'medio_favorito',
        label: 'Medio de pago favorito',
        action: 're_medio_favorito',
        description: 'Elige el método de pago principal para tu débito automático.'
      },
      {
        id: 'eliminar_pago',
        label: 'Eliminar medio de pago',
        action: 're_eliminar_pago',
        description: 'Desvincula medios de pago inscritos.'
      },
      {
        id: 'mi_cuenta',
        label: 'Mi cuenta',
        action: 're_mi_cuenta',
        description: 'Administra tus usuarios y tus vehículos.'
      },
      {
        id: 'centro_comercial',
        label: '¡Centro comercial! 🏬',
        action: 're_centro_comercial',
        description: 'Estoy en un centro comercial.'
      },
      {
        id: 'regresar',
        label: 'Regresar',
        action: 're_regresar',
        description: 'Ver opciones de pago de tu parqueo.'
      },
    ]);
  }

  async function handleEpTiquete() {
    clearInteractiveElements();
    addMessage('user', 'Tiquete de parqueadero');
    const pin = Math.floor(1000 + Math.random() * 9000);
    await typeMessage('bot',
      `🎟️ Tu tiquete de parqueadero está listo.\n\nPIN: *${pin}*\nVehículo: ${userData.plate}\n\n<a href="https://i.ibb.co/Z6HTnR7P/tiquete.jpg" target="_blank" rel="noopener noreferrer" style="color: #0066cc; text-decoration: underline;">Descargar Tiquete PDF</a>\n\nPresenta este PIN o el PDF en el cajero para realizar tu pago.`,
      1000
    );
    setTimeout(() => {
      resetChat();
      setSimulation(null);
    }, 5000);
  }

  async function handleEpMasOpciones() {
    clearInteractiveElements();
    addMessage('user', 'Más opciones');
    setCurrentStep('ep_mas_opciones');
    await typeMessage('bot', '¿Cómo puedo ayudarte ahora?', 500);
    setTimeout(() => {
      addMenuList('Menú principal', [
        { id: 'debito', label: 'Débito automático', action: 'ep_debito', description: 'Paga sin filas, con cargo automático al salir.' },
        { id: 'medio_favorito', label: 'Medio de pago favorito', action: 'ep_medio_favorito', description: 'Elige el método de pago principal para tu débito automático.' },
        { id: 'eliminar_pago', label: 'Eliminar medio de pago', action: 'ep_eliminar_pago', description: 'Desvincula medios de pago inscritos.' },
        { id: 'localizacion', label: 'Localización', action: 'ep_localizacion', description: 'Encuentra fácil dónde parqueaste tu vehículo.' },
        { id: 'mi_cuenta', label: 'Mi cuenta', action: 'ep_mi_cuenta', description: 'Administra tus usuarios y tus vehículos.' },
        { id: 'regresar', label: 'Regresar', action: 'ep_regresar', description: 'Ver opciones de pago de tu parqueo.' },
      ]);
    }, 500);
  }

  async function handleEpLocalizacion() {
    clearInteractiveElements();
    addMessage('user', 'Localización');
    await typeMessage('bot',
      `📍 Tu vehículo *${userData.plate}* se encuentra en:\n\n🏢 Nivel: ${userData.parkingLevel}\n📌 Zona: ${userData.parkingZone}\n🅿️ Posición: ${userData.parkingPosition}\n\n🗺️ [Ver en el mapa]`,
      900
    );
    setTimeout(() => {
      addButtonGroup([{ label: '⬅️ Volver', action: 'ep_volver_mas' }]);
    }, 500);
  }

  async function handleEpGenerico(label: string) {
    clearInteractiveElements();
    addMessage('user', label);
    await typeMessage('bot', '🚧 Esta funcionalidad estará disponible próximamente.', 700);
    setTimeout(() => {
      addButtonGroup([{ label: '⬅️ Volver', action: 'ep_volver_mas' }]);
    }, 500);
  }

  // ========== MI CUENTA ==========
  function showMiCuenta(origin: 'ep' | 're') {
    clearInteractiveElements();
    setMiCuentaOrigin(origin);
    setCurrentStep('mc_menu');
    addMessage('user', 'Mi cuenta');
    const hasPrincipalVehicle = vehicles.some(v => v.role === 'principal' && v.active);
    setTimeout(async () => {
      await typeMessage('bot', 'Bienvenido a Mi cuenta. ¿Qué quieres administrar?', 700);
      const options = [
        { id: 'vehiculos', label: 'Mis vehículos', action: 'mc_vehiculos', description: 'Vehículos a los que estás asociado.' },
      ];
      if (hasPrincipalVehicle) {
        options.push({ id: 'usuarios', label: 'Mis usuarios', action: 'mc_usuarios', description: 'Usuarios secundarios de tu vehículo principal.' });
      }
      options.push({ id: 'volver', label: 'Volver', action: 'mc_volver', description: 'Regresar al menú anterior.' });
      addMenuList('Mi cuenta', options);
    }, 300);
  }

  function backToMiCuentaOrigin() {
    clearInteractiveElements();
    if (miCuentaOrigin === 're') {
      setTimeout(() => showMenuRegistroExterno(), 300);
    } else {
      setTimeout(() => handleEpMasOpciones(), 300);
    }
  }

  // ---- Vehículos ----
  function showVehiclesList() {
    clearInteractiveElements();
    addMessage('user', 'Mis vehículos');
    setCurrentStep('mc_veh_list');
    const activos = vehicles.filter(v => v.active);
    setTimeout(async () => {
      const texto = activos.length === 0
        ? 'No tienes vehículos asociados a tu cuenta.'
        : `Vehículos asociados a tu cuenta:\n\n${activos.map(v => `• ${v.plate} — ${ROLE_LABEL[v.role]}\n  ${v.status}`).join('\n\n')}`;
      await typeMessage('bot', texto, 900);
      setTimeout(() => {
        const btns: Array<{ label: string; action: string; variant?: 'primary' | 'secondary' }> = [
          { label: 'Agregar vehículo', action: 'mc_veh_add' },
        ];
        if (activos.length > 0) btns.push({ label: 'Eliminar vehículo', action: 'mc_veh_remove_flow' });
        btns.push({ label: 'Volver al menú principal', action: 'mc_back_menu', variant: 'secondary' });
        addButtonGroup(btns);
      }, 400);
    }, 300);
  }

  function startRemoveVehicleFlow() {
    clearInteractiveElements();
    addMessage('user', 'Eliminar vehículo');
    const activos = vehicles.filter(v => v.active);
    if (activos.length === 0) {
      setTimeout(async () => {
        await typeMessage('bot', 'No hay vehículos activos para desvincular.', 700);
        setTimeout(() => addButtonGroup([
          { label: 'Volver a Mis vehículos', action: 'mc_vehiculos', variant: 'secondary' },
        ]), 300);
      }, 300);
      return;
    }
    setTimeout(async () => {
      await typeMessage('bot', 'Elige el vehículo que deseas desvincular:', 700);
      const options = activos.map(v => ({
        id: v.plate,
        label: `${v.plate} — ${ROLE_LABEL[v.role]}`,
        action: `mc_veh_remove:${v.plate}`,
        description: v.status,
      }));
      options.push({ id: 'cancel', label: 'Cancelar', action: 'mc_vehiculos', description: 'Volver a Mis vehículos.' });
      addMenuList('Seleccionar vehículo', options);
    }, 300);
  }

  async function startAddVehicle() {
    clearInteractiveElements();
    addMessage('user', 'Agregar vehículo');
    setCurrentStep('mc_veh_add_wait');
    await typeMessage('bot', 'Escribe la placa del vehículo que quieres asociar (ej. ABC123).\n\nDemo: usa NEW001 para éxito, NEW002 para OTP al propietario, NEW003 para simular caída del RUNT.', 800);
    setIsWaitingForInput(true);
  }

  async function handleAddVehicleInput(rawPlate: string) {
    setIsWaitingForInput(false);
    const plate = rawPlate.toUpperCase().replace(/\s+/g, '');
    await typeMessage('bot', `Validando placa ${plate} con RUNT (consulta asíncrona con reintentos)...`, 1500);

    if (plate === 'NEW002') {
      await typeMessage('bot',
        `El vehículo ${plate} ya tiene un usuario principal.\n\nEnviamos un OTP al celular del propietario para autorizar la asociación. Ingresa el código recibido.`,
        1000
      );
      setCurrentStep('reg_owner_otp_wait');
      setIsWaitingForInput(true);
      return;
    }

    if (plate === 'NEW003') {
      await typeMessage('bot', 'El RUNT no respondió luego de varios reintentos. Por favor intenta más tarde.', 900);
    } else if (vehicles.some(v => v.plate === plate)) {
      await typeMessage('bot', `La placa ${plate} ya está asociada a tu cuenta.`, 900);
    } else if (plate === 'NEW001' || /^[A-Z]{3}\d{3}$/.test(plate)) {
      setVehicles(prev => [...prev, { plate, role: 'secundario', status: 'Validado con RUNT', active: true }]);
      await typeMessage('bot', `${plate} fue validada en el RUNT y asociada a tu cuenta.`, 900);
    } else {
      await typeMessage('bot', `La placa ${plate} no aparece en el RUNT o no estás autorizado.`, 900);
    }

    setTimeout(() => {
      addButtonGroup([
        { label: 'Ver mis vehículos', action: 'mc_vehiculos' },
        { label: 'Mi cuenta', action: 'mc_back_menu', variant: 'secondary' },
      ]);
    }, 400);
  }

  function confirmRemoveVehicle(plate: string) {
    clearInteractiveElements();
    addMessage('user', `Desvincular ${plate}`);
    setCurrentStep('mc_veh_remove_confirm');
    setTimeout(async () => {
      await typeMessage('bot',
        `¿Seguro que deseas desvincular la placa ${plate}?\n\nPor normativa (Superintendencia de Industria y Comercio), el registro no se elimina: solo se marca como inactivo y puede reactivarse después.`,
        1000
      );
      showTooltip('Bug conocido: al desvincular, el sistema aún no elimina correctamente las entradas/salidas históricas del vehículo.', 6000);
      addButtonGroup([
        { label: 'Sí, desvincular', action: `mc_veh_remove_ok:${plate}` },
        { label: 'Cancelar', action: 'mc_vehiculos', variant: 'secondary' },
      ]);
    }, 300);
  }

  async function doRemoveVehicle(plate: string) {
    clearInteractiveElements();
    addMessage('user', 'Sí, desvincular');
    setVehicles(prev => prev.map(v => v.plate === plate ? { ...v, active: false } : v));
    await typeMessage('bot', `La placa ${plate} fue marcada como inactiva.`, 800);
    setTimeout(() => {
      addButtonGroup([
        { label: 'Ver mis vehículos', action: 'mc_vehiculos' },
        { label: 'Mi cuenta', action: 'mc_back_menu', variant: 'secondary' },
      ]);
    }, 400);
  }

  // ---- Usuarios ----
  function getSecundariosDeCarlos() {
    const placasPrincipales = vehicles
      .filter(v => v.role === 'principal' && v.active)
      .map(v => v.plate);
    return users.filter(u => placasPrincipales.includes(u.vehiclePlate) && u.active);
  }

  function showUsersList() {
    clearInteractiveElements();
    addMessage('user', 'Mis usuarios');
    setCurrentStep('mc_usr_list');
    const placasPrincipales = vehicles
      .filter(v => v.role === 'principal' && v.active)
      .map(v => v.plate);
    const secundarios = getSecundariosDeCarlos();
    setTimeout(async () => {
      if (placasPrincipales.length === 0) {
        await typeMessage('bot', 'No eres principal en ningún vehículo. La gestión de usuarios secundarios solo está disponible para el usuario principal.', 900);
        setTimeout(() => addButtonGroup([
          { label: 'Volver al menú principal', action: 'mc_back_menu', variant: 'secondary' },
        ]), 300);
        return;
      }
      let texto: string;
      if (secundarios.length === 0) {
        texto = 'Aún no hay usuarios secundarios asociados a tus vehículos.';
      } else {
        const grupos = placasPrincipales
          .map(plate => {
            const delGrupo = secundarios.filter(u => u.vehiclePlate === plate);
            if (delGrupo.length === 0) return null;
            const lineas = delGrupo.map(u => `  • ${u.name} — ${u.phone}`).join('\n');
            return `Vehículo ${plate}:\n${lineas}`;
          })
          .filter(Boolean)
          .join('\n\n');
        texto = `Usuarios secundarios asociados a tus vehículos:\n\n${grupos}`;
      }
      await typeMessage('bot', texto, 900);
      setTimeout(() => {
        const btns: Array<{ label: string; action: string; variant?: 'primary' | 'secondary' }> = [
          { label: 'Agregar usuario', action: 'mc_usr_invite' },
        ];
        if (secundarios.length > 0) btns.push({ label: 'Eliminar usuario', action: 'mc_usr_remove_flow' });
        btns.push({ label: 'Volver al menú principal', action: 'mc_back_menu', variant: 'secondary' });
        addButtonGroup(btns);
      }, 400);
    }, 300);
  }

  function startRemoveUserFlow() {
    clearInteractiveElements();
    addMessage('user', 'Eliminar usuario');
    const secundarios = getSecundariosDeCarlos();
    if (secundarios.length === 0) {
      setTimeout(async () => {
        await typeMessage('bot', 'No hay usuarios secundarios activos para eliminar.', 700);
        setTimeout(() => addButtonGroup([
          { label: 'Volver a Mis usuarios', action: 'mc_usuarios', variant: 'secondary' },
        ]), 300);
      }, 300);
      return;
    }
    setTimeout(async () => {
      await typeMessage('bot', 'Elige el usuario que deseas eliminar:', 700);
      const options = secundarios.map(u => ({
        id: u.id,
        label: u.name,
        action: `mc_usr_remove:${u.id}`,
        description: `${u.phone} · Vehículo ${u.vehiclePlate}`,
      }));
      options.push({ id: 'cancel', label: 'Cancelar', action: 'mc_usuarios', description: 'Volver a Mis usuarios.' });
      addMenuList('Seleccionar usuario', options);
    }, 300);
  }

  function confirmRemoveUser(id: string) {
    clearInteractiveElements();
    const u = users.find(x => x.id === id);
    if (!u) return;
    addMessage('user', `Eliminar ${u.name}`);
    setTimeout(async () => {
      await typeMessage('bot',
        `¿Seguro que deseas eliminar a ${u.name}?\n\nPor normativa (Superintendencia de Industria y Comercio), el registro no se elimina: solo se marca como inactivo para gestión de PQR y puede reactivarse después.`,
        1000
      );
      addButtonGroup([
        { label: 'Sí, eliminar', action: `mc_usr_remove_ok:${id}` },
        { label: 'Cancelar', action: 'mc_usuarios', variant: 'secondary' },
      ]);
    }, 300);
  }

  async function doRemoveUser(id: string) {
    clearInteractiveElements();
    const u = users.find(x => x.id === id);
    if (!u) return;
    addMessage('user', 'Sí, eliminar');
    setUsers(prev => prev.map(x => x.id === id ? { ...x, active: false } : x));
    await typeMessage('bot', `El usuario ${u.name} fue marcado como inactivo.`, 800);
    setTimeout(() => {
      addButtonGroup([
        { label: 'Volver a Mis usuarios', action: 'mc_usuarios' },
        { label: 'Mi cuenta', action: 'mc_back_menu', variant: 'secondary' },
      ]);
    }, 400);
  }

  async function startInviteUser() {
    clearInteractiveElements();
    addMessage('user', 'Invitar usuario');
    setCurrentStep('mc_usr_invite_phone_wait');
    await typeMessage('bot', 'Escribe el celular del usuario que quieres invitar (ej. 3001234567).', 700);
    setIsWaitingForInput(true);
  }

  async function handleInvitePhoneInput(phone: string) {
    setIsWaitingForInput(false);
    setInvitePhone(phone);
    setCurrentStep('mc_usr_invite_name_wait');
    await typeMessage('bot', 'Ahora escribe el nombre del usuario.', 700);
    setIsWaitingForInput(true);
  }

  async function handleInviteNameInput(name: string) {
    setIsWaitingForInput(false);
    const newId = 'u' + Date.now();
    const principalVehicle = vehicles.find(v => v.role === 'principal' && v.active);
    const targetPlate = principalVehicle?.plate ?? 'ABC123';
    setUsers(prev => [...prev, { id: newId, name, phone: invitePhone, type: 'secundario', active: true, vehiclePlate: targetPlate }]);
    await typeMessage('bot',
      `Invitación enviada a ${name} (${invitePhone}) para el vehículo ${targetPlate}.\n\nQuedará activo cuando acepte la invitación. Los pagos automáticos seguirán siendo responsabilidad del usuario principal.`,
      1000
    );
    setInvitePhone('');
    setTimeout(() => {
      addButtonGroup([
        { label: 'Ver mis usuarios', action: 'mc_usuarios' },
        { label: 'Mi cuenta', action: 'mc_back_menu', variant: 'secondary' },
      ]);
    }, 400);
  }

  async function toggleUser(id: string) {
    clearInteractiveElements();
    const u = users.find(x => x.id === id);
    if (!u) return;
    const newActive = !u.active;
    addMessage('user', newActive ? 'Reactivar usuario' : 'Desactivar usuario');
    setUsers(prev => prev.map(x => x.id === id ? { ...x, active: newActive } : x));
    await typeMessage('bot',
      `El usuario ${u.name} quedó ${newActive ? 'activo' : 'inactivo'}.\n\nLos registros no se eliminan, solo se desactivan por cumplimiento normativo (SIC) y gestión de PQR.`,
      1000
    );
    setTimeout(() => {
      addButtonGroup([
        { label: 'Volver a usuarios', action: 'mc_usuarios' },
        { label: 'Mi cuenta', action: 'mc_back_menu', variant: 'secondary' },
      ]);
    }, 400);
  }

  async function changeUserPermissions(id: string) {
    clearInteractiveElements();
    const u = users.find(x => x.id === id);
    if (!u) return;
    addMessage('user', 'Cambiar permisos');
    await typeMessage('bot',
      `Permisos de ${u.name}:\n\n• Puede pagar manualmente con sus propios medios de pago.\n• No puede usar débito automático (exclusivo del usuario principal).\n• Puede usar Zybo en cualquier parqueadero habilitado.`,
      1000
    );
    setTimeout(() => {
      addButtonGroup([
        { label: 'Volver al usuario', action: `mc_usr_select:${id}`, variant: 'secondary' },
      ]);
    }, 400);
  }

  function handleAction(action: string) {
    // Acciones con parámetro: mc_*:<id>
    if (action.startsWith('mc_veh_remove:')) return confirmRemoveVehicle(action.split(':')[1]);
    if (action.startsWith('mc_veh_remove_ok:')) return doRemoveVehicle(action.split(':')[1]);
    if (action.startsWith('mc_usr_remove:')) return confirmRemoveUser(action.split(':')[1]);
    if (action.startsWith('mc_usr_remove_ok:')) return doRemoveUser(action.split(':')[1]);

    switch (action) {
      case 'open_form':
        clearInteractiveElements();
        setIsFormOpen(true);
        break;

      case 'open_slider_welcome':
      case 'open_slider_invite':
      case 'open_slider_payment':
        clearInteractiveElements();
        addMessage('user', 'Conoce Zybo');
        setTimeout(async () => {
          await typeMessage('bot', '🚧 El slider informativo "Conoce Zybo" estará disponible próximamente.', 700);
          if (action === 'open_slider_invite') {
            setTimeout(() => showInviteUsersStep(), 500);
          } else if (action === 'open_slider_payment') {
            setTimeout(() => showVincularPagoStep(), 500);
          } else {
            setTimeout(() => addButtonGroup([{ label: 'Registrarme', action: 'open_form' }]), 500);
          }
        }, 300);
        break;

      case 'invite_users_open':
        clearInteractiveElements();
        addMessage('user', 'Invitar usuarios');
        setIsInviteModalOpen(true);
        setCurrentStep('reg_invite_modal_open');
        break;

      case 'skip_invite_users':
        clearInteractiveElements();
        addMessage('user', 'Lo haré después');
        setTimeout(() => showVincularPagoStep(), 400);
        break;

      case 'vincular_desde_registro':
        clearInteractiveElements();
        addMessage('user', '💳 Vincular Medio De Pago');
        setTimeout(() => runVincularPagoDaviplata(), 300);
        break;

      case 'vincular_desde_pago':
        clearInteractiveElements();
        addMessage('user', 'Vincular medio de pago');
        setTimeout(() => runVincularPagoDaviplata(), 300);
        break;

      // NUEVOS CASES PARA REGISTRO EXTERNO
      case 're_debito':
        clearInteractiveElements();
        addMessage('user', 'Débito automático');
        setTimeout(async () => {
          await typeMessage('bot', 'Elige el medio de pago para vincular débito automático:', 700);
          addPaymentSelector(true, 'autodebit');
        }, 300);
        break;

      case 're_medio_favorito':
        handleEpGenerico('Medio de pago favorito');
        break;

      case 're_eliminar_pago':
        handleEpGenerico('Eliminar medio de pago');
        break;

      case 're_mi_cuenta':
        showMiCuenta('re');
        break;

      case 're_centro_comercial':
        clearInteractiveElements();
        addMessage('user', '¡Centro comercial! 🏬');
        setTimeout(async () => {
          await typeMessage('bot', '¡Perfecto! Veamos si hay parqueaderos Zybo disponibles en tu ubicación.', 700);
          // Simular búsqueda de parqueaderos
          setTimeout(async () => {
            await typeMessage('bot', '🔍 Buscando parqueaderos cercanos...', 800);
            setTimeout(() => {
              // Mostrar opción de ingresar al parqueadero
              addButtonGroup([
                { label: '🚗 Ingresar a Centro Comercial Andino', action: 're_ingresar_parqueo' },
                { label: '🔍 Buscar otro centro comercial', action: 're_buscar_otro' },
                { label: '⬅️ Volver al menú', action: 're_volver_menu' }
              ]);
            }, 1000);
          }, 800);
        }, 300);
        break;

      case 're_regresar':
        // No hace nada, solo vuelve a mostrar el menú
        clearInteractiveElements();
        setTimeout(() => showMenuRegistroExterno(), 300);
        break;

      case 're_ingresar_parqueo':
        // Solo aquí puede ingresar al flujo de parqueadero
        clearInteractiveElements();
        addMessage('user', 'Ingresar a Centro Comercial Andino');
        setTimeout(() => startEntradaParqueadero(), 300);
        break;

      case 're_buscar_otro':
        clearInteractiveElements();
        addMessage('user', 'Buscar otro centro comercial');
        setTimeout(async () => {
          await typeMessage('bot', '🚧 Funcionalidad de búsqueda de parqueaderos estará disponible próximamente.', 700);
          setTimeout(() => {
            addButtonGroup([{ label: '⬅️ Volver', action: 're_volver_menu' }]);
          }, 500);
        }, 300);
        break;

      case 're_volver_menu':
        clearInteractiveElements();
        setTimeout(() => showMenuRegistroExterno(), 300);
        break;

      case 'pol_select':
        runPagoEnLinea();
        break;

      case 'pol_pay':
        runPolOtp();
        break;

      case 'pol_pay_nequi':
        runPolOtpNequi();
        break;

      case 'pol_pay_tarjeta':
        runPolOtpTarjeta();
        break;

      case 'volver_inicio':
        resetChat();
        setSimulation(null);
        break;

      case 'ep_pagar':
        clearInteractiveElements();
        addMessage('user', 'Pagar');
        setTimeout(() => runPagoEnLinea(), 300);
        break;

      case 'ep_tiquete':
        handleEpTiquete();
        break;

      case 'ep_mas_opciones':
        handleEpMasOpciones();
        break;

      case 'ep_debito':
        clearInteractiveElements();
        addMessage('user', 'Débito automático');
        setTimeout(async () => {
          await typeMessage('bot', 'Elige el medio de pago para vincular débito automático:', 700);
          addPaymentSelector(true, 'autodebit');
        }, 300);
        break;

      case 'ep_medio_favorito':
        handleEpGenerico('Medio de pago favorito');
        break;

      case 'ep_eliminar_pago':
        handleEpGenerico('Eliminar medio de pago');
        break;

      case 'ep_localizacion':
        handleEpLocalizacion();
        break;

      case 'ep_mi_cuenta':
        showMiCuenta('ep');
        break;

      case 'mc_vehiculos':
        showVehiclesList();
        break;

      case 'mc_usuarios':
        showUsersList();
        break;

      case 'mc_veh_add':
        startAddVehicle();
        break;

      case 'mc_veh_remove_flow':
        startRemoveVehicleFlow();
        break;

      case 'mc_usr_invite':
        startInviteUser();
        break;

      case 'mc_usr_remove_flow':
        startRemoveUserFlow();
        break;

      case 'mc_back_menu':
        clearInteractiveElements();
        setTimeout(() => showMiCuenta(miCuentaOrigin ?? 'ep'), 300);
        break;

      case 'mc_volver':
        backToMiCuentaOrigin();
        break;

      case 'ep_regresar':
        clearInteractiveElements();
        addMessage('user', 'Regresar');
        setTimeout(() => runPagoEnLinea(), 300);
        break;

      case 'ep_vehiculos':
        handleEpGenerico('Mis vehículos');
        break;

      case 'ep_soporte':
        handleEpGenerico('Soporte IA');
        break;

      case 'ep_volver_menu':
        clearInteractiveElements();
        setTimeout(() => startEntradaParqueadero(), 300);
        break;

      case 'ep_volver_mas':
        clearInteractiveElements();
        setTimeout(() => handleEpMasOpciones(), 300);
        break;

      case 'done':
        break;
    }
  }

  function handlePaymentSelectorClick(paymentId: string) {
    if (paymentId === 'back_to_menu') {
      if (currentStep === 're_menu_externo') {
        showMenuRegistroExterno();
        return;
      }
      resetChat();
      setSimulation(null);
      return;
    }

    if (paymentId === 'puntos_colombia') {
      handlePuntosColombiaSelected();
      return;
    }

    // Registro externo - vincular pago
    if (currentStep === 'registration_success' && simulation === 'registro_externo') {
      clearInteractiveElements();
      const names: Record<string, string> = {
        nequi: 'Nequi',
        daviplata: 'Daviplata',
        credit_card: 'Tarjeta',
        mercado_pago: 'Mercado Pago'
      };
      addMessage('user', names[paymentId] || paymentId);

      setTimeout(async () => {
        await typeMessage('bot',
          `Al activar pagos por ${names[paymentId] || paymentId}, se realizarán de forma automática por el valor del parqueo más $500 + IVA por la transacción.`,
          900
        );

        setTimeout(async () => {
          await typeMessage('bot',
            `Digita el código de confirmación que recibiste por mensaje de texto. Recuerda que tiene vigencia de 3 minutos.`,
            800
          );
          setCurrentStep('vp_otp_wait');
          setIsWaitingForInput(true);
        }, 1000);
      }, 300);
      return;
    }

    // Vincular pago DESPUÉS DE REGISTRO (parqueadero)
    if (currentStep === 'registration_success') {
      clearInteractiveElements();
      const names: Record<string, string> = {
        nequi: 'Nequi',
        daviplata: 'Daviplata',
        credit_card: 'Tarjeta',
        mercado_pago: 'Mercado Pago'
      };
      addMessage('user', names[paymentId] || paymentId);

      setTimeout(async () => {
        await typeMessage('bot',
          `Al activar pagos por ${names[paymentId] || paymentId}, se realizarán de forma automática por el valor del parqueo más $500 + IVA por la transacción.`,
          900
        );

        setTimeout(async () => {
          await typeMessage('bot',
            `Digita el código de confirmación que recibiste por mensaje de texto. Recuerda que tiene vigencia de 3 minutos.`,
            800
          );
          setCurrentStep('vp_otp_wait');
          setIsWaitingForInput(true);
        }, 1000);
      }, 300);
      return;
    }

    // Débito automático desde registro externo
    if (currentStep === 're_menu_externo') {
      clearInteractiveElements();
      const names: Record<string, string> = {
        nequi: 'Nequi',
        daviplata: 'Daviplata',
        credit_card: 'Tarjeta',
        mercado_pago: 'Mercado Pago'
      };
      addMessage('user', names[paymentId] || paymentId);

      setTimeout(async () => {
        await typeMessage('bot',
          `Al activar pagos por ${names[paymentId] || paymentId}, se realizarán de forma automática por el valor del parqueo más $500 + IVA por la transacción.`,
          900
        );

        setTimeout(async () => {
          await typeMessage('bot',
            `Digita el código de confirmación que recibiste por mensaje de texto. Recuerda que tiene vigencia de 3 minutos.`,
            800
          );
          setCurrentStep('vp_otp_wait');
          setIsWaitingForInput(true);
        }, 1000);
      }, 300);
      return;
    }

    // Pago en línea desde entrada parqueadero
    if (currentStep === 'pol_confirm') {
      clearInteractiveElements();
      const names: Record<string, string> = {
        nequi: 'Nequi',
        daviplata: 'Daviplata',
        credit_card: 'Tarjetas'
      };
      addMessage('user', names[paymentId] || paymentId);
      if (paymentId === 'nequi') handlePolNequiSelected();
      else if (paymentId === 'credit_card') handlePolTarjetaSelected();
      else handlePolDaviplataSelected();
      return;
    }

    // Vincular medio de pago DESPUÉS DE PAGO MANUAL
    if (currentStep === 'pol_success' || currentStep === 'pol_success_nequi' || currentStep === 'pol_success_tarjeta') {
      clearInteractiveElements();
      const names: Record<string, string> = {
        nequi: 'Nequi',
        daviplata: 'Daviplata',
        credit_card: 'Tarjeta',
        mercado_pago: 'Mercado Pago'
      };
      addMessage('user', names[paymentId] || paymentId);

      setTimeout(async () => {
        await typeMessage('bot',
          `Al activar pagos por ${names[paymentId] || paymentId}, se realizarán de forma automática por el valor del parqueo más $500 + IVA por la transacción.`,
          900
        );

        setTimeout(async () => {
          await typeMessage('bot',
            `Digita el código de confirmación que recibiste por mensaje de texto. Recuerda que tiene vigencia de 3 minutos.`,
            800
          );
          setCurrentStep('vp_otp_wait');
          setIsWaitingForInput(true);
        }, 1000);
      }, 300);
      return;
    }

    // Débito automático desde entrada parqueadero
    if (currentStep === 'ep_mas_opciones') {
      clearInteractiveElements();
      const names: Record<string, string> = {
        nequi: 'Nequi',
        daviplata: 'Daviplata',
        credit_card: 'Tarjeta',
        mercado_pago: 'Mercado Pago'
      };
      addMessage('user', names[paymentId] || paymentId);
      setTimeout(() => handleDaviplataSelected(), 300);
    }
  }

  function handleSendMessage() {
    if (!inputValue.trim()) return;
    const value = inputValue.trim();
    setInputValue('');
    addMessage('user', value);
    setIsWaitingForInput(false);
    if (currentStep === 'vp_otp_wait') handleVpOtp(value);
    else if (currentStep === 'pol_otp_wait') handlePolOtp(value);
    else if (currentStep === 'pol_otp_wait_nequi') handlePolOtpNequiHandler(value);
    else if (currentStep === 'pol_otp_wait_tarjeta') handlePolOtpTarjetaHandler(value);
    else if (currentStep === 'pc_otp_wait') handlePcOtp(value);
    else if (currentStep === 'reg_owner_otp_wait') handleOwnerOtp(value);
    else if (currentStep === 'mc_veh_add_wait') handleAddVehicleInput(value);
    else if (currentStep === 'mc_usr_invite_phone_wait') handleInvitePhoneInput(value);
    else if (currentStep === 'mc_usr_invite_name_wait') handleInviteNameInput(value);
  }

  const simLabels: Record<SimulationType, { label: string; icon: string; color: string; active: string }> = {
    registro: {
      label: 'Registro',
      icon: '📝',
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      active: 'bg-blue-600 text-white'
    },
    entrada_parqueo: {
      label: 'Entrada',
      icon: '🚗',
      color: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      active: 'bg-orange-600 text-white'
    },

    registro_externo: {
      label: 'Registro Externo',
      icon: '🔗',
      color: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      active: 'bg-purple-600 text-white'
    },

    landing_web: {
      label: 'Registro Web',
      icon: '🌐',
      color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
      active: 'bg-indigo-600 text-white'
    },
    usuario_referido: {
      label: 'Usuario referido',
      icon: '🎁',
      color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
      active: 'bg-emerald-600 text-white'
    }
  };

  const isLanding = simulation === 'landing_web';

  return (
    <>
      <FormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <InviteUsersModal
        isOpen={isInviteModalOpen}
        ownerName={registeredName}
        plate={registeredPlate}
        onClose={() => setIsInviteModalOpen(false)}
        onSubmit={handleInviteUsersSubmit}
      />

      <div className="min-h-screen bg-gray-300 flex flex-col items-center justify-start py-8 px-4">
        {/* Selector superior de escenarios */}
        <div className="w-full max-w-[300px] mb-4">
          <p className="text-gray-600 text-xs font-semibold mb-2 uppercase tracking-wide text-center">
            🔧 Escenario de simulación
          </p>

          <div className="flex gap-2 justify-center flex-wrap">
            {(Object.keys(simLabels) as SimulationType[]).map(sim => {
              const s = simLabels[sim];
              const isActive = simulation === sim;
              return (
                <button
                  key={sim}
                  onClick={() => selectSimulation(sim)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all shadow-sm ${isActive ? s.active : s.color
                    }`}
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              );
            })}

            {simulation && (
              <button
                onClick={() => {
                  resetChat();
                  setSimulation(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-700 text-white hover:bg-gray-800 transition-all shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reiniciar</span>
              </button>
            )}
          </div>
        </div>

        {/* Marco del teléfono */}
        <div className="w-[390px] h-[820px] bg-[#e5ddd5] rounded-[40px] overflow-hidden shadow-2xl border-[6px] border-gray-800 flex flex-col relative">
          {/* Barra superior (notch) */}
          <div className="bg-gray-800 h-6 w-full flex items-center justify-center flex-shrink-0">
            <div className="w-20 h-1.5 bg-gray-600 rounded-full" />
          </div>

          {/* Header estilo WhatsApp SOLO si NO es landing */}
          {!isLanding && (
            <div className="bg-[#075e54] text-white px-4 py-2 flex items-center justify-between shadow-md flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full overflow-hidden">
                  <img
                    src="https://i.postimg.cc/wjQcWtMT/logo-Zybo-Whatsapp-jpg.jpg"
                    alt="Zybo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-sm">Zybo</div>
                  <div className="text-xs text-green-200">en línea</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Video className="w-4 h-4 cursor-pointer hover:opacity-80" />
                <Phone className="w-4 h-4 cursor-pointer hover:opacity-80" />
                <MoreVertical className="w-4 h-4 cursor-pointer hover:opacity-80" />
              </div>
            </div>
          )}

          {/* Contenido principal: HOME (sin simulation) | LANDING | CHAT */}
          <div className={`flex-1 ${simulation && !isLanding ? "overflow-y-auto px-3 py-3" : ""}`}>
            {/* HOME dentro del marco (cuando no hay simulación seleccionada) */}
            {!simulation && !isLanding && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-50 h-20 rounded-full overflow-hidden">
                  <img
                    src="https://i.postimg.cc/NG2q2tCm/Zybo-logo-hor-morado-amarillo.png"
                    alt="Zybo"
                    className="w-full h-full object-contain"
                  />
                </div>

                <h2 className="text-base font-bold text-[#075e54] mb-1">Zybo — Simulador</h2>
                <p className="text-gray-500 text-xs">Selecciona un escenario para comenzar.</p>

                <div className="mt-5 flex flex-col gap-2 w-full">
                  {(Object.keys(simLabels) as SimulationType[]).map(sim => {
                    const s = simLabels[sim];
                    return (
                      <button
                        key={sim}
                        onClick={() => selectSimulation(sim)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow text-[#075e54] font-semibold text-sm hover:bg-[#075e54] hover:text-white transition-all border border-gray-200"
                      >
                        <span>{s.icon}</span>
                        <span>{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* LANDING dentro del marco */}
            {isLanding && (
              <LandingWebScreen
                onBack={() => {
                  resetChat(); setSimulation(null);
                }}
                onSubmit={handleLandingSubmit}
              />
            )}

            {/* CHAT dentro del marco */}
            {simulation && !isLanding && (
              <>
                {messages.map(message =>
                  message.imageUrl ? (
                    <div
                      key={message.id}
                      className="flex justify-start mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
                    >
                      <div className="max-w-[85%] rounded-lg overflow-hidden shadow-sm bg-white">
                        <img
                          src={message.imageUrl}
                          alt="Centro comercial"
                          className="w-full h-72 object-cover"
                        />
                        {message.timestamp && (
                          <div className="text-[11px] text-gray-400 px-2 py-1 text-right">
                            {message.timestamp}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <ChatMessage
                      key={message.id}
                      type={message.type}
                      content={message.content}
                      timestamp={message.timestamp}
                    />
                  )
                )}

                {buttonGroups.map(group => (
                  <ChatButtonGroup
                    key={group.id}
                    buttons={group.buttons.map(btn => ({
                      ...btn,
                      onClick: () => handleAction(btn.action),
                    }))}
                  />
                ))}

                {menuLists.map(menu => (
                  <MenuList
                    key={menu.id}
                    title={menu.title}
                    options={menu.options}
                    onOptionClick={handleAction}
                    onOpenSheet={openSheet}
                  />
                ))}

                {paymentSelectors.map(selector => (
                  <PaymentSelector
                    key={selector.id}
                    showAutomatic={selector.showAutomatic}
                    variant={selector.variant}
                    onSelect={handlePaymentSelectorClick}
                    onOpenSheet={openSheet}
                  />
                ))}

                {isTyping && (
                  <div className="flex justify-start mb-3">
                    <div className="bg-white px-4 py-3 rounded-lg rounded-tl-none shadow-sm">
                      <div className="flex gap-1">
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>


                    </div>

                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>



          {/* Bottom sheet modal */}
          {activeSheet && (
            <BottomSheet
              title={activeSheet.title}
              options={activeSheet.options}
              onSelect={activeSheet.onSelect}
              onClose={() => setActiveSheet(null)}
            />
          )}

          {/* Tooltip */}
          {tooltip.visible && (
            <div className="absolute bottom-20 left-3 right-3 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-gray-900/90 text-white text-xs rounded-xl px-4 py-3 shadow-xl leading-relaxed">
                {tooltip.text}
              </div>
            </div>
          )}

          {/* Input SOLO si NO es landing y hay simulación (chat) */}
          {!isLanding && simulation && (
            <div className="flex-shrink-0">
              <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSend={handleSendMessage}
                placeholder={
                  !isWaitingForInput
                    ? "Interactúa con los botones..."
                    : currentStep === 'mc_veh_add_wait'
                      ? "Escribe la placa (ej. ABC123)..."
                      : currentStep === 'mc_usr_invite_phone_wait'
                        ? "Escribe el celular (ej. 3001234567)..."
                        : currentStep === 'mc_usr_invite_name_wait'
                          ? "Escribe el nombre del usuario..."
                          : "Escribe el código OTP (4 dígitos)..."
                }
                disabled={!isWaitingForInput}
              />
            </div>
          )}

          {/* Barra inferior */}
          <div className="bg-gray-800 h-5 w-full flex items-center justify-center flex-shrink-0">
            <div className="w-24 h-1 bg-gray-500 rounded-full" />
          </div>
        </div>
      </div>
    </>
  );
}


