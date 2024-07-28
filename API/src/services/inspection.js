import { addService, deleteService, getAllService, getAllWithoutPaginate, updateService } from "../genericServices.js";

export const getAllInspectionWithoutPaginateService = async (req, Inspection) => {
    return await getAllWithoutPaginate(req, Inspection, true);
};

export const getAllInspectionService = async (req, Inspection) => {
    const matchFieldsArr = ['name', 'displayName'];
    const sortFieldsObj = { unit1: 1, unit2: 1 };

    const res = await getAllService(req, Inspection, matchFieldsArr);
    return res;

};

export const getAllIssuesByInspectionService = async (req, InspectionIssue) => {
    try {
        const { inspectionId } = req.body;

        if (!inspectionId) return { success: false, status: 400, message: 'REQUIRED_FIELD_MISSING' };

        const q = [
            { $match: { inspectionId: inspectionId, isDeleted: false } },
            { $lookup: {
                let: { "rObjId": { "$toObjectId": "$inspectionId" } },
                from: "inspectionIssue",
                pipeline: [
                    { $match: {
                        $or: [
                            { $expr: { "$eq": [ "$_id", "$$rObjId" ] } }
                        ]
                    }},
                ],
                as: "inspectionDetails"
            }},
            { $set: {
                inspectionDetails: {
                    $arrayElemAt: ["$inspectionDetails", 0]
                }
            }},
        ];

        const res = await InspectionIssue.aggregate(q).exec();
        return { success: true, status: 200, data: res };
    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong'  }
    }
};

export const getAllInspectionByQueryService = async (req, Inspection, isPaginate) => {
    try {
        const { inspector, projectId, status, customStartDate, customEndDate, inspStartDate, inspEndDate } = req.query;
        const matchFieldsArr = ['inpectionType', 'description', 'location', 'projectDetails.projectName', 'inspectorDetails.name', 'inspectorDetails.username'];
        let matchObject = { isDeleted: false };
        let startD, endD, iStartD, iEndD = new Date();

        if (customStartDate) startD = new Date(customStartDate);
        if (customEndDate) endD = new Date(customEndDate);
        if (inspStartDate) iStartD = new Date(inspStartDate);
        if (inspEndDate) iEndD = new Date(inspEndDate);

        if (inspector) matchObject.inspector = inspector;
        if (projectId) matchObject.projectId = projectId;
        if (status) matchObject.status = { $in: JSON.parse(status) };
        if (customStartDate || customEndDate) matchObject.createdAt = { $gte: startD, $lte: endD };
        if (inspStartDate || inspEndDate) matchObject.inspectionDate = { $gte: iStartD, $lte: iEndD };

        const q = [
            { $match: matchObject },
            { $lookup: {
                let: { "iObjId": { "$toString": "$_id" } },
                from: "inspectionIssue",
                pipeline: [
                    { $match: {
                        $and: [
                            { $expr: { "$eq": [ "$inspectionId", "$$iObjId" ] } },
                            { isDeleted: false }
                        ]
                    }},
                ],
                as: "issueList"
            }},
            { $lookup: {
                let: { "rObjId": { "$toObjectId": "$inspector" } },
                from: "users",
                pipeline: [
                    { $match: {
                        $or: [
                            { $expr: { "$eq": [ "$_id", "$$rObjId" ] } }
                        ]
                    }},
                ],
                as: "inspectorDetails"
            }},
            { $set: {
                inspectorDetails: {
                    $arrayElemAt: ["$inspectorDetails", 0]
                }
            }},
        ];

        if (isPaginate) {
            const res = await getAllService(req, Inspection, matchFieldsArr, q);
            return res;
        } else {
            const res = await getAllWithoutPaginate(req, Inspection, false, q);
            return res;
        }
    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};

export const addInspectionService = async (req, Inspection, InspectionIssue) => {
    if (req.params.id) {
        const { projectId, inspectionType, description, location, inspectionDate, inspector, status, document } = req.body;

        let data = {
            projectId: projectId,
            inspectionType: inspectionType,
            description: description,
            location: location,
            inspectionDate: inspectionDate,
            inspector: inspector,
            document: document,
            status: status
       }

        const res = await updateService(req, Inspection, data);
        return res;

    } else {
        const { projectId, inspectionType, description, location, inspectionDate, inspector, status, document, issueList } = req.body;
        if (!projectId || !inspectionType || !description || !location || !inspectionDate || !inspector || !status) {
            return { success: false, status: 401, error: 'REQUIRED_FIELDS_MISSING' };
        }

        let tempIssueList = JSON.parse(issueList);
        let imgsArr = [], bodyImages;

        if (typeof document === 'string') {
            bodyImages = [JSON.parse(document)]
        } else {
            bodyImages = document;
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
                imgsArr.push(`images/inspection/${projectId}/${o.originalname}`);
            });
        }

        let data = {
            projectId: projectId,
            inspectionType: inspectionType,
            description: description,
            location: location,
            inspectionDate: inspectionDate,
            inspector: inspector,
            document: imgsArr,
            status: status,
            isDeleted: false
       }
    
        const res = await addService(req, Inspection, data);
        // return res;
        let tempInspectionId = res?.id;
        if (res?.status === 200 && tempInspectionId) {
            if (tempIssueList?.length > 0) {
                tempIssueList.forEach(async (item) => {
                    let obj = {
                        inspectionId: tempInspectionId,
                        inspectionTitle: item.inspectionTitle,
                        description: item.description,
                        location: item.location,
                        severity: item.severity,
                        issueDeadline: new Date(item.issueDeadline)?.toISOString(),
                        status: item.status,
                        isDeleted: false
                    }
                    const addInspectionIssue = await addService(req, InspectionIssue, obj);
                    if (addInspectionIssue.status !== 200) {
                        await Inspection.findByIdAndDelete(tempInspectionId);
                        await InspectionIssue.deleteMany({ inspectionId: tempInspectionId });
                        return addInspectionIssue;
                    }
                })
            }
            return res;
        }
        await Inspection.findByIdAndDelete(tempInspectionId);
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};

export const deleteInspectionService = async (req, Inspection) => {
    const res = await deleteService(req, Inspection);
    return res;
};