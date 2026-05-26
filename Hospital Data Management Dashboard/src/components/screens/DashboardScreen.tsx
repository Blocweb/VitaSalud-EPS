import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CalendarDays, Pill, Bell, CalendarPlus, FileText, Heart, Users, Activity, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { appointmentsApi, doctorsApi, getApiErrorMessage, medicalRecordsApi, patientsApi, type Appointment, type MedicalRecord } from '../../lib/api';

const stats = [
  { title: 'Proximas Citas', value: '3', icon: CalendarDays, color: '#1E88E5', bg: '#E3F2FD' },
  { title: 'Tratamientos Activos', value: '2', icon: Pill, color: '#43A047', bg: '#E8F5E9' },
  { title: 'Notificaciones', value: '5', icon: Bell, color: '#E53935', bg: '#FFEBEE' },
  { title: 'Consultas este mes', value: '4', icon: Activity, color: '#FF8F00', bg: '#FFF8E1' },
];

const proximasCitas = [
  { id: 1, doctor: 'Dr. Martinez', especialidad: 'Cardiologia', fecha: 'Lun 10 Mar', hora: '10:00 AM', estado: 'Confirmada' },
  { id: 2, doctor: 'Dra. Rodriguez', especialidad: 'Dermatologia', fecha: 'Mie 12 Mar', hora: '2:30 PM', estado: 'Pendiente' },
  { id: 3, doctor: 'Dr. Lopez', especialidad: 'Medicina General', fecha: 'Vie 14 Mar', hora: '9:00 AM', estado: 'Confirmada' },
];

const tratamientosActivos = [
  { id: 1, nombre: 'Tratamiento Hipertension', medico: 'Dr. Martinez', duracion: '3 meses', progreso: 65 },
  { id: 2, nombre: 'Control Dermatologico', medico: 'Dra. Rodriguez', duracion: '1 mes', progreso: 30 },
];

const notificaciones = [
  { msg: 'Recordatorio: Cita con Dr. Martinez en 2 dias', time: 'Hace 1h', type: 'cita' },
  { msg: 'Resultado de laboratorio disponible', time: 'Hace 3h', type: 'resultado' },
  { msg: 'Tratamiento de hipertension: tomar medicamento', time: 'Hace 5h', type: 'tratamiento' },
  { msg: 'Nueva recomendacion de su medico', time: 'Hace 1 dia', type: 'recomendacion' },
];

const chartData = [
  { mes: 'Oct', citas: 3 },
  { mes: 'Nov', citas: 5 },
  { mes: 'Dic', citas: 2 },
  { mes: 'Ene', citas: 4 },
  { mes: 'Feb', citas: 3 },
  { mes: 'Mar', citas: 4 },
];

const pieData = [
  { name: 'Cardiologia', value: 4, fill: '#1E88E5' },
  { name: 'Dermatologia', value: 2, fill: '#64B5F6' },
  { name: 'General', value: 6, fill: '#43A047' },
  { name: 'Laboratorio', value: 3, fill: '#FDD835' },
];

export function DashboardScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      try {
        let dashboardAppointments: Appointment[] = [];
        let dashboardRecords: MedicalRecord[] = [];

        if (user?.role === 'patient') {
          const patient = await patientsApi.me();
          [dashboardAppointments, dashboardRecords] = await Promise.all([
            appointmentsApi.byPatient(patient.id),
            medicalRecordsApi.byPatient(patient.id),
          ]);
        } else if (user?.role === 'doctor') {
          const doctors = await doctorsApi.list();
          const currentDoctor = doctors.find((doctor) => doctor.user_id === user.id);
          dashboardAppointments = currentDoctor ? await appointmentsApi.byDoctor(currentDoctor.id) : [];
          dashboardRecords = await medicalRecordsApi.list();
        } else {
          dashboardAppointments = await appointmentsApi.list();
          if (user?.role === 'admin') {
            dashboardRecords = await medicalRecordsApi.list();
          }
        }

        if (!ignore) {
          setAppointments(dashboardAppointments);
          setRecords(dashboardRecords);
        }
      } catch (err) {
        if (!ignore) setError(getApiErrorMessage(err));
      }
    }

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, [user?.id, user?.role]);

  const firstName = user?.first_name || user?.email?.split('@')[0] || 'Usuario';
  const today = new Date().toISOString().slice(0, 10);

  const proximasCitas = useMemo(() => appointments
    .filter((appointment) => {
      const date = appointment.appointment_date?.slice(0, 10);
      return date >= today && !['cancelled', 'completed'].includes(appointment.status);
    })
    .sort((a, b) => `${a.appointment_date}${a.appointment_time}`.localeCompare(`${b.appointment_date}${b.appointment_time}`))
    .slice(0, 3)
    .map((appointment) => ({
      id: appointment.id,
      doctor: appointment.doctor_name || 'Medico asignado',
      especialidad: appointment.specialization || appointment.appointment_type || 'Consulta',
      fecha: appointment.appointment_date.slice(0, 10),
      hora: appointment.appointment_time.slice(0, 5),
      estado: appointment.status === 'pending' ? 'Pendiente' : 'Confirmada',
    })), [appointments, today]);

  const stats = useMemo(() => {
    const activeAppointments = appointments.filter((appointment) => !['cancelled', 'completed'].includes(appointment.status));
    const currentMonth = today.slice(0, 7);
    const monthlyRecords = records.filter((record) => record.visit_date?.slice(0, 7) === currentMonth);

    return [
      { title: 'Proximas Citas', value: String(activeAppointments.length), icon: CalendarDays, color: '#1E88E5', bg: '#E3F2FD' },
      { title: 'Tratamientos Activos', value: '2', icon: Pill, color: '#43A047', bg: '#E8F5E9' },
      { title: 'Notificaciones', value: String(notificaciones.length), icon: Bell, color: '#E53935', bg: '#FFEBEE' },
      { title: 'Consultas este mes', value: String(monthlyRecords.length), icon: Activity, color: '#FF8F00', bg: '#FFF8E1' },
    ];
  }, [appointments, records, today]);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#0D47A1] to-[#1E88E5] rounded-xl p-6 text-white">
        <h1 className="text-2xl mb-1">Bienvenido, {firstName}!</h1>
        <p className="text-[#90CAF9]">Aqui tienes un resumen de tu salud y actividades recientes.</p>
      </div>
      {error && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-sm text-[#E53935]">{error}</CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#616161]">{s.title}</p>
                  <p className="text-2xl text-[#212121] mt-1">{s.value}</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.bg }}>
                  <s.icon className="h-6 w-6" style={{ color: s.color }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          ...(user?.role === 'patient' ? [
            { label: 'Agendar Cita', icon: CalendarPlus, path: '/app/agendar-cita', color: '#1E88E5' },
          ] : []),
          { label: 'Ver Historial Clinico', icon: FileText, path: '/app/historial', color: '#43A047' },
          { label: 'Consultar Tratamientos', icon: Pill, path: '/app/tratamientos', color: '#FF8F00' },
        ].map((a, i) => (
          <Button
            key={i}
            onClick={() => navigate(a.path)}
            variant="outline"
            className="h-auto p-4 border-[#DADADA] hover:border-[#1E88E5] hover:bg-[#E3F2FD] rounded-xl justify-start"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: a.color + '15' }}>
                <a.icon className="h-5 w-5" style={{ color: a.color }} />
              </div>
              <span className="text-[#212121]">{a.label}</span>
            </div>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Proximas Citas */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-[#212121]">
                <CalendarDays className="h-5 w-5 text-[#1E88E5]" />
                Proximas Citas
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/app/citas')} className="text-[#1E88E5]">
                Ver todas <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {proximasCitas.length === 0 && (
                <p className="text-sm text-[#616161] p-3 bg-[#F5F7FA] rounded-lg">No tienes citas proximas registradas.</p>
              )}
              {proximasCitas.map((cita) => (
                <div key={cita.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-[#F5F7FA] rounded-lg gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#E3F2FD] rounded-lg flex items-center justify-center">
                      <Heart className="h-5 w-5 text-[#1E88E5]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#212121]">{cita.doctor}</p>
                      <p className="text-xs text-[#616161]">{cita.especialidad}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-right">
                      <p className="text-xs text-[#212121]">{cita.fecha}</p>
                      <p className="text-xs text-[#616161]">{cita.hora}</p>
                    </div>
                    <Badge className={cita.estado === 'Confirmada' ? 'bg-[#E8F5E9] text-[#43A047]' : 'bg-[#FFF8E1] text-[#FF8F00]'}>
                      {cita.estado}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notificaciones */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#212121]">
              <Bell className="h-5 w-5 text-[#E53935]" />
              Notificaciones
              <Badge className="bg-[#FFEBEE] text-[#E53935] ml-auto">{notificaciones.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notificaciones.map((n, i) => (
                <div key={i} className="p-2.5 bg-[#F5F7FA] rounded-lg">
                  <p className="text-xs text-[#212121]">{n.msg}</p>
                  <p className="text-xs text-[#9E9E9E] mt-1">{n.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#212121]">Citas por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
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
            <CardTitle className="text-[#212121]">Consultas por Especialidad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-6">
              <PieChart width={160} height={160}>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" nameKey="name" />
                <Tooltip />
              </PieChart>
              <div className="space-y-2">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-xs text-[#616161]">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tratamientos Activos */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[#212121]">
              <Pill className="h-5 w-5 text-[#43A047]" />
              Tratamientos Activos
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/app/tratamientos')} className="text-[#1E88E5]">
              Ver todos <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tratamientosActivos.map((t) => (
              <div key={t.id} className="p-4 bg-[#F5F7FA] rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-[#212121]">{t.nombre}</p>
                    <p className="text-xs text-[#616161]">{t.medico} - {t.duracion}</p>
                  </div>
                  <Badge className="bg-[#E8F5E9] text-[#43A047]">Activo</Badge>
                </div>
                <div className="w-full bg-[#E3F2FD] rounded-full h-2">
                  <div className="bg-[#1E88E5] h-2 rounded-full transition-all" style={{ width: `${t.progreso}%` }} />
                </div>
                <p className="text-xs text-[#616161] mt-1">{t.progreso}% completado</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
