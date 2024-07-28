import Joi from 'joi';
import Budget from '../models/budget.js';
import { addBudgetService, deleteBudgetService, getAllBudgetByProjectAndCategoryGroupService, getAllBudgetByProjectIdService, getAllBudgetService, getAllBudgetWithoutPaginateService } from "../services/budget.js";

export const validationBudget = (request) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        displayName: Joi.string().required()
    });
    return schema.validate(request);
};

export const getBudgetDataById = async (req, res) => {
    try {
        // const result = await BudgetService.getBudgetDataById(req, Budget, mongoose);
        // return res.status(result.status).send(result);

    } catch (error) {
        return res.status(404).send({ success: false, message: 'Budget is not found with given id', error: error });
    }
};

export const getAllBudgetByProjectAndCategoryGroup = async (req, res) => {
    try {
        const result = await getAllBudgetByProjectAndCategoryGroupService(req, Budget, false);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getBudgetByProjectAndCategoryGroup = async (req, res) => {
    try {
        const result = await getAllBudgetByProjectAndCategoryGroupService(req, Budget, true);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllBudgetByProjectId = async (req, res) => {
    try {
        const result = await getAllBudgetByProjectIdService(req, Budget, false);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getBudgetByProjectId = async (req, res) => {
    try {
        const result = await getAllBudgetByProjectIdService(req, Budget, true);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllBudgetWithoutPaginate = async (req, res) => {
    try {
        const result = await getAllBudgetWithoutPaginateService(req, Budget);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllBudget = async (req, res) => {
    try {
        const result = await getAllBudgetService(req, Budget);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }

};

export const addUpdateBudget = async (req, res) => {
    // const { error } = validationBudget(req.body);
    // if (error) return res.status(400).send({ success: false, message: error?.details[0]?.message });

   try {
        const result = await addBudgetService(req, Budget);
        return res.status(result.status).send(result);

   } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
   }
};

export const deleteBudget = async (req, res) => {
    try {
        const result = await deleteBudgetService(req, Budget);
        return res.status(result.status).send(result);
        
    } catch (error) {
        return res.status(404).send({ success: false, message: 'Something went wrong', error: error });    
    }
};