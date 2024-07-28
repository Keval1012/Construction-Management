import React, { useEffect, useRef, useState } from "react";
import { Card, Col, DatePicker, Divider, Form, Input, InputNumber, Row, Space, Table, Upload, message } from "antd";
import Button from "./AppButton";
import TextInput from "./TextInput";
import Selectable from './Selectable';
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { POStatusList } from "../constants";
import { LeftOutlined, MinusCircleOutlined, PlusCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { addPurchaseOrder, getAllTax, updatePurchaseOrder } from "../API/Api";
import { useLocation, useNavigate } from "react-router-dom";
import { getIndianMoneyFormat, onlyNumbers } from "../helper";

const AddEditPurchaseOrder = () => {
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
    const { defaultProject, defaultPurchaseOrder, isEditPurchaseOrder } = location?.state ?? {};
    const [purchaseOrderAddForm] = Form.useForm();
    const [allTaxesList, setAllTaxesList] = useState([]);
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
    const [materialTotal, setMaterialTotal] = useState('0.00');
    const [removeItemList, setRemoveItemList] = useState([]);

    useEffect(() => {
        fetchAllTaxes();
    }, []);

    useEffect(() => {
        if (defaultPurchaseOrder && defaultPurchaseOrder?.purchaseItems?.length > 0) {
            let matList = [];
            defaultPurchaseOrder?.purchaseItems?.forEach(o => {
                if (o.category === 'material') matList.push(o);
            });
            purchaseOrderAddForm.setFieldValue('materialsList', matList);
            purchaseOrderAddForm.setFieldValue('purchaseTotalMaterial', Number(defaultPurchaseOrder?.materialAmount).toFixed(2));
            purchaseOrderAddForm.setFieldValue('purchaseSubTotal', Number(Number(defaultPurchaseOrder?.materialAmount)).toFixed(2));
            purchaseOrderAddForm.setFieldValue('purchaseTotalTax', Number(defaultPurchaseOrder?.totalTax).toFixed(2));
            purchaseOrderAddForm.setFieldValue('purchaseTotalAmount', Number(defaultPurchaseOrder?.totalAmount).toFixed(2));
            setMaterialTotal(Number(defaultPurchaseOrder?.materialAmount));
        }
    }, [JSON.stringify(defaultPurchaseOrder)]);

    const fetchAllTaxes = async () => {
        const res = await getAllTax();
        if (res?.data?.success) {
            setAllTaxesList(res?.data?.data);
            purchaseOrderAddForm.setFieldValue('purchaseMaterialTax', `${res?.data?.data?.find(o => o.name === 'Materials')?.taxPercent ?? 0}%`);
            setDefaultMaterialTax(res?.data?.data?.find(o => o.name === 'Materials')?.taxPercent ?? 0);
        }
    };

    const totalCalculations = () => {
        let { materialsList } = purchaseOrderAddForm.getFieldsValue();
        let totalTax = '0.00';
        let totalMaterialAmt = '0.00';
        let subTotal = '0.00';
        let totalAmt = '0.00';

        if (materialsList?.length > 0) {
            materialsList.forEach(o => {
                if (o?.amount) totalMaterialAmt = Number(totalMaterialAmt) + Number(o.amount);
            });
        }
        setMaterialTotal(Number(totalMaterialAmt).toFixed(2));

        totalTax = ((Number(totalMaterialAmt) * Number(defaultMaterialTax)) / 100);
        subTotal = Number(totalMaterialAmt);
        totalAmt = Number(totalMaterialAmt) + Number(totalTax);

        purchaseOrderAddForm.setFieldValue('purchaseTotalMaterial', Number(totalMaterialAmt).toFixed(2));
        purchaseOrderAddForm.setFieldValue('purchaseSubTotal', Number(subTotal).toFixed(2));
        purchaseOrderAddForm.setFieldValue('purchaseTotalTax', Number(totalTax).toFixed(2));
        purchaseOrderAddForm.setFieldValue('purchaseTotalAmount', Number(totalAmt).toFixed(2));
    };

    const handleAmountPerItem = (index, module) => {
        let { materialsList } = purchaseOrderAddForm.getFieldsValue();
        if (module === 'material') {
            materialsList.forEach((o, i) => {
                if (i === index && !isNaN(parseFloat(o?.unitOrHourPrice)) && !isNaN(parseFloat(o?.quantity))) {
                    o.amount = (parseFloat(o.unitOrHourPrice) * parseFloat(o.quantity)).toString();
                }
            });
            purchaseOrderAddForm.setFieldValue('materialsList', materialsList);
        }
        // totalCalculations();
    };

    const checkList = (array, module) => {
        if (array?.length === 1 && Object.values(array[0]).every(val => val === '' || val === null || val === undefined)) {
            return true;
        } else {
            if (module === 'material') return array?.every(item => item?.description && item?.quantity && item?.unitOrHourPrice && item?.amount);
        }
    }

    const handlePurchaseOrderValues = async (form) => {
        const values = form.getFieldsValue();
        const { purchaseOrderName, purchaseCompanyName, purchaseCompanyAddress, purchaseVendorName, purchaseVendorAddress, purchaseOrderNumber, purchaseOrderDate, purchaseExpireDate, purchaseOrderWorkStartDate, purchaseOrderWorkEndDate,
            purchaseTotalMaterial, purchaseMaterialTax, purchaseSubTotal, purchaseTotalTax, purchaseTotalAmount, purchaseOrderStatus, materialsList } = values;

        if (defaultProject?._id && purchaseOrderName && purchaseCompanyName && purchaseCompanyAddress && purchaseVendorName && purchaseVendorAddress && purchaseOrderDate && purchaseExpireDate && purchaseTotalAmount &&
            purchaseTotalMaterial && purchaseMaterialTax && purchaseSubTotal && purchaseTotalTax) {
            if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
                return;
            }

            if (!checkList(materialsList, 'material')) {
                return message.error('List Fields Required!');
            }

            let purchaseItemsArr = [];
            materialsList?.forEach(o => {
                purchaseItemsArr.push({
                    _id: o?._id??'',
                    description: o.description,
                    quantity: o.quantity,
                    unitOrHourPrice: o.unitOrHourPrice,
                    hours: '',
                    amount: o.amount,
                    category: 'material',
                })
            });

            const data = {
                projectId: defaultProject?._id,
                purchaseOrderName: purchaseOrderName,
                purchaseOrderNumber: purchaseOrderNumber ? purchaseOrderNumber : '',
                companyName: purchaseCompanyName,
                companyAddress: purchaseCompanyAddress,
                vendorName: purchaseVendorName,
                vendorAddress: purchaseVendorAddress,
                workStartDate: purchaseOrderWorkStartDate ? purchaseOrderWorkStartDate : null,
                workEndDate: purchaseOrderWorkEndDate ? purchaseOrderWorkEndDate : null,
                PODate: purchaseOrderDate,
                expireDate: purchaseExpireDate,
                subTotal: purchaseSubTotal,
                materialAmount: purchaseTotalMaterial,
                materialTax: purchaseMaterialTax,
                totalTax: purchaseTotalTax,
                totalAmount: purchaseTotalAmount,
                // status: purchaseOrderStatus,
                purchaseItemsArr: purchaseItemsArr,
                removeItemList: removeItemList
            };

            if (isEditPurchaseOrder) {
                try {
                    const res = await updatePurchaseOrder(defaultPurchaseOrder?._id, data);
                    if (res.data?.success) {
                        purchaseOrderAddForm.resetFields();
                        setMaterialTotal('0.00');
                        // setPurchaseOrderModalOpen(false);
                        message.success('Purchase Order Updated Successfully');
                    } else message.error(res.data?.message);
                } catch (error) {
                    message.error('Something went wrong' + error);
                }
            }

            if (!isEditPurchaseOrder) {
                try {
                    const res = await addPurchaseOrder(data);
                    if (res?.data?.success) {
                        purchaseOrderAddForm.resetFields();
                        setMaterialTotal('0.00');
                        // setPurchaseOrderModalOpen(false);
                        message.success('Purchase Order Added Successfully')
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

    return (
        <div>
            <Row align='middle' justify='space-between'>
                <h3 className="backButtonDiv" onClick={() => navigate(-1)}>
                    <LeftOutlined /> Back
                </h3>
            </Row>

            <Form
                preserve={false}
                form={purchaseOrderAddForm}
                name="addRoleForm"
                className="addRoleForm"
                scrollToFirstError
            >
                <Row>
                    {(isEditPurchaseOrder) ?
                        <h2 className="modalHeader">Update Purchase Order</h2>
                        :
                        <h2 className="modalHeader">Add Purchase Order</h2>
                    }
                </Row>

                <Divider />

                <Row>
                    <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                        <TextInput
                            name="purchaseOrderName"
                            defaultVal={defaultPurchaseOrder?.purchaseOrderName}
                            className="createUserTextInput"
                            type='text'
                            required={true}
                            requiredMsg='Name is required'
                            max={40}
                            maxMsg="cannot be longer than 40 characters"
                            typeMsg="Enter a valid Purchase Order Number!"
                            label="Purchase Order Name"
                        />
                    </Col>
                </Row>

                <Row justify='space-between'>
                    <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                        <Card
                            size="small"
                            className="detailCard"
                            hoverable
                            key='purchaseCompanyCard'
                        >
                            <h3>Company Details</h3>
                            <Row justify='space-between'>
                                <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                                    <TextInput
                                        name="purchaseCompanyName"
                                        defaultVal={defaultPurchaseOrder?.companyName}
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
                                        name="purchaseCompanyAddress"
                                        className="createUserTextInput"
                                        type='text'
                                        initialValue={defaultPurchaseOrder?.companyAddress}
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
                            key='purchaseContractorCard'
                        >
                            <h3>Vendor Details</h3>
                            <Row justify='space-between'>
                                <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                                    <TextInput
                                        name="purchaseVendorName"
                                        defaultVal={defaultPurchaseOrder?.vendorName}
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
                                        name="purchaseVendorAddress"
                                        className="createUserTextInput"
                                        type='text'
                                        initialValue={defaultPurchaseOrder?.vendorAddress}
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
                            name="purchaseOrderNumber"
                            defaultVal={defaultPurchaseOrder?.purchaseOrderNumber}
                            className="createUserTextInput"
                            type='text'
                            max={40}
                            maxMsg="cannot be longer than 40 characters"
                            typeMsg="Enter a valid Purchase Order Number!"
                            label="PO Number"
                        />
                    </Col>
                    {/* <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                        <Selectable
                            label='Status'
                            name="purchaseOrderStatus"
                            required={true}
                            disabled={true}
                            defaultVal={defaultPurchaseOrder?.status ?? 'pending'}
                            requiredMsg='Status is required'
                            firstName='name'
                            data={POStatusList}
                            width={400}
                            showSearch={false}
                            handleSelectChange={(val) => { }}
                        />
                    </Col> */}
                    <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                        <Form.Item
                            name='purchaseOrderDate'
                            label='PO Date'
                            className="createUserTextInput"
                            initialValue={defaultPurchaseOrder ? dayjs(new Date(defaultPurchaseOrder?.PODate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
                            rules={[{ required: true, message: 'PO Date is required' }]}
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
                            name='purchaseExpireDate'
                            label='Delivery Date'
                            className="createUserTextInput"
                            initialValue={defaultPurchaseOrder ? dayjs(new Date(defaultPurchaseOrder?.expireDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
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
                            name='purchaseOrderWorkStartDate'
                            label='Work Start Date'
                            className="createUserTextInput"
                            initialValue={defaultPurchaseOrder ? dayjs(new Date(defaultPurchaseOrder?.workStartDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
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
                            name='purchaseOrderWorkEndDate'
                            label='Work End Date'
                            className="createUserTextInput"
                            initialValue={defaultPurchaseOrder ? dayjs(new Date(defaultPurchaseOrder?.workEndDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
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

                <Row justify='space-between'>
                    <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                        <Card
                            size="small"
                            // title='Material'
                            key='1'
                        >
                            <h4>Cost Items</h4>
                            <Form form={purchaseOrderAddForm} onFinish={handlePurchaseOrderValues}>
                                <Form.List name="materialsList" initialValue={materialList}>
                                    {(fields, { add, remove }) => (
                                        // <Temp module='material' fields={fields} add={add} remove={remove} />
                                        <>
                                            {fields.map(({ key, name, ...restField }) => 
                                            // {fields.map((field, key, name, restField) => 
                                            (
                                                    <>
                                                        <Row justify='space-between' key={key} style={{ alignItems: (key !== 0) ? 'flex-start' : 'center' }}>
                                                            <Col xl={{ span: 6 }} lg={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }} xs={{ span: 6 }}>
                                                                {name === 0 && <h4 className='labelMargin'>Item</h4>}
                                                                <TextInput
                                                                    {...restField}
                                                                    name={[name, 'description']}
                                                                    defaultVal={defaultPurchaseOrder?.description}
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
                                                                    defaultVal={defaultPurchaseOrder?.category}
                                                                    requiredMsg='Category is required'
                                                                    firstName='name'
                                                                    data={purchaseOrderCategoryList}
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
                                                                    defaultVal={defaultPurchaseOrder?.quantity}
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
                                                                {name === 0 && <h4 className='labelMargin'>Unit Cost</h4>}
                                                                <Form.Item
                                                                    name={[name, 'unitOrHourPrice']}
                                                                    initialValue={defaultPurchaseOrder?.unitOrHourPrice}
                                                                    // label='Rate'
                                                                    className='createUserTextInput'
                                                                    required={false}
                                                                >
                                                                    <InputNumber
                                                                        style={{ width: '100%' }}
                                                                        controls={false}
                                                                        min={0}
                                                                        formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                        max={1000000000000000}
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
                                                                    // initialValue={defaultPurchaseOrder?.amount ?? 0}
                                                                    initialValue={defaultPurchaseOrder?.amount}
                                                                    // initialValue={defaultPurchaseOrder ? defaultPurchaseOrder?.amount : [name, 'amount']}
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
                                                                setRemoveItemList([...removeItemList, purchaseOrderAddForm.getFieldValue(["materialsList", name, "_id"]) ]);
                                                                remove(name);
                                                                totalCalculations();
                                                            }} />}
                                                        </Row>
                                                    </>
                                            )
                                            )}
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
                    <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                        <Form.Item
                            name='purchaseTotalMaterial'
                            // initialValue={Number(materialTotal) ?? 0}
                            initialValue={defaultPurchaseOrder?.totalMaterial??0}
                            label='Total Items Cost'
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
                    {/* </Row>
                <Row justify='space-between'> */}
                    <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                        <Form.Item
                            name='purchaseSubTotal'
                            // initialValue={defaultPurchaseOrder?.amount ?? 0}
                            initialValue={defaultPurchaseOrder?.subTotal ?? 0}
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
                            name='purchaseMaterialTax'
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
                    {/* </Row>
                <Row justify='space-between'> */}
                    <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                        <Form.Item
                            name='purchaseTotalTax'
                            // initialValue={defaultPurchaseOrder?.amount ?? 0}
                            initialValue={defaultPurchaseOrder?.totalTax ?? 0}
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
                    {/* </Row>
                <Row justify='space-between'> */}
                    <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                        <Form.Item
                            name='purchaseTotalAmount'
                            // initialValue={defaultPurchaseOrder?.amount ?? 0}
                            initialValue={defaultPurchaseOrder?.amount ?? 0}
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
                                handlePurchaseOrderValues(purchaseOrderAddForm);
                            }}
                            className='appPrimaryButton formWidth'
                            label='Save'
                        />
                        <Button
                            label='Cancel'
                            className="appButton formWidth"
                            onClick={() => {
                                purchaseOrderAddForm.resetFields();
                                // setPurchaseOrderModalOpen(false);
                            }}
                        />
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default AddEditPurchaseOrder;