import VolunteerTask from '../models/VolunteerTask.js';
import EmergencyReport from '../models/EmergencyReport.js';

// @desc    Assign a volunteer to an emergency
// @route   POST /api/tasks/assign
// @access  Private (Admin)
export const assignTask = async (req, res) => {
  try {
    const { volunteerId, emergencyId, instructions } = req.body;

    const task = new VolunteerTask({
      volunteer: volunteerId,
      emergency: emergencyId,
      instructions,
    });

    const createdTask = await task.save();

    // Update emergency with assigned volunteer
    await EmergencyReport.findByIdAndUpdate(emergencyId, {
      $push: { assignedVolunteers: volunteerId },
      status: 'Responding'
    });

    // Notify volunteer via socket
    const io = req.app.get('io');
    io.to(volunteerId.toString()).emit('newTaskAssigned', createdTask);

    res.status(201).json(createdTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get tasks for logged in volunteer
// @route   GET /api/tasks/my-tasks
// @access  Private (Volunteer)
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await VolunteerTask.find({ volunteer: req.user._id })
      .populate('emergency')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private (Volunteer)
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await VolunteerTask.findById(req.params.id);

    if (task) {
      task.status = status;
      const updatedTask = await task.save();

      // Notify admin
      const io = req.app.get('io');
      io.emit('taskStatusUpdated', updatedTask);

      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
