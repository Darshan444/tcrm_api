// Routes/index.js
import inquiryRoutes from './inquiry/inquiryRoute.js';
import userRoutes from './user/userRoute.js';

export const appRoutes = (app) => {
    app.get("/", (req, res) => {
        res.status(STATUS_CODES.SUCCESS).send("Welcome to " + process.env.PROJECT_NAME);
    });

    app.use("/api/" + process.env.API_VERSION + "/users", userRoutes);
    app.use("/api/" + process.env.API_VERSION + "/inquiries", inquiryRoutes);
};


