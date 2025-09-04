import express from 'express';
import db from '../database/connection';
import { Service, Veterinarian, Appointment } from '../models/types';

const router = express.Router();

// GET /api/services - Obtener todos los servicios
router.get('/', (req, res) => {
  try {
    const services = db.prepare('SELECT * FROM services WHERE is_active = 1 ORDER BY category, name').all() as Service[];
    res.json(services);
  } catch (error) {
    console.error('Error obteniendo servicios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/services/categories - Obtener categorías de servicios
router.get('/categories', (req, res) => {
  try {
    const categories = db.prepare('SELECT DISTINCT category FROM services WHERE is_active = 1 ORDER BY category').all();
    res.json(categories);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/services/:id - Obtener servicio por ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const service = db.prepare('SELECT * FROM services WHERE id = ? AND is_active = 1').get(id) as Service;
    
    if (!service) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    res.json(service);
  } catch (error) {
    console.error('Error obteniendo servicio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
