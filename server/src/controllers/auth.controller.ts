import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/user.model';

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '24h'
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, studentId, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { studentId }] 
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Student ID already registered'
      });
      return;
    }

    // Create user
    const user = await User.create({
      name,
      email,
      studentId,
      password,
      role: UserRole.STUDENT
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          studentId: user.studentId,
          role: user.role,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
      return;
    }

    // Check user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          studentId: user.studentId,
          role: user.role,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user!._id,
          name: user!.name,
          email: user!.email,
          studentId: user!.studentId,
          role: user!.role,
          createdAt: user!.createdAt
        }
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};