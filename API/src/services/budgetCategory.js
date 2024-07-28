import { addService, deleteService, getAllService, getAllWithoutPaginate, updateService } from "../genericServices.js";

export const getAllBudgetCategoryWithoutPaginateService = async (req, BudgetCategory) => {
    return await getAllWithoutPaginate(req, BudgetCategory, true);
};

export const getAllBudgetCategoryService = async (req, BudgetCategory) => {
    const matchFieldsArr = ['name', 'displayName'];
    const sortFieldsObj = { name: 1 };

    const res = await getAllService(req, BudgetCategory, matchFieldsArr);
    return res;

};

export const addBudgetCategoryService = async (req, BudgetCategory) => {
    if (req.params.id) {
        const { name, displayName } = req.body;

        let data = {
            name: name ? name : '',
            displayName: displayName ? displayName : ''
        }

        const res = await updateService(req, BudgetCategory, data);
        return res;

    } else {
        const { name, displayName } = req.body;
        if (!name || !displayName) {
            return { success: false, status: 400, error: 'REQUIRED_FIELDS_MISSING - (name, displayName)' };
        }

        const findExisted = await BudgetCategory.findOne({ name: name });
        if (findExisted) return { success: false, status: 409, message: 'Category Name Already Exist!' };

        let data = { name: name, displayName: displayName, isDeleted: false }
    
        const res = await addService(req, BudgetCategory, data);
        return res;

    }
};

export const deleteBudgetCategoryService = async (req, BudgetCategory) => {
    const res = await deleteService(req, BudgetCategory);
    return res;
};