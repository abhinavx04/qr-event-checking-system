import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin'  // admin and organizer are the same
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    studentId: {
      type: String,
      required: function(this: any) {
        return this.role === UserRole.STUDENT;
      },
      unique: true,
      sparse: true,  // allows null/undefined if not required
      trim: true
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.STUDENT
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);