import React from "react";
import { Col, Form, InputNumber, Row } from "antd";
import TextInput from "./TextInput";
import Button from "./AppButton";
import '../styles/addRoleForm.css';

const AddEditTaxForm = ({
    defaultTax,
    isEditTax,
    handleTaxFormValues,
    setTaxModalOpen,
}) => {

    const [taxAddForm] = Form.useForm();

    return (
        <Form
            preserve={false}
            form={taxAddForm}
            name="addTaxForm"
            className="addRoleForm"
            // onFinish={(values) => handleCategoryFormValues(values, imageFile, categoryAddForm)}
            scrollToFirstError
        >
            <Row>
                {(isEditTax) ?
                    <h2 className="modalHeader">Update Tax</h2>
                    :
                    <h2 className="modalHeader">Create New Tax</h2>
                }
            </Row>
            <Row>
                <Col xl={{ span: 23 }} lg={{ span: 23 }} md={{ span: 23 }} sm={{ span: 23 }}>
                    <TextInput
                        name="addTaxName"
                        defaultVal={defaultTax?.name}
                        className="createUserTextInput"
                        type='text'
                        required={true}
                        requiredMsg='Name is required'
                        max={40}
                        maxMsg="cannot be longer than 40 characters"
                        typeMsg="Enter a valid name!"
                        label="Name"
                    />
                </Col>
            </Row>
            <Row>
                <Col xl={{ span: 23 }} lg={{ span: 23 }} md={{ span: 23 }} sm={{ span: 23 }}>
                    <Form.Item
                        name='addTaxPercent'
                        initialValue={defaultTax?.taxPercent ?? 0}
                        label='Tax Percentage (%)'
                        className='createUserTextInput'
                        required={true}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            controls={false}
                            min={0}
                            max={100}
                            formatter={(value) => `${value}%`}
                            parser={(value) => value.replace('%', '')}
                            onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row justify="end" className="formBtnRow" >
                <Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }} xs={{ span: 12 }} className="formBtnCol" >
                    <Button
                        // htmlType='submit'
                        onClick={() => {
                            handleTaxFormValues(taxAddForm);
                        }}
                        className='appPrimaryButton formWidth'
                        label='Save'
                    />
                    <Button
                        label='Cancel'
                        className="appButton formWidth"
                        onClick={() => {
                            taxAddForm.resetFields();
                            setTaxModalOpen(false);
                        }}
                    />
                </Col>
            </Row>
        </Form>
    );
};

export default AddEditTaxForm;