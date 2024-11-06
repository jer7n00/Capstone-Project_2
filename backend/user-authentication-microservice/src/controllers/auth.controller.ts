import { Request, Response } from 'express';
import * as userService from '../services/auth.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';


// Add a new user
export const addUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
};

// Get user by ID
export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
};

// Update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedUser = await userService.updateUser(req.params.id, req.body);
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
};

// Delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedUser = await userService.deleteUser(req.params.id);
        if (!deletedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'user removed' });
        //send();
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
};


export const patchUserProfileCompletion = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;
  
    try {
      const updatedUser = await userService.updateUser(req.params.id, { playerProfileCompleted: true });
      if (!updatedUser) {
         res.status(404).json({ message: 'User not found' });
         return
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user profile completion', error });
    }
  };





// controllers/authController.ts


export const register = async (req: Request, res: Response) => {
    
    const { u_id,username,name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email.' });
      return;
    }
    else
    {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ u_id,username, name,email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
    return ;}
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
         res.status(401).json({ message: 'Invalid credentials' });
         return;
    }
    const token = jwt.sign({ id: user.u_id, role: user.role }, "petdryfuygiuhi" as string, { expiresIn: '1h' });
    res.json({ token,user });
    return;
};


export const validateToken = (req: Request, res: Response): void => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
         res.status(401).json({ message: 'Access token required' });
         return;
    }

    jwt.verify(token, "petdryfuygiuhi" as string, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        // Return the user information or any relevant data you need
        res.status(200).json({ user: decoded });
    });
};




// import { Request, Response } from 'express';
// import { AuthService } from '../services/auth.service';

// export class AuthController {
//   static async register(req: Request, res: Response) {
//     const { name, email, password, role } = req.body;
//     try {
//       const user = await AuthService.register(name, email, password, role);
//       res.status(201).json({ user });
//     } catch (error) {
//       res.status(400).json({ message: (error as Error).message });
//     }
//   }

//   static async login(req: Request, res: Response) {
//     const { email, password } = req.body;
//     try {
//       const { user, token } = await AuthService.login(email, password);
//       res.status(200).json({ user, token });
//     } catch (error) {
//       res.status(401).json({ message: (error as Error).message });
//     }
//   }
// }
