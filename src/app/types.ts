export type SheetOption = {
  id: string;
  label: string;
  description?: string;
  action: string;
};

export type ActiveSheet = {
  title: string;
  options: SheetOption[];
  onSelect: (action: string) => void;
} | null;

export type SimulationType =
  | 'registro'
  | 'entrada_parqueo'
  | 'registro_externo'
  | 'landing_web'
  | 'usuario_referido';

export type MessageType = {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: string;
  imageUrl?: string;
};

export type ButtonGroupType = {
  id: string;
  buttons: Array<{
    label: string;
    action: string;
    variant?: 'primary' | 'secondary';
  }>;
};

export type MenuListType = {
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

export type PaymentSelectorType = {
  id: string;
  showAutomatic: boolean;
  variant?: 'pay' | 'link' | 'autodebit';
};

export type LandingFormData = {
  countryPrefix: string;
  phone: string;
  plate: string;
  firstName: string;
  lastName: string;
  docType: 'Cédula' | 'NIT' | 'Pasaporte';
  docNumber: string;
  email: string;
};

export type FlowStep =
  | 'welcome'
  | 'show_form_cta'
  | 'form_submitted'
  | 'reg_rut_not_found'
  | 'reg_owner_otp_wait'
  | 'registration_success'
  | 'reg_invite_step'
  | 'reg_invite_modal_open'
  | 'reg_link_pay_step'
  | 're_menu_externo'
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

export type VehicleRole = 'principal' | 'secundario';
export type Vehicle = {
  plate: string;
  role: VehicleRole;
  status: string;
  active: boolean;
};

export type UserType = 'principal' | 'secundario';
export type UserEntry = {
  id: string;
  name: string;
  phone: string;
  type: UserType;
  active: boolean;
  vehiclePlate: string;
};

export const ROLE_LABEL: Record<VehicleRole, string> = {
  principal: 'Principal',
  secundario: 'Secundario',
};
