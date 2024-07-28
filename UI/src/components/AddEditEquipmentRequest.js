import React, { useContext, useEffect, useState } from 'react';
import { Col, DatePicker, Divider, Form, Input, Radio, Row, Tag, Typography, Upload, message } from 'antd';
import TextInput from './TextInput';
import Button from './AppButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { addEquipmentRequest, getAllTasksByProjectId, getAvailableDetailsOfEqptById, updateEquipmentRequest } from '../API/Api';
import { LeftOutlined } from '@ant-design/icons';
import Selectable from './Selectable';
import { AuthContext } from '../context/AuthProvider';
import { equipmentRequestStatusList } from '../constants';
import dayjs from 'dayjs';

const AddEditEquipmentRequest = () => {

  const { userId, currentRole, currUserData } = useContext(AuthContext) ?? {};
  const { Text } = Typography;
  const navigate = useNavigate();
  const location = useLocation();
  const { allEqptList, defaultEqptReq, isEditEqptReq, defaultProject } = location?.state ?? {};
  const [addEquipmentRequestForm] = Form.useForm();
  const [selectedFromDate, setSelectedFromDate] = useState(dayjs(new Date()).format('DD/MM/YYYY'));
  const [taskList, setTaskList] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  
  useEffect(() => {
    fetchTaskList();
  }, [JSON.stringify(defaultProject)]);

  useEffect(() => {
  }, [JSON.stringify(currentRole), JSON.stringify(userId)]);

  const fetchTaskList = async () => {
    if (defaultProject) {
      const res = await getAllTasksByProjectId(defaultProject?._id);
      if (res?.data?.success) {
        setTaskList(res?.data?.data);
      }
    }
  };

  const handleAddEquipmentValues = async (form) => {
    const values = form.getFieldsValue();
    const { addEqptReqTaskId, addEqptReqEqptId, addEqptReqQuantity, addEqptReqRequester, addEqptReqFromDate, addEqptReqToDate, addEqptReqLocation, addEqptReqStatus } = values;

    if (Number(selectedEquipment?.equipment?.totalQuantity) < Number(addEqptReqQuantity)) return message.error('Requested qty. is more than available qty. !');

    if (addEqptReqTaskId && addEqptReqEqptId && addEqptReqQuantity && addEqptReqFromDate && addEqptReqToDate && addEqptReqLocation && addEqptReqStatus) {

      if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
        return;
      }

      let data = {
        projectId: defaultProject?._id,
        taskId: addEqptReqTaskId,
        equipmentId: addEqptReqEqptId,
        quantity: addEqptReqQuantity,
        requester: userId,
        fromDate: addEqptReqFromDate,
        toDate: addEqptReqToDate,
        location: addEqptReqLocation ? addEqptReqLocation : '',
        status: addEqptReqStatus
      };

      if (!isEditEqptReq) {
        try {
          const res = await addEquipmentRequest(data);
          if (res.data?.success) {
            addEquipmentRequestForm.resetFields();
            message.success('Request Added Successfully');
            return;
          } else {
            message.error(res.data?.message);
          }

        } catch (error) {
          message.error(error.response.data.error);
        }
      }

      if (isEditEqptReq) {
        try {
          const res = await updateEquipmentRequest(defaultEqptReq?._id, data);
          if (res.data?.success) {
            addEquipmentRequestForm.resetFields();
            navigate(-1);
            message.success(defaultEqptReq.name + ' Request Updated Successfully');
          } else message.error(res.data?.message);
        } catch (error) {
          message.error('Something went wrong' + error);
        }
      }
    } else {
      message.error('Please add required fields');
    }
  };

  const handleEquipmentChange = async (val) => {
    if (val) {
      const res = await getAvailableDetailsOfEqptById(val);
      if (res?.data?.success) setSelectedEquipment(res?.data?.data[0]);
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
        form={addEquipmentRequestForm}
        name="addUserForm"
        className="addUserForm"
        scrollToFirstError
      >
        <Row align='middle' justify='space-between'>
          <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
            <h2 className='allPageHeader'>{isEditEqptReq ? 'Edit Equipment Request' : 'Add Equipment Request'}</h2>
          </Col>
        </Row>

        <Divider />

        <div>
          <Row justify='space-between'>
            <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
              <TextInput
                name="addEqptReqProjectId"
                defaultVal={defaultProject?.projectName}
                className="createUserTextInput"
                type='text'
                disabled={true}
                required={true}
                requiredMsg='Project is required'
                max={40}
                maxMsg="cannot be longer than 40 characters"
                typeMsg="Enter a valid project name!"
                label="Project"
              />
            </Col>
            <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
              <Selectable
                label='Task'
                name="addEqptReqTaskId"
                defaultVal={defaultProject?.taskName}
                required={true}
                requiredMsg='Task is required'
                firstName='taskName'
                data={taskList}
                width={400}
                showSearch={false}
                handleSelectChange={(val) => { }}
              />
            </Col>
          </Row>
          <Row justify='space-between'>
            <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
              <Selectable
                label='Equipment'
                name="addEqptReqEqptId"
                defaultVal={defaultEqptReq?.equipmentId}
                required={true}
                requiredMsg='Equipment is required'
                firstName='eqptNameDetails.name'
                data={allEqptList}
                width={400}
                showSearch={false}
                handleSelectChange={handleEquipmentChange}
              />
            </Col>
            {selectedEquipment &&
              <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                {/* <h3>Available Equipment: {Number(selectedEquipment?.equipment?.totalQuantity) - Number(selectedEquipment?.inUseCount)}</h3> */}
                {/* <Text type="success" >Available Equipment: {Number(selectedEquipment?.equipment?.totalQuantity) - Number(selectedEquipment?.inUseCount)}</Text> */}
                <Tag color="processing" className='countTag' bordered={false} >Available Equipment: {Number(selectedEquipment?.equipment?.totalQuantity) - Number(selectedEquipment?.inUseCount)}</Tag>
              </Col>
            }
          {/* </Row>
          <Row justify='space-between'> */}
            <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
              <TextInput
                name="addEqptReqRequester"
                className="createUserTextInput"
                defaultVal={currUserData?.name}
                type='text'
                disabled={true}
                required={true}
                requiredMsg='Requester is required'
                typeMsg="Enter a valid requester!"
                label="Requester"
              />
            </Col>
            <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
              <TextInput
                name="addEqptReqQuantity"
                className="createUserTextInput"
                defaultVal={defaultEqptReq?.quantity}
                type='text'
                required={true}
                requiredMsg='quantity is required'
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                typeMsg="Enter a valid qty.!"
                label="Quantity"
              />
            </Col>
            <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
              <Form.Item
                name='addEqptReqFromDate'
                label='From Date'
                className="createUserTextInput"
                initialValue={defaultEqptReq ? dayjs(new Date(defaultEqptReq?.fromDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
                rules={[{ required: true, message: 'From Date is required' }]}
              >
                <DatePicker
                  className='datePicker'
                  disabledDate={current => {
                    return current && current < dayjs().subtract(1, "day");
                  }}
                  onChange={(e, val) => setSelectedFromDate(val)}
                  placeholder=''
                  format='DD/MM/YYYY'
                />
              </Form.Item>
            </Col>
            <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
              <Form.Item
                name='addEqptReqToDate'
                label='To Date'
                className="createUserTextInput"
                initialValue={defaultEqptReq ? dayjs(new Date(defaultEqptReq?.toDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
                rules={[{ required: true, message: 'To Date is required' }]}
              >
                <DatePicker
                  className='datePicker'
                  disabledDate={(curr) => curr.isBefore(dayjs(new Date(defaultEqptReq ? defaultEqptReq?.fromDate : selectedFromDate)).format('DD/MM/YYYY'))}
                  placeholder=''
                  format='DD/MM/YYYY'
                />
              </Form.Item>
            </Col>
            <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
              <TextInput
                name="addEqptReqLocation"
                className="createUserTextInput"
                defaultVal={defaultEqptReq?.location}
                type='text'
                required={true}
                requiredMsg='Location is required'
                typeMsg="Enter a valid location!"
                label="Location"
              />
            </Col>
            <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
              <Selectable
                label='Status'
                name="addEqptReqStatus"
                required={true}
                defaultVal={!isEditEqptReq ? 'pending' : defaultEqptReq?.status}
                disabled={!isEditEqptReq ? true : false}
                requiredMsg='Status is required'
                firstName='name'
                data={equipmentRequestStatusList}
                width={400}
                showSearch={false}
                handleSelectChange={(val) => { }}
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
                  handleAddEquipmentValues(addEquipmentRequestForm);
                }}
                className='appPrimaryButton formWidth'
                label='Save'
              />
              <Button
                label='Cancel'
                className="appButton formWidth"
                onClick={() => {
                  addEquipmentRequestForm.resetFields();
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

export default AddEditEquipmentRequest;