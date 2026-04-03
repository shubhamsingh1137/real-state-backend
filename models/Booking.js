const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bookingDate: { type: Date, default: Date.now },
  bookingAmount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  agreementDate: { type: Date },
  agreementFile: { type: String, default: '' },
  commission: { type: Number, default: 0 },
  commissionPaid: { type: Boolean, default: false },
  notes: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
