// Middlewares/validation.js
import { validationResult } from 'express-validator';

export const validate = (validations) => {
    return async (req, res, next) => {
        // Run all validations
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        // Format validation errors
        const formattedErrors = errors.array().map(error => ({
            field: error.path || error.param,
            message: error.msg,
            value: error.value
        }));

        return res.handler.validationError(
            { errors: formattedErrors },
            'Validation failed'
        );
    };
};

// Middlewares/auth.js
import jwt from 'jsonwebtoken';
import db from '../Database/Schema/index.js';

const { user } = db;

export const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
        
        if (!token) {
            return res.handler.unauthorized(undefined, 'Access token is required');
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Find user in database
        const userData = await user.findByPk(decoded.id, {
            attributes: ['id', 'name', 'email', 'user_type', 'status']
        });

        if (!userData || !userData.status) {
            return res.handler.unauthorized(undefined, 'Invalid or expired token');
        }

        // Add user to request object
        req.user = userData;
        next();
    } catch (error) {
        console.log('Auth error:', error.message);
        return res.handler.unauthorized(undefined, 'Invalid or expired token');
    }
};

export const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.handler.unauthorized(undefined, 'Authentication required');
        }

        if (roles.length && !roles.includes(req.user.user_type)) {
            return res.handler.forbidden(undefined, 'Insufficient permissions');
        }

        next();
    };
};

// Optional: For development/testing - bypass auth
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
        
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            const userData = await user.findByPk(decoded.id, {
                attributes: ['id', 'name', 'email', 'user_type', 'status']
            });
            
            if (userData && userData.status) {
                req.user = userData;
            }
        }
        
        next();
    } catch (error) {
        // Continue without authentication for optional auth
        next();
    }
};