import Joi from 'joi';
import ModulePermission from '../models/modulePermission.js';
import AccessPermission from '../models/accessPermission.js';
import UserRole from '../models/userRole.js';
import { addUpdateAccessPermissionsByRoleService, getAllAccessPermissionByUserIdService, getAllModulePermissionWithoutPaginateService } from "../services/permission.js";

export const validationModulePermission = (request) => {
    const schema = Joi.object({
        name: Joi.string().required(),
    });
    return schema.validate(request);
};

export const getAllModulePermissionWithoutPaginate = async (req, res) => {
    try {
        const result = await getAllModulePermissionWithoutPaginateService(req, ModulePermission);
        return res.status(result.status).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const addUpdateAccessPermissionsByRole = async (req, res) => {
    try {
        const result = await addUpdateAccessPermissionsByRoleService(req, AccessPermission);
        return res.status(result.status).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllAccessPermissionByUserId = async (req, res) => {
    try {
        const result = await getAllAccessPermissionByUserIdService(req, AccessPermission, UserRole);
        return res.status(result.status).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllAccessPermissionByRoleId = async (req, res) => {
    try {
        const result = await getAllAccessPermissionByUserIdService(req, AccessPermission, UserRole, true);
        return res.status(result.status).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};