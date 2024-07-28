// const { validationUser } = require("../helper");
import Joi from 'joi';
import User from '../models/user.js';
import Role from '../models/Role.js';
import UserRole from '../models/userRole.js';
import bcrypt from 'bcrypt';
import { changePasswordService, getUserLoginService } from "../services/login.js";

export const getUserLogin = async (req, res) => {
    try {
        const result = await getUserLoginService(req, User, Role, UserRole, bcrypt);
        return res.status(result.status).send({ success: true, data: result });

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const changePassword = async (req, res) => {
    try {
        const result = await changePasswordService(req, User, bcrypt);
        return res.status(result.status).send(result);
        
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};
