import React, { useContext, useEffect, useState } from 'react';
import { Col, DatePicker, Divider, Form, Modal, Radio, InputNumber, Row, Upload, message } from 'antd';
import TextInput from './TextInput';
import Button from './AppButton';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { addProject, deleteProjectDocument, updateProject, updateProjectDocuments } from '../API/Api';
import AppButton from './AppButton';
import { LeftOutlined, UploadOutlined } from '@ant-design/icons';
import Selectable from './Selectable';
import { AuthContext } from '../context/AuthProvider';
import { constructionTypeList, projectStatusesList, API_HOST } from '../constants';
import { handleTaxInputForPercentage, renderMoneyFormat } from '../helper';
import dayjs from 'dayjs';

const AddEditProjectForm = () => {

    const { userId, currentRole } = useContext(AuthContext)??{};
    const navigate = useNavigate();
    const location = useLocation();
    const { isEditProject, defaultProject } = location?.state??{};
    const [addProjectForm] = Form.useForm();
    const [imageFile, setImageFile] = useState(null);
    const [uploadFileList, setUploadFileList] = useState([]);
    const [imagesToDeleted, setImagesToDeleted] = useState([]);

    const showDeleteConfirm = (record) => {
        Modal.confirm({
          title: `Attachment name: ${record.name} `,
          content: 'Are you sure you want to remove this attachment?',
          okText: 'Remove',
          okType: 'danger',
          onOk: async () => {
            try {
              const res = await deleteProjectDocument(record._id);
              if (res.data?.success) {
                message.success(record.name + ' Attachment Removed');
              } else {
                message.error(res.data?.message);
              }
            } catch (error) {
              message.error('Something went wrong' + error);
            }
          },
          onCancel() { },
        });
    };

    useEffect(() => {
        // if (defaultProject && defaultProject?.attachment) {
        if (defaultProject && defaultProject?.attachmentList) {
            const imgsArr = defaultProject?.attachmentList;
            if (imgsArr) {
                let temp = [];
                imgsArr?.forEach((o, i) => {
                    const tempName = o?.attachment?.split('/')[o?.attachment?.split('/').length - 1];
                    const tempUrl = `${API_HOST}/${o?.attachment}`;
                    temp.push({ uid: i + 1, name: tempName, projectId: o?.projectId, _id: o?._id, status: 'done', url: tempUrl });
                });
                setUploadFileList(temp);
                setImageFile(temp);
            }
        }
    }, [defaultProject]);

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
                showDeleteConfirm(info);
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
                message.error('Maximum 3 Images.');
            }
        },
    };

    const handleAddProjectValues = async (form) => {
        const values = form.getFieldsValue();
        const { projectName, projectNumber, address, city, constructionType, startDate, completionDate, completionPercentage, clientName, clientNumber, status, priority, estimatedBudget, tax, projectValue, receivedAmount } = values;

        if (projectName && address && city && constructionType && startDate && completionDate && clientName && clientNumber && status && priority) {

            if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
                return;
            }

            let formData = new FormData();

            formData.append('projectName', projectName);
            formData.append('projectNumber', projectNumber ? projectNumber : '');
            formData.append('address', address);
            formData.append('city', city);
            formData.append('builderId', userId);
            formData.append('constructionType', constructionType);
            formData.append('startDate', startDate);
            formData.append('completionDate', completionDate);
            formData.append('clientName', clientName);
            formData.append('clientNumber', clientNumber);
            formData.append('status', status);
            formData.append('completionPercentage', completionPercentage ? completionPercentage : '0');
            formData.append('estimatedBudget', estimatedBudget ? estimatedBudget : 0);
            formData.append('tax', tax ? tax : 0);
            formData.append('receivedAmount', receivedAmount ? receivedAmount : 0);
            formData.append('projectValue', projectValue ? projectValue : 0);
            formData.append('priority', priority);

            let data = {
                projectName: projectName,
                projectNumber: projectNumber ? projectNumber : '',
                address: address,
                city: city,
                builderId: userId,
                constructionType: constructionType,
                startDate: startDate,
                completionDate: completionDate,
                completionPercentage: completionPercentage ? completionPercentage : '0',
                clientName: clientName,
                clientNumber: clientNumber,
                status: status,
                // attachment: (uploadFileList?.length > 0) ? uploadFileList : [],
                estimatedBudget: estimatedBudget ? estimatedBudget : 0,
                tax: tax ? tax : 0,
                receivedAmount: receivedAmount ? receivedAmount : 0,
                projectValue: projectValue ? projectValue : 0,
                priority: priority,
            };

            if (!isEditProject && currentRole === 'builder') {
                try {
                    const res = await addProject(data);
                    if (res.data?.success) {
                        formData.append('projectId', res?.data?.id);
                        if (imageFile && imageFile?.some(o => o instanceof File)) {
                            for (let i = 0; i < imageFile.length; i++) {
                                if (imageFile[i] instanceof File) {
                                    formData.append('attachment', imageFile[i]);
                                } else {
                                    formData.append('attachment', [JSON.stringify(imageFile[i])]);
                                }
                            }
                        }
                        // if (imageFile && !(imageFile?.some(o => o instanceof File))) {
                        //     for (let i = 0; i < imageFile.length; i++) {
                        //         formData.append('attachment', JSON.stringify(imageFile[i]));
                        //     }
                        // }
                        const addDoc = await updateProjectDocuments(formData);
                        if (addDoc?.data?.success) {
                        }
                        addProjectForm.resetFields();
                        setImageFile(null);
                        setUploadFileList([]);
                        message.success('Project Added Successfully');
                        return;
                    } else {
                        message.error(res.data?.message);
                    }

                } catch (error) {
                    message.error(error.response.data.error);
                }
            }

            if (isEditProject && currentRole === 'builder') {
                try {
                    const res = await updateProject(defaultProject?._id, formData);
                    if (res.data?.success) {
                        formData.append('projectId', res?.data?.id);
                        if (imageFile && imageFile?.some(o => o instanceof File)) {
                            for (let i = 0; i < imageFile.length; i++) {
                                if (imageFile[i] instanceof File) {
                                    formData.append('attachment', imageFile[i]);
                                }
                                // else {
                                //     formData.append('attachment', [JSON.stringify(imageFile[i])]);
                                // }
                            }
                        }
                        // if (imageFile && !(imageFile?.some(o => o instanceof File))) {
                        //     for (let i = 0; i < imageFile.length; i++) {
                        //         formData.append('attachment', JSON.stringify(imageFile[i]));
                        //     }
                        // }
                        const addDoc = await updateProjectDocuments(formData);
                        addProjectForm.resetFields();
                        setImageFile(null);
                        setUploadFileList([]);
                        navigate(-1);
                        message.success(defaultProject.projectName + ' Project Updated Successfully');
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
                form={addProjectForm}
                name="addUserForm"
                className="addUserForm"
                scrollToFirstError
            >
                <Row align='middle' justify='space-between'>
                    <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                        <h2 className='allPageHeader'>{isEditProject ? 'Edit Project' : 'Add New Project'}</h2>
                    </Col>
                </Row>

                <Divider />

                <div>
                    <Row justify='space-between'>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <TextInput
                                name="projectName"
                                defaultVal={defaultProject?.projectName}
                                className="createUserTextInput"
                                type='text'
                                required={true}
                                requiredMsg='Project Name is required'
                                max={40}
                                maxMsg="cannot be longer than 40 characters"
                                typeMsg="Enter a valid Project Name!"
                                label="Project Name"
                            />
                        </Col>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <TextInput
                                name="projectNumber"
                                className="createUserTextInput"
                                defaultVal={defaultProject?.projectNumber}
                                type='text'
                                required={false}
                                requiredMsg='Project Number is required'
                                // max={3}
                                // maxMsg="cannot be longer than 40 characters"
                                typeMsg="Enter a valid Project Number!"
                                label="Project Number"
                            />
                        </Col>
                    </Row>
                    <Row justify='space-between'>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <TextInput
                                name="address"
                                className="createUserTextInput"
                                defaultVal={defaultProject?.address}
                                type='text'
                                required={true}
                                requiredMsg='Address is required'
                                // max={3}
                                // maxMsg="cannot be longer than 40 characters"
                                typeMsg="Enter a valid Address!"
                                label="Address"
                            />
                        </Col>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <TextInput
                                name="city"
                                className="createUserTextInput"
                                defaultVal={defaultProject?.city}
                                type='text'
                                required={true}
                                requiredMsg='City is required'
                                // max={3}
                                // maxMsg="cannot be longer than 40 characters"
                                typeMsg="Enter a valid City!"
                                label="City"
                            />
                        </Col>
                    </Row>
                    <Row justify='space-between'>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            {/* <TextInput
                                name="constructionType"
                                className="createUserTextInput"
                                defaultVal={defaultProject?.constructionType}
                                type='text'
                                required={true}
                                requiredMsg='Construction Type is required'
                                // max={3}
                                // maxMsg="cannot be longer than 40 characters"
                                typeMsg="Enter a valid Construction Type!"
                                label="Construction Type"
                            /> */}
                            <Selectable
                                label='Construction Type'
                                name="constructionType"
                                required={true}
                                defaultVal={defaultProject?.constructionType}
                                requiredMsg='Construction Type is required'
                                firstName='name'
                                data={constructionTypeList}
                                width={400}
                                showSearch={true}
                                handleSelectChange={(val) => { }}
                            />
                        </Col>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            {/* <TextInput
                                name="startDate"
                                className="createUserTextInput"
                                defaultVal={defaultProject?.startDate}
                                type='date'
                                required={true}
                                requiredMsg='Start Date is required'
                                // max={3}
                                // maxMsg="cannot be longer than 40 characters"
                                typeMsg="Enter a valid Start Date!"
                                label="Start Date"
                            /> */}
                            <Form.Item
                                name='startDate'
                                label='Start Date'
                                className="createUserTextInput"
                                initialValue={defaultProject ? dayjs(new Date(defaultProject?.startDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
                                rules={[{ required: true, message: 'Start Date is required' }]}
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
                                name='completionDate'
                                label='Completion Date'
                                className="createUserTextInput"
                                initialValue={defaultProject ? dayjs(new Date(defaultProject?.completionDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
                                rules={[{ required: true, message: 'Completion Date is required' }]}
                            >
                                <DatePicker
                                    className='datePicker'
                                    placeholder=''
                                    // disabledDate={dayjs(new Date(defaultProject?.startDate))}
                                    format='DD/MM/YYYY'
                                />
                            </Form.Item>
                        </Col>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <TextInput
                                name="clientName"
                                className="createUserTextInput"
                                defaultVal={defaultProject?.clientName}
                                type='text'
                                required={true}
                                requiredMsg='Client Name is required'
                                // max={3}
                                // maxMsg="cannot be longer than 40 characters"
                                typeMsg="Enter a valid Client Name!"
                                label="Client Name"
                            />
                        </Col>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <TextInput
                                name="clientNumber"
                                className="createUserTextInput"
                                defaultVal={defaultProject?.clientNumber}
                                type='text'
                                required={true}
                                requiredMsg='Client Number is required'
                                // max={3}
                                // maxMsg="cannot be longer than 40 characters"
                                typeMsg="Enter a valid Client Number!"
                                label="Client Number"
                                min={10}
                                max={10}
                                onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                            />
                        </Col>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <Selectable
                                label='Status'
                                name="status"
                                required={true}
                                defaultVal={defaultProject?.status}
                                requiredMsg='Status is required'
                                firstName='name'
                                data={projectStatusesList}
                                width={400}
                                showSearch={false}
                                handleSelectChange={(val) => { }}
                            />
                        </Col>

                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <Form.Item
                                name='priority'
                                label='Priority'
                                initialValue={defaultProject?.priority}
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

                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <TextInput
                                style={{ width: '100%' }}
                                name="estimatedBudget"
                                className="createUserTextInput"
                                type='number'
                                defaultVal={defaultProject?.estimatedBudget??0}
                                required={false}
                                requiredMsg='Estimated Budget is required'
                                onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                                // max={3}
                                // maxMsg="cannot be longer than 40 characters"
                                typeMsg="Enter a valid Estimated Budget!"
                                label="Estimated Budget"
                                formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\₹\s?|(,*)/g, '')}
                            />
                        </Col>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }} >
                            {/* <TextInput
                                style={{ width: '100%' }}
                                name="tax"
                                className="createUserTextInput"
                                type='number'
                                defaultVal={defaultProject?.tax ?? 0}
                                required={false}
                                // requiredMsg='Tax is required'
                                // patternMsg='valid percentage!'
                                // max={3}
                                // maxMsg="cannot be longer than 40 characters"
                                typeMsg="Enter a valid Tax!"
                                label="Tax %"
                                min={0}
                                max={100}
                                formatter={(value) => `${value}%`}
                                parser={(value) => value.replace('%', '')}
                                // onKeyPress={(event) => {
                                //     handleTaxInputForPercentage(event, addProjectForm, 'tax');
                                // }}
                                onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                            /> */}
                            
                            <Form.Item
                                name='tax'
                                initialValue={defaultProject?.tax ?? 0}
                                label='Tax %'
                                className='createUserTextInput'
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
                            <TextInput
                                style={{ width: '100%' }}
                                name="receivedAmount"
                                className="createUserTextInput"
                                type='number'
                                defaultVal={defaultProject?.receivedAmount??0}
                                required={false}
                                // requiredMsg='Received Amount is required'
                                max={10000000000}
                                // maxMsg="cannot be longer than 40 characters"
                                // typeMsg="Enter a valid Received Amount!"
                                label="Received Amount"
                                formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\₹\s?|(,*)/g, '')}
                                onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                            />
                            {/* <Form.Item
                                name='receivedAmount'
                                defaultVal={defaultProject?.receivedAmount}
                                label='Received Amount'
                                className='createUserTextInput'
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    label="Received Amount"
                                    controls={false}
                                    min={0}
                                    max={1000000000000000}
                                    formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\₹\s?|(,*)/g, '')}
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                />
                            </Form.Item> */}
                        </Col>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <TextInput
                                style={{ width: '100%' }}
                                name="projectValue"
                                className="createUserTextInput"
                                type='number'
                                defaultVal={defaultProject?.projectValue??0}
                                required={false}
                                // requiredMsg='Project Value is required'
                                max={10000000000}
                                // maxMsg="cannot be longer than 40 characters"
                                // typeMsg="Enter a valid Project value!"
                                label="Project Value"
                                formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\₹\s?|(,*)/g, '')}
                                onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                            />
                        </Col>

                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            {/* <TextInput
                                name="completionPercentage"
                                className="createUserTextInput"
                                type='text'
                                defaultVal={defaultProject?.completionPercentage}
                                required={false}
                                requiredMsg='Percentage is required'
                                patternName='percentage'
                                patternMsg='valid percentage!'
                                onKeyPress={(event) => {
                                    handleTaxInputForPercentage(event, addProjectForm, 'completionPercentage');
                                }}
                                // max={3}
                                // maxMsg="cannot be longer than 40 characters"
                                typeMsg="Enter a valid Estimated Budget!"
                                label="Completion Percentage"
                            /> */}

                            <Form.Item
                                name='completionPercentage'
                                initialValue={defaultProject?.completionPercentage ?? 0}  
                                label='Completion Percentage'
                                className='createUserTextInput'
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
                            <Form.Item name='attachment' label='Attachment' rules={[{ required: false, message: 'Attachment is Required' }]} >
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
                                    handleAddProjectValues(addProjectForm);
                                }}
                                className='appPrimaryButton formWidth'
                                label='Save'
                            />
                            <Button
                                label='Cancel'
                                className="appButton formWidth"
                                onClick={() => {
                                    addProjectForm.resetFields();
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

export default AddEditProjectForm;