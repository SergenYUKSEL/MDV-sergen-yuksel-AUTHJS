const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { User, UserRole } = require('../src/models/User');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/civelampus';

const adminData = {
  username: 'admin',
  email: 'admin@civelampus.fr',
  password: 'adminpass123',
  role: UserRole.ADMIN
};

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connexion à MongoDB établie');

    const existingAdmin = await User.findOne({ role: UserRole.ADMIN });
    if (existingAdmin) {
      console.log('Un administrateur existe déjà:');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Nom d'utilisateur: ${existingAdmin.username}`);
      await mongoose.connection.close();
      return;
    }

    const admin = new User(adminData);
    await admin.save();

    console.log('Administrateur créé avec succès:');
    console.log(`Email: ${adminData.email}`);
    console.log(`Nom d'utilisateur: ${adminData.username}`);
    console.log(`Mot de passe: ${adminData.password}`);
    console.log('Important: Changez le mot de passe après la première connexion!');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
    process.exit(1);
  }
}

createAdmin(); 