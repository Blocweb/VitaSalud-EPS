import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { CalendarPlus, ArrowLeft } from 'lucide-react';
import { appointmentsApi, doctorsApi, getApiErrorMessage, patientsApi, type Doctor } from '../../lib/api';

// Time slot options removed; fetch available slots from appointments/schedule API.
const horasDisponibles: { value: string; label: string }[] = [];

const getTodayStr = () => new Date().toISOString().split('T')[0];

export function AgendarCitaScreen() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    especialidad: '',
    medico: '',
    fecha: '',
    hora: '',
    motivo: '',
  });

  useEffect(() => {
    let ignore = false;

    async function loadDoctors() {
      try {
        const data = await doctorsApi.list();
        if (!ignore) setDoctors(data);
      } catch (err) {
        if (!ignore) setError(getApiErrorMessage(err));
      } finally {
        if (!ignore) setLoadingDoctors(false);
      }
    }

    loadDoctors();

    return () => {
      ignore = true;
    };
  }, []);

  const especialidades = useMemo(
    () => Array.from(new Set(doctors.map((doctor) => doctor.specialization).filter(Boolean))).sort(),
    [doctors]
  );

  const medicos = useMemo(
    () => doctors.filter((doctor) => doctor.specialization === form.especialidad),
    [doctors, form.especialidad]
  );

  const selectedDoctor = doctors.find((doctor) => doctor.id === form.medico);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.especialidad || !form.medico || !form.fecha || !form.hora) {
      setError('Selecciona especialidad, medico, fecha y hora');
      return;
    }

    setIsSubmitting(true);

    try {
      const patient = await patientsApi.me();
      const appointment = await appointmentsApi.create({
        patient_id: patient.id,
        doctor_id: form.medico,
        appointment_date: form.fecha,
        appointment_time: form.hora,
        appointment_type: form.especialidad,
        priority: 'medium',
        chief_complaint: form.motivo,
      });

      const selectedHour = horasDisponibles.find((hora) => hora.value === form.hora);
      navigate('/app/confirmacion-cita', {
        state: {
          cita: {
            id: appointment.id,
            especialidad: form.especialidad,
            medico: selectedDoctor ? `${selectedDoctor.first_name} ${selectedDoctor.last_name}` : 'Medico asignado',
            fecha: form.fecha,
            hora: selectedHour?.label || form.hora,
            motivo: form.motivo,
          },
        },
      });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/app')} className="text-[#1E88E5]">
          <ArrowLeft className="h-4 w-4 mr-1" /> Volver
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#212121]">
            <CalendarPlus className="h-5 w-5 text-[#1E88E5]" />
            Agendar Nueva Cita
          </CardTitle>
          <p className="text-sm text-[#616161]">Complete el formulario para solicitar una cita medica</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="text-[#212121]">Especialidad</Label>
              <Select value={form.especialidad} onValueChange={(v) => { setForm({ ...form, especialidad: v, medico: '' }); setError(''); }}>
                <SelectTrigger className="mt-1 border-[#DADADA] rounded-lg">
                  <SelectValue placeholder={loadingDoctors ? 'Cargando especialidades...' : 'Seleccione especialidad'} />
                </SelectTrigger>
                <SelectContent>
                  {especialidades.map((e) => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-[#212121]">Medico</Label>
              <Select value={form.medico} onValueChange={(v) => { setForm({ ...form, medico: v }); setError(''); }} disabled={!form.especialidad || loadingDoctors}>
                <SelectTrigger className="mt-1 border-[#DADADA] rounded-lg">
                  <SelectValue placeholder={form.especialidad ? 'Seleccione medico' : 'Primero seleccione especialidad'} />
                </SelectTrigger>
                <SelectContent>
                  {medicos.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.first_name} {m.last_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-[#212121]">Fecha</Label>
                <Input
                  type="date"
                  value={form.fecha}
                  onChange={(e) => { setForm({ ...form, fecha: e.target.value }); setError(''); }}
                  className="mt-1 border-[#DADADA] rounded-lg"
                  min={getTodayStr()}
                />
              </div>
              <div>
                <Label className="text-[#212121]">Hora Disponible</Label>
                <Select value={form.hora} onValueChange={(v) => { setForm({ ...form, hora: v }); setError(''); }}>
                  <SelectTrigger className="mt-1 border-[#DADADA] rounded-lg">
                    <SelectValue placeholder="Seleccione hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {horasDisponibles.map((h) => (
                      <SelectItem key={h.value} value={h.value}>{h.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-[#212121]">Motivo de Consulta</Label>
              <Textarea
                value={form.motivo}
                onChange={(e) => { setForm({ ...form, motivo: e.target.value }); setError(''); }}
                placeholder="Describa brevemente el motivo de su consulta..."
                className="mt-1 border-[#DADADA] rounded-lg min-h-[100px]"
              />
            </div>

            {error && <p className="text-sm text-[#E53935]">{error}</p>}

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || loadingDoctors}
                className="bg-[#1E88E5] hover:bg-[#1565C0] active:bg-[#0D47A1] text-white rounded-lg flex-1 disabled:opacity-60"
              >
                {isSubmitting ? 'Agendando...' : 'Confirmar Cita'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/app')}
                className="border-[#1E88E5] text-[#1E88E5] rounded-lg"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
