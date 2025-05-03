import FrecuentClient from '../frecuentClients/frecuentClient.model.js';
import Client from '../frecuentClients/client.model.js';

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

export const existingClient = async (req, res, next) => {
    try {
        const { email } = req.body;
        const client = await Client.findOne({ email: email.trim()});
        if (client) {
            return res.status(400).json({
                success: false,
                msg: 'Client already exists'
            });
        }
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error validating Client',
            error: error.message
        })
    }
};

export const validateUniquePhoneNumberClient = async (req, res, next) => {
    try {
        const { phoneNumber } = req.body;
        const existingClient = await Client.findOne({ phoneNumber });

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

export const validationsAddFrecuentClient = async (req, res, next) => {
    
    try {

        const { email } = req.body;

        const client = await Client.findOne({ email: email.trim() });

        if (!client) {
            return res.status(404).json({
                success: false,
                msg: 'Client not found in regular clients'
            });
        }

        if (client.email !== email) {
            return res.status(400).json({
                success: false,
                msg: 'Email does not match with registered client'
            });
        }

        if (client.keeperExistProductRecord.length <= 10) {
            return res.status(400).json({
                success: false,
                msg: 'Client must have more than 10 exit records to become frequent'
            });
        }

        req.clientInstance = client;

        next();

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error validating client for frequent registration',
            error: error.message
        });
        
    }
};
