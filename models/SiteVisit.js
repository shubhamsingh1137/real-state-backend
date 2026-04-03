const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledDate: { type: Date, required: true },
  scheduledTime: { type: String },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled'
  },
  remarks: { type: String, default: '' },
  feedback: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('SiteVisit', visitSchema);
