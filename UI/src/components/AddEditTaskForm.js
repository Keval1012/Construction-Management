import React, { useContext, useEffect, useState } from 'react';
import { Col, DatePicker, Divider, Form, InputNumber, Radio, Row, Upload, message } from 'antd';
import TextInput from './TextInput';
import Button from './AppButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { LeftOutlined, UploadOutlined } from '@ant-design/icons';
import Selectable from './Selectable';
import { projectStatusesList, API_HOST } from '../constants';
import { AuthContext } from '../context/AuthProvider';
import { addTask, getAllEmployeeByBuilder, updateTask } from '../API/Api';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

const AddEditTaskForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId, currUserData } = useContext(AuthContext)??{};
    const { currentUserRole } = useSelector((state) => state.userData) ?? {};
    const { isEditTask, defaultTask, defaultProject } = location?.state??{};
    const [addTaskForm] = Form.useForm();
    const [imageFile, setImageFile] = useState(null);
    const [uploadFileList, setUploadFileList] = useState([]);
    const [imagesToDeleted, setImagesToDeleted] = useState([]);
    const [allEmployeeOfCurrBuilder, setAllEmployeeOfCurrBuilder] = useState([]);

    useEffect(() => {
        fetchAllEmployeeByBuilder();
    }, [JSON.stringify(userId)]);

    useEffect(() => {
        if (defaultTask && defaultTask?.attachment) {
          const imgsArr = defaultTask?.attachment;
          if (imgsArr) {
            let temp = [];
            imgsArr?.forEach((o, i) => {
              const tempName = o?.split('/')[o?.split('/')?.length - 1];
              const tempUrl = `${API_HOST}/${o}`;
              temp.push({ uid: i + 1, name: tempName, status: 'done', url: tempUrl });
            });
            setUploadFileList(temp);
            setImageFile(temp);
          }
        }
    }, [defaultTask]);

    const fetchAllEmployeeByBuilder = async () => {
        const res = await getAllEmployeeByBuilder({ builderId: userId });
        if (res?.data?.status === 200) setAllEmployeeOfCurrBuilder(res?.data?.data);
    };

    const uploadProps = {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
            authorization: 'authorization-text',
        },

        onRemove: async (info) => {
            if (info?.url) {
                let tempPath = (info.url).split('images')[1];
                setImagesToDeleted([...imagesToDeleted, tempPath]);
            }
        },

        onChange(info) {
            if (info.file.status !== 'uploading') {
                // console.log(info.file, info.fileList);
                info.file.status = 'done';
            }

            let newFileList = info.fileList;
            if (newFileList.length > 0 && uploadFileList.length < 4) {
                let temp = [];
                for (let i = 0; i < newFileList.length; i++) {
                    const el = newFileList[i];
                    if (el.originFileObj) {
                        temp.push(el.originFileObj);
                    } else {
                        temp.push(el);
                    }
                }
                setUploadFileList(temp);
                setImageFile(temp);
            } else {
                message.error('Maximum 3 Images.')
            }
        },
    };

    const handleAddTaskValues = async (form) => {
        const values = form.getFieldsValue();
        const { addTaskName, addTaskNumber, addTaskProjectId, addTaskDescription, addTaskStartDate, addTaskEndDate, addTaskAssignTo, addTaskStatus, addTaskPriority, addTaskCompletionPercent } = values;

        if (addTaskName && defaultProject?._id && addTaskDescription && addTaskStartDate && addTaskEndDate && addTaskAssignTo && addTaskStatus && addTaskPriority) {

            if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
                return;
            }

            let formData = new FormData();
            let data = {
                taskName: addTaskName,
                taskNumber: addTaskNumber ? addTaskNumber : '',
                projectId: defaultProject?._id,
                description: addTaskDescription,
                startDate: addTaskStartDate,
                endDate: addTaskEndDate,
                assignTo: addTaskAssignTo,
                status: addTaskStatus,
                priority: addTaskPriority,
                completionPercent: addTaskCompletionPercent ? addTaskCompletionPercent : '0'
            };

            if (imageFile && imageFile?.some(o => o instanceof File)) {
                for (let i = 0 ; i < imageFile.length ; i++) {
                    if (imageFile[i] instanceof File) {
                        formData.append('attachment', imageFile[i]);
                        data['attachment'] = imageFile[i];
                    } else {
                        formData.append('attachment', [JSON.stringify(imageFile[i])]);
                        data['attachment'] = [JSON.stringify(imageFile[i])];
                    }
                }
            }
            if (imageFile && !(imageFile?.some(o => o instanceof File))) {
                for (let i = 0 ; i < imageFile.length ; i++) {
                    formData.append('attachment', JSON.stringify(imageFile[i]));
                    data['attachment'] = [JSON.stringify(imageFile[i])];
                }
            }

            formData.append('taskName', addTaskName);
            formData.append('taskNumber', addTaskNumber ? addTaskNumber : '');
            formData.append('projectId', defaultProject?._id);
            formData.append('description', addTaskDescription);
            formData.append('startDate', addTaskStartDate);
            formData.append('endDate', addTaskEndDate);
            formData.append('assignTo', addTaskAssignTo);
            formData.append('status', addTaskStatus);
            formData.append('priority', addTaskPriority);
            formData.append('completionPercent', addTaskCompletionPercent ? addTaskCompletionPercent : '0');

            if (!isEditTask) {
                try {
                    const res = await addTask(formData);
                    if (res.data?.success) {
                        addTaskForm.resetFields();
                        setImageFile(null);
                        setUploadFileList([]);
                        message.success('Task Added Successfully');
                        return;
                    } else {
                        message.error(res.data?.message);
                    }

                } catch (error) {
                    message.error(error.response.data.error);
                }
            }

            if (isEditTask) {
                try {
                  const res = await updateTask(defaultTask?._id, formData);
                  if (res.data?.success) {
                    addTaskForm.resetFields();
                    setImageFile(null);
                    setUploadFileList([]);
                    navigate(-1);
                    message.success(defaultTask.taskName + ' Task Updated Successfully');
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
                    // onClick={onBackBtn}
                    onClick={() => navigate(-1)}
                >
                    <LeftOutlined /> Back
                </h3>
            </Row>

            <Form
                preserve={false}
                form={addTaskForm}
                name="addUserForm"
                className="addUserForm"
                scrollToFirstError
            >
                <Row align='middle' justify='space-between'>
                    <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                        <h2 className='allPageHeader'>{isEditTask ? 'Update' : 'Add'} Task</h2>
                    </Col>
                </Row>

                <Divider />

                <div>
                    <Row justify='space-between'>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <TextInput
                                name="addTaskName"
                                defaultVal={defaultTask?.taskName}
                                className="createUserTextInput"
                                type='text'
                                required={true}
                                requiredMsg='Task Name is required'
                                max={40}
                                maxMsg="cannot be longer than 40 characters"
                                typeMsg="Enter a valid Task Name!"
                                label="Task Name"
                            />
                        </Col>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <TextInput
                                name="addTaskNumber"
                                className="createUserTextInput"
                                defaultVal={defaultTask?.taskNumber}
                                type='text'
                                required={false}
                                requiredMsg='Task Number is required'
                                // max={3}
                                // maxMsg="cannot be longer than 40 characters"
                                typeMsg="Enter a valid Task Number!"
                                label="Task Number"
                            />
                        </Col>
                    </Row>
                    <Row justify='space-between'>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <TextInput
                                name="addTaskProjectId"
                                className="createUserTextInput"
                                defaultVal={defaultProject?.projectName}
                                type='text'
                                disabled={true}
                                required={true}
                                requiredMsg='Project is required'
                                // max={3}
                                // maxMsg="cannot be longer than 40 characters"
                                typeMsg="Enter a valid City!"
                                label="Project"
                            />
                            {/* <Selectable
                                label='Project Id'
                                name="addTaskProjectId"
                                required={true}
                                defaultVal={defaultTask?.projectId}
                                requiredMsg='Project Id is required'
                                firstName='projectName'
                                data={currProjectList}
                                width={400}
                                showSearch={true}
                                handleSelectChange={(val) => {}}
                            /> */}
                        </Col>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <TextInput
                                name="addTaskDescription"
                                className="createUserTextInput"
                                defaultVal={defaultTask?.description}
                                type='text'
                                required={true}
                                requiredMsg='Description is required'
                                // max={3}
                                // maxMsg="cannot be longer than 40 characters"
                                typeMsg="Enter a valid City!"
                                label="Description"
                            />
                        </Col>
                    </Row>
                    <Row justify='space-between'>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            {/* <TextInput
                                name="addTaskStartDate"
                                className="createUserTextInput"
                                defaultVal={defaultTask?.startDate}
                                type='date'
                                required={true}
                                requiredMsg='Start Date is required'
                                // max={3}
                                // maxMsg="cannot be longer than 40 characters"
                                typeMsg="Enter a valid Start Date!"
                                label="Start Date"
                            /> */}
                            <Form.Item
                                name='addTaskStartDate'
                                label='Start Date'
                                className="createUserTextInput"
                                initialValue={defaultTask ? dayjs(new Date(defaultTask?.startDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
                                rules={[ { required: true, message: 'Start Date is required' } ]}
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
                                name='addTaskEndDate'
                                label='End Date'
                                className="createUserTextInput"
                                initialValue={defaultTask ? dayjs(new Date(defaultTask?.endDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
                                rules={[ { required: true, message: 'End Date is required' } ]}
                            >
                                <DatePicker
                                    className='datePicker'
                                    placeholder=''
                                    format='DD/MM/YYYY'
                                />
                            </Form.Item>
                        </Col>    
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            {currentUserRole !== 'employee' && <Selectable
                                label='Assign To'
                                name="addTaskAssignTo"
                                required={true}
                                defaultVal={defaultTask?.assignTo}
                                requiredMsg='Assign To is required'
                                firstName='name'
                                data={allEmployeeOfCurrBuilder}
                                width={400}
                                showSearch={false}
                                handleSelectChange={(val) => {}}
                            />}
                            {currentUserRole === 'employee' && <TextInput
                                name="addTaskAssignTo"
                                className="createUserTextInput"
                                defaultVal={currUserData?.name}
                                type='text'
                                disabled={true}
                                required={true}
                                requiredMsg='Assign To is required'
                                typeMsg="Enter a valid Assign To!"
                                label="Assign To"
                            />}
                        </Col>                   
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <Selectable
                                label='Status'
                                name="addTaskStatus"
                                required={true}
                                defaultVal={defaultTask?.status}
                                requiredMsg='Status is required'
                                firstName='name'
                                data={projectStatusesList}
                                width={400}
                                showSearch={false}
                                handleSelectChange={(val) => {}}
                            />
                        </Col>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <Form.Item
                                name='addTaskPriority'
                                label='Priority'
                                initialValue={defaultTask?.priority}
                                rules={[{ required: true, message: 'Priority is Required' }]}
                                // initialValue={values?.priority}
                            >
                                <Radio.Group>
                                    <Radio value="critical">Critical</Radio>
                                    <Radio value="high">High</Radio>
                                    <Radio value="medium">Medium</Radio>
                                    <Radio value="low">Low</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>

                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            {/* <TextInput
                                name="addTaskCompletionPercent"
                                className="createUserTextInput"
                                type='text'
                                defaultVal={defaultTask?.completionPercent}
                                required={false}
                                requiredMsg='Completion Percent is required'
                                patternName='percentage'
                                patternMsg='valid percentage!'
                                onKeyPress={(event) => {
                                    handleTaxInputForPercentage(event, addTaskForm, 'addTaskCompletionPercent');
                                }}
                                // max={3}
                                // maxMsg="cannot be longer than 40 characters"
                                typeMsg="Enter a valid Completion Percent!"
                                label="Completion Percent"
                            /> */}
                            <Form.Item
                                name='addTaskCompletionPercent'
                                initialValue={defaultTask?.completionPercent ?? 0}
                                label='Completion Percent'
                                className='createUserTextInput'
                                required={false}
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

                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <Form.Item name='addTaskAttachment' label='Attachment' rules={[{ required: false, message: 'Attachment is Required' }]} >
                                <Upload
                                    listType="text"
                                    {...uploadProps}
                                    maxCount={3}
                                    multiple={true}
                                    fileList={uploadFileList}
                                >
                                    <Button className="imageFileBtn" icon={<UploadOutlined />} label='Upload' />
                                    {/* + */}
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </div>

                <div>
                    <Divider />
                    <Row justify="end" className="formBtnRow" >
                        <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 8 }} sm={{ span: 8 }} xs={{ span: 8 }} className="formBtnCol" >
                            <Button
                                onClick={() => {
                                    handleAddTaskValues(addTaskForm);
                                }}
                                className='appPrimaryButton formWidth'
                                label='Save'
                            />
                            <Button
                                label='Cancel'
                                className="appButton formWidth"
                                onClick={() => {
                                    addTaskForm.resetFields();
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

export default AddEditTaskForm;