import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { departmentsApi, doctorsApi, settingsApi, type Department } from '../../lib/api';
import { Stethoscope, Mail } from 'lucide-react';

export function PanelAdminScreen() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [savingDoctor, setSavingDoctor] = useState(false);
  const [doctorError, setDoctorError] = useState('');
  const [doctorOk, setDoctorOk] = useState('');

  const [doctorForm, setDoctorForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    license_number: '',
    specialization: '',
    department_id: '' as string,
  });

  const [emailForm, setEmailForm] = useState({
    host: '',
    port: '587',
    secure: false,
    user: '',
    pass: '',
    from: '',
    to: '',
  });
  const [emailStatus, setEmailStatus] = useState<{ ok?: string; error?: string }>({});
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);

  useEffect(() => {
    let ignore = false;
    departmentsApi
      .list()
      .then((data) => {
        if (!ignore) setDepartments(data);
      })
      .catch(() => {
        if (!ignore) setDepartments([]);
      });

    settingsApi
      .getEmailConfig()
      .then((r) => {
        if (ignore) return;
        setEmailForm((prev) => ({
          ...prev,
          host: r.data.host || prev.host,
          port: String(r.data.port || prev.port),
          user: r.data.user || prev.user,
          from: r.data.from || prev.from,
          secure: Boolean(r.data.secure),
        }));
      })
      .catch(() => undefined);

    return () => {
      ignore = true;
    };
  }, []);

  const departmentOptions = useMemo(
    () => departments.filter((d) => d.is_active !== false),
    [departments]
  );

  async function onCreateDoctor() {
    setDoctorError('');
    setDoctorOk('');
    setSavingDoctor(true);
    try {
      const payload: any = {
        first_name: doctorForm.first_name.trim(),
        last_name: doctorForm.last_name.trim(),
        email: doctorForm.email.trim(),
        phone: doctorForm.phone.trim() || undefined,
        password: doctorForm.password,
        license_number: doctorForm.license_number.trim(),
        specialization: doctorForm.specialization.trim(),
        department_id: doctorForm.department_id ? Number(doctorForm.department_id) : null,
      };

      await doctorsApi.create(payload);
      setDoctorOk('Médico creado correctamente.');
      setDoctorForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        license_number: '',
        specialization: '',
        department_id: '',
      });
    } catch (e: any) {
      setDoctorError(e?.message || 'No se pudo crear el médico.');
    } finally {
      setSavingDoctor(false);
    }
  }

  async function onTestEmail() {
    setEmailStatus({});
    setLoadingEmail(true);
    try {
      // Guardar antes de probar, para que quede persistente (y sirva para recuperación de contraseña)
      await settingsApi.saveEmailConfig({
        host: emailForm.host.trim(),
        port: Number(emailForm.port),
        user: emailForm.user.trim(),
        pass: emailForm.pass,
        from: emailForm.from.trim(),
        secure: emailForm.secure,
      });

      await settingsApi.testEmail({
        to: emailForm.to.trim(),
        host: emailForm.host.trim(),
        port: Number(emailForm.port),
        user: emailForm.user.trim(),
        pass: emailForm.pass,
        from: emailForm.from.trim(),
        secure: emailForm.secure,
      });
      setEmailStatus({ ok: 'Correo de prueba enviado correctamente.' });
    } catch (e: any) {
      setEmailStatus({ error: e?.message || 'No se pudo enviar el correo de prueba.' });
    } finally {
      setLoadingEmail(false);
    }
  }

  async function onSaveEmail() {
    setEmailStatus({});
    setSavingEmail(true);
    try {
      await settingsApi.saveEmailConfig({
        host: emailForm.host.trim(),
        port: Number(emailForm.port),
        user: emailForm.user.trim(),
        pass: emailForm.pass,
        from: emailForm.from.trim(),
        secure: emailForm.secure,
      });
      setEmailStatus({ ok: 'Configuración guardada correctamente.' });
    } catch (e: any) {
      setEmailStatus({ error: e?.message || 'No se pudo guardar la configuración.' });
    } finally {
      setSavingEmail(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-[#212121]">Panel Administrativo</h2>
        <p className="text-[#616161]">Gestión general de VitaSalud</p>
      </div>

      <Tabs defaultValue="doctores" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="doctores" className="flex-1">
            <Stethoscope className="h-4 w-4" /> Médicos
          </TabsTrigger>
          <TabsTrigger value="correo" className="flex-1">
            <Mail className="h-4 w-4" /> Correo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="doctores">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#212121]">Crear médico</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(doctorError || doctorOk) && (
                <div className={`text-sm ${doctorError ? 'text-[#E53935]' : 'text-[#43A047]'}`}>
                  {doctorError || doctorOk}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-[#616161] mb-1">Nombres</p>
                  <Input value={doctorForm.first_name} onChange={(e) => setDoctorForm((p) => ({ ...p, first_name: e.target.value }))} />
                </div>
                <div>
                  <p className="text-xs text-[#616161] mb-1">Apellidos</p>
                  <Input value={doctorForm.last_name} onChange={(e) => setDoctorForm((p) => ({ ...p, last_name: e.target.value }))} />
                </div>
                <div>
                  <p className="text-xs text-[#616161] mb-1">Email</p>
                  <Input type="email" value={doctorForm.email} onChange={(e) => setDoctorForm((p) => ({ ...p, email: e.target.value }))} />
                </div>
                <div>
                  <p className="text-xs text-[#616161] mb-1">Teléfono</p>
                  <Input value={doctorForm.phone} onChange={(e) => setDoctorForm((p) => ({ ...p, phone: e.target.value }))} />
                </div>
                <div>
                  <p className="text-xs text-[#616161] mb-1">Contraseña</p>
                  <Input type="password" value={doctorForm.password} onChange={(e) => setDoctorForm((p) => ({ ...p, password: e.target.value }))} />
                </div>
                <div>
                  <p className="text-xs text-[#616161] mb-1">Licencia</p>
                  <Input value={doctorForm.license_number} onChange={(e) => setDoctorForm((p) => ({ ...p, license_number: e.target.value }))} />
                </div>
                <div>
                  <p className="text-xs text-[#616161] mb-1">Especialidad</p>
                  <Input value={doctorForm.specialization} onChange={(e) => setDoctorForm((p) => ({ ...p, specialization: e.target.value }))} />
                </div>
                <div>
                  <p className="text-xs text-[#616161] mb-1">Departamento</p>
                  <Select
                    value={doctorForm.department_id ? doctorForm.department_id : 'none'}
                    onValueChange={(v) =>
                      setDoctorForm((p) => ({ ...p, department_id: v === 'none' ? '' : v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin departamento</SelectItem>
                      {departmentOptions.map((d) => (
                        <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={onCreateDoctor} disabled={savingDoctor} className="bg-[#1E88E5] hover:bg-[#1565C0] text-white">
                  {savingDoctor ? 'Creando...' : 'Crear médico'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correo">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#212121]">Configuración de correo (SMTP)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-[#616161]">
                Esta configuración queda guardada de forma persistente en la base de datos y se usa para enviar códigos de recuperación de contraseña.
              </p>

              {emailStatus.error && <div className="text-sm text-[#E53935]">{emailStatus.error}</div>}
              {emailStatus.ok && <div className="text-sm text-[#43A047]">{emailStatus.ok}</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-[#616161] mb-1">SMTP Host</p>
                  <Input value={emailForm.host} onChange={(e) => setEmailForm((p) => ({ ...p, host: e.target.value }))} />
                </div>
                <div>
                  <p className="text-xs text-[#616161] mb-1">SMTP Port</p>
                  <Input value={emailForm.port} onChange={(e) => setEmailForm((p) => ({ ...p, port: e.target.value }))} />
                </div>
                <div>
                  <p className="text-xs text-[#616161] mb-1">SMTP User</p>
                  <Input value={emailForm.user} onChange={(e) => setEmailForm((p) => ({ ...p, user: e.target.value }))} />
                </div>
                <div>
                  <p className="text-xs text-[#616161] mb-1">SMTP Pass</p>
                  <Input type="password" value={emailForm.pass} onChange={(e) => setEmailForm((p) => ({ ...p, pass: e.target.value }))} />
                </div>
                <div>
                  <p className="text-xs text-[#616161] mb-1">From</p>
                  <Input value={emailForm.from} onChange={(e) => setEmailForm((p) => ({ ...p, from: e.target.value }))} />
                </div>
                <div>
                  <p className="text-xs text-[#616161] mb-1">Enviar prueba a</p>
                  <Input type="email" value={emailForm.to} onChange={(e) => setEmailForm((p) => ({ ...p, to: e.target.value }))} />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  onClick={onSaveEmail}
                  disabled={savingEmail}
                  variant="outline"
                  className="border-[#DADADA] hover:bg-[#F5F7FA]"
                >
                  {savingEmail ? 'Guardando...' : 'Guardar'}
                </Button>
                <Button onClick={onTestEmail} disabled={loadingEmail} className="bg-[#1E88E5] hover:bg-[#1565C0] text-white">
                  {loadingEmail ? 'Enviando...' : 'Enviar correo de prueba'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
