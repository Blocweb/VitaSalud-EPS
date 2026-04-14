import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { User, FileText, Mail, Lock, ArrowLeft } from 'lucide-react';

export function RegisterScreen() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', documento: '', correo: '', password: '', confirmPassword: '' });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/login');
  };

  const updateField = (field: string, value: string) => setForm({ ...form, [field]: value });

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
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1E88E5] hover:bg-[#1565C0] active:bg-[#0D47A1] text-white rounded-lg py-5 mt-2"
            >
              Registrarse
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
