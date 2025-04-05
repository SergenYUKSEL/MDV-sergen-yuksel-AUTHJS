const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserRole = {
  ETUDIANT: 'etudiant',
  INTERVENANT: 'intervenant',
  ADMIN: 'admin'
};

const userDetailsSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  dateNaissance: Date,
  adresse: String,
  telephone: String,
  formation: String,
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Le nom d'utilisateur est requis"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function() {
        return !this.googleId;
      },
      minlength: 6,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.ETUDIANT,
    },
    details: userDetailsSchema,
    otpSecret: String,
    otpEnabled: {
      type: Boolean,
      default: false,
    },
    googleId: String,
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function(next) {
  if (this.isModified('password') && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  UserRole
}; 