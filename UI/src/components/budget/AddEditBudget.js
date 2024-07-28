import React from "react";
import { Col, DatePicker, Form, Row } from "antd";
import Button from "../AppButton";
import TextInput from "../TextInput";
import Selectable from '../Selectable';
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { budgetStatusList } from "../../constants";

const AddEditBudget = ({
    defaultBudget,
    isEditBudget,
    handleBudgetFormValues,
    setBudgetModalOpen,
    budgetCategoryList
}) => {
  
  const [budgetAddForm] = Form.useForm();

  return (
    <Form
      preserve={false}
      form={budgetAddForm}
      name="addRoleForm"
      className="addRoleForm"
      scrollToFirstError
    >
      <Row>
        {(isEditBudget) ? 
            <h2 className="modalHeader">Update Budget</h2> 
          :
            <h2 className="modalHeader">Add Budget</h2>
        }
      </Row>
      <Row justify='space-between'>
        <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
          <TextInput
            name="budgetName"
            defaultVal={defaultBudget?.budgetName}
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
        <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
            <Selectable
                label='Category'
                name="budgetCategory"
                required={true}
                defaultVal={defaultBudget?.category}
                requiredMsg='Category is required'
                firstName='name'
                data={budgetCategoryList}
                width={400}
                showSearch={false}
                handleSelectChange={(val) => { }}
            />
        </Col>
      </Row>
      <Row justify='space-between'>
        <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
            <Form.Item
              name="budgetDescription"
              className="createUserTextInput"
              type='text'
              initialValue={defaultBudget?.description}
              required={true}
              requiredMsg='Description is required'
              max={40}
              maxMsg="cannot be longer than 40 characters"
              typeMsg="Enter a valid Project Name!"
              label="Description"
            >
              <TextArea
                rows={3}
              />
          </Form.Item>
        </Col>
        <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
            <TextInput
                style={{ width: '100%' }}
                name="totalAmount"
                className="createUserTextInput"
                type='number'
                defaultVal={defaultBudget?.totalAmount}
                required={false}
                requiredMsg='Total Amount is required'
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                typeMsg="Enter a valid Total Amount!"
                label="Total Amount"
                formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\₹\s?|(,*)/g, '')}
            />
        </Col>
      </Row>
      <Row justify='space-between'>
        <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
            <Form.Item
                name='budgetStartDate'
                label='Start Date'
                className="createUserTextInput"
                initialValue={defaultBudget ? dayjs(new Date(defaultBudget?.startDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
                rules={[{ required: true, message: 'Start Date is required' }]} 
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
                name='budgetEndDate'
                label='End Date'
                className="createUserTextInput"
                initialValue={defaultBudget ? dayjs(new Date(defaultBudget?.endDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
                rules={[{ required: true, message: 'End Date is required' }]} 
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
        <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
            <Selectable
                label='Status'
                name="budgetStatus"
                required={true}
                defaultVal={defaultBudget?.status}
                requiredMsg='Status is required'
                firstName='name'
                data={budgetStatusList}
                width={400}
                showSearch={false}
                handleSelectChange={(val) => { }}
            />
        </Col>
      </Row>
      
      <Row justify="end" className="formBtnRow" >
        <Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }} xs={{ span: 12 }} className="formBtnCol" >
          <Button
            onClick={() => {
                handleBudgetFormValues(budgetAddForm);
            }}
            className='appPrimaryButton formWidth'
            label='Save'
          />
          <Button 
            label='Cancel'
            className="appButton formWidth"
            onClick={() => {
                budgetAddForm.resetFields();
                setBudgetModalOpen(false);
              }}
            />
        </Col>
      </Row>
    </Form>
  );
};

export default AddEditBudget;