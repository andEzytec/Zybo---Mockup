import { SimulationType } from '../types';

export type SimLabel = {
  label: string;
  icon: string;
  color: string;
  active: string;
};

export const simLabels: Record<SimulationType, SimLabel> = {
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
