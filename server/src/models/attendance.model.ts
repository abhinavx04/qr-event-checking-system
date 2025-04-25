import mongoose, { Document, Schema } from 'mongoose';

export interface IAttendance extends Document {
  event: Schema.Types.ObjectId;
  student: Schema.Types.ObjectId;
  checkInTime: Date;
  status: 'present' | 'late';
  qrCode: string;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    checkInTime: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['present', 'late'],
      required: true
    },
    qrCode: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index to prevent multiple check-ins
attendanceSchema.index({ event: 1, student: 1 }, { unique: true });

export const Attendance = mongoose.model<IAttendance>('Attendance', attendanceSchema);