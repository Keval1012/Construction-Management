import { addService, deleteService, getAllService, getAllWithoutPaginate, updateService } from "../genericServices.js";
import upload from "../middleware/multer.js";

export const getAllProjectWithoutPaginateService = async (req, Project) => {
    return await getAllWithoutPaginate(req, Project, true);
};

export const getAllCountByMonthAndBuilderService = async (req, Model) => {
    try {
        const { year, builderId } = req.query;

        if (!builderId) return { success: false, status: 400, message: 'Something went wrong' }

        const q = [
            {
                $match: {
                    $expr: {
                        $eq: [{ $year: "$createdAt" }, Number(year) || new Date().getFullYear()]
                    },
                    builder: builderId,
                    isDeleted: false
                }
            },
            {
                $group: {
                    // _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    _id: { $month: "$createdAt" },
                    numberOfCount: { $sum: 1 }
                }
            }
        ];

        const res = await Model.aggregate(q).exec();
        return { success: true, status: 200, data: res };
    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};

export const getAllProjectService = async (req, Project) => {
    const matchFieldsArr = ['projectName', 'projectNumber', 'city', 'address', 'builderDetails.name', 'constructionType', 'clientName', 'clientNumber', 'tax', 'estimatedBudget', 'receivedAmount', 'completionPercentage'];
    const sortFieldsObj = { projectName: 1, projectNumber: 1 };
    const { builderId, priority, status, lastDay, customStartDate, customEndDate } = req.query;
    let startD = new Date();
    let endD = new Date();
    if (lastDay) startD.setDate(startD.getDate() - Number(lastDay));
    if (customStartDate) startD = new Date(customStartDate);
    if (customEndDate) endD = new Date(customEndDate);

    let matchObject = {
        isDeleted: false,
    };

    if (builderId) matchObject.builder = builderId;
    if (priority) matchObject.priority = priority;
    if (status) matchObject.status = { $in: JSON.parse(status) };
    if (lastDay) matchObj.createdAt = { $gte: startD };
    if (customStartDate || customEndDate) matchObj.createdAt = { $gte: startD, $lte: endD };

    const q = [
        { $match: matchObject },
        { $lookup: {
            let: { "userObjId": { "$toObjectId": "$builder" } },
            from: "users",
            pipeline: [
                { $match: {
                        $or: [
                            { $expr: { "$eq": ["$_id", "$$userObjId"] } }
                        ]
                }},
            ],
            as: "builderDetails"
        }},
        { $set: {
            builderDetails: {
                $arrayElemAt: ["$builderDetails", 0]
            }
        }},
    ];

    const res = await getAllService(req, Project, matchFieldsArr, q);
    return res;
};

export const getAllAssignEmployeeOfBuilderService = async (req, Task) => {
    try {
        const { builderId } = req.query;

        if (!builderId) return { success: false, status: 400, message: 'REQUIRED_FIELD_MISSING' };

        const q = [
            { $match: { isDeleted: false }},
            { $lookup: {
                let: { "pObjId": { "$toObjectId": "$projectId" } },
                from: "project",
                pipeline: [
                    { $match: {
                        $or: [
                            { $expr: { "$eq": ["$_id", "$$pObjId"] } }
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
            { $match: { 'projectDetails.builder': builderId }}
        ];

        const res = await Task.aggregate(q).exec();
        return { success: true, status: 200, data: res };

    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};

export const getAllAttachmentsOfProjectService = async (req, ProjectDocument, isPaginate) => {
    try {
        const { projectId, filterValue } = req.query;
        const matchFieldsArr = ['attachment', 'title', 'description'];

        if (!projectId) return { success: false, status: 400, message: 'REQUIRED_FIELD_MISSING' };

        const q = [];

        let matchObj = { $match: {
            projectId: projectId,
            isDeleted: false,
        }}

        if (filterValue) {
            // q.unshift({ $project: { "last": { $arrayElemAt: [{ $split: [ "$attachment", "/" ]}, 0] } }})
            q.unshift({
                $project: {
                    projectId: 1,
                    isDeleted: 1,
                    title: 1,
                    description: 1,
                    attachment: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    value: {
                      $arrayElemAt: [
                        { $split: [
                            "$attachment",
                            "/"
                        ]}, -1]
                    },
                }
            });

            matchObj = { $match: {
                projectId: projectId,
                isDeleted: false,
                value: { $regex: '.*' + filterValue + '.*', $options: 'i' },
            }}
        }

        q.push(matchObj);

        if (isPaginate) {
            const res = await getAllService(req, ProjectDocument, matchFieldsArr, q);
            return res;
        } else {
            const res = await ProjectDocument.find({ projectId: projectId, isDeleted: false });
            return { success: true, status: 200, data: res };
        }

    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' }
    }
};

export const getAllEmployeeOfProjectService = async (req, Task) => {
    try {
        const { projectId } = req.body;

        if (!projectId) return { success: false, status: 400, message: 'REQUIRED_FIELD_MISSING' };

        const q = [
            { $match: { isDeleted: false, projectId: projectId } },
            { $lookup: {
                let: { "userObjId": { "$toObjectId": "$assignTo" } },
                from: "users",
                pipeline: [
                    {
                        $match: {
                            $or: [
                                { $expr: { "$eq": ["$_id", "$$userObjId"] } }
                            ]
                        }
                    },
                ],
                as: "assignToDetails"
            }},
            { $set: {
                assignToDetails: {
                    $arrayElemAt: ["$assignToDetails", 0]
                }
            }},
            { $project: {
                'assignToDetails.password': 0,
                'assignToDetails.createdAt': 0,
                'assignToDetails.updatedAt': 0,
                'assignToDetails.isDeleted': 0
            }}
        ];

        const res = await getAllWithoutPaginate(req, Task, false, q);
        return res;

    } catch (error) {
        return { success: false, status: 404, message: 'Id Not Found', error: error };
    }
};

export const getAllProjectsByBuilderService = async (req, Project) => {
    try {
        const matchFieldsArr = ['projectName', 'projectNumber', 'city', 'address', 'builderDetails.name', 'constructionType', 'clientName', 'clientNumber', 'tax', 'estimatedBudget', 'receivedAmount', 'completionPercentage'];
        const { userId } = req.query;

        if (!userId) return { success: false, status: 400, message: 'REQUIRED_FIELD_MISSING' };

        const q = [
            { $match: { isDeleted: false, builder: userId } },
            { $lookup: {
                let: { "pObjId": { "$toString": "$_id" } },
                from: "projectDocument",
                pipeline: [
                    { $match: {
                        $and: [
                            { $expr: { "$eq": ["$projectId", "$$pObjId"] } },
                            { isDeleted: false }
                        ]
                    }},
                ],
                as: "attachmentList"
            }},
            { $lookup: {
                let: { "userObjId": { "$toObjectId": "$builder" } },
                from: "users",
                pipeline: [
                    { $match: {
                        $or: [
                            { $expr: { "$eq": ["$_id", "$$userObjId"] } }
                        ]
                    }},
                ],
                as: "builderDetails"
            }},
            { $set: {
                builderDetails: {
                    $arrayElemAt: ["$builderDetails", 0]
                }
            }},
        ];

        const res = await getAllService(req, Project, matchFieldsArr, q);
        return res;

    } catch (error) {
        return { success: false, status: 404, message: 'Id Not Found', error: error };
    }
};

export const getAllProjectsByBuilderAndStatusService = async (req, Project, isPaginate = false) => {
    let builderId, status = [], priority, lastDay, customStartDate, customEndDate = null;

    if (isPaginate) {
        builderId = req.query?.userId;
        priority = req.query?.priority;
        status = JSON.parse(req.query?.status);
        lastDay = req.query?.lastDay;
        customStartDate = req.query?.customStartDate;
        customEndDate = req.query?.customEndDate;
    } else {
        builderId = req.body?.builderId;
        priority = req.body?.priority;
        status = req.body?.status;
        lastDay = req.body?.lastDay;
        customStartDate = req.body?.customStartDate;
        customEndDate = req.body?.customEndDate;
    }

    let matchObject = {
        isDeleted: false,
        builder: builderId,
        // status: status,
        status: {
            $in: status
        }
    };

    if (!builderId || !status) return { success: false, status: 400, message: 'REQUIRED_FIELD_MISSING' };

    let startD = new Date();
    let endD = new Date();
    if (lastDay) startD.setDate(startD.getDate() - Number(lastDay));
    if (customStartDate) startD = new Date(customStartDate);
    if (customEndDate) endD = new Date(customEndDate);
    // let matchObj = { isDeleted: false };

    if (lastDay) {
        matchObject.createdAt = { $gte: startD };
    };
    if (customStartDate || customEndDate) {
        // matchObj.createdAt = { $gte: new Date(2015, 6, 1), $lt: new Date(2015, 7, 1) };
        matchObject.createdAt = { $gte: startD, $lte: endD };
    };

    if (priority) matchObject.priority = priority;

    const matchFieldsArr = ['projectName', 'projectNumber', 'city', 'address', 'builderDetails.name', 'constructionType', 'clientName', 'clientNumber', 'tax', 'estimatedBudget', 'receivedAmount', 'completionPercentage'];
    const q = [
        { $match: matchObject },
        { $lookup: {
            let: { "pObjId": { "$toString": "$_id" } },
            from: "projectDocument",
            pipeline: [
                { $match: {
                    $and: [
                        { $expr: { "$eq": ["$projectId", "$$pObjId"] } },
                        { isDeleted: false }
                    ]
                }},
            ],
            as: "attachmentList"
        }},
        { $lookup: {
            let: { "userObjId": { "$toObjectId": "$builder" } },
            from: "users",
            pipeline: [
                { $match: {
                    $or: [
                        { $expr: { "$eq": ["$_id", "$$userObjId"] } }
                    ]
                }},
            ],
            as: "builderDetails"
        }},
        { $set: {
            builderDetails: {
                $arrayElemAt: ["$builderDetails", 0]
            }
        }},
    ];

    if (isPaginate) {
        const res = await getAllService(req, Project, matchFieldsArr, q);
        return res;
    } else {
        const res = await getAllWithoutPaginate(req, Project, false, q);
        return res;
    }

};

export const addProjectDailyStatusService = async (req, DailyStatus) => {

    const { projectId, taskId, progress, description, problemFaced, reportedBy, reportedOn } = req.body;
    if (!projectId || !taskId || !progress || !description || !problemFaced || !reportedBy || !reportedOn) {
        return { success: false, status: 400, error: 'REQUIRED_FIELDS_MISSING' };
    }

    let data = {
        projectId: projectId,
        taskId: taskId,
        progress: progress,
        description: description,
        problemFaced: problemFaced,
        reportedBy: reportedBy,
        reportedOn: new Date(reportedOn).toISOString(),
        isDeleted: false
    }

    const res = await addService(req, DailyStatus, data);
    return res;
};

export const updateProjectDocumentsService = async (req, Project, ProjectDocument) => {
    try {
        const { projectId, attachment, title, description } = req.body;
    
        if (!projectId) return { success: false, status: 400, message: 'REQUIRED_FIELDS_MISSING' };
    
        let imgsArr = [], bodyImages;
    
        if (typeof attachment === 'string') {
            bodyImages = [JSON.parse(attachment)]
        } else {
            bodyImages = attachment;
        }
    
        if (bodyImages?.length > 0) {
            bodyImages.forEach(el => {
                let parsedUrl;
                if (typeof el === 'string') {
                    parsedUrl = JSON.parse(el);
                } else {
                    parsedUrl = el;
                }
                let url = `images${parsedUrl?.url?.split('images')[1]}`;
                imgsArr.push(url);
            });
        }
    
        if (req?.files?.length > 0) {
            req.files.forEach(o => {
                imgsArr.push(`images/project/${projectId}/${o.originalname}`);
            });
        }
    
        if (imgsArr.length > 0) {
            let isError = false;
            imgsArr.forEach(async (o) => {
                try {
                    let data = {
                        projectId: projectId,
                        attachment: o,
                        title: title ? title : '',
                        description: description ? description : '',
                    }
                
                    const res = await ProjectDocument.create(data);
                    
                } catch (error) {
                    isError = true;
                }
            });
            if (isError) {
                const remove = await ProjectDocument.findByIdAndDelete(projectId);
                return { success: false, status: 500, message: "Something went wrong" };
            }
        }
        
        return { success: true, status: 200, message: 'Document Added' };
        // let data = {
        //     attachment: imgsArr
        // }
        // const res = await updateService(req, Project, data, projectId);
        // return res;
        
    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};

export const deleteProjectDocumentService = async (req, ProjectDocument) => {
    try {
        const { id } = req.params;
        if (!id) return { success: false, status: 404, message: 'ID NOT FOUND' };

        const res = await ProjectDocument.findByIdAndUpdate(id, { isDeleted: true });
        return { success: true, status: 200, message: 'Document Deleted' }

    } catch (error) {
        return { success: true, status: 500, message: 'Something went wrong' }
    }
};

export const addUpdateProjectService = async (req, Project, ProjectDocument) => {
    if (req.params.id) {
        const { projectName, projectNumber, city, address, builderId, constructionType, priority, startDate, completionDate, clientName, clientNumber, status, attachment, tax, receivedAmount, projectValue, estimatedBudget, completionPercentage } = req.body;

        let imgsArr = [], bodyImages;

        if (typeof attachment === 'string') {
            bodyImages = [JSON.parse(attachment)]
        } else {
            bodyImages = attachment;
        }

        if (bodyImages?.length > 0) {
            bodyImages.forEach(el => {
                let parsedUrl;
                if (typeof el === 'string') {
                    parsedUrl = JSON.parse(el);
                } else {
                    parsedUrl = el;
                }
                let url = `images${parsedUrl?.url?.split('images')[1]}`;
                imgsArr.push(url);
            });
        }

        if (req?.files?.length > 0) {
            req.files.forEach(o => {
                imgsArr.push(`images/project/${req.params.id}/${o.originalname}`);
            });
        }

        let data = {
            projectName: projectName,
            projectNumber: projectNumber,
            city: city,
            address: address,
            constructionType: constructionType,
            startDate: new Date(startDate).toISOString(),
            completionDate: new Date(completionDate).toISOString(),
            builder: builderId,
            clientName: clientName,
            clientNumber: clientNumber,
            status: status,
            priority: priority,
            tax: tax,
            estimatedBudget: estimatedBudget,
            receivedAmount: receivedAmount,
            projectValue: projectValue,
            completionPercentage: completionPercentage,
            // attachment: imgsArr
        }

        const res = await updateService(req, Project, data);
        return res;

    } else {
        try {
            const { projectName, projectNumber, city, address, builderId, constructionType, startDate, priority, completionDate, clientName, clientNumber, status, attachment, completionPercentage, tax, estimatedBudget, receivedAmount, projectValue } = req.body;
            if (!projectName || !city || !address || !builderId || !constructionType || !startDate || !completionDate || !clientName || !clientNumber || !status || !priority || !completionPercentage) {
                return { success: false, status: 400, error: 'REQUIRED_FIELDS_MISSING' };
            }
    
            let imgsArr = [];
            if (req?.files?.length > 0) {
                req.files.forEach(o => {
                    imgsArr.push(`images/project/${o.originalname}`);
                });
            }
    
            let data = {
                projectName: projectName,
                projectNumber: projectNumber,
                city: city,
                address: address,
                constructionType: constructionType,
                startDate: new Date(startDate).toISOString(),
                completionDate: new Date(completionDate).toISOString(),
                builder: builderId,
                clientName: clientName,
                clientNumber: clientNumber,
                status: status,
                // attachment: imgsArr,
                priority: priority,
                tax: tax,
                estimatedBudget: estimatedBudget,
                receivedAmount: receivedAmount,
                projectValue: projectValue,
                completionPercentage: completionPercentage,
                isDeleted: false
            };
    
            const res = await addService(req, Project, data);
            // let tempProjectId = res.id;
            return res;

            // if (tempProjectId && imgsArr?.length > 0) {
            //     imgsArr.forEach(async (o) => {
            //         const res1 = await ProjectDocument.create({ projectId: tempProjectId, attachment: o, isDeleted: false });
            //     });
            //     return res;
            // }
            
            
        } catch (error) {
            // const remove = await Project.findByIdAndDelete(tempProjectId);
            return { success: false, status: 500, message: "Something went wrong" };
        }
    }
};

export const deleteProjectService = async (req, Project) => {
    debugger
    const res = await deleteService(req, Project);
    return res;
};