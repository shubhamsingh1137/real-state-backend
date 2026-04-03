const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, required: true },
  alternatePhone: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  pincode: { type: String, default: '' },
  idProof: { type: String, default: '' },
  idProofFile: { type: String, default: '' },
  pan: { type: String, default: '' },
  aadhar: { type: String, default: '' },
  occupation: { type: String, default: '' },
  notes: { type: String, default: '' },
  linkedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
