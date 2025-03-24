
import { Db } from 'mongodb';
import { User, UserInput, UserLoginInput, UserResponse } from '../models/User';
import { UserRepository } from '../repositories/userRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class UserService {
  private userRepository: UserRepository;
  private JWT_SECRET: string;

  constructor(db: Db) {
    this.userRepository = new UserRepository(db);
    this.JWT_SECRET = process.env.JWT_SECRET || 'heritageAR-secret-key';
  }

  async registerUser(userData: UserInput): Promise<UserResponse | null> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      return null;
    }

    // Create new user
    const newUser = await this.userRepository.create(userData);
    
    // Generate JWT token
    const token = this.generateToken(newUser);
    
    return {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      token
    };
  }

  async loginUser(credentials: UserLoginInput): Promise<UserResponse | null> {
    // Find user by email
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      return null;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Generate JWT token
    const token = this.generateToken(user);
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      token
    };
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { id: string };
      return await this.userRepository.findById(decoded.id);
    } catch (error) {
      return null;
    }
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, email: user.email },
      this.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }
}
