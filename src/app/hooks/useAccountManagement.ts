import { useState } from 'react';
import { UserEntry, Vehicle } from '../types';

const INITIAL_VEHICLES: Vehicle[] = [
  { plate: 'ABC123', role: 'principal', status: 'Débito automático activo', active: true },
  { plate: 'MNP234', role: 'principal', status: 'Sin débito automático', active: true },
  { plate: 'XYZ789', role: 'secundario', status: 'Principal: María López', active: true },
  { plate: 'QRS567', role: 'secundario', status: 'Principal: Juan Vélez', active: true },
];

const INITIAL_USERS: UserEntry[] = [
  { id: 'u2', name: 'Ana Gómez', phone: '301 234 5678', type: 'secundario', active: true, vehiclePlate: 'ABC123' },
  { id: 'u3', name: 'Luis Ruiz', phone: '302 345 6789', type: 'secundario', active: false, vehiclePlate: 'ABC123' },
  { id: 'u4', name: 'Sofía Díaz', phone: '305 678 9012', type: 'secundario', active: true, vehiclePlate: 'ABC123' },
  { id: 'u5', name: 'Jorge Martínez', phone: '306 789 0123', type: 'secundario', active: true, vehiclePlate: 'MNP234' },
];

export function useAccountManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [users, setUsers] = useState<UserEntry[]>(INITIAL_USERS);
  const [invitePhone, setInvitePhone] = useState<string>('');

  function getSecundariosDeCarlos() {
    const placasPrincipales = vehicles
      .filter(v => v.role === 'principal' && v.active)
      .map(v => v.plate);
    return users.filter(u => placasPrincipales.includes(u.vehiclePlate) && u.active);
  }

  return {
    vehicles,
    setVehicles,
    users,
    setUsers,
    invitePhone,
    setInvitePhone,
    getSecundariosDeCarlos,
  };
}
