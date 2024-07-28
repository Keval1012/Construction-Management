import Joi from 'joi';
import EquipmentName from '../models/equipmentName.js';
import { addEquipmentNameService, deleteEquipmentNameService, getAllEquipmentNameService, getAllEquipmentNameWithoutPaginateService } from "../services/equipmentName.js";

export const validationEquipmentName = (request) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        displayName: Joi.string().required()
    });
    return schema.validate(request);
};

export const getEquipmentNameDataById = async (req, res) => {
    try {
        // const result = await EquipmentNameService.getEquipmentNameDataById(req, EquipmentName, mongoose);
        // return res.status(result.status).send(result);

    } catch (error) {
        return res.status(404).send({ success: false, message: 'EquipmentName is not found with given id', error: error });
    }
};

export const getAllEquipmentNameWithoutPaginate = async (req, res) => {
    try {
        const result = await getAllEquipmentNameWithoutPaginateService(req, EquipmentName);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllEquipmentName = async (req, res) => {
    try {
        const result = await getAllEquipmentNameService(req, EquipmentName);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }

};

export const addUpdateEquipmentName = async (req, res) => {
    // const { error } = validationEquipmentName(req.body);
    // if (error) return res.status(400).send({ success: false, message: error?.details[0]?.message });

   try {
        const result = await addEquipmentNameService(req, EquipmentName);
        return res.status(result.status).send(result);

   } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
   }
};

export const deleteEquipmentName = async (req, res) => {
    try {
        const result = await deleteEquipmentNameService(req, EquipmentName);
        return res.status(result.status).send(result);
        
    } catch (error) {
        return res.status(404).send({ success: false, message: 'Something went wrong', error: error });    
    }
};