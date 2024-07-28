// const { validationUser } = require("../helper");
import Joi from 'joi';
import UserRole from '../models/userRole.js';
import { getAllUserRoleWithoutPaginateService } from '../services/userRole.js';

export const validationUser = (request) => {
    const schema = Joi.object({
        name: Joi.string().min(2).required(),
        surname: Joi.string().min(2).required(),
        mobile: Joi.string().required(),
        image: Joi.any().allow('', null),
    });
    return schema.validate(request);
};

export const getAllUserRoleWithoutPaginate = async (req, res) => {
    try {
        const result = await getAllUserRoleWithoutPaginateService(req, UserRole);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(404).send({ success: false, message: 'User is not found with given id', error: error });
    }
};
