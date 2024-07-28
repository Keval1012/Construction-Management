export const handleTaxInputForPercentage = (e, form, fieldName) => {
    // if (!/[0-9|.|%]/.test(event.key)) {
    // if (!/^((?!0)\d{1,3}|0|\.\d{1,2})($|\.$|\.\d{1,2}$)/.test(event.key)) {
    // if (!/^\d+(\.\d+)?$/.test(event.key)) {
    // if (!/^(?=.)\d*(\.\d+)?$/.test(event.key)) {
    // if (!/\d*\.?\d*/.test(event.key)) {

    let val = form?.getFieldValue(fieldName);

    if (val?.includes('.') && val?.split('.')[val?.split('.')?.length - 1]?.length > 1) {
        e.preventDefault();
    }
    if (e.key === '.' && !val?.includes('.')) return;

    if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
    }

    // let formatVal = val?.replace('%', '');
    // form?.setFieldValue(fieldName, `${formatVal}%`);
};

export const renderMoneyFormat = (number) => {
    return number ? <>&#8377; {Number(number).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</> : <>&#8377; 0.00</>
};

export const onlyNumbers = async (event) => {
    if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
        return;
    }
};

export const formatFloatNumber = async (val, form, inputName) => {
    if (val.trim() === '.' || !val) {
        return form.setFieldValue(inputName, '0.00');
    }
    let temp = parseFloat(val).toFixed(2);
    return form.setFieldValue(inputName, temp);
};

export const checkModulePermission = async (allPermissions, module, permission) => {
    if (allPermissions?.length > 0) {
        const isRead = allPermissions.find(o => o.name === `${module}.Read`) ? true : false;
        const isCreate = allPermissions.find(o => o.name === `${module}.Create`) ? true : false;
        const isUpdate = allPermissions.find(o => o.name === `${module}.Update`) ? true : false;
        const isDelete = allPermissions.find(o => o.name === `${module}.Delete`) ? true : false;
        return { isRead, isCreate, isUpdate, isDelete };
    }
};

export const getIndianMoneyFormat = (str) => {
    if (str) {
        str = str?.toString().split(".");
        return str[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") + (str[1] ? ("." + str[1]) : "");
    } else return '';
};