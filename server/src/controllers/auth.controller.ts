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
    const { name, identifier, studentId, password, role } = req.body;

    // Create user with conditional fields based on role
    const userData = {
      name,
      email: identifier,
      password,
      role,
      ...(role === UserRole.STUDENT ? { studentId } : {})  // Only include studentId for students
    };

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [
        { email: identifier },
        ...(studentId ? [{ studentId }] : [])
      ]
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: existingUser.email === identifier 
          ? 'Email already registered' 
          : 'Student ID already registered'
      });
      return;
    }

    const user = await User.create(userData);
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
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    // Validate input
    if (!identifier || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide email/student ID and password'
      });
      return;
    }

    // Check user exists by either email or studentId
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { studentId: identifier }
      ]
    }).select('+password');

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
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in user'
    });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // User is already attached to req by the protect middleware
    const user = req.user;

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Modified response to match the format
    res.status(200).json({
      success: true,
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
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving user data'
    });
  }
};