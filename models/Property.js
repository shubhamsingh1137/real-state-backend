const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: {
    type: String,
    enum: ['apartment', 'villa', 'plot', 'commercial', 'office', 'shop', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'sold', 'under_construction'],
    default: 'available'
  },
  price: { type: Number, required: true },
  area: { type: Number }, // sq ft
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    lat: Number,
    lng: Number
  },
  images: [{ type: String }],
  amenities: [{ type: String }],
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  floor: { type: Number, default: 0 },
  totalFloors: { type: Number, default: 0 },
  facing: { type: String, default: '' },
  parking: { type: Boolean, default: false },
  furnished: { type: String, enum: ['unfurnished', 'semi-furnished', 'fully-furnished'], default: 'unfurnished' },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
