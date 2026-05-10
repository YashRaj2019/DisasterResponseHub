import mongoose from 'mongoose';

const emergencyReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    disasterType: {
      type: String,
      required: true,
      enum: ['Earthquake', 'Flood', 'Fire', 'Hurricane', 'Medical', 'Other'],
    },
    severity: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High', 'Critical'],
    },
    images: [
      {
        type: String, // URLs from Cloudinary
      },
    ],
    location: {
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
      address: String,
    },
    status: {
      type: String,
      required: true,
      enum: ['Reported', 'In Progress', 'Resolved', 'False Alarm'],
      default: 'Reported',
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    assignedVolunteers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

// Add geospatial index for proximity searches
emergencyReportSchema.index({ location: '2dsphere' });

const EmergencyReport = mongoose.model('EmergencyReport', emergencyReportSchema);

export default EmergencyReport;
