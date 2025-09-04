import { db, createTables } from './connection';
import bcrypt from 'bcryptjs';

// Función para insertar datos de ejemplo
const insertSampleData = async () => {
  try {
    console.log('🔄 Insertando datos de ejemplo...');

    // Crear hash de contraseña para usuarios demo
    const demoPassword = await bcrypt.hash('demo123', 10);

    // Usar transacción síncrona (SQLite requirement)
    const transaction = db.transaction(() => {
      // Deshabilitar foreign keys temporalmente para limpieza
      db.exec('PRAGMA foreign_keys = OFF');
      
      // Limpiar datos en orden correcto (respetar dependencias)
      console.log('🧹 Limpiando datos existentes...');
      db.exec('DELETE FROM appointments');
      db.exec('DELETE FROM pets');
      db.exec('DELETE FROM users');
      db.exec('DELETE FROM veterinarians');
      db.exec('DELETE FROM services');
      
      // Reactivar foreign keys
      db.exec('PRAGMA foreign_keys = ON');

      console.log('👨‍⚕️ Insertando veterinarios...');

    // Insertar veterinarios
    const insertVeterinarian = db.prepare(`
      INSERT INTO veterinarians (
        first_name, last_name, email, phone, license_number, 
        specialization, years_experience, education, bio
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertVeterinarian.run(
      'Dr. Carlos',
      'Rodríguez',
      'carlos.rodriguez@veterinaria.com',
      '+57 301 234 5678',
      'VET-001',
      'Medicina General',
      8,
      'Universidad Nacional - Medicina Veterinaria',
      'Especialista en medicina general con 8 años de experiencia en servicios a domicilio'
    );

    insertVeterinarian.run(
      'Dra. Ana',
      'Martínez',
      'ana.martinez@veterinaria.com',
      '+57 302 345 6789',
      'VET-002',
      'Cirugía',
      10,
      'Universidad Javeriana - Medicina Veterinaria, Especialización en Cirugía',
      'Cirujana veterinaria especializada en procedimientos menores y mayores'
    );

    // Insertar servicios
    const insertService = db.prepare(`
      INSERT INTO services (
        name, description, price, duration_minutes, category, requirements
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    const services = [
      ['Consulta General a Domicilio', 'Examen físico completo, diagnóstico básico y recomendaciones', 80000, 45, 'Consulta', 'Tener la mascota en ayunas de 4 horas'],
      ['Vacunación a Domicilio', 'Aplicación de vacunas según esquema de vacunación', 50000, 30, 'Prevención', 'Mascota debe estar desparasitada'],
      ['Desparasitación', 'Aplicación de tratamiento antiparasitario interno y externo', 35000, 20, 'Prevención', 'Peso actualizado de la mascota'],
      ['Cirugía Menor a Domicilio', 'Procedimientos quirúrgicos menores (sutura, extracción, etc.)', 250000, 90, 'Cirugía', 'Espacio adecuado y ayuno de 12 horas'],
      ['Eutanasia Humanitaria', 'Procedimiento de eutanasia humanitaria a domicilio', 200000, 60, 'Cuidados Paliativos', 'Consulta previa requerida'],
      ['Exámenes de Laboratorio', 'Toma de muestras para análisis (sangre, orina, heces)', 120000, 30, 'Diagnóstico', 'Ayuno según tipo de examen'],
      ['Consulta de Emergencia', 'Atención veterinaria de urgencia las 24 horas', 150000, 60, 'Emergencia', 'Disponible 24/7 con recargo nocturno']
    ];

    services.forEach(service => {
      insertService.run(...service);
    });

    // Verificar IDs disponibles
    const availableVets = db.prepare('SELECT id, first_name, last_name FROM veterinarians').all() as Array<{id: number, first_name: string, last_name: string}>;
    const availableServices = db.prepare('SELECT id, name FROM services').all() as Array<{id: number, name: string}>;
    
    console.log('🔍 Veterinarios disponibles:', availableVets);
    console.log('🔍 Servicios disponibles:', availableServices);

    // Insertar usuario demo
    const insertUser = db.prepare(`
      INSERT INTO users (first_name, last_name, email, password_hash, phone, address)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const userId = insertUser.run(
      'María',
      'González',
      'maria@demo.com',
      demoPassword,
      '+57 300 123 4567',
      'Calle 123 #45-67, Bogotá'
    ).lastInsertRowid;

    // Insertar mascota demo
    const insertPet = db.prepare(`
      INSERT INTO pets (
        user_id, name, species, breed, gender, date_of_birth, weight, color, medical_history
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const maxResult = insertPet.run(
      userId,
      'Max',
      'Perro',
      'Golden Retriever',
      'macho',
      '2021-03-10',
      28.5,
      'Dorado',
      'Vacunas al día. Sin problemas de salud conocidos. Última desparasitación: enero 2025.'
    );
    const petMaxId = maxResult.lastInsertRowid as number;

    const lunaResult = insertPet.run(
      userId,
      'Luna',
      'Gato',
      'Siamés',
      'hembra',
      '2022-07-20',
      4.2,
      'Blanco y negro',
      'Esterilizada. Vacunas completas. Tratamiento preventivo contra pulgas activo.'
    );
    const petLunaId = lunaResult.lastInsertRowid as number;

    console.log('✅ Datos de ejemplo insertados exitosamente:');
    console.log('👨‍⚕️ 2 veterinarios creados');
    console.log('🏥 7 servicios veterinarios creados');
    console.log('👤 1 usuario demo creado (maria@demo.com / demo123)');
    console.log('🐕 2 mascotas demo creadas (Max y Luna)');

    // Insertar citas de ejemplo
    console.log('📅 Insertando citas de ejemplo...');
    
    // Obtener IDs de las mascotas demo
    const pets = db.prepare('SELECT id, name FROM pets WHERE user_id = ?').all(userId) as Array<{id: number, name: string}>;
    const petMax = pets.find(p => p.name === 'Max');
    const petLuna = pets.find(p => p.name === 'Luna');

    console.log('🔍 Mascotas encontradas:', pets);

    if (!petMax || !petLuna) {
      console.log('❌ No se encontraron las mascotas demo');
      return;
    }

    const insertAppointment = db.prepare(`
      INSERT INTO appointments (
        user_id, pet_id, veterinarian_id, service_id,
        appointment_date, appointment_time, status, payment_status,
        address, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Cita confirmada pendiente de pago (usando IDs encontrados)
    insertAppointment.run(
      userId, // user_id
      petMax.id, // pet_id (Max)
      availableVets[0].id, // veterinarian_id (Dr. Carlos - primer veterinario)
      availableServices[0].id, // service_id (Consulta General - primer servicio)
      '2025-09-10', // appointment_date
      '14:00', // appointment_time
      'confirmada', // status
      'pending', // payment_status
      'Carrera 15 #45-67, Apartamento 301, Bogotá', // address
      'Revisión general para Max, ha estado un poco decaído últimamente' // notes
    );

    // Cita completada y pagada
    insertAppointment.run(
      userId, // user_id
      petLuna.id, // pet_id (Luna)
      availableVets[1].id, // veterinarian_id (Dra. Ana - segundo veterinario)
      availableServices[1].id, // service_id (Vacunación - segundo servicio)
      '2025-08-28', // appointment_date
      '10:30', // appointment_time
      'completada', // status
      'paid', // payment_status
      'Carrera 15 #45-67, Apartamento 301, Bogotá', // address
      'Vacuna antirrábica aplicada exitosamente' // notes
    );

    // Cita programada
    insertAppointment.run(
      userId, // user_id
      petMax.id, // pet_id (Max)
      availableVets[0].id, // veterinarian_id (Dr. Carlos)
      availableServices[2].id, // service_id (Desparasitación - tercer servicio)
      '2025-09-15', // appointment_date
      '16:00', // appointment_time
      'programada', // status
      'pending', // payment_status
      'Carrera 15 #45-67, Apartamento 301, Bogotá', // address
      'Desparasitación preventiva mensual' // notes
    );

    console.log('📅 3 citas de ejemplo creadas');

    }); // Fin de la transacción

    // Ejecutar la transacción
    transaction();
    console.log('✅ Transacción de datos de ejemplo completada');
    
  } catch (error) {
    console.error('❌ Error en datos de ejemplo:', error);
  }
};

// Función principal para configurar la base de datos
const setupDatabase = async () => {
  try {
    console.log('🔄 Configurando base de datos...');
    
    // Crear tablas
    createTables();
    
    // Insertar datos de ejemplo
    await insertSampleData();
    
    console.log('🎉 Base de datos configurada exitosamente!');
    console.log('\n📋 CREDENCIALES DEMO:');
    console.log('   Email: maria@demo.com');
    console.log('   Contraseña: demo123');
    console.log('   Mascotas: Max (Golden Retriever) y Luna (Siamés)');
    
  } catch (error) {
    console.error('❌ Error configurando base de datos:', error);
  } finally {
    db.close();
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  setupDatabase();
}

export { setupDatabase, insertSampleData };
