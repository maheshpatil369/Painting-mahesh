const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tokenHash: { type: String, required: true }, // hash of refresh token
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  revoked: { type: Boolean, default: false },
  replacedByToken: { type: String }, // optionally store id of replacing token
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
