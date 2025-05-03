import { response } from "express";
import FrecuentClient from './frecuentClient.model.js';
import Client from './client.model.js';

export const addClient = async (req, res = response) => {
    try {
        const data = req.body;

        const client = new Client({
            name: data.name,
            surname: data.surname,
            email: data.email,
            phoneNumber: data.phoneNumber,
            password: data.password
        });

        await client.save();

        res.status(200).json({
            success: true,
            client
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error creating frecuent client",
            error: error.message
        });
    }
};

export const clientView = async (req, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { state: true };

        const clients = await Client.find(query)
            .populate({path: 'keeperExistProductRecord', match: {state:true}, select: 'date quantity reason destination productId',
                populate: {
                    path: 'productId',
                    select: 'nameProduct'
                }})
            .skip(Number(desde))
            .limit(Number(limite));

        const total = await Client.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            clients
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error getting frecuent clients",
            error: error.message
        });
    }
};


export const updateClient = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, ...data } = req.body;

        const client = await Client.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            success: true,
            msg: "Supplier updated successfully",
            frecuentClient: client
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error updating frecuent client",
            error: error.message
        });
    }
};


export const deleteClient = async (req, res = response) => {
    try {
        const { id } = req.params;

        const client = await Client.findByIdAndUpdate(id, { state: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: "Frecuent client disabled successfully",
            client
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error disabling frecuent client",
            error: error.message
        });
    }
}; 

export const addFrecuentClient = async (req, res = response) => {
    try {
        const client = req.clientInstance;

        const frecuentClient = new FrecuentClient({
            name: client.name,
            surname: client.surname,
            email: client.email,
            phoneNumber: client.phoneNumber,
            keeperExistProductRecord: client.keeperExistProductRecord
        });

        await frecuentClient.save();

        client.state = false;
        await client.save();

        res.status(200).json({
            success: true,
            frecuentClient
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error creating frecuent client",
            error: error.message
        });
    }
};



export const frecuentClientView = async (req, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { state: true };

        const frecuentClients = await FrecuentClient.find(query)
            .populate({path: 'keeperExistProductRecord', match: {state:true}, select: 'date quantity reason destination productId',
                populate: {
                    path: 'productId',
                    select: 'nameProduct'
                }})
            .skip(Number(desde))
            .limit(Number(limite));

        const total = await FrecuentClient.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            frecuentClients
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error getting frecuent clients",
            error: error.message
        });
    }
};


export const updateFrecuentClient = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, ...data } = req.body;

        const frecuentClient = await FrecuentClient.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            success: true,
            msg: "Supplier updated successfully",
            frecuentClient: frecuentClient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error updating frecuent client",
            error: error.message
        });
    }
};


export const deleteFrecuentClient = async (req, res = response) => {
    try {
        const { id } = req.params;

        const frecuentClient = await FrecuentClient.findByIdAndUpdate(id, { state: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: "Frecuent client disabled successfully",
            frecuentClient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error disabling frecuent client",
            error: error.message
        });
    }
};  