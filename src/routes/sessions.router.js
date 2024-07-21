import express from 'express';
import { updateLastConnection } from '../middlewares/lastConnection.middleware.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  github,
  githubAuthCallback,
  recoverMail,
  resetPassword,
} from '../controllers/sessions.controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', updateLastConnection, loginUser);
router.get('/logout', updateLastConnection, logoutUser);
router.get('/github', github);
router.get('/githubcallback', githubAuthCallback);
router.get('/send-recover-mail/:email', recoverMail);
router.post('/reset-password/:token', resetPassword)
export default router;