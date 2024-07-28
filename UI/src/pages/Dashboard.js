import { Card, Col, DatePicker, Divider, Form, Progress, Row, Space } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { getAllBuilderProjectsCountByMonth, getAllBuilderTotalCount, getAllTasksByEmployee, getAllTasksByProjectId, getAllEmployeeTotalCount, getAllEmployeeTotalCountByBuilder, getAllInspectionByQuery, getAllProjectsByBuilderAndStatusWithoutPaginate, getAllUser, getAllUserCount, getAllUsersCountByMonth, getAllEmployee } from '../API/Api';
import { AuthContext } from '../context/AuthProvider';
import { dashboardTimePeriodList } from '../constants';
import Selectable from '../components/Selectable';
import dayjs from 'dayjs';
import '../styles/dashboard.css';
import TaskChartData from '../components/dashboard/TaskChartData';
import EstimateBudget from '../components/dashboard/EstimateBudget';
import SiteInspectionCard from '../components/dashboard/SiteInspectionCard';
import DefectsCard from '../components/dashboard/DefectsCard';
import ComplaintsCard from '../components/dashboard/ComplaintsCard';
import ProjectCompletionCards from '../components/dashboard/ProjectCompletionCards';
import AttachmentCard from '../components/dashboard/AttachmentCard';
import WorkloadChart from '../components/dashboard/WorkloadChart';

const Dashboard = () => {

  const { RangePicker } = DatePicker;
  const [timePeriodForm] = Form.useForm();
  const { userId, currentRole } = useContext(AuthContext);
  const [totalBuildersCount, setTotalBuildersCount] = useState(0);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [totalEmployeeCount, setTotalEmployeeCount] = useState(0);
  const [totalProjectsCount, setTotalProjectsCount] = useState(0);
  const [totalEmpProfitCount, setTotalEmpProfitCount] = useState(0);
  const [userChartData, setUserChartData] = useState([]);
  const [projectChartData, setProjectChartData] = useState([]);
  const [timePeriod, setTimePeriod] = useState('30');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [showOption, setShowOption] = useState(false);
  
  const [projectList, setProjectList] = useState([]);
  const [projectDays, setProjectDays] = useState([]);
  const [attachmentList, setAttachmentList] = useState([]);
  const [startDate, setStartDate] = useState([]);
  const [projectShow, setProjectShow] = useState(true);
  const [projectPercentage, setProjectPercentage] = useState(true);
  const [inspectionsList, setInspectionsList] = useState([]);
  const [totalInspectionsCount, setTotalInspectionsCount] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState([]);
  const [estimatedBudget, setEstimatedBudget] = useState([]);
  const [employeeProjectList, setEmployeeProjectList] = useState([]);
  const [employeeProjectCount, setEmployeeProjectCount] = useState([]);
  const [employeeTaskList, setEmployeeTaskList] = useState([]);
  const [employeeTaskCount, setEmployeeTaskCount] = useState([]);
  // const [projectStatus, setProjectStatus] = useState([]);
  const [projectsByAllStatus, setProjectsByAllStatus] = useState({ notStarted: 0, inProgress: 0, completed: 0 });
  const [tasksByAllStatus, setTasksByAllStatus] = useState({ notStarted: 0, inProgress: 0, completed: 0 });
  const [projectListForWorkload, setProjectListForWorkload] = useState([]);
  const [inspectionIssueList, setInspectionIssueList] = useState([]);
  const [employeeIssueList, setEmployeeIssueList] = useState([]);
  const [totalEmployeeIssueCount, setTotalEmployeeIssueCount] = useState(0);

  useEffect(() => {
    if (currentRole === 'hostAdmin') {
      fetchAllBuilderCount();
      fetchAllUserCount();
      fetchAllUsersCountByMonth();
    }
    if (currentRole === 'builder') {
      fetchAllBuilderProjectsCountByMonth();
      if (userId) fetchAllEmployeeCountByBuilder();
      if (userId) fetchAllProjectsByBuilder();
      if (userId) fetchAllProjectsByBuilderForWorkload();
    }
    if (currentRole === 'employee') {
      fetchAllTasksByEmployee();
      fetchTaskStatus();
      // fetchTasksList();
    }
  }, [currentRole, userId, timePeriod, JSON.stringify(customDateRange)]);

  useEffect(() => {
    fetchTaskStatus();
  }, [JSON.stringify(employeeTaskList)]);

  // useEffect(() => {
  //   if (projectListForWorkload?.length > 0) {
  //     setProjectWorkloadLabels(projectListForWorkload.filter(o => o.status === 'onGoing').map(d => d.projectName));
  //     setProjectCompletedData(projectListForWorkload.filter(o => o.status === 'onGoing').map(d => d.completionPercentage));
  //     setProjectOverdueData(projectListForWorkload.filter(o => o.status === 'onGoing').map(d => 100 - d.completionPercentage));
  //   }
  // }, [JSON.stringify(projectListForWorkload)]);

  useEffect(() => {
    let list = [];
    employeeProjectList?.forEach(o => {
      o?.tasks?.forEach(r => {
        let obj = { tasks: o.tasks, employeeProjectId: o._id, ...r, projectAttachmentList: o.projectAttachmentList };
        list.push(obj);
      });
    });
    setEmployeeTaskList(list);
    // setTaskWorkloadLabels(list.filter(o => o.status === 'onGoing').map(d => d.taskName));
    // setTaskCompletedData(list.filter(o => o.status === 'onGoing').map(d => d.completionPercent));
    // setTaskOverdueData(list.filter(o => o.status === 'onGoing').map(d => 100 - d.completionPercent));
    setEmployeeTaskCount(list?.length);
  }, [employeeProjectList]);

  useEffect(() => {
    let list = [];
    inspectionIssueList?.forEach(o => {
      o?.issueList?.forEach(r => {
        let obj = { issueList: o.issueList, InspectionId: o._id, ...r };
        list.push(obj);
      });
    });
    setEmployeeIssueList(list);
    setTotalEmployeeIssueCount(list?.length);
  }, [inspectionIssueList]);

  const fetchAllTasksByEmployee = async () => {
    if (currentRole === 'employee' && userId) {
      const res = await getAllTasksByEmployee(userId, ['low', 'medium', 'high', 'critical']);
      if (res?.data?.status === 200) {
        setEmployeeProjectList(res?.data?.data);
        setEmployeeProjectCount(res?.data?.data?.length);
      }
    }
  };

  const fetchAllProjectsByBuilderForWorkload = async () => {
    if (userId) {
      const res = await getAllProjectsByBuilderAndStatusWithoutPaginate({ builderId: userId, status: ['notStarted', 'onGoing', 'completed'] });
      if (res?.data?.success) {
        setProjectListForWorkload(res?.data?.data);
      }
    }
  };

  const fetchProjectTaskStatus = async (project) => {
    if (userId) {
      const temp = employeeTaskList.filter((o) => o.projectId === project);
      let statusNotStarted = [];
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].status === 'notStarted') {
          statusNotStarted = [...statusNotStarted, temp[i]];
        }
      }
      setProjectsByAllStatus({ ...projectsByAllStatus, notStarted: statusNotStarted?.length });
      let statusOnGoing = [];
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].status === 'onGoing') {
          statusOnGoing = [...statusOnGoing, temp[i]];
        }
      }
      setProjectsByAllStatus({ ...projectsByAllStatus, inProgress: statusOnGoing?.length });
      let statusCompleted = [];
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].status === 'completed') {
          statusCompleted = [...statusCompleted, temp[i]];
        }
      }
      setProjectsByAllStatus({ ...projectsByAllStatus, completed: statusCompleted?.length });

      if (currentRole === 'employee' && userId && project) {
        const result = await getAllInspectionByQuery(project);
        if (result?.data?.success) {
          setInspectionIssueList(result.data?.data);
        }
      }
      const tempObj = employeeTaskList.find(p => p.projectId === project);
      const attachment = tempObj?.projectAttachmentList;
      setAttachmentList(attachment);
    }
  };

  const fetchTaskStatus = async () => {
    if (currentRole === 'employee' && userId) {
      let taskNotStarted = [];
      for (let i = 0; i < employeeTaskList.length; i++) {
        if (employeeTaskList[i].status === 'notStarted') {
          taskNotStarted = [...taskNotStarted, employeeTaskList[i]];
        }
      }
      setTasksByAllStatus({ ...tasksByAllStatus, notStarted: taskNotStarted?.length });
      let taskOnGoing = [];
      for (let i = 0; i < employeeTaskList.length; i++) {
        if (employeeTaskList[i].status === 'onGoing') {
          taskOnGoing = [...taskOnGoing, employeeTaskList[i]];
        }
      }
      setTasksByAllStatus({ ...tasksByAllStatus, inProgress: taskOnGoing?.length });
      let taskCompleted = [];
      for (let i = 0; i < employeeTaskList.length; i++) {
        if (employeeTaskList[i].status === 'completed') {
          taskCompleted = [...taskCompleted, employeeTaskList[i]];
        }
      }
      setTasksByAllStatus({ ...tasksByAllStatus, completed: taskCompleted?.length });
    }
  };

  // const fetchTasksList = async () => {
  //   debugger
  //   const res = await getAllTasksByProjectId();
  //   if (res?.data?.status === 200) {
  //     setEmployeeTaskList(res?.data?.data);
  //     setEmployeeTaskCount(res?.data?.data?.length);
  //   }
  // };

  // useEffect(() => {
  //   if (currentRole === 'hostAdmin') fetchAllUserCount();
  // }, [timePeriod, JSON.stringify(customDateRange)]);

  const fetchAllBuilderCount = async () => {
    const res = await getAllBuilderTotalCount(timePeriod, customDateRange);
    if (res?.data?.success) setTotalBuildersCount(res?.data?.data[0]?.count);
  };

  // const fetchAllEmployeeCount = async () => {
  //   const res = await getAllEmployeeTotalCount();
  //   console.log(res);
  //   debugger
  // };

  const fetchAllUsersCountByMonth = async () => {
    const res = await getAllUsersCountByMonth(new Date().getFullYear());
    if (res?.data?.success) {
      let data = new Array(12).fill(0);
      res.data.data?.forEach((o) => {
        data[o._id] = o.numberOfCount
      });
      setUserChartData(data);
    }
  };

  const fetchAllBuilderProjectsCountByMonth = async () => {
    if (currentRole === 'builder') {
      const res = await getAllBuilderProjectsCountByMonth(new Date().getFullYear(), userId);
      if (res?.data?.success) {
        let data = new Array(12).fill(0);
        res.data.data?.forEach((o) => {
          data[o._id] = o.numberOfCount
        });
        setProjectChartData(data);
      }
    }
  };

  const fetchAllEmployeeCountByBuilder = async () => {
    if (userId) {
      const res = await getAllEmployeeTotalCountByBuilder(userId, timePeriod, customDateRange);
      if (res?.data?.success) {
        let temp = 0;
        res.data?.data?.forEach(o => {
          temp += o.count
        });
        setTotalEmployeeCount(temp);
      }
    }
  };

  const fetchAllProjectsByBuilder = async () => {
    if (userId) {
      const res = await getAllProjectsByBuilderAndStatusWithoutPaginate({ builderId: userId, status: ['notStarted', 'onGoing', 'completed'], lastDay: timePeriod, customStartDate: customDateRange.start, customEndDate: customDateRange.end });
      if (res?.data?.success) {
        setTotalProjectsCount(res?.data?.data?.length);
        setProjectList(res?.data?.data);
      }
    }
  };

  const fetchProjectSummary = async (project) => {
    if (userId && project) {
      const temp = projectList.find((o) => o._id === project);
      const date = temp.startDate;
      setProjectPercentage(temp.completionPercentage);
      // setAttachmentList(temp.attachment);
      setAttachmentList(temp.attachmentList);
      setReceivedAmount(temp.receivedAmount);
      setEstimatedBudget(temp.estimatedBudget);

      const isDateValid = isNaN(date);
      if (isDateValid) setStartDate(date);
      else setStartDate(0);

      let startDate = dayjs(new Date(date)).format('YYYY-MM-DD');
      let dateOfToday = dayjs(new Date()).format('YYYY-MM-DD');

      if (startDate < dateOfToday) {
        let timeDifference = new Date(dateOfToday) - new Date(startDate);
        let daysDifference = Math.abs(timeDifference / (24 * 60 * 60 * 1000));
        setProjectDays(daysDifference);
      }
      if ((startDate > dateOfToday) || (startDate === dateOfToday)) setProjectDays('');

      const res = await getAllInspectionByQuery(project);
      if (res?.data?.success) {
        setInspectionsList(res.data?.data);
        setTotalInspectionsCount(res.data.data?.length);
      }
    }
  };

  const fetchAllUsers = async () => {
    const res = await getAllUser();
    if (res?.data?.success) setTotalUsersCount(res?.data?.data?.length);
  };

  const fetchAllUserCount = async () => {
    const res = await getAllUserCount(timePeriod, customDateRange);
    if (res?.data?.success) setTotalUsersCount(res?.data?.data[0]?.count);
  };

  const handleDropChangeClick = (open) => {
    if (dateRangeOpen) {
      return;
    } else {
      setShowOption(open);
    }
  };

  const projectLineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: `Projects - ${new Date().getFullYear()}`,
        data: projectChartData,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
      },
    ]
  };

  const userLineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: `Users - ${new Date().getFullYear()}`,
        data: userChartData,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
      },
    ]
  };

  const usersChildren = <>
    <h4>Total Users</h4>
    <h1>{totalUsersCount ? totalUsersCount : '0'}</h1>
  </>;

  const buildersChildren = <>
    <h4>Total Builders</h4>
    <h1>{totalBuildersCount ? totalBuildersCount : '0'}</h1>
  </>;

  const employeesChildren = <>
    <h4>Total Employees</h4>
    <h1>{totalEmployeeCount ? totalEmployeeCount : '0'}</h1>
  </>;

  const projectsChildren = <>
    <h4>Total Projects</h4>
    <h1>{totalProjectsCount ? totalProjectsCount : '0'}</h1>
  </>;

  const profitsChildren = <>
    <h4>Total {currentRole === 'hostAdmin' ? 'Revenue' : 'Profit'}</h4>
    <h1>{totalEmpProfitCount ? totalEmpProfitCount : '0'}</h1>
  </>;

  const employeeProjectsChildren = <>
    <h4>Total Projects</h4>
    <h1>{employeeProjectCount ? employeeProjectCount : '0'}</h1>
  </>;
  const employeeTasksChildren = <>
    <div className='taskCardHeight'>
      <Row>
        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }} >
          <h4>Total Tasks</h4>
          <h1>{employeeTaskCount ? employeeTaskCount : '0'}</h1>
        </Col>

        <Col xl={{ span: 2 }} lg={{ span: 2 }} md={{ span: 2 }} sm={{ span: 2 }} xs={{ span: 2 }} >
          <div className='line'><div className='taskVerticalLine'></div></div>
        </Col>

        <Col xl={{ span: 12 }} lg={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }} xs={{ span: 12 }} >
          <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }} >
            <p className='statusPara'>Not Started - {tasksByAllStatus?.notStarted ?? 0}</p>
          </Col>
          <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }} >
            <p className='statusPara'>In Progress - {tasksByAllStatus?.inProgress ?? 0}</p>
          </Col>
          <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }} >
            <p className='statusPara'>Completed - {tasksByAllStatus?.completed ?? 0}</p>
          </Col>
        </Col>

      </Row>
    </div>
  </>;

  const handleTimePeriodChange = (val) => {
    setTimePeriod(val);
  };

  const onRangeChange = (dates, dateStrings) => {
    if (dates) {
      setCustomDateRange({ start: dateStrings[0], end: dateStrings[1] });
      timePeriodForm.setFieldValue('timePeriod', `${dayjs(new Date(dateStrings[0])).format('DD/MM/YYYY')} - ${dayjs(new Date(dateStrings[1])).format('DD/MM/YYYY')}`)
    } else {
      timePeriodForm.setFieldValue('timePeriod', '');
      setTimePeriod('30');
    }
    // setShowOption(!showOption);
    setShowOption(false);
  };

  const plugins = [
    {
      afterDraw: function (chart) {
        console.log(chart);
        if (chart.data.datasets[0].data.length < 1) {
          let ctx = chart.ctx;
          let width = chart.width;
          let height = chart.height;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "30px Arial";
          ctx.fillText("No data to display", width / 2, height / 2);
          ctx.restore();
        }
      },
    },
  ];

  return (
    <div>
      <Row align='top' justify='space-between'>
        <Col xl={5} lg={5} md={5} sm={5} xs={5}><h2>Dashboard</h2></Col>
        <Col xl={5} lg={5} md={5} sm={5} xs={5}>
          <Form
            preserve={false}
            form={timePeriodForm}
            name="addUserForm"
            className="addUserForm"
            // ref={wrapperRef}
            scrollToFirstError
          >
            <h3 className='labelStyle'>Time Period</h3>
            <Selectable
              label=''
              name="timePeriod"
              onDropdownVisibleChange={handleDropChangeClick}
              open={showOption}
              placeholder='By Time'
              required={false}
              // defaultVal={(customDateRange?.start && customDateRange?.end) ? `${dayjs(new Date(customDateRange?.start)).format('DD/MM/YYYY')} - ${dayjs(new Date(customDateRange?.end)).format('DD/MM/YYYY')}` : timePeriod}
              defaultVal={timePeriod}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <Space style={{ padding: '0 8px 4px' }}>
                    <RangePicker
                      onChange={onRangeChange}
                      onOpenChange={(isOpen) => setDateRangeOpen(isOpen)}
                    />
                  </Space>
                </>
              )}
              requiredMsg='Inspector is required'
              firstName='name'
              data={dashboardTimePeriodList}
              width={400}
              showSearch={false}
              handleSelectChange={handleTimePeriodChange}
            />
          </Form>
        </Col>
      </Row>

      <Row align='top' className='headerCardRow'>
        {currentRole === 'hostAdmin' &&
          <>
            <Col xl={5} lg={5} md={5} sm={5} xs={5}>
              <Card
                children={usersChildren}
                className='dashboardCard'
                bordered={false}
              />
            </Col>
            <Col xl={5} lg={5} md={5} sm={5} xs={5}>
              <Card
                children={buildersChildren}
                className='dashboardCard'
                bordered={false}
              />
            </Col>
          </>
        }
        {currentRole === 'builder' &&
          <Col xl={5} lg={5} md={5} sm={5} xs={5}>
            <Card
              children={employeesChildren}
              className='dashboardCard'
              bordered={false}
            />
          </Col>
        }
        {currentRole === 'builder' &&
          <Col xl={5} lg={5} md={5} sm={5} xs={5}>
            <Card
              children={projectsChildren}
              className='dashboardCard smallCardMargin'
              bordered={false}
            />
          </Col>
        }
        {currentRole !== 'employee' &&
          <Col xl={5} lg={5} md={5} sm={5} xs={5}>
            <Card
              children={profitsChildren}
              className='dashboardCard smallCardMargin'
              bordered={false}
            />
          </Col>
        }
        {currentRole === 'employee' &&
          <Col xl={5} lg={5} md={5} sm={5} xs={5}>
            <Card
              children={employeeProjectsChildren}
              className='dashboardCard height'
              bordered={false}
            />
          </Col>
        }
        {currentRole === 'employee' &&
          <Col xl={6} lg={6} md={6} sm={6} xs={6}>
            <Card
              children={employeeTasksChildren}
              className='dashboardCard height'
              bordered={false}
            />
          </Col>
        }
        {currentRole === 'builder' &&
          <>
            <Col xl={4} lg={4} md={4} sm={4} xs={4}></Col>
            <Col xl={5} lg={5} md={5} sm={5} xs={5}>
              <div className='dropDown'>
                <h3 className='labelStyle'>Projects</h3>
                <Selectable
                  name="project"
                  requiredMsg='Project is required'
                  placeholder='All'
                  allowClear={true}
                  firstName='projectName'
                  data={projectList}
                  width={400}
                  showSearch={false}
                  handleSelectChange={(project) => {
                    fetchProjectSummary(project);
                    setProjectShow(!project);
                  }}
                />
              </div>
            </Col>
          </>
        }
        {currentRole === 'employee' &&
          <>
            <Col xl={3} lg={3} md={3} sm={3} xs={3}></Col>
            <Col xl={5} lg={5} md={5} sm={5} xs={5}></Col>
            <Col xl={5} lg={5} md={5} sm={5} xs={5} className=''>
              <h3 className=''>Projects</h3>
              <Selectable
                name="project"
                requiredMsg='Project is required'
                placeholder='All'
                allowClear={true}
                firstName='project.projectName'
                data={employeeProjectList}
                width={400}
                showSearch={false}
                handleSelectChange={(project) => {
                  fetchProjectTaskStatus(project);
                  setProjectShow(!project);
                }}
              />
            </Col>
          </>
        }
      </Row>
      <Row className='dashboardRowSecond' align={currentRole === 'employee' ? 'top' : 'middle'} justify='space-between'>
      {/* <Row className='dashboardRow' align={currentRole === 'employee' ? 'top' : ''} justify='space-between'> */}
        {currentRole === 'builder' &&
          <Col xl={12} lg={12} md={12} sm={12} xs={12}>
            {/* <Card children={<div className={!projectShow ? 'lineChartDiv' : ''}> */}
            <Card children={<div className='lineChartDiv'>
                  <Line
                    data={projectLineChartData}
                    options={{
                      responsive: true,
                      scales: {
                        y: {
                          beginAtZero: true
                        },
                      }
                      // maintainAspectRatio: false
                    }}
                    plugins={plugins}
                    // width={"10%"}
                  />
                </div>}
              className='dashboardCard lineChartDivProject'
              bordered={false}
            />
          </Col>
        }
        {currentRole === 'hostAdmin' &&
          <Col xl={12} lg={12} md={12} sm={12} xs={12}>
            <Card
              children={<div className={!projectShow ? 'lineChartDiv' : ''}>
                  <Line
                    data={userLineChartData}
                    options={{
                      responsive: true,
                      scales: {
                        y: {
                          beginAtZero: true
                        },
                      }
                      // width: 150
                      // maintainAspectRatio: false
                    }}
                  />
                </div>}
              className='dashboardCard'
              bordered={false}
            />
          </Col>
        }
        {currentRole === 'builder' && !projectShow &&
          <Col xl={12} lg={12} md={12} sm={12} xs={12}>
            <ProjectCompletionCards projectDays={projectDays} projectPercentage={projectPercentage} startDate={startDate} />
          </Col>
        }
        {currentRole === 'builder' &&
          <Col xl={12} lg={12} md={12} sm={12} xs={12}>
            <WorkloadChart module='Project' plugins={plugins} workloadData={projectListForWorkload} projectShow={projectShow} />
          </Col>
        }
        {currentRole === 'employee' &&
          <Col xl={12} lg={12} md={12} sm={12} xs={12}>
            <WorkloadChart module='Task' plugins={plugins} workloadData={employeeTaskList} />
          </Col>
        }
        {currentRole === 'builder' &&
          <Col xl={12} lg={12} md={12} sm={12} xs={12}>
            {currentRole === 'builder' &&
              <>
                <div>
                  {/* <Row className='dashboardRowHeight'> */}
                  <Row className={!projectShow ? 'dashboardRowHeight' : 'dashboardRowHeightProject'}>
                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                      <Card
                        // className='dashboardCard customCard complaintCardStyle'
                        className={!projectShow ? 'dashboardCard customCard complaintCardStyle' : 'dashboardCard customCard'}
                        bordered={false}
                      >
                        <ComplaintsCard />
                      </Card>
                    </Col>
                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                      <Card
                        className='dashboardCard customCard cardMargin'
                        bordered={false}
                      >
                        <DefectsCard />
                      </Card>
                    </Col>
                  </Row>
                </div>

                <Row className='dashboardRowMargin'>
                  {!projectShow &&
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                      <Card
                        className='dashboardCard customCard1'
                        bordered={false}
                      >
                        <SiteInspectionCard currentRole={currentRole} totalInspectionsCount={totalInspectionsCount} />
                      </Card>
                    </Col>
                  }
                </Row>
              </>
            }
          </Col>
        }
        {(currentRole === 'builder' || currentRole === 'employee') && !projectShow &&
          <>
            {/* <Row align='middle' justify='space-between'> */}
            {currentRole === 'builder' &&
              <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                <Card className='dashboardCard'>
                  <EstimateBudget receivedAmount={receivedAmount} estimatedBudget={estimatedBudget}/>
                </Card>
              </Col>
            }
            {currentRole === 'employee' &&
              <Col xl={12} lg={12} md={12} sm={12} xs={12} align='middle' justify='space-between'>
                <Card className='dashboardCard taskChartHeight'>
                  <TaskChartData projectsByAllStatus={projectsByAllStatus} />
                </Card>
              </Col>
            }
            {currentRole === 'employee' &&
              <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                <Card
                  className='dashboardCard customCard1'
                  bordered={false}
                >
                  <SiteInspectionCard totalEmployeeIssueCount={totalEmployeeIssueCount} currentRole={currentRole} />
                </Card>
              </Col>
            }
            {/* </Row> */}
          </>
        }
        {!projectShow && currentRole !== 'hostAdmin' &&
          <Col className='attachmentCardCol' xl={6} lg={6} md={6} sm={6} xs={6}>
            <Card className='dashboardCard attachStyle'>
              <AttachmentCard attachmentList={attachmentList} />
            </Card>
          </Col>
        }
      </Row>
    </div>
  )
}

export default Dashboard;