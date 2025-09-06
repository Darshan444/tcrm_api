export const appRoutes = (app) => {
    app.get("/", (req, res) => {
        res.status(STATUS_CODES.SUCCESS).send("Welcome to " + process.env.PROJECT_NAME);
    });

    
};