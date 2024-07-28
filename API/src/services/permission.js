import { getAllWithoutPaginate } from "../genericServices.js";

export const getAllModulePermissionWithoutPaginateService = async (req, ModulePermission) => {
    return await getAllWithoutPaginate(req, ModulePermission, false);
};

export const addUpdateAccessPermissionsByRoleService = async (req, AccessPermission) => {
    try {
        const { roleId, permissionList } = req.body;

        if (!roleId || !permissionList || permissionList.length === 0) return { success: false, status: 400, message: 'REQUIRED_FIELDS_MISSING - (roleId, permissionList)' }

        const removeAll = await AccessPermission.deleteMany({ roleId: roleId });
        permissionList.forEach(async (o) => {
            const addNew = await AccessPermission.create({
                name: o,
                roleId: roleId,
                isGranted: true
            });
            if (!addNew) {
                const removeAll = await AccessPermission.deleteMany({ roleId: roleId });
                return { success: false, status: 500, message: 'Something went wrong' };
            }
        });

        return { success: true, status: 200, message: 'Permissions Added Successfully' };

    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong', error: error };
    }
};

export const getAllAccessPermissionByUserIdService = async (req, AccessPermission, UserRole, byRoleId = false) => {
    if (!req.params.id) return { success: false, status: 404, message: 'Not Found with given id' };

    let roleId = '';
    if (byRoleId) roleId = req.params.id;

    const findUserRole = await UserRole.findOne({ userId: req.params.id });
    if (!byRoleId && findUserRole) roleId = findUserRole?.roleId;

    if (!roleId) return { success: false, status: 400, message: 'ID_NOT_FOUND' };

    const extraSubQuery = [
        { $match: { roleId: roleId } },
        { $lookup: {
            let: { "roleObjId": { "$toObjectId": "$roleId" } },
            from: "role",
            pipeline: [
                { $match: { 
                    $or: [
                        { $expr: { "$eq": [ "$_id", "$$roleObjId" ] } }
                    ]
                } }
            ],
            as: "roleDetails"
        }},
        { $set: {
            roleDetails: {
                $arrayElemAt: ["$roleDetails", 0]
            }
        }}
    ];

    return await getAllWithoutPaginate(req, AccessPermission, false, extraSubQuery);
};