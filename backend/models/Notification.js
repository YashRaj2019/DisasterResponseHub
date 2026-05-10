import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['EmergencyAlert', 'TaskAssignment', 'SystemMessage', 'StatusUpdate'],
      default: 'SystemMessage',
    },
    readStatus: {
      type: Boolean,
      default: false,
    },
    relatedEmergency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmergencyReport',
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
