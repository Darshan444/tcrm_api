// Controllers/user.js
import jwt from 'jsonwebtoken';
import { UserModel } from '../Models/User.js';

const userModel = new UserModel();

export class UserController {
    
    async login(req, res) {
        try {
            const data = await userModel.login(req.body);

            if (data.status === STATUS_CODES.NOT_ALLOWED) {
                return res.handler.forbidden(undefined, data.message);
            }

            if (data.status === STATUS_CODES.CONFLICT) {
                return res.handler.conflict(undefined, data.message);
            }

            if (data.status === STATUS_CODES.NOT_FOUND) {
                return res.handler.notFound(undefined, data.message);
            }

            // Generate JWT token
            const token = jwt.sign(
                { 
                    id: data.user_id, 
                    email: data.email,
                    user_type: data.user_type 
                },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );

            // Update last login
            await userModel.updateLastLogin(data.user_id);

            const responseData = {
                ...data,
                token,
                expires_in: process.env.JWT_EXPIRES_IN || '24h'
            };

            res.handler.success(responseData, STATUS_MESSAGES.LOGIN.LOGIN_SUCCESS);
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    async register(req, res) {
        try {
            const data = await userModel.register(req.body);

            if (data.status && data.status !== STATUS_CODES.CREATED) {
                return res.handler.custom(data.status, data.message);
            }

            // Generate JWT token for new user
            const token = jwt.sign(
                { 
                    id: data.id, 
                    email: data.email,
                    user_type: data.user_type 
                },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );

            const responseData = {
                user: data,
                token,
                expires_in: process.env.JWT_EXPIRES_IN || '24h'
            };

            res.handler.created(responseData, 'User registered successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    async getProfile(req, res) {
        try {
            const data = await userModel.getProfile(req.user.id);
            res.handler.success(data, 'Profile fetched successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    async updateProfile(req, res) {
        try {
            const data = await userModel.updateProfile(req.user.id, req.body);
            res.handler.success(data, 'Profile updated successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    async changePassword(req, res) {
        try {
            const { current_password, new_password } = req.body;
            const data = await userModel.changePassword(req.user.id, current_password, new_password);

            if (data.status && data.status !== STATUS_CODES.SUCCESS) {
                return res.handler.custom(data.status, data.message);
            }

            res.handler.success(undefined, 'Password changed successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    async logout(req, res) {
        try {
            // In a real app, you might want to blacklist the token
            // For now, just send success response
            res.handler.success(undefined, 'Logged out successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    async refreshToken(req, res) {
        try {
            const token = jwt.sign(
                { 
                    id: req.user.id, 
                    email: req.user.email,
                    user_type: req.user.user_type 
                },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );

            res.handler.success({ 
                token, 
                expires_in: process.env.JWT_EXPIRES_IN || '24h' 
            }, 'Token refreshed successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    // Admin routes
    async getAllUsers(req, res) {
        try {
            const data = await userModel.getAllUsers(req.query);
            res.handler.success(data, 'Users fetched successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    async getUserById(req, res) {
        try {
            const data = await userModel.getUserById(req.params.id);
            
            if (!data) {
                return res.handler.notFound(undefined, 'User not found');
            }
            
            res.handler.success(data, 'User details fetched successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    async updateUser(req, res) {
        try {
            const data = await userModel.updateUser(req.params.id, req.body);
            
            if (data.status && data.status !== STATUS_CODES.SUCCESS) {
                return res.handler.custom(data.status, data.message);
            }
            
            res.handler.success(data, 'User updated successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    async deleteUser(req, res) {
        try {
            const data = await userModel.deleteUser(req.params.id);
            
            if (data.status && data.status !== STATUS_CODES.SUCCESS) {
                return res.handler.custom(data.status, data.message);
            }
            
            res.handler.success(undefined, 'User deleted successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }
}