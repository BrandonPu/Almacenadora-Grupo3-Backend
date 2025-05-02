import { response } from "express";
import FrecuentClient from './frecuentClient.model.js';

export const addFrecuentClient = async (req, res = response) => {
    try {
        const data = req.body;

        const frecuentClient = new FrecuentClient({
            name: data.name,
            surname: data.surname,
            email: data.email,
            phoneNumber: data.phoneNumber,
            password: data.password
        });

        await frecuentClient.save();

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

        if (!frecuentClient) {
            return res.status(404).json({
                success: false,
                msg: "Frecuent client not found"
            });
        }

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