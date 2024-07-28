import Joi from 'joi';
import Role from '../models/Role.js';
import { addRoleService, deleteRoleService, getAllRoleService, getAllRoleWithoutPaginateService } from "../services/role.js";

export const validationRole = (request) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        displayName: Joi.string().required()
    });
    return schema.validate(request);
};

export const getRoleDataById = async (req, res) => {
    try {
        // const result = await RoleService.getRoleDataById(req, Role, mongoose);
        // return res.status(result.status).send(result);

    } catch (error) {
        return res.status(404).send({ success: false, message: 'Role is not found with given id', error: error });
    }
};

export const getAllRoleWithoutPaginate = async (req, res) => {
    try {
        const result = await getAllRoleWithoutPaginateService(req, Role);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllRole = async (req, res) => {
    try {
        const result = await getAllRoleService(req, Role);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }

};

export const addUpdateRole = async (req, res) => {
    // const { error } = validationRole(req.body);
    // if (error) return res.status(400).send({ success: false, message: error?.details[0]?.message });

   try {
        const result = await addRoleService(req, Role);
        return res.status(result.status).send(result);

   } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
   }
};

export const deleteRole = async (req, res) => {
    try {
        const result = await deleteRoleService(req, Role);
        return res.status(result.status).send(result);
        
    } catch (error) {
        return res.status(404).send({ success: false, message: 'Something went wrong', error: error });    
    }
};