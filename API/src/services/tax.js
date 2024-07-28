import { addService, deleteService, getAllService, getAllWithoutPaginate, updateService } from "../genericServices.js";

export const getAllTaxWithoutPaginateService = async (req, Tax) => {
    return await getAllWithoutPaginate(req, Tax, true);
};

export const getAllTaxService = async (req, Tax) => {
    const matchFieldsArr = ['name', 'taxPercent'];
    const sortFieldsObj = { name: 1, taxPercent: 1 };

    const res = await getAllService(req, Tax, matchFieldsArr);
    return res;
};

export const addUpdateTaxService = async (req, Tax) => {
    if (req.params.id) {
        const { name, taxPercent } = req.body;

        let data = {
            name: name,
            taxPercent: taxPercent,
        }

        const res = await updateService(req, Tax, data);
        return res;

    } else {
        const { name, taxPercent } = req.body;
        if (!name || !taxPercent) {
            return { success: false, status: 400, error: 'REQUIRED_FIELDS_MISSING' };
        }

        let data = {
            name: name,
            taxPercent: taxPercent,
            isDeleted: false
        }
    
        const res = await addService(req, Tax, data);
        return res;

    }
};

export const deleteTaxService = async (req, Tax) => {
    const res = await deleteService(req, Tax);
    return res;
};