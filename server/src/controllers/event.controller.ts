import { Request, Response } from 'express';
import { Event, EventStatus } from '../models/event.model';
import { User } from '../models/user.model';

// Create new event
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      venue,
      capacity
    } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      startTime,
      endTime,
      venue,
      capacity,
      organizer: req.user._id
    });

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all events
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await Event.find()
      .populate('organizer', 'name email')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get single event
export const getEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('registeredStudents', 'name email studentId');

    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update event
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found'
      });
      return;
    }

    // Check if user is organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
      res.status(401).json({
        success: false,
        message: 'Not authorized to update this event'
      });
      return;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: updatedEvent
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Register for event
export const registerForEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found'
      });
      return;
    }

    // Check if event is full
    if (event.registeredCount >= event.capacity) {
      res.status(400).json({
        success: false,
        message: 'Event is full'
      });
      return;
    }

    // Check if user is already registered
    if (event.registeredStudents.includes(req.user._id)) {
      res.status(400).json({
        success: false,
        message: 'Already registered for this event'
      });
      return;
    }

    event.registeredStudents.push(req.user._id);
    event.registeredCount += 1;
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Successfully registered for event',
      data: event
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Cancel event registration
export const cancelRegistration = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found'
      });
      return;
    }

    // Check if user is registered
    if (!event.registeredStudents.includes(req.user._id)) {
      res.status(400).json({
        success: false,
        message: 'Not registered for this event'
      });
      return;
    }

    const index = event.registeredStudents.indexOf(req.user._id);
    event.registeredStudents.splice(index, 1);
    event.registeredCount -= 1;
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Successfully cancelled registration',
      data: event
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};