/**
 * Archivo: backend/src/models/types.ts
 * Descripción: Definición de interfaces TypeScript para el sistema veterinario
 * Propósito: Proveer tipado estático y estructura de datos consistente
 */

// Interface que define la estructura de un usuario/cliente del sistema
export interface User {
  id?: number; // ID único autogenerado (opcional en creación)
  first_name: string; // Nombre del usuario
  last_name: string; // Apellido del usuario
  email: string; // Email único para login
  password_hash?: string; // Contraseña encriptada (opcional en respuestas)
  phone?: string; // Número telefónico (opcional)
  address?: string; // Dirección para servicios a domicilio (opcional)
  date_of_birth?: string; // Fecha de nacimiento en formato ISO (opcional)
  created_at?: string; // Timestamp de creación (autogenerado)
  updated_at?: string; // Timestamp de última actualización (autogenerado)
}

// Interface que define la estructura de una mascota/paciente
export interface Pet {
  id?: number; // ID único autogenerado
  user_id: number; // FK que referencia al dueño (users.id)
  name: string; // Nombre de la mascota
  species: string; // Especie (Perro, Gato, Ave, etc.)
  breed?: string; // Raza específica (opcional)
  gender?: 'macho' | 'hembra'; // Género con valores específicos
  date_of_birth?: string; // Fecha de nacimiento (opcional)
  weight?: number; // Peso en kilogramos (opcional)
  color?: string; // Color del pelaje/plumaje (opcional)
  microchip_number?: string; // Número de microchip si tiene (opcional)
  medical_history?: string; // Historial médico previo (opcional)
  allergies?: string; // Alergias conocidas (opcional)
  current_medications?: string; // Medicamentos actuales (opcional)
  created_at?: string; // Timestamp de registro
  updated_at?: string; // Timestamp de última actualización
}

// Interface que define la estructura de un veterinario
export interface Veterinarian {
  id?: number; // ID único autogenerado
  first_name: string; // Nombre del veterinario
  last_name: string; // Apellido del veterinario
  email: string; // Email de contacto
  phone?: string; // Teléfono de contacto (opcional)
  license_number: string; // Número de licencia profesional único
  specialization?: string; // Especialidad médica (opcional)
  years_experience?: number; // Años de experiencia profesional (opcional)
  education?: string; // Formación académica (opcional)
  bio?: string; // Biografía profesional (opcional)
  is_active?: boolean; // Estado activo/inactivo del veterinario
  created_at?: string; // Timestamp de registro
}

// Interface que define la estructura de un servicio veterinario
export interface Service {
  id?: number; // ID único autogenerado
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
