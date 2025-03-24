
import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  id: string;
  username: string;
  email: string;
  password: string; // This will be hashed
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserInput {
  username: string;
  email: string;
  password: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  token: string;
}
