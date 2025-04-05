const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const { User, UserRole } = require('../models/User');
const jwtUtils = require('../utils/jwt');

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Nom d\'utilisateur ou email déjà utilisé' });
    }

    if (role && !Object.values(UserRole).includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide' });
    }

    const user = await User.create({
      username,
      email,
      password,
      role: role || UserRole.ETUDIANT
    });

    const token = jwtUtils.generateToken(user._id.toString());
    
    jwtUtils.setTokenCookie(res, token);

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    if (user.googleId && !user.password) {
      return res.status(400).json({ message: 'Veuillez vous connecter avec Google' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwtUtils.generateToken(user._id.toString());
    
    jwtUtils.setTokenCookie(res, token);

    if (user.otpEnabled) {
      return res.status(200).json({
        message: 'Connexion réussie, OTP requis',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        requireOTP: true
      });
    }

    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      requireOTP: false
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    jwtUtils.clearTokenCookie(res);
    
    res.status(200).json({ message: 'Déconnexion réussie' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.setupOTP = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }
    
    const secret = speakeasy.generateSecret({
      name: `CiveLampus:${req.user.email}`
    });

    await User.findByIdAndUpdate(req.user._id, {
      otpSecret: secret.base32,
      otpEnabled: false
    });

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url || '');

    res.status(200).json({
      message: 'Configuration OTP initiée',
      secret: secret.base32,
      qrCode: qrCodeUrl
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyAndEnableOTP = async (req, res) => {
  try {
    const { token } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    if (!req.user.otpSecret) {
      return res.status(400).json({ message: 'La configuration OTP n\'a pas été initiée' });
    }

    const verified = speakeasy.totp.verify({
      secret: req.user.otpSecret,
      encoding: 'base32',
      token
    });

    if (verified) {
      await User.findByIdAndUpdate(req.user._id, {
        otpEnabled: true
      });

      res.status(200).json({ message: 'OTP activé avec succès' });
    } else {
      res.status(400).json({ message: 'Code OTP invalide' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.disableOTP = async (req, res) => {
  try {
    const { token } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    if (!req.user.otpEnabled || !req.user.otpSecret) {
      return res.status(400).json({ message: 'L\'OTP n\'est pas activé pour cet utilisateur' });
    }

    const verified = speakeasy.totp.verify({
      secret: req.user.otpSecret,
      encoding: 'base32',
      token
    });

    if (verified) {
      await User.findByIdAndUpdate(req.user._id, {
        otpEnabled: false,
        otpSecret: undefined
      });

      res.status(200).json({ message: 'OTP désactivé avec succès' });
    } else {
      res.status(400).json({ message: 'Code OTP invalide' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyOTPForLogin = async (req, res) => {
  try {
    const { token, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (!user.otpEnabled || !user.otpSecret) {
      return res.status(400).json({ message: 'L\'OTP n\'est pas activé pour cet utilisateur' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.otpSecret,
      encoding: 'base32',
      token
    });

    if (verified) {
      const jwtToken = jwtUtils.generateToken(user._id.toString());
      
      jwtUtils.setTokenCookie(res, jwtToken);

      res.status(200).json({
        message: 'OTP vérifié avec succès',
        token: jwtToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(400).json({ message: 'Code OTP invalide' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 