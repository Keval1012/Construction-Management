import Joi from 'joi';
import Tax from '../models/tax.js';
import { addUpdateTaxService, deleteTaxService, getAllTaxService, getAllTaxWithoutPaginateService } from '../services/tax.js';

export const validationBudget = (request) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        displayName: Joi.string().required()
    });
    return schema.validate(request);
};

export const getTaxDataById = async (req, res) => {
    try {
        // const result = await TaxService.getTaxDataById(req, Tax, mongoose);
        // return res.status(result.status).send(result);

    } catch (error) {
        return res.status(404).send({ success: false, message: 'Tax is not found with given id', error: error });
    }
};

export const getAllTaxWithoutPaginate = async (req, res) => {
    try {
        const result = await getAllTaxWithoutPaginateService(req, Tax);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllTax = async (req, res) => {
    try {
        const result = await getAllTaxService(req, Tax);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const addUpdateTax = async (req, res) => {
   try {
        const result = await addUpdateTaxService(req, Tax);
        return res.status(result.status).send(result);

   } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
   }
};

export const deleteTax = async (req, res) => {
    try {
        const result = await deleteTaxService(req, Tax);
        return res.status(result.status).send(result);
        
    } catch (error) {
        return res.status(404).send({ success: false, message: 'Something went wrong', error: error });    
    }
};