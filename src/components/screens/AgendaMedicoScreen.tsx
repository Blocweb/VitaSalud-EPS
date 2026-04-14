import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CalendarClock, User, Clock, FileText, ChevronLeft, ChevronRight, Stethoscope, ClipboardList } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

const diasSemana = ['Lun 9', 'Mar 10', 'Mie 11', 'Jue 12', 'Vie 13'];

const citasDelDia = [
  { id: 1, hora: '8:00 AM', paciente: 'Carlos Mendoza', motivo: 'Control hipertension', estado: 'Pendiente' },
  { id: 2, hora: '8:30 AM', paciente: 'Ana Garcia', motivo: 'Dolor toracico', estado: 'En consulta' },
  { id: 3, hora: '9:00 AM', paciente: 'Luis Fernandez', motivo: 'Electrocardiograma', estado: 'Pendiente' },
  { id: 4, hora: '9:30 AM', paciente: 'Maria Torres', motivo: 'Control post-operatorio', estado: 'Pendiente' },
  { id: 5, hora: '10:00 AM', paciente: 'Pedro Ramirez', motivo: 'Primera consulta', estado: 'Pendiente' },
  { id: 6, hora: '10:30 AM', paciente: 'Sofia Lopez', motivo: 'Seguimiento tratamiento', estado: 'Completada' },
  { id: 7, hora: '2:00 PM', paciente: 'Diego Herrera', motivo: 'Dolor de pecho', estado: 'Pendiente' },
  { id: 8, hora: '2:30 PM', paciente: 'Laura Diaz', motivo: 'Revision anual', estado: 'Pendiente' },
];

const estadoColor: Record<string, string> = {
  'Pendiente': 'bg-[#FFF8E1] text-[#FF8F00]',
  'En consulta': 'bg-[#E3F2FD] text-[#1E88E5]',
  'Completada': 'bg-[#E8F5E9] text-[#43A047]',
};

export function AgendaMedicoScreen() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [diagnosticoOpen, setDiagnosticoOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-[#212121]">Agenda Medica</h2>
        <p className="text-[#616161]">Vista del medico - Dr. Juan Martinez, Cardiologia</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Citas Hoy', value: '8', icon: CalendarClock, color: '#1E88E5', bg: '#E3F2FD' },
          { label: 'Atendidos', value: '1', icon: User, color: '#43A047', bg: '#E8F5E9' },
          { label: 'Pendientes', value: '6', icon: Clock, color: '#FF8F00', bg: '#FFF8E1' },
          { label: 'En Consulta', value: '1', icon: Stethoscope, color: '#7B1FA2', bg: '#F3E5F5' },
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
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm"><ChevronLeft className="h-4 w-4" /></Button>
            <span className="text-sm text-[#212121]">Marzo 2026</span>
            <Button variant="ghost" size="sm"><ChevronRight className="h-4 w-4" /></Button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {diasSemana.map((dia, i) => (
              <button
                key={i}
                onClick={() => setSelectedDay(i)}
                className={`p-2 rounded-lg text-center text-sm transition-all ${
                  i === selectedDay
                    ? 'bg-[#1E88E5] text-white'
                    : 'bg-[#F5F7FA] text-[#616161] hover:bg-[#E3F2FD]'
                }`}
              >
                {dia}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Citas */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#212121]">Citas del dia - {diasSemana[selectedDay]}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {citasDelDia.map((cita) => (
              <div key={cita.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#F5F7FA] rounded-xl gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-center min-w-[60px]">
                    <p className="text-sm text-[#1E88E5]">{cita.hora}</p>
                  </div>
                  <div className="w-px h-8 bg-[#DADADA] hidden sm:block" />
                  <div>
                    <p className="text-sm text-[#212121]">{cita.paciente}</p>
                    <p className="text-xs text-[#616161]">{cita.motivo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-[60px] sm:ml-0">
                  <Badge className={estadoColor[cita.estado]}>{cita.estado}</Badge>
                  {cita.estado === 'Pendiente' && (
                    <Button size="sm" className="bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-lg text-xs">
                      <Stethoscope className="h-3 w-3 mr-1" /> Atender
                    </Button>
                  )}
                  {cita.estado === 'En consulta' && (
                    <Dialog open={diagnosticoOpen} onOpenChange={setDiagnosticoOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-[#43A047] hover:bg-[#388E3C] text-white rounded-lg text-xs">
                          <ClipboardList className="h-3 w-3 mr-1" /> Registrar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Registrar Diagnostico - {cita.paciente}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Diagnostico</Label>
                            <Textarea placeholder="Ingrese el diagnostico..." className="mt-1 border-[#DADADA] rounded-lg" />
                          </div>
                          <div>
                            <Label>Tratamiento</Label>
                            <Textarea placeholder="Ingrese el tratamiento..." className="mt-1 border-[#DADADA] rounded-lg" />
                          </div>
                          <div>
                            <Label>Medicamentos</Label>
                            <Textarea placeholder="Lista de medicamentos recetados..." className="mt-1 border-[#DADADA] rounded-lg" />
                          </div>
                          <div className="flex gap-3">
                            <Button className="bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-lg flex-1" onClick={() => setDiagnosticoOpen(false)}>
                              Guardar Diagnostico
                            </Button>
                            <Button variant="outline" className="border-[#1E88E5] text-[#1E88E5] rounded-lg" onClick={() => setDiagnosticoOpen(false)}>
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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
