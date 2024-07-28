import React, { useContext, useEffect, useState } from 'react';
import { Col, DatePicker, Divider, Form, Row, message, Input, InputNumber } from 'antd';
import { useNavigate } from 'react-router-dom';
import { addDailyStatus, getAllEmployeeByBuilder, getAllEmployeeOfProject, getAllProjectsByBuilderAndStatusWithoutPaginate, getAllTasksByEmployee, getAllTasksByProjectId } from '../API/Api';
import { LeftOutlined } from '@ant-design/icons';
import { handleTaxInputForPercentage } from '../helper';
import dayjs from 'dayjs';
import { AuthContext } from '../context/AuthProvider';
import Selectable from '../components/Selectable';
import TextInput from '../components/TextInput';
import AppButton from '../components/AppButton';
import { useSelector } from 'react-redux';

const DailyStatus = () => {
    
    const { userId, currentRole, currUserData } = useContext(AuthContext)??{};
    const { currentUserRole } = useSelector((state) => state.userData) ?? {};
    const { TextArea } = Input;
    const navigate = useNavigate();
    const [addDailyStatusForm] = Form.useForm();
    const [projectNameList, setProjectNameList] = useState([]);
    const [projectTaskNameList, setProjectTaskNameList] = useState([]);
    const [allEmployeeByBuilder, setAllEmployeeByBuilder] = useState([]);


    const handleAddDailyStatusValues = async (form) => {
        const values = form.getFieldsValue();
        const { projectId, taskId, progress, description, problemFaced, reportedBy, reportedOn } = values;

        if (projectId && taskId && progress && description && problemFaced && reportedBy && reportedOn) {

            if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
                return;
            }

            let data = {
                projectId: projectId,
                taskId: taskId,
                progress: progress ? progress : '',
                description: description,
                problemFaced: problemFaced,
                reportedBy: reportedBy,
                reportedOn: reportedOn
            };

            try {
                const res = await addDailyStatus(data);
                if (res.data?.success) {
                    addDailyStatusForm.resetFields();
                    message.success('Daily Status Added Successfully');
                    return;
                } else {
                    message.error(res.data?.message);
                }

            } catch (error) {
                message.error(error.response.data.error);
            }
        } else {
            message.error('Please add required fields');
        }
    };

    useEffect(() => {
        // fetchProjectName();
        fetchProjects();
        fetchAllEmployeeByBuilder();

        // fetchProjectNameOfEmployee();
    }, []);


    const fetchProjects = async () => {
        if (currentUserRole === 'builder') {
            const payload = {
                builderId: userId,
                status: ['notStarted', 'onGoing']
            }
            const res = await getAllProjectsByBuilderAndStatusWithoutPaginate(payload);
            if (res?.data?.status === 200) {
                setProjectNameList(res?.data?.data);
            }
        }
        if (currentUserRole === 'employee' && userId) {
            const res = await getAllTasksByEmployee(userId, ['low', 'medium', 'high', 'critical']);
            if (res?.data?.status === 200) {
                setProjectNameList(res?.data?.data);
            }
        }
    };

    // const fetchProjectName = async () => {
    //     const payload = {
    //         builderId: userId,
    //         status: ['notStarted', 'onGoing']
    //     }
    //     const res = await getAllProjectsByBuilderAndStatusWithoutPaginate(payload);
    //     if (res?.data?.status === 200) {
    //         setProjectNameList(res?.data?.data);
    //     }
    // };

    const fetchProjectList = async (val) => {
        const res = await getAllTasksByProjectId(val);
        if (res?.data?.status === 200) {
            setProjectTaskNameList(res?.data?.data);
        }
    };

    const fetchAllEmployeeByBuilder = async () => {
        const payload = {
            builderId: userId,
            status: ['notStarted', 'onGoing']
        }
        const res = await getAllEmployeeByBuilder(payload);
        if (res?.data?.status === 200) {
            setAllEmployeeByBuilder(res?.data?.data);
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
                form={addDailyStatusForm}
                name="addUserForm"
                className="addUserForm"
                scrollToFirstError
            >
                <Row align='middle' justify='space-between'>
                    <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                        <h2 className='allPageHeader'>Daily Status</h2>
                    </Col>
                </Row>

                <Divider />

                <div>
                    <Row justify='space-between'>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <Selectable
                                label='Project Id'
                                name="projectId"
                                required={true}
                                requiredMsg='Project Id is required'
                                firstName={currentUserRole === 'builder' ? 'projectName' : 'project.projectName'}
                                data={projectNameList}
                                width={400}
                                showSearch={true}
                                handleSelectChange={(val) => {
                                    fetchProjectList(val);
                                }}
                            />
                        </Col>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <Selectable
                                label='Task Id'
                                name="taskId"
                                required={true}
                                requiredMsg='Task Id is required'
                                firstName='taskName'
                                data={projectTaskNameList}
                                width={400}
                                showSearch={true}
                                handleSelectChange={(val) => { }}
                            />
                        </Col>
                    </Row>
                    <Row justify='space-between'>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }} >
                            {/* <TextInput
                                name="progress"
                                className="createUserTextInput"
                                type='text'
                                required={true}
                                requiredMsg='Progress is required'
                                patternName='percentage'
                                patternMsg='valid percentage!'
                                maxMsg="cannot be longer than 40 characters"
                                typeMsg="Enter a valid Progress!"
                                label="Progress %"
                                onKeyPress={(event) => {
                                    handleTaxInputForPercentage(event, addDailyStatusForm, 'tax');
                                }}
                            /> */}
                            <Form.Item
                                name='progress'
                                // initialValue={defaultProject?.tax ?? 0}
                                label='Progress %'
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
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            {currentUserRole !== 'employee' && <Selectable
                                label='Reported By'
                                name="reportedBy"
                                required={true}
                                requiredMsg='Reported By is required'
                                firstName='name'
                                data={allEmployeeByBuilder}
                                width={400}
                                showSearch={true}
                                handleSelectChange={(val) => { }}
                            />}
                            {currentUserRole === 'employee' && <TextInput
                                name="reportedBy"
                                className="createUserTextInput"
                                defaultVal={currUserData?.name}
                                type='text'
                                disabled={true}
                                required={true}
                                requiredMsg='Reported By is required'
                                typeMsg="Enter a valid Reported By!"
                                label="Reported By"
                            />}
                        </Col>
                    </Row>
                    <Row justify='space-between'>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <Form.Item
                                name="description"
                                className="createUserTextInput"
                                type='text'
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
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <Form.Item
                                name="problemFaced"
                                className="createUserTextInput"
                                type='text'
                                required={true}
                                requiredMsg='Problem Faced is required'
                                max={40}
                                maxMsg="cannot be longer than 40 characters"
                                typeMsg="Enter a valid Project Name!"
                                label="Problem Faced"
                            >
                                <TextArea
                                    rows={3}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify='space-between'>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <Form.Item
                                name='reportedOn'
                                label='Reported On'
                                className="createUserTextInput"
                                initialValue={dayjs(new Date().toLocaleDateString('en-GB'), 'DD/MM/YYYY')}
                                rules={[{ required: true, message: 'Reported On is required' }]}
                            >
                                <DatePicker
                                    className='datePicker'
                                    placeholder=''
                                    format='DD/MM/YYYY'
                                    disabled
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>

                <div>
                    <Divider />
                    <Row justify="end" className="formBtnRow" >
                        <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 8 }} sm={{ span: 8 }} xs={{ span: 8 }} className="formBtnCol" >
                            <AppButton
                                onClick={() => {
                                    handleAddDailyStatusValues(addDailyStatusForm);
                                }}
                                className='appPrimaryButton formWidth'
                                label='Save'
                            />
                            <AppButton
                                label='Cancel'
                                className="appButton formWidth"
                                onClick={() => {
                                    addDailyStatusForm.resetFields();
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

export default DailyStatus;