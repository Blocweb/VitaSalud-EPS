import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { CalendarDays, Plus, Clock, Stethoscope, X, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Cita {
  id: number;
  fecha: string;
  hora: string;
  medico: string;
  especialidad: string;
  estado: string;
  motivo: string;
}

const citasIniciales: Cita[] = [
  { id: 1, fecha: '2026-03-10', hora: '10:00 AM', medico: 'Dr. Juan Martinez', especialidad: 'Cardiologia', estado: 'Confirmada', motivo: 'Control de rutina' },
  { id: 2, fecha: '2026-03-12', hora: '2:30 PM', medico: 'Dra. Maria Rodriguez', especialidad: 'Dermatologia', estado: 'Pendiente', motivo: 'Revision de piel' },
  { id: 3, fecha: '2026-03-14', hora: '9:00 AM', medico: 'Dr. Carlos Lopez', especialidad: 'Medicina General', estado: 'Confirmada', motivo: 'Chequeo general' },
  { id: 4, fecha: '2026-02-20', hora: '11:00 AM', medico: 'Dra. Sofia Ramirez', especialidad: 'Pediatria', estado: 'Completada', motivo: 'Control pediatrico' },
  { id: 5, fecha: '2026-02-15', hora: '3:00 PM', medico: 'Dr. Alejandro Reyes', especialidad: 'Neurologia', estado: 'Cancelada', motivo: 'Dolor de cabeza' },
  { id: 6, fecha: '2026-01-28', hora: '10:30 AM', medico: 'Dr. Juan Martinez', especialidad: 'Cardiologia', estado: 'Completada', motivo: 'Electrocardiograma' },
];

const horasDisponibles = [
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM',
];

const estadoColors: Record<string, string> = {
  'Confirmada': 'bg-[#E8F5E9] text-[#43A047]',
  'Pendiente': 'bg-[#FFF8E1] text-[#FF8F00]',
  'Completada': 'bg-[#E3F2FD] text-[#1E88E5]',
  'Cancelada': 'bg-[#FFEBEE] text-[#E53935]',
  'Reprogramada': 'bg-[#F3E5F5] text-[#8E24AA]',
};

export function MisCitasScreen() {
  const navigate = useNavigate();
  const [citas, setCitas] = useState<Cita[]>(citasIniciales);
  const [filtroEstado, setFiltroEstado] = useState('all');

  // Reschedule state
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const [newFecha, setNewFecha] = useState('');
  const [newHora, setNewHora] = useState('');
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);

  // Cancel state
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelCita, setCancelCita] = useState<Cita | null>(null);
  const [cancelMotivo, setCancelMotivo] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState(false);

  const citasFiltradas = filtroEstado === 'all' ? citas : citas.filter(c => c.estado === filtroEstado);

  // Open reschedule dialog
  const openReschedule = (cita: Cita) => {
    setSelectedCita(cita);
    setNewFecha('');
    setNewHora('');
    setRescheduleSuccess(false);
    setRescheduleOpen(true);
  };

  // Confirm reschedule
  const handleReschedule = () => {
    if (!newFecha || !newHora || !selectedCita) return;
    setCitas(prev => prev.map(c =>
      c.id === selectedCita.id
        ? { ...c, fecha: newFecha, hora: newHora, estado: 'Pendiente' }
        : c
    ));
    setRescheduleSuccess(true);
    toast.success('Cita reprogramada exitosamente');
  };

  // Open cancel dialog
  const openCancel = (cita: Cita) => {
    setCancelCita(cita);
    setCancelMotivo('');
    setCancelSuccess(false);
    setCancelOpen(true);
  };

  // Confirm cancel
  const handleCancel = () => {
    if (!cancelCita) return;
    setCitas(prev => prev.map(c =>
      c.id === cancelCita.id
        ? { ...c, estado: 'Cancelada' }
        : c
    ));
    setCancelSuccess(true);
    toast.success('Cita cancelada');
  };

  const getTodayStr = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl text-[#212121]">Mis Citas</h2>
          <p className="text-[#616161]">Gestiona todas tus citas medicas</p>
        </div>
        <Button onClick={() => navigate('/app/agendar-cita')} className="bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-lg">
          <Plus className="h-4 w-4 mr-2" /> Agendar Cita
        </Button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-[#616161]">Filtrar por estado:</span>
        <Select value={filtroEstado} onValueChange={setFiltroEstado}>
          <SelectTrigger className="w-44 border-[#DADADA] rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="Confirmada">Confirmadas</SelectItem>
            <SelectItem value="Pendiente">Pendientes</SelectItem>
            <SelectItem value="Completada">Completadas</SelectItem>
            <SelectItem value="Cancelada">Canceladas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Table */}
      <Card className="border-0 shadow-sm hidden md:block">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="bg-[#E3F2FD]">
                <th className="text-left p-3 text-sm text-[#1E88E5]">Fecha</th>
                <th className="text-left p-3 text-sm text-[#1E88E5]">Hora</th>
                <th className="text-left p-3 text-sm text-[#1E88E5]">Medico</th>
                <th className="text-left p-3 text-sm text-[#1E88E5]">Especialidad</th>
                <th className="text-left p-3 text-sm text-[#1E88E5]">Estado</th>
                <th className="text-left p-3 text-sm text-[#1E88E5]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citasFiltradas.map((cita, i) => (
                <tr key={cita.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}>
                  <td className="p-3 text-sm text-[#212121]">{cita.fecha}</td>
                  <td className="p-3 text-sm text-[#212121]">{cita.hora}</td>
                  <td className="p-3 text-sm text-[#212121]">{cita.medico}</td>
                  <td className="p-3 text-sm text-[#616161]">{cita.especialidad}</td>
                  <td className="p-3">
                    <Badge className={estadoColors[cita.estado] || 'bg-gray-100 text-gray-600'}>{cita.estado}</Badge>
                  </td>
                  <td className="p-3">
                    {(cita.estado === 'Confirmada' || cita.estado === 'Pendiente') && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[#1E88E5] border-[#1E88E5] rounded-lg text-xs"
                          onClick={() => openReschedule(cita)}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" /> Reprogramar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[#E53935] border-[#E53935] rounded-lg text-xs"
                          onClick={() => openCancel(cita)}
                        >
                          <X className="h-3 w-3 mr-1" /> Cancelar
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {citasFiltradas.map((cita) => (
          <Card key={cita.id} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#E3F2FD] rounded-lg flex items-center justify-center">
                    <Stethoscope className="h-5 w-5 text-[#1E88E5]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#212121]">{cita.medico}</p>
                    <p className="text-xs text-[#616161]">{cita.especialidad}</p>
                  </div>
                </div>
                <Badge className={estadoColors[cita.estado] || 'bg-gray-100 text-gray-600'}>{cita.estado}</Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-[#616161] mb-1">
                <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {cita.fecha}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {cita.hora}</span>
              </div>
              <p className="text-xs text-[#9E9E9E] mb-3">Motivo: {cita.motivo}</p>
              {(cita.estado === 'Confirmada' || cita.estado === 'Pendiente') && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[#1E88E5] border-[#1E88E5] rounded-lg text-xs flex-1"
                    onClick={() => openReschedule(cita)}
                  >
                    Reprogramar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[#E53935] border-[#E53935] rounded-lg text-xs flex-1"
                    onClick={() => openCancel(cita)}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {citasFiltradas.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <CalendarDays className="h-12 w-12 text-[#DADADA] mx-auto mb-3" />
            <p className="text-[#616161]">No se encontraron citas con este filtro</p>
          </CardContent>
        </Card>
      )}

      {/* ===== Reschedule Dialog ===== */}
      <Dialog open={rescheduleOpen} onOpenChange={(open) => { if (!open) setRescheduleOpen(false); }}>
        <DialogContent className="sm:max-w-md">
          {!rescheduleSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-[#212121]">
                  <RefreshCw className="h-5 w-5 text-[#1E88E5]" />
                  Reprogramar Cita
                </DialogTitle>
                <DialogDescription>
                  Selecciona una nueva fecha y hora para tu cita
                </DialogDescription>
              </DialogHeader>

              {selectedCita && (
                <div className="bg-[#E3F2FD] rounded-lg p-3 space-y-1">
                  <p className="text-sm text-[#1E88E5]">Cita actual</p>
                  <p className="text-sm text-[#212121]">{selectedCita.medico} — {selectedCita.especialidad}</p>
                  <p className="text-xs text-[#616161]">{selectedCita.fecha} a las {selectedCita.hora}</p>
                  <p className="text-xs text-[#616161]">Motivo: {selectedCita.motivo}</p>
                </div>
              )}

              <div className="space-y-4 mt-2">
                <div>
                  <Label className="text-[#212121]">Nueva Fecha</Label>
                  <Input
                    type="date"
                    min={getTodayStr()}
                    value={newFecha}
                    onChange={(e) => setNewFecha(e.target.value)}
                    className="mt-1 border-[#DADADA] rounded-lg focus:border-[#1E88E5] focus:ring-[#1E88E5]"
                  />
                </div>
                <div>
                  <Label className="text-[#212121]">Nueva Hora</Label>
                  <Select value={newHora} onValueChange={setNewHora}>
                    <SelectTrigger className="mt-1 border-[#DADADA] rounded-lg">
                      <SelectValue placeholder="Selecciona una hora" />
                    </SelectTrigger>
                    <SelectContent>
                      {horasDisponibles.map(h => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="mt-2">
                <Button
                  variant="outline"
                  onClick={() => setRescheduleOpen(false)}
                  className="rounded-lg border-[#DADADA] text-[#616161]"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleReschedule}
                  disabled={!newFecha || !newHora}
                  className="bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-lg disabled:opacity-50"
                >
                  Confirmar Reprogramacion
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-7 w-7 text-[#43A047]" />
              </div>
              <h3 className="text-lg text-[#212121] mb-1">Cita Reprogramada</h3>
              <p className="text-sm text-[#616161] mb-1">Tu cita con {selectedCita?.medico} ha sido reprogramada.</p>
              <div className="bg-[#F5F7FA] rounded-lg p-3 my-4 inline-block">
                <p className="text-sm text-[#212121]">
                  <CalendarDays className="h-4 w-4 inline mr-1 text-[#1E88E5]" />
                  {newFecha} a las {newHora}
                </p>
              </div>
              <div>
                <Button onClick={() => setRescheduleOpen(false)} className="bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-lg">
                  Entendido
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== Cancel Dialog ===== */}
      <Dialog open={cancelOpen} onOpenChange={(open) => { if (!open) setCancelOpen(false); }}>
        <DialogContent className="sm:max-w-md">
          {!cancelSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-[#212121]">
                  <AlertTriangle className="h-5 w-5 text-[#E53935]" />
                  Cancelar Cita
                </DialogTitle>
                <DialogDescription>
                  Esta accion no se puede deshacer. La cita sera cancelada definitivamente.
                </DialogDescription>
              </DialogHeader>

              {cancelCita && (
                <div className="bg-[#FFEBEE] rounded-lg p-3 space-y-1">
                  <p className="text-sm text-[#E53935]">Cita a cancelar</p>
                  <p className="text-sm text-[#212121]">{cancelCita.medico} — {cancelCita.especialidad}</p>
                  <p className="text-xs text-[#616161]">{cancelCita.fecha} a las {cancelCita.hora}</p>
                  <p className="text-xs text-[#616161]">Motivo: {cancelCita.motivo}</p>
                </div>
              )}

              <div className="mt-2">
                <Label className="text-[#212121]">Motivo de cancelacion (opcional)</Label>
                <Select value={cancelMotivo} onValueChange={setCancelMotivo}>
                  <SelectTrigger className="mt-1 border-[#DADADA] rounded-lg">
                    <SelectValue placeholder="Selecciona un motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Motivos personales</SelectItem>
                    <SelectItem value="horario">Conflicto de horario</SelectItem>
                    <SelectItem value="mejoria">Ya me siento mejor</SelectItem>
                    <SelectItem value="otro-medico">Consultare otro medico</SelectItem>
                    <SelectItem value="otro">Otro motivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className="mt-2">
                <Button
                  variant="outline"
                  onClick={() => setCancelOpen(false)}
                  className="rounded-lg border-[#DADADA] text-[#616161]"
                >
                  Volver
                </Button>
                <Button
                  onClick={handleCancel}
                  className="bg-[#E53935] hover:bg-[#C62828] text-white rounded-lg"
                >
                  Confirmar Cancelacion
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-[#FFEBEE] rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="h-7 w-7 text-[#E53935]" />
              </div>
              <h3 className="text-lg text-[#212121] mb-1">Cita Cancelada</h3>
              <p className="text-sm text-[#616161] mb-4">
                Tu cita con {cancelCita?.medico} del {cancelCita?.fecha} ha sido cancelada exitosamente.
              </p>
              <Button onClick={() => setCancelOpen(false)} className="bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-lg">
                Entendido
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}