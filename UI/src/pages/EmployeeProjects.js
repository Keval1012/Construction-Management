import { Col, Progress, Row, Table, Tag, Tooltip } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { getAllTasksByEmployee } from '../API/Api';
import { AuthContext } from '../context/AuthProvider';
import { EyeOutlined, MinusCircleTwoTone, PlusCircleTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AppTable from '../components/AppTable';
import dayjs from 'dayjs';
import '../styles/project.css';

const EmployeeProjects = () => {

  const initialColumns = [
    {
      key: "projectName",
      title: "Project Name",
      dataIndex: "projectName",
      sorter: false,
      render: (val) => val ? <div>{val}</div> : <div>-</div>
    },
    {
      key: "completionDate",
      title: "Completion Date",
      dataIndex: "completionDate",
      sorter: false,
      render: (val) => val ? <div>{dayjs(new Date(val)).format('DD/MM/YYYY')}</div> : <div>-</div>
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
      render: (val) => val ? <Tag bordered={true} color={val === 'high' ? 'volcano' : val === 'medium' ? 'orange' : 'default'}>{val}</Tag> : <div>-</div>
    },
    {
      key: "action",
      // title: "Action",
      dataIndex: "action",
      children: [
        {
          dataIndex: "details",
          key: "details",
          width: '5%',
          render: (index, record) => <Tooltip title='Project Details'><EyeOutlined className='tableEditIcon' onClick={() => onDetailsRow(record, true)} /></Tooltip>,
        },
      ]
    }
  ];

  const initialColumnsForTasks = [
    {
      key: "taskName",
      title: "Task Name",
      dataIndex: "taskName",
      sorter: false,
      width: '5%',
      render: (val) => val ? <div>{val}</div> : <div>-</div>
    },
    {
      key: "endDate",
      title: "End Date",
      dataIndex: "endDate",
      sorter: false,
      width: '5%',
      render: (val) => val ? <div>{dayjs(new Date(val)).format('DD/MM/YYYY')}</div> : <div>-</div>
    },
    {
      key: "completionPercent",
      title: "Completion Percent",
      dataIndex: "completionPercent",
      sorter: false,
      width: '5%',
      render: (val) => <Progress type="circle" percent={val ? parseInt(val) : 0} size={40} />
    },
    {
      key: "description",
      title: "Description",
      dataIndex: "description",
      sorter: false,
      width: '5%',
      render: (val) => val ? <div>{val}</div> : <div>-</div>
    },
    // {
    //     key: "status",
    //     title: "Status",
    //     dataIndex: "status",
    //     sorter: false,
    //     width: '5%',
    //     render: (val) => val ? <Tag bordered={true} color={val === 'onGoing' ? 'processing' : val === 'completed' ? 'success' : 'default'}>{val}</Tag> : <div>-</div>
    //   },
    {
      key: "priority",
      title: "Priority",
      dataIndex: "priority",
      sorter: false,
      width: '5%',
      render: (val) => val ? <Tag bordered={true} color={val === 'critical' ? 'volcano' : val === 'high' ? 'orange' : val === 'medium' ? 'processing' : 'default'}>{val}</Tag> : <div>-</div>
    },
  ];

  const navigate = useNavigate();
  const { userId, currentRole } = useContext(AuthContext) ?? {};
  const [defaultProject, setDefaultProject] = useState(null);
  const [pageCount, setPageCount] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [paginationTotal, setPaginationTotal] = useState(0);
  const [skipCount, setSkipCount] = useState(0);
  const [employeeProjectList, setEmployeeProjectList] = useState([]);
  const [employeeNewProjectList, setEmployeeNewProjectList] = useState([]);

  useEffect(() => {
    fetchAllTasksByEmployee();
  }, []);

  useEffect(() => {
    fetchAllTasksByEmployee();
  }, [JSON.stringify(currentRole), JSON.stringify(userId)]);

  useEffect(() => {
    extractArray();
  }, [JSON.stringify(employeeProjectList)]);

  const extractArray = () => {
    const newArray = employeeProjectList.map((o) => {
      return { ...o, ...o.project, key: o._id };
    });
    setEmployeeNewProjectList(newArray);
  };

  const fetchAllTasksByEmployee = async () => {
    if (currentRole === 'employee' && userId) {
      const res = await getAllTasksByEmployee(userId, ['high', 'critical']);
      if (res?.data?.status === 200) {
        setEmployeeProjectList(res?.data?.data);
      }
    }
  };

  const onDetailsRow = async (record, isDetails = false) => {
    if (isDetails) {
      setDefaultProject(record);
      navigate(`/projectDetails/${record?._id}`, {
        state: {
          defaultProject: record,
        }
      });
    }
    localStorage.removeItem("keys");
  };

  const handleSort = () => { };
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
    fetchAllTasksByEmployee();
  };

  return (
    <div>
      <Row align='middle' justify='space-between'>
        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }} >
          <h2 className='allPageHeader'>Employee Projects</h2>
        </Col>
      </Row>

      <AppTable
        bordered={false}
        rowClass="nestedTableRow"
        expandable={{
          expandedRowRender: (record) => {
            if (record) {
              return (
                <Table
                  bordered={false}
                  size='small'
                  // showHeader={false}
                  columns={initialColumnsForTasks}
                  dataSource={record.tasks}
                  pagination={false}
                />
              );
            }
            return null;
          },
          defaultExpandAllRows: false,
          defaultExpandedRowKeys: [],
          expandRowByClick: true,
          expandIcon: ({ expanded, onExpand, record }) => {
            return expanded ? (
              <MinusCircleTwoTone
                onClick={(e) => {
                  onExpand(record, e);
                }}
              />
            ) : (
              <PlusCircleTwoTone
                onClick={(e) => {
                  onExpand(record, e);
                }}
              />
            );
          },
        }}

        handleSort={handleSort}
        dataSource={employeeNewProjectList}
        columns={initialColumns}
        pageSize={pageCount}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        paginationTotal={paginationTotal}
        showSizeChanger={true}
        onShowSizeChange={handleSizeChange}
      >
      </AppTable>
    </div>
  )
}

export default EmployeeProjects;