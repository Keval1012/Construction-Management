import Joi from 'joi';
import PurchaseOrder from '../models/purchaseOrder.js';
import PurchaseItem from '../models/purchaseItem.js';
import { addPurchaseOrderService, deletePurchaseOrderService, getAllPurchaseOrderByProjectIdService, getAllPurchaseOrderService, getAllPurchaseOrderWithoutPaginateService, getTotalAmountPOByProjectIdService } from '../services/purchaseOrder.js';
import mongoose from 'mongoose';

export const validationBudget = (request) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        displayName: Joi.string().required()
    });
    return schema.validate(request);
};

export const getPurchaseOrderDataById = async (req, res) => {
    try {
        // const result = await PurchaseOrderService.getBudgetDataById(req, PurchaseOrder, mongoose);
        // return res.status(result.status).send(result);

    } catch (error) {
        return res.status(404).send({ success: false, message: 'Budget is not found with given id', error: error });
    }
};

export const getTotalAmountPOByProjectId = async (req, res) => {
    try {
        const result = await getTotalAmountPOByProjectIdService(req, PurchaseOrder);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllPurchaseOrderByProjectId = async (req, res) => {
    try {
        const result = await getAllPurchaseOrderByProjectIdService(req, PurchaseOrder, false);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getPurchaseOrderByProjectId = async (req, res) => {
    try {
        const result = await getAllPurchaseOrderByProjectIdService(req, PurchaseOrder, true);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllPurchaseOrderWithoutPaginate = async (req, res) => {
    try {
        const result = await getAllPurchaseOrderWithoutPaginateService(req, PurchaseOrder);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllPurchaseOrder = async (req, res) => {
    try {
        const result = await getAllPurchaseOrderService(req, PurchaseOrder);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const addUpdatePurchaseOrder = async (req, res) => {
   try {
        const result = await addPurchaseOrderService(req, PurchaseOrder, PurchaseItem, mongoose);
        return res.status(result.status).send(result);

   } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
   }
};

export const deletePurchaseOrder = async (req, res) => {
    try {
        const result = await deletePurchaseOrderService(req, PurchaseOrder);
        return res.status(result.status).send(result);
        
    } catch (error) {
        return res.status(404).send({ success: false, message: 'Something went wrong', error: error });    
    }
};