
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

  async create(userData: UserInput): Promise<User> {
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

    await this.db.collection(this.collection).insertOne(newUser);
    return newUser;
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
