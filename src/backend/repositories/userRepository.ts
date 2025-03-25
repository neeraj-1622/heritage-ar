import { Db, ObjectId } from 'mongodb';
import { User, UserInput } from '../models/User';
import bcrypt from 'bcryptjs';

export class UserRepository {
  private db: Db;
  private collection = 'users';

  constructor(db: Db) {
    this.db = db;
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.db.collection(this.collection).findOne({ email });
      return user as unknown as User;
    } catch (error) {
      console.error(`Error finding user with email ${email}:`, error);
      return null;
    }
  }

  private validateUserInput(userData: UserInput): string | null {
    if (!userData.email || !userData.email.includes('@')) {
      return 'Invalid email format';
    }
    if (!userData.username || userData.username.length < 3) {
      return 'Username must be at least 3 characters long';
    }
    if (!userData.password || userData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return null;
  }

  async create(userData: UserInput): Promise<User> {
    // Validate user input
    const validationError = this.validateUserInput(userData);
    if (validationError) {
      throw new Error(validationError);
    }

    // Check if email already exists
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser: User = {
      ...userData,
      id: new ObjectId().toString(),
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      await this.db.collection(this.collection).insertOne(newUser);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await this.db.collection(this.collection).findOne({ id });
      return user as unknown as User;
    } catch (error) {
      console.error(`Error finding user with ID ${id}:`, error);
      return null;
    }
  }
}
