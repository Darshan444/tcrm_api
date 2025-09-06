
import { EncryptionHandler } from '../Configs/encrypt.js';
const encrypt = new EncryptionHandler();

export class User {
    async login(data) {
        // let generateCustomToken = require('./../Utils/helpers').generateCustomToken;
        let condition = {
            [SEQUELIZE.Op.or]: [
                {
                    email: data.username
                },
                {
                    username: data.username
                }
            ],
            status: STATUS.ACTIVE
        };
        // if (data.role_id) condition['role_id'] = data.role_id;

        let user = await userSchema.findOne({
            where: condition,
            // include: [
            //     {
            //         model: timezoneSchema,
            //         attributes: ['id', 'zone', 'offset', 'country_name']
            //     },
            //     {
            //         attributes: ['id'],
            //         model: roleSchema,
            //         include: {
            //             model: moduleSchema,
            //             attributes: { exclude: ['createdAt', 'updatedAt'] },
            //             through: {
            //                 attributes: ['id', 'read_access', 'write_access', 'delete_access']
            //             }
            //         }
            //     }
            // ]
        });

        if (!user) {
            return {
                status: STATUS_CODES.NOT_FOUND,
                message: STATUS_MESSAGES.LOGIN.USER_NOT_FOUND
            };
        }

        // if (!user.dataValues.is_email_verified) {
        //     return {
        //         status: STATUS_CODES.NOT_ALLOWED,
        //         message: STATUS_MESSAGES.USER.NOT_VERIFIED
        //     };
        // }

        if (!user.dataValues.status) {
            return {
                status: STATUS_CODES.NOT_ALLOWED,
                message: STATUS_MESSAGES.LOGIN.USER_INACTIVE
            };
        }

        //if role is designer then not allow login in admin panel
        // if (!data.role_id && user.role_id === 2) {
        // if (!data.role_id && user.user_type === USER_TYPES.DESIGNER) {
        //     return {
        //         status: STATUS_CODES.NOT_ALLOWED
        //     };
        // }

        if (data.password) {
            let isValid = encrypt.compareEncryptEntity(data.password, user.dataValues.password);
            if (!isValid) {
                return {
                    status: STATUS_CODES.CONFLICT,
                    message: STATUS_MESSAGES.LOGIN.PASSWORD_MISMATCH
                };
            }

            // let userToken = await userTokenSchema.findOne({
            //     where: {
            //         user_id: user.id
            //     }
            // });

            // let token = generateCustomToken();
            // data.access_token = token;
            data.user_id = user.id;

            // if (userToken) {
            //     await userToken.update(data);
            // } else {
            // await userTokenSchema.create(data);
            // }

            return {
                // token,
                role_id: user.role_id,
                user_type: user.user_type,
                // default_timezone: user.timezone.zone,
                // modules: user.dataValues.role.dataValues.modules
            };
        } else {
            return {
                status: STATUS_CODES.NOT_ALLOWED,
                message: STATUS_MESSAGES.LOGIN.PASSWORD_MISMATCH
            };
        }
    }
}