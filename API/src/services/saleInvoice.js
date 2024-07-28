import { addService, deleteService, getAllService, getAllWithoutPaginate, updateService } from "../genericServices.js";

export const getAllSaleInvoiceWithoutPaginateService = async (req, SaleInvoice) => {
    return await getAllWithoutPaginate(req, SaleInvoice, true);
};

export const deleteInvoiceDocumentService = async (req, InvoiceDocument) => {
    try {
        const { id } = req.params;
        if (!id) return { success: false, status: 404, message: 'ID NOT FOUND' };

        const res = await InvoiceDocument.findByIdAndUpdate(id, { isDeleted: true });
        return { success: true, status: 200, message: 'Document Deleted' };

    } catch (error) {
        return { success: true, status: 500, message: 'Something went wrong' };
    }
};

export const updateInvoiceDocumentsService = async (req, InvoiceDocument) => {
    try {
        const { saleInvoiceId, purchaseOrderId, attachment, title, description } = req.body;
    
        if (!purchaseOrderId && !saleInvoiceId) return { success: false, status: 400, message: 'REQUIRED_FIELDS_MISSING' };
    
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
                if (purchaseOrderId) imgsArr.push(`images/purchase/${purchaseOrderId}/${o.originalname}`);
                if (saleInvoiceId) imgsArr.push(`images/sale/${saleInvoiceId}/${o.originalname}`);
            });
        }
    
        if (imgsArr.length > 0) {
            let isError = false;
            imgsArr.forEach(async (o) => {
                try {
                    let data = {
                        saleInvoiceId: saleInvoiceId,
                        purchaseOrderId: purchaseOrderId,
                        attachment: o,
                        title: title ? title : '',
                        description: description ? description : '',
                    }
                
                    const res = await InvoiceDocument.create(data);
                    
                } catch (error) {
                    isError = true;
                }
            });
            if (isError) {
                if (purchaseOrderId) await InvoiceDocument.findByIdAndDelete(purchaseOrderId);
                if (saleInvoiceId) await InvoiceDocument.findByIdAndDelete(saleInvoiceId);
                return { success: false, status: 500, message: "Something went wrong" };
            }
        }
        
        return { success: true, status: 200, message: 'Document Added' };
    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};

export const getTotalAmountSIByProjectIdService = async (req, SaleInvoice) => {
    try {
        const { projectId } = req.query;
        if (!projectId) return { success: false, status: 400, message: 'REQUIRED_FIELDS_MISSING' };

        const q = [
            { $match: { projectId: projectId }},
            { $group : { _id: "$projectId", total:{ $sum: "$totalAmount" }} },
            { $sort: { "createdAt": 1 } }
        ];

        const res = await SaleInvoice.aggregate(q).exec();
        return { success: true, status: 200, data: res };

    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};

export const getAllSaleInvoiceByProjectIdService = async (req, SaleInvoice, isPaginate) => {
    try {
        const { projectId, status } = req.query;
        
        if (!projectId) return { success: false, status: 400, message: 'ProjectId Not Found!' };
        const matchFieldsArr = ['saleInvoiceNumber', 'companyName', 'companyAddress', 'contractorName', 'contractorAddress', 'materialAmount',
        'laborAmount', 'projectDetails.projectName', 'materialTax', 'laborTax', 'totalTax', 'totalAmount'];
        let matchObj = {
            projectId: projectId,
            isDeleted: false
        }

        // if (status && status?.length > 0) matchObj.status = { $in: JSON.parse(status) };

        const q = [
            { $match: matchObj },
            { $lookup: {
                let: { "sObjId": { "$toString": "$_id" } },
                from: "saleItem",
                pipeline: [
                    { $match: {
                        $or: [
                            { $expr: { "$eq": ["$saleInvoiceId", "$$sObjId"] } }
                        ]
                    }},
                ],
                as: "saleItems"
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
            const res = await getAllService(req, SaleInvoice, matchFieldsArr, q);
            return res;
        } else {
            const res = await getAllWithoutPaginate(req, SaleInvoice, false, q);
            return res;
        }

    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};

export const getAllSaleInvoiceService = async (req, SaleInvoice) => {
    const matchFieldsArr = ['saleInvoiceNumber'];
    const sortFieldsObj = { saleInvoiceNumber: 1 };

    const res = await getAllService(req, SaleInvoice, matchFieldsArr);
    return res;
};

export const revertSaleInvoice = async (SaleInvoice, existedSaleInvoice) => {
    await SaleInvoice.findByIdAndUpdate(existedSaleInvoice?.id, {
        saleInvoiceNumber: existedSaleInvoice?.saleInvoiceNumber??'',
        projectId: existedSaleInvoice?.projectId,
        workStartDate: existedSaleInvoice?.workStartDate ? new Date(existedSaleInvoice?.workStartDate).toISOString() : null,
        workEndDate: existedSaleInvoice?.workEndDate ? new Date(existedSaleInvoice?.workEndDate).toISOString() : null,
        materialTax: existedSaleInvoice?.materialTax,
        laborTax: existedSaleInvoice?.laborTax,
        totalTax: existedSaleInvoice?.totalTax,
        laborAmount: existedSaleInvoice?.laborAmount,
        materialAmount: existedSaleInvoice?.materialAmount,
        invoiceDate: new Date(existedSaleInvoice?.invoiceDate).toISOString(),
        expireDate: new Date(existedSaleInvoice?.expireDate).toISOString(),
        contractorName: existedSaleInvoice?.contractorName,
        contractorAddress: existedSaleInvoice?.contractorAddress,
        companyName: existedSaleInvoice?.companyName,
        companyAddress: existedSaleInvoice?.companyAddress,
        // status: existedSaleInvoice?.status,
    });
};

export const revertSaleItems = async (SaleItem, existedSaleItemList) => {
    if (existedSaleItemList?.length > 0) {
        existedSaleItemList.forEach(async (e) => {
            await SaleItem.create({
                saleInvoiceId: e.saleInvoiceId,
                description: e.description,
                category: e.category??'',
                quantity: e.quantity??'',
                unitOrHourPrice: e.unitOrHourPrice,
                amount: e.amount,
                isDeleted: false,
            });
        });
    }
};

export const addSaleInvoiceService = async (req, SaleInvoice, SaleItem, mongoose) => {
    if (req.params.id) {
        const { saleInvoiceNumber, projectId, invoiceDate, expireDate, workStartDate, workEndDate, amountPaid, materialTax, laborTax, totalLabor, totalMaterial, totalTax, totalAmount, contractorName, contractorAddress, companyName, companyAddress, status, saleItemsArr, removeItemList } = req.body;

        let tempSaleId, existedSaleInvoice, existedSaleItemList = null;
        
        let data = {
            saleInvoiceNumber: saleInvoiceNumber,
            projectId: projectId,
            workStartDate: new Date(workStartDate).toISOString(),
            workEndDate: new Date(workEndDate).toISOString(),
            materialTax: materialTax,
            laborTax: laborTax,
            totalTax: totalTax,
            laborAmount: totalLabor,
            materialAmount: totalMaterial,
            totalAmount: totalAmount,
            amountPaid: amountPaid,
            invoiceDate: new Date(invoiceDate).toISOString(),
            expireDate: new Date(expireDate).toISOString(),
            contractorName: contractorName,
            contractorAddress: contractorAddress,
            companyName: companyName,
            companyAddress: companyAddress,
            // status: status,
        }

        // const res = await updateService(req, SaleInvoice, data);
        // return res;

        try {
            tempSaleId = req.params.id;
            existedSaleInvoice = await SaleInvoice.findById(req.params.id);
            const res = await updateService(req, SaleInvoice, data);
            if (res.status === 200 && saleItemsArr?.length > 0) {
                existedSaleItemList = await SaleItem.find({ saleInvoiceId: req.params.id });
                saleItemsArr.forEach(async (e) => {
                    let obj = {
                        saleInvoiceId: tempSaleId,
                        description: e.description,
                        category: e.category,
                        quantity: e.quantity??'',
                        hours: e.hours??'',
                        unitOrHourPrice: e.unitOrHourPrice,
                        amount: e.amount,
                    };
                    let updateSaleResult;
                    if (e._id) updateSaleResult = await updateService(req, SaleItem, obj, e._id);
                    if (!e._id) updateSaleResult = await addService(req, SaleItem, obj);
                    if (updateSaleResult.status !== 200) {
                        // await SaleInvoice.findByIdAndDelete(new mongoose.Types.ObjectId(tempSaleId));
                        await SaleItem.deleteMany({ saleInvoiceId: tempSaleId });
                        await revertSaleInvoice(SaleInvoice, existedSaleInvoice);
                        await revertSaleItems(SaleItem, existedSaleItemList);1
                        return updateSaleResult;
                    }
                });
            }
            if (removeItemList?.length > 0) {
                removeItemList?.forEach(async (o) => {
                    await SaleItem.findByIdAndDelete((o).toString());
                });
            }
            return res;
            
        } catch (error) {
            // await SaleInvoice.findByIdAndDelete(new mongoose.Types.ObjectId(tempSaleId));
            await revertSaleInvoice(SaleInvoice, existedSaleInvoice);
            return { success: false, status: 500, message: 'Something went wrong', error: error };
        }

    } else {
        const { saleInvoiceNumber, projectId, invoiceDate, expireDate, workStartDate, workEndDate, amountPaid, materialTax, laborTax, totalLabor, totalMaterial, totalTax, totalAmount, contractorName, contractorAddress, companyName, companyAddress, saleItemsArr } = req.body;
        if (!projectId || !totalAmount || !totalMaterial || !totalLabor || !invoiceDate || !expireDate || !materialTax || !laborTax || !totalTax || !contractorName || !contractorAddress || !companyName || !companyAddress || saleItemsArr?.length === 0) {
            return { success: false, status: 400, error: 'REQUIRED_FIELDS_MISSING' };
        }

        let data = {
            saleInvoiceNumber: saleInvoiceNumber ? saleInvoiceNumber : '',
            projectId: projectId,
            workStartDate: workStartDate ? new Date(workStartDate).toISOString() : null,
            workEndDate: workEndDate ? new Date(workEndDate).toISOString() : null,
            amountPaid: amountPaid ? amountPaid : '',
            materialTax: materialTax,
            laborTax: laborTax,
            totalTax: totalTax,
            laborAmount: totalLabor,
            materialAmount: totalMaterial,
            totalAmount: totalAmount,
            invoiceDate: new Date(invoiceDate).toISOString(),
            expireDate: new Date(expireDate).toISOString(),
            contractorName: contractorName,
            contractorAddress: contractorAddress,
            companyName: companyName,
            companyAddress: companyAddress,
            // status: status,
            isDeleted: false
        }
    
        const res = await addService(req, SaleInvoice, data);
        // return res;
        let tempSaleId = res.id;

        if (res?.status === 200 && tempSaleId && saleItemsArr?.length > 0) {
            await saleItemsArr.forEach(async (o) => {
                let obj = {
                    saleInvoiceId: tempSaleId,
                    description: o.description,
                    category: o.category,
                    quantity: o.quantity??'',
                    hours: o.hours??'',
                    unitOrHourPrice: o.unitOrHourPrice,
                    amount: o.amount,
                    isDeleted: false,
                }
                const addSaleItems = await addService(req, SaleItem, obj);
                if (addSaleItems.status !== 200) {
                    await SaleInvoice.findByIdAndDelete(tempSaleId);
                    await SaleItem.deleteMany({ saleInvoiceId: tempSaleId });
                    return addSaleItems;
                }
            });
            return res;
        }
        await SaleInvoice.findByIdAndDelete(tempSaleId);
        return { success: false, status: 400, message: 'Something went wrong' };

    }
};

export const deleteSaleInvoiceService = async (req, SaleInvoice) => {
    const res = await deleteService(req, SaleInvoice);
    return res;
};