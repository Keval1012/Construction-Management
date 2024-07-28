import React from "react";
import { Col, Form, Row } from "antd";
import TextInput from "./TextInput";
import Button from "./AppButton";
import '../styles/addRoleForm.css';
// import { handlePressEnter } from "../helpers/helper";


const AddEditRoleForm = ({
  defaultRole,
  isEditRole,
  handleRoleFormValues,
  setRoleModalOpen,
}) => {
  
  const [roleAddForm] = Form.useForm();

  // const handleFormKeyDown = async (e) => {
  //   const check = await handlePressEnter(e, roleAddForm);
  //   if (check) handleRoleFormValues(roleAddForm);
  // };

  return (
    <Form
      preserve={false}
      form={roleAddForm}
      name="addRoleForm"
      className="addRoleForm"
      // onKeyDown={handleFormKeyDown}
      // onFinish={(values) => handleCategoryFormValues(values, imageFile, categoryAddForm)}
      scrollToFirstError
    >
      <Row>
        {(isEditRole) ? 
            <h2 className="modalHeader">Update Role</h2> 
          :
            <h2 className="modalHeader">Create New Role</h2>
        }
      </Row>
      <Row>
        <Col xl={{ span: 23 }} lg={{ span: 23 }} md={{ span: 23 }} sm={{ span: 23 }}>
          <TextInput
            name="addRoleName"
            defaultVal={defaultRole?.name}
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
          <TextInput
              name="addRoleDisplayName"
              defaultVal={defaultRole?.displayName}
              className="createUserTextInput"
              type='text'
              required={true}
              requiredMsg='Display name is required'
              max={40}
              maxMsg="cannot be longer than 40 characters"
              typeMsg="Enter a valid Display name!"
              label="Display Name"
            />
        </Col>
      </Row>
      <Row justify="end" className="formBtnRow" >
        <Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }} xs={{ span: 12 }} className="formBtnCol" >
          <Button
            // htmlType='submit'
            onClick={() => {
              handleRoleFormValues(roleAddForm);
            }}
            className='appPrimaryButton formWidth'
            label='Save' 
          />
          <Button 
            label='Cancel'
            className="appButton formWidth"
            onClick={() => {
                roleAddForm.resetFields();
                setRoleModalOpen(false);
              }}
            />
        </Col>
      </Row>
    </Form>
  );
};

export default AddEditRoleForm;