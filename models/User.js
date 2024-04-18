const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
});

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.hashedPassword);  // Assuming bcrypt is used for hashing
}

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User', userSchema)

module.exports = User;