import React, { useEffect, useState } from 'react';
import { Card, Col, Descriptions, Divider, Form, Row, Upload, message } from 'antd';
import dayjs from 'dayjs';
import '../styles/eqptReqModal.css';
import AppButton from './AppButton';
import { API_HOST, equipmentTypeList, projectStatusesList } from '../constants';
import { changeStatusOfEqptRequest } from '../API/Api';
import { UploadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const EqptReqApprovalModal = ({ currentRequest, handleOnModal, fetchEqptRequests }) => {

    const { currentUserRole } = useSelector((state) => state.userData)??{};
    const [imageFile, setImageFile] = useState(null);
    const [uploadFileList, setUploadFileList] = useState([]);
    const [imagesToDeleted, setImagesToDeleted] = useState([]);
    const [isCurrUnavailableQty, setIsCurrUnavailableQty] = useState(false);

    useEffect(() => {
        if (currentRequest && currentRequest?.attachment) {
            const imgsArr = currentRequest?.attachment;
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
        if (Number(currentRequest?.quantity) > (currentRequest?.equipmentDetails?.totalQuantity) - (currentRequest?.inUseCount)) {
            setIsCurrUnavailableQty(true);
        }
    }, [currentRequest]);

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

    const eqptItems = [
        {
            key: '1',
            label: 'Name',
            children: <>{currentRequest?.equipmentDetails?.eqptNameDetails?.displayName}</>,
        },
        {
            key: '2',
            label: 'Eqpt. Type',
            children: <>{equipmentTypeList?.find(o => o._id === currentRequest?.equipmentDetails?.equipmentType)?.name}</>,
        },
        {
            key: '3',
            label: 'Total Quantity',
            children: <>{currentRequest?.equipmentDetails?.totalQuantity}</>,
        },
        {
            key: '4',
            label: 'Currently Available',
            children: <>{Number(currentRequest?.equipmentDetails?.totalQuantity) - Number(currentRequest?.inUseCount)}</>,
            // children: <>{currentRequest?.equipmentDetails?.totalQuantity}</>,
        },
        {
            key: '5',
            label: 'Request Quantity',
            children: <>{currentRequest?.quantity}</>,
        },
    ];

    const taskItems = [
        {
            key: '1',
            label: 'Name',
            children: <>{currentRequest?.taskDetails?.taskName}</>,
        },
        {
            key: '2',
            label: 'Description',
            children: <>{currentRequest?.taskDetails?.description}</>,
        },
        {
            key: '3',
            label: 'Start Date',
            children: <>{dayjs(new Date(currentRequest?.taskDetails?.startDate))?.format('DD/MM/YYYY')}</>,
        },
        {
            key: '4',
            label: 'End Date',
            children: <>{dayjs(new Date(currentRequest?.taskDetails?.endDate))?.format('DD/MM/YYYY')}</>,
        },
        {
            key: '5',
            label: 'Assign To',
            children: <>{currentRequest?.taskDetails?.assignToDetails?.name}</>,
        },
        {
            key: '6',
            label: 'Status',
            children: <>{projectStatusesList?.find(o => o._id === currentRequest?.taskDetails?.status)?.name}</>,
        },
    ];

    const handleRejectRequest = async () => {
        const res = await changeStatusOfEqptRequest(currentRequest?._id, { status: 'rejected' });
        if (res?.status === 200) {
            message.info('Request Rejected.');
            handleOnModal();
            fetchEqptRequests();
        }
        else message.error('Something went wrong');
    };
    
    const handleApproveRequest = async () => {
        if (imageFile) {
            let formData = new FormData();
            formData.append('status', 'approved');
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
            const res = await changeStatusOfEqptRequest(currentRequest?._id, formData);
            if (res?.status === 200) {
                message.success('Request Approved.');
                handleOnModal();
                fetchEqptRequests();
            }
            else message.error('Something went wrong');
        } else message.error('Please Upload Document');
    };

    return (
        <div>
            {/* <Card className='eqptReqModal'> */}
                {/* <Divider children='Equipment Details' orientation='left' /> */}
                <Descriptions
                    title="Equipment Info"
                    column={2}
                    size='small'
                    items={eqptItems ?? []}
                />
                <Descriptions
                    title="Task Info"
                    column={2}
                    size='small'
                    items={taskItems ?? []}
                />
                {/* <Row><h4>Equipment Details</h4></Row>
                <Row justify='space-between'>
                    <Col xl={5} lg={5} md={5} sm={5} xs={5}>Name: </Col>
                    <Col xl={7} lg={7} md={7} sm={7} xs={7}>{currentRequest?.equipmentDetails?.eqntNameDetails?.displayName}</Col>
                    <Col xl={5} lg={5} md={5} sm={5} xs={5}>Eqpt. Type: </Col>
                    <Col xl={7} lg={7} md={7} sm={7} xs={7}>{currentRequest?.equipmentDetails?.equipmentDetails}</Col>
                    <Col xl={5} lg={5} md={5} sm={5} xs={5}>Total Quantity: </Col>
                    <Col xl={7} lg={7} md={7} sm={7} xs={7}>{currentRequest?.equipmentDetails?.totalQuantity}</Col>
                    <Col xl={5} lg={5} md={5} sm={5} xs={5}>Currently Available: </Col>
                    <Col xl={7} lg={7} md={7} sm={7} xs={7}>{currentRequest?.equipmentDetails?.totalQuantity}</Col>
                    <Col xl={5} lg={5} md={5} sm={5} xs={5}>Request Quantity: </Col>
                    <Col xl={7} lg={7} md={7} sm={7} xs={7}>{currentRequest?.quantity}</Col>
                </Row> */}
                {/* <Divider children='Task Details' orientation='left' /> */}
                {/* <Row><h4>Task Details</h4></Row>
                <Row justify='space-between'>
                    <Col xl={3} lg={3} md={3} sm={3} xs={3}>Name: </Col>
                    <Col xl={8} lg={8} md={8} sm={8} xs={8}>{currentRequest?.taskDetails?.taskName}</Col>
                    <Col xl={3} lg={3} md={3} sm={3} xs={3}>Description: </Col>
                    <Col xl={8} lg={8} md={8} sm={8} xs={8}>{currentRequest?.taskDetails?.description}</Col>
                    <Col xl={3} lg={3} md={3} sm={3} xs={3}>Start Date: </Col>
                    <Col xl={8} lg={8} md={8} sm={8} xs={8}>{dayjs(new Date(currentRequest?.taskDetails?.startDate))?.format('DD/MM/YYYY')}</Col>
                    <Col xl={3} lg={3} md={3} sm={3} xs={3}>End Date: </Col>
                    <Col xl={8} lg={8} md={8} sm={8} xs={8}>{dayjs(new Date(currentRequest?.taskDetails?.endDate))?.format('DD/MM/YYYY')}</Col>
                    <Col xl={3} lg={3} md={3} sm={3} xs={3}>Assign To: </Col>
                    <Col xl={8} lg={8} md={8} sm={8} xs={8}>{currentRequest?.taskDetails?.assignToDetails?.name}</Col>
                    <Col xl={3} lg={3} md={3} sm={3} xs={3}>Status: </Col>
                    <Col xl={8} lg={8} md={8} sm={8} xs={8}>{currentRequest?.taskDetails?.status}</Col>
                </Row> */}

                <Form>
                    <Row className='uplaodRow'>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <Form.Item name='addTaskAttachment' label='Approval Document' rules={[{ required: true, message: 'Attachment is Required' }]} >
                                <Upload
                                    listType="text"
                                    {...uploadProps}
                                    maxCount={3}
                                    multiple={true}
                                    fileList={uploadFileList}
                                >
                                    <AppButton className="imageFileBtn" icon={<UploadOutlined />} label='Upload' />
                                    {/* + */}
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                <Divider />
                <Row justify='end'>
                    {(currentRequest?.status === 'rejected' || currentRequest?.status === 'approved') || currentUserRole === 'employee' || currentUserRole === 'hostAdmin' ?
                        // <AppButton
                        //     type='dashed'
                        //     disabled={true}
                        //     className=' '
                        //     danger={currentRequest?.status === 'rejected' ? true : false}
                        //     label={currentRequest?.status === 'rejected' ? 'Rejected' : currentRequest?.status === 'approved' ? "Approved" : ''} 
                        // />
                        <AppButton
                            className='approveBtn1'
                            // danger={currentRequest?.status === 'rejected' ? true : false}
                            onClick={() => handleOnModal()}
                            label='Okay'
                        />
                        : !isCurrUnavailableQty ?
                        <AppButton
                            className='approveBtn1'
                            type='dashed'
                            // danger={currentRequest?.status === 'rejected' ? true : false}
                            // onClick={() => handleOnModal()}
                            label='Waiting for availability'
                        />
                        :
                        <>
                            <AppButton className='rejectBtn' label='Reject' onClick={handleRejectRequest} />
                            <AppButton className='approveBtn' label='Approve' onClick={handleApproveRequest} />
                        </>
                    }
                </Row>

            {/* </Card> */}
        </div>
    )
}

export default EqptReqApprovalModal;