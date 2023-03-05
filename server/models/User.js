const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, required: true, default: 'general' },
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;