import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { BarChart3, Download, TrendingUp, Users, CalendarDays, Stethoscope, Loader } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useState, useEffect } from 'react';
import { appointmentsApi, doctorsApi, patientsApi, getApiErrorMessage } from '../../lib/api';
import { toast } from 'sonner@2.0.3';

export function ReportesScreen() {
  const [periodo, setPeriodo] = useState('mensual');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    uniquePatients: 0,
    activeDoctors: 0,
    satisfaction: 4.8,
  });
  const [appointmentsBySpecialty, setAppointmentsBySpecialty] = useState<any[]>([]);
  const [satisfactionData, setSatisfactionData] = useState<any[]>([]);

  useEffect(() => {
    loadReportData();
  }, [periodo]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      const [appointments, doctors, patients] = await Promise.all([
        appointmentsApi.list(),
        doctorsApi.list(),
        patientsApi.list?.() || Promise.resolve([]),
      ]);

      // Calculate stats
      setStats({
        totalAppointments: appointments.length,
        uniquePatients: new Set(appointments.map((a: any) => a.patient_user_id)).size,
        activeDoctors: doctors.length,
        satisfaction: 4.8,
      });

      // Group appointments by specialization
      const bySpecialty: Record<string, number> = {};
      appointments.forEach((apt: any) => {
        const specialty = apt.specialization || apt.appointment_type || 'General';
        bySpecialty[specialty] = (bySpecialty[specialty] || 0) + 1;
      });

      setAppointmentsBySpecialty(
        Object.entries(bySpecialty).map(([specialty, count]) => ({
          especialidad: specialty,
          citas: count,
        }))
      );

      // Generate satisfaction data (simulated based on completed appointments)
      const completedCount = appointments.filter((a: any) => a.status === 'completed').length;
      setSatisfactionData([
        { mes: 'Oct', score: 4.2 },
        { mes: 'Nov', score: 4.5 },
        { mes: 'Dic', score: 4.3 },
        { mes: 'Ene', score: 4.6 },
        { mes: 'Feb', score: 4.7 },
        { mes: 'Mar', score: completedCount > 0 ? 4.8 : 4.0 },
      ]);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (type: 'appointments' | 'patients' | 'doctors') => {
    setDownloading(type);
    try {
      let data: any[] = [];
      let filename = '';

      if (type === 'appointments') {
        data = await appointmentsApi.list();
        filename = `reporte-citas-${new Date().toISOString().split('T')[0]}.csv`;
        downloadCSV(data, filename, ['id', 'appointment_date', 'appointment_time', 'patient_name', 'doctor_name', 'specialization', 'status']);
      } else if (type === 'doctors') {
        data = await doctorsApi.list();
        filename = `reporte-medicos-${new Date().toISOString().split('T')[0]}.csv`;
        downloadCSV(data, filename, ['id', 'first_name', 'last_name', 'specialization', 'phone', 'email']);
      } else if (type === 'patients') {
        data = await patientsApi.list?.() || [];
        filename = `reporte-pacientes-${new Date().toISOString().split('T')[0]}.csv`;
        downloadCSV(data, filename, ['id', 'patient_code', 'first_name', 'last_name', 'phone', 'email', 'blood_type']);
      }

      toast.success(`Reporte ${type} descargado exitosamente`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setDownloading(null);
    }
  };

  const downloadCSV = (data: any[], filename: string, columns: string[]) => {
    const headers = columns.join(',');
    const rows = data.map(row => columns.map(col => {
      const value = row[col] || '';
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    }).join(','));

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const reportes = [
    { nombre: 'Reporte de Citas', tipo: 'Completo', tipo_id: 'appointments' as const, estado: 'Disponible' },
    { nombre: 'Reporte de Médicos', tipo: 'Completo', tipo_id: 'doctors' as const, estado: 'Disponible' },
    { nombre: 'Reporte de Pacientes', tipo: 'Completo', tipo_id: 'patients' as const, estado: 'Disponible' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl text-[#212121]">Estadísticas y Reportes</h2>
          <p className="text-[#616161]">Análisis y métricas del sistema de salud</p>
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
          { label: 'Total Citas', value: String(stats.totalAppointments), cambio: '+15%', icon: CalendarDays, color: '#1E88E5', bg: '#E3F2FD' },
          { label: 'Pacientes Únicos', value: String(stats.uniquePatients), cambio: '+8%', icon: Users, color: '#43A047', bg: '#E8F5E9' },
          { label: 'Satisfacción', value: `${stats.satisfaction}/5`, cambio: '+0.2', icon: TrendingUp, color: '#FF8F00', bg: '#FFF8E1' },
          { label: 'Médicos Activos', value: String(stats.activeDoctors), cambio: '+3', icon: Stethoscope, color: '#7B1FA2', bg: '#F3E5F5' },
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
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader className="h-6 w-6 animate-spin text-[#1E88E5]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#212121]">Satisfacción del Paciente</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={satisfactionData}>
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
                <BarChart data={appointmentsBySpecialty} layout="vertical">
                  <XAxis type="number" tick={{ fill: '#616161', fontSize: 12 }} />
                  <YAxis dataKey="especialidad" type="category" width={70} tick={{ fill: '#616161', fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="citas" fill="#1E88E5" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reportes disponibles */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#212121]">
            <BarChart3 className="h-5 w-5 text-[#1E88E5]" />
            Reportes Disponibles para Descargar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reportes.map((r, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-[#F5F7FA] rounded-lg gap-2">
                <div>
                  <p className="text-sm text-[#212121]">{r.nombre}</p>
                  <p className="text-xs text-[#616161]">{r.tipo} - Datos actuales de la BD</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#E8F5E9] text-[#43A047]">
                    {r.estado}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-[#1E88E5] border-[#1E88E5] rounded-lg text-xs"
                    onClick={() => downloadReport(r.tipo_id)}
                    disabled={downloading === r.tipo_id}
                  >
                    {downloading === r.tipo_id ? (
                      <>
                        <Loader className="h-3 w-3 mr-1 animate-spin" /> Descargando...
                      </>
                    ) : (
                      <>
                        <Download className="h-3 w-3 mr-1" /> Descargar CSV
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
