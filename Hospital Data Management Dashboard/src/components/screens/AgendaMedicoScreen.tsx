import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CalendarClock, User, Clock, FileText, ChevronLeft, ChevronRight, Stethoscope, ClipboardList, Loader } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { toast } from 'sonner@2.0.3';
import { appointmentsApi, getApiErrorMessage, type Appointment } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface CitaAgenda extends Appointment {
  patient_name?: string;
  doctor_name?: string;
  doctor_user_id?: string;
}

const estadoColor: Record<string, string> = {
  'scheduled': 'bg-[#FFF8E1] text-[#FF8F00]',
  'pending': 'bg-[#FFF8E1] text-[#FF8F00]',
  'in_progress': 'bg-[#E3F2FD] text-[#1E88E5]',
  'completed': 'bg-[#E8F5E9] text-[#43A047]',
  'cancelled': 'bg-[#FFEBEE] text-[#E53935]',
};

const statusLabel: Record<string, string> = {
  'scheduled': 'Pendiente',
  'pending': 'Pendiente',
  'in_progress': 'En consulta',
  'completed': 'Completada',
  'cancelled': 'Cancelada',
};

const formatApiTime = (value: string) => {
  const [hours = '0', minutes = '00'] = value.split(':');
  const hourNumber = Number(hours);
  const suffix = hourNumber >= 12 ? 'PM' : 'AM';
  const normalizedHour = hourNumber % 12 || 12;
  return `${normalizedHour}:${minutes} ${suffix}`;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric' });
};

export function AgendaMedicoScreen() {
  const { user } = useAuth();
  const [citas, setCitas] = useState<CitaAgenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(0);
  const [diagnosticoOpen, setDiagnosticoOpen] = useState(false);
  const [selectedCita, setSelectedCita] = useState<CitaAgenda | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      // El endpoint /appointments filtra automáticamente por doctor cuando el usuario es doctor
      const doctorAppointments = await appointmentsApi.list();
      setCitas(doctorAppointments as CitaAgenda[]);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast.error('Error al cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsAttended = async (cita: CitaAgenda) => {
    try {
      await appointmentsApi.markAsAttended(cita.id);
      setCitas(prev => prev.map(c => 
        c.id === cita.id 
          ? { ...c, status: 'in_progress' }
          : c
      ));
      toast.success('Cita marcada como en consulta');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleCompleteAppointment = async () => {
    if (!selectedCita || !diagnosis.trim()) {
      toast.error('Por favor ingrese un diagnóstico');
      return;
    }

    setIsSubmitting(true);
    try {
      await appointmentsApi.markAsCompleted(selectedCita.id, diagnosis, notes);
      setCitas(prev => prev.map(c =>
        c.id === selectedCita.id
          ? { ...c, status: 'completed' }
          : c
      ));
      setDiagnosticoOpen(false);
      setDiagnosis('');
      setNotes('');
      setSelectedCita(null);
      toast.success('Consulta completada exitosamente');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get unique dates from appointments, or use today
  const uniqueDates = Array.from(new Set(citas.map(c => c.appointment_date))).sort();
  const displayDates = uniqueDates.length > 0 ? uniqueDates : [new Date().toISOString().split('T')[0]];
  const currentDate = displayDates[selectedDay] || displayDates[0];
  
  const citasDelDia = citas.filter(c => c.appointment_date === currentDate).sort((a, b) => 
    a.appointment_time.localeCompare(b.appointment_time)
  );

  const stats = {
    total: citasDelDia.length,
    attended: citasDelDia.filter(c => c.status === 'in_progress' || c.status === 'completed').length,
    pending: citasDelDia.filter(c => c.status === 'scheduled' || c.status === 'pending').length,
    inProgress: citasDelDia.filter(c => c.status === 'in_progress').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-[#212121]">Agenda Medica</h2>
        <p className="text-[#616161]">Gestiona tus citas del día - {user?.first_name || 'Médico'}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Citas Hoy', value: stats.total, icon: CalendarClock, color: '#1E88E5', bg: '#E3F2FD' },
          { label: 'Atendidos', value: stats.attended, icon: User, color: '#43A047', bg: '#E8F5E9' },
          { label: 'Pendientes', value: stats.pending, icon: Clock, color: '#FF8F00', bg: '#FFF8E1' },
          { label: 'En Consulta', value: stats.inProgress, icon: Stethoscope, color: '#7B1FA2', bg: '#F3E5F5' },
        ].map((s, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.bg }}>
                <s.icon className="h-5 w-5" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-xs text-[#616161]">{s.label}</p>
                <p className="text-xl text-[#212121]">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Week nav */}
      {displayDates.length > 1 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="ghost" 
                size="sm"
                disabled={selectedDay === 0}
                onClick={() => setSelectedDay(Math.max(0, selectedDay - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-[#212121]">{formatDate(currentDate)}</span>
              <Button 
                variant="ghost" 
                size="sm"
                disabled={selectedDay === displayDates.length - 1}
                onClick={() => setSelectedDay(Math.min(displayDates.length - 1, selectedDay + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            {displayDates.length > 1 && (
              <div className="grid grid-cols-5 gap-2 overflow-x-auto">
                {displayDates.map((date, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(i)}
                    className={`p-2 rounded-lg text-center text-xs transition-all whitespace-nowrap ${
                      i === selectedDay
                        ? 'bg-[#1E88E5] text-white'
                        : 'bg-[#F5F7FA] text-[#616161] hover:bg-[#E3F2FD]'
                    }`}
                  >
                    {formatDate(date)}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Citas */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#212121]">Citas del día - {formatDate(currentDate)}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-6 w-6 animate-spin text-[#1E88E5]" />
            </div>
          ) : citasDelDia.length === 0 ? (
            <div className="text-center py-8 text-[#616161]">
              No hay citas programadas para este día
            </div>
          ) : (
            <div className="space-y-3">
              {citasDelDia.map((cita) => (
                <div key={cita.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#F5F7FA] rounded-xl gap-3">
                  <div className="flex items-center gap-3">
                    <div className="text-center min-w-[60px]">
                      <p className="text-sm font-semibold text-[#1E88E5]">{formatApiTime(cita.appointment_time)}</p>
                    </div>
                    <div className="w-px h-8 bg-[#DADADA] hidden sm:block" />
                    <div>
                      <p className="text-sm font-medium text-[#212121]">{cita.patient_name || 'Paciente'}</p>
                      <p className="text-xs text-[#616161]">{cita.chief_complaint || cita.appointment_type || 'Consulta'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-[60px] sm:ml-0 flex-wrap">
                    <Badge className={estadoColor[cita.status] || 'bg-gray-100 text-gray-600'}>
                      {statusLabel[cita.status] || cita.status}
                    </Badge>
                    {(cita.status === 'scheduled' || cita.status === 'pending') && (
                      <Button 
                        size="sm" 
                        className="bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-lg text-xs"
                        onClick={() => handleMarkAsAttended(cita)}
                      >
                        <Stethoscope className="h-3 w-3 mr-1" /> Atender
                      </Button>
                    )}
                    {cita.status === 'in_progress' && (
                      <Dialog open={diagnosticoOpen && selectedCita?.id === cita.id} onOpenChange={(open) => {
                        if (open) {
                          setSelectedCita(cita);
                          setDiagnosis('');
                          setNotes('');
                        }
                        setDiagnosticoOpen(open);
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            className="bg-[#43A047] hover:bg-[#388E3C] text-white rounded-lg text-xs"
                          >
                            <ClipboardList className="h-3 w-3 mr-1" /> Diagnóstico
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Registrar Diagnóstico</DialogTitle>
                            <DialogDescription>
                              Paciente: {selectedCita?.patient_name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-[#212121]">Diagnóstico *</Label>
                              <Textarea 
                                placeholder="Ingrese el diagnóstico..." 
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                className="mt-1 border-[#DADADA] rounded-lg focus:border-[#1E88E5]"
                              />
                            </div>
                            <div>
                              <Label className="text-[#212121]">Notas / Observaciones</Label>
                              <Textarea 
                                placeholder="Notas adicionales, tratamiento, medicamentos..." 
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="mt-1 border-[#DADADA] rounded-lg focus:border-[#1E88E5]"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button 
                              variant="outline" 
                              className="border-[#DADADA] text-[#616161] rounded-lg"
                              onClick={() => setDiagnosticoOpen(false)}
                              disabled={isSubmitting}
                            >
                              Cancelar
                            </Button>
                            <Button 
                              className="bg-[#43A047] hover:bg-[#388E3C] text-white rounded-lg"
                              onClick={handleCompleteAppointment}
                              disabled={isSubmitting || !diagnosis.trim()}
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader className="h-3 w-3 mr-1 animate-spin" />
                                  Guardando...
                                </>
                              ) : (
                                'Guardar Diagnóstico'
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
