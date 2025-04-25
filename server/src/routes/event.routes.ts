import express from 'express';
import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  registerForEvent,
  cancelRegistration
} from '../controllers/event.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/')
  .post(createEvent)
  .get(getEvents);

router.route('/:id')
  .get(getEvent)
  .put(updateEvent);

router.route('/:id/register')
  .post(registerForEvent)
  .delete(cancelRegistration);

export default router;