import EmergencyReport from '../models/EmergencyReport.js';

// @desc    Create a new emergency report
// @route   POST /api/emergencies
// @access  Private (Citizen, Volunteer, Admin)
export const createEmergency = async (req, res) => {
  try {
    const { title, description, disasterType, severity, images, location } = req.body;

    const report = new EmergencyReport({
      title,
      description,
      disasterType,
      severity,
      images,
      location,
      reportedBy: req.user._id,
    });

    const createdReport = await report.save();

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.emit('newEmergency', createdReport);

    res.status(201).json(createdReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all emergencies
// @route   GET /api/emergencies
// @access  Public
export const getEmergencies = async (req, res) => {
  try {
    const reports = await EmergencyReport.find({})
      .populate('reportedBy', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update emergency status
// @route   PUT /api/emergencies/:id/status
// @access  Private (Volunteer, Admin)
export const updateEmergencyStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const report = await EmergencyReport.findById(req.params.id);

    if (report) {
      report.status = status;
      const updatedReport = await report.save();

      // Emit socket event
      const io = req.app.get('io');
      io.emit('emergencyStatusUpdated', updatedReport);

      res.json(updatedReport);
    } else {
      res.status(404).json({ message: 'Emergency report not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an emergency report
// @route   DELETE /api/emergencies/:id
// @access  Private
export const deleteEmergency = async (req, res) => {
  try {
    const report = await EmergencyReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Emergency report not found' });
    }

    await report.deleteOne();
    
    // Emit socket event to notify clients it was deleted
    const io = req.app.get('io');
    io.emit('emergencyDeleted', req.params.id);

    res.json({ message: 'Report removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
