import { LeftOutlined, UploadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Card, Col, DatePicker, Divider, Form, Modal, Row, Tag, Upload, message } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TextInput from '../TextInput';
import Selectable from '../Selectable';
import AppButton from '../AppButton';
import dayjs from 'dayjs';
import { API_HOST, siteInspectionStatusList, siteInspectionTypeList } from '../../constants';
import AppModal from '../AppModal';
import IssueAddEditModal from './IssueAddEditModal';
import { addInspection, getAllEmployeeByBuilder } from '../../API/Api';
import { AuthContext } from '../../context/AuthProvider';
import { useSelector } from 'react-redux';

const AddEditForm = () => {
    const { userId, currUserData } = useContext(AuthContext)??{};
    const { currentUserRole } = useSelector((state) => state.userData) ?? {};
    const navigate = useNavigate();
    const location = useLocation();
    const { defaultProject, defaultInspection } = location?.state??{};
    const [addSiteInspectionForm] = Form.useForm();
    const [imageFile, setImageFile] = useState(null);
    const [uploadFileList, setUploadFileList] = useState([]);
    const [imagesToDeleted, setImagesToDeleted] = useState([]);
    const [isEditIssue, setIsEditIssue] = useState(false);
    const [defaultIssue, setDefaultIssue] = useState(null);
    const [issueModalOpen, setIssueModalOpen] = useState(false);
    const [allIssueList, setAllIssueList] = useState([]);
    const [inspector, setInspector] = useState([]);

    useEffect(() => {
        if (defaultInspection) {
            setAllIssueList(defaultInspection?.issueList??[]);
            const imgsArr = defaultInspection?.document;
            if (imgsArr) {
                let temp = [];
                imgsArr?.forEach((o, i) => {
                    const tempName = o?.split('/')[o?.split('/').length - 1];
                    const tempUrl = `${API_HOST}/${o}`;
                    temp.push({ uid: i + 1, name: tempName, status: 'done', url: tempUrl });
                });
                setUploadFileList(temp);
                setImageFile(temp);
            }
        }
    }, [JSON.stringify(defaultInspection)]);

    const showDeleteConfirm = async (record) => {
        Modal.confirm({
          content: 'Are you sure you want to remove this Issue?',
          okText: 'Remove',
          okType: 'danger',
          onOk: async () => {
            try {
              if (record) {
                setAllIssueList(allIssueList.filter((row) => row.id !== record.id));             
                message.success(' Issue deleted successfully');
              } else {
                message.error('Error');
              }
            } catch (error) {
              message.error('Something went wrong' + error);
            }
          },
          onCancel() { },
        });
    };
    
    const handleIssueFormValues = (form) => {

        for(const key in allIssueList) {
            allIssueList[key]['id'] = key;
        }
    
        const vals = form?.getFieldsValue();
        const { addIssueDeadline, addIssueDesc, addIssueLocation, addIssueSeverity, addIssueTitle, addIssueStatus } = vals;

        if (addIssueDeadline && addIssueDesc && addIssueLocation && addIssueSeverity && addIssueTitle && addIssueStatus) {

            if(form.getFieldsError().filter(x => x.errors.length > 0).length > 0){
                return;
            }
            
            if (isEditIssue) {
                setIssueModalOpen(false);
    
                const newState = allIssueList.map(obj => {
                    if (obj.id === defaultIssue?.id) {
                      return {
                            inspectionTitle: addIssueTitle,
                            description: addIssueDesc,
                            issueDeadline: addIssueDeadline,
                            severity: addIssueSeverity,
                            location: addIssueLocation,
                            status: addIssueStatus
                        }
                    }
                    return obj;
                });
                setAllIssueList(newState);
            }
    
            if (!isEditIssue) {

                if (allIssueList.length >= 3) {
                    setIssueModalOpen(false);
                    message.error('Maximum 3 Issues are allowed !');
                }

                else {
                    setIssueModalOpen(false);
                    setAllIssueList([ ...allIssueList, {
                        inspectionTitle: addIssueTitle,
                        description: addIssueDesc,
                        issueDeadline: addIssueDeadline,
                        severity: addIssueSeverity,
                        location: addIssueLocation,
                        status: addIssueStatus
                    }]);
                }
            }
        } else {
            message.error('Required Fields Missing!');
        }
    };

    const onEditIssue = async (record) => {
        setDefaultIssue(record);
        setIsEditIssue(true);
        setIssueModalOpen(true);
    };

    const onDeleteIssue = async (record, isDelete = true) => {
        if (isDelete) {
            showDeleteConfirm(record);
            return;
        }
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

    useEffect(() => {
        fetchInspector();
    }, []);

    const handleAddSiteInspectionValues = async (form) => {
        const vals = form.getFieldsValue();
        const { addInspType, addInspDescription, addInspLocation, addInspDate, addInspInspector, addInspStatus } = vals;

        if (defaultProject?._id && addInspType && addInspDescription && addInspLocation && addInspDate && addInspInspector && addInspStatus) {

            if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
                return;
            }

            let formData = new FormData();

            formData.append('projectId', defaultProject?._id);
            formData.append('inspectionType', addInspType);
            formData.append('description', addInspDescription);
            formData.append('location', addInspLocation);
            formData.append('inspectionDate', addInspDate);
            formData.append('inspector', addInspInspector);
            formData.append('status', addInspStatus);
            formData.append('issueList', JSON.stringify(allIssueList));
            
            if (imageFile && imageFile?.some(o => o instanceof File)) {
                for (let i = 0 ; i < imageFile.length ; i++) {
                    if (imageFile[i] instanceof File) {
                        formData.append('document', imageFile[i]);
                    } else {
                        formData.append('document', [JSON.stringify(imageFile[i])]);
                    }
                }
            }
            if (imageFile && !(imageFile?.some(o => o instanceof File))) {
                for (let i = 0 ; i < imageFile.length ; i++) {
                    formData.append('document', JSON.stringify(imageFile[i]));
                }
            }

            try {
                const res = await addInspection(formData);
                if (res.data?.success) {
                    addSiteInspectionForm.resetFields();
                    setImageFile(null);
                    setUploadFileList([]);
                    setAllIssueList([]);
                    message.success('Site Inspection Added Successfully');
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

    const fetchInspector = async () => {
        const payload = {
            builderId: userId,
            status: ['notStarted', 'onGoing']
        }
        const res = await getAllEmployeeByBuilder(payload);
        if (res?.data?.status === 200) {
          setInspector(res?.data?.data);
        }
    }; 

    const handleIssueModal = () => {
        setIssueModalOpen(!issueModalOpen);
    };

    const getSeverityTagColor = (val) => {
        return val === 'critical' ? 'volcano' : val === 'major' ? 'orange' : val === 'moderate' ? 'processing' : 'default';
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
                form={addSiteInspectionForm}
                name="addUserForm"
                className="addUserForm"
                scrollToFirstError
            >
                <Row align='middle' justify='space-between'>
                    <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                        <h2 className='allPageHeader'>Add Site Inspection</h2>
                    </Col>
                </Row>

                <Divider />

                <div>
                    <Row justify='space-between'>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <Selectable
                                label='Inspection Type'
                                name="addInspType"
                                required={true}
                                defaultVal={defaultInspection?.inspectionType}
                                requiredMsg='Assign To is required'
                                firstName='name'
                                data={siteInspectionTypeList}
                                width={400}
                                showSearch={false}
                                handleSelectChange={(val) => { }}
                            />
                        </Col>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <TextInput
                                name="addInspDescription"
                                className="createUserTextInput"
                                defaultVal={defaultInspection?.description}
                                type='text'
                                required={true}
                                requiredMsg='Desc. is required'
                                typeMsg="Enter a valid Desc.!"
                                label="Description"
                            />
                        </Col>
                    </Row>
                    <Row justify='space-between'>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <TextInput
                                name="addInspLocation"
                                className="createUserTextInput"
                                defaultVal={defaultInspection?.location}
                                type='text'
                                required={true}
                                requiredMsg='Location is required'
                                typeMsg="Enter a valid location!"
                                label="Location"
                            />
                        </Col>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <Form.Item
                                name='addInspDate'
                                label='Inspection Date'
                                className="createUserTextInput"
                                initialValue={defaultInspection ? dayjs(new Date(defaultInspection?.inspectionDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
                                rules={[{ required: true, message: 'Inspection Date is required' }]}
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
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            {currentUserRole !== 'employee' && <Selectable
                                label='Inspector'
                                name="addInspInspector"
                                required={true}
                                defaultVal={defaultInspection?.inspector}
                                requiredMsg='Inspector is required'
                                firstName='name'
                                data={inspector}
                                width={400}
                                showSearch={false}
                                handleSelectChange={(val) => { }}
                            />}
                            {currentUserRole === 'employee' && <TextInput
                                name="addInspInspector"
                                className="createUserTextInput"
                                defaultVal={currUserData?.name}
                                type='text'
                                disabled={true}
                                required={true}
                                requiredMsg='Inspector is required'
                                typeMsg="Enter a valid Inspector!"
                                label="Inspector"
                            />}
                        </Col>

                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <Selectable
                                label='Status'
                                name="addInspStatus"
                                required={true}
                                defaultVal={defaultInspection?.status}
                                requiredMsg='Status is required'
                                firstName='name'
                                data={siteInspectionStatusList}
                                width={400}
                                showSearch={false}
                                handleSelectChange={(val) => { }}
                            />
                        </Col>

                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <Form.Item name='addInspDocument' label='Document' rules={[{ required: false, message: 'Document is Required' }]} >
                                <Upload
                                    listType="text"
                                    {...uploadProps}
                                    maxCount={3}
                                    multiple={true}
                                    fileList={uploadFileList}
                                >
                                    <AppButton className="imageFileBtn" icon={<UploadOutlined />} label='Upload' />
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </div>

                <Divider orientation='left' children={`Issues (${allIssueList?.length})`} /> 

                <Row align='middle' justify='end'>
                    <Col xl={{ span: 4 }} md={{ span: 4 }} sm={{ span: 4 }} xs={{ span: 4 }}>
                        <AppButton
                            label='+ Add Issue'
                            onClick={() => { 
                                setIsEditIssue(false);
                                if (allIssueList.length >= 3) {
                                    message.error('Maximum 3 Issues are allowed !');
                                } else {
                                    setIssueModalOpen(true);
                                }
                                setDefaultIssue(null);  
                            }}
                        />
                    </Col>
                </Row><br />

                {allIssueList && allIssueList?.length > 0 && allIssueList.map((o, i) => {
                    return (
                        <>
                            <Card className='issueCardDiv' key={i}>
                                <div>
                                    <Row align='middle' justify='space-between'>
                                        <Col className='cardIndexCol' xl={{ span: 1 }} lg={{ span: 1 }} md={{ span: 1 }} sm={{ span: 1 }} xs={{ span: 1 }} >
                                            <h3>{i+1}.</h3>
                                        </Col>

                                        <Col className='cardContentCol' xl={{ span: 14 }} lg={{ span: 14 }} md={{ span: 14 }} sm={{ span: 14 }} xs={{ span: 8 }} >
                                            <h3>Issue : {o?.inspectionTitle}</h3>
                                            <p><b>Description : </b>{o?.description}</p>
                                        </Col>
                                        <Col xl={{ span: 6 }} lg={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }} xs={{ span: 6 }} >
                                            {/* <Tag bordered={true} color={o?.addIssueSeverity === 'critical' ? 'volcano' : o?.addIssueSeverity === 'major' ? 'orange' : o?.addIssueSeverity === 'moderate' ? 'processing' : 'default'}>{o?.addIssueSeverity}</Tag> */}
                                            <Tag bordered={true} color={getSeverityTagColor(o?.severity)}>{o?.severity}</Tag>
                                        </Col>
                                        <Col xl={{ span: 3 }} lg={{ span: 3 }} md={{ span: 3 }} sm={{ span: 3 }} xs={{ span: 3 }} >
                                            <EditOutlined 
                                                className='tableEditIcon cardIcon' 
                                                onClick={() => onEditIssue(o)}
                                            />
                                            <DeleteOutlined 
                                                className='tableDeleteIcon cardIcon' 
                                                onClick={() => onDeleteIssue(o, true)}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            </Card>
                            <br />
                        </>
                    )
                })}

                <div>
                    <Divider />
                    <Row justify="end" className="formBtnRow" >
                        <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 8 }} sm={{ span: 8 }} xs={{ span: 8 }} className="formBtnCol" >
                            <AppButton
                                onClick={() => {
                                    handleAddSiteInspectionValues(addSiteInspectionForm);
                                }}
                                className='appPrimaryButton formWidth'
                                label='Save'
                            />
                            <AppButton
                                label='Cancel'
                                className="appButton formWidth"
                                onClick={() => {
                                    addSiteInspectionForm.resetFields();
                                    navigate(-1);
                                }}
                            />
                        </Col>
                    </Row>
                </div>
            </Form>
            <AppModal
                open={issueModalOpen}
                children={
                <IssueAddEditModal
                    defaultIssue={defaultIssue}
                    isEditIssue={isEditIssue}
                    setIssueModalOpen={setIssueModalOpen} 
                    handleIssueFormValues={handleIssueFormValues}
                />}
                onOk={handleIssueModal}
                onCancel={handleIssueModal}
            />
        </div>
    )
}

export default AddEditForm;