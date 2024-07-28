import Joi from 'joi';
import Inspection from '../models/inspection.js';
import InspectionIssue from '../models/inspectionIssue.js';
import { addInspectionService, deleteInspectionService, getAllInspectionByQueryService, getAllInspectionService, getAllInspectionWithoutPaginateService, getAllIssuesByInspectionService } from "../services/inspection.js";

export const validationInspection = (request) => {
    const schema = Joi.object({
        inspectionTitle: Joi.string().required(),
        description: Joi.string().required()
    });
    return schema.validate(request);
};

export const getInspectionDataById = async (req, res) => {
    try {
        // const result = await InspectionService.getInspectionDataById(req, Inspection, mongoose);
        // return res.status(result.status).send(result);

    } catch (error) {
        return res.status(404).send({ success: false, message: 'Inspection is not found with given id', error: error });
    }
};

export const getAllIssuesByInspection = async (req, res) => {
    try {
        const result = await getAllIssuesByInspectionService(req, InspectionIssue);
        return res.status(result.status).send(result);
    
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllInspectionByQuery = async (req, res) => {
    try {
        const result = await getAllInspectionByQueryService(req, Inspection, true);
        return res.status(result.status).send(result);
    
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllInspectionByQueryWithoutPaginate = async (req, res) => {
    try {
        const result = await getAllInspectionByQueryService(req, Inspection, false);
        return res.status(result.status).send(result);
    
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllInspectionWithoutPaginate = async (req, res) => {
    try {
        const result = await getAllInspectionWithoutPaginateService(req, Inspection);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllInspection = async (req, res) => {
    try {
        const result = await getAllInspectionService(req, Inspection);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const addUpdateInspection = async (req, res) => {
    // const { error } = validationInspection(req.body);
    // if (error) return res.status(400).send({ success: false, message: error?.details[0]?.message });

   try {
        const result = await addInspectionService(req, Inspection, InspectionIssue);
        return res.status(result.status).send(result);

   } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
   }
};

export const deleteInspection = async (req, res) => {
    try {
        const result = await deleteInspectionService(req, Inspection);
        return res.status(result.status).send(result);
        
    } catch (error) {
        return res.status(404).send({ success: false, message: 'Something went wrong', error: error });    
    }
};