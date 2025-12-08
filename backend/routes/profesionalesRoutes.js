const express = require('express');
const router = express.Router();

const {
  crearProfesional,
  obtenerProfesionales,
  actualizarProfesional,
  obtenerProfesionalPorId,
  obtenerProfesionalesActivos,
  cambiarEstadoProfesional,
} = require('../controllers/profesionalesController');

router.get('/', obtenerProfesionales);          
router.get('/activos', obtenerProfesionalesActivos); 
router.get('/:id', obtenerProfesionalPorId);
router.post('/', crearProfesional);
router.put('/:id', actualizarProfesional);
router.put('/:id/estado', cambiarEstadoProfesional);


module.exports = router;
