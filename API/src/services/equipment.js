import { addService, deleteService, getAllService, getAllWithoutPaginate, updateService } from "../genericServices.js";

export const getAllEquipmentWithoutPaginateService = async (req, Equipment) => {
    return await getAllWithoutPaginate(req, Equipment, true);
};

export const getAllEquipmentService = async (req, Equipment) => {
    const matchFieldsArr = ['eqptNameDetails.name', 'equipmentType', 'totalQuantity', 'rentalPricePerDay', 'purchasePrice', 'currentLocation', 'notes'];
    const sortFieldsObj = { unit1: 1, unit2: 1 };
    
    const res = await getAllService(req, Equipment, matchFieldsArr);
    return res;
    
};

export const getAvailableDetailsOfEqptByIdService = async (req, EquipmentRequest) => {
    try {
        const { id } = req.params;

        if (!id) return { success: false, status: 400, message: 'ID_NOT_FOUND' };

        const q = [
            { $match: { isDeleted: false, equipmentId: id }},
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
            { $set: {
                equipmentDetails: {
                    $arrayElemAt: ["$equipmentDetails", 0]
                },
            }},
            { $group: {
                // _id: null,
                _id: '$equipmentId',
                // _id: { 'equipmentId': id },
                requests: { $push : "$$ROOT" },
                "inUseCount": {
                    "$sum": { "$cond": [{ "$eq": ["$status", "approved"] }, { "$toDouble": "$quantity"}, 0] }
                },
                equipment: { $first: "$equipmentDetails" }
            }},
            { $sort: { "createdAt": 1 } }
        ];

        const res = await EquipmentRequest.aggregate(q).exec();
        return { success: true, status: 200, data: res };

    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };        
    }
};

export const getEquipmentsByStatusService = async (req, Equipment, isPaginate) => {
    const { isRental, customStartDate, customEndDate, customRentStart, customRentEnd } = req.query;
    let status = JSON.parse(req.query?.status);
    const matchFieldsArr = ['eqptNameDetails.name', 'equipmentType', 'totalQuantity', 'rentalPricePerDay', 'purchasePrice', 'currentLocation', 'notes'];
    
    if (!status) return { success: false, status: 400, message: 'REQUIRED_FIELD_MISSING' };

    let startD, endD = new Date();
    // if (lastDay) startD.setDate(startD.getDate() - Number(lastDay));
    if (customStartDate) startD = new Date(customStartDate);
    if (customEndDate) endD = new Date(customEndDate);

    let matchObj = {
        isDeleted: false,
        status: { 
            $in: status
        }
    };

    if (isRental) {
        matchObj.isRental = JSON.parse(isRental);
    }
    if (customStartDate || customEndDate) matchObj.createdAt = { $gte: startD, $lte: endD };
    if (customRentStart && JSON.parse(customRentStart).start && JSON.parse(customRentStart).end) matchObj.rentalStartDate = { $gte: new Date(JSON.parse(customRentStart).start), $lte: new Date(JSON.parse(customRentStart).end) };
    if (customRentEnd && JSON.parse(customRentEnd).start && JSON.parse(customRentEnd).end) matchObj.rentalEndDate = { $gte: new Date(JSON.parse(customRentEnd).start), $lte: new Date(JSON.parse(customRentEnd).end) };

    const q = [
        { $match: matchObj },
        { $lookup: {
            let: { "enObjId": { "$toObjectId": "$equipmentName" } },
            from: "equipmentName",
            pipeline: [
                { $match: {
                    $or: [
                        { $expr: { "$eq": [ "$_id", "$$enObjId" ] } }
                    ]
                }},
            ],
            as: "eqptNameDetails"
        }},
        { $set: {
            eqptNameDetails: {
                $arrayElemAt: ["$eqptNameDetails", 0]
            }
        }},
    ];

    if (isPaginate) {
        const res = await getAllService(req, Equipment, matchFieldsArr, q);
        return res;
    } else {
        const res = await getAllWithoutPaginate(req, Equipment, false, q);
        return res;
    }
};

export const addEquipmentService = async (req, Equipment) => {
    if (req.params.id) {
        const { equipmentName, equipmentType, totalQuantity, manufactureDate, purchaseDate, purchasePrice, isRental, rentalPricePerDay, rentalStartDate, rentalEndDate, isRentalReturned, currentLocation, notes, status } = req.body;

        let data = {
            equipmentName: equipmentName,
            equipmentType: equipmentType,
            manufactureDate: manufactureDate,
            totalQuantity: totalQuantity,
            purchaseDate: purchaseDate,
            purchasePrice: purchasePrice,
            isRental: isRental,
            rentalPricePerDay: rentalPricePerDay ? rentalPricePerDay : 0,
            rentalStartDate: rentalStartDate,
            rentalEndDate: rentalEndDate,
            isRentalReturned: isRentalReturned,
            currentLocation: currentLocation ? currentLocation : '',
            notes: notes ? notes : '',
            status: status
        }

        const res = await updateService(req, Equipment, data);
        return res;

    } else {
        const { equipmentName, equipmentType, totalQuantity, manufactureDate, purchaseDate, purchasePrice, isRental, rentalPricePerDay, 
            rentalStartDate, rentalEndDate, isRentalReturned, notes, currentLocation, status } = req.body;

        if (!equipmentName || !equipmentType || !manufactureDate || !totalQuantity || (!isRental && !purchaseDate) || (!isRental && !purchasePrice) || 
            (isRental !== false && isRental !== true) || (isRental && !rentalPricePerDay) || (isRental && !rentalStartDate) || (isRental && !rentalEndDate) || 
            (isRental && isRentalReturned !== false && isRentalReturned !== true) || !status) {
            return { success: false, status: 400, error: 'REQUIRED_FIELDS_MISSING' };
        }

        let data = {
            equipmentName: equipmentName,
            equipmentType: equipmentType,
            manufactureDate: manufactureDate,
            totalQuantity: totalQuantity,
            purchaseDate: purchaseDate,
            purchasePrice: purchasePrice,
            isRental: isRental,
            rentalPricePerDay: rentalPricePerDay ? rentalPricePerDay : 0,
            rentalStartDate: rentalStartDate,
            rentalEndDate: rentalEndDate,
            isRentalReturned: isRentalReturned,
            currentLocation: currentLocation ? currentLocation : '',
            notes: notes ? notes : '',
            status: status,
            isDeleted: false
        };
    
        const res = await addService(req, Equipment, data);
        return res;

    }
};

export const deleteEquipmentService = async (req, Equipment) => {
    const res = await deleteService(req, Equipment);
    return res;
};