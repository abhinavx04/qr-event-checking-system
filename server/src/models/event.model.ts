import mongoose, { Document, Schema } from 'mongoose';

export enum EventStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  venue: string;
  capacity: number;
  registeredCount: number;
  status: EventStatus;
  registeredStudents: Schema.Types.ObjectId[];
  organizer: Schema.Types.ObjectId;
  qrCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
      validate: {
        validator: function(value: Date) {
          return value >= new Date();
        },
        message: 'Event date must be in the future'
      }
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time in HH:MM format']
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time in HH:MM format']
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1']
    },
    registeredCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: Object.values(EventStatus),
      default: EventStatus.UPCOMING
    },
    registeredStudents: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    qrCode: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for checking if event is full
eventSchema.virtual('isFull').get(function() {
  return this.registeredCount >= this.capacity;
});

// Pre-save middleware to update status based on date
eventSchema.pre('save', function(next) {
  const now = new Date();
  const eventDate = new Date(this.date);
  const [eventStartHours, eventStartMinutes] = this.startTime.split(':').map(Number);
  const [eventEndHours, eventEndMinutes] = this.endTime.split(':').map(Number);
  
  eventDate.setHours(eventStartHours, eventStartMinutes);
  const eventEndDate = new Date(this.date);
  eventEndDate.setHours(eventEndHours, eventEndMinutes);

  if (now < eventDate) {
    this.status = EventStatus.UPCOMING;
  } else if (now >= eventDate && now <= eventEndDate) {
    this.status = EventStatus.ONGOING;
  } else {
    this.status = EventStatus.COMPLETED;
  }

  next();
});

export const Event = mongoose.model<IEvent>('Event', eventSchema);