const root = document.querySelector(':root');
const rootComputed = getComputedStyle(root);


export const API_HOST = 'http://localhost:4002';
// export const API_HOST = 'http://localhost:2050';         // Deployment Url

export const filterSelectData = [
    {
        name: 'Active',
        value: 'Active',
        _id: '1'
    },
    {
        name: 'InActive',
        value: 'InActive',
        _id: '0'
    }
];

export const SIDEBAR_WIDTH = rootComputed.getPropertyValue('--sidebarWidth');

export const constructionTypeList = [
    { name: 'Resedential', _id: 'resedential', id: 1 },
    { name: 'Commercial', _id: 'commercial', id: 2 },
    { name: 'Institutional', _id: 'institutional', id: 3 },
    { name: 'Industrial', _id: 'industrial', id: 4 },
    { name: 'Infrastucture', _id: 'infrastucture', id: 5 },
];

export const projectStatusesList = [
    { id: 1, name: 'Not Started', _id: 'notStarted' },
    { id: 2, name: 'On Going', _id: 'onGoing' },
    { id: 3, name: 'Completed', _id: 'completed' },
];

export const employeeJobTitleList = [
    { id: 1, name: 'Sub Contractor', _id: 'subContractor' },
    { id: 2, name: 'Site Inspector', _id: 'siteInspector' },
    { id: 3, name: 'Accounting Manager', _id: 'accountingManager' },
    { id: 4, name: 'Accountant', _id: 'accountant' },
    { id: 5, name: 'Head Architect', _id: 'headArchitect' },
    { id: 6, name: 'Architect', _id: 'architect' },
];

export const siteInspectionTypeList = [
    { id: 1, name: 'Daily Site Inspection', _id: 'dailySiteInspection' },
    { id: 2, name: 'Corrective Inspection Report', _id: 'correctiveInspectionReport' },
    { id: 3, name: 'External Audit Inspection', _id: 'externalAuditInspection' },
    { id: 4, name: 'Environmental Inspection', _id: 'environmentalInspection' },
    { id: 5, name: 'Security Admin Charges', _id: 'securityAdminCharges' },
];

export const severityIndicatorList = [
    { id: 1, name: 'Critical', _id: 'critical' },
    { id: 2, name: 'Major', _id: 'major' },
    { id: 3, name: 'Moderate', _id: 'moderate' },
    { id: 4, name: 'Low', _id: 'low' },
];

export const equipmentTypeList = [
    { id: 1, name: 'Earthmoving Equipment', _id: 'earthmovingEquipment' },
    { id: 2, name: 'Power Tools', _id: 'powerTools' },
    { id: 3, name: 'Small Tools', _id: 'smallTools' },
    { id: 4, name: 'Specialized Equipment', _id: 'specializedEquipment' },
    { id: 5, name: 'Heavy Construction Equipment', _id: 'heavyConstructionEquipment' },
];

export const equipmentStatusList = [
    { id: 1, name: 'Available', _id: 'available' },
    { id: 2, name: 'In Use', _id: 'inUse' },
    { id: 3, name: 'Maintanance', _id: 'maintanance' }
];

export const equipmentRequestStatusList = [
    { id: 1, name: 'Pending', _id: 'pending' },
    { id: 2, name: 'Approved', _id: 'approved' },
    { id: 3, name: 'Rejected', _id: 'rejected' },
    { id: 3, name: 'Returned', _id: 'returned' }
];

export const dashboardTimePeriodList = [
    { id: 1, name: 'Last 7 days', _id: '7' },
    { id: 2, name: 'Last 14 days', _id: '14' },
    { id: 3, name: 'Last 30 days', _id: '30' },
    { id: 4, name: 'Last 60 days', _id: '60' },
    { id: 5, name: 'Last 90 days', _id: '90' },
    { id: 5, name: 'Last 365 days', _id: '365' },
];

export const equipmentIsRentalList = [
    { id: 1, name: 'Rental', _id: true },
    { id: 2, name: 'Owned', _id: false },
];

export const projectPriorityList = [
    { id: 1, name: 'High', _id: 'high' },
    { id: 2, name: 'Medium', _id: 'medium' },
    { id: 3, name: 'Low', _id: 'low' },
];

export const siteInspectionStatusList = [
    { id: 1, name: 'Active', _id: 'active' },
    { id: 2, name: 'Completed', _id: 'completed' },
];

export const budgetStatusList = [
    { id: 1, name: 'Draft', _id: 'draft' },
    { id: 2, name: 'Approved', _id: 'approved' },
    { id: 3, name: 'Closed', _id: 'closed' },
];

export const saleInVoiceStatusList = [
    { id: 1, name: 'Pending', _id: 'pending' },
    { id: 2, name: 'Approved', _id: 'approved' },
    { id: 3, name: 'Closed', _id: 'closed' },
];

export const saleInVoiceCategoryList = [
    { id: 1, name: 'Labor', _id: 'labor' },
    { id: 2, name: 'Material', _id: 'material' },
];

export const POStatusList = [
    { id: 1, name: 'Pending', _id: 'pending' },
    { id: 2, name: 'Approved', _id: 'approved' },
    { id: 3, name: 'Rejected', _id: 'rejected' },
    { id: 3, name: 'Completed', _id: 'completed' }
];