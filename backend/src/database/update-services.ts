import { db } from './connection';

// Actualizar servicios con los precios correctos
const updateServices = () => {
  try {
    console.log('🔄 Actualizando servicios veterinarios...');

    // Limpiar servicios existentes
    db.prepare('DELETE FROM services').run();

    // Insertar servicios actualizados
    const insertService = db.prepare(`
      INSERT INTO services (name, description, price, duration_minutes, category, requirements, is_home_service)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const services = [
      [
        'Consulta General a Domicilio',
        'Examen físico completo de tu mascota en la comodidad de tu hogar. Incluye diagnóstico básico, recomendaciones nutricionales y de cuidado.',
        45000,
        45,
        'Consulta',
        'Tener disponible el carnet de vacunas de la mascota',
        1
      ],
      [
        'Vacunación',
        'Aplicación profesional de vacunas según el esquema de vacunación recomendado. Incluye certificado de vacunación.',
        30000,
        30,
        'Prevención',
        'La mascota debe estar desparasitada y en buen estado de salud',
        1
      ],
      [
        'Exámenes de Sangre',
        'Toma de muestras sanguíneas para análisis completo. Incluye hemograma, química sanguínea y perfil bioquímico.',
        80000,
        40,
        'Diagnóstico',
        'Ayuno de 8-12 horas según el tipo de examen solicitado',
        1
      ],
      [
        'Cirugías Menores',
        'Procedimientos quirúrgicos ambulatorios como esterilización, extracción de tumores pequeños, suturas.',
        150000,
        90,
        'Cirugía',
        'Ayuno de 12 horas, espacio adecuado para el procedimiento',
        1
      ],
      [
        'Consulta de Emergencia',
        'Atención veterinaria urgente disponible 24/7 para casos que requieren atención inmediata.',
        65000,
        60,
        'Emergencia',
        'Disponible las 24 horas con recargo del 30% en horario nocturno',
        1
      ]
    ];

    services.forEach(service => {
      insertService.run(...service);
    });

    console.log('✅ Servicios actualizados exitosamente:');
    services.forEach((service, index) => {
      console.log(`   ${index + 1}. ${service[0]} - $${service[2].toLocaleString()} COP`);
    });

  } catch (error) {
    console.error('❌ Error actualizando servicios:', error);
  } finally {
    db.close();
  }
};

// Ejecutar actualización
updateServices();
