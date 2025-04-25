import express from 'express';
import {
  generateEventQR,
  verifyAndCheckIn,
  getEventAttendance
} from '../controllers/qr.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Protect all routes
router.use(protect);

// Generate QR code for event (organizer only)
router.post('/generate/:eventId', generateEventQR);

// Verify QR code and mark attendance
router.post('/verify/:eventId', verifyAndCheckIn);

// Get event attendance (organizer only)
router.get('/attendance/:eventId', getEventAttendance);

export default router;