const Property = require('../models/Property');

exports.getProperties = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.city) filter['location.city'] = new RegExp(req.query.city, 'i');
    if (req.query.minPrice) filter.price = { ...filter.price, $gte: Number(req.query.minPrice) };
    if (req.query.maxPrice) filter.price = { ...filter.price, $lte: Number(req.query.maxPrice) };
    if (req.query.search) {
      filter.$or = [
        { title: new RegExp(req.query.search, 'i') },
        { 'location.city': new RegExp(req.query.search, 'i') },
        { 'location.address': new RegExp(req.query.search, 'i') }
      ];
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      Property.find(filter).populate('assignedAgent', 'name email').populate('createdBy', 'name').sort('-createdAt').skip(skip).limit(limit),
      Property.countDocuments(filter)
    ]);
    res.json({ success: true, count: properties.length, total, page, pages: Math.ceil(total / limit), properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('assignedAgent', 'name email phone').populate('createdBy', 'name');
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProperty = async (req, res) => {
  try {
    const property = await Property.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
