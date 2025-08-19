import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  engine: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
  gearbox: {
    type: String,
    required: true
  },
  tinting: {
    type: String,
    enum: ['Ha', 'Yo\'q'],
    default: 'Yo\'q'
  },
  description: {
    type: String,
    trim: true
  },
  images: {
    exterior: String,
    interior: String,
    modelType: String
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
carSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Car', carSchema); 