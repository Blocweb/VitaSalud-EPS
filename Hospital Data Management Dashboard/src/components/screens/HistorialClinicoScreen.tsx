import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { FileText, Eye, Stethoscope, Pill } from 'lucide-react';
import { getApiErrorMessage, medicalRecordsApi, patientsApi, type MedicalRecord } from '../../lib/api';

interface HistorialItem {
  id: string;
  fecha: string;
  medico: string;
  especialidad: string;
  diagnostico: string;
  tratamiento: string;
}

const mapMedicalRecord = (record: MedicalRecord): HistorialItem => ({
  id: record.id,
  fecha: record.visit_date?.slice(0, 10) || '',
  medico: record.doctor_name || 'Medico asignado',
  especialidad: record.specialization || 'Consulta',
  diagnostico: record.diagnosis,
  tratamiento: record.treatment_plan || record.doctor_notes || 'No registrado',
});

export function HistorialClinicoScreen() {
  const navigate = useNavigate();
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadHistory() {
      try {
        // Obtener los historiales accesibles para el usuario autenticado
        const records = await medicalRecordsApi.list();
        if (!ignore) setHistorial(records.map(mapMedicalRecord));
      } catch (err) {
        if (!ignore) setError(getApiErrorMessage(err));
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadHistory();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-[#212121]">Historial Clinico</h2>
        <p className="text-[#616161]">Revisa tu historial completo de consultas medicas</p>
      </div>

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
              {loading && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-[#616161]">Cargando historial...</td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-[#E53935]">{error}</td>
                </tr>
              )}
              {!loading && !error && historial.map((h, i) => (
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

      <div className="md:hidden space-y-3">
        {loading && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center text-sm text-[#616161]">Cargando historial...</CardContent>
          </Card>
        )}
        {error && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center text-sm text-[#E53935]">{error}</CardContent>
          </Card>
        )}
        {!loading && !error && historial.map((h) => (
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
