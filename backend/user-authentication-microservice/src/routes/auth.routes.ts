import { Router } from 'express';
import { addUser, getUserDetails,patchUserProfileCompletion, updateUser, deleteUser, getAllUsers,register, login , validateToken} from '../controllers/auth.controller';

const router = Router();

router.post('/', addUser);
router.get('/get/:id', getUserDetails);
router.put('/get/:id', updateUser);
router.patch('/get/:id', patchUserProfileCompletion);

router.delete('/get/:id', deleteUser);
router.get('/', getAllUsers);
router.post('/register', register);
router.post('/login', login);
router.get('/validateToken', validateToken);

export default router;









// import { Router } from 'express';
// import { AuthController } from '../controllers/auth.controller';
// import { authenticateToken } from '../middleware/auth.middleware';
// import { AuthenticatedRequest } from '../middleware/auth.middleware';


// const router = Router();

// router.post('/register', AuthController.register);
// router.post('/login', AuthController.login);

// // Example of a protected route
// router.get('/profile', authenticateToken, (req, res) => {
// const user = (req as AuthenticatedRequest).user;
//   res.json(user);
// });

// export default router;
