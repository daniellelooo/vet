// Interfaces para el sistema veterinario

export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Pet {
  id?: number;
  user_id: number;
  name: string;
  species: string;
  breed?: string;
  gender?: 'macho' | 'hembra';
  date_of_birth?: string;
  weight?: number;
  color?: string;
  microchip_number?: string;
  medical_history?: string;
  allergies?: string;
  current_medications?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Veterinarian {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  license_number: string;
  specialization?: string;
  years_experience?: number;
  education?: string;
  bio?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface Service {
  id?: number;
  name: string;
  description?: string;
  price: number;
  duration_minutes?: number;
  is_home_service?: boolean;
  category: string;
  requirements?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface Appointment {
  id?: number;
  user_id: number;
  pet_id: number;
  veterinarian_id: number;
  service_id: number;
  appointment_date: string;
  appointment_time: string;
  status?: 'programada' | 'confirmada' | 'en_progreso' | 'completada' | 'cancelada';
  address: string;
  notes?: string;
  total_amount: number;
  created_at?: string;
  updated_at?: string;
}

export interface Exam {
  id?: number;
  appointment_id?: number;
  pet_id: number;
  veterinarian_id: number;
  exam_type: string;
  description?: string;
  status?: 'solicitado' | 'en_proceso' | 'completado' | 'cancelado';
  requested_date?: string;
  scheduled_date?: string;
  completed_date?: string;
  results?: string;
  recommendations?: string;
  attachments?: string;
  created_at?: string;
}

export interface Payment {
  id?: number;
  appointment_id: number;
  user_id: number;
  amount: number;
  payment_method: 'tarjeta_credito' | 'tarjeta_debito' | 'efectivo';
  payment_status?: 'pendiente' | 'procesando' | 'completado' | 'fallido' | 'reembolsado';
  transaction_id?: string;
  card_last_four?: string;
  payment_date?: string;
  created_at?: string;
}

export interface MedicalRecord {
  id?: number;
  pet_id: number;
  veterinarian_id: number;
  appointment_id?: number;
  record_type: 'consulta' | 'vacuna' | 'cirugia' | 'tratamiento' | 'emergencia';
  diagnosis?: string;
  treatment?: string;
  medications?: string;
  observations?: string;
  next_visit_date?: string;
  attachments?: string;
  created_at?: string;
}

export interface Vaccination {
  id?: number;
  pet_id: number;
  veterinarian_id: number;
  vaccine_name: string;
  vaccine_type: string;
  administered_date: string;
  next_due_date?: string;
  batch_number?: string;
  manufacturer?: string;
  notes?: string;
  created_at?: string;
}

// Interfaces para requests/responses de la API
export interface RegisterRequest {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    date_of_birth?: string;
  };
  pet: {
    name: string;
    species: string;
    breed?: string;
    gender?: 'macho' | 'hembra';
    date_of_birth?: string;
    weight?: number;
    color?: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: Omit<User, 'password_hash'>;
}
