import express, { Request, Response } from 'express';
import db from '../database/connection';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// GET /api/pets - Obtener todas las mascotas del usuario autenticado
router.get('/', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    
    const pets = db.prepare(`
      SELECT 
        id,
        name,
        species,
        breed,
        gender,
        date_of_birth,
        weight,
        color,
        medical_history,
        created_at,
        updated_at
      FROM pets 
      WHERE user_id = ? 
      ORDER BY name
    `).all(userId);

    res.json(pets);
  } catch (error) {
    console.error('Error obteniendo mascotas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// POST /api/pets - Crear nueva mascota
router.post('/', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { name, species, breed, gender, date_of_birth, weight, color, medical_history } = req.body;

    console.log('📝 Datos recibidos para nueva mascota:', req.body);

    // Validaciones básicas
    if (!name || !species || !breed) {
      return res.status(400).json({ message: 'Nombre, especie y raza son requeridos' });
    }

    // Insertar mascota
    const insertPet = db.prepare(`
      INSERT INTO pets (user_id, name, species, breed, gender, date_of_birth, weight, color, medical_history)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertPet.run(
      userId,
      name,
      species,
      breed,
      gender || null,
      date_of_birth || null,
      weight || null,
      color || null,
      medical_history || null
    );

    // Obtener la mascota creada
    const newPet = db.prepare('SELECT * FROM pets WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      message: 'Mascota creada exitosamente',
      pet: newPet
    });

  } catch (error) {
    console.error('Error creando mascota:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// PUT /api/pets/:id - Actualizar mascota
router.put('/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const petId = req.params.id;
    const { name, species, breed, gender, date_of_birth, weight, color, medical_history } = req.body;

    // Verificar que la mascota pertenece al usuario
    const pet = db.prepare('SELECT * FROM pets WHERE id = ? AND user_id = ?').get(petId, userId);
    if (!pet) {
      return res.status(404).json({ message: 'Mascota no encontrada o no autorizada' });
    }

    // Actualizar mascota
    const updatePet = db.prepare(`
      UPDATE pets 
      SET name = ?, species = ?, breed = ?, gender = ?, date_of_birth = ?, 
          weight = ?, color = ?, medical_history = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `);

    updatePet.run(
      name,
      species,
      breed,
      gender || null,
      date_of_birth || null,
      weight || null,
      color || null,
      medical_history || null,
      petId,
      userId
    );

    // Obtener la mascota actualizada
    const updatedPet = db.prepare('SELECT * FROM pets WHERE id = ?').get(petId);

    res.json({
      message: 'Mascota actualizada exitosamente',
      pet: updatedPet
    });

  } catch (error) {
    console.error('Error actualizando mascota:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// DELETE /api/pets/:id - Eliminar mascota
router.delete('/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const petId = req.params.id;

    // Verificar que la mascota pertenece al usuario
    const pet = db.prepare('SELECT * FROM pets WHERE id = ? AND user_id = ?').get(petId, userId);
    if (!pet) {
      return res.status(404).json({ message: 'Mascota no encontrada o no autorizada' });
    }

    // Verificar si tiene citas programadas
    const appointments = db.prepare('SELECT COUNT(*) as count FROM appointments WHERE pet_id = ? AND status IN (?, ?)').get(petId, 'programada', 'confirmada');
    if ((appointments as any).count > 0) {
      return res.status(400).json({ message: 'No se puede eliminar la mascota porque tiene citas programadas' });
    }

    // Eliminar mascota
    const deletePet = db.prepare('DELETE FROM pets WHERE id = ? AND user_id = ?');
    deletePet.run(petId, userId);

    res.json({
      message: 'Mascota eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando mascota:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET /api/pets/:id - Obtener una mascota específica
router.get('/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const petId = req.params.id;

    const pet = db.prepare(`
      SELECT 
        id,
        name,
        species,
        breed,
        gender,
        date_of_birth,
        weight,
        color,
        medical_history,
        created_at,
        updated_at
      FROM pets 
      WHERE id = ? AND user_id = ?
    `).get(petId, userId);

    if (!pet) {
      return res.status(404).json({ message: 'Mascota no encontrada' });
    }

    res.json(pet);
  } catch (error) {
    console.error('Error obteniendo mascota:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;
