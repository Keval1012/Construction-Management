import _ from "lodash";
import ModulePermission from "../models/modulePermission.js";
// import Role from '../models/role.js';
import AccessPermission from "../models/accessPermission.js";
import mongoose from "mongoose";

const modulePermissions = [
    "Project.Read", "Project.Create", "Project.Update", "Project.Delete", 
    "Task.Read", "Task.Create", "Task.Update", "Task.Delete", 
    "Equipment.Read", "Equipment.Create", "Equipment.Update", "Equipment.Delete", 
    "EquipmentName.Read", "EquipmentName.Create", "EquipmentName.Update", "EquipmentName.Delete", 
    "EmployeeProject.Read", "EmployeeProject.Create", "EmployeeProject.Update", "EmployeeProject.Delete",
    "EquipmentRequest.Read", "EquipmentRequest.Create", "EquipmentRequest.Update", "EquipmentRequest.Delete",
    "User.Read", "User.Create", "User.Update", "User.Delete",
    "Builder.Read", "Builder.Create", "Builder.Update", "Builder.Delete",
    "Employee.Read", "Employee.Create", "Employee.Update", "Employee.Delete",
    "Role.Read", "Role.Create", "Role.Update", "Role.Delete",
];

export const initSeed = async () => {
    _.map(modulePermissions, async (data) => {
        let result = await ModulePermission.findOne({ name: data });
        if (!result) {
            await ModulePermission.create({ name: data });
        }
    });

    await adminPermissionsSeed();
    await builderPermissionsSeed();
    await employeePermissionsSeed();
};

const adminPermissionsSeed = async () => {
    const Role = mongoose.models['Role'] || mongoose.model('Role', roleSchema, 'role');
    const findAdminRole = await Role.findOne({ name: 'hostAdmin' });

    _.map(modulePermissions, async (data) => {
        let result = await AccessPermission.findOne({ name: data, roleId: findAdminRole.id });
        if (!result) {
            await AccessPermission.create({ name: data, roleId: findAdminRole.id, isGranted: true });
        }
    });
};

const builderPermissionsSeed = async () => {
    const Role = mongoose.models['Role'] || mongoose.model('Role', roleSchema, 'role');
    const findUserRole = await Role.findOne({ name: 'builder' });

    const builderModulePermissions = [
        "Project.Read", "Project.Create", "Project.Update", "Project.Delete",
        "Task.Read", "Task.Create", "Task.Update", "Task.Delete", 
        "Equipment.Read", "Equipment.Create", "Equipment.Update", "Equipment.Delete", 
        "EquipmentName.Read", "EquipmentName.Create", "EquipmentName.Update", "EquipmentName.Delete", 
        "EmployeeProject.Read", "EmployeeProject.Create", "EmployeeProject.Update", "EmployeeProject.Delete",
        "EquipmentRequest.Read", "EquipmentRequest.Create", "EquipmentRequest.Update", "EquipmentRequest.Delete",
        "Employee.Read", "Employee.Create", "Employee.Update", "Employee.Delete",
        "DailyStatus.Read", "DailyStatus.Create", "DailyStatus.Update", "DailyStatus.Delete",
        "SiteInspection.Read", "SiteInspection.Create", "SiteInspection.Delete",
        "Document.Read", "Document.Create", "Document.Update", "Document.Delete",
        "Budget.Read", "Budget.Create", "Budget.Update", "Budget.Delete",
        "BudgetCategory.Read", "BudgetCategory.Create", "BudgetCategory.Update", "BudgetCategory.Delete",
        "Tax.Read", "Tax.Create", "Tax.Update", "Tax.Delete",
        "SaleInvoice.Read", "SaleInvoice.Create", "SaleInvoice.Update", "SaleInvoice.Delete",
        "PurchaseOrder.Read", "PurchaseOrder.Create", "PurchaseOrder.Update", "PurchaseOrder.Delete",
    ];

    _.map(builderModulePermissions, async (data) => {
        let result = await AccessPermission.findOne({ name: data, roleId: findUserRole.id });
        if (!result) {
            await AccessPermission.create({ name: data, roleId: findUserRole.id, isGranted: true });
        }
    });
};

const employeePermissionsSeed = async () => {
    const Role = mongoose.models['Role'] || mongoose.model('Role', roleSchema, 'role');
    const findUserRole = await Role.findOne({ name: 'employee' });

    const builderModulePermissions = [
        "Project.Read",
        "Task.Read", "Task.Create", "Task.Update", "Task.Delete",
        "EmployeeProject.Read",
        "EquipmentRequest.Read", "EquipmentRequest.Create", "EquipmentRequest.Update", "EquipmentRequest.Delete",
        "DailyStatus.Read", "DailyStatus.Create", "DailyStatus.Update", "DailyStatus.Delete",
        "Document.Read", "Document.Create",
        "SiteInspection.Read", "SiteInspection.Create",
    ];

    _.map(builderModulePermissions, async (data) => {
        let result = await AccessPermission.findOne({ name: data, roleId: findUserRole.id });
        if (!result) {
            await AccessPermission.create({ name: data, roleId: findUserRole.id, isGranted: true });
        }
    });
};
