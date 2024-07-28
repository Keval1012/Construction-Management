
export const getAllWithoutPaginate = async (req, Model, isDeleted = false, extraSubQuery = []) => {
    if (extraSubQuery.length > 0) {
        try {
            let subQuery = [];
            let countQueryMatch;
            let countQuery;

            if (extraSubQuery.length > 0) {
                extraSubQuery.forEach(ele => {
                    subQuery.push(ele);
                });
            }

            if (isDeleted) {
                subQuery.push({ $match: { isDeleted: false } });
                countQueryMatch = { $match: { isDeleted: false } }
            }

            if (countQueryMatch) {
                countQuery = [
                    countQueryMatch,
                    { $count: "totalLength" },
                ];
            } else {
                countQuery = [{ $count: "totalLength" } ];
            }

            const query = [
                { $facet: {
                    "list": subQuery,
                    "count": countQuery
                }},
                { $project: { 
                    list: 1,
                    totalLength: { $arrayElemAt: [ '$count.totalLength', 0 ] },
                }},
            ];

            const list = await Model.aggregate(query).exec();
            return { success: true, status: 200, data: list[0]?.list, totalLength: list[0]?.totalLength };

        } catch (error) {
            return { success: false, status: 500, message: 'Something went wrong', error: error };
        }
        
    } else {
        try {
            let allData;
            if (isDeleted) {
                allData = await Model.find({ isDeleted: false }, { isDeleted: 0, updatedAt: 0, createdAt: 0 });
            } else {
                allData = await Model.find();
            }
            return { success: true, status: 200, data: allData, totalLength: allData.length };
    
        } catch (error) {
            return { success: false, status: 500, message: 'Something went wrong', error: error };
        }
    }
};

export const getByIdService = async (req, Model, mongoose) => {
    try {
        const query = [
            { $match: {
                $and: [
                    // { $expr: { $eq: [ '_id', { '$toObjectId': req.params.id } ] }},
                    // { _id: mongoose.Types.ObjectId(req.params.id) },
                    { _id: new mongoose.Types.ObjectId(req.params.id) },
                    { isDeleted: false }
                ]
            }},
            { $project: {
                'createdAt': 0,
                'password': 0,
                'updatedAt': 0,
                'isDeleted': 0  
            }}
        ]

        const data = await Model.aggregate(query).exec();

        if (data && data.length > 0) {
            return { success: true, status: 200, data: data };
        } else return { success: false, status: 404, message: `${Model.collection.modelName} is not found with given id` };

    } catch (error) {
        return { success: false, status: 404, message: `${Model.collection.modelName} is not found with given id`, error: error };
    }
};

export const getAllService = async (req, Model, matchFields, extraSubQuery = [], sortFieldsObj = null, extraMatchObject = null) => {
    try {
        const { searchValue, take, skip, isActive } = req.query;
        const limitCount = take;
        const skipCount = skip;
        let subQuery = [];
        let countQueryMatch;
        let matchFilterArray = [];
        let countQuery = [];
        let matchObject = { isDeleted: false };
        
        if (matchFields?.length > 0) {
            matchFields.forEach(ele => {
                let filter = {};
                filter[ele] = { $regex: '.*' + searchValue + '.*', $options: 'i' };
                matchFilterArray.push(filter);
            });
        }
        if (extraSubQuery?.length > 0) {
            extraSubQuery.forEach(ele => {
                subQuery.push(ele);
                countQuery.push(ele);
            });
        }

        if ((take && !skip) || (!take && skip >= 0) || (!take && !skip)) {
            return { success: false, status: 400, message: 'REQUIRED_FIELDS_MISSING - (take, skip)' };
        }

        if (extraMatchObject) {
            matchObject = extraMatchObject;
            // subQuery.push({ $match: matchObject });
            subQuery.unshift({ $match: matchObject });
            countQueryMatch = { $match: matchObject };
        }
        if (isActive && !extraMatchObject) {
            matchObject.isActive = JSON.parse(isActive);
            // subQuery.push({ $match: matchObject });
            subQuery.unshift({ $match: matchObject });
            countQueryMatch = { $match: matchObject };
        }
        if (!subQuery || subQuery?.length === 0) {
            // subQuery.push({ $match: { isDeleted: false } });
            subQuery.unshift({ $match: { isDeleted: false } });
        }
        if (!countQuery || countQuery?.length === 0) {
            countQueryMatch = { $match: { isDeleted: false } }
        }
        if (countQueryMatch) {
            countQuery = [
                ...countQuery,
                countQueryMatch,
                // { $count: "totalLength" },
            ];
        }
        countQuery = [
            ...countQuery,
            // countQueryMatch,
            { $count: "totalLength" },
        ];

        if (sortFieldsObj) {
            subQuery.push({ $sort : sortFieldsObj });
            countQuery.push({ $sort : sortFieldsObj });
        }

        const query = [
            { $facet: {
                "list": subQuery,
                "count": countQuery
            }},
            { $project: {
                    list: 1,
                    totalLength: { $arrayElemAt: [ '$count.totalLength', 0 ] },
                }
            },
        ];

        if (searchValue) {
            const matchObject = {
                $match: {
                    // $or: [  
                    //     { name: { $regex: '.*' + searchValue + '.*', $options: 'i' } }
                    // ]
                    $or: matchFilterArray
                }
            };

            let tempIndex = null;
            subQuery.forEach((o, i) => {
                if (JSON.stringify(o).includes('$group')) {
                    tempIndex = i;
                    return;
                }
            });
            subQuery.splice(tempIndex, 0, matchObject);
            countQuery.splice(tempIndex, 0, matchObject);
        }

        try {
            if (skipCount && limitCount) {
                subQuery.push({ $skip: parseInt(skipCount) }, { $limit: parseInt(limitCount) });
            }
            const list = await Model.aggregate(query).exec();
            return { success: true, status: 200, data: list[0]?.list, totalLength: list[0]?.totalLength };

        } catch (error) {
            return { success: false, status: 500, message: 'Something went wrong', error: error };
        }
    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong', error: error };
    }
};

export const addService = async (req, Model, data) => {
    try {
        const addObj = await Model.create(data);
        return { success: true, status: 200, id: addObj.id, message: `${Model.collection.modelName} created successfully` };

    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong', error: error };
    }
};

export const updateService = async (req, Model, data, id = '') => {
    try {
        if (id) {
            const updateData = await Model.findByIdAndUpdate(id, data);
            return { success: true, status: 200, id: updateData._id, message: `${Model.collection.modelName} Updated Successfully.` };
        } else {
            const updateData = await Model.findByIdAndUpdate(req.params.id, data);
            return { success: true, status: 200, id: updateData._id, message: `${Model.collection.modelName} Updated Successfully.` };
        }
    } catch (error) {
        return { success: false, status: 404, message: 'Id Not Found', error: error };
    }
};

export const deleteService = async (req, Model) => {
    try {
        const obj = await Model.findByIdAndUpdate((req.params.id).toString(), { isDeleted: true });
        if (!obj) return { success: false, status: 404, message: `The ${Model.collection.modelName} with given Id was not found.` };
    
        return { success: true, status: 200, message: `${Model.collection.modelName} deleted` };
    } catch (error) {
        return { success: false, status: 404, message: 'Something went wrong', error: error };  
    }
};
