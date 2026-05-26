import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { User, FileText, Mail, Lock, ArrowLeft, Phone, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApiErrorMessage } from '../../lib/api';

export function RegisterScreen() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    nombre: '',
    documento: '',
    correo: '',
    telefono: '',
    fechaNacimiento: '',
    genero: '',
    direccion: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (form.password !== form.confirmPassword) {
      setFormError('Las contrasenas no coinciden');
      return;
    }

    const nameParts = form.nombre.trim().split(/\s+/);
    const firstName = nameParts.shift() || '';
    const lastName = nameParts.join(' ') || firstName;

    if (!firstName || !lastName || !form.correo || !form.telefono || !form.fechaNacimiento || !form.genero || !form.direccion) {
      setFormError('Completa todos los campos obligatorios');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        email: form.correo.trim(),
        password: form.password,
        first_name: firstName,
        last_name: lastName,
        phone: form.telefono.trim(),
        date_of_birth: form.fechaNacimiento,
        gender: form.genero,
        address: form.direccion.trim(),
        document_number: form.documento.trim(),
      });
      navigate('/app', { replace: true });
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });
    setFormError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F5F7FA]">
      <Card className="w-full max-w-lg shadow-lg border-0">
        <CardContent className="p-8">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-1 text-sm text-[#1E88E5] hover:text-[#1565C0] mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al inicio
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#1E88E5] rounded-lg flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L12 22M2 12L22 12" stroke="white" strokeWidth="3" strokeLinecap="round" />
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <span className="text-xl text-[#0D47A1]">VitaSalud</span>
          </div>

          <h2 className="text-2xl text-[#212121] mb-1">Crear Cuenta</h2>
          <p className="text-[#616161] mb-6">Registrate para acceder a todos los servicios</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label className="text-[#212121]">Nombre Completo</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
                <Input
                  value={form.nombre}
                  onChange={(e) => updateField('nombre', e.target.value)}
                  placeholder="Nombre y apellido"
                  className="pl-10 border-[#DADADA] rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-[#212121]">Documento de Identidad</Label>
              <div className="relative mt-1">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
                <Input
                  value={form.documento}
                  onChange={(e) => updateField('documento', e.target.value)}
                  placeholder="Numero de documento"
                  className="pl-10 border-[#DADADA] rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-[#212121]">Telefono</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
                <Input
                  value={form.telefono}
                  onChange={(e) => updateField('telefono', e.target.value)}
                  placeholder="+573001234567"
                  className="pl-10 border-[#DADADA] rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-[#212121]">Correo Electronico</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
                <Input
                  type="email"
                  value={form.correo}
                  onChange={(e) => updateField('correo', e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="pl-10 border-[#DADADA] rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-[#212121]">Fecha de Nacimiento</Label>
                <div className="relative mt-1">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
                  <Input
                    type="date"
                    value={form.fechaNacimiento}
                    onChange={(e) => updateField('fechaNacimiento', e.target.value)}
                    className="pl-10 border-[#DADADA] rounded-lg"
                    required
                  />
                </div>
              </div>
              <div>
                <Label className="text-[#212121]">Genero</Label>
                <Select value={form.genero} onValueChange={(value) => updateField('genero', value)}>
                  <SelectTrigger className="mt-1 border-[#DADADA] rounded-lg">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Femenino</SelectItem>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-[#212121]">Direccion</Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
                <Input
                  value={form.direccion}
                  onChange={(e) => updateField('direccion', e.target.value)}
                  placeholder="Direccion de residencia"
                  className="pl-10 border-[#DADADA] rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-[#212121]">Contrasena</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    placeholder="Crear contrasena"
                    className="pl-10 border-[#DADADA] rounded-lg"
                    required
                  />
                </div>
              </div>
              <div>
                <Label className="text-[#212121]">Confirmar Contrasena</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
                  <Input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    placeholder="Repetir contrasena"
                    className="pl-10 border-[#DADADA] rounded-lg"
                    required
                  />
                </div>
              </div>
            </div>

            {formError && <p className="text-sm text-[#E53935]">{formError}</p>}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1E88E5] hover:bg-[#1565C0] active:bg-[#0D47A1] text-white rounded-lg py-5 mt-2 disabled:opacity-60"
            >
              {isSubmitting ? 'Creando cuenta...' : 'Registrarse'}
            </Button>
          </form>

          <p className="text-sm text-[#616161] text-center mt-6">
            Ya tienes cuenta?{' '}
            <button onClick={() => navigate('/login')} className="text-[#1E88E5] hover:text-[#1565C0]">
              Inicia sesion
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
