import { useNavigate } from 'react-router';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { FileText, Eye, CalendarDays, Stethoscope, Pill } from 'lucide-react';

const historial = [
  { id: '1', fecha: '2026-02-20', medico: 'Dr. Juan Martinez', especialidad: 'Cardiologia', diagnostico: 'Hipertension arterial leve', tratamiento: 'Losartan 50mg' },
  { id: '2', fecha: '2026-01-15', medico: 'Dra. Maria Rodriguez', especialidad: 'Dermatologia', diagnostico: 'Dermatitis atopica', tratamiento: 'Crema hidrocortisona' },
  { id: '3', fecha: '2025-12-10', medico: 'Dr. Carlos Lopez', especialidad: 'Medicina General', diagnostico: 'Sindrome gripal', tratamiento: 'Acetaminofen, reposo' },
  { id: '4', fecha: '2025-11-05', medico: 'Dr. Juan Martinez', especialidad: 'Cardiologia', diagnostico: 'Control electrocardiograma - Normal', tratamiento: 'Continuar medicacion' },
  { id: '5', fecha: '2025-09-22', medico: 'Dra. Sofia Ramirez', especialidad: 'Medicina General', diagnostico: 'Infeccion urinaria', tratamiento: 'Ciprofloxacina 500mg' },
  { id: '6', fecha: '2025-08-14', medico: 'Dr. Alejandro Reyes', especialidad: 'Neurologia', diagnostico: 'Migraña tensional', tratamiento: 'Sumatriptan, tecnicas relajacion' },
];

export function HistorialClinicoScreen() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-[#212121]">Historial Clinico</h2>
        <p className="text-[#616161]">Revisa tu historial completo de consultas medicas</p>
      </div>

      {/* Desktop Table */}
      <Card className="border-0 shadow-sm hidden md:block">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="bg-[#E3F2FD]">
                <th className="text-left p-3 text-sm text-[#1E88E5]">Fecha</th>
                <th className="text-left p-3 text-sm text-[#1E88E5]">Medico</th>
                <th className="text-left p-3 text-sm text-[#1E88E5]">Especialidad</th>
                <th className="text-left p-3 text-sm text-[#1E88E5]">Diagnostico</th>
                <th className="text-left p-3 text-sm text-[#1E88E5]">Tratamiento</th>
                <th className="text-left p-3 text-sm text-[#1E88E5]">Accion</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((h, i) => (
                <tr key={h.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}>
                  <td className="p-3 text-sm text-[#212121]">{h.fecha}</td>
                  <td className="p-3 text-sm text-[#212121]">{h.medico}</td>
                  <td className="p-3"><Badge className="bg-[#E3F2FD] text-[#1E88E5]">{h.especialidad}</Badge></td>
                  <td className="p-3 text-sm text-[#616161] max-w-[200px] truncate">{h.diagnostico}</td>
                  <td className="p-3 text-sm text-[#616161] max-w-[180px] truncate">{h.tratamiento}</td>
                  <td className="p-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/app/historial/${h.id}`)}
                      className="text-[#1E88E5] border-[#1E88E5] rounded-lg text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1" /> Ver detalle
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {historial.map((h) => (
          <Card key={h.id} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#E3F2FD] rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-[#1E88E5]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#212121]">{h.medico}</p>
                    <p className="text-xs text-[#616161]">{h.especialidad}</p>
                  </div>
                </div>
                <span className="text-xs text-[#9E9E9E]">{h.fecha}</span>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex items-start gap-2">
                  <Stethoscope className="h-3 w-3 text-[#616161] mt-0.5" />
                  <p className="text-xs text-[#616161]">{h.diagnostico}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Pill className="h-3 w-3 text-[#616161] mt-0.5" />
                  <p className="text-xs text-[#616161]">{h.tratamiento}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/app/historial/${h.id}`)}
                className="w-full text-[#1E88E5] border-[#1E88E5] rounded-lg text-xs"
              >
                Ver detalle
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
