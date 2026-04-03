const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  note: String,
  date: { type: Date, default: Date.now },
  nextFollowUp: Date,
  doneBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, required: true },
  source: {
    type: String,
    enum: ['website', 'referral', 'walk-in', 'social_media', 'advertisement', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'follow-up', 'site_visit', 'negotiation', 'booked', 'lost'],
    default: 'new'
  },
  interestedIn: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  budget: { type: Number },
  notes: { type: String, default: '' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  followUps: [followUpSchema],
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
