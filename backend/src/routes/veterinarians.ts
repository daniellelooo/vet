import express from 'express';
import db from '../database/connection';
import { Veterinarian } from '../models/types';

const router = express.Router();

// GET /api/veterinarians - Obtener todos los veterinarios activos
router.get('/', (req, res) => {
  try {
    const veterinarians = db.prepare('SELECT * FROM veterinarians WHERE is_active = 1 ORDER BY first_name, last_name').all() as Veterinarian[];
    res.json(veterinarians);
  } catch (error) {
    console.error('Error obteniendo veterinarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/veterinarians/:id - Obtener veterinario por ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const veterinarian = db.prepare('SELECT * FROM veterinarians WHERE id = ? AND is_active = 1').get(id) as Veterinarian;
    
    if (!veterinarian) {
      return res.status(404).json({ error: 'Veterinario no encontrado' });
    }
    
    res.json(veterinarian);
  } catch (error) {
    console.error('Error obteniendo veterinario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
