import mongoose from 'mongoose';

const shelterSchema = new mongoose.Schema(
  {
    shelterName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    availability: {
      type: Number,
      required: true,
    },
    contactPhone: {
      type: String,
    },
    facilities: [String],
    geoLocation: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    status: {
      type: String,
      enum: ['Active', 'Full', 'Closed'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

shelterSchema.index({ geoLocation: '2dsphere' });

const Shelter = mongoose.model('Shelter', shelterSchema);

export default Shelter;
