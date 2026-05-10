import Shelter from '../models/Shelter.js';

// @desc    Create a new shelter
// @route   POST /api/shelters
// @access  Private (Admin)
export const createShelter = async (req, res) => {
  try {
    const { shelterName, address, capacity, availability, contactPhone, facilities, geoLocation } = req.body;

    const shelter = new Shelter({
      shelterName,
      address,
      capacity,
      availability,
      contactPhone,
      facilities,
      geoLocation,
    });

    const createdShelter = await shelter.save();
    res.status(201).json(createdShelter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all shelters
// @route   GET /api/shelters
// @access  Public
export const getShelters = async (req, res) => {
  try {
    const shelters = await Shelter.find({});
    res.json(shelters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update shelter availability
// @route   PUT /api/shelters/:id/availability
// @access  Private (Admin, Volunteer)
export const updateShelterAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const shelter = await Shelter.findById(req.params.id);

    if (shelter) {
      shelter.availability = availability;
      const updatedShelter = await shelter.save();
      res.json(updatedShelter);
    } else {
      res.status(404).json({ message: 'Shelter not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
