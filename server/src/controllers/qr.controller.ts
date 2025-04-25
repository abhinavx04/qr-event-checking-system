import { Request, Response } from 'express';
import { Event } from '../models/event.model';
import { Attendance } from '../models/attendance.model';
import { QRService } from '../services/qr.service';

export const generateEventQR = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.eventId);

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
        message: 'Not authorized to generate QR code for this event'
      });
      return;
    }

    const qrCode = await QRService.generateEventQR(event._id.toString(), event.date);
    
    // Update event with new QR code
    event.qrCode = qrCode;
    await event.save();

    res.status(200).json({
      success: true,
      data: {
        qrCode,
        eventId: event._id
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const verifyAndCheckIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { qrData } = req.body;
    const eventId = req.params.eventId;

    // Verify QR code
    const isValid = await QRService.verifyQRCode(qrData, eventId);

    if (!isValid) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired QR code'
      });
      return;
    }

    const event = await Event.findById(eventId);

    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found'
      });
      return;
    }

    // Check if student is registered for the event
    if (!event.registeredStudents.includes(req.user._id)) {
      res.status(400).json({
        success: false,
        message: 'Not registered for this event'
      });
      return;
    }

    // Check if already checked in
    const existingAttendance = await Attendance.findOne({
      event: eventId,
      student: req.user._id
    });

    if (existingAttendance) {
      res.status(400).json({
        success: false,
        message: 'Already checked in for this event'
      });
      return;
    }

    // Calculate if student is late
    const eventDate = new Date(event.date);
    const [hours, minutes] = event.startTime.split(':').map(Number);
    eventDate.setHours(hours, minutes);
    const status = new Date() > eventDate ? 'late' : 'present';

    // Mark attendance
    const attendance = await Attendance.create({
      event: eventId,
      student: req.user._id,
      status,
      qrCode: qrData
    });

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getEventAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.eventId);

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
        message: 'Not authorized to view attendance'
      });
      return;
    }

    const attendance = await Attendance.find({ event: req.params.eventId })
      .populate('student', 'name email studentId')
      .sort({ checkInTime: 1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};