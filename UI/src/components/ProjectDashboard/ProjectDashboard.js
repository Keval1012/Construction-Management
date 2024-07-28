import { Card, Col, Form, Progress, Row, Table, Tag, message, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { renderMoneyFormat } from '../../helper';
import { LeftOutlined, MoreOutlined, UserOutlined } from '@ant-design/icons';
import { Pie } from 'react-chartjs-2';
import { getAllEmployeeOfProject, getAllTasksByProjectId } from '../../API/Api';
import Selectable from '../Selectable';
import { projectStatusesList } from '../../constants';
import AppModal from '../AppModal';
import DocViewModal from './DocViewModal';
import EmployeeListModal from './EmployeeListModal';
import { useSelector } from 'react-redux';

const ProjectDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { Text } = Typography;
    const { selectedProject } = location?.state??{};
    const { permissions } = useSelector((state) => state.userData)??{};
    const [allTasksList, setAllTasksList] = useState([]);
    const [filterTasksList, setFilterTasksList] = useState([]);
    const [allEmployeeList, setAllEmployeeList] = useState([]);
    const [allDocumentList, setAllDocumentList] = useState([]);
    const [uniqueEmployeeList, setUniqueEmployeeList] = useState([]);
    const [filterStatusList, setFilterStatusList] = useState(projectStatusesList);
    const [defaultDocView, setDefaultDocView] = useState(null);
    const [docModalOpen, setDocModalOpen] = useState(false);
    const [teamModalOpen, setTeamModalOpen] = useState(false);

    const [projectNotStarted, setProjectNotStarted] = useState([]);
    const [projectOnGoing, setProjectOnGoing] = useState([]);
    const [projectCompleted, setProjectCompleted] = useState([]);

    const taskColumns = [
        {
            title: 'Name',
            dataIndex: 'taskName',
        },
        {
            title: 'Desc.',
            dataIndex: 'description',
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            width: '20%',
            render: (val) => <Tag bordered={false} color={(val === 'high') ? 'error' : (val === 'low') ? 'default' : 'processing'}>{val ? val : '-'}</Tag>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            width: '20%',
            render: (val) => <Tag bordered={false} color={(val === 'completed') ? 'success' : (val === 'onGoing') ? 'processing' : 'default'}>{val ? val : '-'}</Tag>
        },
        {
            title: 'Completion (%)',
            dataIndex: 'completionPercent',
            width: '20%',
            render: (val) => <Progress type="circle" percent={val ? parseInt(val) : 0} size={30} />
        },
    ];

    const docsColumns = [
        {
            title: 'No.',
            dataIndex: 'id',
            width: '15%'
        },
        {
            title: 'Name',
            dataIndex: 'name',
            width: '30%',
            render: (index, record) => <Text style={{ width: 200 }} ellipsis={{ tooltip: {index} }}>{index}</Text>
        },
        {
            key: "view",
            title: "",
            dataIndex: "view",
            width: '8%',
            render: (index, record) => <div className='d-flex-between'>
                <a onClick={() => onShowDoc(record)}>view</a>
            </div>
        }
    ];

    useEffect(() => {
        fetchAllTasks();
        fetchAllEmployee();
        if (!filterStatusList.find(o => o._id === 'all')) {
            setFilterStatusList([...filterStatusList, { id: 4, name: 'All', _id: 'all' }]);
        }
    }, []);

    useEffect(() => {
        fetchAllTasks();
        fetchAllEmployee();
        let docTemp = [];
        selectedProject?.attachmentList?.forEach((o, i) => {
            docTemp.push({ id: i + 1, name: o?.attachment?.split('/')[o?.attachment?.split('/')?.length - 1], path: o });
        });
        setAllDocumentList(docTemp);
    }, [JSON.stringify(selectedProject)]);

    useEffect(() => {
        projectStatus();
    }, [filterTasksList]);

    useEffect(() => {
        if (allEmployeeList?.length > 0) {
            const temp = allEmployeeList.filter((obj, index) => {
                return index === allEmployeeList.findIndex(o => obj?.assignToDetails?.name === o?.assignToDetails?.name);
            });
            setUniqueEmployeeList(temp);
        }
    }, [JSON.stringify(allEmployeeList)]);

    if (!selectedProject) return <Navigate to={''} />

    const fetchAllTasks = async () => {
        if (selectedProject) {
            const res = await getAllTasksByProjectId(selectedProject?._id);
            if (res?.data?.success) {
                setAllTasksList(res?.data?.data);
                setFilterTasksList(res?.data?.data);
                // setAllTasksList([...res?.data?.data, ...res?.data?.data]);
                // setFilterTasksList([...res?.data?.data, ...res?.data?.data]);
            }
        }
    };

    const fetchAllEmployee = async () => {
        if (selectedProject) {
            const res = await getAllEmployeeOfProject({ projectId: selectedProject?._id });
            if (res?.data?.success) {
                setAllEmployeeList(res?.data?.data);
            }
        }
    };

    const onShowDoc = (record) => {
        setDefaultDocView(record);
        setDocModalOpen(true);
    };

    const onChangeTaskStatusFilter = (val) => {
        if (val !== 'all') {
            setFilterTasksList(allTasksList?.filter(o => o.status === val));
        } else setFilterTasksList(allTasksList);
    };

    const handleOnOkModal = () => {
        setDocModalOpen(false);
    };

    const handleOnCancelModal = () => {
        setDocModalOpen(false);
        setDefaultDocView(null);
    };

    const handleTeamModal = () => {
        if (uniqueEmployeeList.length === 0) {
            message.error('No Team Member is found !');
        } else setTeamModalOpen(!teamModalOpen);
    };

    const projectStatus = async () => {
        let statusNotStarted = [];
        for (let i = 0; i < filterTasksList.length; i++) {
            if (filterTasksList[i].status === 'notStarted') {
                statusNotStarted = [...statusNotStarted, filterTasksList[i]];
            }
        }
        setProjectNotStarted(statusNotStarted?.length);
        let statusOnGoing = [];
        for (let i = 0; i < filterTasksList.length; i++) {
            if (filterTasksList[i].status === 'onGoing') {
                statusOnGoing = [...statusOnGoing, filterTasksList[i]];
            }
        }
        setProjectOnGoing(statusOnGoing?.length);
        let statusCompleted = [];
        for (let i = 0; i < filterTasksList.length; i++) {
            if (filterTasksList[i].status === 'completed') {
                statusCompleted = [...statusCompleted, filterTasksList[i]];
            }
        }
        setProjectCompleted(statusCompleted?.length);
    };

    const pieChartDataForNoData = {
        labels: ['No Data'],
        datasets: [
            {   
                label: '# of tasks',
                data: [100],
                backgroundColor: ['#D3D3D3'],
            }
        ]
    };
   
    const pieChartData = {
        labels: ['Pending', 'OnGoing', 'Completed'],
        datasets: [
            {
                label: '# of tasks',
                // data: [12, 5, 8]
                data: [projectNotStarted, projectOnGoing, projectCompleted],
                backgroundColor: ['#36A2EB', '#FF6384', '#FFA500']
            }
        ]
    }

    const OverviewChildren = <>
        <h4>Project {selectedProject?.projectName}. Overview</h4>
        <Row align='top'>
            <Col
                className=''
                // style={{ width: '60%' }}
                xl={{ span: 10 }} lg={{ span: 10 }}
            >
                <Row justify='space-between'><Col xl={{ span: 16 }} lg={{ span: 16 }}>Start Date: </Col><Col xl={{ span: 8 }} lg={{ span: 8 }}>{dayjs(new Date(selectedProject?.startDate)).format('DD/MM/YYYY')}</Col></Row>
                <Row justify='space-between'><Col xl={{ span: 16 }} lg={{ span: 16 }}>Completion Date: </Col><Col xl={{ span: 8 }} lg={{ span: 8 }}>{dayjs(new Date(selectedProject?.completionDate)).format('DD/MM/YYYY')}</Col></Row>
                <Row justify='space-between'><Col xl={{ span: 16 }} lg={{ span: 16 }}>Estimated Budget: </Col><Col xl={{ span: 8 }} lg={{ span: 8 }}>{renderMoneyFormat(selectedProject?.estimatedBudget)}</Col></Row>
            </Col>
            <Col xl={{ span: 8 }} lg={{ span: 8 }}>
                <div className='secondaryTitle'>Percentage of completion</div>
                <Progress percent={selectedProject?.completionPercentage} size={[200, 20]} />
            </Col>
            <Col xl={{ span: 6 }} lg={{ span: 6 }}>
                <Row align='top' justify='space-between'><h4>All Team</h4><a onClick={handleTeamModal}>Show team</a></Row>
                <Row>Total Team Member - {uniqueEmployeeList?.length}</Row>
                {/* <Row align='middle'>
                    <UserOutlined className='avatarIcon' />
                    <div>
                        <div className='secondaryTitle'>name asda</div>
                        <div>Architect</div>
                    </div>
                </Row> */}
            </Col>
        </Row>
    </>;

    const employeeListing = <>
        <Row align='middle' justify='space-between'><h4>Employee</h4><a>Show more</a></Row>

        <Row align='middle'>
            <UserOutlined className='avatarIcon' />
            <div>
                <div className='secondaryTitle'>name asda</div>
                <div>Architect</div>
            </div>
        </Row>
    </>;

    const documentsList = <>
        <Row><h4>All Documents</h4></Row>

        <Table scroll={{ y: 200 }} columns={docsColumns} style={{ width: '100%' }} dataSource={allDocumentList} size="small" pagination={false} bordered={false} />
    </>;

    const tasksList = <>
        <Row align='middle' justify='space-between'>
            <Col xl={5} lg={5}><h4>All Tasks</h4></Col>

            <Col xl={5} lg={5}>
                <Form>
                    <Selectable
                        name='isStatusFilter'
                        // placeholder='by status'
                        // defaultVal='all'
                        defaultVal='all'
                        firstName='name'
                        // data={projectStatusesList}
                        data={filterStatusList}
                        onChange={onChangeTaskStatusFilter}
                    />
                </Form>
            </Col>
        </Row>

        <Row>
            <Table
                scroll={{ y: 200 }}
                columns={taskColumns}
                style={{ width: '100%' }}
                // dataSource={allTasksList}
                dataSource={filterTasksList}
                size="small"
                pagination={false}
                bordered={false}
            />
            {/* {allTasksList && allTasksList?.length > 0 && allTasksList?.map((o, i) => {
                return (
                    <div key={i}>
                        <div className='secondaryTitle'>{i+1}. {o?.taskName}</div>
                    </div>
                )
            })} */}
        </Row>
    </>;

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

            <Row align='top' justify='space-between'>
                <Col
                    xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }}
                    className=''
                // style={{ width: '40vw' }}
                >
                    <Card
                        children={OverviewChildren}
                        className='dashboardCard dashboardCardMargin'
                        // style={{ boxShadow: '0 0 5px 1px lightgrey' }}
                        bordered={false}
                    />
                </Col>
                {/* <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 8 }}>
                    <Card
                        children={employeeListing}
                        className='dashboardCard'
                        bordered={false}
                    />
                </Col> */}
            </Row>
            <Row align='top' justify='space-between'>
                <Col
                    xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 8 }}
                >
                    <Card
                        children={
                            ((projectNotStarted === 0 && projectOnGoing === 0 && projectCompleted === 0)) ? (<Pie options={{ responsive: true }} data={pieChartDataForNoData} />) 
                            : 
                            (<Pie options={{ responsive: true }} data={pieChartData} />)
                        }
                        className='dashboardCard'
                        bordered={false}
                    />
                </Col>
                <Col
                    xl={{ span: 16 }} lg={{ span: 16 }} md={{ span: 16 }}
                >
                    <Card
                        children={tasksList}
                        className='dashboardCard dashboardCardHeight dashboardCardSpace'
                        bordered={false}
                    />
                </Col>
            </Row>
                        
            <Row align='top' justify='space-between' className='docRowSpace'>
                <Col
                    xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 8 }}
                >
                    <Card
                        children={documentsList}
                        className='dashboardCard dashboardCardHeight'
                        bordered={false}
                    />
                </Col>
                
            </Row>
            <AppModal
                open={docModalOpen}
                closeIcon={false}
                children={
                    <DocViewModal
                        defaultDocView={defaultDocView}
                        setDocModalOpen={setDocModalOpen}
                    />}
                onOk={handleOnOkModal}
                onCancel={handleOnCancelModal}
                height='35rem'
                width='80vw'
            />
            <AppModal 
                open={teamModalOpen}
                children={
                    <EmployeeListModal 
                        setTeamModalOpen={setTeamModalOpen}
                        // allEmployeeList={allEmployeeList}
                        uniqueEmployeeList={uniqueEmployeeList}
                    />
                }
                onOk={handleTeamModal}
                onCancel={handleTeamModal}
            />
        </div>
    )
}

export default ProjectDashboard;