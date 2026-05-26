import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft, Stethoscope, Pill, FileText, User, CalendarDays, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { getApiErrorMessage, medicalRecordsApi, type MedicalRecord } from '../../lib/api';

const splitSymptoms = (value?: string | null) => {
  if (!value) return ['No hay sintomas registrados'];
  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

export function DetalleConsultaScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [consulta, setConsulta] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadRecord() {
      if (!id) {
        setError('Consulta no encontrada');
        setLoading(false);
        return;
      }

      try {
        const record = await medicalRecordsApi.get(id);
        if (!ignore) setConsulta(record);
      } catch (err) {
        if (!ignore) setError(getApiErrorMessage(err));
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadRecord();

    return () => {
      ignore = true;
    };
  }, [id]);

  const sintomas = splitSymptoms(consulta?.symptoms);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate('/app/historial')} className="text-[#1E88E5]">
        <ArrowLeft className="h-4 w-4 mr-1" /> Volver al historial
      </Button>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-[#212121]">
              <FileText className="h-5 w-5 text-[#1E88E5]" />
              Detalle de Consulta Medica
            </CardTitle>
            {consulta?.specialization && (
              <Badge className="bg-[#E3F2FD] text-[#1E88E5]">{consulta.specialization}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading && <p className="text-sm text-[#616161] text-center py-8">Cargando consulta...</p>}
          {error && <p className="text-sm text-[#E53935] text-center py-8">{error}</p>}

          {!loading && !error && consulta && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#F5F7FA] rounded-xl">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#1E88E5]" />
                  <div>
                    <p className="text-xs text-[#9E9E9E]">Medico</p>
                    <p className="text-sm text-[#212121]">{consulta.doctor_name || 'Medico asignado'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[#1E88E5]" />
                  <div>
                    <p className="text-xs text-[#9E9E9E]">Fecha</p>
                    <p className="text-sm text-[#212121]">{consulta.visit_date?.slice(0, 10)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-[#1E88E5]" />
                  <div>
                    <p className="text-xs text-[#9E9E9E]">Especialidad</p>
                    <p className="text-sm text-[#212121]">{consulta.specialization || 'Consulta'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[#0D47A1] mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> Sintomas Reportados
                </h3>
                <div className="space-y-2">
                  {sintomas.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-[#FFF8E1] rounded-lg">
                      <div className="w-2 h-2 bg-[#FF8F00] rounded-full" />
                      <span className="text-sm text-[#212121]">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[#0D47A1] mb-3 flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" /> Diagnostico
                </h3>
                <div className="p-4 bg-[#E3F2FD] rounded-xl">
                  <p className="text-sm text-[#212121]">{consulta.diagnosis}</p>
                </div>
              </div>

              <div>
                <h3 className="text-[#0D47A1] mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Tratamiento
                </h3>
                <p className="text-sm text-[#616161] p-3 bg-[#F5F7FA] rounded-lg">
                  {consulta.treatment_plan || 'No registrado'}
                </p>
              </div>

              <div>
                <h3 className="text-[#0D47A1] mb-3 flex items-center gap-2">
                  <Pill className="h-4 w-4" /> Medicamentos Recetados
                </h3>
                <div className="p-3 bg-[#E8F5E9] rounded-lg">
                  <p className="text-sm text-[#212121]">Consulta el modulo de tratamientos para ver recetas asociadas.</p>
                </div>
              </div>

              {consulta.doctor_notes && (
                <div className="p-4 border border-[#1E88E5] rounded-xl bg-[#E3F2FD]/30">
                  <p className="text-xs text-[#1E88E5] mb-1">Recomendaciones del medico</p>
                  <p className="text-sm text-[#212121]">{consulta.doctor_notes}</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
