// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import { config } from '../config/config';

// export interface AuthenticatedRequest extends Request {
//   user?: string | jwt.JwtPayload;
// }

// export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
//   const token = req.headers['authorization']?.split(' ')[1];
//   if (!token) {
//     res.sendStatus(401);
//     return;
//   }

//   jwt.verify(token, config.jwtSecret, (err, user) => {
//     if (err) {
//       res.sendStatus(403);
//       return;
//     }
//     req.user = user;
//     next();
//   });
// };
