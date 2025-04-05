const passport = require('passport');
const { UserRole } = require('../models/User');
const speakeasy = require('speakeasy');

const authenticateJWT = passport.authenticate('jwt', { session: false });

const isEtudiant = (req, res, next) => {
  if (req.user && req.user.role === UserRole.ETUDIANT) {
    return next();
  }
  return res.status(403).json({ message: 'Accès non autorisé' });
};

const isIntervenant = (req, res, next) => {
  if (req.user && req.user.role === UserRole.INTERVENANT) {
    return next();
  }
  return res.status(403).json({ message: 'Accès non autorisé' });
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === UserRole.ADMIN) {
    return next();
  }
  return res.status(403).json({ message: 'Accès non autorisé' });
};

const isIntervenantOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === UserRole.INTERVENANT || req.user.role === UserRole.ADMIN)) {
    return next();
  }
  return res.status(403).json({ message: 'Accès non autorisé' });
};

const canAccessEtudiant = (req, res, next) => {
  const { id: userId } = req.params;
  
  if (!req.user) {
    return res.status(401).json({ message: 'Utilisateur non authentifié' });
  }

  if (
    req.user.role === UserRole.ADMIN ||
    req.user.role === UserRole.INTERVENANT ||
    (req.user.role === UserRole.ETUDIANT && req.user._id.toString() === userId)
  ) {
    return next();
  }

  return res.status(403).json({ message: 'Accès non autorisé' });
};

const verifyOTP = (req, res, next) => {
  const { token } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: 'Utilisateur non authentifié' });
  }

  if (!req.user.otpEnabled || !req.user.otpSecret) {
    return res.status(400).json({ message: 'OTP non activé pour cet utilisateur' });
  }

  const verified = speakeasy.totp.verify({
    secret: req.user.otpSecret,
    encoding: 'base32',
    token
  });

  if (verified) {
    return next();
  }

  return res.status(401).json({ message: 'Code OTP invalide' });
};

module.exports = {
  authenticateJWT,
  isEtudiant,
  isIntervenant,
  isAdmin,
  isIntervenantOrAdmin,
  canAccessEtudiant,
  verifyOTP
}; 