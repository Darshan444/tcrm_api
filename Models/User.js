// Models/User.js
import { EncryptionHandler } from '../Configs/encrypt.js';
import db from '../Database/Schema/index.js';
import { Op } from 'sequelize';

const { user } = db;
const encrypt = new EncryptionHandler();

export class UserModel {
    async login(data) {
        const condition = {
            [Op.or]: [
                { email: data.username },
                { username: data.username }
            ],
            status: true
        };

        const foundUser = await user.findOne({
            where: condition,
            attributes: ['id', 'name', 'email', 'username', 'password', 'user_type', 'status', 'is_email_verified']
        });

        if (!foundUser) {
            return {
                status: STATUS_CODES.NOT_FOUND,
                message: 'User not found with this email or username'
            };
        }

        if (!foundUser.is_email_verified) {
            return {
                status: STATUS_CODES.NOT_ALLOWED,
                message: 'Please verify your email address first'
            };
        }

        if (!foundUser.status) {
            return {
                status: STATUS_CODES.NOT_ALLOWED,
                message: 'Your account has been deactivated. Please contact admin.'
            };
        }

        if (data.password) {
            const isValidPassword = encrypt.compareEncryptEntity(data.password, foundUser.password);
            if (!isValidPassword) {
                return {
                    status: STATUS_CODES.CONFLICT,
                    message: 'Invalid password'
                };
            }

            return {
                user_id: foundUser.id,
                name: foundUser.name,
                email: foundUser.email,
                username: foundUser.username,
                user_type: foundUser.user_type
            };
        } else {
            return {
                status: STATUS_CODES.NOT_ALLOWED,
                message: 'Password is required'
            };
        }
    }

    async register(data) {
        // Check if user already exists
        const existingUser = await user.findOne({
            where: {
                [Op.or]: [
                    { email: data.email },
                    { username: data.username }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.email === data.email) {
                return {
                    status: STATUS_CODES.CONFLICT,
                    message: 'User with this email already exists'
                };
            }
            if (existingUser.username === data.username) {
                return {
                    status: STATUS_CODES.CONFLICT,
                    message: 'User with this username already exists'
                };
            }
        }

        // Encrypt password
        const encryptedPassword = encrypt.encryptEntity(data.password);

        // Create user
        const userData = {
            name: data.name,
            email: data.email,
            username: data.username,
            password: encryptedPassword,
            user_type: data.user_type || 'agent',
            phone: data.phone,
            is_email_verified: data.is_email_verified || false,
            status: true
        };

        const newUser = await user.create(userData);

        // Return user data without password
        const { password, ...userResponse } = newUser.dataValues;
        return userResponse;
    }

    async getProfile(userId) {
        const userData = await user.findByPk(userId, {
            attributes: [
                'id', 'name', 'email', 'username', 'user_type', 
                'phone', 'profile_image', 'is_email_verified',
                'last_login_at', 'created_at'
            ]
        });

        if (!userData || !userData.status) {
            return null;
        }

        return userData;
    }

    async updateProfile(userId, data) {
        const userData = await user.findByPk(userId);
        if (!userData || !userData.status) {
            return {
                status: STATUS_CODES.NOT_FOUND,
                message: 'User not found'
            };
        }

        const updateData = {
            name: data.name || userData.name,
            phone: data.phone || userData.phone,
            profile_image: data.profile_image || userData.profile_image
        };

        await userData.update(updateData);

        // Return updated user without password
        const { password, ...userResponse } = userData.dataValues;
        return userResponse;
    }

    async changePassword(userId, currentPassword, newPassword) {
        const userData = await user.findByPk(userId);
        if (!userData || !userData.status) {
            return {
                status: STATUS_CODES.NOT_FOUND,
                message: 'User not found'
            };
        }

        // Verify current password
        const isValidPassword = encrypt.compareEncryptEntity(currentPassword, userData.password);
        if (!isValidPassword) {
            return {
                status: STATUS_CODES.CONFLICT,
                message: 'Current password is incorrect'
            };
        }

        // Encrypt and update new password
        const encryptedPassword = encrypt.encryptEntity(newPassword);
        await userData.update({ password: encryptedPassword });

        return { success: true };
    }

    async updateLastLogin(userId) {
        await user.update(
            { last_login_at: new Date() },
            { where: { id: userId } }
        );
    }

    // Admin methods
    async getAllUsers(queryParams = {}) {
        const {
            page = 1,
            limit = 20,
            search = '',
            user_type = '',
            status = ''
        } = queryParams;

        const offset = (page - 1) * limit;
        const where = {};

        // Search filter
        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
                { username: { [Op.iLike]: `%${search}%` } }
            ];
        }

        // Filters
        if (user_type) where.user_type = user_type;
        if (status !== '') where.status = status === 'true';

        const { rows, count } = await user.findAndCountAll({
            where,
            attributes: [
                'id', 'name', 'email', 'username', 'user_type', 
                'phone', 'status', 'is_email_verified',
                'last_login_at', 'created_at'
            ],
            order: [['created_at', 'DESC']],
            offset: parseInt(offset),
            limit: parseInt(limit)
        });

        return {
            users: rows,
            pagination: {
                current_page: parseInt(page),
                per_page: parseInt(limit),
                total: count,
                total_pages: Math.ceil(count / limit)
            }
        };
    }

    async getUserById(id) {
        const userData = await user.findByPk(id, {
            attributes: [
                'id', 'name', 'email', 'username', 'user_type', 
                'phone', 'status', 'is_email_verified',
                'last_login_at', 'created_at'
            ]
        });

        if (!userData) {
            return null;
        }

        return userData;
    }

    async updateUser(id, data) {
        const userData = await user.findByPk(id);
        if (!userData) {
            return {
                status: STATUS_CODES.NOT_FOUND,
                message: 'User not found'
            };
        }

        // Check for duplicate email/username if being updated
        if (data.email || data.username) {
            const duplicateCheck = {};
            if (data.email && data.email !== userData.email) {
                duplicateCheck.email = data.email;
            }
            if (data.username && data.username !== userData.username) {
                duplicateCheck.username = data.username;
            }

            if (Object.keys(duplicateCheck).length > 0) {
                const existingUser = await user.findOne({
                    where: {
                        [Op.and]: [
                            { id: { [Op.ne]: id } },
                            { [Op.or]: [duplicateCheck] }
                        ]
                    }
                });

                if (existingUser) {
                    return {
                        status: STATUS_CODES.CONFLICT,
                        message: 'Email or username already exists'
                    };
                }
            }
        }

        const updateData = {
            name: data.name || userData.name,
            email: data.email || userData.email,
            username: data.username || userData.username,
            user_type: data.user_type || userData.user_type,
            phone: data.phone || userData.phone,
            status: data.status !== undefined ? data.status : userData.status
        };

        // If password is provided, encrypt it
        if (data.password) {
            updateData.password = encrypt.encryptEntity(data.password);
        }

        await userData.update(updateData);

        // Return updated user without password
        const { password, ...userResponse } = userData.dataValues;
        return userResponse;
    }

    async deleteUser(id) {
        const userData = await user.findByPk(id);
        if (!userData) {
            return {
                status: STATUS_CODES.NOT_FOUND,
                message: 'User not found'
            };
        }

        // Soft delete - just deactivate the user
        await userData.update({ status: false });
        return { success: true };
    }

    async getAgentsForDropdown() {
        const agents = await user.findAll({
            where: {
                user_type: ['agent', 'manager'],
                status: true
            },
            attributes: ['id', 'name', 'user_type'],
            order: [['name', 'ASC']]
        });

        return agents;
    }

    async bulkUpdateUsers(userIds, updates) {
        const [updatedCount] = await user.update(
            updates,
            {
                where: {
                    id: { [Op.in]: userIds }
                }
            }
        );

        return { updated_count: updatedCount };
    }

    async updateUserStatus(id, status) {
        const userData = await user.findByPk(id);
        if (!userData) {
            return {
                status: STATUS_CODES.NOT_FOUND,
                message: 'User not found'
            };
        }

        await userData.update({ status });
        return { success: true };
    }
}