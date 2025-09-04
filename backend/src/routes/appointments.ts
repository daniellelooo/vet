import express, { Request, Response } from 'express';
import db from '../database/connection';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { requestLogger, validateContentType, sanitizeInput } from '../middleware/validation';

const router = express.Router();

// Aplicar middlewares globales
router.use(requestLogger);
router.use(validateContentType);
router.use(sanitizeInput);

// GET /api/appointments/my-appointments - Obtener citas del usuario autenticado
router.get('/my-appointments', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    console.log(`📅 Obteniendo citas para usuario ID: ${userId}`);
    
    const appointments = db.prepare(`
      SELECT 
        a.id,
        s.name as service_name,
        (v.first_name || ' ' || v.last_name) as veterinarian_name,
        v.specialization as veterinarian_specialization,
        (a.appointment_date || ' ' || a.appointment_time) as appointment_date,
        p.name as pet_name,
        p.species as pet_species,
        a.status,
        a.payment_status,
        a.notes,
        s.price
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      JOIN veterinarians v ON a.veterinarian_id = v.id
      JOIN pets p ON a.pet_id = p.id
      WHERE a.user_id = ?
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `).all(userId);

    console.log(`✅ Encontradas ${appointments.length} citas para el usuario`);
    res.json(appointments);

  } catch (error: any) {
    console.error('❌ Error obteniendo citas del usuario:', {
      userId: req.userId,
      message: error.message,
      stack: error.stack?.split('\n')[0]
    });
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/appointments - Obtener citas del usuario autenticado (legacy)
router.get('/', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const appointments = db.prepare(`
      SELECT a.*, s.name as service_name, s.price, s.duration_minutes,
             v.name as vet_name,
             a.pet_name, a.pet_species
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      JOIN veterinarians v ON a.veterinarian_id = v.id
      WHERE a.user_id = ?
      ORDER BY a.appointment_date DESC
    `).all(req.userId);
    
    res.json(appointments);
  } catch (error) {
    console.error('Error obteniendo citas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/appointments - Crear nueva cita
router.post('/', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { pet_id, veterinarian_id, service_id, appointment_date, appointment_time, address, notes } = req.body;

    console.log('📝 Datos recibidos para nueva cita:', {
      pet_id,
      veterinarian_id, 
      service_id,
      appointment_date,
      appointment_time,
      userId: req.userId
    });

    // Validaciones mejoradas
    if (!pet_id || !veterinarian_id || !service_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ 
        error: 'Datos incompletos para crear la cita',
        required: ['pet_id', 'veterinarian_id', 'service_id', 'appointment_date', 'appointment_time'],
        received: {
          pet_id: !!pet_id,
          veterinarian_id: !!veterinarian_id,
          service_id: !!service_id,
          appointment_date: !!appointment_date,
          appointment_time: !!appointment_time
        }
      });
    }

    // Validar formato de fecha
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^\d{2}:\d{2}$/;
    
    if (!dateRegex.test(appointment_date)) {
      return res.status(400).json({ error: 'Formato de fecha inválido. Use YYYY-MM-DD' });
    }
    
    if (!timeRegex.test(appointment_time)) {
      return res.status(400).json({ error: 'Formato de hora inválido. Use HH:MM' });
    }

    // Verificar fecha no sea pasada
    const appointmentDateTime = new Date(`${appointment_date}T${appointment_time}`);
    if (appointmentDateTime <= new Date()) {
      return res.status(400).json({ error: 'No se pueden agendar citas en fechas pasadas' });
    }

    // Verificar que la mascota pertenece al usuario
    console.log(`🔍 Verificando mascota ID ${pet_id} para usuario ${req.userId}`);
    const pet = db.prepare('SELECT * FROM pets WHERE id = ? AND user_id = ?').get(pet_id, req.userId);
    if (!pet) {
      return res.status(403).json({ error: 'Mascota no encontrada o no autorizada' });
    }
    console.log(`✅ Mascota verificada: ${(pet as any).name}`);

    // Verificar que el veterinario existe
    const veterinarian = db.prepare('SELECT * FROM veterinarians WHERE id = ?').get(veterinarian_id);
    if (!veterinarian) {
      return res.status(404).json({ error: 'Veterinario no encontrado' });
    }
    console.log(`✅ Veterinario verificado: ${(veterinarian as any).first_name} ${(veterinarian as any).last_name}`);

    // Obtener precio del servicio
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(service_id) as any;
    if (!service) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    console.log(`✅ Servicio verificado: ${service.name} - $${service.price}`);

    // Verificar conflictos de horario
    const existingAppointment = db.prepare(`
      SELECT id FROM appointments 
      WHERE veterinarian_id = ? 
      AND appointment_date = ? 
      AND appointment_time = ?
      AND status != 'cancelada'
    `).get(veterinarian_id, appointment_date, appointment_time);
    
    if (existingAppointment) {
      return res.status(409).json({ 
        error: 'El veterinario ya tiene una cita agendada en ese horario',
        suggestion: 'Por favor seleccione otro horario'
      });
    }

    // Obtener dirección del usuario si no se proporciona
    let appointmentAddress = address;
    if (!appointmentAddress) {
      const user = db.prepare('SELECT address FROM users WHERE id = ?').get(req.userId) as any;
      appointmentAddress = user?.address || 'Dirección a definir';
    }

    console.log('💾 Creando nueva cita en la base de datos...');

    // Usar transacción para insertar cita
    const transaction = db.transaction(() => {
      const insertAppointment = db.prepare(`
        INSERT INTO appointments (user_id, pet_id, veterinarian_id, service_id, appointment_date, appointment_time, status, notes, address, total_amount)
        VALUES (?, ?, ?, ?, ?, ?, 'programada', ?, ?, ?)
      `);

      const result = insertAppointment.run(
        req.userId,
        pet_id,
        veterinarian_id,
        service_id,
        appointment_date,
        appointment_time,
        notes || 'Cita agendada',
        appointmentAddress,
        service.price || 0
      );

      return result.lastInsertRowid;
    });

    const appointmentId = transaction();

    console.log(`✅ Cita creada exitosamente con ID: ${appointmentId}`);

    // Obtener la cita creada con información completa
    const newAppointment = db.prepare(`
      SELECT a.*, s.name as service_name, s.price, s.duration_minutes,
             (v.first_name || ' ' || v.last_name) as vet_name,
             p.name as pet_name, p.species as pet_species
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      JOIN veterinarians v ON a.veterinarian_id = v.id
      JOIN pets p ON a.pet_id = p.id
      WHERE a.id = ?
    `).get(appointmentId);

    res.status(201).json({
      message: 'Cita creada exitosamente',
      appointment: newAppointment
    });

  } catch (error: any) {
    console.error('❌ Error creando cita:', {
      message: error.message,
      code: error.code,
      userId: req.userId,
      petId: req.body?.pet_id,
      stack: error.stack?.split('\n')[0]
    });

    // Manejar errores específicos
    if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
      return res.status(400).json({ 
        error: 'Datos de referencia inválidos',
        details: 'Uno o más IDs proporcionados no existen'
      });
    }

    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PATCH /api/appointments/:id/status - Actualizar status de cita
router.patch('/:id/status', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.userId;

    console.log(`📝 Actualizando status de cita ${id} a: ${status}`);

    // Validar status
    const validStatuses = ['programada', 'confirmada', 'en_progreso', 'completada', 'cancelada'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Status inválido',
        validStatuses
      });
    }

    // Verificar que la cita pertenece al usuario
    const appointment = db.prepare('SELECT * FROM appointments WHERE id = ? AND user_id = ?').get(id, userId);
    if (!appointment) {
      return res.status(404).json({ error: 'Cita no encontrada o no autorizada' });
    }

    // Actualizar status
    const updateStmt = db.prepare('UPDATE appointments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?');
    updateStmt.run(status, id, userId);

    console.log(`✅ Status de cita ${id} actualizado a: ${status}`);

    // Devolver cita actualizada
    const updatedAppointment = db.prepare(`
      SELECT 
        a.id,
        s.name as service_name,
        (v.first_name || ' ' || v.last_name) as veterinarian_name,
        v.specialization as veterinarian_specialization,
        (a.appointment_date || ' ' || a.appointment_time) as appointment_date,
        p.name as pet_name,
        p.species as pet_species,
        a.status,
        a.payment_status,
        a.notes,
        s.price
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      JOIN veterinarians v ON a.veterinarian_id = v.id
      JOIN pets p ON a.pet_id = p.id
      WHERE a.id = ?
    `).get(id);

    res.json({
      message: 'Status actualizado exitosamente',
      appointment: updatedAppointment
    });

  } catch (error: any) {
    console.error('❌ Error actualizando status de cita:', {
      appointmentId: req.params.id,
      userId: req.userId,
      message: error.message
    });
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PATCH /api/appointments/:id/payment - Actualizar estado de pago
router.patch('/:id/payment', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { payment_status, payment_method, payment_amount } = req.body;
    const userId = req.userId;

    console.log(`💳 Procesando pago para cita ${id}:`, { payment_status, payment_method, payment_amount });

    // Validar payment_status
    const validPaymentStatuses = ['pending', 'paid', 'refunded'];
    if (!validPaymentStatuses.includes(payment_status)) {
      return res.status(400).json({ 
        error: 'Estado de pago inválido',
        validStatuses: validPaymentStatuses
      });
    }

    // Verificar que la cita pertenece al usuario
    const appointment = db.prepare('SELECT * FROM appointments WHERE id = ? AND user_id = ?').get(id, userId);
    if (!appointment) {
      return res.status(404).json({ error: 'Cita no encontrada o no autorizada' });
    }

    // Actualizar payment_status
    const updateStmt = db.prepare(`
      UPDATE appointments 
      SET payment_status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ? AND user_id = ?
    `);
    updateStmt.run(payment_status, id, userId);

    console.log(`✅ Pago de cita ${id} actualizado a: ${payment_status}`);

    // Devolver cita actualizada
    const updatedAppointment = db.prepare(`
      SELECT 
        a.id,
        s.name as service_name,
        (v.first_name || ' ' || v.last_name) as veterinarian_name,
        v.specialization as veterinarian_specialization,
        (a.appointment_date || ' ' || a.appointment_time) as appointment_date,
        p.name as pet_name,
        p.species as pet_species,
        a.status,
        a.payment_status,
        a.notes,
        s.price
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      JOIN veterinarians v ON a.veterinarian_id = v.id
      JOIN pets p ON a.pet_id = p.id
      WHERE a.id = ?
    `).get(id);

    res.json({
      message: 'Pago procesado exitosamente',
      appointment: updatedAppointment
    });

  } catch (error: any) {
    console.error('❌ Error procesando pago:', {
      error: error.message,
      appointmentId: req.params.id,
      userId: req.userId
    });
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/appointments/pets - Obtener mascotas del usuario
router.get('/pets', authMiddleware, (req: AuthRequest, res) => {
  try {
    const pets = db.prepare('SELECT * FROM pets WHERE user_id = ? ORDER BY name').all(req.userId);
    res.json(pets);
  } catch (error) {
    console.error('Error obteniendo mascotas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
