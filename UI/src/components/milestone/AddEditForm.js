import React, { useEffect } from "react";
import { Col, DatePicker, Form, InputNumber, Radio, Row } from "antd";
import Button from "../AppButton";
import TextInput from "../TextInput";
import Selectable from '../Selectable';
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { projectStatusesList } from "../../constants";

const AddEditMilestone = ({
    defaultMilestone,
    isEditMilestone,
    tasks,
    handleMilestoneFormValues,
    setMilestoneModalOpen,
}) => {
  
  const [milestoneAddForm] = Form.useForm();

  // useEffect(() => {

  // }, [JSON.stringify(tasks)]);

  return (
    <Form
      preserve={false}
      form={milestoneAddForm}
      name="addRoleForm"
      className="addRoleForm"
      scrollToFirstError
    >
      <Row>
        {(isEditMilestone) ? 
            <h2 className="modalHeader">Update Milestone</h2> 
          :
            <h2 className="modalHeader">Add Milestone</h2>
        }
      </Row>
      <Row justify='space-between'>
        <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
          <TextInput
            name="milestoneName"
            defaultVal={defaultMilestone?.milestoneName}
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
          <TextInput
            name="milestoneNumber"
            defaultVal={defaultMilestone?.milestoneNumber}
            className="createUserTextInput"
            type='text'
            max={40}
            maxMsg="cannot be longer than 40 characters"
            typeMsg="Enter a valid Milestone Number!"
            label="Milestone Number"
          />
        </Col>
      </Row>
      <Row justify='space-between'>
        <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
            <Form.Item
              name="milestoneDescription"
              className="createUserTextInput"
              type='text'
              initialValue={defaultMilestone?.description}
              required={true}
              requiredMsg='Description is required'
              max={40}
              maxMsg="cannot be longer than 40 characters"
              typeMsg="Enter a valid description!"
              label="Description"
            >
              <TextArea
                rows={3}
              />
          </Form.Item>
        </Col>
        <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
            <Selectable
                label='Status'
                name="milestoneStatus"
                required={true}
                defaultVal={defaultMilestone?.status}
                requiredMsg='Status is required'
                firstName='name'
                data={projectStatusesList}
                width={400}
                showSearch={false}
                handleSelectChange={(val) => { }}
            />
        </Col>
      </Row>
      <Row justify='space-between'>
        <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
            <Form.Item
                name='milestoneStartDate'
                label='Start Date'
                className="createUserTextInput"
                initialValue={defaultMilestone ? dayjs(new Date(defaultMilestone?.startDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
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
                name='milestoneEndDate'
                label='End Date'
                className="createUserTextInput"
                initialValue={defaultMilestone ? dayjs(new Date(defaultMilestone?.endDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
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
            <Form.Item
                name='milestonePriority'
                label='Priority'
                initialValue={defaultMilestone ? defaultMilestone?.priority : 'low'}
                rules={[{ required: true, message: 'Priority is Required' }]}
                // initialValue={values?.priority}
            >
                <Radio.Group>
                    <Radio value="high">High</Radio>
                    <Radio value="medium">Medium</Radio>
                    <Radio value="low">Low</Radio>
                </Radio.Group>
            </Form.Item>                 
        </Col>
        <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
          <Form.Item
            name='milestoneProgress'
            initialValue={defaultMilestone?.progress ?? 0}
            label='Progress'
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
      <Row justify='space-between'>
        <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
            <Selectable
                label='Dependencies'
                name="milestoneDependencies"
                required={false}
                defaultVal={defaultMilestone?.dependencies}
                requiredMsg='Dependencies is required'
                firstName='milestoneName'
                data={(tasks?.length > 0) ? tasks : []}
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
                handleMilestoneFormValues(milestoneAddForm);
            }}
            className='appPrimaryButton formWidth'
            label='Save'
          />
          <Button 
            label='Cancel'
            className="appButton formWidth"
            onClick={() => {
                milestoneAddForm.resetFields();
                setMilestoneModalOpen(false);
              }}
            />
        </Col>
      </Row>
    </Form>
  );
};

export default AddEditMilestone;