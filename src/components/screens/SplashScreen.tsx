import { useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { Heart, Shield, Clock, Users } from 'lucide-react';

export function SplashScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D47A1] via-[#1565C0] to-[#1E88E5] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-white rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 text-center max-w-lg">
        {/* Logo */}
        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L12 22M2 12L22 12" stroke="#1E88E5" strokeWidth="3" strokeLinecap="round" />
            <circle cx="12" cy="12" r="9" stroke="#1E88E5" strokeWidth="2" fill="none" />
          </svg>
        </div>

        <h1 className="text-4xl md:text-5xl text-white mb-3">VitaSalud</h1>
        <p className="text-xl text-[#90CAF9] mb-10">Tu salud en las mejores manos</p>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          {[
            { icon: Heart, text: 'Cuidado Integral' },
            { icon: Shield, text: 'Datos Seguros' },
            { icon: Clock, text: 'Citas en Linea' },
            { icon: Users, text: 'Equipo Experto' },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <f.icon className="h-5 w-5 text-[#64B5F6]" />
              <span className="text-sm text-white/90">{f.text}</span>
            </div>
          ))}
        </div>

        <Button
          onClick={() => navigate('/login')}
          className="bg-white text-[#1E88E5] hover:bg-[#E3F2FD] px-10 py-6 text-lg rounded-xl shadow-lg"
        >
          Ingresar
        </Button>
      </div>
    </div>
  );
}
