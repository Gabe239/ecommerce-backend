import userModel from '../dao/models/userModel.js';

// Middleware to update last_connection when the user logs in or logs out
export const updateLastConnection = async (req, res, next) => {
    try {
        if (req.user) {
            req.user.last_connection = new Date();

            // Save the updated user using the model
            await userModel.findByIdAndUpdate(req.user._id, { last_connection: req.user.last_connection });

            // Continue with the request
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};