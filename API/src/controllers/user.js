// const { validationUser } = require("../helper");
import Joi from 'joi';
import User from '../models/user.js';
import Project from '../models/project.js';
import Role from '../models/Role.js';
import UserRole from '../models/userRole.js';
import bcrypt from 'bcrypt';
import { addUpdateUserService, deleteUserService, getAllEmployeeByBuilderService, getAllForSpecificRoleService, getAllUserCountService, getAllUserService, getAllUserWithoutPaginateService, getAllCountByMonthService, getRoleByUserIdService, getTotalCountService, getUserDataByIdService } from "../services/user.js";
import mongoose from 'mongoose';

export const validationUser = (request) => {
    const schema = Joi.object({
        name: Joi.string().min(2).required(),
        surname: Joi.string().min(2).required(),
        mobile: Joi.string().required(),
        image: Joi.any().allow('', null),
    });
    return schema.validate(request);
};

export const getAllUsers = async (req, res) => {
    try {
        const result = await getAllUserWithoutPaginateService(req, User);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong' });
    }
};

export const getAllUsersCountByMonth = async (req, res) => {
    try {
        const result = await getAllCountByMonthService(req, User);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong' });
    }
};

export const getAllUserCount = async (req, res) => {
    try {
        const result = await getAllUserCountService(req, User);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong' });
    }
};

export const getRoleByUserId = async (req, res) => {
    try {
        const result = await getRoleByUserIdService(req, UserRole, Role);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong' });
    }
};

export const getAllEmployeeByBuilder = async (req, res) => {
    try {
        const result = await getAllEmployeeByBuilderService(req, User, Role, true);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong' });
    }
};

export const getAllEmployeeByBuilderWithoutPaginate = async (req, res) => {
    try {
        const result = await getAllEmployeeByBuilderService(req, User, Role, false);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong' });
    }
};

export const getAllBuilderTotalCount = async (req, res) => {
    try {
        const result = await getTotalCountService(req, User, UserRole, Role, 'builder');
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong' });
    }
};

export const getAllEmployeeTotalCount = async (req, res) => {
    try {
        const result = await getTotalCountService(req, User, UserRole, Role, 'employee');
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong' });
    }
};

export const getAllEmployeeTotalCountByBuilder = async (req, res) => {
    try {
        const result = await getTotalCountService(req, User, UserRole, Role, 'employee');
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong' });
    }
};

export const getAllBuilder = async (req, res) => {
    try {
        const result = await getAllForSpecificRoleService(req, User, Role, 'builder', true);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong' });
    }
};

export const getAllBuilderWithoutPaginate = async (req, res) => {
    try {
        const result = await getAllForSpecificRoleService(req, User, Role, 'builder', false);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong' });
    }
};

export const getAllEmployee = async (req, res) => {
    try {
        const result = await getAllForSpecificRoleService(req, User, Role, 'employee', true);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong' });
    }
};

export const getAllEmployeeWithoutPaginate = async (req, res) => {
    try {
        const result = await getAllForSpecificRoleService(req, User, Role, 'employee', false);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong' });
    }
};

export const getUserDataById = async (req, res) => {
    try {
        const result = await getUserDataByIdService(req, User, mongoose);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(404).send({ success: false, message: 'User is not found with given id', error: error });
    }
};

export const getUsers = async (req, res) => {
    try {
        const result = await getAllUserService(req, User, UserRole);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }

};

export const addUpdateUser = async (req, res) => {
    // const { error } = validationUser(req.body);
    // if (error) return res.status(400).send({ success: false, message: error?.details[0]?.message });

   try {
        const result = await addUpdateUserService(req, User, Role, UserRole, bcrypt);
        return res.status(result.status).send(result);

   } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
   }
};

export const deleteUser = async (req, res) => {
    try {
        const result = await deleteUserService(req, User);
        return res.status(result.status).send(result);
        
    } catch (error) {
        return res.status(404).send({ success: false, message: 'Something went wrong', error: error });    
    }
};