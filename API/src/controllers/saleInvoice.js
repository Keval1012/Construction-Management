import Joi from 'joi';
import SaleInvoice from '../models/saleInvoice.js';
import SaleItem from '../models/saleItem.js';
import InvoiceDocument from '../models/invoiceDocument.js';
import { addSaleInvoiceService, deleteInvoiceDocumentService, deleteSaleInvoiceService, getAllSaleInvoiceByProjectIdService, getAllSaleInvoiceService, getAllSaleInvoiceWithoutPaginateService, getTotalAmountSIByProjectIdService, updateInvoiceDocumentsService } from '../services/saleInvoice.js';
import mongoose from 'mongoose';

export const validationBudget = (request) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        displayName: Joi.string().required()
    });
    return schema.validate(request);
};

export const getSaleInvoiceDataById = async (req, res) => {
    try {
        // const result = await SaleInvoiceService.getSaleInvoiceDataById(req, SaleInvoice, mongoose);
        // return res.status(result.status).send(result);

    } catch (error) {
        return res.status(404).send({ success: false, message: 'SaleInvoice is not found with given id', error: error });
    }
};

export const deleteInvoiceDocument = async (req, res) => {
    try {
        const result = await deleteInvoiceDocumentService(req, InvoiceDocument);
        return res.status(result.status).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const updateInvoiceDocuments = async (req, res) => {
    try {
        const result = await updateInvoiceDocumentsService(req, InvoiceDocument);
        return res.status(result.status).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getTotalAmountSIByProjectId = async (req, res) => {
    try {
        const result = await getTotalAmountSIByProjectIdService(req, SaleInvoice);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllSaleInvoiceByProjectId = async (req, res) => {
    try {
        const result = await getAllSaleInvoiceByProjectIdService(req, SaleInvoice, false);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getSaleInvoiceByProjectId = async (req, res) => {
    try {
        const result = await getAllSaleInvoiceByProjectIdService(req, SaleInvoice, true);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllSaleInvoiceWithoutPaginate = async (req, res) => {
    try {
        const result = await getAllSaleInvoiceWithoutPaginateService(req, SaleInvoice);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllSaleInvoice = async (req, res) => {
    try {
        const result = await getAllSaleInvoiceService(req, SaleInvoice);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const addUpdateSaleInvoice = async (req, res) => {
   try {
        const result = await addSaleInvoiceService(req, SaleInvoice, SaleItem, mongoose);
        return res.status(result.status).send(result);

   } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
   }
};

export const deleteSaleInvoice = async (req, res) => {
    try {
        const result = await deleteSaleInvoiceService(req, SaleInvoice);
        return res.status(result.status).send(result);
        
    } catch (error) {
        return res.status(404).send({ success: false, message: 'Something went wrong', error: error });    
    }
};