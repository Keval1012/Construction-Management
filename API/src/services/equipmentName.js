import { addService, deleteService, getAllService, getAllWithoutPaginate, updateService } from "../genericServices.js";

export const getAllEquipmentNameWithoutPaginateService = async (req, EquipmentName) => {
    return await getAllWithoutPaginate(req, EquipmentName, true);
};

export const getAllEquipmentNameService = async (req, EquipmentName) => {
    const matchFieldsArr = ['name', 'displayName'];
    const sortFieldsObj = { name: 1 };

    const res = await getAllService(req, EquipmentName, matchFieldsArr);
    return res;

};

export const addEquipmentNameService = async (req, EquipmentName) => {
    if (req.params.id) {
        const { name, displayName } = req.body;

        let data = {
            name: name ? name : '',
            displayName: displayName ? displayName : ''
        }

        const res = await updateService(req, EquipmentName, data);
        return res;

    } else {
        const { name, displayName } = req.body;
        if (!name || !displayName) {
            return { success: false, status: 400, error: 'REQUIRED_FIELDS_MISSING - (name, displayName)' };
        }

        const findExisted = await EquipmentName.findOne({ name: name });
        if (findExisted) return { success: false, status: 409, message: 'Equipment Name Already Exist!' };

        let data = { name: name, displayName: displayName, isDeleted: false }
    
        const res = await addService(req, EquipmentName, data);
        return res;

    }
};

export const deleteEquipmentNameService = async (req, EquipmentName) => {
    const res = await deleteService(req, EquipmentName);
    return res;
};