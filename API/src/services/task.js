import { addService, deleteService, getAllService, getAllWithoutPaginate, updateService } from "../genericServices.js";

export const getAllTaskWithoutPaginateService = async (req, Task) => {
    return await getAllWithoutPaginate(req, Task, true);
};

export const getAllTaskService = async (req, Task) => {
    const matchFieldsArr = ['TaskName', 'TaskNumber'];
    const sortFieldsObj = { TaskName: 1, TaskNumber: 1 };
    
    const res = await getAllService(req, Task, matchFieldsArr);
    return res;
};

export const getAllTasksByEmployeeService = async (req, Task, isPaginate) => {
    try {
        const { status, priorityList, employeeId } = req.query;

        let taskPriorityList = JSON.parse(priorityList);
        // let taskPriorityList = ['medium'];
        if (!employeeId || !taskPriorityList?.length > 0) return { success: false, status: 400, message: 'REQUIRED_FIELDS_MISSING' };

        const q = [
            { $match: {
                assignTo: employeeId,
                priority: { 
                    $in: taskPriorityList
                }
            }},
            { $lookup: {
                let: { "pObjId": { "$toObjectId": "$projectId" } },
                from: "project",
                pipeline: [
                    { $match: {
                        $or: [
                            { $expr: { "$eq": [ "$_id", "$$pObjId" ] } }
                        ]
                    }},
                ],
                as: "projectDetails"
            }},
            { $set: {
                projectDetails: {
                    $arrayElemAt: ["$projectDetails", 0]
                }
            }},
            { $group: {
                "_id": "$projectId",
                tasks: { $push : "$$ROOT" },
                "projectId": { $first: "$projectId" },
                "project": { $first: "$projectDetails" },
                // projectDetails: "projectDetails"
            }},
            { $lookup: {
                let: { "pObjId": "$projectId" },
                from: "project",
                pipeline: [
                    { $match: { 
                        $or: [
                            { $expr: { "$eq": [ "$_id", "$$pObjId" ] } }
                        ]
                    }},
                    // { $lookup: {
                    //     let: { "aObjId": "$projectId" },
                    //     from: "projectDocument",
                    //     pipeline: [
                    //         { $match: {
                    //             $and: [
                    //                 { $expr: { "$eq": ["$projectId", "$$aObjId"] } },
                    //                 { isDeleted: false }
                    //             ]
                    //         }},
                    //     ],
                    //     as: "attachmentList"
                    // }},
                ],
                as: "projectDetails"
            }},
            { $lookup: {
                let: { "aObjId": "$projectId" },
                from: "projectDocument",
                pipeline: [
                    { $match: {
                        $and: [
                            { $expr: { "$eq": ["$projectId", "$$aObjId"] } },
                            { isDeleted: false }
                        ]
                    }},
                ],
                as: "projectAttachmentList"
            }},
            { $set: {
                projectDetails: {
                    $arrayElemAt: ["$projectDetails", 0]
                },
            }},
            { $sort: { "createdAt": 1 } }
        ];

        if (isPaginate) {
            const res = await getAllService(req, Task, null, q);
            return res;
        } else {
            const res = await getAllWithoutPaginate(req, Task, false, q);
            return res;
        }

    } catch (error) {
        return { success: false, status: 404, message: 'Id Not Found', error: error };
    }
};

export const getAllTasksByProjectIdService = async (req, Task, isPaginate) => {
    try {
        const matchFieldsArr = ['taskName', 'taskNumber', 'projectDetails.projectName'];
        const { projectId, taskStatus, assignTo, priority, lastDay, customStartDate, customEndDate, startRangeStart, startRangeEnd, endRangeStart, endRangeEnd } = req.query;
        let taskStatusList = ['onGoing', 'notStarted', 'completed'];
        
        if (!projectId) return { success: false, status: 400, message: 'REQUIRED_FIELD_MISSING' };

        if (taskStatus && taskStatus?.length > 0) taskStatusList = taskStatus;
        let startD, endD, sStartD, sEndD, eStartD, eEndD = new Date();

        if (lastDay) startD.setDate(startD.getDate() - Number(lastDay));
        if (customStartDate) startD = new Date(customStartDate);
        if (customEndDate) endD = new Date(customEndDate);
        if (startRangeStart) sStartD = new Date(startRangeStart);
        if (startRangeEnd) sEndD = new Date(startRangeEnd);
        if (endRangeStart) eStartD = new Date(endRangeStart);
        if (endRangeEnd) eEndD = new Date(endRangeEnd);

        let matchObject = {
            isDeleted: false,
            projectId: projectId,
            status: {
                $in: taskStatusList
            }
        };
        
        if (lastDay) matchObj.createdAt = { $gte: startD };
        if (customStartDate || customEndDate) matchObj.createdAt = { $gte: startD, $lte: endD };
        if (startRangeStart || startRangeEnd) matchObj.startDate = { $gte: sStartD, $lte: sEndD };
        if (endRangeStart || endRangeEnd) matchObj.endDate = { $gte: eStartD, $lte: eEndD };
        if (assignTo) matchObject.assignTo = assignTo;
        if (priority) matchObject.priority = priority;

        const q = [
            { $match: matchObject },
            { $lookup: {
                let: { "pObjId": { "$toObjectId": "$projectId" } },
                from: "project",
                pipeline: [
                    { $match: {
                        $or: [
                            { $expr: { "$eq": [ "$_id", "$$pObjId" ] } }
                        ]
                    }},
                ],
                as: "projectDetails"
            }},
            { $set: {
                projectDetails: {
                    $arrayElemAt: ["$projectDetails", 0]
                }
            }},
        ];
        
        if (isPaginate) {
            const res = await getAllService(req, Task, matchFieldsArr, q, null);
            return res;
        } else {
            const res = await getAllWithoutPaginate(req, Task, false, q);
            return res;
        }

    } catch (error) {
        return { success: false, status: 404, message: 'Id Not Found', error: error };
    }
};

export const addUpdateTaskService = async (req, Task) => {
    debugger
    if (req.params.id) {
        const { taskName, taskNumber, projectId, milestoneId, assignTo, description, startDate, endDate, status, priority, attachment, completionPercent } = req.body;

        let data = {
            taskName: taskName,
            taskNumber: taskNumber,
            projectId: projectId,
            // milestoneId: milestoneId,
            description: description,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            assignTo: assignTo,
            status: status,
            priority: priority,
            attachment: attachment,
            completionPercent: completionPercent
        }

        const res = await updateService(req, Task, data);
        return res;

    } else {
        const { taskName, taskNumber, projectId, milestoneId, assignTo, description, startDate, endDate, status, priority, attachment, completionPercent } = req.body;
        if (!taskName || !projectId || !assignTo || !description || !startDate || !endDate || !priority || !status || !completionPercent) {
            return { success: false, status: 400, error: 'REQUIRED_FIELDS_MISSING' };
        }

        let data = {
            taskName: taskName,
            taskNumber: taskNumber,
            projectId: projectId,
            // milestoneId: milestoneId,
            description: description,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            assignTo: assignTo,
            status: status,
            priority: priority,
            completionPercent: completionPercent,
            attachment: attachment,
            isDeleted: false
        }
    
        const res = await addService(req, Task, data);
        return res;

    }
};

export const deleteTaskService = async (req, Task) => {
    const res = await deleteService(req, Task);
    return res;
};