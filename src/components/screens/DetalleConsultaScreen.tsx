import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft, Stethoscope, Pill, FileText, User, CalendarDays, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/badge';

const consultasMock: Record<string, any> = {
  '1': {
    fecha: '2026-02-20', medico: 'Dr. Juan Martinez', especialidad: 'Cardiologia',
    sintomas: ['Dolor en el pecho ocasional', 'Fatiga al realizar ejercicio', 'Palpitaciones nocturnas'],
    diagnostico: 'Hipertension arterial leve. Presion arterial: 145/90 mmHg. Frecuencia cardiaca en reposo: 82 bpm.',
    tratamiento: 'Inicio de terapia antihipertensiva con Losartan 50mg una vez al dia. Control en 4 semanas.',
    medicamentos: [
      { nombre: 'Losartan 50mg', dosis: '1 tableta diaria', duracion: '30 dias' },
      { nombre: 'Aspirina 100mg', dosis: '1 tableta diaria', duracion: 'Continuo' },
    ],
    recomendaciones: 'Reducir consumo de sal. Ejercicio moderado 30 min/dia. Control de peso.',
  },
  '2': {
    fecha: '2026-01-15', medico: 'Dra. Maria Rodriguez', especialidad: 'Dermatologia',
    sintomas: ['Enrojecimiento en brazos', 'Picazon intensa', 'Piel seca y descamada'],
    diagnostico: 'Dermatitis atopica moderada en miembros superiores.',
    tratamiento: 'Aplicacion topica de hidrocortisona 1% dos veces al dia por 2 semanas.',
    medicamentos: [
      { nombre: 'Hidrocortisona 1% crema', dosis: 'Aplicar 2 veces/dia', duracion: '14 dias' },
      { nombre: 'Cetirizina 10mg', dosis: '1 tableta nocturna', duracion: '10 dias' },
    ],
    recomendaciones: 'Hidratacion frecuente. Evitar jabones perfumados. Usar ropa de algodon.',
  },
};

export function DetalleConsultaScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const consulta = consultasMock[id || '1'] || consultasMock['1'];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate('/app/historial')} className="text-[#1E88E5]">
        <ArrowLeft className="h-4 w-4 mr-1" /> Volver al historial
      </Button>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[#212121]">
              <FileText className="h-5 w-5 text-[#1E88E5]" />
              Detalle de Consulta Medica
            </CardTitle>
            <Badge className="bg-[#E3F2FD] text-[#1E88E5]">{consulta.especialidad}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Info basica */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#F5F7FA] rounded-xl">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[#1E88E5]" />
              <div>
                <p className="text-xs text-[#9E9E9E]">Medico</p>
                <p className="text-sm text-[#212121]">{consulta.medico}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[#1E88E5]" />
              <div>
                <p className="text-xs text-[#9E9E9E]">Fecha</p>
                <p className="text-sm text-[#212121]">{consulta.fecha}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-[#1E88E5]" />
              <div>
                <p className="text-xs text-[#9E9E9E]">Especialidad</p>
                <p className="text-sm text-[#212121]">{consulta.especialidad}</p>
              </div>
            </div>
          </div>

          {/* Sintomas */}
          <div>
            <h3 className="text-[#0D47A1] mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> Sintomas Reportados
            </h3>
            <div className="space-y-2">
              {consulta.sintomas.map((s: string, i: number) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-[#FFF8E1] rounded-lg">
                  <div className="w-2 h-2 bg-[#FF8F00] rounded-full" />
                  <span className="text-sm text-[#212121]">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnostico */}
          <div>
            <h3 className="text-[#0D47A1] mb-3 flex items-center gap-2">
              <Stethoscope className="h-4 w-4" /> Diagnostico
            </h3>
            <div className="p-4 bg-[#E3F2FD] rounded-xl">
              <p className="text-sm text-[#212121]">{consulta.diagnostico}</p>
            </div>
          </div>

          {/* Tratamiento */}
          <div>
            <h3 className="text-[#0D47A1] mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Tratamiento
            </h3>
            <p className="text-sm text-[#616161] p-3 bg-[#F5F7FA] rounded-lg">{consulta.tratamiento}</p>
          </div>

          {/* Medicamentos */}
          <div>
            <h3 className="text-[#0D47A1] mb-3 flex items-center gap-2">
              <Pill className="h-4 w-4" /> Medicamentos Recetados
            </h3>
            <div className="space-y-2">
              {consulta.medicamentos.map((m: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#E8F5E9] rounded-lg">
                  <div>
                    <p className="text-sm text-[#212121]">{m.nombre}</p>
                    <p className="text-xs text-[#616161]">{m.dosis}</p>
                  </div>
                  <Badge className="bg-white text-[#43A047]">{m.duracion}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Recomendaciones */}
          {consulta.recomendaciones && (
            <div className="p-4 border border-[#1E88E5] rounded-xl bg-[#E3F2FD]/30">
              <p className="text-xs text-[#1E88E5] mb-1">Recomendaciones del medico</p>
              <p className="text-sm text-[#212121]">{consulta.recomendaciones}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
