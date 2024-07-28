import { Col, Modal, Row, Tag, Tooltip, message } from 'antd';
import React, { useEffect, useState } from 'react';
import AppButton from '../components/AppButton';
import Collapsible from '../components/Collapsible';
import FilterBox from '../components/FilterBox';
import { deleteProject, getEquipmentRequestsByStatus, getEquipmentsByStatusWithoutPaginate } from '../API/Api';
import AppTable from '../components/AppTable';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/project.css';
import AppModal from '../components/AppModal';
import EqptReqApprovalModal from '../components/EqptReqApprovalModal';
import Selectable from '../components/Selectable';
import { equipmentRequestStatusList } from '../constants';

const EquipmentsRequests = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { defaultProject } = location?.state??{};
    const [eqptReqsList, setEqptReqsList] = useState([]);
    const [pageCount, setPageCount] = useState(5);
    const [currentPage, setCurrentPage] = useState(0);
    const [paginationTotal, setPaginationTotal] = useState(0);
    const [skipCount, setSkipCount] = useState(0);
    const [filterInputValue, setFilterInputValue] = useState('');
    const [isEditProject, setIsEditProject] = useState(false);
    const [approvalModalOpen, setApprovalModalOpen] = useState(false);
    const [defaultRequest, setDefaultRequest] = useState(null);
    const [allEqptList, setAllEqptList] = useState([]);
    const [formatReqsList, setFormatReqsList] = useState([]);

    const showDeleteConfirm = (record) => {
        Modal.confirm({
            title: `Request name: ${record.name} `,
            content: 'Are you sure you want to remove this Request?',
            okText: 'Remove',
            okType: 'danger',
            onOk: async () => {
                try {
                    const res = await deleteProject(record._id);
                    if (res.data?.success) {
                        message.success(record.name + ' Request deleted successfully');
                        fetchEqptRequests();
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
        if (filterInputValue) {
            onFilterValues();
        } else {
            fetchEqptRequests();
        }
    }, [skipCount]);

    useEffect(() => {
        fetchEqptRequests();
        fetchAllEquipments();
    }, []);

    useEffect(() => {
        let list = [];  
        eqptReqsList?.forEach(o => {
            o?.requests?.forEach(r => {
                let obj = { inUseCount: o.inUseCount, eqptId: o._id, ...r };
                list.push(obj);
            });
        });
        setFormatReqsList(list);
        setPaginationTotal(list?.length);
    }, [eqptReqsList]);

    const fetchAllEquipments = async () => {
        const res = await getEquipmentsByStatusWithoutPaginate(['available', 'inUse', 'maintanance']);
        if (res?.status === 200) setAllEqptList(res?.data?.data); setPaginationTotal(res?.data?.totalLength);
    };

    const requestColumns = [
        {
            key: "projectDetails",
            title: "Project",
            dataIndex: "projectDetails",
            sorter: false,
            width: '5%',
            render: (val) => val ? <div>{val?.projectName}</div> : <div>-</div>
        },
        {
            key: "equipmentDetails",
            title: "Equipment",
            dataIndex: "equipmentDetails",
            sorter: false,
            width: '5%',
            render: (val) => val ? <div>{val?.eqptNameDetails?.name}</div> : <div>-</div>
        },
        {
            key: "taskDetails",
            title: "Task",
            dataIndex: "taskDetails",
            sorter: false,
            width: '5%',
            render: (val) => val ? <div>{val?.taskName}</div> : <div>-</div>
        },
        {
            key: "quantity",
            title: "Qty.",
            dataIndex: "quantity",
            sorter: false,
            width: '5%',
            render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        // {
        //     key: "difference",
        //     title: "Available Qty",
        //     dataIndex: "difference",
        //     sorter: false,
        //     width: '5%',
        //     render: (val, record) => record ? <div>{(Number(record?.equipmentDetails?.totalQuantity)) - (record?.inUseCount)}</div> : <div>-</div>
        // },
        {
            key: "status",
            title: "Status",
            dataIndex: "status",
            sorter: false,
            width: '5%',
            render: (val) => val ? <Tag bordered={true} color={val === 'returned' ? 'processing' : val === 'approved' ? 'success' : 'default'}>{val}</Tag> : <div>-</div>
        },
        {
            key: "actions",
            title: "Actions",
            dataIndex: "action",
            width: '0.1%',
            render: (index, record) => <div className='d-flex-between'>
                <Tooltip title='Request Details'><InfoCircleOutlined className='tableEditIcon' onClick={() => onActionRow(record, true, false)} /></Tooltip>
            </div>
        }
    ];

    const fetchEqptRequests = async () => {
        const res = await getEquipmentRequestsByStatus(['pending', 'approved', 'rejected', 'returned'], pageCount, skipCount, null, defaultProject?._id);
        if (res?.data?.status === 200) {
            setEqptReqsList(res?.data?.data);
            // setPaginationTotal(res.data?.totalLength);
        }
    };

    const fetchFilterList = async (status) => {
        const res = await getEquipmentRequestsByStatus(status, pageCount, skipCount, null, defaultProject?._id);
        if (res?.data?.status === 200) {
            setEqptReqsList(res?.data?.data);
        }
    }

    const extraFilter = <>
            <Col xl={{ span: 6 }} lg={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }} xs={{ span: 6 }}>
                <Selectable
                    allowClear
                    name="status"
                    requiredMsg='Status is required'
                    placeholder='By Status'
                    firstName='name'
                    data={equipmentRequestStatusList}
                    width={400}
                    showSearch={false}
                    handleSelectChange={(status) => {
                        if (status) {
                            fetchFilterList([status]); 
                        } else fetchEqptRequests();
                    }}
                />
            </Col>             
    </>

    const onActionRow = async (record, isDetails = false, isDelete = false) => {
        if (isDetails) {
            setDefaultRequest(record);
            setApprovalModalOpen(true);
        }

        if (isDelete) {
            showDeleteConfirm(record);
            return;
        }
    };

    const onFilterValues = async () => {
        if (filterInputValue) {
            const res = await getEquipmentRequestsByStatus(['pending', 'approved', 'rejected', 'returned'], pageCount, skipCount, filterInputValue, defaultProject?._id);
            setEqptReqsList(res.data?.data);
            setPaginationTotal(res.data?.totalLength);
            return;
        }
        fetchEqptRequests();
    };

    const handleSizeChange = (currentPage, size) => {
        setPageCount(size);
        fetchEqptRequests();
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        let count = 0;
        for (let i = 1; i < page; i++) {
            count = count + pageCount;
        }
        setSkipCount(count);
    };

    const handleOnModal = () => {
        setApprovalModalOpen(!approvalModalOpen);
    };

    const handleSort = () => { };
    const handleChangeFilterInput = async (e) => {
        setFilterInputValue(e.target.value);
    };

    return (
        <div>
            <Row align='middle' justify='space-between'>
                <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }} >
                    <h2 className='allPageHeader'>All Equipments Requests</h2>
                </Col>
                <Col>
                    <AppButton
                        label='+ Add Request'
                        onClick={() => {
                            setIsEditProject(false);
                            setDefaultRequest(null);
                            navigate('/equipmentRequest/form', {
                                state: {
                                    defaultEqptReq: null,
                                    isEditEqptReq: false,
                                    allEqptList: allEqptList,
                                    defaultProject: defaultProject,
                                }
                            });
                        }}
                    />
                </Col>
            </Row>
            <Collapsible
                label='Advance Search'
                children={<FilterBox
                    isCard={true}
                    onFilterValues={onFilterValues}
                    handleChangeFilterInput={handleChangeFilterInput}
                    extraFilter={true}
                    extraFilterBox={extraFilter}
                />}
            />
            <Collapsible
                label='List'
                children={<AppTable
                    handleSort={handleSort}
                    dataSource={formatReqsList}
                    columns={requestColumns}
                    // pageSize={pageCount}
                    pageSize={false}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                    // paginationTotal={paginationTotal}
                    pagination={{ pageSize: 5, showSizeChanger: true }}
                    // showSizeChanger={true}
                    onShowSizeChange={handleSizeChange}
                />}
            />
            <AppModal
                open={approvalModalOpen}
                width={700}
                title={(defaultRequest?.status === 'approved') ?  `Equipment Request ${'(Approved)'}` : (defaultRequest?.status === 'rejected') ? `Equipment Request ${'(Rejected)'}` : 'Equipment Request'}
                children={
                    <EqptReqApprovalModal
                        currentRequest={defaultRequest}
                        handleOnModal={handleOnModal}
                        fetchEqptRequests={fetchEqptRequests}
                    />
                }
                onCancel={handleOnModal}
            />
        </div>
    )
}

export default EquipmentsRequests;