import { message } from "antd";
import axios from "axios";
import { API_HOST } from "../constants";

const baseUrl = `${API_HOST}/api`;

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('token');
        if (token) {
            config.headers = {
                token: token,
                // "Content-Type": `multipart/form-data`
            }
        }
        return config;
    },
    (error) => {
        if (error.response && error.response.status === 400) {
            return axiosInstance.request(error.config);
        }
        return error.response ? error.response : Promise.reject(new Error(error));
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error?.response?.status === 400 || error?.response?.status === 403 || error?.response?.status === 404 || error?.response?.status === 409 || error?.response?.status === 500) {
            // try {
            //   await addException({ 
            //     exception: error?.response?.data?.message,
            //     stackTrace: `at - "${error?.config?.url}" - (${error?.config?.method})`,
            //     errorCode: `${error?.response?.status}`,
            //     innerException: error?.response?.data?.error ? error?.response?.data?.error : error?.response?.data?.message
            //   });
            //   return;
            // } catch (error) {
            //   return message.error('Error in Add Exception' + error);
            // }
        }
        if (error?.response?.data?.isAuth === false) {
            localStorage.clear();

            // await showSessionExpiredMessage();
            // message.error('Session Expired - Please Login Again.');
            // setTimeout(() => {
            //   window.location.href = '/login';
            // }, 1000);
        }
        // if (error.response && error.response.status === 401) {
        //     return axiosInstance.request(error.config);
        // }
        return error.response ? error.response : Promise.reject(new Error(error));
    }
);

export const getUserLogin = async (data) => {
    return await axiosInstance.post(`${baseUrl}/login`, data);
};

export const getAllModulePermissions = async () => {
    return await axiosInstance.get(`${baseUrl}/permission/modulePermission`);
};

export const addUpdateAccessPermissions = async (data) => {
    return await axiosInstance.post(`${baseUrl}/permission/accessPermission`, data);
};

export const getAllAccessPermissionsByUserId = async (userId) => {
    return await axiosInstance.get(`${baseUrl}/permission/accessPermissionByUserId/${userId}`);
};

export const getAllAccessPermissionsByRoleId = async (roleId) => {
    return await axiosInstance.get(`${baseUrl}/permission/accessPermissionByRoleId/${roleId}`);
};

export const changePassword = async (data) => {
    return await axiosInstance.post(`${baseUrl}/login/changePassword`, data);
};

// ----------------------------------------------------------- Users ------------------------------------------

export const getUser = async (take, skip, searchValue) => {
    let subUrl = `${baseUrl}/user`;

    if (searchValue) {
        subUrl += "?searchValue=" + searchValue;
    }

    if (take !== null && skip >= 0) {
        if (searchValue) subUrl += "&take=" + take;
        else subUrl += "?take=" + take;
        subUrl += "&skip=" + skip;
    }
    return await axiosInstance.get(`${subUrl}`);
};

export const getBuilder = async (take, skip, searchValue) => {
    let subUrl = `${baseUrl}/user/getAllBuilder`;

    if (searchValue) {
        subUrl += "?searchValue=" + searchValue;
    }

    if (take !== null && skip >= 0) {
        if (searchValue) subUrl += "&take=" + take;
        else subUrl += "?take=" + take;
        subUrl += "&skip=" + skip;
    }
    return await axiosInstance.get(`${subUrl}`);
};

export const getAllBuilder = async () => {
    return await axiosInstance.get(`${baseUrl}/user/getAllBuilderWithoutPaginate`);
};

export const getEmployee = async (take, skip, searchValue, jobTitle) => {
    let subUrl = `${baseUrl}/user/getAllEmployee`;
    
    if (searchValue) {
        subUrl += "?searchValue=" + searchValue;
    }
    
    if (jobTitle) {
        if (searchValue) subUrl += "&jobTitle=" + jobTitle;
        else subUrl += "?jobTitle=" + jobTitle;
    }

    if (take !== null && skip >= 0) {
        if (searchValue) subUrl += "&take=" + take;
        else if (jobTitle) subUrl += "&take=" + take;
        else subUrl += "?take=" + take;
        subUrl += "&skip=" + skip;
    }
    return await axiosInstance.get(`${subUrl}`);
};

export const getUserDataById = async (id) => {
    return await axiosInstance.get(`${baseUrl}/user/${id}`);
};

export const getAllUser = async () => {
    return await axiosInstance.get(`${baseUrl}/user/all`);
};

export const addUser = async (data) => {
    return await axiosInstance.post(`${baseUrl}/user`, data);
};

export const updateUser = async (id, data) => {
    return await axiosInstance.put(`${baseUrl}/user/${id}`, data);
};

export const deleteUser = async (id) => {
    return await axiosInstance.delete(`${baseUrl}/user/${id}`);
};

export const getAllEmployee = async () => {
    return await axiosInstance.get(`${baseUrl}/user/getAllEmployeeWithoutPaginate`);
};

export const getEmployeeByBuilder = async (builderId, jobTitle, take, skip, searchValue) => {
    let subUrl = `${baseUrl}/user/getAllEmployeeByBuilder?builderId=${builderId}`;

    if (jobTitle) {
        subUrl += "&jobTitle=" + jobTitle;
    }

    if (searchValue) {
        subUrl += "&searchValue=" + searchValue;
    }

    if (take !== null && skip >= 0) {
        if (searchValue) subUrl += "&take=" + take;
        else subUrl += "&take=" + take;
        subUrl += "&skip=" + skip;
    }
    return await axiosInstance.get(`${subUrl}`);
};

export const getAllEmployeeByBuilder = async (data) => {
    return await axiosInstance.post(`${baseUrl}/user/getAllEmployeeByBuilderWithoutPaginate`, data);
};

export const getAllBuilderTotalCount = async (timePeriod, customDateRange) => {
    let subUrl = `${baseUrl}/user/getAllBuilderTotalCount`;
    if (timePeriod) subUrl += '?lastDay=' + timePeriod;
    if (customDateRange?.start && customDateRange?.end) {
        subUrl += '?customStartDate=' + customDateRange?.start;
        subUrl += '&customEndDate=' + customDateRange?.end;
    }
    return await axiosInstance.get(`${subUrl}`);
};

export const getAllUsersCountByMonth = async (year) => {
    return await axiosInstance.get(`${baseUrl}/user/getAllUsersCountByMonth?year=${year}`);
};

export const getAllBuilderProjectsCountByMonth = async (year, builderId) => {
    return await axiosInstance.get(`${baseUrl}/project/getAllProjectsCountByMonth?year=${year}&builderId=${builderId}`);
};

export const getAllUserCount = async (timePeriod, customDateRange) => {
    let subUrl = `${baseUrl}/user/getAllUserCount`;
    if (timePeriod) subUrl += '?lastDay=' + timePeriod;
    if (customDateRange?.start && customDateRange?.end) {
        subUrl += '?customStartDate=' + customDateRange?.start;
        subUrl += '&customEndDate=' + customDateRange?.end;
    }
    return await axiosInstance.get(`${subUrl}`);
};

export const getAllEmployeeTotalCount = async () => {
    return await axiosInstance.get(`${baseUrl}/user/getAllEmployeeTotalCount`);
};

export const getAllEmployeeTotalCountByBuilder = async (builderId, timePeriod, customDateRange) => {
    let subUrl = `${baseUrl}/user/getAllEmployeeTotalCountByBuilder?builderId=${builderId}`;

    if (timePeriod) subUrl += '&lastDay=' + timePeriod;
    if (customDateRange?.start && customDateRange?.end) {
        subUrl += '&customStartDate=' + customDateRange?.start;
        subUrl += '&customEndDate=' + customDateRange?.end;
    }
    return await axiosInstance.get(`${subUrl}`);
};

// ----------------------------------------------------------- User Roles ------------------------------------------

export const getAllUserRole = async () => {
    return await axiosInstance.get(`${baseUrl}/userRole/all`);
};

// ----------------------------------------------------------- Roles ------------------------------------------

export const getRoles = async (take, skip, searchValue) => {
    let subUrl = `${baseUrl}/role`;

    if (searchValue) {
        subUrl += "?searchValue=" + searchValue;
    }

    if (take !== null && skip >= 0) {
        if (searchValue) subUrl += "&take=" + take;
        else subUrl += "?take=" + take;
        subUrl += "&skip=" + skip;
    }
    return await axiosInstance.get(`${subUrl}`);
};

export const getAllRoles = async () => {
    return await axiosInstance.get(`${baseUrl}/role/all`);
};

export const addRole = async (data) => {
    return await axiosInstance.post(`${baseUrl}/role`, data);
};

export const updateRole = async (id, data) => {
    return await axiosInstance.put(`${baseUrl}/role/${id}`, data);
};

export const deleteRole = async (id) => {
    return await axiosInstance.delete(`${baseUrl}/role/${id}`);
};

export const getRoleByUserId = async (data) => {
    return await axiosInstance.post(`${baseUrl}/user/getRoleByUserId`, data);
};


// ----------------------------------------------------------- Projects ------------------------------------------

export const getProjects = async (status, priority, userId, take, skip, searchValue) => {
    let subUrl = `${baseUrl}/project`;
    // let subUrl = `${baseUrl}/project?status=${JSON.stringify(status)}&priority=${JSON.stringify(priority)}`;

    if (take !== null && skip >= 0) {
        subUrl += "?take=" + take;
        subUrl += "&skip=" + skip;
    }

    if (searchValue) {
        subUrl += "&searchValue=" + searchValue;
    }

    if (status) {
        subUrl += "&status=" + JSON.stringify(status);
    }

    if (priority) {
        subUrl += "&priority=" + priority;
    }

    if (userId) {
        subUrl += "&builderId=" + userId;
    }

    return await axiosInstance.get(`${subUrl}`);
};

// export const getProjectsByBuilder = async (userId, take, skip, searchValue) => {
export const getAllProjectsByBuilderAndStatus = async (userId, status, priority, take, skip, searchValue) => {
    let subUrl = `${baseUrl}/project/getAllProjectsByBuilderAndStatus?userId=${userId}&status=${JSON.stringify(status)}`;
    
    if (priority) {
        subUrl += "&priority=" + priority;
    }

    if (searchValue) {
        subUrl += "&searchValue=" + searchValue;
    }

    if (take !== null && skip >= 0) {
        if (searchValue) subUrl += "&take=" + take;
        else subUrl += "&take=" + take;
        subUrl += "&skip=" + skip;
    }
    return await axiosInstance.get(`${subUrl}`);
};

export const getAllProjects = async () => {
    return await axiosInstance.get(`${baseUrl}/project/all`);
};

export const getAllProjectsByBuilderAndStatusWithoutPaginate = async (data) => {
    return await axiosInstance.post(`${baseUrl}/project/getAllProjectsByBuilderAndStatusWithoutPaginate`, data);
};

export const getAllEmployeeOfProject = async (data) => {
    return await axiosInstance.post(`${baseUrl}/project/getAllEmployeeOfProject`, data);
};

export const addProject = async (data) => {
    return await axiosInstance.post(`${baseUrl}/project`, data);
};

export const updateProject = async (id, data) => {
    return await axiosInstance.put(`${baseUrl}/project/${id}`, data);
};

export const updateProjectDocuments = async (data) => {
    return await axiosInstance.post(`${baseUrl}/project/updateProjectDocuments`, data);
};

export const deleteProject = async (id) => {
    return await axiosInstance.delete(`${baseUrl}/project/${id}`);
};

export const deleteProjectDocument = async (id) => {
    return await axiosInstance.delete(`${baseUrl}/project/deleteProjectDocument/${id}`);
};

export const getAttachmentsOfProject = async (projectId, take, skip, searchValue) => {
    let subUrl = `${baseUrl}/project/getAttachmentsOfProject?projectId=${projectId}`;

    if (searchValue) {
        // subUrl += "&searchValue=" + searchValue;
        subUrl += "&filterValue=" + searchValue;
    }

    if (take !== null && skip >= 0) {
        if (searchValue) subUrl += "&take=" + take;
        else subUrl += "&take=" + take;
        subUrl += "&skip=" + skip;
    }
    return await axiosInstance.get(`${subUrl}`);
};

export const getAllAssignEmployeeOfBuilder = async (builderId) => {
    return await axiosInstance.get(`${baseUrl}/project/getAllAssignEmployeeOfBuilder?builderId=${builderId}`);
};

// ----------------------------------------------------------- Milestones ------------------------------------------

export const getMilestones = async (take, skip, searchValue) => {
    let subUrl = `${baseUrl}/milestone`;

    if (searchValue) {
        subUrl += "?searchValue=" + searchValue;
    }

    if (take !== null && skip >= 0) {
        if (searchValue) subUrl += "&take=" + take;
        else subUrl += "?take=" + take;
        subUrl += "&skip=" + skip;
    }
    return await axiosInstance.get(`${subUrl}`);
};

export const getAllMilestonesOfProject = async (projectId) => {
    return await axiosInstance.get(`${baseUrl}/milestone/getAllByProjectId?projectId=${projectId}`);
};

export const addMilestone = async (data) => {
    return await axiosInstance.post(`${baseUrl}/milestone`, data);
};

export const updateMilestone = async (id, data) => {
    return await axiosInstance.put(`${baseUrl}/milestone/${id}`, data);
};

export const deleteMilestone = async (id) => {
    return await axiosInstance.delete(`${baseUrl}/milestone/${id}`);
};

// ----------------------------------------------------------- Tasks ------------------------------------------

export const getTasks = async (take, skip, searchValue) => {
    let subUrl = `${baseUrl}/task`;

    if (searchValue) {
        subUrl += "?searchValue=" + searchValue;
    }

    if (take !== null && skip >= 0) {
        if (searchValue) subUrl += "&take=" + take;
        else subUrl += "?take=" + take;
        subUrl += "&skip=" + skip;
    }
    return await axiosInstance.get(`${subUrl}`);
};

export const getAllTasks = async () => {
    return await axiosInstance.get(`${baseUrl}/task/all`);
};

export const getTasksByProjectId = async (projectId, take, skip, searchValue) => {
    // return await axiosInstance.get(`${baseUrl}/task/byProjectId?projectId=${projectId}`);
    let subUrl = `${baseUrl}/task/byProjectId?projectId=${projectId}`;

    if (searchValue) {
        subUrl += "&searchValue=" + searchValue;
    }

    if (take !== null && skip >= 0) {
        if (searchValue) subUrl += "&take=" + take;
        else subUrl += "&take=" + take;
        subUrl += "&skip=" + skip;
    }
    return await axiosInstance.get(`${subUrl}`);
};

export const getAllTasksByProjectId = async (projectId) => {
    return await axiosInstance.get(`${baseUrl}/task/byProjectIdWithoutPaginate?projectId=${projectId}`);
};

export const getAllTasksByEmployee = async (employeeId, priorityList) => {
    return await axiosInstance.get(`${baseUrl}/task/byEmployeeWithoutPaginate?employeeId=${employeeId}&priorityList=${JSON.stringify(priorityList)}`);
};

export const addTask = async (data) => {
    return await axiosInstance.post(`${baseUrl}/task`, data);
    // return await axiosInstance({
    //     method: 'post',
    //     url: `${baseUrl}/task`,
    //     data: data,
    //     headers: {
    //         // "Content-Type": `multipart/form-data`
    //         // 'Content-Type': 'application/x-www-form-urlencoded'
    //         'Content-Type': '*'
    //     },  
    // });
};

export const updateTask = async (id, data) => {
    return await axiosInstance.put(`${baseUrl}/task/${id}`, data);
};

export const deleteTask = async (id) => {
    return await axiosInstance.delete(`${baseUrl}/task/${id}`);
};

// -------------------------- Budget Category -----------------------------------

export const getBudgetCategory = async (take, skip, searchValue) => {
    let subUrl = `${baseUrl}/budgetCategory`;

    if (searchValue) {
        subUrl += "?searchValue=" + searchValue;
    }

    if (take !== null && skip >= 0) {
        if (searchValue) subUrl += "&take=" + take;
        else subUrl += "?take=" + take;
        subUrl += "&skip=" + skip;
    }
    return await axiosInstance.get(`${subUrl}`);
};

export const addBudgetCategory = async (data) => {
    return await axiosInstance.post(`${baseUrl}/budgetCategory`, data);
};

export const updateBudgetCategory = async (id, data) => {
    return await axiosInstance.put(`${baseUrl}/budgetCategory/${id}`, data);
};

export const deleteBudgetCategory = async (id) => {
    return await axiosInstance.delete(`${baseUrl}/budgetCategory/${id}`);
};

export const getAllBudgetCategory = async () => {
    return await axiosInstance.get(`${baseUrl}/budgetCategory/all`);
};

// -------------------------- Budget -----------------------------------

export const getBudget = async (projectId, status, take, skip, searchValue) => {
    let subUrl = `${baseUrl}/budget/getBudgetByProjectAndCategoryGroup?projectId=${projectId}`;

    if (searchValue) {
        subUrl += "&searchValue=" + searchValue;
    }

    if (take !== null && skip >= 0) {
        if (searchValue) subUrl += "&take=" + take;
        else subUrl += "&take=" + take;
        subUrl += "&skip=" + skip;
    }

    if (status) {
        subUrl += "&status=" + JSON.stringify(status);
    }

    return await axiosInstance.get(`${subUrl}`);
};

export const addBudget = async (data) => {
    return await axiosInstance.post(`${baseUrl}/budget`, data);
};

export const updateBudget = async (id, data) => {
    return await axiosInstance.put(`${baseUrl}/budget/${id}`, data);
};

export const deleteBudget = async (id) => {
    return await axiosInstance.delete(`${baseUrl}/budget/${id}`);
};

export const getAllBudget = async (projectId) => {
    return await axiosInstance.get(`${baseUrl}/budget/getAllBudgetByProjectAndCategoryGroup?projectId=${projectId}`);
};

// -------------------------- Purchase Order -----------------------------------

export const getPurchaseOrder = async (projectId, status, take, skip, searchValue) => {
    let subUrl = `${baseUrl}/purchaseOrder/getByProjectId?projectId=${projectId}`;

    if (searchValue) {
        subUrl += "&searchValue=" + searchValue;
    }

    if (take !== null && skip >= 0) {
        if (searchValue) subUrl += "&take=" + take;
        else subUrl += "&take=" + take;
        subUrl += "&skip=" + skip;
    }

    if (status) subUrl += "&status=" + JSON.stringify(status)

    return await axiosInstance.get(`${subUrl}`);
};

export const addPurchaseOrder = async (data) => {
    return await axiosInstance.post(`${baseUrl}/purchaseOrder`, data);
};

export const updatePurchaseOrder = async (id, data) => {
    return await axiosInstance.put(`${baseUrl}/purchaseOrder/${id}`, data);
};

export const deletePurchaseOrder = async (id) => {
    return await axiosInstance.delete(`${baseUrl}/purchaseOrder/${id}`);
};

export const getAllPurchaseOrder = async (projectId) => {
    return await axiosInstance.get(`${baseUrl}/purchaseOrder/getAllByProjectId?projectId=${projectId}`);
};

// -------------------------- Sale Invoice -----------------------------------

export const getSaleInvoice = async (projectId, take, skip, searchValue) => {
    let subUrl = `${baseUrl}/saleInvoice/getByProjectId?projectId=${projectId}`;

    if (searchValue) {
        subUrl += "&searchValue=" + searchValue;
    }

    if (take !== null && skip >= 0) {
        if (searchValue) subUrl += "&take=" + take;
        else subUrl += "&take=" + take;
        subUrl += "&skip=" + skip;
    }

    return await axiosInstance.get(`${subUrl}`);
};

export const addSaleInvoice = async (data) => {
    return await axiosInstance.post(`${baseUrl}/saleInvoice`, data);
};

export const updateSaleInvoice = async (id, data) => {
    return await axiosInstance.put(`${baseUrl}/saleInvoice/${id}`, data);
};

export const deleteSaleInvoice = async (id) => {
    return await axiosInstance.delete(`${baseUrl}/saleInvoice/${id}`);
};

export const updateSaleInvoiceDocuments = async (data) => {
    return await axiosInstance.post(`${baseUrl}/saleInvoice/updateDocuments`, data);
};

export const getAllSaleInvoice = async (projectId) => {
    return await axiosInstance.get(`${baseUrl}/saleInvoice/getAllByProjectId?projectId=${projectId}`);
};

// -------------------------- Tax -----------------------------------

export const getTax = async (take, skip, searchValue) => {
    let subUrl = `${baseUrl}/tax`;

    if (searchValue) {
        subUrl += "?searchValue=" + searchValue;
    }

    if (take !== null && skip >= 0) {
        if (searchValue) subUrl += "&take=" + take;
        else subUrl += "?take=" + take;
        subUrl += "&skip=" + skip;
    }
    return await axiosInstance.get(`${subUrl}`);
};

export const addTax = async (data) => {
    return await axiosInstance.post(`${baseUrl}/tax `, data);
};

export const updateTax = async (id, data) => {
    return await axiosInstance.put(`${baseUrl}/tax/${id}`, data);
};

export const deleteTax = async (id) => {
    return await axiosInstance.delete(`${baseUrl}/tax/${id}`);
};

export const getAllTax = async () => {
    return await axiosInstance.get(`${baseUrl}/tax/all`);
};

// -------------------------- Daily Status -----------------------------------

export const addDailyStatus = async (data) => {
    return await axiosInstance.post(`${baseUrl}/project/dailyStatus`, data);
};

// -------------------------- Inspections -----------------------------------

export const addInspection = async (data) => {
    return await axiosInstance.post(`${baseUrl}/inspection`, data);
};

export const getInspectionByQuery = async (status, projectId, requester, inspectionDate, take, skip, searchValue) => {
    let subUrl = `${baseUrl}/inspection/getAllInspectionByQuery`;

    if (searchValue) {
        subUrl += "?searchValue=" + searchValue;
    }

    if (take !== null && skip >= 0) {
        if (searchValue) subUrl += "&take=" + take;
        else subUrl += "?take=" + take;
        subUrl += "&skip=" + skip;
    }
    if (status) {
        subUrl += "&status=" + JSON.stringify(status);
    }
    if (projectId) {
        subUrl += "&projectId=" + projectId;
    }
    if (requester) {
        subUrl += "&requester=" + requester;
    }
    if (inspectionDate?.start && inspectionDate?.end) {
        subUrl += '&inspStartDate=' + inspectionDate?.start;
        subUrl += '&inspEndDate=' + inspectionDate?.end;
    }

    return await axiosInstance.get(`${subUrl}`);
};

export const getAllInspectionByQuery = async (projectId, status, requester) => {
    let subUrl = `${baseUrl}/inspection/getAllInspectionByQueryWithoutPaginate`;

    if (projectId) {
        subUrl += "?projectId=" + projectId;
    }

    if (status != null) {
        if (projectId) subUrl += "&status=" + JSON.stringify(status);
        else subUrl += "?status=" + JSON.stringify(status);
    }

    if (requester != null) {
        if (projectId || status) subUrl += "&requester=" + requester;
        else subUrl += "?requester=" + requester;
    }

    return await axiosInstance.get(`${subUrl}`);
};

// -------------------------- Equipments -----------------------------------

export const getEquipmentsByStatus = async (status, isRental, rentalStartDate, rentalEndDate, take, skip, searchValue) => {
    let subUrl = `${baseUrl}/equipment/getEquipmentsByStatus?status=${JSON.stringify(status)}`;

    if (isRental) {
        subUrl += "&isRental=" + isRental;
    }

    if (rentalStartDate?.start && rentalStartDate?.end) {
        subUrl += "&customRentStart=" + JSON.stringify({ start: rentalStartDate?.start, end: rentalStartDate?.end });
    }

    if (rentalEndDate?.start && rentalEndDate?.end) {
        subUrl += "&customRentEnd=" + JSON.stringify({ start: rentalEndDate?.start, end: rentalEndDate?.end });
    }

    if (searchValue) {
        subUrl += "&searchValue=" + searchValue;
    }

    if (take !== null && skip >= 0) {
        if (searchValue) subUrl += "&take=" + take;
        else subUrl += "&take=" + take;
        subUrl += "&skip=" + skip;
    }
    return await axiosInstance.get(`${subUrl}`);
};

export const getEquipmentsByStatusWithoutPaginate = async (status) => {
    return await axiosInstance.get(`${baseUrl}/equipment/getEquipmentsByStatusWithoutPaginate?status=${JSON.stringify(status)}`);
};

export const addEquipment = async (data) => {
    return await axiosInstance.post(`${baseUrl}/equipment`, data);
};

export const updateEquipment = async (id, data) => {
    return await axiosInstance.put(`${baseUrl}/equipment/${id}`, data);
};

export const deleteEquipment = async (id) => {
    return await axiosInstance.delete(`${baseUrl}/equipment/${id}`);
};

export const getAvailableDetailsOfEqptById = async (id) => {
    return await axiosInstance.get(`${baseUrl}/equipment/getAvailableDetailsOfEqptById/${id}`);
};

// -------------------------- Equipments Name -----------------------------------

export const getEquipmentName = async (take, skip, searchValue) => {
    let subUrl = `${baseUrl}/equipmentName`;

    if (searchValue) {
        subUrl += "?searchValue=" + searchValue;
    }

    if (take !== null && skip >= 0) {
        if (searchValue) subUrl += "&take=" + take;
        else subUrl += "?take=" + take;
        subUrl += "&skip=" + skip;
    }
    return await axiosInstance.get(`${subUrl}`);
};

export const addEquipmentName = async (data) => {
    return await axiosInstance.post(`${baseUrl}/equipmentName`, data);
};

export const updateEquipmentName = async (id, data) => {
    return await axiosInstance.put(`${baseUrl}/equipmentName/${id}`, data);
};

export const deleteEquipmentName = async (id) => {
    return await axiosInstance.delete(`${baseUrl}/equipmentName/${id}`);
};

export const getAllEquipmentName = async () => {
    return await axiosInstance.get(`${baseUrl}/equipmentName/all`);
};

// -------------------------- Equipments Request -----------------------------------

export const getEquipmentRequestsByStatus = async (status, take, skip, searchValue, projectId, taskId, equipmentId, requester) => {
    let subUrl = `${baseUrl}/equipmentRequest/getEquipmentRequestsByStatus?status=${JSON.stringify(status)}`;

    if (searchValue) {
        subUrl += "&searchValue=" + searchValue;
    }

    if (take !== null && skip >= 0) {
        if (searchValue) subUrl += "&take=" + take;
        else subUrl += "&take=" + take;
        subUrl += "&skip=" + skip;
    }
    if (projectId) subUrl += "&projectId=" + projectId;
    if (taskId) subUrl += "&taskId=" + taskId;
    if (equipmentId) subUrl += "&equipmentId=" + equipmentId;
    if (requester) subUrl += "&requester=" + requester;
    return await axiosInstance.get(`${subUrl}`);
};

export const getEquipmentRequestsByStatusWithoutPaginate = async (status, projectId, taskId, equipmentId, requester) => {
    let subUrl = `${baseUrl}/equipmentRequest/getEquipmentRequestsByStatusWithoutPaginate?status=${JSON.stringify(status)}`;
    if (projectId) subUrl += "&projectId=" + projectId;
    if (taskId) subUrl += "&taskId=" + taskId;
    if (equipmentId) subUrl += "&equipmentId=" + equipmentId;
    if (requester) subUrl += "&requester=" + requester;
    return await axiosInstance.get(`${subUrl}`);
};

export const addEquipmentRequest = async (data) => {
    return await axiosInstance.post(`${baseUrl}/equipmentRequest`, data);
};

export const updateEquipmentRequest = async (id, data) => {
    return await axiosInstance.put(`${baseUrl}/equipmentRequest/${id}`, data);
};

export const deleteEquipmentRequest = async (id) => {
    return await axiosInstance.delete(`${baseUrl}/equipmentRequest/${id}`);
};

export const changeStatusOfEqptRequest = async (id, data) => {
    return await axiosInstance.put(`${baseUrl}/equipmentRequest/changeStatusOfEqptReq/${id}`, data);
}; 