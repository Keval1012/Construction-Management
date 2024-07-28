import { Col, Modal, Row, Tag, Tooltip, message } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import AppButton from '../components/AppButton';
import Collapsible from '../components/Collapsible';
import FilterBox from '../components/FilterBox';
import { deleteProject, getAllBuilder, getAllProjectsByBuilderAndStatus, getProjects } from '../API/Api';
import { AuthContext } from '../context/AuthProvider';
import AppTable from '../components/AppTable';
import { DashboardOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../styles/project.css';
import { useSelector } from 'react-redux';
import { checkModulePermission } from '../helper';
import Selectable from '../components/Selectable';
import { projectPriorityList, projectStatusesList } from '../constants';

const Projects = () => {

  const initialColumns = [
    {
      key: "projectNumber",
      title: "No.",
      dataIndex: "projectNumber",
      // filters: data.map(o => ({ text: o.name, value: o.key })),
      // onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: false,
      fixed: 'left',
      render: (val) => val ? <div>{val}</div> : <div>-</div>
    },
    {
      key: "projectName",
      title: "Name",
      dataIndex: "projectName",
      // filters: data.map(o => ({ text: o.name, value: o.key })),
      // onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: false,
      fixed: 'left',
      render: (val) => val ? <div>{val}</div> : <div>-</div>
    },
    {
      key: "clientName",
      title: "Client Name",
      dataIndex: "clientName",
      sorter: false,
      render: (val) => val ? <div>{val}</div> : <div>-</div>
    },
    {
      key: "clientNumber",
      title: "Client Number",
      dataIndex: "clientNumber",
      sorter: false,
      render: (val) => val ? <div>{val}</div> : <div>-</div>
    },
    {
      key: "city",
      title: "City",
      dataIndex: "city",
      sorter: false,
      render: (val) => val ? <div>{val}</div> : <div>-</div>
    },
    {
      key: "address",
      title: "Address",
      dataIndex: "address",
      sorter: false,
      render: (val) => val ? <div>{val}</div> : <div>-</div>
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      sorter: false,
      render: (val) => val ? <Tag bordered={true} color={val === 'onGoing' ? 'processing' : val === 'completed' ? 'success' : 'default'}>{val}</Tag> : <div>-</div>
    },
    {
      key: "priority",
      title: "Priority",
      dataIndex: "priority",
      sorter: false,
      render: (val) => val ? <Tag bordered={true} color={val === 'high' ? 'processing' : val === 'medium' ? 'success' : 'default'}>{val}</Tag> : <div>-</div>
    },
  ];

  const navigate = useNavigate();
  const { userId } = useContext(AuthContext) ?? {};
  const { currentUserRole, permissions } = useSelector((state) => state.userData) ?? {};
  const [projectColumns, setProjectColumns] = useState(initialColumns);
  const [projectsList, setProjectsList] = useState([]);
  const [pageCount, setPageCount] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [paginationTotal, setPaginationTotal] = useState(0);
  const [skipCount, setSkipCount] = useState(0);
  const [filterInputValue, setFilterInputValue] = useState('');
  const [isEditProject, setIsEditProject] = useState(false);
  const [defaultProject, setDefaultProject] = useState(null);
  const [isCreatePermission, setIsCreatePermission] = useState(false);
  const [builderNameList, setBuilderNameList] = useState();

  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedBuilder, setSelectedBuilder] = useState('');

  const showDeleteConfirm = (record) => {
    Modal.confirm({
      title: `Project name: ${record.name} `,
      content: 'Are you sure you want to remove this Project?',
      okText: 'Remove',
      okType: 'danger',
      onOk: async () => {
        try {
          debugger
          const res = await deleteProject(record._id);
          if (res.data?.success) {
            message.success(record?.projectName + ' Project deleted successfully');
            fetchProjects();
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
      fetchProjects();
    }
  }, [skipCount]);

  useEffect(() => {
    if (permissions?.length > 0) {
      setPermission();
    }
  }, [JSON.stringify(permissions)]);

  useEffect(() => {
    fetchProjects();
    fetchAllBuilders();
  }, []);

  useEffect(() => {
    if (currentUserRole === 'hostAdmin') {
      initialColumns.splice(2, 0, {
        key: "builder",
        title: "Builder Name",
        dataIndex: "builder",
        sorter: false,
        render: (val, record) => record ? <div>{record?.builderDetails?.name}</div> : <div>-</div>
      });
    }
  }, [currentUserRole]);

  const setPermission = async () => {
    let tempColumns = initialColumns;

    const checkPermission = await checkModulePermission(permissions, 'Project');

    let action = {
      key: "actions",
      title: "Actions",
      dataIndex: "action",
      width: '12%',
      fixed: 'right',
      render: (index, record) => <div className='d-flex-between'>
        <Tooltip title='Project Details'><EyeOutlined className='tableEditIcon' onClick={() => onEditRow(record, false, true)} /></Tooltip>
        <Tooltip title='Project Dashboard'><DashboardOutlined className='tableEditIcon' onClick={() => onProjectDashboard(record)} /></Tooltip>
        {checkPermission.isUpdate && <Tooltip title='Edit'><EditOutlined className='tableEditIcon' onClick={() => onEditRow(record)} /></Tooltip>}
        {checkPermission.isDelete && <Tooltip title='Delete'><DeleteOutlined className='tableDeleteIcon' onClick={() => onEditRow(record, true)} /></Tooltip>}
      </div>
    };
    
    if (checkPermission.isCreate) setIsCreatePermission(true);
    if (!tempColumns.find(o => o.dataIndex === 'action')) tempColumns.push(action);
    setProjectColumns(tempColumns);
  };

  const fetchProjects = async () => {
    if (currentUserRole === 'builder' && userId) {
      const res = await getAllProjectsByBuilderAndStatus(userId, ['notStarted', 'onGoing', 'completed'], null, pageCount, skipCount);
      if (res?.data?.status === 200) {
        setProjectsList(res?.data?.data);
        setPaginationTotal(res?.data?.totalLength);
      }
    }
    if (currentUserRole === 'hostAdmin') {
      const res = await getProjects(null, null, null, pageCount, skipCount);
      if (res?.data?.status === 200) {
        setProjectsList(res?.data?.data);
        setPaginationTotal(res?.data?.totalLength);
      }
    }
  };

  const fetchAllBuilders = async () => {
    const payload = {
      builderId: userId
    }
    const res = await getAllBuilder(payload);
    if (res?.data?.status === 200) {
      setBuilderNameList(res?.data?.data);
    }
  };

  const fetchFilterList = async (status, priority, builder) => {
    if (currentUserRole === 'builder' && userId) {
      const res = await getAllProjectsByBuilderAndStatus(userId, status || selectedStatus, priority || selectedPriority, pageCount, skipCount);
      if (res?.data?.status === 200) {
        setProjectsList(res?.data?.data);
      }
    }
    if (currentUserRole === 'hostAdmin') {
      const res = await getProjects(status || selectedStatus, priority || selectedPriority, builder || selectedBuilder, pageCount, skipCount);
      if (res?.data?.status === 200) {
        setProjectsList(res?.data?.data);
      }
    }
  };

  const fetchFilterLists = async (status, priority) => {
    if (currentUserRole === 'builder' && userId) {
      const res = await getAllProjectsByBuilderAndStatus(userId, status, priority, pageCount, skipCount);
      if (res?.data?.status === 200) {
        setProjectsList(res?.data?.data);
      }
    }
  };

  const extraFilter = <>
    <Row className='firstRow extraFilterRow' justify='space-between'>
      <Col xl={{ span: 6 }} lg={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }} xs={{ span: 6 }}>
        <Selectable
          allowClear
          name="status"
          requiredMsg='Status is required'
          placeholder='By Status'
          firstName='name'
          data={projectStatusesList}
          width={400}
          showSearch={false}
          handleSelectChange={(status) => {
            if (currentUserRole === 'hostAdmin') {
              if (status) {
                fetchFilterList([status], null, null);
                setSelectedStatus([status]);  
              } else setSelectedStatus(null);
            }
            if (currentUserRole === 'builder') {
              if (status) {
                fetchFilterList([status], null);
                setSelectedStatus([status]);  
              } else {
                setSelectedStatus(null);
                if (selectedPriority) {
                  fetchFilterLists(['notStarted', 'onGoing', 'completed'], selectedPriority);
                } else fetchProjects();
              }
            }
            
          }}
        />
      </Col>
      <Col xl={{ span: 6 }} lg={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }} xs={{ span: 6 }}>
        <Selectable
          allowClear
          name="priority"
          requiredMsg='priority is required'
          placeholder='By Priority'
          firstName='name'
          data={projectPriorityList}
          width={400}
          showSearch={false}
          handleSelectChange={(priority) => {
            if (currentUserRole === 'hostAdmin') {
              fetchFilterList(null, priority, null);
              setSelectedPriority(priority);
            }
            if (currentUserRole === 'builder') {
              if (selectedStatus && priority) {
                fetchFilterList(null, priority);
                setSelectedPriority(priority);
              }
              if (!selectedStatus && priority) {
                fetchFilterList(['notStarted', 'onGoing', 'completed'], priority);
                setSelectedPriority(priority);
              }
              if (!priority) {
                setSelectedPriority(null);
                if (selectedStatus) {
                  fetchFilterLists(selectedStatus, null);
                } else fetchProjects();
              }
            }
          }}
        />
      </Col>
      <Col xl={{ span: 6 }} lg={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }} xs={{ span: 6 }}>
        {currentUserRole === 'hostAdmin' &&
          <Selectable
            allowClear
            name="builder"
            requiredMsg='Builder is required'
            placeholder='By Builder'
            firstName='name'
            data={builderNameList}
            width={400}
            showSearch={false}
            handleSelectChange={(builder) => {
              fetchFilterList(null, null, builder);
              setSelectedBuilder(builder);
            }}
          />
        }
      </Col>
    </Row>
  </>;

  const onProjectDashboard = (record) => {
    navigate(`/project/dashboard/${record?._id}`, {
      state: {
        selectedProject: record
      }
    })
  };

  const onEditRow = async (record, isDelete = false, isDetails = false) => {
    if (isDetails && !isDelete) {
      setDefaultProject(record);
      navigate(`/projectDetails/${record?._id}`, {
        state: {
          defaultProject: record,
        }
      });
      localStorage.removeItem("keys");
    }

    if (!isDelete && !isDetails) {
      setDefaultProject(record);
      setIsEditProject(true);
      navigate('/projects/form', {
        state: {
          defaultProject: record,
          isEditProject: true,
        }
      });
    }

    if (isDelete) {
      showDeleteConfirm(record);
      return;
    }
  };

  const onFilterValues = async () => {
    if (filterInputValue && currentUserRole === 'builder' && userId) {
      const res = await getAllProjectsByBuilderAndStatus(userId, ['notStarted', 'onGoing', 'completed'], null, pageCount, skipCount, filterInputValue);
      if (res?.data?.status === 200) {
        setProjectsList(res.data?.data);
        setPaginationTotal(res.data?.totalLength);
        return;
      }
    }
    if (filterInputValue && currentUserRole === 'hostAdmin') {
      const res = await getProjects(null, null, null, pageCount, skipCount, filterInputValue);
      if (res?.data?.status === 200) {
        setProjectsList(res?.data?.data);
        setPaginationTotal(res.data?.totalLength);
      }
    }
    fetchProjects();
  };

  const handleChangeFilterInput = async (e) => {
    setFilterInputValue(e.target.value);
  };

  const handleSizeChange = (currentPage, size) => {
    setPageCount(size);
    fetchProjects();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    let count = 0;
    for (let i = 1; i < page; i++) {
      count = count + pageCount;
    }
    setSkipCount(count);
  };

  const handleSort = () => { };

  return (
    <div>
      <Row align='middle' justify='space-between'>
        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }} >
          <h2 className='allPageHeader'>Projects</h2>
        </Col>
        {isCreatePermission &&
          <Col>
            <AppButton
              label='+ Add Project'
              onClick={() => {
                setIsEditProject(false);
                setDefaultProject(null);
                navigate('/projects/form', {
                  state: {
                    defaultProject: null,
                    isEditProject: false,
                  }
                });
              }}
            />
          </Col>
        }
      </Row>
      <Collapsible
        label='Advance Search'
        children={<FilterBox
          isCard={true}
          handleChangeFilterInput={handleChangeFilterInput}
          onFilterValues={onFilterValues}
          extraFilter={true}
          extraFilterBox={extraFilter}
        />}
      />
      <Collapsible
        label='List'
        children={<AppTable
          handleSort={handleSort}
          dataSource={projectsList}
          columns={projectColumns}
          pageSize={pageCount}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          paginationTotal={paginationTotal}
          showSizeChanger={true}
          onShowSizeChange={handleSizeChange}
          scroll={{ x: 'calc(700px + 50%)' }}
        />}
      />
    </div>
  )
}

export default Projects;