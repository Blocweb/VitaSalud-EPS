import { Home, CalendarDays, FileText, Pill, CalendarClock, BarChart3, User, LogOut, Stethoscope, ShieldCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

interface VitaSaludSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { id: '/app', label: 'Inicio', icon: Home },
  { id: '/app/citas', label: 'Citas', icon: CalendarDays },
  { id: '/app/historial', label: 'Historial Clinico', icon: FileText },
  { id: '/app/tratamientos', label: 'Tratamientos', icon: Pill },
  { id: '/app/agenda-medico', label: 'Agenda Medica', icon: CalendarClock },
  { id: '/app/reportes', label: 'Reportes', icon: BarChart3 },
  { id: '/app/panel-admin', label: 'Panel Admin', icon: ShieldCheck },
  { id: '/app/perfil', label: 'Perfil', icon: User },
];

export function VitaSaludSidebar({ isOpen, onClose }: VitaSaludSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const isActive = (path: string) => {
    if (path === '/app') return location.pathname === '/app';
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-[#0D47A1] z-40 transition-transform duration-300 flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Navigation */}
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

      {/* Bottom section */}
      <div className="px-3 pb-4">
        <div className="bg-white/10 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Stethoscope className="h-4 w-4 text-white/80" />
            <span className="text-xs text-white/90">Proxima Cita</span>
          </div>
          <p className="text-xs text-white/70">Dr. Martinez - Cardiologia</p>
          <p className="text-xs text-[#64B5F6]">Lun 10 Mar, 10:00 AM</p>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all text-sm"
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar Sesion</span>
        </button>
      </div>
    </aside>
  );
}
