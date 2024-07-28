
import { getAllService, getAllWithoutPaginate } from "../genericServices.js";

export const getAllUserRoleWithoutPaginateService = async (req, UserRole) => {

    const extraSubQuery = [
        { $lookup: {
            let: { "userObjId": { "$toObjectId": "$userId" } },
            from: "users",
            pipeline: [
                { $match: { 
                    $or: [
                        { $expr: { "$eq": [ "$_id", "$$userObjId" ] } }
                    ]
                } }
            ],
            as: "usersDetails"
        }},
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
            usersDetails: {
                $arrayElemAt: ["$usersDetails", 0]
            },
            roleDetails: {
                $arrayElemAt: ["$roleDetails", 0]
            }
        }}
    ];

    return await getAllWithoutPaginate(req, UserRole, true, extraSubQuery);
};

export const getAllUserRoleService = async (req, UserRole) => {
    const matchFieldsArr = ['name', 'surname', 'email', 'mobile'];
    const sortFieldsObj = { name: 1 };

    const res = await getAllService(req, UserRole, matchFieldsArr);
    return res;
};
