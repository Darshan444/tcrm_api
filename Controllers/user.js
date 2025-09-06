export class UserController {
    async login(req, res) {
        try {
            let data = await userModel.login(req.body)

            if (data.status === STATUS_CODES.NOT_ALLOWED) {
                res.handler.forbidden(undefined, data.message);
                return;
            }

            if (data.status === STATUS_CODES.CONFLICT) {
                res.handler.conflict(undefined, data.message);
                return;
            }

            if (data.status === STATUS_CODES.NOT_FOUND) {
                res.handler.notFound(undefined, data.message);
                return;
            }

            res.handler.success(data, STATUS_MESSAGES.LOGIN.LOGIN_SUCCESS);
        } catch (error) {
            res.handler.serverError(error)
        }
    }
}

