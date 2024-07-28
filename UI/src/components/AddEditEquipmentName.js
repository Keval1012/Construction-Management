import React, { useContext, useEffect, useState } from 'react';
import { Col, Divider, Form, Row } from "antd";
import TextInput from "./TextInput";
import Button from "./AppButton";
// import './styles/equipment.css'

const AddEditEquipmentName = ({
    isEditEquipmentName,
    handleEquipmentNameFormValues,
    setEquipmentNameModalOpen,
    defaultEquipment,
}) => {

    const [eqptNameAddForm] = Form.useForm();

    return (
        <Form
            preserve={false}
            form={eqptNameAddForm}
            name="addEquipmentNameForm"
            className="addRoleForm"
            scrollToFirstError
        >
            <Row>
                {(isEditEquipmentName) ?
                    <h2 className="modalHeader">Update Equipment Name</h2>
                    :
                    <h2 className="modalHeader">Add Equipment Name</h2>
                }
            </Row>
            <Divider />
            <div>
                <Row>
                    <Col xl={{ span: 23 }} lg={{ span: 23 }} md={{ span: 23 }} sm={{ span: 23 }} xs={{ span: 23 }}>
                        <TextInput
                            name="name"
                            defaultVal={defaultEquipment?.name}
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
                <Row>
                    <Col xl={{ span: 23 }} lg={{ span: 23 }} md={{ span: 23 }} sm={{ span: 23 }} xs={{ span: 23 }}>
                        <TextInput
                            name="displayName"
                            defaultVal={defaultEquipment?.displayName}
                            className="createUserTextInput"
                            type='text'
                            required={true}
                            requiredMsg='Display Name is required'
                            max={40}
                            maxMsg="cannot be longer than 40 characters"
                            typeMsg="Enter a valid Display Name!"
                            label="Display Name"
                        />
                    </Col>
                </Row>
            </div>
            <Divider />
            <Row justify="end" className="formBtnRow" >
                <Col xl={{ span: 12 }} lg={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }} xs={{ span: 12 }} className="formBtnCol" >
                    <Button
                        onClick={() => {
                            handleEquipmentNameFormValues(eqptNameAddForm);
                        }}
                        className='appPrimaryButton formWidth'
                        label='Save'
                    />
                    <Button
                        label='Cancel'
                        className="appButton formWidth"
                        onClick={() => {
                            eqptNameAddForm.resetFields();
                            setEquipmentNameModalOpen(false);
                        }}
                    />
                </Col>
            </Row>
        </Form>
    )
}

export default AddEditEquipmentName;