import React, { useEffect, useState } from 'react'
import { Card, Col, Modal, Progress, Row, Tabs, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import AppButton from './AppButton';
import AppTable from './AppTable';
import { DeleteOutlined, EditOutlined, LeftOutlined } from '@ant-design/icons';
import { deleteTask, getTasksByProjectId } from '../API/Api';
import dayjs from 'dayjs';
import SiteInspection from './siteInspection/SiteInspection';
import EquipmentsRequests from '../pages/EquipmentsRequests';
import DocumentList from './DocumentList';
import Milestone from './milestone/Milestone';
import Dashboard from './budget/Dashboard';
import '../styles/budget.css';
import Budget from './budget/Budget';
import PurchaseOrder from '../pages/PurchaseOrder';
import SaleInvoice from '../pages/SaleInvoice';

const ProjectDetails = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { defaultProject } = location?.state ?? {};
    const [tasksList, setTasksList] = useState([]);
    const [completedTask, setCompletedTask] = useState(0);
    const [pageCount, setPageCount] = useState(5);
    const [currentPage, setCurrentPage] = useState(0);
    const [paginationTotal, setPaginationTotal] = useState(0);
    const [skipCount, setSkipCount] = useState(0);
    // const [allOnGoingProjects, setAllOnGoingProjects] = useState([]);
    // const [allNotStartedProjects, setAllNotStartedProjects] = useState([]);
    // const [currProjectList, setCurrProjectList] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, [skipCount]);

    // useEffect(() => {
    //     setCurrProjectList([ ...allOnGoingProjects, ...allNotStartedProjects ]);
    // }, [JSON.stringify(allOnGoingProjects), JSON.stringify(allNotStartedProjects)]);

    useEffect(() => {
        if (defaultProject) {
            fetchTasks();
            // fetchProjectsByBuilderAndStatus(defaultProject?.builder, ['notCompleted', 'onGoing']);
            // fetchProjectsByBuilderAndStatus(defaultProject?.builder, ['onGoing']);
        }
    }, []);

    useEffect(() => {
        if (defaultProject) {
            fetchTasks();
            // fetchProjectsByBuilderAndStatus(defaultProject?.builder, ['notCompleted', 'onGoing']);
            // fetchProjectsByBuilderAndStatus(defaultProject?.builder, ['onGoing']);
        }
    }, [JSON.stringify(defaultProject)]);

    const fetchTasks = async () => {
        // const res = await getTasks(pageCount, skipCount);
        const res = await getTasksByProjectId(defaultProject?._id, pageCount, skipCount);
        if (res?.data?.status === 200) {
            setTasksList(res?.data?.data);
            setCompletedTask(res.data?.data?.filter(o => o.status === 'completed'));
        }
    };

    // const fetchProjectsByBuilderAndStatus = async (builderId, status) => {
    //     const payload = {
    //         builderId: builderId,
    //         status: status
    //     };
    //     const res = await getAllProjectsByBuilderAndStatusWithoutPaginate(payload);
    //     if (res?.data?.status === 200) {
    //         setCurrProjectList(res?.data?.data);
    //         // if (status === 'onGoing') setAllOnGoingProjects(res?.data?.data);
    //         // if (status === 'notStarted') setAllNotStartedProjects(res?.data?.data);
    //     }
    // };

    const showDeleteConfirm = (record) => {
        Modal.confirm({
            title: `Task name: ${record.name} `,
            content: 'Are you sure you want to remove this Task?',
            okText: 'Remove',
            okType: 'danger',
            onOk: async () => {
                try {
                    const res = await deleteTask(record._id);
                    if (res.data?.success) {
                        message.success(record.name + ' Task deleted successfully');
                        fetchTasks();
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

    const handlePageChange = (page) => {
        setCurrentPage(page);
        let count = 0;
        for (let i = 1; i < page; i++) {
            count = count + pageCount;
        }
        setSkipCount(count);
    };

    const handleSizeChange = (currentPage, size) => {
        setPageCount(size);
        // fetchUsers();
    };
    const handleSort = () => { };

    const taskColumns = [
        {
            key: "taskNumber",
            title: "Task No.",
            dataIndex: "taskNumber",
            sorter: false,
            width: '5%',
            render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
            key: "taskName",
            title: "Task Name",
            dataIndex: "taskName",
            sorter: false,
            width: '5%',
            render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
            key: "status",
            title: "Status",
            dataIndex: "status",
            sorter: false,
            width: '5%',
            render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
            key: "startDate",
            title: "Start Date",
            dataIndex: "startDate",
            sorter: false,
            width: '5%',
            render: (val) => val ? <div>{dayjs(new Date(val)).format('DD/MM/YYYY')}</div> : <div>-</div>
        },
        {
            key: "completionPercent ",
            title: "Completion Percentage",
            dataIndex: "completionPercent",
            sorter: false,
            width: '5%',
            render: (val) => <Progress type="circle" percent={val ? parseInt(val) : 0} size={40} />
        },
        {
            key: "actions",
            title: "Actions",
            dataIndex: "action",
            width: '0.1%',
            render: (index, record) => <div className='d-flex-between'>
                <EditOutlined className='tableEditIcon' onClick={() => onEditRow(record)} />
                <DeleteOutlined className='tableDeleteIcon' onClick={() => onEditRow(record, true)} />
            </div>
        }
    ];

    const onEditRow = (record, isDelete = false) => {
        if (!isDelete) {
            navigate(`/task/form/${record?._id}`, {
                state: {
                    defaultTask: record,
                    defaultProject: defaultProject,
                    isEditTask: true,
                    // currProjectList: currProjectList
                }
            });
        }

        if (isDelete) {
            showDeleteConfirm(record);
            return;
        }
    };

    const OverviewChildren = <>
        <div>
            <h3>General Information</h3>
            <Card>
                <div>
                    <Row align='middle' justify='space-between'>
                        <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 8 }} sm={{ span: 8 }} xs={{ span: 8 }} >
                            <h4>Project</h4>
                            <p>{defaultProject?.projectName}</p>
                        </Col>
                        <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 8 }} sm={{ span: 8 }} xs={{ span: 8 }} >
                            <h4>Location</h4>
                            <p>{defaultProject?.address} - {defaultProject?.city}</p>
                        </Col>
                        <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 8 }} sm={{ span: 8 }} xs={{ span: 8 }} >
                            <h4>Starting Date</h4>
                            <p>{dayjs(new Date(defaultProject?.startDate)).format('DD/MM/YYYY')}</p>
                        </Col>
                    </Row>
                </div>
            </Card>
        </div><br />

        <div>
            <div className='d-flex-between'>
                <h3>Tasks ({completedTask?.length} of {tasksList?.length} Completed)</h3>
                <AppButton
                    label='+ Add Task'
                    className='addTaskBtn appPrimaryButton'
                    onClick={() => {
                        navigate('/task/form', {
                            state: {
                                defaultTask: null,
                                defaultProject: defaultProject,
                                isEditTask: false,
                                // currProjectList: currProjectList
                            }
                        });
                    }}
                // style={{ minWidth: '10%' }}
                />
            </div>
            <AppTable
                handleSort={handleSort}
                dataSource={tasksList}
                columns={taskColumns}
                pageSize={pageCount}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                paginationTotal={paginationTotal}
                showSizeChanger={true}
                onShowSizeChange={handleSizeChange}
            />
        </div>
    </>;

    const handleTabChange = (key) => {
        localStorage.setItem("keys", key);
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

            <Row align='middle' justify='space-between'>
                <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                    <h2 className='allPageHeader'>Project Details</h2>
                </Col>
            </Row>

            <Tabs
                // defaultActiveKey="1"
                defaultActiveKey={localStorage.getItem("keys")}
                onChange={handleTabChange}
                // items={items}
                items={
                    [
                        {
                            key: '1',
                            label: 'Overview',
                            children: OverviewChildren,
                        },
                        {
                            key: '2',
                            label: 'Milestones',
                            children: <Milestone defaultProject={defaultProject} />,
                        },
                        {
                            key: '3',
                            label: 'Safety Inspection',
                            children: (<SiteInspection defaultProject={defaultProject} />),
                        },
                        {
                            key: '4',
                            label: 'Equipments Requests',
                            children: (<EquipmentsRequests defaultProject={defaultProject} />),
                        },
                        {
                            key: '5',
                            label: 'Budget Dashboard',
                            children: (<Dashboard defaultProject={defaultProject} />),
                        },
                        {
                            key: '6',
                            label: 'Budget',
                            children: (<Budget defaultProject={defaultProject} />),
                        },
                        {
                            key: '7',
                            label: 'Purchase Order',
                            children: (<PurchaseOrder defaultProject={defaultProject} />),
                        },
                        {
                            key: '8',
                            label: 'Sale Invoice',
                            children: (<SaleInvoice defaultProject={defaultProject} />),
                        },
                        // {
                        //     key: '9',
                        //     label: 'Documents',
                        //     children: (<DocumentList defaultProject={defaultProject} />),
                        // },
                        {
                            key: '10',
                            label: 'Activity Log',
                            children: 'This is activity log',
                        }
                    ]
                }
            />

            <h2></h2>

        </div>
    )
}

export default ProjectDetails;