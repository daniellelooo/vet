import { db, createTables } from './connection';
import bcrypt from 'bcryptjs';

// Función para insertar datos de ejemplo
const insertSampleData = async () => {
  try {
    console.log('🔄 Insertando datos de ejemplo...');

    // Crear hash de contraseña para usuarios demo
    const demoPassword = await bcrypt.hash('demo123', 10);

    // Insertar veterinarios
    const insertVeterinarian = db.prepare(`
      INSERT OR REPLACE INTO veterinarians (
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
      INSERT OR REPLACE INTO services (
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

    // Insertar usuario demo
    const insertUser = db.prepare(`
      INSERT OR REPLACE INTO users (
        first_name, last_name, email, password_hash, phone, address, date_of_birth
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const userId = insertUser.run(
      'María',
      'González',
      'maria@demo.com',
      demoPassword,
      '+57 300 123 4567',
      'Calle 123 #45-67, Bogotá',
      '1990-05-15'
    ).lastInsertRowid;

    // Insertar mascota demo
    const insertPet = db.prepare(`
      INSERT OR REPLACE INTO pets (
        user_id, name, species, breed, gender, date_of_birth, weight, color, medical_history
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertPet.run(
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

    insertPet.run(
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

    console.log('✅ Datos de ejemplo insertados exitosamente:');
    console.log('👨‍⚕️ 2 veterinarios creados');
    console.log('🏥 7 servicios veterinarios creados');
    console.log('👤 1 usuario demo creado (maria@demo.com / demo123)');
    console.log('🐕 2 mascotas demo creadas (Max y Luna)');

  } catch (error) {
    console.error('❌ Error insertando datos de ejemplo:', error);
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
