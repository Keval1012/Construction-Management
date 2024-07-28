import React from "react";
import { Col, DatePicker, Form, Row } from "antd";
import TextInput from "../TextInput";
import Button from "../AppButton";
import dayjs from "dayjs";
import { severityIndicatorList } from "../../constants";
import Selectable from "../Selectable";

const IssueAddEditModal = ({
  defaultIssue,
  isEditIssue,
  handleIssueFormValues,
  setIssueModalOpen,
}) => {
  
  const [issueAddForm] = Form.useForm();

  return (
    <Form
      preserve={false}
      form={issueAddForm}
      name="addRoleForm"
      className="addRoleForm"
      scrollToFirstError
    >
      <Row>
        {(isEditIssue) ? 
            <h2 className="modalHeader">Update Issue</h2> 
          :
            <h2 className="modalHeader">Create New Issue</h2>
        }
      </Row>
      <Row>
        <Col xl={{ span: 23 }} lg={{ span: 23 }} md={{ span: 23 }} sm={{ span: 23 }}>
          <TextInput
            name="addIssueTitle"
            defaultVal={defaultIssue?.inspectionTitle}
            className="createUserTextInput"
            type='text'
            required={true}
            requiredMsg='Issue is required'
            max={40}
            maxMsg="cannot be longer than 40 characters"
            typeMsg="Enter a valid issue!"
            label="Issue Title"
          />
        </Col>
      </Row>
      <Row>
        <Col xl={{ span: 23 }} lg={{ span: 23 }} md={{ span: 23 }} sm={{ span: 23 }}>
          <TextInput
            name="addIssueLocation"
            defaultVal={defaultIssue?.location}
            className="createUserTextInput"
            type='text'
            required={true}
            requiredMsg='Location is required'
            max={40}
            maxMsg="cannot be longer than 40 characters"
            typeMsg="Enter a valid location!"
            label="Location"
          />
        </Col>
      </Row>
      <Row>
        <Col xl={{ span: 23 }} lg={{ span: 23 }} md={{ span: 23 }} sm={{ span: 23 }}>
          <TextInput
              name="addIssueDesc"
              defaultVal={defaultIssue?.description}
              className="createUserTextInput"
              type='text'
              required={true}
              requiredMsg='Description is required'
              max={40}
              maxMsg="cannot be longer than 40 characters"
              typeMsg="Enter a valid Description!"
              label="Description"
            />
        </Col>
      </Row>
      <Row>
        <Col xl={{ span: 23 }} lg={{ span: 23 }} md={{ span: 23 }} sm={{ span: 23 }} xs={{ span: 23 }}>
            <Selectable
                label='Severity Indicator'
                name="addIssueSeverity"
                required={true}
                defaultVal={defaultIssue?.severity}
                requiredMsg='Severity is required'
                firstName='name'
                data={severityIndicatorList}
                width={400}
                showSearch={false}
                handleSelectChange={(val) => { }}
            />
        </Col>
      </Row>
      <Row>
        <Col xl={{ span: 23 }} lg={{ span: 23 }} md={{ span: 23 }} sm={{ span: 23 }} xs={{ span: 23 }}>
            <Selectable
                label='Status'
                name="addIssueStatus"
                required={true}
                disabled={true}
                // defaultVal={defaultIssue?.status}
                defaultVal={'pending'}
                requiredMsg='Status is required'
                firstName='name'
                data={[{ id: 1, name: 'Pending', _id: 'pending' }, { id: 2, name: 'Done', _id: 'done' }]}
                width={400}
                showSearch={false}
                handleSelectChange={(val) => { }}
            />
        </Col>
      </Row>
      <Row>
        <Col xl={{ span: 23 }} lg={{ span: 23 }} md={{ span: 23 }} sm={{ span: 23 }} xs={{ span: 23 }}>
            <Form.Item
                name='addIssueDeadline'
                label='Deadline'
                className="createUserTextInput"
                initialValue={defaultIssue ? dayjs(new Date(defaultIssue?.issueDeadline).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
                rules={[{ required: true, message: 'Issue Deadline is required' }]} 
            >
                <DatePicker
                    className='datePicker'
                    placeholder=''
                    format='DD/MM/YYYY'
                />
            </Form.Item>
        </Col>
      </Row>
      <Row justify="end" className="formBtnRow" >
        <Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }} xs={{ span: 12 }} className="formBtnCol" >
          <Button
            onClick={() => {
              handleIssueFormValues(issueAddForm);
            }}
            className='appPrimaryButton formWidth'
            label='Save'
          />
          <Button 
            label='Cancel'
            className="appButton formWidth"
            onClick={() => {
                issueAddForm.resetFields();
                setIssueModalOpen(false);
              }}
            />
        </Col>
      </Row>
    </Form>
  );
};

export default IssueAddEditModal;