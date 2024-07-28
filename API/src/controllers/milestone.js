import Joi from 'joi';
import Milestone from '../models/milestone.js';
import { addMilestoneService, deleteMilestoneService, getAllMilestoneByProjectIdService, getAllMilestoneService, getAllMilestoneWithoutPaginateService } from "../services/milestone.js";

export const validationMilestone = (request) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        displayName: Joi.string().required()
    });
    return schema.validate(request);
};

export const getMilestoneDataById = async (req, res) => {
    try {
        // const result = await MilestoneService.getMilestoneDataById(req, Milestone, mongoose);
        // return res.status(result.status).send(result);

    } catch (error) {
        return res.status(404).send({ success: false, message: 'Milestone is not found with given id', error: error });
    }
};

export const getAllMilestoneByProjectId = async (req, res) => {
    try {
        const result = await getAllMilestoneByProjectIdService(req, Milestone);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllMilestoneWithoutPaginate = async (req, res) => {
    try {
        const result = await getAllMilestoneWithoutPaginateService(req, Milestone);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllMilestone = async (req, res) => {
    try {
        const result = await getAllMilestoneService(req, Milestone);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }

};

export const addUpdateMilestone = async (req, res) => {
    // const { error } = validationMilestone(req.body);
    // if (error) return res.status(400).send({ success: false, message: error?.details[0]?.message });

   try {
        const result = await addMilestoneService(req, Milestone);
        return res.status(result.status).send(result);

   } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
   }
};

export const deleteMilestone = async (req, res) => {
    try {
        const result = await deleteMilestoneService(req, Milestone);
        return res.status(result.status).send(result);
        
    } catch (error) {
        return res.status(404).send({ success: false, message: 'Something went wrong', error: error });    
    }
};