const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { 
  authenticateJWT, 
  isIntervenantOrAdmin, 
  isAdmin, 
  canAccessEtudiant, 
  verifyOTP 
} = require('../middlewares/auth.middleware');

router.get('/me', authenticateJWT, userController.getCurrentUser);

router.get('/etudiants/:id', authenticateJWT, canAccessEtudiant, userController.getEtudiantDetails);
router.get('/etudiants', authenticateJWT, isIntervenantOrAdmin, userController.getAllEtudiants);

router.get('/intervenants', authenticateJWT, isAdmin, userController.getAllIntervenants);
router.post('/intervenants/verify-otp', authenticateJWT, isAdmin, verifyOTP, userController.getAllIntervenants);

router.put('/:id', authenticateJWT, userController.updateUser);

router.delete('/:id', authenticateJWT, userController.deleteUser);

module.exports = router; 