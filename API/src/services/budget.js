import { addService, deleteService, getAllService, getAllWithoutPaginate, updateService } from "../genericServices.js";

export const getAllBudgetWithoutPaginateService = async (req, Budget) => {
    return await getAllWithoutPaginate(req, Budget, true);
};

export const getAllBudgetByProjectAndCategoryGroupService = async (req, Budget, isPaginate) => {
    try {
        const { projectId, status } = req.query;
        
        if (!projectId) return { success: false, status: 400, message: 'ProjectId Not Found!' };
        // const matchFieldsArr = ['budgetList.budgetName', 'projectDetails.projectName', 'categoryDetails.name', 'budgetList.description', 'budgetList.totalAmount'];
        const matchFieldsArr = ['budgetName', 'projectDetails.projectName', 'catDetail.name', 'description', 'totalAmount'];

        let matchObj = { isDeleted: false, projectId: projectId };
        if (status && status?.length > 0) matchObj.status = { $in: JSON.parse(status) }

        const q = [
            { $match: matchObj },
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
            { $lookup: {
                let: { "cObjId": { "$toObjectId": "$category" } },
                from: "budgetCategory",
                pipeline: [
                    { $match: {
                        $or: [
                            { $expr: { "$eq": ["$_id", "$$cObjId"] } }
                        ]
                    }},
                ],
                as: "catDetail"
            }},
            { $set: {
                catDetail: {
                    $arrayElemAt: ["$catDetail", 0]
                },
            }},
            { $group: {
                _id: '$category',
                totalBudget: { $sum: { $cond: [ { $or: [{ $eq: ["$status", "approved"] }, { $eq: ["$status", "closed"] }] }, { "$toDouble": "$totalAmount" }, 0] } },
                budgetList: { $push : "$$ROOT" },
                categoryDetails: { $first: "$catDetail" },
            }},
            { $sort: { "createdAt": 1 } }
        ];

        if (isPaginate) {
            const res = await getAllService(req, Budget, matchFieldsArr, q);
            return res;
        } else {
            const res = await Budget.aggregate(q).exec();
            return { success: true, status: 200, data: res };
        }

    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};

export const getAllBudgetByProjectIdService = async (req, Budget, isPaginate) => {
    try {
        const { projectId, category, status } = req.query;
        
        if (!projectId) return { success: false, status: 400, message: 'ProjectId Not Found!' };
        const matchFieldsArr = ['budgetName', 'projectDetails.projectName', 'categoryDetails.name', 'description', 'totalAmount'];
        let matchObj = {
            projectId: projectId,
            isDeleted: false
        }

        if (category) matchObj.category = category; 
        if (status && status?.length > 0) matchObj.status = { $in: JSON.parse(status) };

        const q = [
            { $match: matchObj},
            { $lookup: {
                let: { "pObjId": { "$toObjectId": "$projectId" } },
                from: "project",
                pipeline: [
                    {
                        $match: {
                            $or: [
                                { $expr: { "$eq": ["$_id", "$$pObjId"] } }
                            ]
                        }
                    },
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
            const res = await getAllService(req, Budget, matchFieldsArr, q);
            return res;
        } else {
            const res = await getAllWithoutPaginate(req, Budget, false, q);
            return res;
        }

    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};

export const getAllBudgetService = async (req, Budget) => {
    const matchFieldsArr = ['budgetName', 'budgetNumber'];
    const sortFieldsObj = { budgetName: 1, budgetNumber: 1 };

    const res = await getAllService(req, Budget, matchFieldsArr);
    return res;
};

export const addBudgetService = async (req, Budget) => {
    if (req.params.id) {
        const { budgetName, description, category, totalAmount, startDate, endDate, status } = req.body;

        let data = {
            budgetName: budgetName,
            description: description,
            totalAmount: totalAmount,
            category: category,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            status: status,
        }

        const res = await updateService(req, Budget, data);
        return res;

    } else {
        const { budgetName, projectId, description, category, totalAmount, startDate, endDate, status } = req.body;
        if (!budgetName || !projectId || !description || !category || !totalAmount || !startDate || !endDate || !status) {
            return { success: false, status: 400, error: 'REQUIRED_FIELDS_MISSING' };
        }

        let data = {
            budgetName: budgetName,
            projectId: projectId,
            description: description,
            category: category,
            totalAmount: totalAmount,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            status: status,
            isDeleted: false
        }
    
        const res = await addService(req, Budget, data);
        return res;

    }
};

export const deleteBudgetService = async (req, Budget) => {
    const res = await deleteService(req, Budget);
    return res;
};