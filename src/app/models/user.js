const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
  local: {
    email: String,
    password: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    password: String
  }
});

// usa el bcrypt para generar un hash
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// valida si la contraseña es igual a la que se registro
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password);
};

// crea el modelo user, con la informacion de este
module.exports = mongoose.model('User', userSchema);
