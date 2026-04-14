import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { CalendarPlus, ArrowLeft } from 'lucide-react';

const especialidades = [
  'Cardiologia', 'Dermatologia', 'Medicina General', 'Pediatria',
  'Ginecologia', 'Oftalmologia', 'Neurologia', 'Traumatologia',
];

const medicosPorEspecialidad: Record<string, string[]> = {
  'Cardiologia': ['Dr. Juan Martinez', 'Dra. Ana Torres'],
  'Dermatologia': ['Dra. Maria Rodriguez', 'Dr. Pedro Gomez'],
  'Medicina General': ['Dr. Carlos Lopez', 'Dra. Laura Diaz'],
  'Pediatria': ['Dra. Sofia Ramirez', 'Dr. Diego Herrera'],
  'Ginecologia': ['Dra. Carmen Ruiz', 'Dra. Isabel Moreno'],
  'Oftalmologia': ['Dr. Roberto Jimenez', 'Dra. Patricia Vega'],
  'Neurologia': ['Dr. Alejandro Reyes', 'Dra. Monica Castro'],
  'Traumatologia': ['Dr. Fernando Silva', 'Dr. Andres Molina'],
};

const horasDisponibles = ['8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'];

export function AgendarCitaScreen() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    especialidad: '',
    medico: '',
    fecha: '',
    hora: '',
    motivo: '',
  });

  const medicos = form.especialidad ? medicosPorEspecialidad[form.especialidad] || [] : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/app/confirmacion-cita', { state: { cita: { ...form } } });
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
              <Select value={form.especialidad} onValueChange={(v) => setForm({ ...form, especialidad: v, medico: '' })}>
                <SelectTrigger className="mt-1 border-[#DADADA] rounded-lg">
                  <SelectValue placeholder="Seleccione especialidad" />
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
              <Select value={form.medico} onValueChange={(v) => setForm({ ...form, medico: v })} disabled={!form.especialidad}>
                <SelectTrigger className="mt-1 border-[#DADADA] rounded-lg">
                  <SelectValue placeholder={form.especialidad ? 'Seleccione medico' : 'Primero seleccione especialidad'} />
                </SelectTrigger>
                <SelectContent>
                  {medicos.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
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
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                  className="mt-1 border-[#DADADA] rounded-lg"
                  min="2026-03-06"
                />
              </div>
              <div>
                <Label className="text-[#212121]">Hora Disponible</Label>
                <Select value={form.hora} onValueChange={(v) => setForm({ ...form, hora: v })}>
                  <SelectTrigger className="mt-1 border-[#DADADA] rounded-lg">
                    <SelectValue placeholder="Seleccione hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {horasDisponibles.map((h) => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-[#212121]">Motivo de Consulta</Label>
              <Textarea
                value={form.motivo}
                onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                placeholder="Describa brevemente el motivo de su consulta..."
                className="mt-1 border-[#DADADA] rounded-lg min-h-[100px]"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                className="bg-[#1E88E5] hover:bg-[#1565C0] active:bg-[#0D47A1] text-white rounded-lg flex-1"
              >
                Confirmar Cita
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
