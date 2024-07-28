import React, { useEffect, useRef, useState } from "react";
import { Card, Col, DatePicker, Divider, Form, Input, InputNumber, Row, Space, Table, Upload, message } from "antd";
import Button from "./AppButton";
import TextInput from "./TextInput";
import Selectable from './Selectable';
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { saleInVoiceCategoryList, saleInVoiceStatusList } from "../constants";
import { LeftOutlined, MinusCircleOutlined, PlusCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { addSaleInvoice, getAllTax, updateSaleInvoice, updateSaleInvoiceDocuments } from "../API/Api";
import { useLocation, useNavigate } from "react-router-dom";
import { getIndianMoneyFormat, onlyNumbers } from "../helper";

const AddEditSaleInvoice = () => {
    const initialList = [
        {
            description: '',
            category: '',
            quantity: '',
            hours: '',
            unitOrHourPrice: '',
            amount: '',
        }
    ];
    
    const navigate = useNavigate();
    const location = useLocation();
    const { defaultProject, defaultSaleInvoice, isEditSaleInvoice } = location?.state ?? {};
    const [saleInvoiceAddForm] = Form.useForm();
    const [imageFile, setImageFile] = useState(null);
    const [uploadFileList, setUploadFileList] = useState([]);
    const [imagesToDeleted, setImagesToDeleted] = useState([]);
    const [allTaxesList, setAllTaxesList] = useState([]);
    const [defaultLaborTax, setDefaultLaborTax] = useState(0);
    const [defaultMaterialTax, setDefaultMaterialTax] = useState(0);
    const [materialList, setMaterialList] = useState([
        {
            description: '',
            category: '',
            quantity: '',
            hours: '',
            unitOrHourPrice: '',
            amount: '',
        }
    ]);
    const [laborList, setLaborList] = useState([
        {
            description: '',
            category: '',
            quantity: '',
            hours: '',
            unitOrHourPrice: '',
            amount: '',
        }
    ]);
    const [laborTotal, setLaborTotal] = useState('0.00');
    const [materialTotal, setMaterialTotal] = useState('0.00');
    const [removeItemList, setRemoveItemList] = useState([]);

    useEffect(() => {
        fetchAllTaxes();
    }, []);

    useEffect(() => {
        if (defaultSaleInvoice && defaultSaleInvoice?.saleItems?.length > 0) {
            let matList = [];
            let labList = [];
            defaultSaleInvoice?.saleItems?.forEach(o => {
                if (o.category === 'material') matList.push(o);
                if (o.category === 'labor') labList.push(o);
            });
            saleInvoiceAddForm.setFieldValue('materialsList', matList);
            saleInvoiceAddForm.setFieldValue('laborsList', labList);
            saleInvoiceAddForm.setFieldValue('saleTotalLabor', Number(defaultSaleInvoice?.laborAmount).toFixed(2));
            saleInvoiceAddForm.setFieldValue('saleTotalMaterial', Number(defaultSaleInvoice?.materialAmount).toFixed(2));
            saleInvoiceAddForm.setFieldValue('saleSubTotal', Number(Number(defaultSaleInvoice?.laborAmount) + Number(defaultSaleInvoice?.materialAmount)).toFixed(2));
            saleInvoiceAddForm.setFieldValue('saleTotalTax', Number(defaultSaleInvoice?.totalTax).toFixed(2));
            saleInvoiceAddForm.setFieldValue('saleTotalAmount', Number(defaultSaleInvoice?.totalAmount).toFixed(2));
            setLaborTotal(Number(defaultSaleInvoice?.laborAmount));
            setMaterialTotal(Number(defaultSaleInvoice?.materialAmount));
        }
    }, [JSON.stringify(defaultSaleInvoice)]);

    const fetchAllTaxes = async () => {
        const res = await getAllTax();
        if (res?.data?.success) {
            setAllTaxesList(res?.data?.data);
            saleInvoiceAddForm.setFieldValue('saleMaterialTax', `${res?.data?.data?.find(o => o.name === 'Materials')?.taxPercent??0}%`);
            saleInvoiceAddForm.setFieldValue('saleLaborTax', `${res?.data?.data?.find(o => o.name === 'Labor')?.taxPercent??0}%`);
            setDefaultMaterialTax(res?.data?.data?.find(o => o.name === 'Materials')?.taxPercent??0);
            setDefaultLaborTax(res?.data?.data?.find(o => o.name === 'Labor')?.taxPercent??0);
        }
    };

    const uploadProps = {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
            authorization: 'authorization-text',
        },

        onRemove: async (info) => {
            if (info?.url) {
                let tempPath = (info.url).split('images')[1];
                setImagesToDeleted([...imagesToDeleted, tempPath]);
            }
        },

        onChange(info) {
            if (info.file.status !== 'uploading') {
                info.file.status = 'done';
            }

            let newFileList = info.fileList;
            if (newFileList.length > 0 && uploadFileList.length < 4) {
                let temp = [];
                for (let i = 0; i < newFileList.length; i++) {
                    const el = newFileList[i];
                    if (el.originFileObj) {
                        temp.push(el.originFileObj);
                    } else {
                        temp.push(el);
                    }
                }
                setUploadFileList(temp);
                setImageFile(temp);
            } else {
                message.error('Maximum 3 Images.')
            }
        },
    };

    const totalCalculations = () => {
        let { materialsList, laborsList } = saleInvoiceAddForm.getFieldsValue();
        let totalTax = '0.00';
        let totalLaborAmt = '0.00';
        let totalMaterialAmt = '0.00';
        let subTotal = '0.00';
        let totalAmt = '0.00';

        if (materialsList?.length > 0) {
            materialsList.forEach(o => {
                if (o?.amount) totalMaterialAmt = Number(totalMaterialAmt) + Number(o.amount);
            });
        }
        if (laborsList?.length > 0) {
            laborsList.forEach(o => {
                if (o?.amount) totalLaborAmt = Number(totalLaborAmt) + Number(o.amount);
            });
        }
        setLaborTotal(Number(totalLaborAmt).toFixed(2));
        setMaterialTotal(Number(totalMaterialAmt).toFixed(2));
        // saleInvoiceAddForm.setFieldValue('materialsList', materialsList);
        // saleInvoiceAddForm.setFieldValue('laborsList', laborsList);
        // saleInvoiceAddForm.forEach(o => {
        //     if (o.artIssueIGSTAmount) totalGST = parseFloat(totalGST) + parseFloat(o.artIssueIGSTAmount);
        //     if (o.artIssueTotalAmount) totalAmt = parseFloat(totalAmt) + parseFloat(o.artIssueTotalAmount);
        // });

        totalTax = ((Number(totalLaborAmt)*Number(defaultLaborTax))/100) + ((Number(totalMaterialAmt)*Number(defaultMaterialTax))/100);
        subTotal = Number(totalLaborAmt) + Number(totalMaterialAmt);
        totalAmt = Number(totalLaborAmt) + Number(totalMaterialAmt) + Number(totalTax);

        saleInvoiceAddForm.setFieldValue('saleTotalLabor', Number(totalLaborAmt).toFixed(2));
        saleInvoiceAddForm.setFieldValue('saleTotalMaterial', Number(totalMaterialAmt).toFixed(2));
        saleInvoiceAddForm.setFieldValue('saleSubTotal', Number(subTotal).toFixed(2));
        saleInvoiceAddForm.setFieldValue('saleTotalTax', Number(totalTax).toFixed(2));
        saleInvoiceAddForm.setFieldValue('saleTotalAmount', Number(totalAmt).toFixed(2));
    };

    const handleAmountPerItem = (index, module) => {
        let { materialsList, laborsList } = saleInvoiceAddForm.getFieldsValue();
        if (module === 'material') {
            materialsList.forEach((o, i) => {
                if (i === index && !isNaN(parseFloat(o?.unitOrHourPrice)) && !isNaN(parseFloat(o?.quantity))) {
                    o.amount = (parseFloat(o.unitOrHourPrice) * parseFloat(o.quantity)).toString();
                }
            });
            saleInvoiceAddForm.setFieldValue('materialsList', materialsList);
        }
        if (module === 'labor') {
            laborsList.forEach((o, i) => {
                if (i === index && !isNaN(parseFloat(o?.unitOrHourPrice)) && !isNaN(parseFloat(o?.hours))) {
                    o.amount = (parseFloat(o.unitOrHourPrice) * parseFloat(o.hours)).toString();
                }
            });
            saleInvoiceAddForm.setFieldValue('laborsList', laborsList);
        }
        // totalCalculations();
    };

    const checkList = (array, module) => {
        if (array?.length === 1 && Object.values(array[0]).every(val => val === '' || val === null || val === undefined)) {
            return true;
        } else {
            if (module === 'material') return array?.every(item => item?.description && item?.quantity && item?.unitOrHourPrice && item?.amount);
            if (module === 'labor') return array?.every(item => item?.description && item?.hours && item?.unitOrHourPrice && item?.amount);
        }
    }

    const handleSaleInvoiceValues = async (form) => {
        const values = form.getFieldsValue();
        const { saleCompanyName, saleCompanyAddress, saleContractorName, saleContractorAddress, saleInvoiceNumber, saleInvoiceDate, saleExpireDate, saleInvoiceWorkStartDate, saleInvoiceWorkEndDate,
            saleTotalLabor, saleTotalMaterial, saleLaborTax, saleMaterialTax, saleSubTotal, saleTotalTax, saleTotalAmount, laborsList, materialsList } = values;

        if (defaultProject?._id && saleCompanyName && saleCompanyAddress && saleContractorName && saleContractorAddress && saleInvoiceDate && saleExpireDate && saleTotalAmount && 
            saleTotalLabor && saleTotalMaterial && saleLaborTax && saleMaterialTax && saleSubTotal && saleTotalTax) {
            if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
                return;
            }

            // if (materialsList?.every(item => item?.description && item?.quantity && item?.unitOrHourPrice && item?.amount)
            // || laborsList?.every(item => item?.description && item?.hours && item?.unitOrHourPrice && item?.amount)) {
            //     return message.error('List Fields Required!');
            // }
            
            if (!checkList(materialsList, 'material') || !checkList(laborsList, 'labor')) {
                return message.error('List Fields Required!');
            }

            let formData = new FormData();

            formData.append('projectId', defaultProject?._id);
            formData.append('saleInvoiceNumber', saleInvoiceNumber ? saleInvoiceNumber : '');
            formData.append('companyName', saleCompanyName);
            formData.append('companyAddress', saleCompanyAddress);
            formData.append('contractorName', saleContractorName);
            formData.append('contractorAddress', saleContractorAddress);
            formData.append('workStartDate', saleInvoiceWorkStartDate ? saleInvoiceWorkStartDate : null);
            formData.append('workEndDate', saleInvoiceWorkEndDate ? saleInvoiceWorkEndDate : null);
            // formData.append('description', saleInvoiceDescription);
            formData.append('invoiceDate', saleInvoiceDate);
            formData.append('expireDate', saleExpireDate);
            // formData.append('quantity', saleInvoiceQuantity ? saleInvoiceQuantity : '');
            // formData.append('unitOrHourPrice', saleInvoiceUnitPrice ? saleInvoiceUnitPrice : 0);
            formData.append('subTotal', saleSubTotal);
            formData.append('totalLabor', saleTotalLabor);
            formData.append('totalMaterial', saleTotalMaterial);
            formData.append('laborTax', saleLaborTax);
            formData.append('materialTax', saleMaterialTax);
            formData.append('totalTax', saleTotalTax);
            formData.append('totalAmount', saleTotalAmount);
            // formData.append('status', saleInvoiceStatus);
            
            let saleItemsArr = [];
            materialsList?.forEach(o => {
                saleItemsArr.push({
                    _id: o?._id??'',
                    description: o.description,
                    quantity: o.quantity,
                    unitOrHourPrice: o.unitOrHourPrice,
                    hours: '',
                    amount: o.amount,
                    category: 'material',
                })
            });
            laborsList?.forEach(o => {
                saleItemsArr.push({
                    _id: o?._id??'',
                    description: o.description,
                    quantity: '',
                    unitOrHourPrice: o.unitOrHourPrice,
                    hours: o.hours,
                    amount: o.amount,
                    category: 'labor',
                })
            });

            const data = {
                projectId: defaultProject?._id,
                saleInvoiceNumber: saleInvoiceNumber ? saleInvoiceNumber : '',
                companyName: saleCompanyName,
                companyAddress: saleCompanyAddress,
                contractorName: saleContractorName,
                contractorAddress: saleContractorAddress,
                workStartDate: saleInvoiceWorkStartDate ? saleInvoiceWorkStartDate : null,
                workEndDate: saleInvoiceWorkEndDate ? saleInvoiceWorkEndDate : null,
                invoiceDate: saleInvoiceDate,
                expireDate: saleExpireDate,
                subTotal: saleSubTotal,
                totalLabor: saleTotalLabor,
                totalMaterial: saleTotalMaterial,
                laborTax: saleLaborTax,
                materialTax: saleMaterialTax,
                totalTax: saleTotalTax,
                totalAmount: saleTotalAmount,
                saleItemsArr: saleItemsArr,
                removeItemList: removeItemList??[]
            };

            // if (imageFile && imageFile?.some(o => o instanceof File)) {
            //     for (let i = 0; i < imageFile.length; i++) {
            //         if (imageFile[i] instanceof File) {
            //             formData.append('document', imageFile[i]);
            //         } else {
            //             formData.append('document', [JSON.stringify(imageFile[i])]);
            //         }
            //     }
            // }
            // if (imageFile && !(imageFile?.some(o => o instanceof File))) {
            //     for (let i = 0; i < imageFile.length; i++) {
            //         formData.append('document', JSON.stringify(imageFile[i]));
            //     }
            // }

            if (isEditSaleInvoice) {
                try {
                    const res = await updateSaleInvoice(defaultSaleInvoice?._id, data);
                    if (res.data?.success) {
                        // const updateDoc = await updateSaleInvoiceDocuments(data);
                        // if (updateDoc?.data?.success) {
                        // }
                        saleInvoiceAddForm.resetFields();
                        setImageFile(null);
                        setUploadFileList([]);
                        setLaborTotal('0.00');
                        setMaterialTotal('0.00');
                        // setSaleInvoiceModalOpen(false);
                        navigate(-1);
                        message.success('Sale Invoice Updated Successfully');
                    } else message.error(res.data?.message);
                } catch (error) {
                    message.error('Something went wrong' + error);
                }
            }

            if (!isEditSaleInvoice) {
                try {
                    const res = await addSaleInvoice(data);
                    if (res?.data?.success) {
                        // const addDoc = await updateSaleInvoiceDocuments(formData);
                        // if (addDoc?.data?.success) {
                        // }
                        saleInvoiceAddForm.resetFields();
                        setImageFile(null);
                        setUploadFileList([]);
                        setLaborTotal('0.00');
                        setMaterialTotal('0.00');
                        // setSaleInvoiceModalOpen(false);
                        message.success('Sale Invoice Added Successfully')
                        return;
                    } else {
                        message.error(res.data?.message);
                    }
                } catch (error) {
                    message.error(error.response.data.error);
                }
            }

        } else {
            message.error('Please add required fields');
        }
    };

    const Temp = ({ module, fields, add, remove }) => {
        return (
            <>
                {fields.map(({ key, name, ...restField }) => (
                    <>
                        <Row justify='space-between' key={key} style={{ alignItems: (key !== 0) ? 'flex-start' : 'center' }}>
                            <Col xl={{ span: 6 }} lg={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }} xs={{ span: 6 }}>
                                {name === 0 && <h4 className='labelMargin'>{module === 'material' ? 'Materials' : module === 'labor' ? 'Labor' : 'Description'}</h4>}
                                <TextInput
                                    {...restField}
                                    name={[name, 'description']}
                                    defaultVal={defaultSaleInvoice?.description}
                                    className="createUserTextInput"
                                    type='text'
                                    required={false}
                                    requiredMsg='Description is required'
                                    max={40}
                                    maxMsg="cannot be longer than 40 characters"
                                    typeMsg="Enter a valid Description!"
                                    // label="Material"
                                    // addonBefore="Material"
                                    // addonBefore={name === 0 ? 'Material' : ''}
                                />
                            </Col>
                            {/* <Col xl={{ span: 5 }} lg={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }} xs={{ span: 5 }}>
                                {name === 0 && <h4 className='labelMargin'>Category</h4>}
                                <Selectable
                                    // label='Status'
                                    name={[name, 'category']}
                                    required={true}
                                    defaultVal={defaultSaleInvoice?.category}
                                    requiredMsg='Category is required'
                                    firstName='name'
                                    data={saleInVoiceCategoryList}
                                    width={400}
                                    showSearch={false}
                                    handleSelectChange={(val) => { }}
                                />
                            </Col> */}
                            {module === 'material' &&
                                <Col xl={{ span: 5 }} lg={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }} xs={{ span: 5 }}>
                                    {name === 0 && <h4 className='labelMargin'>Quantity</h4>}
                                    <TextInput
                                        name={[name, 'quantity']}
                                        className="createUserTextInput"
                                        defaultVal={defaultSaleInvoice?.quantity}
                                        type='text'
                                        required={false}
                                        requiredMsg='Quantity is required'
                                        onKeyPress={(event) => onlyNumbers(event)}
                                        onBlur={() => {
                                            handleAmountPerItem(name, module);
                                            totalCalculations();
                                        }}
                                        typeMsg="Enter a valid Quantity!"
                                        // label="Quantity"
                                    />
                                </Col>
                            }
                            {module === 'labor' &&
                                <Col xl={{ span: 5 }} lg={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }} xs={{ span: 5 }}>
                                    {name === 0 && <h4 className='labelMargin'>Hours</h4>}
                                    <TextInput
                                        name={[name, 'hours']}
                                        className="createUserTextInput"
                                        defaultVal={defaultSaleInvoice?.hours}
                                        type='text'
                                        required={false}
                                        requiredMsg='Hours is required'
                                        onKeyPress={(event) => onlyNumbers(event)}
                                        onBlur={() => {
                                            handleAmountPerItem(name, module);
                                            totalCalculations();
                                        }}
                                        typeMsg="Enter a valid Hours!"
                                        // label="Quantity"
                                    />
                                </Col>
                            }
                            <Col xl={{ span: 5 }} lg={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }} xs={{ span: 5 }}>
                                {name === 0 && <h4 className='labelMargin'>Rate</h4>}
                                <Form.Item
                                    name={[name, 'unitOrHourPrice']}
                                    initialValue={defaultSaleInvoice?.unitOrHourPrice}
                                    // label='Rate'
                                    className='createUserTextInput'
                                    required={false}
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        controls={false}
                                        min={0}
                                        max={1000000000000000}
                                        // formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        // parser={(value) => value.replace(/\₹\s?|(,*)/g, '')}
                                        onKeyPress={(event) => onlyNumbers(event)}
                                        onBlur={() => {
                                            handleAmountPerItem(name, module);
                                            totalCalculations();
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={{ span: 5 }} lg={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }} xs={{ span: 5 }}>
                                {name === 0 && <h4 className='labelMargin'>Amount</h4>}
                                <Form.Item
                                    name={[name, 'amount']}
                                    // initialValue={defaultSaleInvoice?.amount ?? 0}
                                    initialValue={defaultSaleInvoice?.amount}
                                    // initialValue={defaultSaleInvoice ? defaultSaleInvoice?.amount : [name, 'amount']}
                                    // label='Amount'
                                    className='createUserTextInput'
                                    required={true}
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        controls={false}
                                        disabled
                                        min={0}
                                        max={1000000000000000}
                                        // formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        // parser={(value) => value.replace(/\₹\s?|(,*)/g, '')}
                                        // onKeyPress={(event) => onlyNumbers(event)}
                                        // value={amount}
                                    />
                                </Form.Item>
                            </Col>
                            {name === 0 && <PlusCircleOutlined className="listAddIcon" onClick={() => add()} />}
                            {name !== 0 && <MinusCircleOutlined className="listAddIcon listRemoveIcon" onClick={() => remove(name)} />}
                        </Row>
                    </>
                ))}
            </>
        )
    }

    return (
        <div>
            <Row align='middle' justify='space-between'>
                <h3 className="backButtonDiv" onClick={() => navigate(-1)}>
                    <LeftOutlined /> Back
                </h3>
            </Row>

            <Form
                preserve={false}
                form={saleInvoiceAddForm}
                name="addRoleForm"
                className="addRoleForm"
                scrollToFirstError
            >
                <Row>
                    {(isEditSaleInvoice) ?
                        <h2 className="modalHeader">Update Sale Invoice</h2>
                        :
                        <h2 className="modalHeader">Add Sale Invoice</h2>
                    }
                </Row>

                <Divider />

                <Row justify='space-between'>
                    <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                        <Card
                            size="small"
                            className="detailCard"
                            hoverable
                            key='saleCompanyCard'
                        >
                            <h3>Company Details</h3>
                            <Row justify='space-between'>
                                <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                                    <TextInput
                                        name="saleCompanyName"
                                        defaultVal={defaultSaleInvoice?.companyName}
                                        className="createUserTextInput"
                                        type='text'
                                        required={true}
                                        requiredMsg='Name is required'
                                        max={40}
                                        maxMsg="cannot be longer than 40 characters"
                                        typeMsg="Enter a valid Name!"
                                        label="Name"
                                    />
                                </Col>
                            </Row>
                            <Row justify='space-between'>
                                <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                                    <Form.Item
                                        name="saleCompanyAddress"
                                        className="createUserTextInput"
                                        type='text'
                                        initialValue={defaultSaleInvoice?.companyAddress}
                                        required={true}
                                        requiredMsg='Address is required'
                                        max={40}
                                        maxMsg="cannot be longer than 40 characters"
                                        typeMsg="Enter a valid Address!"
                                        label="Address"
                                    >
                                        <TextArea
                                            rows={3}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                        <Card
                            size="small"
                            // title='Contractor'
                            className="detailCard"
                            hoverable
                            key='saleContractorCard'
                        >
                            <h3>Contractor Details</h3>
                            <Row justify='space-between'>
                                <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                                    <TextInput
                                        name="saleContractorName"
                                        defaultVal={defaultSaleInvoice?.contractorName}
                                        className="createUserTextInput"
                                        type='text'
                                        required={true}
                                        requiredMsg='Name is required'
                                        max={40}
                                        maxMsg="cannot be longer than 40 characters"
                                        typeMsg="Enter a valid Name!"
                                        label="Name"
                                    />
                                </Col>
                            </Row>
                            <Row justify='space-between'>
                                <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                                    <Form.Item
                                        name="saleContractorAddress"
                                        className="createUserTextInput"
                                        type='text'
                                        initialValue={defaultSaleInvoice?.contractorAddress}
                                        required={true}
                                        requiredMsg='Address is required'
                                        max={40}
                                        maxMsg="cannot be longer than 40 characters"
                                        typeMsg="Enter a valid Address!"
                                        label="Address"
                                    >
                                        <TextArea
                                            rows={3}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row><br />

                <Row justify='space-between'>
                    <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                        <TextInput
                            name="saleInvoiceNumber"
                            defaultVal={defaultSaleInvoice?.saleInvoiceNumber}
                            className="createUserTextInput"
                            type='text'
                            max={40}
                            maxMsg="cannot be longer than 40 characters"
                            typeMsg="Enter a valid Sale Invoice Number!"
                            label="SI Number"
                        />
                    </Col>
                    {/* <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                        <Selectable
                            label='Status'
                            name="saleInvoiceStatus"
                            required={true}
                            defaultVal={defaultSaleInvoice?.status}
                            requiredMsg='Status is required'
                            firstName='name'
                            data={saleInVoiceStatusList}
                            width={400}
                            showSearch={false}
                            handleSelectChange={(val) => { }}
                        />
                    </Col> */}
                    <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                        <Form.Item
                            name='saleInvoiceDate'
                            label='Invoice Date'
                            className="createUserTextInput"
                            initialValue={defaultSaleInvoice ? dayjs(new Date(defaultSaleInvoice?.invoiceDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
                            rules={[{ required: true, message: 'Invoice Date is required' }]}
                        >
                            <DatePicker
                                className='datePicker'
                                placeholder=''
                                format='DD/MM/YYYY'
                            />
                        </Form.Item>
                    </Col>
                    <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                        <Form.Item
                            name='saleExpireDate'
                            label='Expire Date'
                            className="createUserTextInput"
                            initialValue={defaultSaleInvoice ? dayjs(new Date(defaultSaleInvoice?.expireDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
                            rules={[{ required: true, message: 'Expire Date is required' }]}
                        >
                            <DatePicker
                                className='datePicker'
                                placeholder=''
                                format='DD/MM/YYYY'
                            />
                        </Form.Item>
                    </Col>
                    <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                        <Form.Item
                            name='saleInvoiceWorkStartDate'
                            label='Work Start Date'
                            className="createUserTextInput"
                            initialValue={defaultSaleInvoice ? dayjs(new Date(defaultSaleInvoice?.workStartDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
                            rules={[{ required: false, message: 'Work Start Date is required' }]}
                        >
                            <DatePicker
                                className='datePicker'
                                placeholder=''
                                format='DD/MM/YYYY'
                            />
                        </Form.Item>
                    </Col>
                    <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                        <Form.Item
                            name='saleInvoiceWorkEndDate'
                            label='Work End Date'
                            className="createUserTextInput"
                            initialValue={defaultSaleInvoice ? dayjs(new Date(defaultSaleInvoice?.workEndDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
                            rules={[{ required: false, message: 'Work End Date is required' }]}
                        >
                            <DatePicker
                                className='datePicker'
                                placeholder=''
                                format='DD/MM/YYYY'
                            />
                        </Form.Item>
                    </Col>
                </Row>
                {/* <Row justify='space-between'>
                <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                    <Form.Item
                        name='saleInvoiceUnitPrice'
                        initialValue={defaultSaleInvoice?.unitPrice ?? 0}
                        label='Unit Price'
                        className='createUserTextInput'
                        required={false}
                    >
                    <InputNumber
                        style={{ width: '100%' }}
                        controls={false}
                        min={0}
                        max={1000000000000000}
                        formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/\₹\s?|(,*)/g, '')}
                        onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                            }
                        }}
                    />
                </Form.Item>
                </Col>
                <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                    <Form.Item
                        name='saleInvoiceTotalAmount'
                        initialValue={defaultSaleInvoice?.totalAmount ?? 0}
                        label='Total Amount'
                        className='createUserTextInput'
                        required={true}
                    >
                    <InputNumber
                        style={{ width: '100%' }}
                        controls={false}
                        min={0}
                        max={1000000000000000}
                        formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/\₹\s?|(,*)/g, '')}
                        onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                            }
                        }}
                    />
                    </Form.Item>
                </Col>      
            </Row> */}
                {/* <Row justify='space-between'>
                <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                    <TextInput
                        name="contractor"
                        defaultVal={defaultSaleInvoice?.contractor}
                        className="createUserTextInput"
                        type='text'
                        required={false}
                        requiredMsg='Contractor is required'
                        max={40}
                        maxMsg="cannot be longer than 40 characters"
                        typeMsg="Enter a valid Contractor!"
                        label="Contractor"
                    />
                </Col>
                <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                    <Selectable
                        label='Status'
                        name="saleInvoiceStatus"
                        required={true}
                        defaultVal={defaultSaleInvoice?.status}
                        requiredMsg='Status is required'
                        firstName='name'
                        data={saleInVoiceStatusList}
                        width={400}
                        showSearch={false}
                        handleSelectChange={(val) => { }}
                    />
                </Col>
            </Row> */}
                {/* <Row justify='space-between'>
                    <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                        <Form.Item name='attachment' label='Document' rules={[{ required: false, message: 'Document is Required' }]} >
                            <Upload
                                listType="text"
                                {...uploadProps}
                                maxCount={3}
                                multiple={true}
                                fileList={uploadFileList}
                            >
                                <Button className="imageFileBtn" icon={<UploadOutlined />} label='Upload' />
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row> */}

                <Row justify='space-between'>
                    <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                        <Card
                            size="small"
                            // title='Material'
                            key='1'
                        >
                            <h4>Materials</h4>
                            <Form form={saleInvoiceAddForm} onFinish={handleSaleInvoiceValues}>
                                <Form.List name="materialsList" initialValue={materialList}>
                                    {(fields, { add, remove }) => (
                                        // <Temp module='material' fields={fields} add={add} remove={remove} />
                                        <>
                                            {fields.map(({ key, name, ...restField }) => (
                                                <>
                                                    <Row justify='space-between' key={key} style={{ alignItems: (key !== 0) ? 'flex-start' : 'center' }}>
                                                        <Col xl={{ span: 6 }} lg={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }} xs={{ span: 6 }}>
                                                            {name === 0 && <h4 className='labelMargin'>Materials</h4>}
                                                            <TextInput
                                                                {...restField}
                                                                name={[name, 'description']}
                                                                defaultVal={defaultSaleInvoice?.description}
                                                                className="createUserTextInput"
                                                                type='text'
                                                                required={false}
                                                                requiredMsg='Description is required'
                                                                max={40}
                                                                maxMsg="cannot be longer than 40 characters"
                                                                typeMsg="Enter a valid Description!"
                                                                // label="Material"
                                                                // addonBefore="Material"
                                                                // addonBefore={name === 0 ? 'Material' : ''}
                                                            />
                                                        </Col>
                                                        {/* <Col xl={{ span: 5 }} lg={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }} xs={{ span: 5 }}>
                                                            {name === 0 && <h4 className='labelMargin'>Category</h4>}
                                                            <Selectable
                                                                // label='Status'
                                                                name={[name, 'category']}
                                                                required={true}
                                                                defaultVal={defaultSaleInvoice?.category}
                                                                requiredMsg='Category is required'
                                                                firstName='name'
                                                                data={saleInVoiceCategoryList}
                                                                width={400}
                                                                showSearch={false}
                                                                handleSelectChange={(val) => { }}
                                                            />
                                                        </Col> */}
                                                        <Col xl={{ span: 5 }} lg={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }} xs={{ span: 5 }}>
                                                            {name === 0 && <h4 className='labelMargin'>Quantity</h4>}
                                                            <TextInput
                                                                name={[name, 'quantity']}
                                                                className="createUserTextInput"
                                                                defaultVal={defaultSaleInvoice?.quantity}
                                                                type='text'
                                                                required={false}
                                                                requiredMsg='Quantity is required'
                                                                onKeyPress={(event) => onlyNumbers(event)}
                                                                onBlur={() => {
                                                                    handleAmountPerItem(name, 'material');
                                                                    totalCalculations();
                                                                }}
                                                                typeMsg="Enter a valid Quantity!"
                                                                // label="Quantity"
                                                            />
                                                        </Col>
                                                        <Col xl={{ span: 5 }} lg={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }} xs={{ span: 5 }}>
                                                            {name === 0 && <h4 className='labelMargin'>Rate</h4>}
                                                            <Form.Item
                                                                name={[name, 'unitOrHourPrice']}
                                                                initialValue={defaultSaleInvoice?.unitOrHourPrice}
                                                                // label='Rate'
                                                                className='createUserTextInput'
                                                                required={false}
                                                            >
                                                                <InputNumber
                                                                    style={{ width: '100%' }}
                                                                    controls={false}
                                                                    min={0}
                                                                    max={1000000000000000}
                                                                    // formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                    // parser={(value) => value.replace(/\₹\s?|(,*)/g, '')}
                                                                    onKeyPress={(event) => onlyNumbers(event)}
                                                                    onBlur={() => {
                                                                        handleAmountPerItem(name, 'material');
                                                                        totalCalculations();
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xl={{ span: 5 }} lg={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }} xs={{ span: 5 }}>
                                                            {name === 0 && <h4 className='labelMargin'>Amount</h4>}
                                                            <Form.Item
                                                                name={[name, 'amount']}
                                                                // initialValue={defaultSaleInvoice?.amount ?? 0}
                                                                initialValue={defaultSaleInvoice?.amount}
                                                                // initialValue={defaultSaleInvoice ? defaultSaleInvoice?.amount : [name, 'amount']}
                                                                // label='Amount'
                                                                className='createUserTextInput'
                                                                required={true}
                                                            >
                                                                <InputNumber
                                                                    style={{ width: '100%' }}
                                                                    formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                    controls={false}
                                                                    disabled
                                                                    min={0}
                                                                    max={1000000000000000}
                                                                    // formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                    // parser={(value) => value.replace(/\₹\s?|(,*)/g, '')}
                                                                    // onKeyPress={(event) => onlyNumbers(event)}
                                                                    // value={amount}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        {name === 0 && <PlusCircleOutlined className="listAddIcon" onClick={() => add()} />}
                                                        {name !== 0 && <MinusCircleOutlined className="listAddIcon listRemoveIcon" onClick={() => {
                                                            setRemoveItemList([ ...removeItemList, saleInvoiceAddForm.getFieldValue(["materialsList", name, "_id"]) ]);
                                                            remove(name);
                                                            totalCalculations();
                                                        }} />}
                                                    </Row>
                                                </>
                                            ))}
                                        </>
                                    )}
                                </Form.List>
                            </Form>

                            <Row align='middle' justify='space-between'>
                                <Col xl={{ span: 16 }} lg={{ span: 16 }} md={{ span: 16 }} sm={{ span: 16 }} xs={{ span: 16 }}></Col>
                                <Col xl={{ span: 4 }} lg={{ span: 4 }} md={{ span: 4 }} sm={{ span: 4 }} xs={{ span: 4 }} >
                                    <h4>Total: ₹ {getIndianMoneyFormat(materialTotal)}</h4>
                                </Col>
                                <Col></Col>
                            </Row>

                        </Card>
                    </Col>
                </Row><br />

                <Row justify='space-between'>
                    <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                        <Card
                            size="small"
                            // title='Labor'
                            key='2'
                        >
                            <h4>Labors</h4>
                            <Form form={saleInvoiceAddForm} onFinish={handleSaleInvoiceValues}>
                                <Form.List name="laborsList" initialValue={laborList}>
                                    {(fields, { add, remove }) => (
                                        // <Temp module='labor' fields={fields} add={add} remove={remove} />
                                        <>
                                            {fields.map(({ key, name, ...restField }) => (
                                                <>
                                                    <Row justify='space-between' key={key} style={{ alignItems: (key !== 0) ? 'flex-start' : 'center' }}>
                                                        <Col xl={{ span: 6 }} lg={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }} xs={{ span: 6 }}>
                                                            {name === 0 && <h4 className='labelMargin'>Labor</h4>}
                                                            <TextInput
                                                                {...restField}
                                                                name={[name, 'description']}
                                                                defaultVal={defaultSaleInvoice?.description}
                                                                className="createUserTextInput"
                                                                type='text'
                                                                required={false}
                                                                requiredMsg='Description is required'
                                                                max={40}
                                                                maxMsg="cannot be longer than 40 characters"
                                                                typeMsg="Enter a valid Description!"
                                                                // label="Material"
                                                                // addonBefore="Material"
                                                                // addonBefore={name === 0 ? 'Material' : ''}
                                                            />
                                                        </Col>
                                                        {/* <Col xl={{ span: 5 }} lg={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }} xs={{ span: 5 }}>
                                                            {name === 0 && <h4 className='labelMargin'>Category</h4>}
                                                            <Selectable
                                                                // label='Status'
                                                                name={[name, 'category']}
                                                                required={true}
                                                                defaultVal={defaultSaleInvoice?.category}
                                                                requiredMsg='Category is required'
                                                                firstName='name'
                                                                data={saleInVoiceCategoryList}
                                                                width={400}
                                                                showSearch={false}
                                                                handleSelectChange={(val) => { }}
                                                            />
                                                        </Col> */}
                                                        <Col xl={{ span: 5 }} lg={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }} xs={{ span: 5 }}>
                                                            {name === 0 && <h4 className='labelMargin'>Hours</h4>}
                                                            <TextInput
                                                                name={[name, 'hours']}
                                                                className="createUserTextInput"
                                                                defaultVal={defaultSaleInvoice?.hours}
                                                                type='text'
                                                                required={false}
                                                                requiredMsg='Hours is required'
                                                                onKeyPress={(event) => onlyNumbers(event)}
                                                                onBlur={() => {
                                                                    handleAmountPerItem(name, 'labor');
                                                                    totalCalculations();
                                                                }}
                                                                typeMsg="Enter a valid Hours!"
                                                                // label="Quantity"
                                                            />
                                                        </Col>
                                                        <Col xl={{ span: 5 }} lg={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }} xs={{ span: 5 }}>
                                                            {name === 0 && <h4 className='labelMargin'>Rate</h4>}
                                                            <Form.Item
                                                                name={[name, 'unitOrHourPrice']}
                                                                initialValue={defaultSaleInvoice?.unitOrHourPrice}
                                                                // label='Rate'
                                                                className='createUserTextInput'
                                                                required={false}
                                                            >
                                                                <InputNumber
                                                                    style={{ width: '100%' }}
                                                                    controls={false}
                                                                    min={0}
                                                                    max={1000000000000000}
                                                                    // formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                    // parser={(value) => value.replace(/\₹\s?|(,*)/g, '')}
                                                                    onKeyPress={(event) => onlyNumbers(event)}
                                                                    onBlur={() => {
                                                                        handleAmountPerItem(name, 'labor');
                                                                        totalCalculations();
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xl={{ span: 5 }} lg={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }} xs={{ span: 5 }}>
                                                            {name === 0 && <h4 className='labelMargin'>Amount</h4>}
                                                            <Form.Item
                                                                name={[name, 'amount']}
                                                                // initialValue={defaultSaleInvoice?.amount ?? 0}
                                                                initialValue={defaultSaleInvoice?.amount}
                                                                // initialValue={defaultSaleInvoice ? defaultSaleInvoice?.amount : [name, 'amount']}
                                                                // label='Amount'
                                                                className='createUserTextInput'
                                                                required={true}
                                                            >
                                                                <InputNumber
                                                                    style={{ width: '100%' }}
                                                                    controls={false}
                                                                    formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                    disabled
                                                                    min={0}
                                                                    max={1000000000000000}
                                                                    // formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                    // parser={(value) => value.replace(/\₹\s?|(,*)/g, '')}
                                                                    // onKeyPress={(event) => onlyNumbers(event)}
                                                                    // value={amount}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        {name === 0 && <PlusCircleOutlined className="listAddIcon" onClick={() => add()} />}
                                                        {name !== 0 && <MinusCircleOutlined className="listAddIcon listRemoveIcon" onClick={() => {
                                                            setRemoveItemList([ ...removeItemList, saleInvoiceAddForm.getFieldValue(["laborsList", name, "_id"]) ]);
                                                            remove(name);
                                                            totalCalculations();
                                                        }} />}
                                                    </Row>
                                                </>
                                            ))}
                                        </>
                                    )}
                                </Form.List>
                            </Form>

                            <Row align='middle' justify='space-between'>
                                <Col xl={{ span: 16 }} lg={{ span: 16 }} md={{ span: 16 }} sm={{ span: 16 }} xs={{ span: 16 }}></Col>
                                <Col xl={{ span: 4 }} lg={{ span: 4 }} md={{ span: 4 }} sm={{ span: 4 }} xs={{ span: 4 }} >
                                    <h4>Total: ₹ {getIndianMoneyFormat(laborTotal)}</h4>
                                </Col>
                                <Col></Col>
                            </Row>
                        </Card>
                    </Col>
                </Row><br />

                <Row justify='space-between'>
                    <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                        <Form.Item
                            name='saleTotalMaterial'
                            // initialValue={Number(materialTotal)??0}
                            initialValue={defaultSaleInvoice?.totalMaterial??0}
                            label='Total Material'
                            className='createUserTextInput'
                            required={false}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                disabled
                                formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                controls={false}
                                min={0}
                                max={1000000000000000}
                                onKeyPress={(event) => onlyNumbers(event)}
                            />
                        </Form.Item>
                    </Col>
                    <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                        <Form.Item
                            name='saleTotalLabor'
                            // initialValue={Number(laborTotal)??0}
                            initialValue={defaultSaleInvoice?.totalLabor??0}
                            label='Total Labor'
                            className='createUserTextInput'
                            required={false}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                disabled
                                formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                controls={false}
                                min={0}
                                max={1000000000000000}
                                onKeyPress={(event) => onlyNumbers(event)}
                            />
                        </Form.Item>
                    </Col>
                    <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                        <Form.Item
                            name='saleSubTotal'
                            // initialValue={defaultSaleInvoice?.amount ?? 0}
                            initialValue={defaultSaleInvoice?.subTotal??0}
                            label='SubTotal'
                            className='createUserTextInput'
                            required={false}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                controls={false}
                                formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                min={0}
                                disabled
                                max={1000000000000000}
                                onKeyPress={(event) => onlyNumbers(event)}
                            />
                        </Form.Item>
                    </Col>
                    <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                        <Form.Item
                            name='saleMaterialTax'
                            initialValue={`${defaultMaterialTax}%`}
                            // initialValue={`${allTaxesList?.find(o => o.name === 'Materials')?.taxPercent??0}%`}
                            label='Material Tax'
                            className='createUserTextInput'
                            required={false}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                controls={false}
                                min={0}
                                disabled
                                max={1000000000000000}
                                onKeyPress={(event) => onlyNumbers(event)}
                            />
                        </Form.Item>
                    </Col>
                    <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                        <Form.Item
                            name='saleLaborTax'
                            initialValue={`${defaultLaborTax}%`}
                            // initialValue={`${allTaxesList?.find(o => o.name === 'Labor')?.taxPercent??0}%`}
                            label='Labor Tax'
                            className='createUserTextInput'
                            required={false}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                controls={false}
                                disabled
                                min={0}
                                max={1000000000000000}
                                onKeyPress={(event) => onlyNumbers(event)}
                            />
                        </Form.Item>
                    </Col>
                    <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                        <Form.Item
                            name='saleTotalTax'
                            // initialValue={defaultSaleInvoice?.amount ?? 0}
                            initialValue={defaultSaleInvoice?.totalTax??0}
                            label='Total Tax'
                            className='createUserTextInput'
                            required={false}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                controls={false}
                                disabled
                                formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                min={0}
                                max={1000000000000000}
                                onKeyPress={(event) => onlyNumbers(event)}
                            />
                        </Form.Item>
                    </Col>
                    <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                        <Form.Item
                            name='saleTotalAmount'
                            // initialValue={defaultSaleInvoice?.amount ?? 0}
                            initialValue={defaultSaleInvoice?.amount??0}
                            label='Total'
                            className='createUserTextInput'
                            required={false}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                controls={false}
                                disabled
                                formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                min={0}
                                max={1000000000000000}
                                onKeyPress={(event) => onlyNumbers(event)}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify="end" className="formBtnRow" >
                    <Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }} xs={{ span: 12 }} className="formBtnCol" >
                        <Button
                            onClick={() => {
                                handleSaleInvoiceValues(saleInvoiceAddForm);
                            }}
                            className='appPrimaryButton formWidth'
                            label='Save'
                        />
                        <Button
                            label='Cancel'
                            className="appButton formWidth"
                            onClick={() => {
                                navigate(-1);
                                saleInvoiceAddForm.resetFields();
                                // setSaleInvoiceModalOpen(false);
                            }}
                        />
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default AddEditSaleInvoice;