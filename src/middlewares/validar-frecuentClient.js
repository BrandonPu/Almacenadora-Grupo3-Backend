import FrecuentClient from '../frecuentClients/frecuentClient.model.js';

export const existingFrecuentClient = async (req, res, next) => {
    try {
        const { email } = req.body;
        const frecuent = await FrecuentClient.findOne({ email: email.trim()});
        if (frecuent) {
            return res.status(400).json({
                success: false,
                msg: 'FrequentClient already exists'
            });
        }
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error validating FrequentClient',
            error: error.message
        })
    }
};

export const validateUniquePhoneNumber = async (req, res, next) => {
    try {
        const { phoneNumber } = req.body;
        const existingClient = await FrecuentClient.findOne({ phoneNumber });

        if (existingClient) {
            return res.status(400).json({
                success: false,
                msg: 'Phone number already exists'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error validating phone number',
            error: error.message
        });
    }
};

export const confirmAction = (req, res, next) => {
    const { confirmDeletion } = req.body;

    if (confirmDeletion !== true) {
        return res.status(400).json({
            success: false,
            msg: 'Action not confirmed.'
        });
    }

    next();
};