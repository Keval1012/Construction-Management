import { addService, deleteService, getAllService, getAllWithoutPaginate, updateService } from "../genericServices.js";

export const getAllEquipmentRequestWithoutPaginateService = async (req, EquipmentRequest) => {
    return await getAllWithoutPaginate(req, EquipmentRequest, true);
};

export const getAllEquipmentRequestService = async (req, EquipmentRequest) => {
    const matchFieldsArr = ['name', 'displayName'];
    const sortFieldsObj = { unit1: 1, unit2: 1 };

    const res = await getAllService(req, EquipmentRequest, matchFieldsArr);
    return res;

};

export const getEquipmentRequestsByStatusService = async (req, EquipmentRequest, isPaginate) => {
    const { searchValue, projectId, taskId, equipmentId, requester } = req.query;
    let status = JSON.parse(req.query?.status);
    const tempMatchArr = ['projectDetails.projectName', 'taskDetails.taskName', 'equipmentDetails.eqptNameDetails.name', 'requesterDetails.name', 'quantity', 'location'];
    let matchFilterArray = [];

    if (!status) return { success: false, status: 400, message: 'REQUIRED_FIELD_MISSING' };
    let matchObject = {
        isDeleted: false,
        status: {
            $in: status
        }
    };
    // let grpMatchObj = '$equipmentId';

    if (tempMatchArr?.length > 0) {
        tempMatchArr.forEach(ele => {
            let filter = {};
            filter[ele] = { $regex: '.*' + searchValue + '.*', $options: 'i' };
            matchFilterArray.push(filter);
        });
    }

    if (projectId) {
        matchObject['projectId'] = projectId;
        // if (typeof grpMatchObj === 'string') grpMatchObj = { equipmentId: '$equipmentId' };
        // grpMatchObj['projectId'] = '$projectId';
        // grpMatchObj = { equipmentId: '$equipmentId', projectId: '$projectId' };
    }
    if (taskId) {
        matchObject['taskId'] = taskId;
        // if (typeof grpMatchObj === 'string') grpMatchObj = { equipmentId: '$equipmentId' };
        // grpMatchObj['taskId'] = '$taskId';
    }
    if (equipmentId) {
        matchObject['equipmentId'] = equipmentId;
        // if (typeof grpMatchObj === 'string') grpMatchObj = { equipmentId: '$equipmentId' };
        // grpMatchObj['taskId'] = '$taskId';
    }
    if (requester) matchObject['requester'] = requester;

    // if (searchValue) matchObject.$or = matchFilterArray;

    const q = [
        { $match: matchObject },
        // { $match: {
        //     // equipmentId: req.query?.equipmentId,
        //     status: 'approved'
        //     // wonOrLost: { $ne: 'noResults' }
        // }},
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
        { $lookup: {
            let: { "tObjId": { "$toObjectId": "$taskId" } },
            from: "task",
            pipeline: [
                {
                    $match: {
                        $or: [
                            { $expr: { "$eq": ["$_id", "$$tObjId"] } }
                        ]
                    }
                },
                {
                    $lookup: {
                        let: { "uObjId": { "$toObjectId": "$assignTo" } },
                        from: "users",
                        pipeline: [
                            {
                                $match: {
                                    $or: [
                                        { $expr: { "$eq": ["$_id", "$$uObjId"] } }
                                    ]
                                }
                            },
                        ],
                        as: "assignToDetails"
                    }
                },
                {
                    $set: {
                        assignToDetails: {
                            $arrayElemAt: ["$assignToDetails", 0]
                        },
                    }
                },
            ],
            as: "taskDetails"
        }},
        { $lookup: {
            let: { "eObjId": { "$toObjectId": "$equipmentId" } },
            from: "equipment",
            pipeline: [
                { $match: {
                    $or: [
                        { $expr: { "$eq": ["$_id", "$$eObjId"] } }
                    ]
                }},
                { $lookup: {
                    let: { "enObjId": { "$toObjectId": "$equipmentName" } },
                    from: "equipmentName",
                    pipeline: [
                        {
                            $match: {
                                $or: [
                                    { $expr: { "$eq": ["$_id", "$$enObjId"] } }
                                ]
                            }
                        },
                    ],
                    as: "eqptNameDetails"
                }
                },
                {
                    $set: {
                        eqptNameDetails: {
                            $arrayElemAt: ["$eqptNameDetails", 0]
                        }
                    }
                },
            ],
            as: "equipmentDetails"
        }},
        { $lookup: {
            let: { "rObjId": { "$toObjectId": "$requester" } },
            from: "users",
            pipeline: [
                {
                    $match: {
                        $or: [
                            { $expr: { "$eq": ["$_id", "$$rObjId"] } }
                        ]
                    }
                },
            ],
            as: "requesterDetails"
        }},
        { $set: {
            projectDetails: {
                $arrayElemAt: ["$projectDetails", 0]
            },
            equipmentDetails: {
                $arrayElemAt: ["$equipmentDetails", 0]
            },
            taskDetails: {
                $arrayElemAt: ["$taskDetails", 0]
            },
            requesterDetails: {
                $arrayElemAt: ["$requesterDetails", 0]
            },
        }},
    ];

    if (searchValue) q.push({ $match: { $or: matchFilterArray } });

    q.push({ $group: {
        // _id: null,
        // _id: grpMatchObj,
        _id: '$equipmentId',
        // "_id": '$projectId',
        requests: { $push : "$$ROOT" },
        "inUseCount": {
            "$sum": { "$cond": [{ "$eq": ["$status", "approved"] }, { "$toDouble": "$quantity"}, 0] }
        },
        // "taskId": { $first: "$taskId" },
        // "projectId": { $first: "$projectId" },
        // "equipmentId": { $first: "$equipmentId" },
        // "requester": { $first: "$requester" },
        // "quantity": { $first: "$quantity" },
        // "fromDate": { $first: "$fromDate" },
        // "toDate": { $first: "$toDate" },
        // "status": { $first: "$status" },
        // "location": { $first: "$location" },
        // "attachment": { $first: "$attachment" },
        // inUseCount: { $sum: '$quantity' },
        // requests: { $push : "$$ROOT" },
        // totalPoints: { $sum: {$cond: [{$eq: ["$wonOrLost", "won"]}, '$points', {$multiply: ['$points', -1]}]}},
    }}, { $sort: { "createdAt": 1 } });

    if (isPaginate) {
        q.push({ $skip: parseInt(req.query?.skip) }, { $limit: parseInt(req.query?.take) });
        const res = await EquipmentRequest.aggregate(q).exec();
        return { success: true, status: 200, data: res };
        // const res = await getAllService(req, EquipmentRequest, matchFieldsArr, q);
        // return res;
    } else {
        const res = await getAllWithoutPaginate(req, EquipmentRequest, false);
        return res;
    }
};

export const changeStatusOfEqptReqService = async (req, EquipmentRequest) => {
    try {
        const { id } = req.params;
        const { status, attachment } = req.body;
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
                imgsArr.push(`images/equipmentRequest/${id}/${o.originalname}`);
            });
        }
        if (req?.file) {
            imgsArr.push(`images/equipmentRequest/${id}/${req?.file?.originalname}`);
        }

        if (!id) return { success: false, status: 404, message: 'NOT_FOUND' };
        if (!status) return { success: false, status: 400, message: 'REQUIRED_FIELD_MISSING' };

        const update = await EquipmentRequest.findByIdAndUpdate(id, { status: status, attachment: imgsArr });
        return { success: true, status: 200, message: 'Status Updated Successfully' };
    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};

export const updateEqptReqDocumentsService = async (req, EquipmentRequest) => {
    const { equipmentRequestId, attachment } = req.body;

    if (!equipmentRequestId) return { success: false, status: 400, message: 'REQUIRED_FIELDS_MISSING' };

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
            imgsArr.push(`images/equipmentRequest/${equipmentRequestId}/${o.originalname}`);
        });
    }

    let data = {
        attachment: imgsArr
    }

    const res = await updateService(req, EquipmentRequest, data, equipmentRequestId);
    return res;
};

export const addEquipmentRequestService = async (req, EquipmentRequest) => {
    if (req.params.id) {
        const { projectId, taskId, equipmentId, quantity, requester, fromDate, toDate, location, approvedBy, attachment, status } = req.body;

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
                imgsArr.push(`images/equipmentRequest/${req.params.id}/${o.originalname}`);
            });
        }

        let data = {
            projectId: projectId,
            taskId: taskId,
            equipmentId: equipmentId,
            quantity: quantity,
            requester: requester,
            fromDate: new Date(fromDate).toISOString(),
            toDate: new Date(toDate).toISOString(),
            location: location,
            approvedBy: approvedBy,
            attachment: imgsArr,
            status: status
        }

        const res = await updateService(req, EquipmentRequest, data);
        return res;

    } else {
        const { projectId, taskId, equipmentId, quantity, requester, fromDate, toDate, location, approvedBy, attachment, status } = req.body;
        if (!projectId || !taskId || !equipmentId || !quantity || !requester || !fromDate || !toDate || !location || !status) {
            return { success: false, status: 400, error: 'REQUIRED_FIELDS_MISSING' };
        }

        // const isExist = await EquipmentRequest.findOne({ projectId: projectId, taskId: taskId, equipmentId: equipmentId, requester: requester, status: 'pending' });
        // if (isExist) return { success: false, status: 409, message: 'Already One Request Pending!' };        

        let data = {
            projectId: projectId,
            taskId: taskId,
            equipmentId: equipmentId,
            quantity: quantity,
            requester: requester,
            fromDate: new Date(fromDate).toISOString(),
            toDate: new Date(toDate).toISOString(),
            location: location,
            // approvedBy: approvedBy,
            // attachment: attachment,
            status: status
        }

        const res = await addService(req, EquipmentRequest, data);
        return res;

    }
};

export const deleteEquipmentRequestService = async (req, EquipmentRequest) => {
    const res = await deleteService(req, EquipmentRequest);
    return res;
};