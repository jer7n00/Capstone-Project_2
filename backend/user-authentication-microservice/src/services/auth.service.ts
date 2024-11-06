//import bcrypt from 'bcryptjs';
//import jwt from 'jsonwebtoken';
//import { User } from '../models/user.model';
//import { config } from '../config/config';
import User, { IUser } from '../models/user.model'


export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const user = new User(userData);
  return await user.save();
};

export const getUserById = async (userId: string): Promise<IUser | null> => {
  return await User.findOne({ u_id: userId });
};

export const updateUser = async (userId: string, updateData: Partial<IUser>): Promise<IUser | null> => {
  return await User.findOneAndUpdate({ u_id: userId }, updateData, { new: true });
};

export const deleteUser = async (userId: string): Promise<IUser | null> => {
  return await User.findOneAndDelete({ u_id: userId });
};



export const getAllUsers = async (): Promise<IUser[]> => {
  return await User.find();
};




// export class AuthService {
//   static async register(name: string, email: string, password: string, role: string) {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ name, email, password: hashedPassword, role });
//     return user.save();
//   }

//   static async login(email: string, password: string) {
//     const user = await User.findOne({ email });
//     if (!user) throw new Error('User not found');

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) throw new Error('Invalid credentials');

//     const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, {
//       expiresIn: config.jwtExpiration,
//     });

//     return { user, token };
//   }
// }
