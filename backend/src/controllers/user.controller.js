const { User, UserRole } = require('../models/User');

exports.getEtudiantDetails = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select('-password -otpSecret');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (user.role !== UserRole.ETUDIANT) {
      return res.status(400).json({ message: 'L\'utilisateur n\'est pas un étudiant' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllEtudiants = async (req, res) => {
  try {
    const etudiants = await User.find({ role: UserRole.ETUDIANT })
      .select('-password -otpSecret')
      .sort({ username: 1 });

    res.status(200).json({ etudiants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllIntervenants = async (req, res) => {
  try {
    const intervenants = await User.find({ role: UserRole.INTERVENANT })
      .select('-password -otpSecret')
      .sort({ username: 1 });

    res.status(200).json({ intervenants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const user = await User.findById(req.user._id).select('-password -otpSecret');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const userId = req.params.id;
    
    if (
      req.user.role !== UserRole.ADMIN && 
      req.user._id.toString() !== userId
    ) {
      return res.status(403).json({ message: 'Non autorisé à modifier cet utilisateur' });
    }

    const { 
      username, 
      email, 
      details,
      role,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const updateData = {};
    
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    
    if (details) {
      const plainDetails = typeof details.toObject === 'function' 
        ? details.toObject() 
        : JSON.parse(JSON.stringify(details));
      
      updateData.details = { 
        ...(user.details ? user.details.toObject() : {}), 
        ...plainDetails 
      };
    }
    
    if (role && req.user.role === UserRole.ADMIN) {
      if (!Object.values(UserRole).includes(role)) {
        return res.status(400).json({ message: 'Rôle invalide' });
      }
      updateData.role = role;
    }

    console.log('Données à mettre à jour:', updateData);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select('-password -otpSecret');

    console.log('Utilisateur mis à jour:', updatedUser);

    res.status(200).json({ 
      message: 'Utilisateur mis à jour avec succès',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const userId = req.params.id;
    
    if (
      req.user.role !== UserRole.ADMIN && 
      req.user._id.toString() !== userId
    ) {
      return res.status(403).json({ message: 'Non autorisé à supprimer cet utilisateur' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (user.role === UserRole.ADMIN && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Non autorisé à supprimer un administrateur' });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ 
      message: 'Utilisateur supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ message: error.message });
  }
}; 