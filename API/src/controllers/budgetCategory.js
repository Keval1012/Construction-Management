import Joi from 'joi';
import BudgetCategory from '../models/budgetCategory.js';
import { addBudgetCategoryService, deleteBudgetCategoryService, getAllBudgetCategoryService, getAllBudgetCategoryWithoutPaginateService } from "../services/budgetCategory.js";

export const validationBudgetCategory = (request) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        displayName: Joi.string().required()
    });
    return schema.validate(request);
};

export const getBudgetCategoryDataById = async (req, res) => {
    try {
        // const result = await BudgetCategoryService.getBudgetCategoryDataById(req, BudgetCategory, mongoose);
        // return res.status(result.status).send(result);

    } catch (error) {
        return res.status(404).send({ success: false, message: 'BudgetCategory is not found with given id', error: error });
    }
};

export const getAllBudgetCategoryWithoutPaginate = async (req, res) => {
    try {
        const result = await getAllBudgetCategoryWithoutPaginateService(req, BudgetCategory);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllBudgetCategory = async (req, res) => {
    try {
        const result = await getAllBudgetCategoryService(req, BudgetCategory);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }

};

export const addUpdateBudgetCategory = async (req, res) => {
    // const { error } = validationBudgetCategory(req.body);
    // if (error) return res.status(400).send({ success: false, message: error?.details[0]?.message });

   try {
        const result = await addBudgetCategoryService(req, BudgetCategory);
        return res.status(result.status).send(result);

   } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
   }
};

export const deleteBudgetCategory = async (req, res) => {
    try {
        const result = await deleteBudgetCategoryService(req, BudgetCategory);
        return res.status(result.status).send(result);
        
    } catch (error) {
        return res.status(404).send({ success: false, message: 'Something went wrong', error: error });    
    }
};