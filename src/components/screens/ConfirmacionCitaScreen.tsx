import { useNavigate, useLocation } from 'react-router';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle, CalendarDays, Clock, User, Stethoscope, FileText } from 'lucide-react';

export function ConfirmacionCitaScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const cita = (location.state as any)?.cita || {
    especialidad: 'Cardiologia',
    medico: 'Dr. Juan Martinez',
    fecha: '2026-03-10',
    hora: '10:00 AM',
    motivo: 'Control de rutina',
  };

  return (
    <div className="max-w-lg mx-auto space-y-6 py-8">
      <Card className="border-0 shadow-sm text-center">
        <CardContent className="p-8">
          <div className="w-20 h-20 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-[#43A047]" />
          </div>

          <h2 className="text-2xl text-[#212121] mb-2">Cita Agendada Correctamente</h2>
          <p className="text-[#616161] mb-8">Tu cita ha sido registrada exitosamente. Recibiras un recordatorio antes de la consulta.</p>

          <div className="bg-[#F5F7FA] rounded-xl p-6 text-left space-y-4 mb-6">
            <h3 className="text-[#0D47A1] mb-3">Resumen de la Cita</h3>
            {[
              { icon: Stethoscope, label: 'Especialidad', value: cita.especialidad },
              { icon: User, label: 'Medico', value: cita.medico },
              { icon: CalendarDays, label: 'Fecha', value: cita.fecha },
              { icon: Clock, label: 'Hora', value: cita.hora },
              { icon: FileText, label: 'Motivo', value: cita.motivo || 'No especificado' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#E3F2FD] rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-4 w-4 text-[#1E88E5]" />
                </div>
                <div>
                  <p className="text-xs text-[#9E9E9E]">{item.label}</p>
                  <p className="text-sm text-[#212121]">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => navigate('/app/citas')}
              className="bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-lg flex-1"
            >
              Ver Mis Citas
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/app')}
              className="border-[#1E88E5] text-[#1E88E5] rounded-lg flex-1"
            >
              Volver al Inicio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
