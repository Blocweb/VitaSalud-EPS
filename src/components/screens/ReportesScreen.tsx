import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { BarChart3, Download, TrendingUp, Users, CalendarDays, Stethoscope } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useState } from 'react';

const satisfaccionData = [
  { mes: 'Oct', score: 4.2 }, { mes: 'Nov', score: 4.5 }, { mes: 'Dic', score: 4.3 },
  { mes: 'Ene', score: 4.6 }, { mes: 'Feb', score: 4.7 }, { mes: 'Mar', score: 4.8 },
];

const citasPorEspecialidad = [
  { especialidad: 'General', citas: 145 },
  { especialidad: 'Cardiologia', citas: 98 },
  { especialidad: 'Derma', citas: 67 },
  { especialidad: 'Pediatria', citas: 89 },
  { especialidad: 'Neuro', citas: 45 },
  { especialidad: 'Trauma', citas: 56 },
];

const reportes = [
  { nombre: 'Reporte Mensual - Febrero 2026', tipo: 'Mensual', fecha: '2026-03-01', estado: 'Generado' },
  { nombre: 'Reporte Semanal - Semana 9', tipo: 'Semanal', fecha: '2026-03-03', estado: 'Generado' },
  { nombre: 'Reporte de Ocupacion - Q1 2026', tipo: 'Trimestral', fecha: '2026-03-05', estado: 'Procesando' },
  { nombre: 'Reporte Mensual - Enero 2026', tipo: 'Mensual', fecha: '2026-02-01', estado: 'Generado' },
];

export function ReportesScreen() {
  const [periodo, setPeriodo] = useState('mensual');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl text-[#212121]">Reportes</h2>
          <p className="text-[#616161]">Analisis y metricas del sistema de salud</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-36 border-[#DADADA] rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semanal">Semanal</SelectItem>
              <SelectItem value="mensual">Mensual</SelectItem>
              <SelectItem value="trimestral">Trimestral</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Citas', value: '1,245', cambio: '+15%', icon: CalendarDays, color: '#1E88E5', bg: '#E3F2FD' },
          { label: 'Pacientes Unicos', value: '892', cambio: '+8%', icon: Users, color: '#43A047', bg: '#E8F5E9' },
          { label: 'Satisfaccion', value: '4.8/5', cambio: '+0.2', icon: TrendingUp, color: '#FF8F00', bg: '#FFF8E1' },
          { label: 'Medicos Activos', value: '24', cambio: '+3', icon: Stethoscope, color: '#7B1FA2', bg: '#F3E5F5' },
        ].map((m, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: m.bg }}>
                <m.icon className="h-5 w-5" style={{ color: m.color }} />
              </div>
              <div>
                <p className="text-xs text-[#616161]">{m.label}</p>
                <p className="text-lg text-[#212121]">{m.value}</p>
                <p className="text-xs text-[#43A047]">{m.cambio}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#212121]">Satisfaccion del Paciente</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={satisfaccionData}>
                <XAxis dataKey="mes" tick={{ fill: '#616161', fontSize: 12 }} />
                <YAxis domain={[3.5, 5]} tick={{ fill: '#616161', fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#1E88E5" fill="#E3F2FD" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#212121]">Citas por Especialidad</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={citasPorEspecialidad} layout="vertical">
                <XAxis type="number" tick={{ fill: '#616161', fontSize: 12 }} />
                <YAxis dataKey="especialidad" type="category" width={70} tick={{ fill: '#616161', fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="citas" fill="#1E88E5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Reportes disponibles */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#212121]">
            <BarChart3 className="h-5 w-5 text-[#1E88E5]" />
            Reportes Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reportes.map((r, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-[#F5F7FA] rounded-lg gap-2">
                <div>
                  <p className="text-sm text-[#212121]">{r.nombre}</p>
                  <p className="text-xs text-[#616161]">{r.tipo} - {r.fecha}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={r.estado === 'Generado' ? 'bg-[#E8F5E9] text-[#43A047]' : 'bg-[#FFF8E1] text-[#FF8F00]'}>
                    {r.estado}
                  </Badge>
                  {r.estado === 'Generado' && (
                    <Button variant="outline" size="sm" className="text-[#1E88E5] border-[#1E88E5] rounded-lg text-xs">
                      <Download className="h-3 w-3 mr-1" /> Descargar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
