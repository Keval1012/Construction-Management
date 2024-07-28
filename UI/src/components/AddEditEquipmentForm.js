import React, { useState } from 'react';
import { Col, DatePicker, Divider, Form, Input, InputNumber, Radio, Row, message } from 'antd';
import TextInput from './TextInput';
import Button from './AppButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { addEquipment, updateEquipment } from '../API/Api';
import { LeftOutlined } from '@ant-design/icons';
import Selectable from './Selectable';
import { equipmentTypeList, equipmentStatusList } from '../constants';
import dayjs from 'dayjs';

const AddEditEquipmentForm = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { TextArea } = Input;
    const { isEditEquipment, defaultEquipment, equipmentNameList } = location?.state??{};
    const [addEquipmentForm] = Form.useForm();
    const [isRentalValue, setIsRentalValue] = useState(defaultEquipment ? defaultEquipment?.isRental : false);

    const handleAddEquipmentValues = async (form) => {
        const values = form.getFieldsValue();
        const { addEquipmentName, addEquipmentType, addEquipmentQty, addEquipmentMfgDate, addEquipmentIsRental, addEquipmentPurchaseDate, addEquipmentPurchasePrice, addEquipmentRentalPrice, addEquipmentLocation, addEquipmentNotes, addEquipmentStatus, addEquipmentRentalStartDate, addEquipmentRentalEndDate, addEquipmentIsRentalReturned } = values;
        
        if (addEquipmentName && addEquipmentType && addEquipmentQty && addEquipmentMfgDate && (addEquipmentIsRental ? (addEquipmentRentalPrice && addEquipmentRentalStartDate && addEquipmentRentalEndDate && addEquipmentIsRentalReturned) : (addEquipmentPurchaseDate && addEquipmentPurchasePrice)) && addEquipmentStatus) {
            if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
                return;
            }

            let data = {
                equipmentName: addEquipmentName,
                equipmentType: addEquipmentType,
                totalQuantity: addEquipmentQty,
                manufactureDate: addEquipmentMfgDate,
                isRental: JSON.parse(addEquipmentIsRental),
                purchaseDate: addEquipmentPurchaseDate ? addEquipmentPurchaseDate : '',
                purchasePrice: addEquipmentPurchasePrice ? addEquipmentPurchasePrice : 0,
                rentalPricePerDay: addEquipmentRentalPrice ? addEquipmentRentalPrice : 0,
                currentLocation: addEquipmentLocation ? addEquipmentLocation : '',
                notes: addEquipmentNotes ? addEquipmentNotes : '',
                status: addEquipmentStatus,
                rentalStartDate: addEquipmentRentalStartDate ? addEquipmentRentalStartDate : '',
                rentalEndDate: addEquipmentRentalEndDate ? addEquipmentRentalEndDate : '',
                isRentalReturned: addEquipmentIsRentalReturned
            }

            if (!isEditEquipment) {
                try {
                    const res = await addEquipment(data);
                    if (res.data?.success) {
                        addEquipmentForm.resetFields();
                        message.success('Equipment Added Successfully');
                        return;
                    } else {
                        message.error('ss',res.data?.message);
                    }

                } catch (error) {
                    message.error('sss', error.response.data.error);
                }
            }

            if (isEditEquipment) {
                try {
                    const res = await updateEquipment(defaultEquipment?._id, data);
                    if (res.data?.success) {
                        addEquipmentForm.resetFields();
                        navigate(-1);
                        message.success(defaultEquipment.name + ' Equipment Updated Successfully');
                    } else message.error(res.data?.message);
                } catch (error) {
                    message.error('Something went wrong' + error);
                }
            }
        } else {
            message.error('Please add required fields');
        }
    };
 

    return (
        <div>
            <Row align='middle' justify='space-between'>
                <h3
                    className="backButtonDiv"
                    onClick={() => navigate(-1)}
                >
                    <LeftOutlined /> Back
                </h3>
            </Row>

            <Form
                preserve={false}
                form={addEquipmentForm}
                name="addUserForm"
                className="addUserForm"
                scrollToFirstError
            >
                <Row align='middle' justify='space-between'>
                    <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                        <h2 className='allPageHeader'>{isEditEquipment ? 'Edit Equipment' : 'Add New Equipment'}</h2>
                    </Col>
                </Row>

                <Divider />

                <div>
                    <Row justify='space-between'>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <Selectable
                                label='Equipment Name'
                                name="addEquipmentName"
                                required={true}
                                defaultVal={defaultEquipment?.equipmentName}
                                requiredMsg='Inspector is required'
                                firstName='name'
                                data={equipmentNameList}
                                width={400}
                                showSearch={false}
                                handleSelectChange={(val) => { }}
                            />
                        </Col>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <Selectable
                                label='Equipment Type'
                                name="addEquipmentType"
                                required={true}
                                defaultVal={defaultEquipment?.equipmentType}
                                requiredMsg='Type is required'
                                firstName='name'
                                data={equipmentTypeList}
                                width={400}
                                showSearch={true}
                                handleSelectChange={(val) => { }}
                            />
                        </Col>
                    </Row>
                    <Row justify='space-between'>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <TextInput
                                name="addEquipmentQty"
                                className="createUserTextInput"
                                defaultVal={defaultEquipment?.totalQuantity}
                                type='text'
                                required={true}
                                requiredMsg='Quantity is required'
                                typeMsg="Enter a valid Address!"
                                label="Total Quantity"
                                onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                            />
                        </Col>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <Form.Item
                                name='addEquipmentMfgDate'
                                label='Manufacture Date'
                                className="createUserTextInput"
                                initialValue={defaultEquipment ? dayjs(new Date(defaultEquipment?.manufactureDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
                                rules={[{ required: true, message: 'Mfg. Date is required' }]}
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
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <Form.Item
                                name='addEquipmentIsRental'
                                label='Is Rental'
                                initialValue={defaultEquipment?.isRental}
                                rules={[{ required: true, message: 'isRental is Required' }]}
                                onChange={(e) => setIsRentalValue(JSON.parse(e.target.value))} 
                            >
                                <Radio.Group>
                                    <Radio value={true}>Yes</Radio>
                                    <Radio value={false}>No</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        {!isRentalValue && 
                            <>
                                <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                                    <Form.Item
                                        name='addEquipmentPurchaseDate'
                                        label='Purchase Date'
                                        className="createUserTextInput"
                                        // initialValue={defaultEquipment ? dayjs(new Date(defaultEquipment?.purchaseDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
                                        initialValue={defaultEquipment?.purchaseDate ? dayjs(new Date(defaultEquipment?.purchaseDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : ''}
                                        rules={[{ required: true, message: 'Purchase Date is required' }]}
                                    >
                                        <DatePicker
                                            className='datePicker'
                                            placeholder=''
                                            format='DD/MM/YYYY'
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                                    {/* <TextInput
                                        style={{ width: '100%' }}
                                        name="addEquipmentPurchasePrice"
                                        className="createUserTextInput"
                                        defaultVal={defaultEquipment?.purchasePrice}
                                        type='number'
                                        onKeyPress={(event) => {
                                            if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                        required={true}
                                        requiredMsg='Price is required'
                                        typeMsg="Enter a valid Start Date!"
                                        label="Purchase Price"
                                        formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value.replace(/\₹\s?|(,*)/g, '')}
                                    /> */}

                                    <Form.Item
                                        name='addEquipmentPurchasePrice'
                                        initialValue={defaultEquipment?.purchasePrice ?? 0}
                                        label='Purchase Price'
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
                            </>
                        }
                        {isRentalValue &&
                            <>
                                <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                                    {/* <TextInput
                                        style={{ width: '100%' }}
                                        name="addEquipmentRentalPrice"
                                        className="createUserTextInput"
                                        defaultVal={defaultEquipment?.rentalPricePerDay}
                                        type='number'
                                        required={true}
                                        requiredMsg='Rental Price is required'
                                        onKeyPress={(event) => {
                                            if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                        typeMsg="Enter a valid price!"
                                        label="Rental Price (Per Day)"
                                        formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value.replace(/\₹\s?|(,*)/g, '')}
                                    /> */}
                                    <Form.Item
                                        name='addEquipmentRentalPrice'
                                        initialValue={defaultEquipment?.rentalPricePerDay ?? 0}
                                        label='Rental Price (Per Day)'
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
                                <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                                    <Form.Item
                                        name='addEquipmentRentalStartDate'
                                        label='Rental Start Date'
                                        className="createUserTextInput"
                                        // initialValue={defaultEquipment ? dayjs(new Date(defaultEquipment?.rentalStartDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
                                        initialValue={defaultEquipment?.rentalStartDate ? dayjs(new Date(defaultEquipment?.rentalStartDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : ''}
                                        rules={[{ required: true, message: 'Start Date is required' }]}
                                    >
                                        <DatePicker
                                            className='datePicker'
                                            placeholder=''
                                            format='DD/MM/YYYY'
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                                    <Form.Item
                                        name='addEquipmentRentalEndDate'
                                        label='Rental End Date'
                                        className="createUserTextInput"
                                        // initialValue={defaultEquipment ? dayjs(new Date(defaultEquipment?.rentalEndDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
                                        initialValue={defaultEquipment?.rentalEndDate ? dayjs(new Date(defaultEquipment?.rentalEndDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : ''}
                                        rules={[{ required: true, message: 'End Date is required' }]}
                                    >
                                        <DatePicker
                                            className='datePicker'
                                            placeholder=''
                                            format='DD/MM/YYYY'
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                                    <Form.Item
                                        name='addEquipmentIsRentalReturned'
                                        label='Is Rental Returned'
                                        initialValue={!isEditEquipment ? isRentalValue : defaultEquipment?.isRentalReturned}
                                        rules={[{ required: true, message: 'isRentalReturned is Required' }]}
                                    >
                                        <Radio.Group disabled={!isEditEquipment}>
                                            <Radio value={true}>Yes</Radio>
                                            <Radio value={false}>No</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </>
                        }
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <TextInput
                                name="addEquipmentLocation"
                                className="createUserTextInput"
                                defaultVal={defaultEquipment?.currentLocation}
                                type='text'
                                required={false}
                                requiredMsg='Location is required'
                                typeMsg="Enter a valid location!"
                                label="Current Location"
                            />
                        </Col>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <Form.Item
                                name="addEquipmentNotes"
                                className="createUserTextInput"
                                initialValue={defaultEquipment?.notes}
                                type='text'
                                required={false}
                                requiredMsg='Notes is required'
                                max={40}
                                maxMsg="cannot be longer than 40 characters"
                                typeMsg="Enter a valid Project Name!"
                                label="Notes"
                            >
                                <TextArea
                                    rows={3}
                                />
                            </Form.Item>
                        </Col>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <Selectable
                                label='Status'
                                name="addEquipmentStatus"
                                required={true}
                                defaultVal={!isEditEquipment ? 'available' : defaultEquipment?.status}
                                requiredMsg='Status is required'
                                firstName='name'
                                data={equipmentStatusList}
                                width={400}
                                showSearch={false}
                                handleSelectChange={(val) => { }}
                                disabled={!isEditEquipment ? true : false}
                            />
                        </Col>

                    </Row>
                </div>

                <div>
                    <Divider />
                    <Row justify="end" className="formBtnRow" >
                        <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 8 }} sm={{ span: 8 }} xs={{ span: 8 }} className="formBtnCol" >
                            <Button
                                onClick={() => {
                                    handleAddEquipmentValues(addEquipmentForm);
                                }}
                                className='appPrimaryButton formWidth'
                                label='Save'
                            />
                            <Button
                                label='Cancel'
                                className="appButton formWidth"
                                onClick={() => {
                                    addEquipmentForm.resetFields();
                                    navigate(-1);
                                }}
                            />
                        </Col>
                    </Row>
                </div>
            </Form>
        </div>
    )
}

export default AddEditEquipmentForm;