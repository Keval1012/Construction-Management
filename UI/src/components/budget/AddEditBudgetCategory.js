import { Col, Form, Row } from 'antd';
import React from 'react'
import TextInput from '../TextInput';
import AppButton from '../AppButton';

const AddEditBudgetCategory = ({
    defaultBudgetCategory,
    isEditBudgetCategory,
    setBudgetCategoryModalOpen,
    handleBudgetCategoryFormValues
}) => {

    const [budgetCategoryAddForm] = Form.useForm();

    return (
        <div>
            <Form
              preserve={false}
              form={budgetCategoryAddForm}
              name="addRoleForm"
              className="addRoleForm"
              scrollToFirstError
            >
                <Row>
                    {(isEditBudgetCategory) ? 
                        <h2 className="modalHeader">Update Budget Category</h2> 
                    :
                        <h2 className="modalHeader">Add Budget Category</h2>
                    }
                </Row>
                <Row justify='space-between'>
                    <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                        <TextInput
                            name="budgetName"
                            defaultVal={defaultBudgetCategory?.name}
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
                        <TextInput
                            name="displayName"
                            defaultVal={defaultBudgetCategory?.displayName}
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
                
                <Row justify="end" className="formBtnRow" >
                    <Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }} xs={{ span: 12 }} className="formBtnCol">
                    <AppButton
                        onClick={() => {
                            handleBudgetCategoryFormValues(budgetCategoryAddForm);
                        }}
                        className='appPrimaryButton formWidth'
                        label='Save'
                    />
                    <AppButton
                        label='Cancel'
                        className="appButton formWidth"
                        onClick={() => {
                            budgetCategoryAddForm.resetFields();
                            setBudgetCategoryModalOpen(false);
                        }}
                        />
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default AddEditBudgetCategory;