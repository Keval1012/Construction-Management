import Joi from 'joi';
import Equipment from '../models/equipment.js';
import EquipmentRequest from '../models/equipmentRequest.js';
import { addEquipmentService, deleteEquipmentService, getAllEquipmentService, getAllEquipmentWithoutPaginateService, getAvailableDetailsOfEqptByIdService, getEquipmentsByStatusService } from "../services/equipment.js";

export const validationEquipment = (request) => {
    const schema = Joi.object({
        equipmentName: Joi.string().required(),
        equipmentType: Joi.string().required()
    });
    return schema.validate(request);
};

export const getEquipmentDataById = async (req, res) => {
    try {
        // const result = await EquipmentService.getEquipmentDataById(req, Equipment, mongoose);
        // return res.status(result.status).send(result);

    } catch (error) {
        return res.status(404).send({ success: false, message: 'Equipment is not found with given id', error: error });
    }
};

export const getAvailableDetailsOfEqptById = async (req, res) => {
    try {
        const result = await getAvailableDetailsOfEqptByIdService(req, EquipmentRequest);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllEquipmentWithoutPaginate = async (req, res) => {
    try {
        const result = await getAllEquipmentWithoutPaginateService(req, Equipment);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllEquipment = async (req, res) => {
    try {
        const result = await getAllEquipmentService(req, Equipment);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getEquipmentsByStatus = async (req, res) => {
    try {
        const result = await getEquipmentsByStatusService(req, Equipment, true);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getEquipmentsByStatusWithoutPaginate = async (req, res) => {
    try {
        const result = await getEquipmentsByStatusService(req, Equipment, false);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const addUpdateEquipment = async (req, res) => {
    // const { error } = validationEquipment(req.body);
    // if (error) return res.status(400).send({ success: false, message: error?.details[0]?.message });

   try {
        const result = await addEquipmentService(req, Equipment);
        return res.status(result.status).send(result);

   } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
   }
};

export const deleteEquipment = async (req, res) => {
    try {
        const result = await deleteEquipmentService(req, Equipment);
        return res.status(result.status).send(result);
        
    } catch (error) {
        return res.status(404).send({ success: false, message: 'Something went wrong', error: error });    
    }
};