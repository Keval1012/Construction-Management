import { Col, Divider, Form, Row, Upload, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useContext, useEffect, useState } from 'react'
import TextInput from '../components/TextInput';
import Selectable from '../components/Selectable';
import { LeftOutlined, UploadOutlined } from '@ant-design/icons';
import AppButton from '../components/AppButton';
import { getAllProjectsByBuilderAndStatus, getAllTasksByEmployee, updateProjectDocuments } from '../API/Api';
import { useSelector } from 'react-redux';
import { AuthContext } from '../context/AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';

const Documents = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { defaultProject } = location?.state??{};
    const { userId } = useContext(AuthContext) ?? {};
    const { currentUserRole } = useSelector((state) => state.userData) ?? {};
    const [addDocumentForm] = Form.useForm();
    const [imageFile, setImageFile] = useState(null);
    const [uploadFileList, setUploadFileList] = useState([]);
    const [imagesToDeleted, setImagesToDeleted] = useState([]);
    const [pageCount, setPageCount] = useState(5);
    const [skipCount, setSkipCount] = useState(0);
    const [projectsList, setProjectsList] = useState([]);

    useEffect(() => {
        fetchProjects();
    }, []);

    const uploadProps = {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
            authorization: 'authorization-text',
        },

        onRemove: async (info) => {
            if (info?.url) {
                let tempPath = (info.url).split('images')[1];
                setImagesToDeleted([ ...imagesToDeleted, tempPath ]);
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
                message.error('Maximum 3 Images.');
            }
        },
    };

    const handleAddDocumentValues = async (form) => {
        const val = form.getFieldsValue();
        const { docProject, docTitle, docDescription } = val;

        if (docProject && docTitle && imageFile) {

            if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
                return;
            }

            let formData = new FormData();

            formData.append('projectId', docProject);
            formData.append('title', docTitle ? docTitle : '');
            formData.append('description', docDescription ? docDescription : '');

            if (imageFile && imageFile?.some(o => o instanceof File)) {
                for (let i = 0; i < imageFile.length; i++) {
                    if (imageFile[i] instanceof File) {
                        formData.append('attachment', imageFile[i]);
                    } else {
                        formData.append('attachment', [JSON.stringify(imageFile[i])]);
                    }
                }
            }
            if (imageFile && !(imageFile?.some(o => o instanceof File))) {
                for (let i = 0; i < imageFile.length; i++) {
                    formData.append('attachment', JSON.stringify(imageFile[i]));
                }
            }

            const res = await updateProjectDocuments(formData);
            if (res?.data?.success) {
                addDocumentForm.resetFields();
                setImageFile(null);
                message.success('Doument Added Successfully');
            } else {
                message.error('Something Went Wrong');
            }

        } else {
            return message.error('Required Field Missing!');
        }
    };

    const fetchProjects = async () => {
        if (currentUserRole === 'builder') {
            const res = await getAllProjectsByBuilderAndStatus(userId, ['notStarted', 'onGoing', 'completed'], null, pageCount, skipCount);
            if (res?.data?.status === 200) {
                setProjectsList(res?.data?.data);
            }
        }
        if (currentUserRole === 'employee' && userId) {
            const res = await getAllTasksByEmployee(userId, ['high', 'critical', 'medium', 'low']);
            if (res?.data?.status === 200) {
                setProjectsList(res?.data?.data);
            }
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
                form={addDocumentForm}
                name="addUserForm"
                className="addUserForm"
                scrollToFirstError
            >
                <Row align='middle' justify='space-between'>
                    <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                        <h2 className='allPageHeader'>Add Document</h2>
                    </Col>
                </Row>

                <Divider />

                <div>
                    <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                        <Selectable
                            label='Project'
                            name="docProject"
                            required={true}
                            requiredMsg='Project is required'
                            firstName={currentUserRole === 'employee' ? 'project.projectName' : 'projectName'}
                            data={projectsList}
                            width={400}
                            showSearch={false}
                            handleSelectChange={(val) => { }}
                            defaultVal={currentUserRole === 'employee' ? defaultProject?.project?.projectName : defaultProject?.projectName}
                            disabled={defaultProject ? true : false}
                        />
                    </Col>
                    <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                        <TextInput
                            name="docTitle"
                            className="createUserTextInput"
                            type='text'
                            required={true}
                            requiredMsg='Title is required'
                            max={40}
                            maxMsg="cannot be longer than 40 characters"
                            typeMsg="Enter a valid Title!"
                            label="Title"
                        />
                    </Col>
                    <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                        <Form.Item
                            name="docDescription"
                            className="createUserTextInput"
                            type='text'
                            required={false}
                            requiredMsg='Description is required'
                            max={40}
                            maxMsg="cannot be longer than 40 characters"
                            typeMsg="Enter a valid Description!"
                            label="Description"
                        >
                            <TextArea
                                rows={3}
                            />
                        </Form.Item>
                    </Col>
                    <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                        <Form.Item name='docAttachment' label='Attachment' rules={[{ required: true, message: 'Attachment is Required' }]} >
                            <Upload
                                listType="text"
                                {...uploadProps}
                                maxCount={5}
                                multiple={true}
                                fileList={uploadFileList}
                            >
                                <AppButton className="imageFileBtn" icon={<UploadOutlined />} label='Upload' />
                            </Upload>
                        </Form.Item>
                    </Col>
                </div>

                <div>
                    <Divider />
                    <Row justify="end" className="formBtnRow" >
                        <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 8 }} sm={{ span: 8 }} xs={{ span: 8 }} className="formBtnCol" >
                            <AppButton
                                onClick={() => {
                                    handleAddDocumentValues(addDocumentForm);
                                }}
                                className='appPrimaryButton formWidth'
                                label='Save'
                            />
                            <AppButton
                                label='Cancel'
                                className="appButton formWidth"
                                onClick={() => {
                                    addDocumentForm.resetFields();
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

export default Documents;