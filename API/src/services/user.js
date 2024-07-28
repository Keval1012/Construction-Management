
import { addService, deleteService, getAllService, getAllWithoutPaginate, getByIdService, updateService } from "../genericServices.js";

export const getAllUserWithoutPaginateService = async (req, User) => {
    return await getAllWithoutPaginate(req, User, true);
};

export const getAllCountByMonthService = async (req, Model) => {
    try {
        const { year } = req.query;

        const q = [
            { $match: {
                $expr: {
                    $eq: [{ $year: "$createdAt" }, Number(year) || new Date().getFullYear()]
                }}
            },
            { $group: {
                // _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                _id: { $month: "$createdAt" }, 
                numberOfCount: { $sum: 1 }
            }}
        ];

        const res = await Model.aggregate(q).exec();
        return { success: true, status: 200, data: res };
    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};

export const getAllUserCountService = async (req, User) => {
    try {
        const { lastDay, customStartDate, customEndDate } = req.query;

        // let d = new Date();
        // if (lastDay) d.setDate(d.getDate() - Number(lastDay));
        // if (customDate) d = new Date(customDate);
        // let matchObj = { isDeleted: false };

        // if (lastDay || customDate) {
        //     // matchObj.createdAt = { $gte: new Date(2015, 6, 1), $lt: new Date(2015, 7, 1) };
        //     matchObj.createdAt = { $gte: d };
        // };


        let startD = new Date();
        let endD = new Date();
        if (lastDay) startD.setDate(startD.getDate() - Number(lastDay));
        if (customStartDate) startD = new Date(customStartDate);
        if (customEndDate) endD = new Date(customEndDate);
        let matchObj = { isDeleted: false };

        if (lastDay) {
            matchObj.createdAt = { $gte: startD };
        };
        if (customStartDate || customEndDate) {
            // matchObj.createdAt = { $gte: new Date(2015, 6, 1), $lt: new Date(2015, 7, 1) };
            matchObj.createdAt = { $gte: startD, $lte: endD };
        };

        const q = [
            { $match: matchObj },
            {
                $group: {
                    _id: null,
                    // _id: {
                    //     $dateTrunc: {
                    //         date: "$createdAt", unit: "day"
                    //     }
                    // },
                    count: { $sum: 1 }
                }
            }
        ];

        const res = await User.aggregate(q).exec();
        return { success: true, status: 200, data: res };
    } catch (error) {
        return { success: false, status: 500, message: 'something went wrong' };
    }
};

export const getUserDataByIdService = async (req, User, mongoose) => {
    try {
        if (!req?.params?.id) return { success: false, status: 400, message: 'REQUIRED_FIELD_MISSING' };

        const res = await getByIdService(req, User, mongoose);
        return res;

    } catch (error) {
        return { success: false, status: 500, message: "Something went wrong" }
    }
};

export const getTotalCountService = async (req, User, UserRole, Role, RoleName) => {
    try {
        const { builderId, lastDay, customStartDate, customEndDate } = req.query;

        const findRole = await Role.findOne({ name: RoleName });
        let startD = new Date();
        let endD = new Date();
        if (lastDay) startD.setDate(startD.getDate() - Number(lastDay));
        if (customStartDate) startD = new Date(customStartDate);
        if (customEndDate) endD = new Date(customEndDate);
        let matchObj = { isDeleted: false };

        if (lastDay) {
            matchObj.createdAt = { $gte: startD };
        };
        if (customStartDate || customEndDate) {
            // matchObj.createdAt = { $gte: new Date(2015, 6, 1), $lt: new Date(2015, 7, 1) };
            matchObj.createdAt = { $gte: startD, $lte: endD };
        };

        let matchArr = [
            { "$expr": { "$eq": ["$userRoleDetails.roleId", { "$toString": findRole.id }] } },
            matchObj,
        ];

        if (builderId) {
            matchArr.push({ builderId: builderId });
        }

        const q = [
            {
                $lookup: {
                    let: { "userObjId": { "$toString": "$_id" } },
                    from: "userRole",
                    pipeline: [
                        {
                            $match: {
                                $or: [
                                    { $expr: { "$eq": ["$userId", "$$userObjId"] } }
                                ]
                            }
                        },
                        {
                            $lookup: {
                                let: { "roleObjId": { "$toObjectId": "$roleId" } },
                                from: "role",
                                pipeline: [
                                    {
                                        $match: {
                                            $or: [
                                                { $expr: { "$eq": ["$_id", "$$roleObjId"] } }
                                            ]
                                        }
                                    },
                                ],
                                as: "roleDetails"
                            }
                        },
                        {
                            $set: {
                                roleDetails: {
                                    $arrayElemAt: ["$roleDetails", 0]
                                }
                            }
                        },
                    ],
                    as: "userRoleDetails"
                }
            },
            {
                $unwind: {
                    path: "$userRoleDetails",
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $match: {
                    $and: matchArr
                }
            },
            // { $match: { isDeleted: false } },
            // { $group: { _id: null, count: { $sum: 1 } } }
            {
                $group: {
                    _id: {
                        $dateTrunc: {
                            date: "$createdAt", unit: "day"
                        }
                    },
                    count: { $sum: 1 }
                }
            }
        ];

        const res = await User.aggregate(q).exec();
        return { success: true, status: 200, data: res };

    } catch (error) {
        return { success: false, status: 500, message: "Something went wrong" }
    }
};

export const getRoleByUserIdService = async (req, UserRole, Role) => {
    try {
        const { userId } = req.body;
        if (!userId) return { success: false, status: 400, message: "REQUIRED_FIELD_MISSING - (userId)" }

        const findUserRole = await UserRole.findOne({ userId: userId });

        const findRole = await Role.findById(findUserRole.roleId);

        if (findRole) return { success: true, status: 200, role: findRole.name }
        else return { success: false, status: 404, isValid: false }

    } catch (error) {
        return { success: false, status: 500, message: "Something went wrong" }
    }
};

export const getAllUserService = async (req, User, UserRole) => {
    const matchFieldsArr = ['name', 'surname', 'email', 'mobile', 'jobTitle'];
    const sortFieldsObj = { name: 1 };

    const extraSubQuery = [
        { $match: { isDeleted: false } },
        {
            $lookup: {
                let: { "userObjId": { "$toString": "$_id" } },
                from: "userRole",
                pipeline: [
                    {
                        $match: {
                            $or: [
                                { $expr: { "$eq": ["$userId", "$$userObjId"] } }
                            ]
                        }
                    },
                    {
                        $lookup: {
                            let: { "roleObjId": { "$toObjectId": "$roleId" } },
                            from: "role",
                            pipeline: [
                                {
                                    $match: {
                                        $or: [
                                            { $expr: { "$eq": ["$_id", "$$roleObjId"] } }
                                        ]
                                    }
                                },
                            ],
                            as: "roleDetails"
                        }
                    },
                    {
                        $set: {
                            roleDetails: {
                                $arrayElemAt: ["$roleDetails", 0]
                            }
                        }
                    },
                ],
                as: "userRoleDetails"
            }
        },
        {
            $set: {
                userRoleDetails: {
                    $arrayElemAt: ["$userRoleDetails", 0]
                }
            }
        },
        // { $match:{
        //     $or: [
        //         // { "$expr": { "$eq": [ "$usersDetails.roleId", { "$toString": findRole.id } ] } },
        //         { isDeleted: false }
        //     ]
        // }},
        // { $project: {
        //     // 'password': 0,
        //     // 'createdAt': 0,
        //     // 'updatedAt': 0,
        //     // 'isDeleted': 0
        //     '_id': 1,
        //     'name': 1,
        //     'surname': 1,
        //     'username': 1,
        //     'email': 1,
        //     'image': 1,
        //     'mobile': 1,
        //     'documentUrl': 1,
        //     'status': 1,
        //     'createdAt': 1,
        //     'roleDetails': "userRoleDetails.roleDetails",
        // }}
    ]

    const res = await getAllService(req, User, matchFieldsArr, extraSubQuery);
    // const res = await getAllService(req, UserRole, matchFieldsArr);
    return res;
};

export const getAllEmployeeByBuilderService = async (req, User, Role, isPaginate) => {
    try {
        let builderId, jobTitle;
        const matchFieldsArr = ['name', 'surname', 'email', 'mobile', 'jobTitle'];
        if (isPaginate) {
            builderId = req.query?.builderId;
            jobTitle = req.query?.jobTitle;
        } else {
            jobTitle = req.body?.jobTitle;
            builderId = req.body?.builderId;
        }
        // const { builderId } = req.body;
        const findRole = await Role.findOne({ name: 'employee' });

        let matchArr = [
            { "$expr": { "$eq": ["$userRoleDetails.roleId", { "$toString": findRole.id }] } },
            { isDeleted: false },
            { builderId: builderId }
        ];

        if (jobTitle) matchArr.push({ jobTitle: jobTitle });

        const q = [
            {
                $lookup: {
                    let: { "userObjId": { "$toString": "$_id" } },
                    from: "userRole",
                    pipeline: [
                        {
                            $match: {
                                $or: [
                                    { $expr: { "$eq": ["$userId", "$$userObjId"] } }
                                ]
                            }
                        },
                        {
                            $lookup: {
                                let: { "roleObjId": { "$toObjectId": "$roleId" } },
                                from: "role",
                                pipeline: [
                                    {
                                        $match: {
                                            $or: [
                                                { $expr: { "$eq": ["$_id", "$$roleObjId"] } }
                                            ]
                                        }
                                    },
                                ],
                                as: "roleDetails"
                            }
                        },
                        {
                            $set: {
                                roleDetails: {
                                    $arrayElemAt: ["$roleDetails", 0]
                                }
                            }
                        },
                    ],
                    as: "userRoleDetails"
                }
            },
            {
                $unwind: {
                    path: "$userRoleDetails",
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $match: {
                    $and: matchArr
                }
            },
            // { $project: {
            //     'password': 0,
            //     'createdAt': 0,
            //     'updatedAt': 0,
            //     'isDeleted': 0  
            // }}
        ];

        if (isPaginate) {
            const res = await getAllService(req, User, matchFieldsArr, q);
            return res;
        } else {
            const list = await User.aggregate(q).exec();
            return { success: true, status: 200, data: list };
        }

    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};

export const getAllForSpecificRoleService = async (req, User, Role, RoleName, isPaginate) => {
    try {
        const matchFieldsArr = ['name', 'surname', 'email', 'mobile', 'jobTitle'];
        const findRole = await Role.findOne({ name: RoleName });

        let matchArr = [
            { "$expr": { "$eq": ["$userRoleDetails.roleId", { "$toString": findRole.id }] } },
            { isDeleted: false }
        ];

        if (req.query.jobTitle) matchArr.push({ jobTitle: jobTitle });

        const q = [
            {
                $lookup: {
                    let: { "userObjId": { "$toString": "$_id" } },
                    from: "userRole",
                    pipeline: [
                        {
                            $match: {
                                $or: [
                                    { $expr: { "$eq": ["$userId", "$$userObjId"] } }
                                ]
                            }
                        }
                    ],
                    as: "userRoleDetails"
                }
            },
            {
                $unwind: {
                    path: "$userRoleDetails",
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $match: {
                    $and: matchArr
                }
            },
            // { $project: {
            //     'password': 0,
            //     'createdAt': 0,
            //     'updatedAt': 0,
            //     'isDeleted': 0  
            // }}
        ];

        if (isPaginate) {
            const res = await getAllService(req, User, matchFieldsArr, q);
            return res;
        } else {
            q.push({
                $project: {
                    'password': 0,
                    'createdAt': 0,
                    'updatedAt': 0,
                    'isDeleted': 0
                }
            });
            const list = await User.aggregate(q).exec();
            return { success: true, status: 200, data: list };
        }
        // return await getAllWithoutPaginate(req, User, true, )

    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};

// export const getAllUserCompanyByUserIdService = async (req, UserCompany) => {
//     const extraSubQuery = [
//         { $match: { isDeleted: false, userId: req.params.id } },
//         { $lookup: {
//             let: { "userObjId": { "$toObjectId": "$userId" } },
//             from: "users",
//             pipeline: [
//                 { $match: { 
//                     $or: [
//                         { $expr: { "$eq": [ "$_id", "$$userObjId" ] } }
//                     ]
//                 }}
//             ],
//             as: "userDetails"
//         }},
//         { $lookup: {
//             let: { "companyObjId": { "$toObjectId": "$companyId" } },
//             from: "company",
//             pipeline: [
//                 { $match: { 
//                     $or: [
//                         { $expr: { "$eq": [ "$_id", "$$companyObjId" ] } }
//                     ]
//                 } }
//             ],
//             as: "companyDetails"
//         }},
//         { $set: {
//             userDetails: {
//                 $arrayElemAt: ["$userDetails", 0]
//             },
//             companyDetails: {
//                 $arrayElemAt: ["$companyDetails", 0]
//             }
//         }}
//     ];
//     const res = await getAllWithoutPaginate(req, UserCompany, false, extraSubQuery);
//     return res;
// }; 

export const addUpdateUserService = async (req, User, Role, UserRole, bcrypt) => {
    if (req.params.id) {

        const { name, surname, username, email, mobile, image, jobTitle, password, builderId, documentUrl, status } = req.body;

        let data = {
            name: name,
            surname: surname,
            username: username,
            email: email,
            mobile: mobile,
            image: image,
            builderId: builderId,
            jobTitle: jobTitle,
            // password: password ? password : '',
            documentUrl: documentUrl,
            // status: status ? JSON.parse(status) : ''
            status: status
        }

        const res = await updateService(req, User, data);
        return res;

    } else {
        const { name, surname, username, email, mobile, builderId, jobTitle, image, password, documentUrl, role, status } = req.body;
        if (!name || !surname || !username || !email || !mobile || !password || !role || (status !== false && status !== true)) {
            return { success: false, status: 400, error: 'REQUIRED_FIELDS_MISSING - (name, surname, username, email, role, mobile, password, status)' };
        }

        const findRole = await Role.findById(role);

        // if (findRole?.name === 'employee' && (!builderId || !jobTitle)) return { success: false, status: 400, message: 'REQUIRED_FIELD_MISSING' };
        if (findRole?.name === 'employee' && (!builderId)) return { success: false, status: 400, message: 'REQUIRED_FIELD_MISSING' };

        // const existUser = await User.findOne({ username: username });
        let isExistUser = false;
        if (findRole?.name === 'employee') {
            const existUser = await User.findOne({ username: username, builderId: builderId });
            if (existUser) isExistUser = true;
        }

        if (findRole?.name === 'builder') {
            const findBuilderRole = await Role.findOne({ name: 'builder' });
            const q = [
                {
                    $lookup: {
                        let: { "userObjId": { "$toString": "$_id" } },
                        from: "userRole",
                        pipeline: [
                            {
                                $match: {
                                    $or: [
                                        { $expr: { "$eq": ["$userId", "$$userObjId"] } }
                                    ]
                                }
                            }
                        ],
                        as: "userRoleDetails"
                    }
                },
                {
                    $unwind: {
                        path: "$userRoleDetails",
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $match: {
                        $and: [
                            { "$expr": { "$eq": ["$userRoleDetails.roleId", { "$toString": findBuilderRole.id }] } },
                            { isDeleted: false },
                            { username: username }
                        ]
                    }
                },
            ];

            // const existUser = await User.aggregate(q).exec();
            const existUser = await User.findOne({ username: username, builderId: builderId });
            if (existUser) isExistUser = true;
        }

        // if (existUser || existUser?.length > 0) return { success: false, status: 400, message: 'This username is already taken.' };
        if (isExistUser) return { success: false, status: 400, message: 'This username is already taken.' };

        const passHash = await bcrypt.hash(password, 9);

        let tempUserId = '';
        let data = {
            name: name,
            surname: surname,
            username: username,
            email: email,
            builderId: builderId,
            jobTitle: jobTitle,
            mobile: mobile,
            image: image ? image : '',
            password: passHash,
            documentUrl: documentUrl ? documentUrl : '',
            status: JSON.parse(status),
            isDeleted: false
        }

        try {
            const addUser = await addService(req, User, data);
            tempUserId = addUser.id;
            if (addUser.status === 200) {

                // const newUserRole = await UserRole.addService({ userId: tempUserId, roleId: findRole.id });
                const newUserRole = await addService(req, UserRole, { userId: tempUserId, roleId: findRole.id });

                if (newUserRole.status !== 200) {
                    await User.findByIdAndDelete(mongoose.Types.ObjectId(tempUserId));
                    await UserRole.deleteMany({ userId: tempUserId });
                    return newUserRole;
                }
            }
            return addUser;

        } catch (error) {
            await User.findByIdAndDelete(mongoose.Types.ObjectId(tempUserId));
            return { success: false, status: 500, message: 'something went wrong', error: error };
        }
    }
};

export const deleteUserService = async (req, User) => {
    const res = await deleteService(req, User);
    return res;
};
