import express from 'express';

const router = express.Router();

import { UserController } from '../Controllers/user.js';
const userController = new UserController();

// Login user
router.route('/login').post(validate([
    body('username').notEmpty().withMessage(STATUS_MESSAGES.LOGIN.VALID.USERNAME),
    body('password').notEmpty().withMessage(STATUS_MESSAGES.LOGIN.VALID.PASSWORD)
]), userController.login)