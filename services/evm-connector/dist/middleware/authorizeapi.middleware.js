import dotenv from "dotenv";
dotenv.config();
export var authorizeAPI = function(req, res, next) {
    if (req.header("X-API-KEY") !== process.env.API_KEY) {
        res.status(401).json({});
    } else {
        next();
    }
};
