import { Router } from 'express';
import { login, register, logout, getMe } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const authRouter = Router();

// Public routes
authRouter.post('/login', login);
authRouter.post('/register', register);

// Protected routes
authRouter.get('/logout', logout);
authRouter.get('/me', authenticate, getMe);

export default authRouter;