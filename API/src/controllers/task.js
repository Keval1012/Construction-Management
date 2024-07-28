import Joi from 'joi'
import Task from '../models/task.js';
import { addUpdateTaskService, deleteTaskService, getAllTaskService, getAllTaskWithoutPaginateService, getAllTasksByEmployeeService, getAllTasksByProjectIdService } from "../services/task.js";

export const validationTask = (request) => {
    const schema = Joi.object({
        taskName: Joi.string().required(),
        taskNumber: Joi.string().required()
    });
    return schema.validate(request);
};

export const getTaskDataById = async (req, res) => {
    try {
        // const result = await TaskService.getTaskDataById(req, Task, mongoose);
        // return res.status(result.status).send(result);

    } catch (error) {
        return res.status(404).send({ success: false, message: 'Task is not found with given id', error: error });
    }
};

export const getAllTaskWithoutPaginate = async (req, res) => {
    try {
        const result = await getAllTaskWithoutPaginateService(req, Task);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllTask = async (req, res) => {
    try {
        const result = await getAllTaskService(req, Task);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllTasksByEmployee = async (req, res, isPaginate) => {
    try {
        const result = await getAllTasksByEmployeeService(req, Task, isPaginate);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllTasksByProjectId = async (req, res, isPaginate) => {
    try {
        const result = await getAllTasksByProjectIdService(req, Task, isPaginate);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const addUpdateTask = async (req, res) => {
   try {
        const result = await addUpdateTaskService(req, Task);
        return res.status(result.status).send(result);

   } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
   }
};

export const deleteTask = async (req, res) => {
    try {
        const result = await deleteTaskService(req, Task);
        return res.status(result.status).send(result);
        
    } catch (error) {
        return res.status(404).send({ success: false, message: 'Something went wrong', error: error });    
    }
};