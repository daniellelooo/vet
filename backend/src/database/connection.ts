import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'veterinaria.db');
const db = new Database(dbPath);

// Configurar WAL mode para mejor performance
db.pragma('journal_mode = WAL');

// Crear todas las tablas del sistema veterinario
const createTables = () => {
  // Tabla de usuarios (clientes)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      date_of_birth DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabla de mascotas (pacientes)
  db.exec(`
    CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      species TEXT NOT NULL,
      breed TEXT,
      gender TEXT CHECK(gender IN ('macho', 'hembra')),
      date_of_birth DATE,
      weight REAL,
      color TEXT,
      microchip_number TEXT,
      medical_history TEXT,
      allergies TEXT,
      current_medications TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Tabla de veterinarios
  db.exec(`
    CREATE TABLE IF NOT EXISTS veterinarians (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      license_number TEXT UNIQUE NOT NULL,
      specialization TEXT,
      years_experience INTEGER,
      education TEXT,
      bio TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabla de servicios veterinarios
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      duration_minutes INTEGER,
      is_home_service BOOLEAN DEFAULT true,
      category TEXT NOT NULL,
      requirements TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabla de citas
  db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      pet_id INTEGER NOT NULL,
      veterinarian_id INTEGER NOT NULL,
      service_id INTEGER NOT NULL,
      appointment_date DATE NOT NULL,
      appointment_time TIME NOT NULL,
      status TEXT DEFAULT 'programada' CHECK(status IN ('programada', 'confirmada', 'en_progreso', 'completada', 'cancelada')),
      payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'paid', 'refunded')),
      address TEXT,
      notes TEXT,
      total_amount REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (pet_id) REFERENCES pets (id),
      FOREIGN KEY (veterinarian_id) REFERENCES veterinarians (id),
      FOREIGN KEY (service_id) REFERENCES services (id)
    )
  `);

  // Tabla de exámenes/estudios
  db.exec(`
    CREATE TABLE IF NOT EXISTS exams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appointment_id INTEGER,
      pet_id INTEGER NOT NULL,
      veterinarian_id INTEGER NOT NULL,
      exam_type TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'solicitado' CHECK(status IN ('solicitado', 'en_proceso', 'completado', 'cancelado')),
      requested_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      scheduled_date DATETIME,
      completed_date DATETIME,
      results TEXT,
      recommendations TEXT,
      attachments TEXT, -- JSON array de archivos
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (appointment_id) REFERENCES appointments (id),
      FOREIGN KEY (pet_id) REFERENCES pets (id),
      FOREIGN KEY (veterinarian_id) REFERENCES veterinarians (id)
    )
  `);

  // Tabla de pagos
  db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appointment_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      payment_method TEXT NOT NULL CHECK(payment_method IN ('tarjeta_credito', 'tarjeta_debito', 'efectivo')),
      payment_status TEXT DEFAULT 'pendiente' CHECK(payment_status IN ('pendiente', 'procesando', 'completado', 'fallido', 'reembolsado')),
      transaction_id TEXT,
      card_last_four TEXT,
      payment_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (appointment_id) REFERENCES appointments (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Tabla de historiales médicos
  db.exec(`
    CREATE TABLE IF NOT EXISTS medical_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pet_id INTEGER NOT NULL,
      veterinarian_id INTEGER NOT NULL,
      appointment_id INTEGER,
      record_type TEXT NOT NULL CHECK(record_type IN ('consulta', 'vacuna', 'cirugia', 'tratamiento', 'emergencia')),
      diagnosis TEXT,
      treatment TEXT,
      medications TEXT,
      observations TEXT,
      next_visit_date DATE,
      attachments TEXT, -- JSON array de archivos
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pet_id) REFERENCES pets (id),
      FOREIGN KEY (veterinarian_id) REFERENCES veterinarians (id),
      FOREIGN KEY (appointment_id) REFERENCES appointments (id)
    )
  `);

  // Tabla de vacunas
  db.exec(`
    CREATE TABLE IF NOT EXISTS vaccinations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pet_id INTEGER NOT NULL,
      veterinarian_id INTEGER NOT NULL,
      vaccine_name TEXT NOT NULL,
      vaccine_type TEXT NOT NULL,
      administered_date DATE NOT NULL,
      next_due_date DATE,
      batch_number TEXT,
      manufacturer TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pet_id) REFERENCES pets (id),
      FOREIGN KEY (veterinarian_id) REFERENCES veterinarians (id)
    )
  `);

  console.log('✅ Todas las tablas de la base de datos han sido creadas exitosamente');
};

// Función para verificar y agregar columnas faltantes
const runMigrations = () => {
  try {
    // Verificar si la columna payment_status existe en appointments
    const columns = db.prepare(`PRAGMA table_info(appointments)`).all();
    const hasPaymentStatus = columns.some((col: any) => col.name === 'payment_status');
    
    if (!hasPaymentStatus) {
      console.log('🔄 Agregando columna payment_status a la tabla appointments...');
      db.exec(`ALTER TABLE appointments ADD COLUMN payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'paid', 'refunded'))`);
      console.log('✅ Columna payment_status agregada exitosamente');
    }
  } catch (error) {
    console.log('ℹ️ Las migraciones no son necesarias o ya se ejecutaron');
  }
};

export { db, createTables, runMigrations };
export default db;
