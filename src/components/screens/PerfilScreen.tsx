import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { User, Mail, Phone, MapPin, FileText, Calendar, Shield } from 'lucide-react';
import { Badge } from '../ui/badge';

export function PerfilScreen() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl text-[#212121]">Mi Perfil</h2>
        <p className="text-[#616161]">Informacion personal y configuracion de cuenta</p>
      </div>

      {/* Profile header */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-[#E3F2FD] text-[#1E88E5] text-2xl">CM</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h3 className="text-xl text-[#212121]">Carlos Alberto Mendoza</h3>
              <p className="text-sm text-[#616161]">carlos.mendoza@email.com</p>
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                <Badge className="bg-[#E3F2FD] text-[#1E88E5]">
                  <Shield className="h-3 w-3 mr-1" /> Paciente
                </Badge>
                <Badge className="bg-[#E8F5E9] text-[#43A047]">Activo</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal info */}
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
                <Input defaultValue="Carlos Alberto Mendoza" className="pl-10 border-[#DADADA] rounded-lg" />
              </div>
            </div>
            <div>
              <Label className="text-[#212121]">Documento</Label>
              <div className="relative mt-1">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
                <Input defaultValue="1.023.456.789" className="pl-10 border-[#DADADA] rounded-lg" />
              </div>
            </div>
            <div>
              <Label className="text-[#212121]">Correo Electronico</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
                <Input defaultValue="carlos.mendoza@email.com" className="pl-10 border-[#DADADA] rounded-lg" />
              </div>
            </div>
            <div>
              <Label className="text-[#212121]">Telefono</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
                <Input defaultValue="+57 300 123 4567" className="pl-10 border-[#DADADA] rounded-lg" />
              </div>
            </div>
            <div>
              <Label className="text-[#212121]">Fecha de Nacimiento</Label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
                <Input defaultValue="1985-06-15" type="date" className="pl-10 border-[#DADADA] rounded-lg" />
              </div>
            </div>
            <div>
              <Label className="text-[#212121]">Direccion</Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
                <Input defaultValue="Calle 45 #12-30, Bogota" className="pl-10 border-[#DADADA] rounded-lg" />
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button className="bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-lg">Guardar Cambios</Button>
            <Button variant="outline" className="border-[#1E88E5] text-[#1E88E5] rounded-lg">Cancelar</Button>
          </div>
        </CardContent>
      </Card>

      {/* Medical info summary */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#212121]">Resumen Medico</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Tipo de Sangre', value: 'O+' },
              { label: 'Alergias', value: 'Penicilina' },
              { label: 'EPS', value: 'VitaSalud' },
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
