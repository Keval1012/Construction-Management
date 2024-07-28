import Joi from 'joi';
import Project from '../models/project.js';
import Task from '../models/task.js';
import ProjectDocument from '../models/projectDocuments.js';
import DailyStatus from '../models/dailyStatus.js';
import { addUpdateProjectService, deleteProjectService, getAllProjectsByBuilderAndStatusService, getAllProjectService, getAllProjectWithoutPaginateService, getAllProjectsByBuilderService, getAllEmployeeOfProjectService, addProjectDailyStatusService, updateProjectDocumentsService, getAllCountByMonthAndBuilderService, getAllAttachmentsOfProjectService, deleteProjectDocumentService, getAllAssignEmployeeOfBuilderService } from "../services/project.js";

export const validationProject = (request) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        displayName: Joi.string().required()
    });
    return schema.validate(request);
};

export const getProjectDataById = async (req, res) => {
    try {
        // const result = await ProjectService.getProjectDataById(req, Project, mongoose);
        // return res.status(result.status).send(result);

    } catch (error) {
        return res.status(404).send({ success: false, message: 'Project is not found with given id', error: error });
    }
};

export const getAllProjectWithoutPaginate = async (req, res) => {
    try {
        const result = await getAllProjectWithoutPaginateService(req, Project);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllProject = async (req, res) => {
    try {
        const result = await getAllProjectService(req, Project);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllProjectsCountByMonth = async (req, res) => {
    try {
        const result = await getAllCountByMonthAndBuilderService(req, Project);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong' });
    }
};

export const getAllAssignEmployeeOfBuilder = async (req, res) => {
    try {
        const result = await getAllAssignEmployeeOfBuilderService(req, Task);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong' });
    }
};

// export const getAllProjectsByBuilder = async (req, res) => {
//     try {
//         const result = await getAllProjectsByBuilderService(req, Project);
//         return res.status(result.status).send(result);

//     } catch (error) {
//         return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
//     }
// };

export const getAllProjectsByBuilderAndStatus = async (req, res) => {
    try {
        const result = await getAllProjectsByBuilderAndStatusService(req, Project, true);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllEmployeeOfProject = async (req, res) => {
    try {
        const result = await getAllEmployeeOfProjectService(req, Task);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllAttachmentsOfProject = async (req, res) => {
    try {
        const result = await getAllAttachmentsOfProjectService(req, ProjectDocument, false);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAttachmentsOfProject = async (req, res) => {
    try {
        const result = await getAllAttachmentsOfProjectService(req, ProjectDocument, true);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllProjectsByBuilderAndStatusWithoutPaginate = async (req, res) => {
    try {
        const result = await getAllProjectsByBuilderAndStatusService(req, Project, false);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const addProjectDailyStatus = async (req, res) => {
   try {
        const result = await addProjectDailyStatusService(req, DailyStatus);
        return res.status(result.status).send(result);

   } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const updateProjectDocuments = async (req, res) => {
    try {
        const result = await updateProjectDocumentsService(req, Project, ProjectDocument);
        return res.status(result.status).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const deleteProjectDocument = async (req, res) => {
    try {
        const result = await deleteProjectDocumentService(req, ProjectDocument);
        return res.status(result.status).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const addUpdateProject = async (req, res) => {
    // const { error } = validationProject(req.body);
    // if (error) return res.status(400).send({ success: false, message: error?.details[0]?.message });

   try {
        const result = await addUpdateProjectService(req, Project, ProjectDocument);
        return res.status(result.status).send(result);

   } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
   }
};

export const deleteProject = async (req, res) => {
    debugger
    try {
        const result = await deleteProjectService(req, Project);
        return res.status(result.status).send(result);
        
    } catch (error) {
        return res.status(404).send({ success: false, message: 'Something went wrong', error: error });    
    }
};