import { createBrowserRouter } from 'react-router';
import { SplashScreen } from './components/screens/SplashScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { RegisterScreen } from './components/screens/RegisterScreen';
import { AppLayout } from './components/AppLayout';
import { RequireAuth } from './components/RequireAuth';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { AgendarCitaScreen } from './components/screens/AgendarCitaScreen';
import { ConfirmacionCitaScreen } from './components/screens/ConfirmacionCitaScreen';
import { MisCitasScreen } from './components/screens/MisCitasScreen';
import { HistorialClinicoScreen } from './components/screens/HistorialClinicoScreen';
import { DetalleConsultaScreen } from './components/screens/DetalleConsultaScreen';
import { TratamientosScreen } from './components/screens/TratamientosScreen';
import { AgendaMedicoScreen } from './components/screens/AgendaMedicoScreen';
import { PanelAdminScreen } from './components/screens/PanelAdminScreen';
import { PerfilScreen } from './components/screens/PerfilScreen';
import { ReportesScreen } from './components/screens/ReportesScreen';

function ProtectedAppLayout() {
  return (
    <RequireAuth>
      <AppLayout />
    </RequireAuth>
  );
}

export const router = createBrowserRouter([
  { path: '/', Component: SplashScreen },
  { path: '/login', Component: LoginScreen },
  { path: '/registro', Component: RegisterScreen },
  {
    path: '/app',
    Component: ProtectedAppLayout,
    children: [
      { index: true, Component: DashboardScreen },
      { path: 'citas', Component: MisCitasScreen },
      { path: 'agendar-cita', Component: AgendarCitaScreen },
      { path: 'confirmacion-cita', Component: ConfirmacionCitaScreen },
      { path: 'historial', Component: HistorialClinicoScreen },
      { path: 'historial/:id', Component: DetalleConsultaScreen },
      { path: 'tratamientos', Component: TratamientosScreen },
      { path: 'agenda-medico', Component: AgendaMedicoScreen },
      { path: 'panel-admin', Component: PanelAdminScreen },
      { path: 'perfil', Component: PerfilScreen },
      { path: 'reportes', Component: ReportesScreen },
    ],
  },
]);
