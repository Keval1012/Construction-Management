import { addService, deleteService, getAllService, getAllWithoutPaginate, updateService } from "../genericServices.js";

export const getAllPurchaseOrderWithoutPaginateService = async (req, PurchaseOrder) => {
    return await getAllWithoutPaginate(req, PurchaseOrder, true);
};

export const getTotalAmountPOByProjectIdService = async (req, PurchaseOrder) => {
    try {
        const { projectId } = req.query;
        if (!projectId) return { success: false, status: 400, message: 'REQUIRED_FIELDS_MISSING' };

        const q = [
            { $match: { projectId: projectId }},
            { $group : { _id: "$projectId", total:{ $sum: "$totalAmount" }} },
            { $sort: { "createdAt": 1 } }
        ];

        const res = await PurchaseOrder.aggregate(q).exec();
        return { success: true, status: 200, data: res };

    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};

export const getAllPurchaseOrderByProjectIdService = async (req, PurchaseOrder, isPaginate) => {
    try {
        const { projectId, status } = req.query;
        
        if (!projectId) return { success: false, status: 400, message: 'ProjectId Not Found!' };
        const matchFieldsArr = ['purchaseOrderNumber', 'purchaseOrderName', 'companyName', 'companyAddress', 'vendorName', 'vendorAddress',
        'materialAmount', 'totalTax', 'projectDetails.projectName', 'totalAmount'];
        let matchObj = {
            projectId: projectId,
            isDeleted: false
        }

        // if (status && status?.length > 0) matchObj.status = { $in: JSON.parse(status) };

        const q = [
            { $match: matchObj },
            { $lookup: {
                let: { "piObjId": { "$toString": "$_id" } },
                from: "purchaseItem",
                pipeline: [
                    { $match: {
                        $or: [
                            { $expr: { "$eq": ["$purchaseOrderId", "$$piObjId"] } }
                        ]
                    }},
                ],
                as: "purchaseItems"
            }},
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
            const res = await getAllService(req, PurchaseOrder, matchFieldsArr, q);
            return res;
        } else {
            const res = await getAllWithoutPaginate(req, PurchaseOrder, false, q);
            return res;
        }

    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};

export const getAllPurchaseOrderService = async (req, PurchaseOrder) => {
    const matchFieldsArr = ['purchaseOrderNumber'];
    const sortFieldsObj = { purchaseOrderNumber: 1 };

    const res = await getAllService(req, PurchaseOrder, matchFieldsArr);
    return res;
};

export const revertPurchaseOrder = async (PurchaseOrder, existedPurchaseOrder) => {
    await PurchaseOrder.findByIdAndUpdate(existedPurchaseOrder?.id, {
        purchaseOrderName: existedPurchaseOrder?.purchaseOrderName,
        purchaseOrderNumber: existedPurchaseOrder?.purchaseOrderNumber??'',
        projectId: existedPurchaseOrder?.projectId,
        workStartDate: existedPurchaseOrder?.workStartDate ? new Date(existedPurchaseOrder?.workStartDate).toISOString() : null,
        workEndDate: existedPurchaseOrder?.workEndDate ? new Date(existedPurchaseOrder?.workEndDate).toISOString() : null,
        materialTax: existedPurchaseOrder?.materialTax,
        materialAmount: existedPurchaseOrder?.materialAmount,
        totalTax: existedPurchaseOrder?.totalTax,
        totalAmount: existedPurchaseOrder?.totalAmount,
        PODate: new Date(existedPurchaseOrder?.PODate).toISOString(),
        expireDate: new Date(existedPurchaseOrder?.expireDate).toISOString(),
        vendorName: existedPurchaseOrder?.vendorName,
        vendorAddress: existedPurchaseOrder?.vendorAddress,
        companyName: existedPurchaseOrder?.companyName,
        companyAddress: existedPurchaseOrder?.companyAddress,
        // status: existedPurchaseOrder?.status,
    });
};

export const revertPurchaseItems = async (PurchaseOrder, existedPurchaseList) => {
    if (existedPurchaseList?.length > 0) {
        existedPurchaseList.forEach(async (e) => {
            await PurchaseOrder.create({
                purchaseOrderId: e.purchaseOrderId,
                description: e.description,
                category: e.category,
                quantity: e.quantity??'',
                hours: e.hours??'',
                unitOrHourPrice: e.unitOrHourPrice,
                amount: e.amount,
                isDeleted: false,
            });
        });
    }
};

export const addPurchaseOrderService = async (req, PurchaseOrder, PurchaseItem, mongoose) => {
    if (req.params.id) {
        const { purchaseOrderName, purchaseOrderNumber, projectId, PODate, expireDate, workStartDate, workEndDate, amountPaid, materialTax, materialAmount, totalTax, totalAmount, vendorName, vendorAddress, companyName, companyAddress, status, purchaseItemsArr, removeItemList } = req.body;

        let tempPOId, existedPurchaseOrder, existedPurchaseItemList = null;
        let data = {
            purchaseOrderName: purchaseOrderName,
            purchaseOrderNumber: purchaseOrderNumber,
            projectId: projectId,
            workStartDate: new Date(workStartDate).toISOString(),
            workEndDate: new Date(workEndDate).toISOString(),
            amountPaid: amountPaid,
            materialTax: materialTax,
            totalTax: totalTax,
            totalAmount: totalAmount,
            materialAmount: materialAmount,
            PODate: new Date(PODate).toISOString(),
            expireDate: new Date(expireDate).toISOString(),
            vendorName: vendorName,
            vendorAddress: vendorAddress,
            companyName: companyName,
            companyAddress: companyAddress,
            // status: status,
        }

        // const res = await updateService(req, PurchaseOrder, data);
        // return res;

        try {
            tempPOId = req.params.id;
            existedPurchaseOrder = await PurchaseOrder.findById(req.params.id);
            const res = await updateService(req, PurchaseOrder, data);
            if (res.status === 200 && purchaseItemsArr?.length > 0) {
                existedPurchaseItemList = await PurchaseItem.find({ purchaseOrderId: req.params.id });
                purchaseItemsArr.forEach(async (e) => {
                    let obj = {
                        purchaseOrderId: tempPOId,
                        description: e.description,
                        category: e.category,
                        quantity: e.quantity??'',
                        hours: e.hours??'',
                        unitOrHourPrice: e.unitOrHourPrice,
                        amount: e.amount,
                    };
                    let updatePurchaseResult;
                    if (e._id) updatePurchaseResult = await updateService(req, PurchaseItem, obj, e._id);
                    if (!e._id) updatePurchaseResult = await addService(req, PurchaseItem, obj);
                    if (updatePurchaseResult.status !== 200) {
                        // await PurchaseOrder.findByIdAndDelete(new mongoose.Types.ObjectId(tempPOId));
                        await PurchaseItem.deleteMany({ purchaseOrderId: tempPOId });
                        await revertPurchaseOrder(PurchaseOrder, existedPurchaseOrder);
                        await revertPurchaseItems(PurchaseItem, existedPurchaseItemList);
                        return updatePurchaseResult;
                    }
                });
                if (removeItemList?.length > 0) {
                    removeItemList?.forEach(async (o) => {
                        await PurchaseItem.findByIdAndDelete((o).toString());
                    });
                }
            }
            return res;
            
        } catch (error) {
            // await PurchaseOrder.findByIdAndDelete(new mongoose.Types.ObjectId(tempPOId));
            await revertPurchaseOrder(PurchaseOrder, existedPurchaseOrder);
            return { success: false, status: 500, message: 'Something went wrong', error: error };
        }

    } else {
        const { purchaseOrderName, purchaseOrderNumber, projectId, PODate, expireDate, workStartDate, workEndDate, amountPaid, materialTax, totalTax, materialAmount, totalAmount, vendorName, vendorAddress, companyName, companyAddress, status, purchaseItemsArr } = req.body;
        if (!projectId || !purchaseOrderName || !totalAmount || !materialAmount || !PODate || !expireDate || !materialTax || !totalTax || !vendorName || !vendorAddress || !companyName || !companyAddress || purchaseItemsArr?.length === 0) {
            return { success: false, status: 400, error: 'REQUIRED_FIELDS_MISSING' };
        }

        let data = {
            purchaseOrderName: purchaseOrderName,
            purchaseOrderNumber: purchaseOrderNumber ? purchaseOrderNumber : '',
            projectId: projectId,
            workStartDate: workStartDate ? new Date(workStartDate).toISOString() : null,
            workEndDate: workEndDate ? new Date(workEndDate).toISOString() : null,
            amountPaid: amountPaid ? amountPaid : '',
            materialTax: materialTax,
            totalTax: totalTax,
            totalAmount: totalAmount,
            materialAmount: materialAmount,
            PODate: new Date(PODate).toISOString(),
            expireDate: new Date(expireDate).toISOString(),
            vendorName: vendorName,
            vendorAddress: vendorAddress,
            companyName: companyName,
            companyAddress: companyAddress,
            // status: status,
            isDeleted: false
        }
    
        const res = await addService(req, PurchaseOrder, data);
        // return res;
        let tempPOId = res.id;

        if (res?.status === 200 && tempPOId && purchaseItemsArr?.length > 0) {
            purchaseItemsArr.forEach(async (o) => {
                let obj = {
                    purchaseOrderId: tempPOId,
                    description: o.description,
                    category: o.category,
                    quantity: o.quantity??'',
                    hours: o.hours??'',
                    unitOrHourPrice: o.unitOrHourPrice,
                    amount: o.amount,
                    isDeleted: false,
                }
                // const res1 = await PurchaseItem.create(obj);
                const addPurchaseItems = await addService(req, PurchaseItem, obj);
                if (addPurchaseItems.status !== 200) {
                    await PurchaseOrder.findByIdAndDelete(tempPOId);
                    await PurchaseItem.deleteMany({ purchaseOrderId: tempPOId });
                    return addPurchaseItems;
                }
            });
            return res;
        }
        await PurchaseOrder.findByIdAndDelete(tempPOId);
        return { success: false, status: 400, message: 'Something went wrong' };
    }
};

export const deletePurchaseOrderService = async (req, PurchaseOrder) => {
    const res = await deleteService(req, PurchaseOrder);
    return res;
};