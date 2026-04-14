import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Pill, User, Clock, Activity } from 'lucide-react';

const tratamientos = [
  { id: 1, nombre: 'Tratamiento Hipertension', duracion: '3 meses (Ene - Mar 2026)', estado: 'Activo', medico: 'Dr. Juan Martinez', progreso: 65,
    medicamentos: 'Losartan 50mg, Aspirina 100mg', proxControl: '2026-03-20' },
  { id: 2, nombre: 'Control Dermatologico', duracion: '1 mes (Feb - Mar 2026)', estado: 'Activo', medico: 'Dra. Maria Rodriguez', progreso: 30,
    medicamentos: 'Hidrocortisona 1%, Cetirizina 10mg', proxControl: '2026-03-15' },
  { id: 3, nombre: 'Recuperacion Gripal', duracion: '1 semana (Dic 2025)', estado: 'Completado', medico: 'Dr. Carlos Lopez', progreso: 100,
    medicamentos: 'Acetaminofen 500mg', proxControl: '-' },
  { id: 4, nombre: 'Terapia Anti-migraña', duracion: '2 meses (Ago - Oct 2025)', estado: 'Completado', medico: 'Dr. Alejandro Reyes', progreso: 100,
    medicamentos: 'Sumatriptan 50mg', proxControl: '-' },
  { id: 5, nombre: 'Tratamiento Infeccion Urinaria', duracion: '10 dias (Sep 2025)', estado: 'Completado', medico: 'Dra. Sofia Ramirez', progreso: 100,
    medicamentos: 'Ciprofloxacina 500mg', proxControl: '-' },
];

const estadoColor: Record<string, string> = {
  'Activo': 'bg-[#E8F5E9] text-[#43A047]',
  'Completado': 'bg-[#E3F2FD] text-[#1E88E5]',
  'Suspendido': 'bg-[#FFEBEE] text-[#E53935]',
};

export function TratamientosScreen() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-[#212121]">Tratamientos</h2>
        <p className="text-[#616161]">Seguimiento de todos tus tratamientos medicos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Activos', value: '2', color: '#43A047', bg: '#E8F5E9' },
          { label: 'Completados', value: '3', color: '#1E88E5', bg: '#E3F2FD' },
          { label: 'Total', value: '5', color: '#FF8F00', bg: '#FFF8E1' },
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
        {tratamientos.map((t) => (
          <Card key={t.id} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#E3F2FD] rounded-xl flex items-center justify-center">
                    <Pill className="h-5 w-5 text-[#1E88E5]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#212121]">{t.nombre}</p>
                    <p className="text-xs text-[#616161]">{t.medicamentos}</p>
                  </div>
                </div>
                <Badge className={estadoColor[t.estado]}>{t.estado}</Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-[#616161]">
                  <User className="h-3 w-3" /> {t.medico}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#616161]">
                  <Clock className="h-3 w-3" /> {t.duracion}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#616161]">Progreso</span>
                  <span className="text-[#212121]">{t.progreso}%</span>
                </div>
                <div className="w-full bg-[#E3F2FD] rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${t.progreso}%`,
                      backgroundColor: t.progreso === 100 ? '#43A047' : '#1E88E5',
                    }}
                  />
                </div>
              </div>

              {t.proxControl !== '-' && (
                <p className="text-xs text-[#1E88E5] mt-3">Proximo control: {t.proxControl}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
