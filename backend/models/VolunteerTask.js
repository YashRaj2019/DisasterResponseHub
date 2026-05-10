import mongoose from 'mongoose';

const volunteerTaskSchema = new mongoose.Schema(
  {
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    emergency: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'EmergencyReport',
    },
    taskStatus: {
      type: String,
      required: true,
      enum: ['Pending', 'Accepted', 'En Route', 'On Site', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    notes: {
      type: String,
    }
  },
  { timestamps: true }
);

const VolunteerTask = mongoose.model('VolunteerTask', volunteerTaskSchema);

export default VolunteerTask;
