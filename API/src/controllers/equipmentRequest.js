import Joi from 'joi';
import EquipmentRequest from '../models/equipmentRequest.js';
import { addEquipmentRequestService, changeStatusOfEqptReqService, deleteEquipmentRequestService, getAllEquipmentRequestService, getAllEquipmentRequestWithoutPaginateService, getEquipmentRequestsByStatusService, updateEqptReqDocumentsService } from "../services/equipmentRequest.js";

export const validationEquipmentRequest = (request) => {
    const schema = Joi.object({
        quantity: Joi.string().required(),
        taskId: Joi.string().required()
    });
    return schema.validate(request);
};

export const getEquipmentRequestDataById = async (req, res) => {
    try {
        // const result = await EquipmentRequestService.getEquipmentRequestDataById(req, EquipmentRequest, mongoose);
        // return res.status(result.status).send(result);

    } catch (error) {
        return res.status(404).send({ success: false, message: 'EquipmentRequest is not found with given id', error: error });
    }
};

export const getAllEquipmentRequestWithoutPaginate = async (req, res) => {
    try {
        const result = await getAllEquipmentRequestWithoutPaginateService(req, EquipmentRequest);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllEquipmentRequest = async (req, res) => {
    try {
        const result = await getAllEquipmentRequestService(req, EquipmentRequest);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getEquipmentRequestsByStatus = async (req, res) => {
    try {
        const result = await getEquipmentRequestsByStatusService(req, EquipmentRequest, true);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getEquipmentRequestsByStatusWithoutPaginate = async (req, res) => {
    try {
        const result = await getEquipmentRequestsByStatusService(req, EquipmentRequest, false);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const changeStatusOfEqptReq = async (req, res) => {
   try {
        const result = await changeStatusOfEqptReqService(req, EquipmentRequest);
        return res.status(result.status).send(result);
   } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
   }
};

export const updateEqptReqDocuments = async (req, res) => {
   try {
        const result = await updateEqptReqDocumentsService(req, EquipmentRequest);
        return res.status(result.status).send(result);
   } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
   }
};

export const addUpdateEquipmentRequest = async (req, res) => {
    // const { error } = validationEquipmentRequest(req.body);
    // if (error) return res.status(400).send({ success: false, message: error?.details[0]?.message });

   try {
        const result = await addEquipmentRequestService(req, EquipmentRequest);
        return res.status(result.status).send(result);

   } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
   }
};

export const deleteEquipmentRequest = async (req, res) => {
    try {
        const result = await deleteEquipmentRequestService(req, EquipmentRequest);
        return res.status(result.status).send(result);
        
    } catch (error) {
        return res.status(404).send({ success: false, message: 'Something went wrong', error: error });    
    }
};