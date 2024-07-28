import { addService, deleteService, getAllService, getAllWithoutPaginate, updateService } from "../genericServices.js";

export const getAllRoleWithoutPaginateService = async (req, Role) => {
    return await getAllWithoutPaginate(req, Role, true);
};

export const getAllRoleService = async (req, Role) => {
    const matchFieldsArr = ['name', 'displayName'];
    const sortFieldsObj = { unit1: 1, unit2: 1 };

    const res = await getAllService(req, Role, matchFieldsArr);
    return res;

};

export const addRoleService = async (req, Role) => {
    if (req.params.id) {
        const { name, displayName } = req.body;

        let data = {
            name: name ? name : '',
            displayName: displayName ? displayName : ''
        }

        const res = await updateService(req, Role, data);
        return res;

    } else {
        const { name, displayName } = req.body;
        if (!name || !displayName) {
            return { success: false, status: 400, error: 'REQUIRED_FIELDS_MISSING - (name, displayName)' };
        }

        let data = { name: name, displayName: displayName, isDeleted: false }
    
        const res = await addService(req, Role, data);
        return res;

    }
};

export const deleteRoleService = async (req, Role) => {
    const res = await deleteService(req, Role);
    return res;
};