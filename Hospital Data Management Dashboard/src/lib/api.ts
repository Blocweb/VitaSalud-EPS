const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ||
  'http://localhost:5000/api/v1';

const TOKEN_KEY = 'vitasalud_token';
const USER_KEY = 'vitasalud_user';

export type UserRole =
  | 'admin'
  | 'doctor'
  | 'nurse'
  | 'receptionist'
  | 'lab_technician'
  | 'pharmacist'
  | 'patient'
  | string;

export interface AuthUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  status?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
  patient?: Patient;
}

export interface ApiDataResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  total?: number;
}

export interface Patient {
  id: string;
  user_id?: string | null;
  patient_code?: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: string;
  blood_type?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  insurance_provider?: string | null;
  allergies?: string | null;
  is_active?: boolean;
}

export interface Doctor {
  id: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  specialization: string;
  qualification?: string;
  consultation_fee?: number;
  rating?: number;
  department_name?: string;
}

export interface Department {
  id: number;
  name: string;
  description?: string | null;
  floor_number?: number | null;
  phone?: string | null;
  email?: string | null;
  is_active?: boolean;
}

export interface Appointment {
  id: string;
  appointment_number?: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type?: string;
  chief_complaint?: string | null;
  status: string;
  priority?: string;
  patient_name?: string;
  doctor_name?: string;
  specialization?: string;
  room_number?: string | null;
}

export interface MedicalRecord {
  id: string;
  record_number?: string;
  visit_date: string;
  diagnosis: string;
  symptoms?: string | null;
  treatment_plan?: string | null;
  doctor_notes?: string | null;
  vital_signs?: unknown;
  doctor_name?: string;
  specialization?: string;
  patient_name?: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  document_number?: string;
}

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export const authStorage = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  getUser(): AuthUser | null {
    const rawUser = localStorage.getItem(USER_KEY);
    if (!rawUser) return null;

    try {
      return JSON.parse(rawUser) as AuthUser;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },
  setSession(token: string, user: AuthUser) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export function getApiErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    // Si el backend incluye detalles de validación, mostrarlos
    const details: any = error.details;
    if (details && Array.isArray(details.errors) && details.errors.length > 0) {
      return details.errors.map((e: any) => `${e.param}: ${e.msg}`).join('; ');
    }

    return error.message || 'No se pudo completar la solicitud';
  }

  if (error instanceof Error) return error.message;
  return 'No se pudo completar la solicitud';
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => null);
  const message =
    payload?.message ||
    (response.ok ? 'Solicitud completada' : `Error ${response.status}`);

  if (!response.ok || payload?.success === false) {
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

async function apiData<T>(path: string, options?: RequestInit) {
  const response = await apiRequest<ApiDataResponse<T>>(path, options);
  return response.data;
}

export const authApi = {
  login(email: string, password: string) {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  register(payload: RegisterPayload) {
    return apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  forgotPassword(email: string) {
    return apiRequest<{ success: boolean; message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
  resetPassword(payload: { email: string; code: string; new_password: string }) {
    return apiRequest<{ success: boolean; message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  verify() {
    return apiRequest<{ success: boolean; message: string; user: AuthUser }>('/auth/verify');
  },
};

export const patientsApi = {
  list() {
    return apiData<Patient[]>('/patients');
  },
  // GET /patients/me — obtiene el perfil del paciente autenticado
  me() {
    return apiData<Patient>('/patients/me');
  },
  updateMe(payload: Partial<Patient>) {
    return apiData<Patient>('/patients/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};

export const doctorsApi = {
  list() {
    return apiData<Doctor[]>('/doctors');
  },
  create(payload: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    department_id?: number | null;
    license_number: string;
    specialization: string;
    qualification?: string;
    experience_years?: number;
    consultation_fee?: number;
    available_for_emergency?: boolean;
    biography?: string;
    languages_spoken?: string;
  }) {
    return apiData<any>('/doctors', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

export const departmentsApi = {
  list() {
    return apiData<Department[]>('/departments');
  },
};

export const appointmentsApi = {
  list() {
    return apiData<Appointment[]>('/appointments');
  },
  byPatient(patientId: string) {
    return apiData<Appointment[]>(`/appointments/patient/${patientId}`);
  },
  byDoctor(doctorId: string) {
    return apiData<Appointment[]>(`/appointments/doctor/${doctorId}`);
  },
  create(payload: {
    patient_id: string;
    doctor_id: string;
    room_id?: number | string | null;
    appointment_date: string;
    appointment_time: string;
    appointment_type: string;
    priority?: string;
    chief_complaint?: string;
  }) {
    return apiData<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  update(id: string, payload: Partial<Appointment>) {
    return apiData<Appointment>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  cancel(id: string, cancellation_reason?: string) {
    return apiData<Appointment>(`/appointments/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ cancellation_reason }),
    });
  },
  markAsAttended(id: string) {
    return apiData<Appointment>(`/appointments/${id}/attend`, {
      method: 'PATCH',
      body: JSON.stringify({}),
    });
  },
  markAsCompleted(id: string, diagnosis?: string, notes?: string) {
    return apiData<Appointment>(`/appointments/${id}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ diagnosis, notes }),
    });
  },
};

export const medicalRecordsApi = {
  list() {
    return apiData<MedicalRecord[]>('/medical-records');
  },
  byPatient(patientId: string) {
    return apiData<MedicalRecord[]>(`/medical-records/patient/${patientId}`);
  },
  get(id: string) {
    return apiData<MedicalRecord>(`/medical-records/${id}`);
  },
};

export const prescriptionsApi = {
  list() {
    return apiData<any[]>('/prescriptions');
  },
  byPatient(patientId: string) {
    return apiData<any[]>(`/prescriptions/patient/${patientId}`);
  },
  byDoctor(doctorId: string) {
    return apiData<any[]>(`/prescriptions/doctor/${doctorId}`);
  },
  get(id: string) {
    return apiData<any>(`/prescriptions/${id}`);
  },
};

export const settingsApi = {
  getEmailConfig() {
    return apiRequest<{ success: boolean; data: { host?: string; port?: number; user?: string; from?: string; secure?: boolean } }>(
      '/settings/email'
    );
  },
  saveEmailConfig(payload: { host: string; port: number; user: string; pass: string; from: string; secure: boolean }) {
    return apiRequest<{ success: boolean; message: string }>(
      '/settings/email',
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    );
  },
  testEmail(payload: { to: string; host?: string; port?: number; user?: string; pass?: string; from?: string; secure?: boolean }) {
    return apiRequest<{ success: boolean; message: string }>(
      '/settings/email/test',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  },
};
