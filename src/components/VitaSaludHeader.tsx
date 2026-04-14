import { Bell, Menu, User, LogOut, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router';

interface VitaSaludHeaderProps {
  onToggleSidebar: () => void;
}

export function VitaSaludHeader({ onToggleSidebar }: VitaSaludHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-[#DADADA] px-4 md:px-6 h-16 flex items-center justify-between z-50 shadow-sm">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5 text-[#212121]" />
        </Button>

        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/app')}>
          {/* Logo */}
          <div className="w-9 h-9 bg-[#1E88E5] rounded-lg flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L12 22M2 12L22 12" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-[#0D47A1] text-lg leading-tight">VitaSalud</h1>
            <p className="text-xs text-[#616161] leading-tight">Tu salud en las mejores manos</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5 text-[#616161]" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#E53935] rounded-full text-[10px] text-white flex items-center justify-center">3</span>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 p-1.5">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-[#E3F2FD] text-[#1E88E5]">CM</AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm text-[#212121]">Carlos Mendoza</p>
                <p className="text-xs text-[#616161]">Paciente</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => navigate('/app/perfil')}>
              <User className="mr-2 h-4 w-4" />
              Mi Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Configuraciones
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[#E53935]" onClick={() => navigate('/login')}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
