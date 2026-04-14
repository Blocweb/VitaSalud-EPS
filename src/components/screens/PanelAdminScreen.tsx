import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { CalendarDays, Users, Stethoscope, Activity, TrendingUp, Building2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const metricas = [
  { label: 'Citas del Dia', value: '48', cambio: '+12%', icon: CalendarDays, color: '#1E88E5', bg: '#E3F2FD' },
  { label: 'Pacientes Atendidos', value: '156', cambio: '+8%', icon: Users, color: '#43A047', bg: '#E8F5E9' },
  { label: 'Medicos Activos', value: '24', cambio: '+2', icon: Stethoscope, color: '#7B1FA2', bg: '#F3E5F5' },
  { label: 'Tasa Ocupacion', value: '87%', cambio: '+5%', icon: Activity, color: '#FF8F00', bg: '#FFF8E1' },
];

const citasPorMes = [
  { mes: 'Oct', citas: 320 }, { mes: 'Nov', citas: 380 }, { mes: 'Dic', citas: 290 },
  { mes: 'Ene', citas: 420 }, { mes: 'Feb', citas: 450 }, { mes: 'Mar', citas: 480 },
];

const pacientesPorDia = [
  { dia: 'Lun', pacientes: 42 }, { dia: 'Mar', pacientes: 38 }, { dia: 'Mie', pacientes: 45 },
  { dia: 'Jue', pacientes: 40 }, { dia: 'Vie', pacientes: 35 }, { dia: 'Sab', pacientes: 20 },
];

const especialidadData = [
  { name: 'Cardiologia', value: 28, color: '#1E88E5' },
  { name: 'General', value: 35, color: '#43A047' },
  { name: 'Dermatologia', value: 15, color: '#64B5F6' },
  { name: 'Pediatria', value: 22, color: '#FDD835' },
];

const medicosRecientes = [
  { nombre: 'Dr. Juan Martinez', especialidad: 'Cardiologia', pacientesHoy: 8, estado: 'Activo' },
  { nombre: 'Dra. Maria Rodriguez', especialidad: 'Dermatologia', pacientesHoy: 6, estado: 'Activo' },
  { nombre: 'Dr. Carlos Lopez', especialidad: 'Medicina General', pacientesHoy: 10, estado: 'Activo' },
  { nombre: 'Dra. Sofia Ramirez', especialidad: 'Pediatria', pacientesHoy: 7, estado: 'En descanso' },
  { nombre: 'Dr. Alejandro Reyes', especialidad: 'Neurologia', pacientesHoy: 5, estado: 'Activo' },
];

const citasRecientes = [
  { paciente: 'Carlos Mendoza', medico: 'Dr. Martinez', hora: '8:00 AM', estado: 'Completada' },
  { paciente: 'Ana Garcia', medico: 'Dr. Martinez', hora: '8:30 AM', estado: 'En curso' },
  { paciente: 'Luis Fernandez', medico: 'Dr. Lopez', hora: '9:00 AM', estado: 'Esperando' },
  { paciente: 'Maria Torres', medico: 'Dra. Rodriguez', hora: '9:30 AM', estado: 'Esperando' },
  { paciente: 'Pedro Ramirez', medico: 'Dr. Lopez', hora: '10:00 AM', estado: 'Programada' },
];

const estadoCitaColor: Record<string, string> = {
  'Completada': 'bg-[#E8F5E9] text-[#43A047]',
  'En curso': 'bg-[#E3F2FD] text-[#1E88E5]',
  'Esperando': 'bg-[#FFF8E1] text-[#FF8F00]',
  'Programada': 'bg-[#F5F7FA] text-[#616161]',
};

export function PanelAdminScreen() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-[#212121]">Panel Administrativo</h2>
        <p className="text-[#616161]">Metricas y gestion general de VitaSalud</p>
      </div>

      {/* Metricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricas.map((m, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#616161]">{m.label}</p>
                  <p className="text-2xl text-[#212121] mt-1">{m.value}</p>
                  <p className="text-xs text-[#43A047] flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" /> {m.cambio}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: m.bg }}>
                  <m.icon className="h-6 w-6" style={{ color: m.color }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#212121]">Citas por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={citasPorMes}>
                <XAxis dataKey="mes" tick={{ fill: '#616161', fontSize: 12 }} />
                <YAxis tick={{ fill: '#616161', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="citas" fill="#1E88E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#212121]">Pacientes por Dia (esta semana)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={pacientesPorDia}>
                <XAxis dataKey="dia" tick={{ fill: '#616161', fontSize: 12 }} />
                <YAxis tick={{ fill: '#616161', fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="pacientes" stroke="#1E88E5" strokeWidth={2} dot={{ fill: '#1E88E5' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Citas por especialidad */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#212121]">Por Especialidad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={especialidadData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                    {especialidadData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {especialidadData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-[#616161]">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Medicos */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#212121]">Medicos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {medicosRecientes.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-[#F5F7FA] rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#E3F2FD] rounded-full flex items-center justify-center">
                      <Stethoscope className="h-4 w-4 text-[#1E88E5]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#212121]">{m.nombre}</p>
                      <p className="text-xs text-[#9E9E9E]">{m.especialidad}</p>
                    </div>
                  </div>
                  <Badge className={m.estado === 'Activo' ? 'bg-[#E8F5E9] text-[#43A047]' : 'bg-[#FFF8E1] text-[#FF8F00]'}>
                    {m.pacientesHoy}p
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Citas recientes */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#212121]">Citas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {citasRecientes.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-[#F5F7FA] rounded-lg">
                  <div>
                    <p className="text-xs text-[#212121]">{c.paciente}</p>
                    <p className="text-xs text-[#9E9E9E]">{c.medico} - {c.hora}</p>
                  </div>
                  <Badge className={estadoCitaColor[c.estado]}>{c.estado}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
