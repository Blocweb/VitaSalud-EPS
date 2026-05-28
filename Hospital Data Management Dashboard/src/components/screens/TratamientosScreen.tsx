import { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Pill, User, Clock, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { doctorsApi, patientsApi, prescriptionsApi } from '../../lib/api';

const estadoColor: Record<string, string> = {
  'active': 'bg-[#E8F5E9] text-[#43A047]',
  'completado': 'bg-[#E3F2FD] text-[#1E88E5]',
  'dispensed': 'bg-[#E3F2FD] text-[#1E88E5]',
  'suspended': 'bg-[#FFEBEE] text-[#E53935]',
};

export function TratamientosScreen() {
  const { user } = useAuth();
  const [tratamientos, setTratamientos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        // Si es paciente, obtener su id y luego sus recetas
        if (user?.role === 'patient') {
          const patient = await patientsApi.me();
          const data = await prescriptionsApi.byPatient(patient.id);
          if (!ignore) setTratamientos(data);
        } else if (user?.role === 'doctor') {
          const doctors = await doctorsApi.list();
          const currentDoctor = doctors.find((d: any) => d.user_id === user.id);
          const data = currentDoctor ? await prescriptionsApi.byDoctor(currentDoctor.id) : [];
          if (!ignore) setTratamientos(data);
        } else {
          // Para roles admin o pharmacist, listar todas las recetas
          const data = await prescriptionsApi.list();
          if (!ignore) setTratamientos(data);
        }
      } catch (e) {
        if (!ignore) setTratamientos([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => { ignore = true; };
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-[#212121]">Tratamientos</h2>
        <p className="text-[#616161]">Seguimiento de todos tus tratamientos medicos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Mostrar conteos básicos en base a datos reales */}
        {[
          { label: 'Activos', value: String(tratamientos.filter(t => t.is_active).length || 0), color: '#43A047', bg: '#E8F5E9' },
          { label: 'Dispensados', value: String(tratamientos.filter(t => t.dispensed).length || 0), color: '#1E88E5', bg: '#E3F2FD' },
          { label: 'Total', value: String(tratamientos.length || 0), color: '#FF8F00', bg: '#FFF8E1' },
        ].map((s, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.bg }}>
                <Activity className="h-5 w-5" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-xs text-[#616161]">{s.label}</p>
                <p className="text-xl text-[#212121]">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tratamientos cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!loading && tratamientos.map((t: any) => (
          <Card key={t.id} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#E3F2FD] rounded-xl flex items-center justify-center">
                    <Pill className="h-5 w-5 text-[#1E88E5]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#212121]">{t.diagnosis || t.prescription_number}</p>
                    <p className="text-xs text-[#616161]">{t.prescription_date?.slice(0,10) || ''}</p>
                  </div>
                </div>
                <Badge className={t.dispensed ? estadoColor.dispensed : (t.is_active ? estadoColor.active : estadoColor.completado)}>{t.dispensed ? 'Dispensado' : (t.is_active ? 'Activo' : 'Completado')}</Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-[#616161]">
                  <User className="h-3 w-3" /> {t.doctor_name}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#616161]">
                  <Clock className="h-3 w-3" /> {t.prescription_date?.slice(0,10) || ''}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#616161]">Items</span>
                  <span className="text-[#212121]">{t.items ? t.items.length : '-'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
