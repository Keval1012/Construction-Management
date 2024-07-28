import { addService, deleteService, getAllService, getAllWithoutPaginate, updateService } from "../genericServices.js";

export const getAllMilestoneWithoutPaginateService = async (req, Milestone) => {
    return await getAllWithoutPaginate(req, Milestone, true);
};

export const getAllMilestoneByProjectIdService = async (req, Milestone) => {
    try {
        const { projectId } = req.query;

        if (!projectId) return { success: false, status: 400, message: 'ProjectId Not Found!' };

        const q = [
            { $match: { projectId: projectId, isDeleted: false }},
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

        const res = await getAllWithoutPaginate(req, Milestone, false, q);
        return res;

    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};

export const getAllMilestoneService = async (req, Milestone) => {
    const matchFieldsArr = ['milestoneName', 'milestoneNumber'];
    const sortFieldsObj = { milestoneName: 1, milestoneNumber: 1 };

    const res = await getAllService(req, Milestone, matchFieldsArr);
    return res;
};

export const addMilestoneService = async (req, Milestone) => {
    if (req.params.id) {
        const { milestoneName, milestoneNumber, dependencies, description, startDate, endDate, priority, status, progress } = req.body;

        let data = {
            milestoneName: milestoneName,
            milestoneNumber: milestoneNumber,
            description: description,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            priority: priority,
            status: status,
            dependencies: dependencies,
            progress: progress,
        }

        const res = await updateService(req, Milestone, data);
        return res;

    } else {
        const { milestoneName, milestoneNumber, dependencies, projectId, description, startDate, endDate, priority, status, progress } = req.body;
        if (!milestoneName || !projectId || !description || !startDate || !endDate || !priority || !status || !(progress).toString()) {
            return { success: false, status: 400, error: 'REQUIRED_FIELDS_MISSING' };
        }

        let data = {
            milestoneName: milestoneName,
            milestoneNumber: milestoneNumber ? milestoneNumber : '',
            projectId: projectId,
            description: description,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            priority: priority,
            status: status,
            progress: progress,
            dependencies: dependencies ? dependencies : '',
            isDeleted: false
        }
    
        const res = await addService(req, Milestone, data);
        return res;

    }
};

export const deleteMilestoneService = async (req, Milestone) => {
    const res = await deleteService(req, Milestone);
    return res;
};