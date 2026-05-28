import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi, getApiErrorMessage } from '../../lib/api';

type RecoveryStep = 'login' | 'email' | 'code' | 'newPassword' | 'success';

export function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Recovery state
  const [recoveryStep, setRecoveryStep] = useState<RecoveryStep>('login');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/app', { replace: true });
    } catch (error) {
      setAuthError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const startRecovery = () => {
    setRecoveryStep('email');
    setRecoveryError('');
    setRecoveryEmail('');
    setOtpCode('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail || !recoveryEmail.includes('@')) {
      setRecoveryError('Ingresa un correo electronico valido');
      return;
    }
    setRecoveryError('');
    setIsSubmitting(true);
    try {
      await authApi.forgotPassword(recoveryEmail);
      setRecoveryStep('code');
      startResendTimer();
    } catch (error) {
      setRecoveryError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setRecoveryError('Ingresa el codigo completo de 6 digitos');
      return;
    }
    setRecoveryError('');
    setRecoveryStep('newPassword');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setRecoveryError('La contrasena debe tener al menos 8 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      setRecoveryError('Las contrasenas no coinciden');
      return;
    }
    setRecoveryError('');
    setIsSubmitting(true);
    try {
      await authApi.resetPassword({
        email: recoveryEmail,
        code: otpCode,
        new_password: newPassword,
      });
      setRecoveryStep('success');
    } catch (error) {
      setRecoveryError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const backToLogin = () => {
    setRecoveryStep('login');
    setRecoveryError('');
  };

  // Recovery: enter email
  const renderEmailStep = () => (
    <>
      <button onClick={backToLogin} className="flex items-center gap-1 text-sm text-[#1E88E5] hover:text-[#1565C0] mb-4">
        <ArrowLeft className="h-4 w-4" /> Volver al inicio de sesion
      </button>
      <div className="w-12 h-12 bg-[#E3F2FD] rounded-xl flex items-center justify-center mb-4">
        <Mail className="h-6 w-6 text-[#1E88E5]" />
      </div>
      <h2 className="text-2xl text-[#212121] mb-1">Recuperar Contrasena</h2>
      <p className="text-[#616161] mb-6">Ingresa tu correo electronico y te enviaremos un codigo de verificacion</p>
      <form onSubmit={handleSendCode} className="space-y-4">
        <div>
          <Label htmlFor="recovery-email" className="text-[#212121]">Correo Electronico</Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
            <Input
              id="recovery-email"
              type="email"
              value={recoveryEmail}
              onChange={(e) => { setRecoveryEmail(e.target.value); setRecoveryError(''); }}
              placeholder="correo@ejemplo.com"
              className="pl-10 border-[#DADADA] rounded-lg focus:border-[#1E88E5] focus:ring-[#1E88E5]"
            />
          </div>
        </div>
        {recoveryError && <p className="text-sm text-[#E53935]">{recoveryError}</p>}
        <Button type="submit" disabled={isSubmitting} className="w-full bg-[#1E88E5] hover:bg-[#1565C0] active:bg-[#0D47A1] text-white rounded-lg py-5">
          {isSubmitting ? 'Enviando...' : 'Enviar Codigo'}
        </Button>
      </form>
    </>
  );

  // Recovery: enter OTP code
  const renderCodeStep = () => (
    <>
      <button onClick={() => setRecoveryStep('email')} className="flex items-center gap-1 text-sm text-[#1E88E5] hover:text-[#1565C0] mb-4">
        <ArrowLeft className="h-4 w-4" /> Cambiar correo
      </button>
      <div className="w-12 h-12 bg-[#E3F2FD] rounded-xl flex items-center justify-center mb-4">
        <ShieldCheck className="h-6 w-6 text-[#1E88E5]" />
      </div>
      <h2 className="text-2xl text-[#212121] mb-1">Codigo de Verificacion</h2>
      <p className="text-[#616161] mb-1">Ingresa el codigo de 6 digitos enviado a</p>
      <p className="text-[#1E88E5] mb-6">{recoveryEmail}</p>
      <form onSubmit={handleVerifyCode} className="space-y-5">
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otpCode} onChange={(val) => { setOtpCode(val); setRecoveryError(''); }}>
            <InputOTPGroup>
              <InputOTPSlot index={0} className="w-11 h-12 text-lg" />
              <InputOTPSlot index={1} className="w-11 h-12 text-lg" />
              <InputOTPSlot index={2} className="w-11 h-12 text-lg" />
            </InputOTPGroup>
            <span className="mx-1 text-[#9E9E9E]">-</span>
            <InputOTPGroup>
              <InputOTPSlot index={3} className="w-11 h-12 text-lg" />
              <InputOTPSlot index={4} className="w-11 h-12 text-lg" />
              <InputOTPSlot index={5} className="w-11 h-12 text-lg" />
            </InputOTPGroup>
          </InputOTP>
        </div>
        {recoveryError && <p className="text-sm text-[#E53935] text-center">{recoveryError}</p>}
        <Button type="submit" className="w-full bg-[#1E88E5] hover:bg-[#1565C0] active:bg-[#0D47A1] text-white rounded-lg py-5">
          Verificar Codigo
        </Button>
        <div className="text-center">
          {resendTimer > 0 ? (
            <p className="text-sm text-[#9E9E9E]">Reenviar codigo en <span className="text-[#1E88E5]">{resendTimer}s</span></p>
          ) : (
            <button
              type="button"
              onClick={async () => {
                setRecoveryError('');
                setIsSubmitting(true);
                try {
                  await authApi.forgotPassword(recoveryEmail);
                  startResendTimer();
                } catch (error) {
                  setRecoveryError(getApiErrorMessage(error));
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="text-sm text-[#1E88E5] hover:text-[#1565C0]"
            >
              Reenviar codigo
            </button>
          )}
        </div>
      </form>
    </>
  );

  // Recovery: new password
  const renderNewPasswordStep = () => (
    <>
      <button onClick={() => setRecoveryStep('code')} className="flex items-center gap-1 text-sm text-[#1E88E5] hover:text-[#1565C0] mb-4">
        <ArrowLeft className="h-4 w-4" /> Volver
      </button>
      <div className="w-12 h-12 bg-[#E3F2FD] rounded-xl flex items-center justify-center mb-4">
        <Lock className="h-6 w-6 text-[#1E88E5]" />
      </div>
      <h2 className="text-2xl text-[#212121] mb-1">Nueva Contrasena</h2>
      <p className="text-[#616161] mb-6">Crea una nueva contrasena segura para tu cuenta</p>
      <form onSubmit={handleResetPassword} className="space-y-4">
        <div>
          <Label htmlFor="new-password" className="text-[#212121]">Nueva Contrasena</Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
            <Input
              id="new-password"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setRecoveryError(''); }}
              placeholder="Minimo 8 caracteres"
              className="pl-10 pr-10 border-[#DADADA] rounded-lg focus:border-[#1E88E5] focus:ring-[#1E88E5]"
            />
            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-[#616161]">
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div>
          <Label htmlFor="confirm-password" className="text-[#212121]">Confirmar Contrasena</Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
            <Input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setRecoveryError(''); }}
              placeholder="Repite tu contrasena"
              className="pl-10 pr-10 border-[#DADADA] rounded-lg focus:border-[#1E88E5] focus:ring-[#1E88E5]"
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-[#616161]">
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {recoveryError && <p className="text-sm text-[#E53935]">{recoveryError}</p>}
        {/* Password strength indicators */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${newPassword.length >= 8 ? 'bg-[#43A047]' : 'bg-[#DADADA]'}`} />
            <span className={`text-xs ${newPassword.length >= 8 ? 'text-[#43A047]' : 'text-[#9E9E9E]'}`}>Minimo 8 caracteres</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(newPassword) ? 'bg-[#43A047]' : 'bg-[#DADADA]'}`} />
            <span className={`text-xs ${/[A-Z]/.test(newPassword) ? 'text-[#43A047]' : 'text-[#9E9E9E]'}`}>Una letra mayuscula</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${/[0-9]/.test(newPassword) ? 'bg-[#43A047]' : 'bg-[#DADADA]'}`} />
            <span className={`text-xs ${/[0-9]/.test(newPassword) ? 'text-[#43A047]' : 'text-[#9E9E9E]'}`}>Un numero</span>
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full bg-[#1E88E5] hover:bg-[#1565C0] active:bg-[#0D47A1] text-white rounded-lg py-5">
          {isSubmitting ? 'Guardando...' : 'Restablecer Contrasena'}
        </Button>
      </form>
    </>
  );

  // Recovery: success
  const renderSuccessStep = () => (
    <div className="text-center py-4">
      <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 className="h-8 w-8 text-[#43A047]" />
      </div>
      <h2 className="text-2xl text-[#212121] mb-2">Contrasena Restablecida</h2>
      <p className="text-[#616161] mb-8">Tu contrasena ha sido actualizada exitosamente. Ya puedes iniciar sesion con tu nueva contrasena.</p>
      <Button onClick={backToLogin} className="w-full bg-[#1E88E5] hover:bg-[#1565C0] active:bg-[#0D47A1] text-white rounded-lg py-5">
        Iniciar Sesion
      </Button>
    </div>
  );

  // Login form
  const renderLoginForm = () => (
    <>
      <h2 className="text-2xl text-[#212121] mb-1">Iniciar Sesion</h2>
      <p className="text-[#616161] mb-6">Ingresa tus credenciales para acceder</p>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-[#212121]">Correo Electronico</Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setAuthError(''); }}
              placeholder="correo@ejemplo.com"
              className="pl-10 border-[#DADADA] rounded-lg focus:border-[#1E88E5] focus:ring-[#1E88E5]"
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="password" className="text-[#212121]">Contrasena</Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setAuthError(''); }}
              placeholder="Tu contrasena"
              className="pl-10 pr-10 border-[#DADADA] rounded-lg focus:border-[#1E88E5] focus:ring-[#1E88E5]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-[#616161]"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={startRecovery} className="text-sm text-[#1E88E5] hover:text-[#1565C0]">
            Recuperar contrasena
          </button>
        </div>
        {authError && <p className="text-sm text-[#E53935]">{authError}</p>}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#1E88E5] hover:bg-[#1565C0] active:bg-[#0D47A1] text-white rounded-lg py-5 disabled:opacity-60"
        >
          {isSubmitting ? 'Ingresando...' : 'Iniciar Sesion'}
        </Button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-[#616161]">
          No tienes cuenta?{' '}
          <button onClick={() => navigate('/registro')} className="text-[#1E88E5] hover:text-[#1565C0]">
            Registrate aqui
          </button>
        </p>
      </div>
    </>
  );

  const renderStep = () => {
    switch (recoveryStep) {
      case 'email': return renderEmailStep();
      case 'code': return renderCodeStep();
      case 'newPassword': return renderNewPasswordStep();
      case 'success': return renderSuccessStep();
      default: return renderLoginForm();
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0D47A1] to-[#1E88E5] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-60 h-60 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center text-white max-w-md">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L12 22M2 12L22 12" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <h2 className="text-3xl mb-3">VitaSalud</h2>
          <p className="text-[#90CAF9] text-lg mb-8">Plataforma integral de gestion de salud</p>
          <div className="space-y-3 text-left">
            {['Agenda tus citas medicas en linea', 'Accede a tu historial clinico', 'Gestiona tus tratamientos activos'].map((text, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div className="w-2 h-2 bg-[#64B5F6] rounded-full" />
                <span className="text-sm text-white/90">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#F5F7FA]">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardContent className="p-8">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
              <div className="w-10 h-10 bg-[#1E88E5] rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L12 22M2 12L22 12" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <span className="text-xl text-[#0D47A1]">VitaSalud</span>
            </div>

            {renderStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
