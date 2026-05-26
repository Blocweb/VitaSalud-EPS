import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { User, Mail, Phone, MapPin, FileText, Calendar, Shield } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useAuth } from '../../context/AuthContext';
import { getApiErrorMessage, patientsApi, type Patient } from '../../lib/api';

const emptyForm = {
  nombre: '',
  documento: '',
  correo: '',
  telefono: '',
  fechaNacimiento: '',
  direccion: '',
};

export function PerfilScreen() {
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      try {
        // Solo cargar datos de paciente si es paciente
        if (user?.role === 'patient') {
          const data = await patientsApi.me();
          if (ignore) return;

          setPatient(data);
          setForm({
            nombre: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
            documento: data.patient_code || '',
            correo: data.email || user?.email || '',
            telefono: data.phone || '',
            fechaNacimiento: data.date_of_birth?.slice(0, 10) || '',
            direccion: data.address || '',
          });
        } else {
          // Para médicos y admin, usar los datos del usuario autenticado
          if (ignore) return;
          setForm({
            nombre: `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
            documento: '',
            correo: user?.email || '',
            telefono: '',
            fechaNacimiento: '',
            direccion: '',
          });
        }
      } catch (err) {
        if (!ignore) setError(getApiErrorMessage(err));
      }
    }

    loadProfile();

    return () => {
      ignore = true;
    };
  }, [user?.email, user?.role]);

  const fullName = form.nombre || [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.email || 'Usuario';
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const updateField = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });
    setMessage('');
    setError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setError('');

    const nameParts = form.nombre.trim().split(/\s+/);
    const firstName = nameParts.shift() || '';
    const lastName = nameParts.join(' ') || firstName;

    try {
      const updated = await patientsApi.updateMe({
        first_name: firstName,
        last_name: lastName,
        email: form.correo,
        phone: form.telefono,
        address: form.direccion,
      });
      setPatient(updated);
      setMessage('Perfil actualizado correctamente');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl text-[#212121]">Mi Perfil</h2>
        <p className="text-[#616161]">Informacion personal y configuracion de cuenta</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-[#E3F2FD] text-[#1E88E5] text-2xl">{initials || 'VS'}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h3 className="text-xl text-[#212121]">{fullName}</h3>
              <p className="text-sm text-[#616161]">{form.correo || user?.email}</p>
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                <Badge className="bg-[#E3F2FD] text-[#1E88E5]">
                  <Shield className="h-3 w-3 mr-1" /> {user?.role || 'Paciente'}
                </Badge>
                <Badge className="bg-[#E8F5E9] text-[#43A047]">{patient?.is_active === false ? 'Inactivo' : 'Activo'}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#212121]">Informacion Personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-[#212121]">Nombre Completo</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
                <Input value={form.nombre} onChange={(e) => updateField('nombre', e.target.value)} className="pl-10 border-[#DADADA] rounded-lg" />
              </div>
            </div>
            <div>
              <Label className="text-[#212121]">Documento</Label>
              <div className="relative mt-1">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
                <Input value={form.documento} readOnly className="pl-10 border-[#DADADA] rounded-lg bg-[#F5F7FA]" />
              </div>
            </div>
            <div>
              <Label className="text-[#212121]">Correo Electronico</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
                <Input value={form.correo} onChange={(e) => updateField('correo', e.target.value)} className="pl-10 border-[#DADADA] rounded-lg" />
              </div>
            </div>
            <div>
              <Label className="text-[#212121]">Telefono</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
                <Input value={form.telefono} onChange={(e) => updateField('telefono', e.target.value)} className="pl-10 border-[#DADADA] rounded-lg" />
              </div>
            </div>
            <div>
              <Label className="text-[#212121]">Fecha de Nacimiento</Label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
                <Input value={form.fechaNacimiento} type="date" readOnly className="pl-10 border-[#DADADA] rounded-lg bg-[#F5F7FA]" />
              </div>
            </div>
            <div>
              <Label className="text-[#212121]">Direccion</Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
                <Input value={form.direccion} onChange={(e) => updateField('direccion', e.target.value)} className="pl-10 border-[#DADADA] rounded-lg" />
              </div>
            </div>
          </div>

          {message && <p className="text-sm text-[#43A047]">{message}</p>}
          {error && <p className="text-sm text-[#E53935]">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} disabled={saving} className="bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-lg disabled:opacity-60">
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
            <Button variant="outline" className="border-[#1E88E5] text-[#1E88E5] rounded-lg">Cancelar</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#212121]">Resumen Medico</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Tipo de Sangre', value: patient?.blood_type || 'No registrado' },
              { label: 'Alergias', value: patient?.allergies || 'No registradas' },
              { label: 'EPS', value: patient?.insurance_provider || 'No registrada' },
            ].map((item, i) => (
              <div key={i} className="p-3 bg-[#F5F7FA] rounded-lg text-center">
                <p className="text-xs text-[#9E9E9E]">{item.label}</p>
                <p className="text-sm text-[#212121] mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
