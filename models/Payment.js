const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentMode: {
    type: String,
    enum: ['cash', 'cheque', 'bank_transfer', 'upi', 'card', 'other'],
    default: 'bank_transfer'
  },
  transactionId: { type: String, default: '' },
  type: {
    type: String,
    enum: ['booking', 'emi', 'full_payment', 'commission', 'other'],
    default: 'emi'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed'
  },
  invoiceNumber: { type: String },
  dueDate: { type: Date },
  notes: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Auto-generate invoice number
paymentSchema.pre('save', async function (next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model('Payment').countDocuments();
    this.invoiceNumber = `INV-${Date.now()}-${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
