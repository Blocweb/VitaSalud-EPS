import {
  Home,
  CalendarDays,
  FileText,
  Pill,
  CalendarClock,
  BarChart3,
  User,
  LogOut,
  Stethoscope,
  ShieldCheck,
  CalendarPlus,
  FlaskConical,
  Receipt,
} from 'lucide-react';

import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useMemo } from 'react';

interface VitaSaludSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VitaSaludSidebar({
  isOpen,
  onClose,
}: VitaSaludSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const navItems = useMemo(() => {

    // ===== PACIENTE =====
    if (user?.role === 'patient') {
      return [
        { id: '/app',               label: 'Inicio',          icon: Home },
        { id: '/app/citas',         label: 'Mis Citas',       icon: CalendarDays },
        { id: '/app/agendar-cita',  label: 'Agendar Cita',    icon: CalendarPlus },
        { id: '/app/historial',     label: 'Historial Clinico', icon: FileText },
        { id: '/app/perfil',        label: 'Mi Perfil',       icon: User },
      ];
    }

    // ===== MÉDICO =====
    if (user?.role === 'doctor') {
      return [
        { id: '/app',               label: 'Inicio',          icon: Home },
        { id: '/app/agenda-medico', label: 'Agenda Medica',   icon: CalendarClock },
        { id: '/app/historial',     label: 'Historial Clinico', icon: FileText },
        { id: '/app/tratamientos',  label: 'Recetas',         icon: Pill },
        { id: '/app/perfil',        label: 'Perfil',          icon: User },
      ];
    }

    // ===== ADMINISTRADOR =====
    if (user?.role === 'admin') {
      return [
        { id: '/app',               label: 'Inicio',          icon: Home },
        { id: '/app/reportes',      label: 'Estadisticas',    icon: BarChart3 },
        { id: '/app/panel-admin',   label: 'Panel Admin',     icon: ShieldCheck },
        { id: '/app/perfil',        label: 'Perfil',          icon: User },
      ];
    }

    // Default fallback
    return [
      { id: '/app',     label: 'Inicio',  icon: Home },
      { id: '/app/perfil', label: 'Perfil', icon: User },
    ];

  }, [user]);

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const isActive = (path: string) => {
    if (path === '/app') {
      return location.pathname === '/app';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-[#0D47A1] z-40 transition-transform duration-300 flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.id);

          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                active
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-4">
        {user?.role === 'patient' && (
          <div className="bg-white/10 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <Stethoscope className="h-4 w-4 text-white/80" />
              <span className="text-xs text-white/90">
                {user.first_name ? `Hola, ${user.first_name}` : 'Bienvenido'}
              </span>
            </div>
            <p className="text-xs text-white/70">Paciente</p>
          </div>
        )}

        {user?.role === 'doctor' && (
          <div className="bg-white/10 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <Stethoscope className="h-4 w-4 text-white/80" />
              <span className="text-xs text-white/90">
                {user.first_name ? `Dr. ${user.first_name}` : 'Medico'}
              </span>
            </div>
            <p className="text-xs text-white/70">Medico</p>
          </div>
        )}

        {user?.role === 'admin' && (
          <div className="bg-white/10 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-4 w-4 text-white/80" />
              <span className="text-xs text-white/90">Administrador</span>
            </div>
            <p className="text-xs text-white/70">Acceso total</p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all text-sm"
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar Sesion</span>
        </button>
      </div>
    </aside>
  );
}
